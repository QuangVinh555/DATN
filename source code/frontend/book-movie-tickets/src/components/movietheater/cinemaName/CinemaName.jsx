import React, { useEffect, useState } from "react";
import "./CinemaName.scss";
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
import { createCinemaNameApi, getAllCinemaNamesApi, getAllCinemaNamesByPageApi } from "../../../redux/cinemaName/CinemaNameApi";
import { getAllSearchLocationApi } from "../../../redux/location/LocationApi";
import { getAllUserTypesApi } from "../../../redux/userType/UserTypeApi";
import { getAllCinemaTypesApi } from "../../../redux/cinemaType/CinemaTypeApi";

const CinemaName = () => {
  const dispatch = useDispatch();
  
  const pending = useSelector(state => state.cinemaName.pending);
  const error = useSelector(state => state.cinemaName.error);

  // phân trang page
  const [page, setPage] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const totalPage = Math.ceil(totalItem /10);

  // back first page
  const handleBack = () => {
    dispatch(updatedTitle(""));
    dispatch(updatedChecked(false));
  };

  // show dialog add new user
  const [openAddUser, setOpenAddUser] = useState(false);
  const handleOpenAddUser = () => {
    setOpenAddUser(true);
  };


  // cancel dialog add new user
  const handleCancelDialogAddUser = () => {
    setOpenAddUser(false);
  };

  // tránh sự kiện nỗi bọt từ thẻ cha khi cancel dialog add new user
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  // lấy tất cả thông tin user
  const cinemaNames = useSelector((state) => state.cinemaName.cinemaNames);
  const cinemaName = useSelector((state) => state.cinemaName.cinemaName);
  console.log(cinemaNames)
  // lấy tất cả thông tin location
  const locations = useSelector((state) => state.location.listSearch);

  // lấy tất cả thông tin location
  const cinemaTypes = useSelector((state) => state.cinemaType.cinemaTypes);

  // get all api user
  useEffect(() => {
    getAllCinemaNamesByPageApi(page || 1, dispatch);
  }, [dispatch, cinemaName, page]);
 
  // get all api location khi open add new cinemaName
  useEffect(() => {
    getAllSearchLocationApi(dispatch);
  }, [openAddUser]);

    // get all api cinema type khi open add new cinemaName
    useEffect(() => {
      getAllCinemaTypesApi(dispatch);
    }, [openAddUser]);

  // listen event onChanghe form add new user
  const [cinemaType, setCinemaType] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [locationDetail, setLocationDetail] = useState("");

  // add new user success
  const handleNotify = async () => {
    if (
      location === "" ||
      cinemaType === "" ||
      name === "" ||
      locationDetail === "" 
    ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } 
    else{
      const newCinemaType = {
        locationId: parseInt(location),
        cinemaTypeId: parseInt(cinemaType),
        name: name,
        locationDetail: locationDetail,
      };
      await createCinemaNameApi(newCinemaType, dispatch);  
      // console.log(newCinemaType);
      
        toast.success(
          "Thêm thành công",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
        setOpenAddUser(false);  
        setLocation("");
        setCinemaType("");
        setName("");
        setLocationDetail("");
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
    cinemaNames.map(item => {
      i++;
      if(i === 1){
        setTotalItem(item.totalPage);
      }
    })
  }, [cinemaNames])


//////////////////FORM EDIT//////////////////


  // listen event onChanghe form edit user
  const [locationEdit, setLocationEdit] = useState("");
  const [locationNameEdit, setLocationNameEdit] = useState("");
  const [cinemaTypeEdit, setCinemaTypeEdit] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [locationDetailEdit, setLocationDetailEdit] = useState("");
  console.log(locationEdit);
  console.log(locationNameEdit);

  // data nhận lại khi click edit
  const [data, setData] = useState({});

  // show dialog edit user
  const [openEditUser, setOpenEditUser] = useState(false);
  const handleOpenEditUser = (cinemaName) => {
    setOpenEditUser(true);
    setData(cinemaName);
    console.log(cinemaName)
  }

  useEffect(() => {
    setLocationEdit(data.locationId || "");
    setLocationNameEdit(data.location || "");
    setCinemaTypeEdit(data.fullname || "");
    setNameEdit(data.email || "");
    setLocationDetailEdit(data.password || "");
  }, [data])


  // cancel dialog edit user
  const handleCancelDialogEditUser = () => {
    setOpenEditUser(false);
  };

  // update user success
  const handleNotifyEdit = async () => {
    if (
      locationEdit === "" ||
      nameEdit === "" ||
      cinemaTypeEdit === "" ||
      locationDetailEdit === ""
    ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    
    else{ 
        const newUser = {
          avatar: data.avatar || "",
          fullname: nameEdit,
          
        };
        console.log(newUser);
        await updateUserApi(newUser, data.id, dispatch);  
        if(error) {
          toast.error(
            "Lỗi kết nối đến server",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }      
          );      
        } 
        else{
            toast.success(
              "Cập nhật thông tin thành công !",
              {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              }      
            );    
            setOpenEditUser(false);  
        }
    } 
  }

  // show dialog confirm delete user
  const [dialogDelete, setDialogDelete] = useState(false);

  // lưu lại id user khi click xóa
  const [saveDialogUser, setSaveDialogUser] = useState();

  // show dialog delete
  const handleDeleteUser = async(user) => {
    setDialogDelete(true);
    setSaveDialogUser(user);
  }
  
  // confirm dialog delete 
  const handleConfirmDeleteUser = async () => {
    await deleteUserApi(saveDialogUser.id, dispatch);
    setDialogDelete(false);
    toast.success(
      "Xóa người dùng này thành công !",
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      }      
    );    
  }

  // seach info user
  const [search, setSearch] = useState("");
  const [checkSearch, setCheckSearch] = useState(false);
  const [resultSearch, setResultSearch] = useState();
  const listSearchResults = useSelector(state => state.cinemaName.listSearch);

  // get all user
  useEffect(() => {
      const fetchGetAll = async() =>{
        await getAllCinemaNamesApi(dispatch);
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
        if(item.data.name?.toLowerCase().includes(search)){
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
        dialogDelete && (
          <div className="userinfo-dialog-delete">
            <div className="userinfo-dialog-deleteForm">
              <InfoIcon />
              <span>Xác nhận</span>
              <p>Bạn có chắc xóa người dùng này không!</p>
              <div className="userinfo-dialog-delete-btn">
                <button onClick={() => handleConfirmDeleteUser()}>OK</button>
                <button onClick={() => setDialogDelete(false)}> Hủy</button>
              </div>
            </div>
          </div>
        )
      }
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
          <h1>Thông tin user</h1>
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
          Add new Cinema Name
        </button>
      </div>
      <table className="userinfo-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Location</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          
          { 
          checkSearch ? (
            <tr>
              <th scope="row">{resultSearch?.data?.id}</th>
              <td>{resultSearch?.data?.name}</td>
              <td>{resultSearch?.data?.locationDetail}</td>
              <td>
                <EditIcon onClick={() => handleOpenEditUser(resultSearch?.data)} />
                <DeleteIcon onClick={() => handleDeleteUser(resultSearch?.data)}/>
              </td>
            </tr>
          ) :
          cinemaNames?.map((cinemaName, index) => (
            <tr key={cinemaName.data.id}>
              <th scope="row">{index + 1}</th>
             
              <td>{cinemaName.data.name}</td>
              <td className="cinemaName-location">{cinemaName.data.locationDetail}</td>
              <td>
                <EditIcon onClick={() => handleOpenEditUser(cinemaName.data)} />
                <DeleteIcon onClick={() => handleDeleteUser(cinemaName.data)}/>
              </td>
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
              <h1>Add new Cinema Name</h1>
              <CancelIcon onClick={() => handleCancelDialogAddUser()} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info">
                    <label>Location: </label>
                    <select onChange={(e) => setLocation(e.target.value)} >
                      <option defaultValue="1" selected disabled hidden>Choose here</option>
                      {
                        locations.map(location => (
                          <option value={location.data.id} key={location.data.id}>{location.data.province}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="userinfo-dialog-info">
                  <label>Cinema Type: </label>
                    <select onChange={(e) => setCinemaType(e.target.value)}>
                    <option defaultValue="" selected disabled hidden>Choose here</option>
                      {
                        cinemaTypes.map(cinemaType => (
                          <option value={cinemaType.data.id} key={cinemaType.data.id}>{cinemaType.data.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Name: </label>
                    <input
                      type="text"
                      placeholder="CGV Thủ Đức"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Location Detail: </label>
                    <textarea
                      placeholder="Nhập thông tin địa chỉ của rạp"
                      onChange={(e) => setLocationDetail(e.target.value)}
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

      {/* open form edit user */}
      {openEditUser && (
        <div
          className="userinfo-dialogAdd"
          onClick={() => handleCancelDialogEditUser()}
        >
          <div
            className="userinfo-dialogAddContainer"
            onClick={(e) => handlePropagation(e)}
          >
            <div className="userinfo-dialog-header">
              <h1>Edit User</h1>
              <CancelIcon onClick={() => handleCancelDialogEditUser()} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                
              </div>
              <div className="userinfo-dialog-right">
               <form>
                  <div className="userinfo-dialog-info">
                    <label>Location: </label>
                    <select onChange={(e) => setLocationEdit(e.target.value)} >
                      <option defaultValue="1" selected disabled hidden>Choose here</option>
                      {
                        locations.map(location => (
                          <option value={location.data.id} key={location.data.id}>{location.data.province}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="userinfo-dialog-info">
                  <label>Cinema Type: </label>
                    <select onChange={(e) => setCinemaTypeEdit(e.target.value)}>
                    <option defaultValue="" selected disabled hidden>Choose here</option>
                      {
                        cinemaTypes.map(cinemaType => (
                          <option value={cinemaType.data.id} key={cinemaType.data.id}>{cinemaType.data.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Name: </label>
                    <input
                      type="text"
                      placeholder="CGV Thủ Đức"
                      onChange={(e) => setNameEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Location Detail: </label>
                    <textarea
                      placeholder="Nhập thông tin địa chỉ của rạp"
                      onChange={(e) => setLocationDetailEdit(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="userinfo-dialog-footer">
              <button onClick={() => handleNotifyEdit()}>Lưu lại</button>
              <button onClick={() => handleCancelDialogEditUser()}>Hủy</button>
            </div>
          </div>
        </div>
      )}
      {/* toast message success */}
      <ToastContainer />    
    </div>
  );
};

export default CinemaName;
