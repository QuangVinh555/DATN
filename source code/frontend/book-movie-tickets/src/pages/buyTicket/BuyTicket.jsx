import React from "react";
import "./BuyTicket.scss";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovieSmallApi } from "../../redux/movie/MovieApi";
import Photo from "../../assets/image/noAvatar.png";
import { getAllSearchLocationApi } from "../../redux/location/LocationApi";
import {
  getAllCinemaNamesApi,
  getAllCinemaNamesByCinemaTypeIdApi,
  getAllCinemaNamesByLocationIdAndCinemaTypeIdApi,
  getAllCinemaNamesByLocationIdApi,
} from "../../redux/cinemaName/CinemaNameApi";
import { getAllCinemaTypesApi } from "../../redux/cinemaType/CinemaTypeApi";
import AddBoxIcon from "@mui/icons-material/AddBox";
import NoAvatar from "../../assets/image/noAvatar.png";
import All from "../../assets/image/all.png";
import SearchIcon from "@mui/icons-material/Search";
import { addDays, startOfDay } from "date-fns";
import { getAllShowTimeByCinemaNameIdAndDateApi } from "../../redux/showTime/ShowTimeApi";
import {
  getAllHourTimeByShowTimeIdApi,
  getAllHourTimesApi,
} from "../../redux/hourTime/HourTimeApi";
import ChairStatus from "../../components/chairStatus/ChairStatus";
import { createBookTicketApi } from "../../redux/bookTicket/BookTicketApi";
import { updateAuth } from "../../redux/auth/AuthSlice";
import { ToastContainer, toast } from "react-toastify";
import { getIdUserByLoginGGApi } from "../../redux/user/UserApi";
import { useNavigate } from "react-router-dom";


const BuyTicket = () => {
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.cinemaName.pending);
  const locations = useSelector((state) => state.location.listSearch);
  const cinemaTypes = useSelector((state) => state.cinemaType.cinemaTypes);
  const cinemaNames = useSelector((state) => state.cinemaName.listSearch);
  const cinemaNamesByConditions = useSelector(
    (state) => state.cinemaName.cinemaNames
  );
  const showTimes = useSelector((state) => state.showTime.showTimes);
  const movies = useSelector((state) => state.movie.movies);
  const hourTimes = useSelector((state) => state.hourTime.hourTimes);
  const token = useSelector(state => state.auth.token)
  const tokenGG = useSelector(state => state.googleLogin.tokenGG)

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

  // làm hiệu ứng slide trược
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(3);

  // khi nhấn vào mũi tên phải
  const handleItemRight = () => {
    if (endIndex + 1 < movies.length) {
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

  // ============
  // ============Get all==============
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

  // get all cinema name when open ShowTime
  useEffect(() => {
    const getAllCinemaNames = async () => {
      await getAllCinemaNamesApi(dispatch);
    };
    getAllCinemaNames();
  }, []);

  // ===== Kiểm tra điều kiện seach=====
  const [flag, setFlag] = useState(0);
  // flag = 1: Tìm kiếm theo location
  // flag = 2: Tìm kiếm theo Cinema type
  // flag = 3: Tìm kiếm cả 2 cái trên

  // ======= search by location ========
  const [searchByLocationId, setSearchByLocationId] = useState();
  const handleChangeSelectLocation = (e) => {
    if (flag === 2) {
      setFlag(3);
      setSearchByLocationId(parseInt(e.target.value));
    } else {
      setFlag(1);
      setSearchByLocationId(parseInt(e.target.value));
    }
  };

  // ======= search by cinema type
  const [searchByCinemaTypeId, setSearchByCinemaTypeId] = useState();
  const handleClickCinemaType = (cinemaType) => {
    const cinemaTypeElements = document.querySelectorAll('.cinemaroom-type');
    cinemaTypeElements.forEach((cinemaTypeElement) => {
      if(cinemaTypeElement.textContent === cinemaType.name){
            const imgElement = cinemaTypeElement.querySelector("img");
            if(imgElement){
              imgElement.classList.add("active")
            }    
      }else{
        const imgElement = cinemaTypeElement.querySelector("img");
        if(imgElement){
          imgElement.classList.remove("active")
        }
      }  
    })

    if (flag === 1 || flag === 3) {
      setFlag(3);
      setSearchByCinemaTypeId(cinemaType?.id);
    } else {
      setFlag(2);
      setSearchByCinemaTypeId(cinemaType?.id);
    }
    if(cinemaType.name === "Tất cả"){
      setFlag(0)
    }
  };
  // ===== tìm kiếm theo từng điều kiện flag ======
  // theo locationId
  useEffect(() => {
    const getAllCinemaNamesByLocationId = async (param) => {
      if (flag === 1) {
        await getAllCinemaNamesByLocationIdApi(param, dispatch);
      }
    };
    getAllCinemaNamesByLocationId(searchByLocationId);
  }, [searchByLocationId, flag]);

  // theo CinemaTypeId
  useEffect(() => {
    const getAllCinemaNamesByCinemaTypeId = async (param) => {
      if (flag === 2) {
        await getAllCinemaNamesByCinemaTypeIdApi(param, dispatch);
      }
    };
    getAllCinemaNamesByCinemaTypeId(searchByCinemaTypeId);
  }, [searchByCinemaTypeId, flag]);

  // theo locationId & CinemaTypeId
  useEffect(() => {
    const getAllCinemaNamesByCinemaTypeid = async (param1, param2) => {
      if (flag === 3) {
        await getAllCinemaNamesByLocationIdAndCinemaTypeIdApi(
          param1,
          param2,
          dispatch
        );
      }
    };
    getAllCinemaNamesByCinemaTypeid(searchByLocationId, searchByCinemaTypeId);
  }, [searchByLocationId, searchByCinemaTypeId, flag]);

  // lấy ra được cinemaName cụ thể
  const [dataCinemaName, setDataCinemaName] = useState();
  const handleClickCinemaName = (cinemaName) => {
    setDataCinemaName(cinemaName);
    const cinemaNameElements = document.querySelectorAll(".cinemaroom-left-info");
    cinemaNameElements.forEach((element) => {
      if(element.textContent === cinemaName.name){
         element.classList.add("active");
      }else{
        element.classList.remove("active");
      }
    })
  };

  //================== right =================

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


  // get all showtime by cinemaNameId and Date
  useEffect(() => {
    const getAllShowtime = async (cinemaNameId, dateShowTime) => {
      await getAllShowTimeByCinemaNameIdAndDateApi(
        cinemaNameId,
        dateShowTime,
        dispatch
      );
    };
    getAllShowtime(dataCinemaName?.id, dateShowTime);
  }, [dataCinemaName, dateShowTime]);


  // get all hourtime by showtimeId
  useEffect(() => {
    const getAllHourTimes = async () => {
      await getAllHourTimesApi(dispatch);
    };
    getAllHourTimes();
  }, [showTimes]);
  
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

  // lấy ra ngày hiện tại
  const currentDate = new Date(); // Tạo đối tượng Date với ngày và giờ hiện tại
  const yearNow = currentDate.getFullYear(); // Lấy năm hiện tại
  const monthNow = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng hiện tại và đảm bảo có 2 chữ số
  const dayNow = currentDate.getDate().toString().padStart(2, '0'); // Lấy ngày hiện tại và đảm bảo có 2 chữ số

  let dateNowMovie = yearNow + "-" + monthNow + "-" + dayNow;

  // ================= ĐẶT VÉ THEO PHIM =============
  const navigate = useNavigate();
  const handleMoveMovieDetail = (movie) => {
        navigate("/muavetheophim", { state: { movie: movie, dateNowMovie: dateNowMovie } });
  }

  return (
    <div className="buyticket">
        {
            pending && (
            <div className = "userinfo-loading">
                <div className="lds-dual-ring"></div>
            </div>
            )
        }
      <div className="buyticket-movie">
        <div className="buyticket-movie-2">
          <div className="buyticket-movie-title">
            <h1>Mua vé theo phim</h1>
          </div>
          <div className="buyticket-movie-lists">
            {startIndex > 0 && (
              <KeyboardArrowLeftIcon
                onClick={() => handleItemLeft()}
                className="buyticket-movie-left"
              />
            )}
            {movies.slice(startIndex, endIndex + 1).map((movie, index) => {
              return (
                <div
                  onClick={() => handleMoveMovieDetail(movie)}
                  key={index}
                  className={`buyticket-movie-item`}
                >
                  <div className="buyticket-movie-img">
                    <img src={movie?.data.mainSlide || Photo} alt="" />
                    <p>Mua vé</p>
                  </div>
                  <div className="buyticket-movie-name">
                    <h2>{movie?.data.name}</h2>
                    <h3>{movie?.data.category}</h3>
                    <p className="buyticket-movie-star">
                      <ThumbUpOffAltIcon />
                      {Math.round(movie?.data.totalPercent) + '%'}
                    </p>
                  </div>
                </div>
              );
            })}
            <KeyboardArrowRightIcon
              onClick={() => handleItemRight()}
              className="buyticket-movie-right"
            />
          </div>
        </div>
      </div>
      <div className="buyticket-cinematype">
        <div className="buyticket-cinematype-title">
          <h1>Mua vé theo rạp</h1>
        </div>
        <div className="cinemaroom-header">
          <div className="cinemaroom-location">
            <span>Vị trí</span>
            <select onChange={(e) => handleChangeSelectLocation(e)}>
              <option value="Default" selected disabled hidden>
                TP.Hồ Chí Minh
              </option>
              {locations.map((item) => (
                <option key={item.data?.id} value={item.data?.id}>
                  {item.data.province}
                </option>
              ))}
            </select>
          </div>
          <div className="cinemaroom-types">
            <div className="cinemaroom-type" onClick={() => handleClickCinemaType({name: "Tất cả"})}>
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
            <div className="cinemaroom-header-add"></div>
          </div>
        </div>
        <div className="cinemaroom-content">
          <div className="cinemaroom-content-left">
            <div className="cinemaroom-left-header">
              <div className="cinemaroom-left-search">
                <input type="text" placeholder="Tìm theo tên rạp ..." />
                <SearchIcon />
              </div>
            </div>
            <div className="cinemaroom-left-infos">
              {flag === 1 || flag === 2 || flag === 3
                ? cinemaNamesByConditions.map((item) => (
                    <div
                      key={item.data?.id}
                      className="cinemaroom-left-info"
                      onClick={() => handleClickCinemaName(item.data)}
                    >
                      <img src={item.data.logo || NoAvatar} alt="" />
                      <p>{item.data.name}</p>
                    </div>
                  ))
                : cinemaNames.map((item) => (
                    <div
                      key={item.data?.id}
                      className="cinemaroom-left-info"
                      onClick={() => handleClickCinemaName(item.data)}
                    >
                      <img src={item.data.logo || NoAvatar} alt="" />
                      <p className="cinemaroom-left-addclass">
                        {item.data.name}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
          <div className="cinemaroom-content-right">
            <div className="buticket-cinemaname-header">
              <div className="buyticket-cinemaname-location">
                <img src={dataCinemaName?.logo} alt="" />
                <div className="buyticket-cinemaname-name">
                  <h2>Lịch chiếu phim {dataCinemaName?.name}</h2>
                  <h3>{dataCinemaName?.locationDetail}</h3>
                </div>
              </div>
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
            </div>
            <div className="buyticket-showtime">
              <div className="buyticket-showtime-list">
                {showTimes.length === 0 ? 
                <>
                    <h1 style={{textAlign: 'center', marginTop: '20px'}}>Úi, suất chiếu này không tìm thấy!</h1>
                    <h2 style={{textAlign: 'center', fontWeight: '400'}}>Bạn hãy tìm ngày khác nhé!</h2>
                </>
                :
                showTimes.map((showTime) => (
                  <div
                    key={showTime.data?.id}
                    className="buyticket-showtime-item"
                  >
                    <img src={showTime.data.mainSlide} alt="" />
                    <div className="buyticket-showtime-info">
                      <h3 
                        // className="buyticket-showtime-info-stamp"
                        className={`buyticket-showtime-info-stamp 
                        ${showTime.data.stamp === "P" && 'green' || 
                        showTime.data.stamp === "13+" && 'yellow' || 
                        showTime.data.stamp === "16+" && 'orange' || 
                        showTime.data.stamp === "18+" && 'red'}  `}
                      >
                        {showTime.data.stamp}
                      </h3>
                      <h2 className="buyticket-showtime-info-name">
                        {showTime.data.name}
                      </h2>
                      <h3 className="buyticket-showtime-info-category">
                        {showTime.data.category}
                      </h3>
                      <p>2D phụ đề</p>
                      <div className="buyticket-showtime-hourtime-list">
                        {
                            hourTimes?.map(hourTime => {
                                if(hourTime.data.showTimeId === showTime.data?.id){
                                    return (
                                        <button key={hourTime.data?.id} onClick={() => handleGetChairByHourTime(hourTime.data, showTime.data)}>{hourTime.data.time} ~ {hourTime.data.endTime}</button>
                                        )
                                    }
                            })
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

     
      <ToastContainer />
    </div>
  );
};

export default BuyTicket;
