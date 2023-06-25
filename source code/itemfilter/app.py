from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
import pandas as pd
from surprise import Dataset
from surprise import Reader
from surprise import KNNBasic
from sqlalchemy.engine import URL
import numpy as np
from sklearn.neighbors import NearestNeighbors


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

# Hàm tính toán ma trận cosine similarity
def calculate_cosine_similarity(ratings):
    num_items = ratings.shape[1]
    item_correlation = np.corrcoef(ratings, rowvar=False)
    return item_correlation

# Hàm tính toán ma trận rating dự đoán
def item_collaborative_filtering(ratings, item_correlation, k=5):
    num_users = ratings.shape[0]
    num_items = ratings.shape[1]
    predicted_ratings = np.zeros((num_users, num_items))

    # Tìm k hàng xóm gần nhất cho mỗi sản phẩm
    nbrs = NearestNeighbors(n_neighbors=k, metric='cosine').fit(item_correlation)
    
    for user in range(num_users):
        for item in range(num_items):
            if ratings[user, item] == 0:
                # Tìm k hàng xóm gần nhất của sản phẩm hiện tại
                indices = nbrs.kneighbors([item_correlation[item]], return_distance=False)[0]
                similarity_scores = item_correlation[item, indices].flatten()
                rated_items = ratings[user, indices].flatten()
                prediction = np.dot(similarity_scores, rated_items) / np.sum(np.abs(similarity_scores))
                predicted_ratings[user, item] = prediction

    return predicted_ratings


# API endpoint để lấy ma trận cosine similarity và ma trận rating dự đoán
@app.route('/api/ratings', methods=['POST'])

# API endpoint để gợi ý bộ phim cho người dùng
@app.route('/recommendations', methods=['POST'])
def get_predicted_ratings():
       # Thiết lập kết nối SQL
    connection = get_sql_connection()
    # Nhận ma trận ratings từ yêu cầu POST
    ratings = np.array(request.json['ratings'])

    # Tính toán ma trận cosine similarity
    item_correlation = calculate_cosine_similarity(ratings)

    # Áp dụng thuật toán Item Collaborative Filtering với nearest neighbors là k=5
    predicted_ratings = item_collaborative_filtering(ratings, item_correlation, k=5)

    # Đóng kết nối SQL
    connection.close()
    # Trả về ma trận cosine similarity và ma trận rating dự đoán dưới dạng JSON
    return jsonify({'item_correlation': item_correlation.tolist(), 'predicted_ratings': predicted_ratings.tolist()})

if __name__ == '__main__':
    app.run()