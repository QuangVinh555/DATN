import React, { useEffect } from 'react';
import "./Personal.scss";
import NoAvatar from "../../assets/image/noAvatar.png";
import UserBig from "../../assets/image/UserBig.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { getUserPointByUserIdApi } from '../../redux/usePoint/UserPointApi';
import { getIdUserByLoginGGApi, getUserByIdApi, updateUserApi } from '../../redux/user/UserApi';
import { getBookTicketByUserIdApi } from '../../redux/bookTicket/BookTicketApi';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';

const Personal = () => {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const userPoint = useSelector(state => state.userPoint.userPoint);
  const tokenGG = useSelector(state => state.googleLogin.tokenGG);
  const bookTickets = useSelector(state => state.bookTicket.bookTickets);
  // lấy ra id user khi đăng nhập bằng gg để tạo vé
  const userLoginGG = useSelector(state => state.user.user);
  useEffect(() => {
      const getIdUserByLoginGG = async () => {
        await getIdUserByLoginGGApi(token?.email || token?.Email, dispatch);
      }
      getIdUserByLoginGG();
  },[tokenGG,token]);

  // nếu là user ở rank user nào thì sẽ hiện lên thông báo
  // const [toastDisplayed, setToastDisplayed] = useState(false);
  // useEffect(() => {
  //   if(userLoginGG?.data?.userRankId === 1){
  //     toast.info(
  //       "Bạn đang là hạng Member!",
  //       {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 2000,
  //       }      
  //     );    
  //   }else if(userLoginGG?.data?.userRankId === 2){
  //     toast.info(
  //       "Bạn đang là hạng VIP!",
  //       {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 2000,
  //       }      
  //     );    
  //   }else{
  //     toast.info(
  //       "Bạn đang là hạng VVIP!",
  //       {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 2000,
  //       }      
  //     );    
  //   }
  //   setToastDisplayed(true);
  // }, [userLoginGG, toastDisplayed])

  // lấy ra thông tin điểm thưởng dựa vào id user
  useEffect(() => {
    const getUserPointByUserId = async(userId)=> {
      await getUserPointByUserIdApi(userId, dispatch);
    }
    getUserPointByUserId(token?.Id || userLoginGG?.data?.id);

  }, [userLoginGG, token, tokenGG])

  // lịch sử thanh toán đặt vé của user
  const [page, setPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const totalPage = Math.ceil(totalItem /10);
  useEffect(() => {
    const getBookTicketByUserId = async() => {
      await getBookTicketByUserIdApi(page || 1, userPoint?.data?.userId, dispatch);
    }
    getBookTicketByUserId();
  }, [page, userPoint, token])

  // thêm class active vào trang click khi hiển thị trang đó
  useEffect(() => {
    const liElement = document.querySelector(".selected");
    if(liElement?.classList.contains("selected")){
      liElement?.classList.add("active");
    }
  },[page, userPoint, token])

  // tổng chi tiêu
  const [totalSpending, setTotalSpending] = useState(0);
  
  useEffect(() => {
    let total = 0;
    bookTickets.forEach(item => {
      if(total === 0){
        setTotalItem(item.totalPage);  
        setTotalSpending(item?.data?.totalAll || 0)
      }
    })
  })

  // phân trang khi click vào số trang
  const handlePageClick = (e) => {
    setPage(() => e.selected + 1);
  }

   // format VNĐ total all
   const formattedTotalAll = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
}).format(totalSpending);

  useEffect(() => {
    // quá trình tăng điểm của thanh cột mốc
    const progressValue = (totalSpending / 10000000) * 100;
    const progressBar = document.querySelector('.personal-right-point-progress');
    progressBar?.style.setProperty('--progress-value', `${progressValue}%`);
  })

  //khi nào đủ mức điểm lên hạng thì sẽ cập nhật;
  useEffect(() => {
    const updateUserRankByUser = async (userId) => {
      if(totalSpending >= 5500000 && totalSpending < 10000000){
         const updateUser = {
            userRankId: 2
         }
         await updateUserApi(updateUser, userId, dispatch)
      }else if(totalSpending >= 10000000){
        const updateUser = {
          userRankId: 3
       }
       await updateUserApi(updateUser, userId, dispatch)
      }
    }
    updateUserRankByUser(token?.Id || userLoginGG?.data?.id)
  }, [totalSpending])
  return (
    <div className="personal">
        <div className="personal-2">
            <div className="personal-header">
              <div className="personal-header-left">
                <div className="personal-header-left-info">
                  <img className="personal-header-left-info-big" src={UserBig} alt="" />
                  <img className="personal-header-left-info-small" src={NoAvatar} alt="" />
                  <h2>{userPoint?.data.fullName}</h2>
                </div>
              </div>
              <div className="personal-header-right">
                <div className="personal-header-right-point">
                  <div className="personal-right-point-milestones">
                    <h2>Điểm</h2>
                    <div className="personal-right-point-progress">
                      <div class="progress-bar__marker">
                        {/* <p>Member</p> */}
                      </div>
                      <div class="progress-bar__marker">
                        <p>VIP</p>
                      </div>
                      <div class="progress-bar__marker">
                        <p>VVIP</p>
                      </div>
                    </div>
                  </div>
                  <div className="personal-right-point-data">
                    <div className="personal-right-point-total">
                      <h2>Tổng chi tiêu</h2>
                      <h2>{formattedTotalAll}</h2>
                    </div>
                    <div className="personal-right-point-rewardpointed">
                      <h2>Điểm thưởng</h2>
                      <h2>{userPoint?.data.rewardPoints}</h2>
                    </div>
                  </div>
                  <div className="personal-right-point-rank">
                    <h2>Hạng:</h2>
                    <h2>{userLoginGG?.data?.userRankId === 1 && "Member" || userLoginGG?.data?.userRankId === 2 && "VIP" || "VVIP" }</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="personal-content">
              <div className="personal-content-header">
                <h1>Lịch sử thanh toán</h1>
              </div>

              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={(e)=>handlePageClick(e)}
                pageRangeDisplayed={5}
                pageCount={totalPage}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
              />
              <table className="userinfo-table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Ngày đặt vé</th>
                    <th scope="col">Phim</th>
                    <th scope="col">Rạp chiếu</th>
                    <th scope="col">Phòng chiếu</th>
                    <th scope="col">Suất chiếu</th>
                    {/* <th scope="col">Ghế</th> */}
                    <th scope="col">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    bookTickets.map((bookTicket,index) => {
                    let formattedDate = new Date(bookTicket?.data.createdAt).toLocaleDateString('en-GB');
                    // format VNĐ combo
                    const formattedTotal = new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(bookTicket?.data.total);
                      return (
                        <tr key={bookTicket?.data?.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{formattedDate}</td>
                          <td>{bookTicket?.data?.movie}</td>
                          <td>{bookTicket?.data?.cinemaName}</td>
                          <td>{bookTicket?.data?.cinemaRoom}</td>
                          <td style={{textAlign: 'center'}}>{bookTicket?.data?.hourTimeStart}</td>
                          {/* <td style={{textAlign: 'center'}}>
                            <p>E7,E8</p>
                          </td> */}
                          <td style={{color: '#D82D8B'}}>{formattedTotal}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
        </div>
        <ToastContainer />
    </div>
  )
}

export default Personal