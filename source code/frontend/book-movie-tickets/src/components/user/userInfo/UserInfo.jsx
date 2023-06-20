import React, { useEffect, useState } from "react";
import "./UserInfo.scss";
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

const UserInfo = () => {
  const dispatch = useDispatch();
  
  const pending = useSelector(state => state.user.pending);
  const error = useSelector(state => state.user.error);

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
    setImage("");
  };

  // tránh sự kiện nỗi bọt từ thẻ cha khi cancel dialog add new user
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  // lấy tất cả thông tin user
  const users = useSelector((state) => state.user.users);
  const user = useSelector((state) => state.user.user);

  // get all api user
  useEffect(() => {
    getAllUsersApi(page || 1, dispatch);
  }, [dispatch, user, page]);
 
  // format yyyy-mm--dd -> dd/mm/yy
  function formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(2), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + "/" + month + "/" + year;
  }
  formatDate("2010/01/18"); // "18/01/10"

  // listen event onChanghe form add new user
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // add new user success
  const handleNotify = async () => {
    if (
      image === "" ||
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      date === "" ||
      phone === "" ||
      address === ""
    ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else if (password.localeCompare(confirmPassword)) {
      toast.error("Mật khẩu không khớp !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }

    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "upload");
      try {
        const uploadImage = await axios.post(
          "https://api.cloudinary.com/v1_1/quangvinh255/image/upload",
          data
        );
        const { url } = uploadImage.data;

        const newUser = {
          avatar: url,
          fullname: name,
          email: email,
          password: password,
          date: date,
          phoneNumber: phone,
          address: address,
        };

        await createUserApi(newUser, dispatch);  
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
            setImage("")
        }
      
      } catch (error) {
        toast.error(
          "Lỗi kết nối đến file hình ảnh!",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );      
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
    users.map(item => {
      i++;
      if(i === 1){
        setTotalItem(item.totalPage);
      }
    })
  }, [users])


//////////////////FORM EDIT//////////////////


  // listen event onChanghe form edit user
  const [imageEdit, setImageEdit] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [passwordEdit, setPasswordEdit] = useState("");
  const [confirmPasswordEdit, setconfirmPasswordEdit] = useState("");
  const [dateEdit, setDateEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");
  const [addressEdit, setAddressEdit] = useState("");

  // data nhận lại khi click edit
  const [data, setData] = useState({});

  // show dialog edit user
  const [openEditUser, setOpenEditUser] = useState(false);
  const handleOpenEditUser = (user) => {
    setOpenEditUser(true);
    setData(user);
  }

  useEffect(() => {
    setImageEdit(data.avatar || "");
    setNameEdit(data.fullname || "");
    setEmailEdit(data.email || "");
    setPasswordEdit(data.password || "");
    setDateEdit(data.date || "");
    setPhoneEdit(data.phoneNumber || "");
    setAddressEdit(data.address || "");
  }, [data])


  // cancel dialog edit user
  const handleCancelDialogEditUser = () => {
    setOpenEditUser(false);
    setImageEdit("");
  };

  // update user success
  const handleNotifyEdit = async () => {
    if (
      // image === "" ||
      nameEdit === "" ||
      emailEdit === "" ||
      passwordEdit === "" ||
      confirmPasswordEdit === "" ||
      dateEdit === "" ||
      phoneEdit === "" ||
      addressEdit === ""
    ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }else if (passwordEdit.localeCompare(confirmPasswordEdit)) {
      toast.error("Mật khẩu không khớp !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
    
    else{ 
        const newUser = {
          avatar: data.avatar || "",
          fullname: nameEdit,
          email: emailEdit,
          password: passwordEdit,
          date: dateEdit,
          phoneNumber: phoneEdit,
          address: addressEdit,
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
            setconfirmPasswordEdit("");
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
  const listSearchResults = useSelector(state => state.user.listSearch);

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
        if(item.data.fullname?.toLowerCase().includes(search)){
          setResultSearch(item)
          dem++;
        }
      })
      if(dem === 0){
        setIsCheckSearch("Không tìm thấy thông tin");
      }
    }
  }
    console.log(users);
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
          Add new User
        </button>
      </div>
      <table className="userinfo-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">FullName</th>
            <th scope="col">Rank</th>
            <th scope="col">Date</th>
            <th scope="col">PhoneNumber</th>
            <th scope="col">Address</th>
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
                    src={resultSearch?.data?.avatar || NoAvatar}
                    alt=""
                  />
                  {resultSearch?.data?.fullname}
                </span>
              </td>
              <td>{resultSearch?.data?.userRank}</td>
              {/* <td>{resultSearch.data?.date ? user.data?.date.split('T')[0] : ''}</td> */}
              <td>
                {resultSearch?.data?.date ? formatDate(resultSearch?.data?.date.split("T")[0]) : ""}
              </td>
              <td>{resultSearch?.data?.phoneNumber}</td>
              <td>{resultSearch?.data?.address}</td>
              <td>
                <EditIcon onClick={() => handleOpenEditUser(resultSearch?.data)} />
                <DeleteIcon onClick={() => handleDeleteUser(resultSearch?.data)}/>
              </td>
            </tr> || (<h1>{isCheckSearch && isCheckSearch}</h1>)
          ) :
          users.map((user, index) => (
            <tr key={user.data.id}>
              <th scope="row">{index + 1}</th>
              <td>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <img
                    className="userinfo-table-img"
                    src={user.data.avatar || NoAvatar}
                    alt=""
                  />
                  {user.data.fullname}
                </span>
              </td>
              <td>{user.data.userRank}</td>
              {/* <td>{user.data.date ? user.data.date.split('T')[0] : ''}</td> */}
              <td>
                {user.data.date ? formatDate(user.data.date.split("T")[0]) : ""}
              </td>
              <td>{user.data.phoneNumber}</td>
              <td>{user.data.address}</td>
              <td>
                <EditIcon onClick={() => handleOpenEditUser(user.data)} />
                <DeleteIcon onClick={() => handleDeleteUser(user.data)}/>
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
              <h1>Add new User</h1>
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
                  <div className="userinfo-dialog-info">
                    <label>Name: </label>
                    <input
                      type="name"
                      placeholder="Nguyen Van A"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Email: </label>
                    <input
                      type="email"
                      placeholder="admin@gmail.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Date: </label>
                    <input
                      type="date"
                      placeholder="14/02/2023"
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Password: </label>
                    <input
                      type="password"
                      placeholder="Password phải nhập hơn 6 kí tự"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Phone number: </label>
                    <input
                      type="text"
                      placeholder="+123 456 789"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Confirm Password: </label>
                    <input
                      type="password"
                      placeholder="Xác nhận lại password"
                      onChange={(e) => setconfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Address: </label>
                    <input
                      type="text"
                      placeholder="TP. Hồ Chí Minh"
                      onChange={(e) => setAddress(e.target.value)}
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
                      placeholder="Nguyen Van A"
                      value={nameEdit}
                      onChange={(e) => setNameEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Email: </label>
                    <input
                      type="email"
                      placeholder="admin@gmail.com"
                      value={emailEdit}
                      onChange={(e) => setEmailEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Date: </label>
                    <input
                      type="date"
                      placeholder="14/02/2023"
                      value={dateEdit.split("T")[0] || ""}
                      onChange={(e) => setDateEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Password: </label>
                    <input
                      type="text"
                      placeholder="Password phải nhập hơn 6 kí tự"
                      // value={passwordEdit}
                      onChange={(e) => setPasswordEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Phone number: </label>
                    <input
                      type="text"
                      placeholder="+123 456 789"
                      value={phoneEdit}
                      onChange={(e) => setPhoneEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Confirm Password: </label>
                    <input
                      type="text"
                      placeholder="Xác nhận lại password"
                      onChange={(e) => setconfirmPasswordEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Address: </label>
                    <input
                      type="text"
                      placeholder="TP. Hồ Chí Minh"
                      value={addressEdit}
                      onChange={(e) => setAddressEdit(e.target.value)}
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

export default UserInfo;
