import React, { useEffect, useState } from "react";
import "./CinemaType.scss";
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
import InfoIcon from '@mui/icons-material/Info';
import { createCinemaTypeApi, deleteCinemaTypeApi, getAllCinemaTypesApi, updateCinemaTypeApi } from "../../../redux/cinemaType/CinemaTypeApi";

const CinemaType = () => {
  const dispatch = useDispatch();
  
  const pending = useSelector(state => state.cinemaType.pending);
  const error = useSelector(state => state.cinemaType.error);

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
    setImage("");
  };

  // tránh sự kiện nỗi bọt từ thẻ cha khi cancel dialog add new user
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  // lấy tất cả thông tin user
  const cinemaTypes = useSelector((state) => state.cinemaType.cinemaTypes);
  const cinemaType = useSelector((state) => state.cinemaType.cinemaType);

  // get all api user
  useEffect(() => {
    getAllCinemaTypesApi(dispatch);
  }, [dispatch, cinemaType]);
 

  // listen event onChanghe form add new user
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  // add new user success
  const handleNotify = async () => {
    if (name === "" ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } 
    else{
      if (image !== "") {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "upload");
        try {
          const uploadImage = await axios.post(
            "https://api.cloudinary.com/v1_1/quangvinh255/image/upload",
            data
          );
          const { url } = uploadImage.data;
          const newCinemaType = {
            logo: url,
            name: name,
          
          };
          await createCinemaTypeApi(newCinemaType, dispatch);  
            toast.success(
              "Thêm thành công",
              {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              }      
            );    
              setOpenAddUser(false);  
              setImage("")        
        } catch (error) {
          toast.error(
            "Lỗi kết nối đến file hình ảnh!",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );      
      }
      }else{
        const newCinemaType = {
          name: name
        }
        await createCinemaTypeApi(newCinemaType, dispatch);
        toast.success(
          "Thêm thành công",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
          setOpenAddUser(false);  
          setImage("")
      }
    }
  };


//////////////////FORM EDIT//////////////////


  // listen event onChanghe form edit user
  const [imageEdit, setImageEdit] = useState("");
  const [nameEdit, setNameEdit] = useState("");

  // data nhận lại khi click edit
  const [data, setData] = useState({});

  // show dialog edit user
  const [openEditUser, setOpenEditUser] = useState(false);
  const handleOpenEditUser = (cinemaType) => {
    setOpenEditUser(true);
    setData(cinemaType);
  }

  useEffect(() => {
    setImageEdit(data.logo || "");
    setNameEdit(data.name || "");
  }, [data])


  // cancel dialog edit user
  const handleCancelDialogEditUser = () => {
    setOpenEditUser(false);
    setImageEdit("");
  };

  // update user success
  const handleNotifyEdit = async () => {
    if (nameEdit === "") {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    
    else{ 
      if (imageEdit !== "") {
        const data = new FormData();
        data.append("file", imageEdit);
        data.append("upload_preset", "upload");
        try {
          const uploadImage = await axios.post(
            "https://api.cloudinary.com/v1_1/quangvinh255/image/upload",
            data
          );
          const { url } = uploadImage.data;
          const newCinemaType = {
            logo: url,
            name: nameEdit,
          
          };
          await updateCinemaTypeApi(newCinemaType, 11, dispatch);  
            toast.success(
              "Thêm thành công",
              {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
              }      
            );    
              setOpenAddUser(false);  
              setImage("")        
        } catch (error) {
          console.log(error)
          toast.error(
            "Lỗi kết nối đến file hình ảnh!",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );      
        }
      }else{
        const newCinemaType = {
          logo: data.logo || "",
          name: nameEdit,   
        };
        await updateCinemaTypeApi(newCinemaType, data.id, dispatch);  
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
    await deleteCinemaTypeApi(saveDialogUser.id, dispatch);
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
  const listSearchResults = useSelector(state => state.cinemaType.cinemaTypes);

  // get all user
  useEffect(() => {
      const fetchGetAll = async() =>{
        await getAllSearchUserApi(dispatch);
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

        <button
          className="userinfo-btnAddUser"
          onClick={() => handleOpenAddUser()}
        >
          <PersonAddIcon className="userinfo-adduser" />
          Add new Type Cinema
        </button>
      </div>
      <table className="userinfo-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          
          { 
          checkSearch ? (
            <tr>
              <th scope="row">{resultSearch?.data?.id}</th>
              <td>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="userinfo-table-img"
                    src={resultSearch?.data?.logo || NoAvatar}
                    alt=""
                  />
                  {resultSearch?.data?.name}
                </span>
              </td>
              <td>
                <EditIcon onClick={() => handleOpenEditUser(resultSearch?.data)} />
                <DeleteIcon onClick={() => handleDeleteUser(resultSearch?.data)}/>
              </td>
            </tr> 
          ) :
          cinemaTypes.map((cinemaType, index) => (
            <tr key={cinemaType.data.id}>
              <th scope="row">{index + 1}</th>
              <td>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="userinfo-table-img"
                    src={cinemaType.data.logo || NoAvatar}
                    alt=""
                  />
                  {cinemaType.data.name}
                </span>
              </td>           
              <td>
                <EditIcon onClick={() => handleOpenEditUser(cinemaType.data)} />
                <DeleteIcon onClick={() => handleDeleteUser(cinemaType.data)}/>
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
              <h1>Add new Type Cinema</h1>
              <CancelIcon onClick={() => handleCancelDialogAddUser()} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                <img
                  src={image ? URL.createObjectURL(image) : NoAvatar}
                  alt=""
                />
                <div className="userinfo-dialog-image">
                  <label>Image: </label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Name: </label>
                    <input
                      type="text"
                      placeholder="CGV"
                      onChange={(e) => setName(e.target.value)}
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
              <h1>Edit Type Cinema</h1>
              <CancelIcon onClick={() => handleCancelDialogEditUser()} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                <img
                  src={NoAvatar}
                  alt=""
                />
                <div className="userinfo-dialog-image">
                  <label>Image: </label>
                  <input
                    type="file"
                    onChange={(e) => setImageEdit(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info">
                    <label>Name: </label>
                    <input
                      type="name"
                      placeholder="CGV"
                      value={nameEdit}
                      onChange={(e) => setNameEdit(e.target.value)}
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

export default CinemaType;
