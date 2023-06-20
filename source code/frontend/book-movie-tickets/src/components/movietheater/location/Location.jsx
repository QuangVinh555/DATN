import React, { useEffect, useState } from "react";
import "./Location.scss";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  updatedChecked,
  updatedTitle,
} from "../../../redux/global/GlobalSlice";
import NoAvatar from "../../../assets/image/noAvatar.png";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserApi, deleteUserApi, getAllSearchUserApi, getAllUsersApi, updateUserApi } from "../../../redux/user/UserApi";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import InfoIcon from '@mui/icons-material/Info';
import { userError } from "../../../redux/user/UserSlice";
import { createLocationApi, getAllSearchLocationApi, getAllUsersByPageApi} from "../../../redux/location/LocationApi";


const Location = () => {
  const dispatch = useDispatch();
  
  const pending = useSelector(state => state.location.pending);
  const error = useSelector(state => state.location.error);

  // phân trang page
  const [page, setPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const totalPage = Math.ceil(totalItem /10);

  // back first page
  const handleBack = () => {
    dispatch(updatedTitle(""));
    dispatch(updatedChecked(false));
  };

  // show dialog add new location
  const [openAddUser, setOpenAddUser] = useState(false);
  const handleOpenAddUser = () => {
    dispatch(userError(false));
    setOpenAddUser(true);
  };


  // cancel dialog add new location
  const handleCancelDialogAddUser = () => {
    setOpenAddUser(false);
  };

  // tránh sự kiện nỗi bọt từ thẻ cha khi cancel dialog add new loacation
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  // lấy tất cả thông tin location
  const locations = useSelector((state) => state.location.locations);
  const location = useSelector((state) => state.location.location);

  // get all api location
  useEffect(() => {
    getAllUsersByPageApi(page || 1, dispatch);
  }, [dispatch, location, page]);


  // listen event onChanghe form add new location
  const [province, setProvince] = useState("");


  // add new user success
  const handleNotify = async () => {
    if (province === "" ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }else{
      const newProvince = {
        province: province,
      };

      await createLocationApi(newProvince, dispatch);  
      if(error) {
        toast.error(
          "Lỗi kết nối đến server",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );      
      } else{
        toast.success(
          "Thêm thành công",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
          setOpenAddUser(false);  
      }
    }
  };

  // phân trang khi click vào số trang
  const handlePageClick = (e) => {
    setPage(() => e.selected + 1);
  }

  // thêm class active vào trang click khi hiển thị trang đó
  useEffect(() => {
    const liElement = document.querySelector(".selected");
    if(liElement?.classList.contains("selected")){
      liElement?.classList.add("active");
    }
  },[page])

  // lấy ra thông tin tổng các list user
  useEffect(() => {
    let i = 0;
    locations.map(item => {
      i++;
      if(i === 1){
        setTotalItem(item.totalPage);
      }
    })
  }, [locations])


//////////////////search//////////////////

  
  // seach info user
  const [search, setSearch] = useState("");
  const [checkSearch, setCheckSearch] = useState(false);
  const [resultSearch, setResultSearch] = useState();
  const listSearchResults = useSelector(state => state.location.listSearch);

  // get all user
  useEffect(() => {
      const fetchGetAll = async() =>{
        await getAllSearchLocationApi(dispatch);
      }
      fetchGetAll();
  }, [checkSearch]);
  
  // check search = "" thì trả về lại kq ban đầu
  useEffect(() => {
    if(search === ""){
      setCheckSearch(false);
    }
  }, [search])

  const [isCheckSearch, setIsCheckSearch] = useState("");
  // result search user
  const handleSearchResult =  async() => {
    setResultSearch("");
    if(search === ""){
      setCheckSearch(false);
    }else{
      setCheckSearch(true);
      let dem = 0;
      listSearchResults.map(item => {
        if(item.data.province?.toLowerCase().includes(search)){
          setResultSearch(item)
          dem++;
        }
      })
      if(dem === 0){
        setIsCheckSearch("Không tìm thấy thông tin");
      }
    }
  }

    return (
    <div className="userinfo">
      {
        pending && (
          <div className = "userinfo-loading">
            <div className="lds-dual-ring"></div>
          </div>
        )
      }
      <div className="userinfo-header">
        <button className="userinfo-arrowleft" onClick={() => handleBack()}>
          <KeyboardDoubleArrowLeftIcon />
          Quay lại
        </button>
        <div className="userinfo-title">
          <h1>Location</h1>
        </div>
      </div>
      <div className="userinfo-search">
        <div className="userinfo-searchFlex">
          <input
            type="text"
            placeholder="Tìm kiếm thông tin user"
            className="userinfo-input"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="userinfo-btnSearch" onClick={() => handleSearchResult()}>Tìm kiếm</button>
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
        <button
          className="userinfo-btnAddUser"
          onClick={() => handleOpenAddUser()}
        >
          <PersonAddIcon className="userinfo-adduser" />
          Add new Location
        </button>
      </div>
      <table className="userinfo-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Province</th>
          </tr>
        </thead>
        <tbody>
          
          { 
          checkSearch ? (
            <tr>
              <th scope="row">{resultSearch?.data?.id}</th>
              <td>{resultSearch?.data?.province}</td>
            </tr>
          ) :
          locations.map((location, index) => (
            <tr key={location.data.id}>
              <th scope="row">{index + 1}</th>        
              <td>{location.data.province}</td>
            </tr>
          ))}
        </tbody>
      </table>
     
     {/* open form add new user */}
     {openAddUser && (
        <div
          className="userinfo-dialogAdd"
          onClick={() => handleCancelDialogAddUser()}
        >
          <div
            className="userinfo-dialogAddContainer"
            onClick={(e) => handlePropagation(e)}
          >
            <div className="userinfo-dialog-header">
              <h1>Add new Province</h1>
              <CancelIcon onClick={() => handleCancelDialogAddUser()} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info location-dialog-info">
                    <label>Province: </label>
                    <input
                      type="name"
                      placeholder="TP. Hồ Chí Minh"
                      onChange={(e) => setProvince(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="userinfo-dialog-footer">
              <button onClick={() => handleNotify()}>Lưu lại</button>
              <button onClick={() => handleCancelDialogAddUser()}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {/* toast message success */}
      <ToastContainer />    
    </div>
  );
};

export default Location;
