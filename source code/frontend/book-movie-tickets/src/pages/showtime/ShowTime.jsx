import React, { useEffect, useState } from 'react';
import "./ShowTime.scss";
import NoAvatar from "../../assets/image/noAvatar.png"
import All from "../../assets/image/all.png"
import Photo from "../../assets/image/Photo.jpg"
import { useDispatch, useSelector } from 'react-redux';
import { getAllSearchLocationApi } from '../../redux/location/LocationApi';
import { getAllCinemaTypesApi } from '../../redux/cinemaType/CinemaTypeApi';
import { getAllCinemaNamesApi, getAllCinemaNamesByCinemaTypeIdApi, getAllCinemaNamesByLocationIdAndCinemaTypeIdApi, getAllCinemaNamesByLocationIdApi } from '../../redux/cinemaName/CinemaNameApi';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { DeleteCinemaRoomApi, createCinemaRoomApi, getAllCinemaRoomByCinemaNameIdApi, updateCinemaRoomApi } from '../../redux/cinemaRoom/CinemaRoomApi';
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from 'react-toastify';
import { createChairApi, deleteChairApi, getAllChairByCinemaRoomIdApi, updateChairApi } from '../../redux/chair/ChairApi';
import InfoIcon from '@mui/icons-material/Info';
import { format, addDays, setHours, setDay, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import vi from 'date-fns/locale/vi';
import { createShowTimeApi, deleteShowTimeApi, getAllShowTimeByCinemaNameIdAndDateApi, updateShowTimeApi } from '../../redux/showTime/ShowTimeApi';
import { getAllHourTimeByCinemaRoomId } from '../../redux/hourTime/HourTimeSlice';
import { createHourTimeApi, deleteHourTimeApi, getAllHourTimeByCinemaRoomIdApi } from '../../redux/hourTime/HourTimeApi';
import { getAllMoviesApi } from '../../redux/movie/MovieApi';

const ShowTime = () => {
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.hourTime.pending);
  const locations = useSelector((state) => state.location.listSearch);
  const cinemaTypes = useSelector((state) => state.cinemaType.cinemaTypes);
  const cinemaNames = useSelector((state) => state.cinemaName.listSearch);
  const cinemaNamesByConditions = useSelector((state) => state.cinemaName.cinemaNames);
  const cinemaRoom = useSelector((state) => state.cinemaRoom.cinemaRoom);
  const cinemaRooms = useSelector((state) => state.cinemaRoom.cinemaRooms);
  const chair = useSelector((state) => state.chair.chair);
  const showTimes = useSelector((state) => state.showTime.showTimes);
  const showTime = useSelector((state) => state.showTime.showTime);
  const hourTimes = useSelector((state) => state.hourTime.hourTimes)
  const hourTime = useSelector((state) => state.hourTime.hourTime)
  const movies = useSelector((state) => state.movie.movies)

  // ============Get all==============
  // get all location when open showTime
  useEffect(() => {
    const getAllLocations = async () => {
      await getAllSearchLocationApi(dispatch);
    }
    getAllLocations();
  }, [])

    // get all cinema type when open showTime
    useEffect(() => {
      const getAllCinemaTypes = async () => {
        await getAllCinemaTypesApi(dispatch);
      }
      getAllCinemaTypes();
    }, [])

     // get all cinema name when open ShowTime
     useEffect(() => {
      const getAllCinemaNames = async () => {
        await getAllCinemaNamesApi(dispatch);
      }
      getAllCinemaNames();
    }, [])

    // ===== Kiểm tra điều kiện seach=====
    const [flag, setFlag] = useState(0);
    // flag = 1: Tìm kiếm theo location
    // flag = 2: Tìm kiếm theo Cinema type
    // flag = 3: Tìm kiếm cả 2 cái trên

    // ======= search by location ========
    const [searchByLocationId, setSearchByLocationId] = useState();
    const handleChangeSelectLocation = (e) => {
      if(flag === 2){
        setFlag(3);
        setSearchByLocationId(parseInt(e.target.value));
      }else{
        setFlag(1);
        setSearchByLocationId(parseInt(e.target.value));
      }
    }

    // ======= search by cinema type
    const [searchByCinemaTypeId, setSearchByCinemaTypeId] = useState();
    const handleClickCinemaType = (cinemaType) => {
      if(flag === 1 || flag === 3){
        setFlag(3);
        setSearchByCinemaTypeId(cinemaType.id)
      }else{
        setFlag(2);
        setSearchByCinemaTypeId(cinemaType.id)
      }
    }

    // ===== tìm kiếm theo từng điều kiện flag ======
    // theo locationId
    useEffect(() => {
      const getAllCinemaNamesByLocationId = async (param) => {
        if(flag === 1){
          await getAllCinemaNamesByLocationIdApi(param, dispatch);  
        }
      }
      getAllCinemaNamesByLocationId(searchByLocationId);
    }, [searchByLocationId, flag])

    // theo CinemaTypeId
    useEffect(() => {
      const getAllCinemaNamesByCinemaTypeId = async (param) => {
        if(flag === 2){
          await getAllCinemaNamesByCinemaTypeIdApi(param, dispatch);  
        }
      }
      getAllCinemaNamesByCinemaTypeId(searchByCinemaTypeId);
    }, [searchByCinemaTypeId, flag])

    // theo locationId & CinemaTypeId
    useEffect(() => {
      const getAllCinemaNamesByCinemaTypeid = async (param1, param2) => {
        if(flag === 3){
          await getAllCinemaNamesByLocationIdAndCinemaTypeIdApi(param1, param2, dispatch);  
        }
      }
      getAllCinemaNamesByCinemaTypeid(searchByLocationId, searchByCinemaTypeId);
    }, [searchByLocationId,searchByCinemaTypeId, flag])
   
    // ======= render cinema room =======
    // get item of cinema name save useState
    const [cinemaNameItem, setCinemaNameItem] = useState();
    const handleClickCinemaName = (cinemaName) => {
      setCinemaNameItem(cinemaName);  
      setOpenAddShowTime(false);
    }
    useEffect(() => {
      var listElements = document.querySelectorAll(".cinemaroom-left-info");
      listElements.forEach(e => {
        if(e.outerText === cinemaNameItem?.name){
          e.classList.add('active');
        }else{
          e.classList.remove('active');
        }
      })
    }, [cinemaNameItem])

    // get api cinema room by cinemaName id dựa vào item cinema name lấy ra
    useEffect(() => {
      const getAllCinemaRoomByCinemaNameId = async (cinemaNameId) => {
        await getAllCinemaRoomByCinemaNameIdApi(cinemaNameId, dispatch);
      }
      getAllCinemaRoomByCinemaNameId(cinemaNameItem?.id);
    }, [cinemaNameItem, cinemaRoom, chair])


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
      setOpenAddShowTime(false);
    }

    useEffect(() => {
      var listElement = document.querySelectorAll(".showTime-border");
      listElement.forEach(item => {
        if(item.textContent.substring(0, 2) === dateShowTime?.split(" ")[0].split("-")[2]){
          item.classList.add('active');
        }else{
          item.classList.remove('active');
        }
      })
    }, [dateShowTime])

    
    // ======= tạo suất chiếu mới ========
    const [openAddShowTime, setOpenAddShowTime] = useState(false);
    const [isTicket, setIsTicket] = useState(false);
    const handleAddShowTime = () => {
      setOpenAddShowTime(true);
      if(openAddShowTime){
        console.log(infoMovie, dateShowTime, cinemaNameItem)
        if(infoMovie === {} || dateShowTime === undefined || cinemaNameItem === undefined){
          toast.info(
            "Vui lòng nhập đầy đủ thông tin !",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }      
          );  
        }else{
          setIsTicket(true);
        }
      }
    }

    // tạo suất chiếu
    useEffect(() => {
      if(openAddShowTime){
        const createShowTime = async () => {
          await createShowTimeApi({}, dispatch)
        }
        createShowTime();
      }
    }, [openAddShowTime])

    // tạo suất chiếu vé thành công
    const [ticket, setTicket] = useState("");
    const handleConfirmSaveShowTime = async () => {
      const newShowTime = {
          cinemaNameId: cinemaNameItem?.id,
          movieId: infoMovie.data.id,
          showDate: dateShowTime,
          TicketPrice: ticket
      }
      await updateShowTimeApi(newShowTime, dispatch);
      toast.success(
        "Thêm suất chiếu mới thành công !",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );  
      setOpenAddShowTime(false);  
      setIsTicket(false);
    }

    // get all movies
    useEffect(() => {
      const getAllMovies = async() => {
        await getAllMoviesApi(dispatch);
      }
      getAllMovies();
    }, [])

  // lấy ngày giờ hiện tại theo dạng yyyy-mm--dd
  const currentDate = new Date();
  // const day = currentDate.getDate().toString().padStart(2, '0');
  // const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  // const year = currentDate.getFullYear().toString();

    // get all showtime by cinema name id and date
    useEffect(() => {
      if(openAddShowTime === false){
        const getAllShowTimeByCinemaNameIdAndDate = async (param1, param2) => {
          await getAllShowTimeByCinemaNameIdAndDateApi(param1, param2, dispatch);
        }
        getAllShowTimeByCinemaNameIdAndDate(cinemaNameItem?.id, dateShowTime);
      }
    }, [openAddShowTime,cinemaNameItem,dateShowTime, showTime])


    // get all hour time by cinemaRoomId and showTime id
    const [dataHourTime, setDataHourTime] = useState();
    const [dataShowTime, setDataShowTime] = useState();
    const handleDisplayAllHour = async (cinemaRoom, showTime) => {
      setDataHourTime(cinemaRoom)
      setDataShowTime(showTime)
      await getAllHourTimeByCinemaRoomIdApi(cinemaRoom.id, showTime.id, dispatch);
    }
   
    // get all hourTime
    useEffect(() => {
      const getAllHourTime = async (cinemaRoom, showTime) => {
        await getAllHourTimeByCinemaRoomIdApi(cinemaRoom?.id, showTime?.id, dispatch);
      }
      getAllHourTime(dataHourTime,dataShowTime);
    }, [hourTime, dataHourTime])

    // tìm kiếm thông tin phim
    const [search, setSearch] = useState("");
    const [openSearch, setOpenSearch] = useState(false);
    const [dataResultSearch, setDataResultSearch] = useState();
    useEffect(() => {
      var listResults = [];
      if(listResults.length <= 0){
        setOpenSearch(false);
        setInfoMovie({});
      }
      movies.forEach(movie => {
        if(movie.data.name?.toLowerCase().includes(search?.toLowerCase())){
          listResults.push(movie);
          setOpenSearch(true);
        } 
        if(search === ""){
          setOpenSearch(false);
        }
      })
      setDataResultSearch(listResults);
    }, [search])  

    // hiển thị kết quả tìm kiếm thông tin phim lên desktop
    const [infoMovie, setInfoMovie] = useState({})
    const handleClickMovie = (movie) => {
      setInfoMovie(movie);
      setOpenSearch(false);
    }

    const handlePropagation = (e) => {
      e.stopPropagation();
    }

    // thêm mới hourtime
    const [openHourTime, setOpenHourTime] = useState(false);
    const [time, setTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [dataCinemaRoom, setDataCinemaRoom] = useState();

    // lấy id cinemaRoom chưa tạo xong xong suất chiếu
    const handleOpenHourTime = (cinemaRoom) => {
      setOpenHourTime(true);
      setDataCinemaRoom(cinemaRoom);
    }

    // lấy id cinemaRoom và showTime sau khi đã tạo xong suất chiếu
    const [afterCinemaRoom, setAfterCinemaRoom] = useState();
    const [afterShowTime, setAfterShowTime] = useState();
    const handleOpenHourTimeAfterShowTime = (cinemaRoom, showTime) => {
      setOpenHourTime(true);
      setDialogVisible(false);
      setAfterCinemaRoom(cinemaRoom);
      setAfterShowTime(showTime);
    }

    const handleSaveHourTime = async () => {
      if(time === "" || endTime === ""){
        toast.info(
          "Vui lòng nhập đầy đủ thông tin!",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );  
      }else{
        const newHourTime = {
          showTimeId: afterShowTime ? afterShowTime.id : showTime.data?.id,
          cinemaRoomId: afterCinemaRoom ? afterCinemaRoom.id : dataCinemaRoom.data.id,
          time: time,
          endTime: endTime 
        }
        await createHourTimeApi(newHourTime, dispatch);
        toast.success(
          "Thêm giờ chiếu thành công !",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );  
        setOpenHourTime(false);
        }   
    }

    // click chuột vào giờ chiếu hiện ra click xóa
    const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dataDeleteHourTime, setDataDeleteHourTime] = useState();
    const handleOpenDelete = (event, itemHour) => {
      const x = event.clientX;
      const y = event.clientY;
    
      setDialogPosition({ x, y });
      setDialogVisible(!dialogVisible);
      setDataDeleteHourTime(itemHour);
    }

    // delete hourtime
    const [openDeleteHourTime, setOpenDeleteHourTime] = useState(false);
    const handleOpenDeleteHourTime = () => {
      setOpenDeleteHourTime(true);
      setDialogVisible(false);
    }

    // khi nhấn Ok form xóa
    const handleConfirmDeleteHourTime = async () => {
      await deleteHourTimeApi(dataDeleteHourTime.data.id, dispatch);
      toast.success(
        "Xóa giờ chiếu này thành công !",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );  
      setOpenDeleteHourTime(false);
      setDialogVisible(false);
    }

    // khi nhấn Hủy form xóa
    const handleCancelConfirmHourTime = () => {
      setOpenDeleteHourTime(false);
      setDialogVisible(false);
    }

    // xóa suất chiếu
    const [openDeleteShowTime, setOpenDeleteShowTime] = useState(false)
    const [dataDeleteShowTime, setDataDeleteShowTime] = useState();
    const handleOpenDeleteShowTime = (showTime) => {
      setOpenDeleteShowTime(true);
      setDataDeleteShowTime(showTime);
    }

    const handleConfirmDeleteShowTime = async() => {
      await deleteShowTimeApi(dataDeleteShowTime.data.id, dispatch);
      toast.success(
        "Xóa suất chiếu này thành công !",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );  
      setOpenDeleteShowTime(false)
    }


  return (
    <div className="cinemaroom">
      {
        pending && (
          <div className = "userinfo-loading">
            <div className="lds-dual-ring"></div>
          </div>
        )
      }
      <div className="cinemaroom-header">
        <div className="cinemaroom-location">
          <span>Vị trí</span>
          <select onChange={(e) => handleChangeSelectLocation(e)}>
            <option value="Default" selected disabled hidden>Choose here</option>
            {
              locations.map(item => (
                <option key={item.data.id} value={item.data.id}>{item.data.province}</option>
              ))
            }
          </select>
        </div>
        <div className="cinemaroom-types">
          <div className="cinemaroom-type" onClick={() => setFlag(0)}>
            <img src = {All} alt="" />
            <p>Tất cả</p>
          </div>
          {
            cinemaTypes.map(item => (
              <div 
                key={item.data.id} 
                className="cinemaroom-type"
                onClick={() => handleClickCinemaType(item.data)}
              >
                <img src = {item.data.logo || NoAvatar} alt="" />
                <p>{item.data.name}</p>
              </div>
            ))
          }
          <div className="cinemaroom-header-add">
            <button>
              <AddBoxIcon />
              Thêm loại rạp
            </button>
          </div>
        </div>
      </div>
      <div className="cinemaroom-content">
        <div className="cinemaroom-content-left">
          <div className="cinemaroom-left-header">
            <div className="cinemaroom-left-search">
              <input type='text' placeholder='Tìm theo tên rạp ...' />
              <SearchIcon />
            </div>
            <div className="cinemaroom-left-add">
              <button>
              <AddBoxIcon />
                Thêm tên rạp
              </button>
            </div>
          </div>
          <div className="cinemaroom-left-infos">
            {
              ((flag === 1) || (flag === 2) || (flag === 3)) ? (cinemaNamesByConditions.map(item => (
                <div 
                  key={item.data.id} 
                  className="cinemaroom-left-info"
                  onClick={() => handleClickCinemaName(item.data)}
                >
                  <img src = {item.data.logo || NoAvatar} alt="" />
                  <p>{item.data.name}</p>
                </div>
              )) )
              :
              (cinemaNames.map(item => (
                <div 
                  key={item.data.id} 
                  className="cinemaroom-left-info"
                  onClick={() => handleClickCinemaName(item.data)}
                >
                  <img src = {item.data.logo || NoAvatar} alt="" />
                  <p className="cinemaroom-left-addclass">{item.data.name}</p>
                </div>
              )))
            }
          </div>
        </div>
        <div className="showTime-right">
            <div className="showTime-calendar">
              {
                calendar.map((item,index) => (
                  <div 
                    key={index} 
                    className="showTime-border"
                    onClick={() => handleShowTimeDate(item)}
                  >
                    <h1>{item.toString().split(" ")[2]}</h1>
                    <h3>{item.toString().split(" ")[0]}</h3>
                  </div>    
                ))
              }     
              <div className="showTime-save">
                <button style={openAddShowTime ? {backgroundColor: 'green'} : {backgroundColor: 'blue'}} onClick={() => handleAddShowTime()}> { openAddShowTime ? "Lưu suất chiếu" : "Tạo suất chiếu mới" }</button>
              </div>                
            </div>
            <div className="showTime-movies-container">
              {/* tạo mới */}
              {
                openAddShowTime ? (
                  <div className="showTime-right-create">
                    <div className="showTime-movies">
                      <div className="showTime-movies-search">
                        <h2>Thông tin phim</h2>
                        <input 
                          type="text" 
                          placeholder="Tìm kiếm phim chiếu tại đây..."
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="movie-result">
                          {
                            openSearch && dataResultSearch.map(result => (
                                <div key={result?.data.id} className="movie-result-list" onClick={() => handleClickMovie(result)}>
                                  <img src={result?.data.mainSlide || Photo} alt="" />
                                  <div className="movie-result-info">
                                    <h2>{result?.data.name}</h2>
                                    <h3>{result?.data.author}</h3>                                
                                  </div>
                                </div>
                            ))
                          }
                        </div>
                      </div>
                      <div className="showTime-movies-content">
                            <div className="showTime-movies-info-mainSlide">
                              <img src={infoMovie?.data?.mainSlide || Photo} alt="" />
                            </div>
                            <div className="showTime-movies-info">
                              <h2>Tên phim: {infoMovie?.data?.name}</h2>
                              <h2>Thể loại: {infoMovie?.data?.category}</h2>
                              <h2>Đạo diễn: {infoMovie?.data?.author}</h2>
                            </div>
                      </div>
                     
                    </div>
                    <div className="cinemaroom-right-table">
                        <table className="userinfo-table">
                        <div className="table-scroll-thead">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên phòng</th>
                                <th scope="col">Giờ chiếu</th>
                                {/* <th scope="col">Action</th> */}
                              </tr>
                            </thead>
                        </div>
                          <div className="table-scroll-tbody">
                            <tbody>
                              {
                                cinemaRooms.map((itemRoom, index) => (
                                  <tr key={itemRoom.data.id}>
                                    <th scope="row">{index + 1}</th>       
                                    <td>{itemRoom.data.name}</td>      
                                    <td className="table-body-add">
                                        <AddBoxIcon onClick={() => handleOpenHourTime(itemRoom)} />
                                    </td >                                        
                                  </tr>
                                ))
                              }
                            </tbody>
                          </div>
                        </table>
                    </div>
                  </div>
                ) : (
                  // {/* list suất chiếu */}
                  <div className="showTime-right-item">
                    {
                      showTimes.length === 0 && (<h1 style={{textAlign: 'center', marginTop: '20px'}}>Không có suất chiếu nào của ngày hôm nay!</h1>) || 
                      showTimes.map(item => (
                        <>
                          <div key={item.data.id} className="showTime-right-list">
                            <div className="showTime-movies">
                              <div className="showTime-movies-content showTIme-movie-item">
                                    <div className="showTime-movies-info-mainSlide">
                                      <img src={item.data.mainSlide ? item.data.mainSlide : NoAvatar} alt="" />
                                    </div>
                                    <div className="showTime-movies-info">
                                      <h2>Tên phim: {item.data.name}</h2>
                                      <h2>Thể loại: {item.data.category}</h2>
                                      <h2>Đạo diễn: {item.data.author}</h2>
                                    </div>
                                    <div className="showTime-movies-delete">
                                      <DeleteIcon onClick={() => handleOpenDeleteShowTime(item)} />
                                    </div>
                              </div>
                            </div>
                            <div className="cinemaroom-right-table">
                                <table className="userinfo-table">
                                <div className="table-scroll-thead">
                                    <thead>
                                      <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Tên phòng</th>
                                        <th scope="col">Giờ chiếu</th>
                                        {/* <th scope="col">Action</th> */}
                                      </tr>
                                    </thead>
                                </div>
                                  <div className="table-scroll-tbody">
                                    <tbody>
                                      {
                                        cinemaRooms.map((itemRoom, index) => (
                                            <tr key={itemRoom.data.id}>
                                              <th scope="row">{index + 1}</th>       
                                              <td>{itemRoom.data.name}</td>      
                                              <td className="table-body-display">
                                                {
                                                (dataHourTime?.id === itemRoom.data.id && dataShowTime.id === item.data.id) ?
                                                  hourTimes.map(itemHour => (
                                                    <>
                                                      <button 
                                                        onClick={(e) => handleOpenDelete(e,itemHour)}
                                                        style={{border: '1px solid blue', backgroundColor: 'transparent', color: 'blue', textAlign: 'left', margin: '2px 2px'}} 
                                                        key={itemHour.data.id}> {`${itemHour.data.time} ~ ${itemHour.data.endTime}`}
                                                      </button>
                                                    </>
                                                  )) 
                                                  : 
                                                  <button style={{width: '100%'}} onClick={() => handleDisplayAllHour(itemRoom.data, item.data)}>Xem giờ chiếu</button>                           
                                                }
                                                {
                                                  (dataHourTime?.id === itemRoom.data.id && dataShowTime.id === item.data.id) && 
                                                  <button
                                                      onClick={() => handleOpenHourTimeAfterShowTime(itemRoom.data, item.data)} 
                                                      style={{border: '1px solid blue', backgroundColor: 'transparent', color: 'blue', textAlign: 'center', margin: '2px 2px', width: '30px'}}
                                                    > 
                                                    +
                                                    </button>
                                                }
                                              </td>                                               
                                            </tr>
                                        )) 
                                      }
                                    </tbody>
                                    
                                  </div>
                                </table>
                            </div>
                          </div>
                        </>
                      ))
                    }
                  </div>
          
                )
              }

            </div>
        </div>
      </div>
      {/* form add showtime */}
      {isTicket && (
          <div className="userinfo-dialog-delete">
            <div className="userinfo-dialog-deleteForm" style={{height: '30%'}}>
              <InfoIcon />
              <span>Xác nhận</span>
              <p>Bạn hãy nhập tiền bán vé cho suất chiếu này!</p>
              <input 
                type="text" 
                onChange={(e) => setTicket(e.target.value)}
                style={{
                  width:'60%', 
                  textAlign:'center',
                  marginTop: '10px',
                  padding: '5px 8px',
                  height: '50%',
                  fontSize: '1.6rem',
                  marginLeft: '22%',
                  outline: 'none'
                }} 
              />
              <div className="userinfo-dialog-delete-btn">
                <button onClick={() => handleConfirmSaveShowTime()}>OK</button>
                <button onClick={() => setIsTicket(false)}> Hủy</button>
              </div>
            </div>
          </div>
      )}

      {/* open form add hourtime */}
      {
        openHourTime && (
          <div
          className="userinfo-dialogAdd"
          onClick={() => setOpenHourTime(false)}
        >
          <div
            className="userinfo-dialogAddContainer"
            onClick={(e) => handlePropagation(e)}
          >
            <div className="userinfo-dialog-header">
              <h1>Thêm giờ chiếu</h1>
              <CancelIcon onClick={() => setOpenHourTime(false)} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
              
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Thời gian bắt đầu: </label>
                    <input
                      type="text"
                      placeholder="VD: 11:00"
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Thời gian kết thúc: </label>
                    <input
                      type="text"
                      placeholder="VD: 13:00"
                      onChange={(e) => setEndTime(e.target.value)}                     
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="userinfo-dialog-footer">
              <button onClick={() => handleSaveHourTime()}>Lưu lại</button>
              <button onClick={() => setOpenHourTime(false)}>Hủy</button>
            </div>
          </div>
        </div>
        )
      }
      {/* // open form mouseDown hourtime */}
      {
        dialogVisible && (
          <div 
            className="chair-action" 
            style={{
              top: dialogPosition.y,
              left: dialogPosition.x,
            }}
          >
            <h2 onClick = {() => handleOpenDeleteHourTime()}>Xóa</h2>
          </div>
        )
      }
      {/* open form delete hourtime */}
      {
        openDeleteHourTime && (
          <div className="userinfo-dialog-delete">
            <div className="userinfo-dialog-deleteForm">
              <InfoIcon />
              <span>Xác nhận</span>
              <p>Bạn có chắc xóa giờ chiếu này không!</p>
              <div className="userinfo-dialog-delete-btn">
                <button onClick={() => handleConfirmDeleteHourTime()}>OK</button>
                <button onClick={() => handleCancelConfirmHourTime()}> Hủy</button>
              </div>
            </div>
          </div>
        )
      }

      {/* open delete Showtime */}
      {
        openDeleteShowTime && (
          <div className="userinfo-dialog-delete">
            <div className="userinfo-dialog-deleteForm">
              <InfoIcon />
              <span>Xác nhận</span>
              <p>Bạn có chắc xóa suất chiếu này không!</p>
              <div className="userinfo-dialog-delete-btn">
                <button onClick={() => handleConfirmDeleteShowTime()}>OK</button>
                <button onClick={() => setOpenDeleteShowTime(false)}> Hủy</button>
              </div>
            </div>
          </div>
        )
      }
      <ToastContainer />
    </div>
  )
}

export default ShowTime