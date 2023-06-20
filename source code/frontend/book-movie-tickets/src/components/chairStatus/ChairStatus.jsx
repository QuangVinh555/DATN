import React from 'react';
import "./ChairStatus.scss";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useEffect } from 'react';
import { getAllChairStatusByCinemaRoomIdApi } from '../../redux/chairStatus/ChairStatusApi';
import { useDispatch, useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';
import { createBookTicketDetailApi, deleteBookTicketDetailByCancelChairApi, deleteBookTicketDetailByStateApi } from '../../redux/bookTicketDetail/BookTicketDetailApi';
import { ToastContainer, toast } from 'react-toastify';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { getAllComboByDateNowApi } from '../../redux/combo/ComboApi';
import CloseIcon from '@mui/icons-material/Close';
import { getBookTicketApi, updateBookTicketApi } from '../../redux/bookTicket/BookTicketApi';
import { cancelErrorBookTicket } from '../../redux/bookTicket/BookTicketSlice';
import { getUserPointByUserIdApi } from '../../redux/usePoint/UserPointApi';

const ChairStatus = (props) => {
    const {hourTime, openChairStatus, setOpenChairStatus, showTime, dateShowTime, userLoginGG} = props; 
  
    const dispatch = useDispatch();
    const listChairStatus = useSelector(state => state.chairStatus.listChairStatus);
    const bookTicket = useSelector(state => state.bookTicket.bookTicket);
    const combos = useSelector(state => state.combo.combos);
    const token = useSelector(state => state.auth.token)
    const error = useSelector(state => state.bookTicket.error);
    const pending = useSelector(state => state.bookTicket.pending);
    const userPoint = useSelector(state => state.userPoint.userPoint);
    let formattedDate = new Date(dateShowTime).toLocaleDateString('en-GB');
    
    // get all chairStatus by HourTimeId
    useEffect(() => {
        const getAllChairStatusByCinemaRoom = async (hourTime) => {
            await getAllChairStatusByCinemaRoomIdApi(hourTime?.id, dispatch)
        }
        getAllChairStatusByCinemaRoom(hourTime);
    }, [hourTime])

    // thoát khỏi màn hình chọn ghế
    const hadndleBack = async () => {
        setOpenChairStatus(false);
    }

    // tránh nỗi bọt
    const handlePropagation = (e) => {
        e.stopPropagation();
    }

    // chọn ghế
    const [dataChair, setDataChair] = useState();
    const [isLoadChair, setIsLoadChair] = useState(false);
   
    // khi nào chọn ghế, thì các ghế được chọn sẽ được thêm vào mảng này
    const [selectedChairs, setSelectedChairs] = useState([]);
    const handleSelectedChair = async(event,chair) => {
        setIsLoadChair(true);
        if(chair.status === 2){
            event.stopPropagation();
            event.preventDefault();
        }else{
            const newBookTicketDetail = {
                BookTicketId: bookTicket?.data.id,
                ChairId: chair?.chairId,
                TicketPrice: showTime.ticketPrice,
                HourTimeId: hourTime?.id,
            }
            setDataChair(chair);
            const index = selectedChairs.indexOf(chair.chair);
    
            if (index > -1) {
              // Ghế đã được chọn trước đó, bỏ chọn ghế
              setSelectedChairs(prevSelectedChairs => prevSelectedChairs.filter(selectedChair => selectedChair !== chair.chair));
              await deleteBookTicketDetailByCancelChairApi(chair?.id, bookTicket.data.id, dispatch);
            } else {
              // Ghế chưa được chọn, thêm ghế vào danh sách các ghế đã chọn
              setSelectedChairs(prevSelectedChairs => [...prevSelectedChairs, chair?.chair]);
              await createBookTicketDetailApi(newBookTicketDetail, dispatch)
            }
        }
        
    }

    // thay đổi màu khi chọn ghế
    useEffect(() => {
        var chairElements = document.querySelectorAll('.chairstatus-chair');
        chairElements.forEach(item => {
          const chair = item.textContent;
          if (selectedChairs.includes(chair)) {
            item.classList.add('btnSelected');
          } else {
            item.classList.remove('btnSelected');
          }
        });
      }, [selectedChairs, bookTicket]);

    // xóa các ghế đã chọn khi thoát màn hình chairstatus
    useEffect(() => {
        const setChariStatus = async () => {
            await deleteBookTicketDetailByStateApi(bookTicket?.data?.id, hourTime?.id, dispatch)
        }
        setChariStatus();
    }, [openChairStatus])

    //   tự động set lại các ghế chưa thanh toán sau 2 phút
    useEffect(() => {
        if(isLoadChair === true){
            const interval = setInterval(async () => {
              await deleteBookTicketDetailByStateApi(bookTicket.data?.id, hourTime?.id, dispatch)
              setOpenChairStatus(false)
              setIsLoadChair(false);
              toast.info(
                "Quá trình chọn ghế hết thời gian. Vui lòng chọn ghế lại !",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
              );  
            }, 2 * 60 * 1000); // 2 phút = 2 * 60 * 1000 miligiây
            return () => {
                // Xóa interval khi component bị unmount hoặc effect bị clean up
                clearInterval(interval);
            };
        }
      }, [isLoadChair])
      
    //   hủy ghế chỗ thông tin chỗ ngồi
      const handleCancelChair = async () => {
        await deleteBookTicketDetailByStateApi(bookTicket?.data.id, hourTime?.id, dispatch)
        var chairElements = document.querySelectorAll('.chairstatus-chair');
        chairElements.forEach(item => {
          const chair = item.textContent;
          if (selectedChairs.includes(chair)) {
            item.classList.remove('btnSelected');
            setSelectedChairs([]);
        }
        });
      }

    //   duyệt qua mảng các ghế đã được chọn để lấy số lượng tính tổng tiền tạm tính
      const [totalTicket, setTotalTicket] = useState(0);
      useEffect(() => {
        let total = 0;
        selectedChairs.forEach(item => {
            total++;
        });
        setTotalTicket(total * showTime.ticketPrice);
      }, [dataChair, selectedChairs])

    //   format VNĐ
    const formattedAmount = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(totalTicket);


    // biến lưu trữ combo
    const [isOpenCombo, setIsOpenCombo] = useState(false);
    // mua vé
    const handleBuyTicket = () => {
        if(selectedChairs.length === 0){
            toast.info(
                "Vui lòng chọn ít nhất 1 ghế!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
              );  
        }else{
            setIsOpenCombo(true);
        }
    }

    // =========== Combo ==========
   
    useEffect(() => {
      const getAllComboByDateNow = async () => {
          await getAllComboByDateNowApi(dispatch);
      }
      getAllComboByDateNow();
  }, [])
     
     // tắt form combo
     const handleBackCombo = () => {
         setIsOpenCombo(false);
     }
   
     // biến lưu trữ số lượng combo
     const [numCombo, setNumCombo] = useState(0);
     const [dataNumCombo, setDataNumCombo] = useState();
     // giảm số lượng
     const handleMinusCombo = (combo) => {
        setDataNumCombo(combo)
        combos.map(item =>{
            if(item.data.id === combo.id){
                setNumCombo(numCombo <= 0 ? 0 : (numCombo - 1));
            }
        })
     }
   
     // tăng số lượng
     const handleAddCombo = (combo) => {
        setDataNumCombo(combo)
        combos.forEach(item => {
            if(item.data.id === combo.id) {
                // setNumCombo(numCombo + 1);
                setNumCombo(numCombo >= combo.count ? combo.count : numCombo + 1);
            }
        })
     }
  
    //  tính tổng tiền combo
     const [totalCombo, setTotalCombo] = useState(0);
     useEffect(() => {
        setTotalCombo(dataNumCombo ? numCombo * (dataNumCombo?.price) : 0);
     }, [numCombo])

    // format VNĐ combo
    const formattedAmountCombo = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(totalCombo);

    // ======== Ticket Detail ========
    const [isOpenTicketDetail, setIsOpenTicketDetail] = useState(false);
    const handleTicketDetail = () => {
        setIsOpenTicketDetail(true);
    }

    // Tính tổng tiền tạm tính frontend
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        setTotalPrice(totalTicket + totalCombo);
    }, [totalTicket, totalCombo]) 

    // format VNĐ combo
    const formattedTotalPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(totalPrice);

    // biến lưu trữ điểm thưởng quy đổi của khách
    const [point, setPoint] = useState(0);
    useEffect(() => {
        if(isOpenTicketDetail){
            const getUserPointByUserId = async (userId) => {
                await getUserPointByUserIdApi(userId, dispatch);
            }
            getUserPointByUserId(token?.id || userLoginGG?.id)

        }
    }, [isOpenTicketDetail])
  
    const handleChangeUserPoint = (e) => {
        if(e.target.value > userPoint?.data?.rewardPoints){
            toast.error(
                "Số điểm của bạn không đủ!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
            );  
            e.target.value = "";
            setPoint(0)

        }else if(e.target.value === 100){
            toast.error(
                "Bạn chỉ được tối đa dùng 100 điểm để quy đổi!",
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                }      
            );  
        }
        else{
            setPoint(e.target.value)
        }
    }
    console.log(point)
    // phương thức thanh toán
    const [typePayment, setTypePayment] = useState(3); // 1: Momo, 2: Vnpay, 3: Moveek

    // Xác nhậm đặt vé
    const [isOpenBookTicket, setIsOpenBookTicket] = useState(false);

    const handleConfimrBookTicketLocal = async () => {
        // cập nhật
        const newBookTicket = {
            UserId: parseInt(token?.Id) || userLoginGG?.id,
            PaymentId: typePayment,
            ComboId: dataNumCombo?.id,
            CountCombo: numCombo,
            ShowTimeId: showTime?.id,
            HourTimeId: hourTime?.id,
            MoneyPoints: parseInt(point)
        }

        await updateBookTicketApi(bookTicket?.data?.id, newBookTicket, dispatch);
        toast.success(
            "Bạn đã đặt vé thành công!",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }      
        );
        var chairElements = document.querySelectorAll('.chairstatus-chair');
        chairElements.forEach(item => {
          const chair = item.textContent;
          if (selectedChairs.includes(chair)) {
            item.classList.add('btnSelectedBuy');
            // setSelectedChairs([]);
            }
        });
        setIsOpenTicketDetail(false)
        setIsOpenBookTicket(true);
    }

    useEffect(() => {
        if(isOpenBookTicket){
            const interval = setInterval(async () => {
                setIsOpenBookTicket(false);
                setIsOpenTicketDetail(false)
                setIsOpenCombo(false);

              }, 5000); // 2 phút = 2 * 60 * 1000 miligiây
              return () => {
                  // Xóa interval khi component bị unmount hoặc effect bị clean up
                  clearInterval(interval);
            };          
        }
    }, [isOpenBookTicket])

    useEffect(() => {
        const getBookTicketById = async (bookTicketId) => {
            await getBookTicketApi(bookTicketId, dispatch)
        }
        getBookTicketById(bookTicket?.data?.id);
    }, [isOpenBookTicket])

     // format VNĐ tiền điểm thưởng
     const formattedMoneyPoint = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(bookTicket.data?.rewardPoints_Used);
    console.log(formattedMoneyPoint)
      // format VNĐ tổng tiền vé
      const formattedTotal = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(bookTicket?.data?.total);

  return (
   <>

        {/* open chair status  */}
        <div className="chairstatus" onClick={() => setOpenChairStatus(false)}>
            <div className="chairstatus-2" onClick={(e) => handlePropagation(e)}>
                <div className="chairstatus-header">
                    <KeyboardArrowLeftIcon onClick={() => hadndleBack()} />
                    <h1>Mua vé xem phim</h1>
                </div>
                <div className="chairstatus-container">
                    <div className="chairstatus-screen">
                        <div className="chairstatus-line"></div>
                        <p>Màn hình</p>
                    </div>
                    <div className="chairstatus-list">
                        {
                            listChairStatus.map(chairStatus => (
                                <div key={chairStatus.data?.id} className="chairstatus-item">
                                    <button
                                        onClick={(e) => handleSelectedChair(e,chairStatus.data)}
                                        className={`
                                            chairstatus-chair
                                            ${chairStatus.data.status === 1 && 'btnSelected' ||
                                            chairStatus.data.status === 2 && 'btnSelectedBuy' ||
                                            chairStatus.data.chairTypeId === 1 && 'btnNormal' || 
                                            chairStatus.data.chairTypeId === 2 && 'btnVIP' || 
                                            chairStatus.data.chairTypeId === 3 && 'btnCouple'
                                            }`
                                        }                               
                                    >
                                        {chairStatus.data.chair}</button>
                                </div>
    
                            ))
                        }                   
                    </div>
                    <div className="chairstatus-state">
                       <div className="chairstatus-state-1">
                            <div className="chairstatus-state-item">
                                <div className="chairstatus-square btnSelectedBuy"></div>
                                <p>Đã đặt</p>
                            </div>
                            <div className="chairstatus-state-item">
                                <div className="chairstatus-square btnSelected"></div>
                                <p>Ghế bạn chọn</p>
                            </div>
    
                       </div>
                        <div className="chairstatus-state-2">
                            <div className="chairstatus-state-item">
                                <div className="chairstatus-square btnNormal"></div>
                                <p>Ghế thường</p>
                            </div>
                            <div className="chairstatus-state-item ">
                                <div className="chairstatus-square btnVIP"></div>
                                <p>Ghế VIP</p>
                            </div>
                            <div className="chairstatus-state-item">
                                <div className="chairstatus-square btnCouple" ></div>
                                <p>Ghế đôi</p>
                            </div>
                        </div>
                    </div>
                    <div className="chairstatus-info">
                        <div className="chairstatus-info-title">
                            <p 
                             className={`
                             ${showTime.stamp === "P" && 'green' || 
                             showTime.stamp === "13+" && 'yellow' || 
                             showTime.stamp === "16+" && 'orange' || 
                             showTime.stamp === "18+" && 'red'}  `}
                            >{showTime.stamp}</p>
                            <h2>{showTime.name}</h2>
                        </div>
                        <div className="chairstatus-info-date">
                            <span>{hourTime.time} ~ {hourTime.endTime} - </span>
                            <span>{formattedDate} - </span>
                            <span>{hourTime.cinemaRoom}</span>
                        </div>
                        <div className="chairstatus-chairdown">
                            <p>Chỗ ngồi</p>
                            <div className="chairstatus-chairname">
                                {
                                    selectedChairs.length !== 0 &&
                                    <button>
                                        {
                                            selectedChairs.map((chair,index) => (
                                                <>
                                                    {index === selectedChairs.length - 1 ? chair : chair + ", "}
                                                </>
                                            ))
                                        }
                                        <CancelIcon onClick = {() => handleCancelChair()}/>                    
                                    </button>
    
                                }
                               
                            </div>
                        </div>
                        <div className="chairstatus-temp">
                            <div className="chairstatus-temp-price">
                                <p>Tạm tính</p>
                                <p>{formattedAmount}</p>
                            </div>
                            <div className="chairstatus-buy">
                                <button onClick={() => handleBuyTicket()}>Mua vé</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
        </div>

        {/* open form combo */}
        {isOpenCombo && (
                        <div className="combo" onClick={() => setIsOpenCombo(false)}>
                            <div className="combo-2" onClick={(e) => handlePropagation(e)}>
                                <div className="combo-header">
                                    <KeyboardArrowLeftIcon onClick={() => handleBackCombo()} />
                                    <h1>Combo - Bắp nước</h1>
                                </div>
                                <div className="combo-container">
                                    <div className="combo-list">
                                        {
                                            combos.map(combo => (
                                                <div className="combo-item">
                                                    <div className="combo-item-img">
                                                        <img src="https://i.imgur.com/VNvOxmh.png" alt="" />
                                                    </div>
                                                    <div className="combo-item-info">
                                                        <h1>{combo.data.name}</h1>
                                                        <p>{combo.data.description} - {combo.data.price}</p>
                                                        <div className="combo-item-quantity">
                                                            <RemoveCircleOutlineIcon 
                                                                className={`combo-item-minus ${(combo.data.id === dataNumCombo?.id && numCombo <= 0) ? 'disabled' : 'active'}`}
                                                                onClick={() => handleMinusCombo(combo.data)}
                                                            />
                                                            <p>{combo.data.id === dataNumCombo?.id ?  numCombo : 0}</p>
                                                            <ControlPointIcon 
                                                                className={`combo-item-add ${(numCombo >= combo.data.count) ? 'disabled' : 'active'}`}                                                             
                                                                onClick={() => handleAddCombo(combo.data)}
                                                            />
                                                            <h3 className="combo-item-num">SL: {combo.data.count}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>                           
                                </div>
                                <div className="combo-footer">
                                    <div className="combo-price">
                                        <h2 className='combo-total'>Tổng cộng</h2>
                                        <h2>{formattedAmountCombo}</h2>
                                    </div>
                                    <div className="combo-btn">
                                        <button onClick={() => handleTicketDetail()}>Tiếp tục</button>
                                    </div>
                                </div>
                            </div>
                        </div>
        )}

        {/* open form ticket detail */}
        {isOpenTicketDetail && (
            <div className="ticketdetail" onClick={() => setIsOpenTicketDetail(false)}>
                <div className="ticketdetail-2" onClick={(e) => handlePropagation(e)}>
                    <div className="ticketdetail-left">
                        <div className="ticketdetail-left-namemovie">
                            <p>{showTime.stamp}</p>
                            <h1>{showTime.name}</h1>
                        </div>
                        <div className="ticketdetail-left-date">
                            <div className="ticketdetail-left-hourtime">
                                <p>Thời gian</p>
                                <p>{hourTime.time} ~ {hourTime.endTime}</p>
                            </div>
                            <div className="ticketdetail-left-datetime">
                                <p>Ngày chiếu</p>
                                <p>{formattedDate}</p>
                            </div>
                        </div>
                        <div className="ticketdetail-left-cinema">
                            <p>Rạp</p>
                            <p>{showTime.cinemaName}</p>
                            <p>{showTime.locationDetail}</p>
                        </div>
                        <div className="ticketdetail-left-cinemaroom">
                            <div className="ticketdetail-left-room">
                                <p>Phòng chiếu</p>
                                <p>{hourTime.cinemaRoom}</p>
                            </div>
                            <div className="ticketdetail-left-format">
                                <p>Định dạng</p>
                                <p>2D Lồng tiếng</p>
                            </div>
                        </div>
                        <div className="ticketdetail-left-chairinfo">
                            <p>Ghế</p>
                            <div className="ticketdetail-left-chair">
                                <p>
                                {
                                    selectedChairs.map((chair,index) => (
                                        <>
                                            {index === selectedChairs.length - 1 ? chair : chair + ", "}
                                        </>
                                    ))
                                }
                                </p>
                                <h2>{formattedAmount}</h2>
                            </div>
                        </div>
                        <div className="ticketdetail-left-comboinfo">
                            <p>Bắp - nước</p>
                            <div className="ticketdetail-left-combo">
                                <p>{numCombo !== 0 ? (numCombo + " x " + dataNumCombo?.name) : ""}</p>
                                <h2>{formattedAmountCombo}</h2>
                            </div>     
                        </div>
                        <div className="ticketdetail-left-totaltemp">
                            <h2>Tạm tính</h2>
                            <h2>{formattedTotalPrice}</h2>
                        </div>
                        <div className="ticketdetail-left-pointinfo">
                            <p>Bạn có thể đổi điểm tại đây</p>
                            <input onChange={(e) => handleChangeUserPoint(e)} type="text" placeholder="Vui lòng nhập điểm thưởng (nếu có) !" />
                        </div>
                    </div>
                    <div className="ticketdetail-right">
                        <div className="ticketdetail-right-exit">
                            <CloseIcon onClick={() => setIsOpenTicketDetail(false)} />
                        </div>
                        <div className="ticketdetail-right-payment">
                            <div className="ticketdetail-right-momo">
                                {/* <input type="radio" /> */}
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJI
                                AAAAkFBMVEWtAGz///+rAGepAGOoAGHGap2rAGjTjrPeqsbfrsju2OKnAF7AU5CoAGK
                                nAF2tAGr79Pj57/X++v3WlrjaocDits326PDz3+rKdqOzInfFZJnCXJTIbp/04u
                                y6QYXNgKnoxtjszt63NX/r0t61KHrmv9TRh66+TYzbpMG5OoLWmbjBWJKxFHPQha3
                                Vk7i9R4noJkqkAAAJOUlEQVR4nO2da3eqOhCGIYloGzFeKt6qeMFaW3f9///uQNUWzQQB
                                M2zdZ54vXasBzEvuyczgOARBEARBEARBEARBEARBEARBEARBEARBEARBEMT/BsUY94XwOfP
                                0NI/xODFOY6rwc73Dc5MHF77ZHh4XUe3jab5azRu9yUjyVF4Ul6NJr5GkPX3UIsH1N2CECb
                                4cfzTWq9Vq3eiNI99n9jOfJx9+86njpggaM8FOeZy9B+m0Tr+ZM5ue2IXzdvpet70eOqLAG7ID
                                E/UzCQcGQxnrYHI40NOCeg6NrDVe6LfGzCetSgtSybALZsQNxlKOO3BaNxTZbYqJ0HBr8uShrK
                                4cWQSU0Yn12pw2iLIKQkyAapFi2hQVCRSvmRnJpGbMJFMZr+ZIH+iyEZC98gJdtyfhp/obQ7
                                0/oz3j+ALFyy0CXfcFlCjfct4+RK+p/M9tAl33DSgG+Z77dlMlsAVr3irQdZtad9N6Kn
                                A7skTVvp6Fa7QvH1qw4n9hVlTRv11g3CWeZ5GHBe9/xRv81dKGQNddpkd+b1/4/
                                ghtNi7mdhTO04XIi1f8AGvMUCM7Al1391sIpSr+u4+jkN001qfp/bQkVbyOJix
                                x6qnMmI4WY/BTTUW5Zy5whowd/GuBeUHgdgyT6d3xkV7NeGs7GATmJtrEmKF
                                64Gjfc6TcNeBsPO2kdMCqfcqgqVqswohJIdnyzzN8wQJjUGR14JcmyS+pFjitf
                                GslrUVMgKT6oSGqGaxvJo97O4rJDfwSMEYMBkw95sf20AKyMWgd0iSwLHo5KPTBjj
                                RsnY2XLejNuu8IIwYH6uLwtDPzAag45oEN9bSnQxqHlkzNy6FAjIGrOhUprB3bEwfe
                                c/2kHuhNDgrVJ5D1Tz3rPtQfzexXU1DhSUUphdAT61AXAs3Ne/Znp/YVAoPhFB7ohD
                                4iIfSmWQrL1VJHb4YTuGSAttx9AIXAUqXTMv24PviPrDdE67XU0/tI4xjA9XGlef8K
                                gZsmpskYUE3tL4TtK9QndMaZClCj3+5fIdfGgK751/W16Uc1Cj27Cs1NS1/YVKTwpl
                                qqT/V2ph8H9hfsD/n2FX5p/zdOxdRGuzZ8AIX6NqIx18DbMPa796PQ08tlbpqoyJV2
                                rf2pt/15KbB3Z/htaJvPtj4Mhb4+n36B9wmBPcfA/mYUgkJghxmcbXrAZnvf/hLYvk
                                LorgFUND6wZTe03pUiKAQ30de6RLEArjMOnfekEN4Pnl+YFzEGCcTYTkRQCG5QusEs
                                ZVii5AbccUaopBgKHQVlPq6pM8mZ53mMyyZ83tXFOH7CUMhN59tB/23cHNf7phODj0
                                dRaDoLuQqCPiSFfn4rjDRfKGekKAodVsb2AekQGEkhdHBzjQ2O9RfCfmmCLH7M/Y5k
                                b4Kk0BHTggKfTZuqmArL19J4TNwVa4odNFsTrDIEVw5muiM0E0ysMoyv2OYxvTwKjP
                                BsTPEUOmyZt6IGO0QjWuv7pSk8x2CRcMFCYbpfoLXDBCXzGCh+4VpeItbSBH92bdR4
                                XiIZe1Wk0PFEmNUaO8Mrzgz3rzBZzf8xrZaCkOO7lOArTJxmmn29IDv9TSUuM9Bq9f
                                XUl+qb7u7XSSHgn2HeCvR8tu/NO6cBshvM6zPOq3FgU8vmJZ+jU2KkpTWjU9pIT9tmZVk
                                xXzrRbNPczCIl/eLOfaVRyvvm+CfhN1FLSjkOakk5nArVAQwdBEEQROVkdepxgle6w7+HwU
                                IxLpxou99vR0pcThsZl2qUpEWOKOhuHo/4Qo2Ws/1sGT+4yhH/HCZ24To4zq660/7QET9CPOE
                                M+9P2aeK1Dncir0iP+9v6+scPIb75bSkqmrWdwXiorcoXtYMOJmuLy7TnfGsDJjdPwMz7aVat
                                s3qyzPkC946SNZwSQ3AJ1P1i13IZvzaTO/d0WMHq6RdhcrmPc7LdGv18OuPMvWrTqzkSvKKvg
                                H9zUtrPsi/NmfTNr+bIKqrAkzvG22UHBsjEuBmoJOCxoVFHdnM+CBzd5Archjd0laNbdUHM8YO
                                5KOdGX+e2A+SRRVktMA3qjvA3/IYqesyj3ieyZf5d/TbescU3Npy5+5c9qhcVub29w6yoDPKxKsz4v
                                BSLVvwAU6GwEHAgLoXzQizsKLvCOiE1mTAVp54uRFkkZMSBF7SoCjxvj3eFTiqHpSwV9ki9DeDFU5Lx
                                bw5ZmbcWIBWifz0KUE7WP4dIfrlwN3Ukgxor/UxC+6chlrT6ynA9uQG1BTP7Xns19hWN19o7OJifYiJA
                                pz3fdPr12qRmttxD8CCNmyEUAWvBOWO+Ax5uTh2fMc4XQNKPhzSc//m+FT/W85jf+oRuR/GvhP2124c1m
                                3KgXBwmHwqwyD8VAQP9+IN9aiXoyU+wcaBY0AJmhL1ji4dmc6fZGQeiKrxnWEEvLq2gPWjd8RhW0KAl+
                                1xbAyq5AK6zLxDDGwGopAOobKAVzUN4I0AeJaAXqQd04w/hUQL0QYboQUA7N3ju35XCAu5aClhCWheIo
                                PCf984r5GGpDzkP4GEJ5NpYLkCAo0fwkv3nPZ0fylu9lPWlHpYpI+LAYyr856NGADd93m3kj1JlWCh6i
                                77Kth+Uzv6Ir882A9NWqP+QEXjAKEpwwQAWnFVFUbrJVh9YAIOu3PGk7UEjYYHRzKDFBRTNzP5ggVBLP
                                Wi/Ww8V7XBoK3r/CBHpHAZtNW4u+1MfehGVRRW8TSEcGXJ4ERkS3JBrPIZCQ4zdxTYV3XMP+wthRPfE
                                8HsyRWhdDEdcCsFHocGCASVCK4a/BZR2pBM8Z0TZNU7v7k1h2ejLOJGSURQCkZTykOmvcV8Ky1l3NHBOSJH
                                8nkqEHMCKOo+ksEQ9XSId42P5rvlFP3uCcbCGqtCRpoNgmB6erQma/2GrSG8Df4rnzhUWKcUPRBNTTB9SkdfaK
                                sT8yAyql6zfzPVFqz2qHTSuHzBzrn/iZe3h2utjezpneAB8E0ywv9eFGlPh+0JhdFaPlxoh/tcBK/BWZ+IVXg8uxrn
                                div6GQsCWyuSPH2scvS3OO53uPNxV85VOVh88XzCdHFcxbDjV0k6TKzXR0gYZZ3+KCb59Tb7g+vz9mdalX533GhMaKiP
                                tR4TKSINR3x/aFeU+tUsQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBIHHf+GPpmMiew23AAAAAElFTkSuQmCC" alt="" />
                                <button onClick={() => setTypePayment(1)}>Thanh toán qua ví Momo</button>
                            </div>

                            <div className="ticketdetail-right-vnpay">
                                <img alt="" src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd2w2SHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--86c9a5822c522ee441f5a6e55a9c9cfdc61b09bc/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--15c3f2f3e11927673ae52b71712c1f66a7a1b7bd/logo%20VNPAY-02.png"/>
                                <button onClick={() => setTypePayment(2)}>Thanh toán qua ví VNPAY</button>
                            </div>
                            <div className="ticketdetail-right-local">
                                <button onClick={() => handleConfimrBookTicketLocal()}>Thanh toán mặc định</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {isOpenBookTicket && (
            <div className="bookticket" onClick={() => setIsOpenTicketDetail(false)}>
             <div className="bookticket-2" onClick={(e) => handlePropagation(e)}>
                 <div className="bookticket-left">
                    <div className="bookticket-left-header">
                        <p>Chúc mừng bạn! </p>
                        <p>Bạn đã đặt vé thành công</p>
                    </div>
                     <div className="bookticket-left-namemovie">
                         <p>{showTime.stamp}</p>
                         <h1>{showTime.name}</h1>
                     </div>
                     <div className="bookticket-left-code">
                        <h2>Mã vé: {bookTicket?.data?.id}</h2>
                     </div>
                     <div className="bookticket-left-date">
                         <div className="bookticket-left-hourtime">
                             <p>Thời gian</p>
                             <p>{hourTime.time} ~ {hourTime.endTime}</p>
                         </div>
                         <div className="bookticket-left-datetime">
                             <p>Ngày chiếu</p>
                             <p>{formattedDate}</p>
                         </div>
                     </div>
                     <div className="bookticket-left-cinema">
                         <p>Rạp</p>
                         <p>{showTime.cinemaName}</p>
                         <p>{showTime.locationDetail}</p>
                     </div>
                     <div className="bookticket-left-cinemaroom">
                         <div className="bookticket-left-room">
                             <p>Phòng chiếu</p>
                             <p>{hourTime.cinemaRoom}</p>
                         </div>
                         <div className="bookticket-left-format">
                             <p>Định dạng</p>
                             <p>2D Lồng tiếng</p>
                         </div>
                     </div>
                     <div className="bookticket-left-chairinfo">
                         <p>Ghế</p>
                         <div className="bookticket-left-chair">
                             <p>
                             {
                                 selectedChairs.map((chair,index) => (
                                     <>
                                         {index === selectedChairs.length - 1 ? chair : chair + ", "}
                                     </>
                                 ))
                             }
                             </p>
                             <h2>{formattedAmount}</h2>
                         </div>
                     </div>
                     <div className="bookticket-left-comboinfo">
                         <p>Bắp - nước</p>
                         <div className="bookticket-left-combo">
                             <p>{numCombo !== 0 ? (numCombo + " x " + dataNumCombo?.name) : ""}</p>
                             <h2>{formattedAmountCombo}</h2>
                         </div>     
                     </div>
                     <div className="bookticket-left-point">
                         <h2>Điểm được quy đổi</h2>
                         <h2>{point ? `-${(formattedMoneyPoint)}` : ""}</h2>
                     </div>
                     <div className="bookticket-left-totaltemp">
                         <h2>Tổng cộng</h2>
                         <h2>{formattedTotal}</h2>
                     </div>
                 </div>
             </div>  
            </div>
        )}

        {pending && (
         <div className = "userinfo-loading">
              <div className="lds-dual-ring"></div>
         </div>
       )}
        <ToastContainer />
   </>
  )
}

export default ChairStatus