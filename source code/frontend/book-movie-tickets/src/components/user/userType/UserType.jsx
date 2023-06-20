import React, { useEffect, useState } from "react";
import "./UserType.scss";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  updatedChecked,
  updatedTitle,
} from "../../../redux/global/GlobalSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from '@mui/icons-material/Info';
import { createUserTypeApi, deleteUserTypeApi, getAllUserTypesApi, updateUserTypeApi } from "../../../redux/userType/UserTypeApi";

const UserType = () => {
  const dispatch = useDispatch();
  
  const pending = useSelector(state => state.userType.pending);
  const error = useSelector(state => state.userType.error);

  // back first page
  const handleBack = () => {
    dispatch(updatedTitle(""));
    dispatch(updatedChecked(false));
  };

  // show dialog add new user
  const [openAddUser, setOpenAddUser] = useState(false);
  const handleOpenAddUser = () => {
    setName("")
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
  const userTypes = useSelector((state) => state.userType.userTypes);
  const userType = useSelector((state) => state.userType.userType);

  // get all api user
  useEffect(() => {
    getAllUserTypesApi(dispatch);
  }, [dispatch, userType]);
 
 
  // ===========create===========
  // listen event onChanghe form add new user
  const [name, setName] = useState("");
  // add new user success
  const handleNotify = async () => {
    if (name === "") {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else{
        const newUserType = {
          name: name,    
        };
        await createUserTypeApi(newUserType, dispatch);  
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
  }

//////////////////FORM EDIT//////////////////

  // listen event onChanghe form edit userType
  const [nameEdit, setNameEdit] = useState("");
  
  // data nhận lại khi click edit
  const [data, setData] = useState({});

  // show dialog edit userType
  const [openEditUser, setOpenEditUser] = useState(false);
  const handleOpenEditUser = (userType) => {
    setOpenEditUser(true)
    setData(userType);
  }

  useEffect(() => {
    setNameEdit(data.name || "");
  }, [data])


  // cancel dialog edit user
  const handleCancelDialogEditUser = () => {
    setOpenEditUser(false);
  };

  // update user success
  const handleNotifyEdit = async () => {
    if (nameEdit === "" ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }   
    else{ 
        const newUserType = {
          name: nameEdit,
        };
        await updateUserTypeApi(newUserType, data.id, dispatch);  
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

  // ==========delete===========
  // show dialog confirm delete user
  const [dialogDelete, setDialogDelete] = useState(false);

  // lưu lại id user khi click xóa
  const [saveDialogUser, setSaveDialogUser] = useState();

  // show dialog delete
  const handleDeleteUser = async(userType) => {
    setDialogDelete(true);
    setSaveDialogUser(userType);
  }
  
  // confirm dialog delete 
  const handleConfirmDeleteUser = async () => {
    await deleteUserTypeApi(saveDialogUser.id, dispatch);
    setDialogDelete(false);
    toast.success(
      "Xóa người dùng này thành công !",
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      }      
    );    
  }


  // ======== search ===========
  // seach info user
  const [search, setSearch] = useState("");
  const [checkSearch, setCheckSearch] = useState(false);
  const [resultSearch, setResultSearch] = useState();
  const listSearchResults = useSelector(state => state.userType.userTypes);
  
  // check search = "" thì trả về lại kq ban đầu
  useEffect(() => {
    if(search === ""){
      setCheckSearch(false);
    }
  }, [search])

  // result search user
  const handleSearchResult =  async() => {
    setResultSearch("");
    if(search === ""){
      setCheckSearch(false);
    }else{
      setCheckSearch(true);
      listSearchResults.map(item => {
        if(item.data.name?.toLowerCase().includes(search)){
          setResultSearch(item)
        }
      })
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
          <h1>Thông tin loại quyền User</h1>
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
          Add new UserType
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
            <th scope="row">{resultSearch.data?.id}</th>       
            <td>{resultSearch.data?.name}</td>      
            <td>
              <EditIcon onClick={() => handleOpenEditUser(resultSearch?.data)} />
              <DeleteIcon onClick={() => handleDeleteUser(resultSearch?.data)}/>
            </td>
          </tr>
          ) :
          userTypes.map((userType, index) => (
            <tr key={userType.data.id}>
              <th scope="row">{index + 1}</th>       
              <td>{userType.data.name}</td>      
              <td>
                <EditIcon onClick={() => handleOpenEditUser(userType.data)} />
                <DeleteIcon onClick={() => handleDeleteUser(userType.data)}/>
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
              <h1>Add new Type User</h1>
              <CancelIcon onClick={() => handleCancelDialogAddUser()} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left"> 
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info">
                    <label>Name: </label>
                    <input
                      type="name"
                      placeholder="Admin"
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
              <h1>Edit Type User</h1>
              <CancelIcon onClick={() => handleCancelDialogEditUser()} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info">
                    <label>Name: </label>
                    <input
                      type="name"
                      placeholder="Admin"
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

export default UserType;
