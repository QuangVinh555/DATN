import React, { useEffect, useState } from 'react';
import "./CinemaRoom.scss";
import NoAvatar from "../../../assets/image/noAvatar.png"
import All from "../../../assets/image/all.png"
import { useDispatch, useSelector } from 'react-redux';
import { getAllSearchLocationApi } from '../../../redux/location/LocationApi';
import { getAllCinemaTypesApi } from '../../../redux/cinemaType/CinemaTypeApi';
import { getAllCinemaNamesApi, getAllCinemaNamesByCinemaTypeIdApi, getAllCinemaNamesByLocationIdAndCinemaTypeIdApi, getAllCinemaNamesByLocationIdApi } from '../../../redux/cinemaName/CinemaNameApi';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { DeleteCinemaRoomApi, createCinemaRoomApi, getAllCinemaRoomByCinemaNameIdApi, updateCinemaRoomApi } from '../../../redux/cinemaRoom/CinemaRoomApi';
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from 'react-toastify';
import { createChairApi, deleteChairApi, getAllChairByCinemaRoomIdApi, updateChairApi } from '../../../redux/chair/ChairApi';
import InfoIcon from '@mui/icons-material/Info';

const CinemaRoom = () => {
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.cinemaRoom.pending);
  const locations = useSelector((state) => state.location.listSearch);
  const cinemaTypes = useSelector((state) => state.cinemaType.cinemaTypes);
  const cinemaNames = useSelector((state) => state.cinemaName.listSearch);
  const cinemaRooms = useSelector((state) => state.cinemaRoom.cinemaRooms);
  const cinemaNamesByConditions = useSelector((state) => state.cinemaName.cinemaNames);
  const chairsByCinemaRoomId = useSelector((state) => state.chair.chairs);
  const cinemaRoom = useSelector((state) => state.cinemaRoom.cinemaRoom);
  const chair = useSelector((state) => state.chair.chair);

  // ============Get all==============
  // get all location when open cinemaRoom
  useEffect(() => {
    const getAllLocations = async () => {
      await getAllSearchLocationApi(dispatch);
    }
    getAllLocations();
  }, [])

    // get all cinema type when open cinemaRoom
    useEffect(() => {
      const getAllCinemaTypes = async () => {
        await getAllCinemaTypesApi(dispatch);
      }
      getAllCinemaTypes();
    }, [])

     // get all cinema name when open cinemaRoom
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
    }

    // get api cinema room by cinemaName id dựa vào item cinema name lấy ra
    useEffect(() => {
      const getAllCinemaRoomByCinemaNameId = async (cinemaNameId) => {
        await getAllCinemaRoomByCinemaNameIdApi(cinemaNameId, dispatch);
      }
      getAllCinemaRoomByCinemaNameId(cinemaNameItem?.id);
    }, [cinemaNameItem, cinemaRoom, chair])

    // ========== OPEN FORM ADD =========
    // open form add
    const [open, setOpen] = useState(false);
    const handlePropagation = (e) => {
      e.stopPropagation();
      setDialogVisible(false)
    }
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    
    // add new success
    const handleNotifySave = async () => {
      if (name === "" || number === "") {
        toast.info("Vui lòng nhập đầy đủ thông tin !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else{
        const newCinemaRoom = {
          CinemaNameId: cinemaNameItem.id,
          name: name,
          numChair: number
        }
        await createCinemaRoomApi(newCinemaRoom, dispatch);
        toast.success(
          "Thêm thành công",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
          setOpen(false);  
          setName("");
          setNumber("");
      }
    }

    // ========== FROM EDIT CINEMAROOM ========

    // open form edit cinema room
    const [openEditCinemaRoom, setOpenEditCinemaRoom] = useState(false)
    const [dataEditCinemaRoom, setDataEditCinemaRoom] = useState();

    // onchange 
    const [nameEdit, setNameEdit] = useState("");
    const [numberEdit, setNumberEdit] = useState(0);

    const handleOpenEditCinemaRoom = (cinemaRoom) => {
      setOpenEditCinemaRoom(true);
      setDataEditCinemaRoom(cinemaRoom);
    }
    
    useEffect(() => {
      setNameEdit(dataEditCinemaRoom?.name);
      setNumberEdit(parseInt(dataEditCinemaRoom?.numChair));
    }, [dataEditCinemaRoom, openEditCinemaRoom])

    const handleNotifySaveEditCinemaRoom = async () => {
      if (nameEdit === "" || numberEdit === "") {
        toast.info("Vui lòng nhập đầy đủ thông tin !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else{
        const newCinemaRoom = {
          CinemaNameId: cinemaNameItem.id,
          name: nameEdit,
          numChair: parseInt(numberEdit)
        }
        await updateCinemaRoomApi(dataEditCinemaRoom.id, newCinemaRoom, dispatch);
        toast.success(
          "Cập nhật thành công",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
          setOpenEditCinemaRoom(false);  
          setNameEdit("");
          setNumberEdit("");
      }
    }


    // ======= FROM DETAIL CHAIR ============
    // open form detail chair
    const [openDetailChair, setOpenDetailChair] = useState(false);
    const [dataDetailChair, setDataDetailChair] = useState();
    const handleOpenDetailChair = (cinemaRoom) => {
      setOpenDetailChair(true);
      setDataDetailChair(cinemaRoom);
    }

    const handleDisable = () => {
      setOpenDetailChair(false);
      setDialogVisible(false);
    }

    // get all chair by cinemaRoomId
    useEffect(() => {
      const getAllChairByCinemaRoomId = async(param) => {
        await getAllChairByCinemaRoomIdApi(param, dispatch);
      }
      getAllChairByCinemaRoomId(dataDetailChair?.id);
    }, [dataDetailChair, chair])

    // ======FORM DELETE CINEMA ROOM=============
    const [openDeleteCinemaRoom, setOpenDeleteCinemaRoom] = useState(false);
    const [dataDeleteCinemaRoom, setDataDeleteCinemaRoom] = useState();
    const handleOpenDeleteCinemaRoom = (cinemaRoom) => {
      setOpenDeleteCinemaRoom(true);
      setDataDeleteCinemaRoom(cinemaRoom);
    }

    const handleConfirmDeleteUser = async() => {
      await DeleteCinemaRoomApi(dataDeleteCinemaRoom.id, dispatch);
      toast.success(
        "Xóa thành công",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );    
      setOpenDeleteCinemaRoom(false);  
    }


    // =========Search================================
    const [resultInput, setResultInput] = useState("")
    const [checkSearch, setCheckSearch] = useState(false);
    const [result, setResult] = useState()
    const handleChangeCinemaName = (e) => {
      setResultInput(e.target.value); 
    }
    useEffect(() => {
        setCheckSearch(true);
        cinemaNames.map(item => {
          if(item.data.name.toLowerCase().includes(resultInput.toLowerCase())){
            setResult(item);
          }
        })
    }, [resultInput])


    // ============= FORM OPEN ADD CHAIR ================================
    const [openAddChair, setOpenAddChair] = useState(false);
    const [chairType, setchairType] = useState("");
    const [nameChair, setNameChair] = useState("");
    const handleOpenAddChair = () => {
      setOpenAddChair(true);
    }

    // add new chair success
    const handleNotifySaveAddChair = async () => {
      if(chairType === "" || nameChair === ""){
        toast.info(
          "Vui lòng nhập đầy đủ thông tin !",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
      }else{
        const newChair = {
          cinemaRoomId: dataDetailChair.id,
          chairTypeId: parseInt(chairType),
          name: nameChair,
        }
        await createChairApi(newChair, dispatch);
      
        toast.success(
          "Thêm ghế mới thành công !",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
        setOpenAddChair(false);
        setchairType("");
        setNameChair("");
      }
    }

    // =========== Form edit and delete ============

    // open form action edit and delete chair
    const [typeEditChair, setTypeEditChair]= useState()
    const [nameEditChair, setNameEditChair]= useState()
    const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dataActionChair, setDataActionChair] = useState();

    const handleMouseDown = (event, chair) => {
      const x = event.clientX;
      const y = event.clientY;
    
      setDialogPosition({ x, y });
      setDialogVisible(true);
      setDataActionChair(chair);
    };
    
    useEffect(() => {
      setTypeEditChair((dataActionChair?.chairTypeId)?.toString());
      setNameEditChair(dataActionChair?.name);
    }, [dataActionChair])
    

    // state open edit action chair
    const [openEditChair, setOpenEditChair] = useState(false);
    const handleOpenEditActionChair = () => {
      setOpenEditChair(true);
    }
    

    // update success
    const handleNotifySaveEditChair = async () => {
      if(typeEditChair === "" || nameEditChair === ""){
        toast.info(
          "Vui lòng nhập đầy đủ thông tin !",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
      }else{
        const newChair = {
          cinemaRoomId: dataDetailChair.id,
          chairTypeId: parseInt(typeEditChair),
          name: nameEditChair,
        }

        await updateChairApi(dataActionChair?.id, newChair, dispatch);
      
        toast.success(
          "Cập nhật ghế thành công !",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }      
        );    
        setOpenEditChair(false);
        setTypeEditChair("");
        setNameEditChair("");
      }
    }

    // delete chair
    const [openDeleteChair, setOpenDeleteChair] = useState(false);

    const handleOpenDeleteActionChair = () => {
      setOpenDeleteChair(true)
    }

    const handleConfirmDeleteChair = async() => {
      await deleteChairApi(dataActionChair.id, dispatch);
      toast.success(
        "Xóa thành công",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }      
      );    
      setOpenDeleteChair(false);
      setDialogVisible(false);  
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
      {/* open form delete cinemaRoom */}
      {
        openDeleteCinemaRoom && (
          <div className="userinfo-dialog-delete">
            <div className="userinfo-dialog-deleteForm">
              <InfoIcon />
              <span>Xác nhận</span>
              <p>Bạn có chắc xóa phòng chiếu này không!</p>
              <div className="userinfo-dialog-delete-btn">
                <button onClick={() => handleConfirmDeleteUser()}>OK</button>
                <button onClick={() => setOpenDeleteCinemaRoom(false)}> Hủy</button>
              </div>
            </div>
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
            // checkSearch && (
            //   result?.map(item => (
            //     <div 
            //     key={result.data.id} 
            //     className="cinemaroom-type"
            //     onClick={() => handleClickCinemaType(result.data)}
            //   >
            //     <img src = {result.data.logo || NoAvatar} alt="" />
            //     <p>{result.data.name}</p>
            //   </div>
            //   ))
            // )
            //   ||
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
              <input type='text' placeholder='Tìm theo tên rạp ...' onChange={(e) => handleChangeCinemaName(e)} />
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
                  <p>{item.data.name}</p>
                </div>
              )))
            }
          </div>
        </div>
        <div className="cinemaroom-content-right">
          {/* get item cinemaRoom by CinemaNameId */}
          {
            cinemaNameItem ? (
              <>
                <div className="cinemaroom-right-header">
                  <img src = {cinemaNameItem.logo || NoAvatar} alt='' />
                  <div className="cinemaroom-right-title">
                    <h2>{cinemaNameItem.name}</h2>
                    <p>{cinemaNameItem.locationDetail}</p>
                  </div>
                </div>
                <div className="cinemaroom-right-add">
                  <button onClick={() => setOpen(true)}>
                    <AddBoxIcon />
                    Thêm phòng chiếu
                  </button>
                </div>
                <div className="cinemaroom-right-table">
                  <table className="userinfo-table">
                   <div className="table-scroll-thead">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Tên phòng</th>
                          <th scope="col">Số lượng ghế</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                   </div>
                    <div className="table-scroll-tbody">
                      <tbody>
                        {
                          cinemaRooms.map((item, index) => (
                            <tr key={item.data.id}>
                              <th scope="row">{index + 1}</th>       
                              <td>{item.data.name}</td>      
                              <td>{item.data.numChair || "Chưa tạo"}
                                <button onClick={() => handleOpenDetailChair(item.data)} >Xem chi tiết</button>  
                              </td>      
                              <td>
                                <EditIcon onClick = {() => handleOpenEditCinemaRoom(item.data)} />
                                <DeleteIcon onClick={() => handleOpenDeleteCinemaRoom(item.data)}/>    
                              </td>      
                            </tr>
                          ))
                        }
                      </tbody>
                    </div>
                  </table>
                </div>
              </>
              ) :
            <h1>Thông tin các phòng chiếu</h1>
          }
        </div>
      </div>
      {/* open form add CinemaRoom */}
      {
        open && (
        <div
          className="userinfo-dialogAdd"
          onClick={() => setOpen(false)}
        >
          <div
            className="userinfo-dialogAddContainer"
            onClick={(e) => handlePropagation(e)}
          >
            <div className="userinfo-dialog-header">
              <h1>Thêm mới phòng chiếu</h1>
              <CancelIcon onClick={() => setOpen(false)} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Tên phòng: </label>
                    <input
                      type="text"
                      placeholder="Tên phòng chiếu"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Số lượng ghế: </label>
                    <input
                      type="text"
                      placeholder="VD: 80"
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="userinfo-dialog-footer">
              <button onClick={() => handleNotifySave()}>Lưu lại</button>
              <button onClick={() => setOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
        )
      }

      {/* open form edit cinemaRoom */}
      {
        openEditCinemaRoom && (
        <div
          className="userinfo-dialogAdd"
          onClick={() => setOpenEditCinemaRoom(false)}
        >
          <div
            className="userinfo-dialogAddContainer"
            onClick={(e) => handlePropagation(e)}
          >
            <div className="userinfo-dialog-header">
              <h1>Chỉnh sửa phòng chiếu</h1>
              <CancelIcon onClick={() => setOpenEditCinemaRoom(false)} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Tên phòng: </label>
                    <input
                      type="text"
                      placeholder="Tên phòng chiếu"
                      value={nameEdit}
                      onChange={(e) => setNameEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Số lượng ghế: </label>
                    <input
                      type="text"
                      placeholder="VD: 80"
                      value={numberEdit || 0}
                      onChange={(e) => setNumberEdit(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="userinfo-dialog-footer">
              <button onClick={() => handleNotifySaveEditCinemaRoom()}>Lưu lại</button>
              <button onClick={() => setOpenEditCinemaRoom(false)}>Hủy</button>
            </div>
          </div>
        </div>
        )
      }

      {/* open form detail chair */}
      {
        openDetailChair && (
          <div className="chair" onClick={() => handleDisable()}>
           <div className="chair-dialog" onClick={(e) => handlePropagation(e)}>
              <div className="chair-header">
                <h2>Thông tin ghế</h2>
                <CancelIcon onClick={() => setOpenDetailChair(false)}/>
              </div>
              <div className="chair-container">
                <div className="chair-container-top">
                  <div className="chair-top-desktop"></div>
                  <h3>Màn hình</h3>
                </div>
                <div className="chair-container-center">
                  <div className="chair-center-lists">
                    {
                      chairsByCinemaRoomId.map(chair => (
                        <div key={chair.data.id} className="chair-center-item">
                          <button 
                            onMouseDown={(e) => handleMouseDown(e, chair.data)}
                            className={chair.data.chairTypeId === 1 && 'btnNormal' || chair.data.chairTypeId === 2 && 'btnVIP' || 'btnCouple' }>
                              {chair.data.name}
                          </button>
                        </div>
                      ))
                    }
                       <div className="chair-center-item">
                          <button className="btn-add-chair" onClick={() => handleOpenAddChair()}>
                            +
                          </button>
                        </div>
                  </div>
                </div>
                <div className="chair-center-footer">
                  <div className="chair-footer-item">
                    <div className="chair-item-shape chair-item-Normal"></div>
                    <p>Ghế thường</p>
                  </div>
                  <div className="chair-footer-item">
                    <div className="chair-item-shape chair-item-VIP"></div>
                    <p>Ghế VIP</p>
                  </div>
                  <div className="chair-footer-item">
                    <div className="chair-item-shape chair-item-Couble"></div>
                    <p>Ghế đôi</p>
                  </div>
                </div>
              </div>
              <div className="chair-footer">
                <h1>{cinemaNameItem.name}</h1>
                <h2>{dataDetailChair.name}</h2>
              </div>
           </div>
          </div>         
        )    
      }
      {/* open form add chair */}
      {
        openAddChair && (
            <div
              className="userinfo-dialogAdd"
              onClick={() => setOpenAddChair(false)}
            >
              <div
                className="userinfo-dialogAddContainer"
                onClick={(e) => handlePropagation(e)}
              >
                <div className="userinfo-dialog-header">
                  <h1>Thêm mới ghế </h1>
                  <CancelIcon onClick={() => setOpenAddChair(false)} />
                </div>
                <div className="userinfo-dialog-content">
                  <div className="userinfo-dialog-left">
                    
                  </div>
                  <div className="userinfo-dialog-right">
                    <form>
                    <div className="userinfo-dialog-info">
                  <label>Loại ghế: </label>
                    <select onChange={(e) => setchairType(e.target.value)}>
                      <option defaultValue="" selected disabled hidden>Choose here</option>
                      <option value="1">Ghế thường</option>
                      <option value="2">Ghế VIP</option>
                      <option value="3">Ghế Đôi</option>
                    </select>
                  </div>
                      <div className="userinfo-dialog-info cinematype-dialog-info">
                        <label>Tên ghế: </label>
                        <input
                          type="text"
                          placeholder="VD: A1"
                          onChange={(e) => setNameChair(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="userinfo-dialog-footer">
                  <button onClick={() => handleNotifySaveAddChair()}>Lưu lại</button>
                  <button onClick={() => setOpenAddChair(false)}>Hủy</button>
                </div>
              </div>
          </div>
        )
      }

      {/* open form edit and delete */}
      {
        dialogVisible && (
          <div 
            className="chair-action" 
            style={{
              top: dialogPosition.y,
              left: dialogPosition.x,
            }}
          >
            <h2 onClick={() => handleOpenEditActionChair()}>SỬA</h2>
            <h2 onClick = {() => handleOpenDeleteActionChair()}>Xóa</h2>
          </div>
        )
      }

      {/* open form edit chair */}
      {
        openEditChair && (
        <div
          className="userinfo-dialogAdd"
          onClick={() => setOpenEditChair(false)}
        >
          <div
            className="userinfo-dialogAddContainer"
            onClick={(e) => handlePropagation(e)}
          >
            <div className="userinfo-dialog-header">
              <h1>Chỉnh sửa ghế </h1>
              <CancelIcon onClick={() => setOpenEditChair(false)} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                
              </div>
              <div className="userinfo-dialog-right">
                <form>
                <div className="userinfo-dialog-info">
              <label>Loại ghế: </label>
                <select value= {typeEditChair} onChange={(e) => setTypeEditChair(e.target.value)}>
                  <option value="1">Ghế thường</option>
                  <option value="2">Ghế VIP</option>
                  <option value="3">Ghế Đôi</option>
                </select>
              </div>
                  <div className="userinfo-dialog-info cinematype-dialog-info">
                    <label>Tên ghế: </label>
                    <input
                      type="text"
                      placeholder="VD: A1"
                      value={nameEditChair}
                      onChange={(e) => setNameEditChair(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="userinfo-dialog-footer">
              <button onClick={() => handleNotifySaveEditChair()}>Lưu lại</button>
              <button onClick={() => setOpenEditChair(false)}>Hủy</button>
            </div>
          </div>
        </div>
        )
      }

      {/* open form delete */}
      {
        openDeleteChair && (
          <div className="userinfo-dialog-delete">
            <div className="userinfo-dialog-deleteForm">
              <InfoIcon />
              <span>Xác nhận</span>
              <p>Bạn có chắc xóa ghế này không!</p>
              <div className="userinfo-dialog-delete-btn">
                <button onClick={() => handleConfirmDeleteChair()}>OK</button>
                <button onClick={() => setOpenDeleteChair(false)}> Hủy</button>
              </div>
            </div>
          </div>
        )
      }
      <ToastContainer />
    </div>
  )
}

export default CinemaRoom