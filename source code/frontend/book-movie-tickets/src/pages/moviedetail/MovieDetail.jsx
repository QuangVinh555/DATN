import React, { useEffect } from 'react';
import "./MovieDetail.scss";
import { useLocation, useNavigate } from 'react-router-dom'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ContainerSlide from "../../assets/image/Container.jpg"
import { useState } from 'react';
import CancelIcon from "@mui/icons-material/Cancel";
import YouTube from 'react-youtube';
import { addDays, startOfDay } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import All from "../../assets/image/all.png";
import NoAvatar from "../../assets/image/noAvatar.png";
import { getAllSearchLocationApi } from '../../redux/location/LocationApi';
import { getAllCinemaTypesApi } from '../../redux/cinemaType/CinemaTypeApi';
import { getAllCinemaNamesApi, getByMovieIdAllApi, getByMovieIdApi } from '../../redux/cinemaName/CinemaNameApi';
import { getAllShowTimeByMovieId3Api, getAllShowTimeByMovieId4Api } from '../../redux/showTime/ShowTimeApi';
import { getAllHourTimeByShowTimeIdApi, getAllHourTimesApi } from '../../redux/hourTime/HourTimeApi';
import { ToastContainer, toast } from 'react-toastify';
import { updateAuth } from '../../redux/auth/AuthSlice';
import { createBookTicketApi } from '../../redux/bookTicket/BookTicketApi';
import ChairStatus from '../../components/chairStatus/ChairStatus';
import { getIdUserByLoginGGApi } from '../../redux/user/UserApi';
import { createCommentApi, getAllCommentsByMovieIdApi } from '../../redux/comment/CommentApi';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import axios from 'axios';
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { getMovieSmallApi } from '../../redux/movie/MovieApi';


const MovieDetail = () => {
    const RECOMMENDATIONS = process.env.REACT_APP_PUBLIC_API_RECOMMENDATIONS;
    const PK = process.env.REACT_APP_PUBLIC_API;
    const dispatch = useDispatch();
    const location = useLocation();
    const moviedetail = location.state.movie.data;
    const cinemaTypes = useSelector((state) => state.cinemaType.cinemaTypes);
    const locations = useSelector((state) => state.location.listSearch);
    const showTimes = useSelector((state) => state.showTime.showTimes);
    const hourTimes = useSelector((state) => state.hourTime.hourTimeByShowTimes);
    const token = useSelector(state => state.auth.token)
    const tokenGG = useSelector(state => state.googleLogin.tokenGG)
    const comments = useSelector(state => state.comment.comments)
    const comment = useSelector(state => state.comment.comment)
    const movies = useSelector((state) => state.movie.movies);

   // get id movie 
   const [movie, setMovie] = useState(moviedetail);
   const [suggestions, setSuggestions] = useState(0);
   useEffect(() => {
     const getByIdMovie = async () => {
       const res = await axios.get(`${PK}/movie/${suggestions?.data?.id || moviedetail.id}`);
       if(res.data){
         setMovie(res.data.data);
       }
     }
     getByIdMovie();
   }, [moviedetail, suggestions])

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


    // format yyyy-mm--dd -> dd/mm/yy
    function formatDate(input) {
        var datePart = input.match(/\d+/g),
        year = datePart[0].substring(0), // get only two digits
        month = datePart[1],
        day = datePart[2];

        return day + "/" + month + "/" + year;
    }
    formatDate("2010/01/18"); // "18/01/10"

    // open trailer mocie
  const [openVideoTrailler, setOpenVideoTrailler] = useState(false);
  const [videoId, setVideoId] = useState();
  
  const handlePlayVideoTrailler = (item) => {
    setOpenVideoTrailler(true);
    if(item){
      const urlParams = new URLSearchParams(new URL(item).search);
      const videoId = urlParams.get('v');
      setVideoId(videoId);
    }else{
      return null;
    }
  }

   // lịch tự động
   const [calendar, setCalendar] = useState([]);
   useEffect(() => {
     updateCalendar(); // Cập nhật lịch ban đầu
 
     const interval = setInterval(() => {
       updateCalendar(); // Cập nhật lịch sau mỗi ngày (24 giờ)
     }, 24 * 60 * 60 * 1000);
 
     return () => {
       clearInterval(interval); // Xóa interval khi component bị hủy
     };
   }, []);
 
   const updateCalendar = () => {
     const newCalendar = [];
     const currentDate = startOfDay(new Date()); // Lấy ngày hiện tại, bỏ qua giờ phút giây
 
     for (let i = 0; i < 7; i++) {
       const day = addDays(currentDate, i);
       newCalendar.push(day);
     }
 
     setCalendar(newCalendar); // Cập nhật lịch mới
   };

    // lấy ra ngày đã chọn
  const [dateShowTime, setDateShowTime] = useState();
  const handleShowTimeDate = (item) => {
    const date = new Date(item);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setDateShowTime(formattedDate); // Kết quả: "2023-05-25"

  };

  // kiểm tra nếu click ngày nào thì ngày đó được active
  // khi click vào lịch thì lịch đó đổi màu
  useEffect(() => {
    var listElement = document.querySelectorAll(".showTime-border");
    listElement.forEach((item) => {
      if (
        item.textContent.substring(0, 2) ===
        dateShowTime?.split(" ")[0].split("-")[2]
      ) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }, [dateShowTime]);

  // ============Get all==============

  const [dataLocation, setDataLocation] = useState();
  const [dataCinemaType, setDataCinemaType] = useState();
  const [flag, setFlag] = useState(0); 
  // 0: load ShowTimes by locationId and movieId and date(mặc định)
  // 1: load ShowTimes by locationId and cinemaTypeId and movieId and date

  // get all location when open showTime
  useEffect(() => {
    const getAllLocations = async () => {
      await getAllSearchLocationApi(dispatch);
    };
    getAllLocations();
  }, []);

  // get all cinema type when open showTime
  useEffect(() => {
    const getAllCinemaTypes = async () => {
      await getAllCinemaTypesApi(dispatch);
    };
    getAllCinemaTypes();
  }, []);

  const handleClickLocation = (e) => {
    setDataLocation(parseInt(e.target.value));
    setFlag(0)
    setDateShowTime(location.state.dateNowMovie)
    const cinemaTypeElements = document.querySelectorAll(".cinemaroom-type");
    cinemaTypeElements.forEach(item => {
      if("Tất cả" === item.outerText){
        const imgElement = item.querySelector("img");
        if (imgElement) {
          imgElement.classList.add("active"); // Thêm lớp "active" vào thẻ img con
        }
      }else{
        const imgElement = item.querySelector("img");
        if (imgElement) {
          imgElement.classList.remove("active");
        }
      }
    })
  }

    // get all showTime by locationId and movieId and date
    useEffect(() => {
      if(flag === 0){
        const getAllShowTimeByMovieId3 = async() => {
          await getAllShowTimeByMovieId3Api(movie.id, dataLocation || 1, dateShowTime || location.state.dateNowMovie, dispatch);
        }
        getAllShowTimeByMovieId3();
      }
    }, [flag, dataLocation, dateShowTime]);

    // get all cinema name by locationId and movieId and date and cinemaTypeId
     useEffect(() => {
      if(flag !== 0){
        const getAllShowTimeByMovieId4 = async () => {
          await getAllShowTimeByMovieId4Api(movie.id, dataLocation || 1, dateShowTime || location.state.dateNowMovie, dataCinemaType?.id, dispatch);
        }
        getAllShowTimeByMovieId4();
      }
    }, [flag, dataLocation, dateShowTime])
    
    // thay đổi active khi click cinemaType
    const handleClickCinemaType = (cinemaType) => {
      if(cinemaType.name === "Tất cả"){
        setFlag(0)
      }else{
        setDataCinemaType(cinemaType);
        setFlag(Math.random())
      }
      setDataCinemaType(cinemaType);
      const cinemaTypeElements = document.querySelectorAll(".cinemaroom-type");
      cinemaTypeElements.forEach(item => {
        if(cinemaType?.name === item.outerText){
          const imgElement = item.querySelector("img");
          if (imgElement) {
            imgElement.classList.add("active"); // Thêm lớp "active" vào thẻ img con
          }
        }else{
          const imgElement = item.querySelector("img");
          if (imgElement) {
            imgElement.classList.remove("active");
          }
        }
      })
    }

    // mới vào trang thì hiện active loại rạp ở tất cả
    useEffect(() => {
      const cinemaTypeElements = document.querySelectorAll(".cinemaroom-type");
      cinemaTypeElements.forEach(item => {
        if("Tất cả" === item.outerText){
          const imgElement = item.querySelector("img");
          if (imgElement) {
            imgElement.classList.add("active"); // Thêm lớp "active" vào thẻ img con
          }
        }else{
          const imgElement = item.querySelector("img");
          if (imgElement) {
            imgElement.classList.remove("active");
          }
        }
      })

    },[])

    const [isHourTime, setIsHourTime] = useState(false);
    // get hourTime by ShowTimeId
    const handleDisplayHourTime = async (showTime) => {
      await getAllHourTimeByShowTimeIdApi(showTime.id, dispatch);
      setIsHourTime(true);
    }

  const [openChairStatus, setOpenChairStatus] = useState(false);
  const [dataHourTime, setDataHourTime] = useState();
  const [dataShowTime, setDataShowTime] = useState();
  
  const handleGetChairByHourTime = async (_hourTime, _showTime) => {
      setDataHourTime(_hourTime);
      setDataShowTime(_showTime);
    // kiểm tra đăng nhập hay chưa, để tạo vé
    if(token === ""){
      dispatch(updateAuth(1));
      toast.info(
        "Bạn hãy đăng nhập để chọn ghế !",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );  
    }else{
  
      // tạo vé 
      const newBookTicket = {
        UserId: parseInt(token?.Id) || userLoginGG?.data?.id,
        ShowTimeId: _showTime?.id,
        HourTimeId: _hourTime?.id
      }
      await createBookTicketApi(newBookTicket, dispatch);
      setOpenChairStatus(true);
      console.log(newBookTicket)
    }  
  }

  // ============ Bình luận ============
  useEffect(() => {
    const getAllCommentsByMovieId = async() => {
      await getAllCommentsByMovieIdApi(movie.id, dispatch);
    }
    getAllCommentsByMovieId();
  }, [movie, comment]);

  // open form raiting
  const [isOpenRaiting, setOpenRaiting] = useState(false);
  const handleOpenFormRaiting = () => {
    setOpenRaiting(true);
  }

  // tránh sự kiện nỗi bọt từ thẻ cha khi cancel dialog add new user
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  // 1 list ngôi sao
  const listStars = [
    {
      name: 'star',
      value: 1,
      icon: <StarOutlineIcon />
    },
    {
      name: 'star',
      value: 2,
      icon: <StarOutlineIcon />
    },
    {
      name: 'star',
      value: 3,
      icon: <StarOutlineIcon />
    },
    {
      name: 'star',
      value: 4,
      icon: <StarOutlineIcon />
    },
    {
      name: 'star',
      value: 5,
      icon: <StarOutlineIcon />
    }
  ]

  const [isStarActive, setStarActive] = useState(false);
  const [dataStar, setDataStar] = useState();
  const handleSelectedStar = (star,index) =>{
    setDataStar(star);
    const starElements = document.querySelectorAll(".star");
    starElements.forEach((item, i) => {
      if(i <= index){     
        item.classList.add("active");
        setStarActive(!isStarActive);      
      }else{
        item.classList.remove("active");
        const icons = document.querySelectorAll(".star svg");
        icons.forEach(svg => {
          svg.classList.remove("active");
        })
      }
    })    
  }

  useEffect(() => {
    const icons = document.querySelectorAll(".active svg");
      icons.forEach(icon =>{
        icon.classList.add("active");
      })
  }, [isStarActive])

  const [contentRaiting, setContentRaiting] = useState("");
  const handlePostRaiting = async () => {
    if(dataStar === undefined || contentRaiting === ""){
      toast.info(
        "Bạn hãy nhập đầy đủ!",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );    
    }else{
      const newRaiting = {
        UserId: parseInt(token?.Id) || userLoginGG?.data?.id,
        MovieId: movie.id,
        Content: contentRaiting,
        CountStars: dataStar.value
      };
      console.log(newRaiting);
      await createCommentApi(newRaiting, dispatch);
      toast.success(
        "Cảm ơn bạn đã để lại đánh giá! !",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );    
      setOpenRaiting(false)
    }
  }

  // =============== List phim đang chiếu ==============
  // Tạo một đối tượng Date mới
  var date = new Date();
  // Lấy thông tin về ngày, tháng, năm
  var day = date.getDate();
  var month = date.getMonth() + 1; // Lưu ý: tháng trong JavaScript bắt đầu từ 0
  var year = date.getFullYear();

  // get all movie by phim đang chiếu
  useEffect(() => {
    const getAllMoviesByDateSmall = async () => {
      await getMovieSmallApi(year + "-" + month + "-" + day, dispatch);
    };
    getAllMoviesByDateSmall();
  }, []);
  
  return (
    <div className="moviedetail">
        {openVideoTrailler && (
          <div className="movie-trailer">
            <CancelIcon onClick={() => setOpenVideoTrailler(false)} />
            <YouTube
              videoId={videoId}
              opts={{
                height: '360',
                width: '640',
                playerVars: {
                  autoplay: 1,
                  controls: 1,
                },
              }}
            />
          </div>
        )}
      <div className="moviedetail-header">
            <img className="moviedetail-header-containerSlide" src={movie.containerSlide || ContainerSlide} alt="" />
            <div className="moviedetail-header-content">
                <div className="moviedetail-header-mainSlide">
                    <img src={movie.mainSlide} alt="" />
                    <PlayCircleOutlineIcon onClick={() => handlePlayVideoTrailler(movie.linkTrailer || "")} />
                </div>
                <div className="moviedetail-header-info">
                    <h1>{movie.name}</h1>
                    <h3>{movie.description}</h3>
                    <p>{movie.content}.</p>
                    <div className="moviedetail-header-list">
                        <div className="moviedetail-header-date">
                            <p>Khởi chiếu</p>
                            <p>{formatDate(movie?.premiereDate?.split("T")[0] || movie?.premiere_date?.split("T")[0]) }</p>
                        </div>
                        <div className="moviedetail-header-time">
                            <p>Thời lượng</p>
                            <p>{movie.movieDuration} phút</p>
                        </div>
                        <div className="moviedetail-header-limit">
                            <p>Giới hạn tuổi</p>
                            <p>{movie.stamp}</p>
                        </div>
                    </div>
                    <div className="moviedetail-header-footer">
                        <div className="moviedetail-header-category">
                            <p>Thể loại</p>
                            <p>{movie.category}</p>
                        </div>
                    </div>
                </div>
            </div>
      </div>
      <div className="moviedetail-container">
        <div className="moviedetail-left">
          <div className="moviedetail-left-title">
            <h1>Lịch chiếu {movie.name}</h1>
            <select         
              onChange={(e) => handleClickLocation(e)}
            >
              <option value="Default" selected disabled hidden>
                TP.Hồ Chí Minh
              </option>
              {locations.map((item) => (
                <option 
                  key={item.data?.id} 
                  value={item.data?.id}
                  onChange={() => handleClickLocation(item)}
                >
                  {item.data.province}
                </option>
              ))}
            </select>
          </div>
          <div className="moviedetail-left-content">
            <div className="showTime-calendar">
              {calendar.map((item, index) => (
                      <div
                        key={index}
                        className="showTime-border"
                        onClick={() => handleShowTimeDate(item)}
                      >
                        <h1>{item.toString().split(" ")[2]}</h1>
                        <h3>{item.toString().split(" ")[0]}</h3>
                      </div>
              ))}      
            </div>
            <div className="cinemaroom-types">
                <div className="cinemaroom-type" 
                  onClick={() => handleClickCinemaType({name: "Tất cả"})}
                >
                  <img src={All} alt="" />
                  <p>Tất cả</p>
                </div>
                {cinemaTypes.map((item) => (
                  <div
                    key={item.data.id}
                    className="cinemaroom-type"
                    onClick={() => handleClickCinemaType(item.data)}
                  >
                    <img src={item.data.logo || NoAvatar} alt="" />
                    <p>{item.data.name}</p>
                  </div>
                ))}
            </div>
            <div className="cinemaroom-left-infos">
              {
                showTimes.length === 0 ? 
                <>
                <h1 style={{textAlign: 'center', marginTop: '20px'}}>Úi, phim này không tìm thấy trong rạp này!</h1>
                <h2 style={{textAlign: 'center', fontWeight: '400'}}>Bạn hãy tìm rạp khác nhé!</h2>
                </> :
                showTimes.map((item) => (
                    <div
                      key={item.data?.id}
                      className="cinemaroom-left-info"
                      onClick={() => handleDisplayHourTime(item.data)}
                    >
                     <div className="moviedetail-left-info">
                        <img src={item.data.logo || NoAvatar} alt="" />
                        <div className="cinemaroom-left-title">
                          <p className="cinemaroom-left-addclass">{item.data.cinemaName}</p>
                          <p>{item.data.locationDetail}</p>
                        </div>
                     </div>
                     <div className="moviedetail-left-hourtime">
                      {
                        isHourTime && 
                        hourTimes?.data?.map(hourTime => {
                          if(hourTime.showTimeId === item.data.id)
                          return (
                              <button 
                                key={hourTime.id}
                                onClick={() => handleGetChairByHourTime(hourTime, item.data)}
                              >
                                {hourTime.time} ~ {hourTime.endTime}
                              </button>
                              )
                          })                      
                      }
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="moviedetail-left-comment">
            <h1>Bình luận từ người xem</h1>
            <div className="moviedetail-left-comment-title">
              <h3>Tất cả ({comments.length})</h3>
            </div>
            {
              comments.map(comment => (
              <div className="moviedetail-left-comment-user">
                <div className="moviedetail-left-comment-avatar">
                  <img src={ comment.data.avatar || NoAvatar} alt="" />
                </div>
                <div className="moviedetail-left-comment-info">
                  <div className="moviedetail-left-comment-info-name">
                    <h2>{comment.data.fullName}</h2>
                    <span>{comment.data.createAt}</span>
                  </div>
                  <div className="moviedetail-left-comment-info-ticketState">
                    <p>Đã mua vé trên Moveek</p>
                  </div>
                  <div className="moviedetail-left-comment-info-content">
                    <p>{comment.data.content}</p>
                  </div>
                </div>
              </div>
              ))
            }           
          </div>
        </div>
        <div className="moviedetail-right">
            <div className="moviedetail-right-raiting">
              <h1>Đánh giá từ người xem</h1>
              <div className="moviedetail-right-raiting-info">
                {
                  movie.totalPercent >= 70 && (
                    <div className="moviedetail-right-raiting-state">
                      <CelebrationIcon />
                      <h1>Cực phẩm!</h1>
                    </div>
                  ) ||
                  (movie.totalPercent >= 50 && movie.totalPercent < 70) && (
                    <div className="moviedetail-right-raiting-state">
                      <CelebrationIcon />
                      <h1>Đáng xem!</h1>
                    </div>
                  ) ||
                  (movie.totalPercent < 50) && (
                    <div className="moviedetail-right-raiting-state">
                      <CelebrationIcon />
                      <h1>Chưa được xếp hạng!</h1>
                    </div>
                  )
                }
                <div className="moviedetail-right-raiting-statistica">
                  <div className="moviedetail-right-raiting-statistica-medium">
                    <h3>{movie.totalPercent ? Math.round(movie.totalPercent) + '%' : "Chưa có điểm"}</h3>
                    <p>Điểm trung bình</p>
                  </div>
                  <div className="moviedetail-right-raiting-statistica-evaluate">
                    <h3>{comments.length}</h3>
                    <p>Đánh giá</p>
                  </div>
                </div>
                <div className="moviedetail-right-raiting-comment">
                  <button onClick={() => handleOpenFormRaiting()}>Đánh giá</button>
                </div>
              </div>
            </div>
            <div className="moviedetail-right-suggest">
              <h1>Phim đang chiếu</h1>
              <div className="moviedetail-right-suggest-list">
                {
                  movies?.map(movieSuggest => {

                  if(movieSuggest.data.id !== movie.id){
                    return (
                      <div className="moviedetail-right-suggest-item" onClick={() => setSuggestions(movieSuggest)}>
                        <img src={movieSuggest.data.mainSlide} alt="" />
                        <div className="moviedetail-right-suggest-info">
                          <p
                            className={`moviedetail-right-suggest-info-stamp 
                            ${movieSuggest.data.stamp === "P" && 'green' || 
                              movieSuggest.data.stamp === "13+" && 'yellow' || 
                              movieSuggest.data.stamp === "16+" && 'orange' || 
                              movieSuggest.data.stamp === "18+" && 'red'}  `}
                          >{movieSuggest.data.stamp}</p>
                          <h2>{movieSuggest.data.name}</h2>
                          <p>{movieSuggest.data.category}</p>
                          <p className="moviedetail-right-suggest-info-star">
                            <ThumbUpOffAltIcon />
                            {Math.round((movieSuggest?.data.totalPercent)) + '%'}
                          </p>
                        </div>
                      </div>
                    )
                  }                 
                  })
                }
              </div>
            </div>
        </div>
      </div>

      {
        openChairStatus && (
          <ChairStatus 
            hourTime = {dataHourTime} 
            openChairStatus = {openChairStatus}
            setOpenChairStatus = {setOpenChairStatus} 
            showTime = {dataShowTime}
            dateShowTime = {dateShowTime}
            userLoginGG = {userLoginGG.data}
          />
        )
      }

      {
        isOpenRaiting && (
          <div className="raiting" onClick = {() => setOpenRaiting(false)}>
            <div className="raiting-2" onClick={(e) => handlePropagation(e)}>
              <div className="raiting-header">
                <h1>Đánh giá Doraemon: Nobita Và Vùng Đất Lý Tưởng Trên Bầu Trời</h1>
              </div>
              <div className="raiting-container">
                <div className="raiting-container-movie">
                  <img src={movie.mainSlide} alt="" />
                </div>
                <div className="raiting-container-raiting">
                  <div className="raiting-container-star">
                    {
                      listStars.map((star,index) => (
                        <p className="star" key={index} onClick={() =>handleSelectedStar(star,index)}>
                          {star.icon}
                        </p>
                      ))
                    }
                  </div>
                  <div className="raiting-container-comment">
                    <h2>Review của bạn</h2>
                    <textarea 
                      onChange={(e) => setContentRaiting(e.target.value)}
                      placeholder="Đánh giá của bạn về Doraemon: Nobita Và Vùng Đất Lý Tưởng Trên Bầu Trời"
                    >                
                    </textarea>
                  </div>
                  <div className="raiting-container-footer">
                    <button onClick={() => handlePostRaiting()}>Đăng</button>
                    <button onClick = {() => setOpenRaiting(false)}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <ToastContainer />

    </div>
  )
}

export default MovieDetail