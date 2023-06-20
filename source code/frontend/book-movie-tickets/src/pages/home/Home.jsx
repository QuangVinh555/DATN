import React from 'react';
import "./Home.scss";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Photo from "../../assets/image/noAvatar.png";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getIdUserByLoginGGApi } from '../../redux/user/UserApi';
import MovieBanner from "../../assets/image/MovieBanner.jpg"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const RECOMMENDATIONS = process.env.REACT_APP_PUBLIC_API_RECOMMENDATIONS;
  const PK = process.env.REACT_APP_PUBLIC_API;
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token)
  const tokenGG = useSelector(state => state.googleLogin.tokenGG)
  const isAuth = useSelector(state => state.auth.isAuth)

   // lấy ra id user khi đăng nhập bằng gg để tạo vé
   const userLoginGG = useSelector(state => state.user.user);
   useEffect(() =>{
     if(tokenGG || token){
       const getIdUserByLoginGG = async () => {
         await getIdUserByLoginGGApi(token?.email || token?.Email, dispatch);
       }
       getIdUserByLoginGG();
     }
   },[tokenGG, token])

   // =============== Gợi ý phim ==============
   const [recomments, setRecomments] = useState();
   useEffect(() => {
      const recomment = {
        user_id: userLoginGG?.data?.id || parseInt(token?.Id),
        n_recommendations: 5
      };
      console.log(recomment)
      const suggest = async () => {
        const res = await axios.post(`${RECOMMENDATIONS}/recommendations`, recomment);
        if(res.data){
          setRecomments(res.data.recommendations);
        }
      }
      suggest();
   }, [isAuth, tokenGG, token])
 
  // làm hiệu ứng slide trược
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(3);

  // khi nhấn vào mũi tên phải
  const handleItemRight = () => {
    if (endIndex + 1 < recomments?.length) {
      setStartIndex(startIndex + 1);
      setEndIndex(endIndex + 1);
    }
  };

  // khi nhấn vào mũi tên trái
  const handleItemLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
      setEndIndex(endIndex - 1);
    }
  };


  // chuyển trang
  const navigate = useNavigate();
  const handleMoveBuyTicket = () => {
    navigate("/muave")
  }

  const handleMoveMovieDetail = (movieDetail) => {
    console.log(movieDetail);
    navigate("/muavetheophim", { state: { movie: {data: movieDetail} } });
  }

  return (
    <div className="home">
      {
        (token || tokenGG)
        ? (
            <div className="buyticket-movie">
              <div className="buyticket-movie-2">
                <div className="buyticket-movie-title">
                  <h1>Gợi ý cho bạn</h1>
                </div>
                <div className="buyticket-movie-lists">
                  {startIndex > 0 && (
                    <KeyboardArrowLeftIcon
                      onClick={() => handleItemLeft()}
                      className="buyticket-movie-left"
                    />
                  )}
                  {recomments?.slice(startIndex, endIndex + 1).map((movie, index) => {
                    return (
                      <div
                        onClick={() => handleMoveMovieDetail(movie)}
                        key={index}
                        className={`buyticket-movie-item`}
                      >
                        <div className="buyticket-movie-img">
                          <img src={movie?.main_slide || Photo} alt="" />
                          <p>Mua vé</p>
                        </div>
                        <div className="buyticket-movie-name">
                          <h2>{movie?.name}</h2>
                          <h3>{movie?.category}</h3>
                          <p className="buyticket-movie-star">
                            <ThumbUpOffAltIcon />
                            {Math.round(movie?.total_percent) + '%'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                   {startIndex > 0 && (
                  <KeyboardArrowRightIcon
                    onClick={() => handleItemRight()}
                    className="buyticket-movie-right"
                  />
                   )}
                </div>
              </div>
            </div>
          )
        : (
          <div className="home-img">
            <img src={MovieBanner} alt="" />
            <div className="home-img-info">
              <h1>Đặt mua vé xem phim Moveek</h1>
              <p>
                <CheckCircleIcon />
                Mua vé Online, trải nghiệm phim hay
              </p>
              <p>
                <CheckCircleIcon />
                Đặt vé an toàn trên Moveek
              </p>
              <p>
                <CheckCircleIcon />
                Tha hồ chọn chỗ ngồi, mua bắp nước tiện lợi.
              </p>
              <p>
                <CheckCircleIcon />
                Lịch sử đặt vé được lưu lại ngay
              </p>
              <button onClick={() => handleMoveBuyTicket()}>Đặt vé ngay</button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Home