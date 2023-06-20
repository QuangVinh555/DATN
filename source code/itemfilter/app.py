from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
import pandas as pd
from surprise import Dataset
from surprise import Reader
from surprise import KNNBasic
from sqlalchemy.engine import URL

app = Flask(__name__)
CORS(app)


# Thiết lập kết nối SQL Server
def get_sql_connection():
    conn_str = (
        "DRIVER={SQL Server};"
        "SERVER=VOQUANGVINH\SQLEXPRESS01;"
        "DATABASE=BookMovieTickets;"
        "UID=sa;"
        "PWD=Abc12345@;"
    )
    connection = pyodbc.connect(conn_str)
    return connection

# Load dữ liệu và xây dựng mô hình khi khởi động ứng dụng
# @app.before_first_request
def setup():
    # Thiết lập kết nối SQL
    connection = get_sql_connection()

    # Truy vấn dữ liệu từ SQL và lưu vào DataFrame
    query = "SELECT user_id, movie_id, count_stars FROM Comments"
    df = pd.read_sql_query(query, connection)

    # Sử dụng thư viện Surprise để đọc dữ liệu
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['user_id', 'movie_id', 'count_stars']], reader)

    # Xây dựng mô hình Item-item Collaborative Filtering
    sim_options = {'name': 'cosine', 'user_based': False}
    model = KNNBasic(sim_options=sim_options)
    trainset = data.build_full_trainset()
    model.fit(trainset)

    # Lưu trữ mô hình vào biến global
    global item_item_model
    item_item_model = model

    # Đóng kết nối SQL
    connection.close()

setup()

# API endpoint để gợi ý bộ phim cho người dùng
@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    user_id = request.json['user_id']
    n_recommendations = request.json['n_recommendations']
    # Thiết lập kết nối SQL
    connection = get_sql_connection()

    # Truy vấn dữ liệu từ SQL và lưu vào DataFrame
    query = "SELECT user_id, movie_id, count_stars FROM Comments"
    df = pd.read_sql_query(query, connection)

    # Gợi ý bộ phim cho người dùng
    user_movies = df[df['user_id'] == user_id]['movie_id']
    unseen_movies = df[~df['movie_id'].isin(user_movies)]['movie_id']
    predictions = [item_item_model.predict(user_id, movie_id) for movie_id in unseen_movies]
    top_predictions = sorted(predictions, key=lambda x: x.est, reverse=True)[:n_recommendations]
    recommended_movie_ids = [prediction.iid for prediction in top_predictions]

    # Truy vấn dữ liệu từ SQL để lấy thông tin về các bộ phim được gợi ý
    recommended_movies_query = f"SELECT Movie.id, Movie.name, Movie.description, Movie.content, Movie.stamp, Movie.nation, Movie.premiere_year, Movie.movie_duration, Movie.premiere_date, Movie.author, Movie.link_trailer ,Movie.category, Movie.total_percent, Banner.main_slide, Banner.container_slide FROM Movie  INNER JOIN Banner ON Banner.movie_id = Movie.id WHERE Movie.id IN {tuple(recommended_movie_ids)}"
    # recommended_movies_query = f"SELECT id, name FROM movie WHERE id IN ({', '.join(str(i) for i in recommended_movie_ids)})"

    recommended_movies = pd.read_sql_query(recommended_movies_query, connection)

    # Trả về kết quả dưới dạng JSON
    result = {'recommendations': recommended_movies.to_dict(orient='records')}

    # Đóng kết nối SQL
    connection.close()

    return jsonify(result)

if __name__ == '__main__':
    app.run()
