import React, { useEffect, useState } from 'react';
import "./Movie.scss";
import YouTube from 'react-youtube';
import { useDispatch, useSelector } from 'react-redux';
import { createMovieApi, deleteMovieApi, getAllMoviesApi, getMovieBigApi, getMovieSmallApi, updateMovieApi } from '../../redux/movie/MovieApi';
import NoAvatar from "../../assets/image/noAvatar.png"
import Container from "../../assets/image/Container.jpg"
import { updatedChecked, updatedTitle } from '../../redux/global/GlobalSlice';
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import { getAllMovies } from '../../redux/movie/MovieSlice';


const Movie = () => {
  const dispatch = useDispatch();
  const pending = useSelector(state => state.movie.pending);
  const error = useSelector(state => state.movie.error);
  const movie = useSelector(state => state.movie.movie)
  const movies = useSelector(state => state.movie.movies)


  // get all movie
  useEffect(() => {
    const getAllMovies = async () => {
      await getAllMoviesApi(dispatch);
    }
    getAllMovies();
  }, [movie])

  // format yyyy-mm--dd -> dd/mm/yy
  function formatDate(input) {
    var datePart = input.match(/\d+/g),
      year = datePart[0].substring(0), // get only two digits
      month = datePart[1],
      day = datePart[2];

    return day + "/" + month + "/" + year;
  }
  formatDate("2010/01/18"); // "18/01/10"

  // tránh sự kiện nỗi bọt
  const handlePropagation = (e) => {
    e.stopPropagation();
  }

  // state onchange add new movie
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [stamp, setStamp] = useState("");
  const [category, setCategory] = useState("");
  const [nation, setNation] = useState("");
  const [premiereDate, setPremiereDate] = useState("");
  const [premiereYear, setPremiereYear] = useState("");
  const [movieDuration, setMovieDuration] = useState("");
  const [author, setAuthor] = useState("");
  const [producer, setProducer] = useState("");
  const [actor, setActor] = useState("");
  const [mainSlide, setMainSlide] = useState("");
  const [containerSlide, setContainerSlide] = useState("");
  const [linkTrailer, setLinkTrailer] = useState("");

  // open add new movie
  const [openAddMovie, setOpenAddMovie] = useState(false);
  const handleOpenAddMovie = () => {
    setOpenAddMovie(true)
  }

  // cancel add new movie
  const handleCancelAddMovie = () => {
    setOpenAddMovie(false)
  }

  // add new movie success
  const handleNotifyMovie = async () => {
    if (
      name === "" ||
      description === "" ||
      content === "" ||
      stamp === "" ||
      category === "" ||
      nation === "" ||
      premiereDate === "" ||
      premiereYear === "" ||
      movieDuration === "" ||
      author === "" ||
      producer === "" ||
      actor === "" ||
      linkTrailer === ""
    ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }else{
      const newMovie = {
        UserId: 4,
        name: name,
        description: description,
        content: content,
        stamp: stamp,
        category: category,
        nation: nation,
        premiereYear: premiereYear,
        premiereDate: premiereDate,
        movieDuration: movieDuration,
        author: author,
        producer: producer,
        actor: actor,
        linkTrailer: linkTrailer
      }
      const data1 = new FormData();
      data1.append("file", containerSlide);
      data1.append("upload_preset", "upload");
      const data2 = new FormData();
      data2.append("file", mainSlide);
      data2.append("upload_preset", "upload");
      if(containerSlide){
        const uploadImage = await axios.post(
          "https://api.cloudinary.com/v1_1/quangvinh255/image/upload",
          data1
        );
        const { url } = uploadImage.data;
          newMovie.containerSlide = url;
      }
      if(mainSlide){
        const uploadImage = await axios.post(
          "https://api.cloudinary.com/v1_1/quangvinh255/image/upload",
          data2
        );
        const { url } = uploadImage.data;
        newMovie.mainSlide = url;
      }
      
      await createMovieApi(newMovie, dispatch);
      toast.success("Thêm phim mới thành công !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setOpenAddMovie(false);
      setMainSlide("");
      setContainerSlide("");
    }
  }

  // open detail movie
  const [openDetailMovie, setOpenDetailMovie] = useState(false);
  const [dataDetailMovie, setDataDetailMovie] = useState();
  const handleDetailMovie = (movie) => {
    setOpenDetailMovie(true);
    setDataDetailMovie(movie);
  }


  // open trailer mocie
  const [openVideoTrailler, setOpenVideoTrailler] = useState(false);
  const [videoId, setVideoId] = useState();
  
  const handlePlayVideoTrailler = (item) => {
    setOpenVideoTrailler(true);
    if(item){
      const urlParams = new URLSearchParams(new URL(item).search);
      const videoId = urlParams.get('v');
      setVideoId(videoId);
    }else{
      return null;
    }
  }

  // ==== open form edit movie=======
  // state onchange add new movie
  const [nameEdit, setNameEdit] = useState("");
  const [descriptionEdit, setDescriptionEdit] = useState("");
  const [contentEdit, setContentEdit] = useState("");
  const [stampEdit, setStampEdit] = useState("");
  const [categoryEdit, setCategoryEdit] = useState("");
  const [nationEdit, setNationEdit] = useState("");
  const [premiereDateEdit, setPremiereDateEdit] = useState("");
  const [premiereYearEdit, setPremiereYearEdit] = useState("");
  const [movieDurationEdit, setMovieDurationEdit] = useState("");
  const [authorEdit, setAuthorEdit] = useState("");
  const [producerEdit, setProducerEdit] = useState("");
  const [actorEdit, setActorEdit] = useState("");
  const [mainSlideEdit, setMainSlideEdit] = useState("");
  const [containerSlideEdit, setContainerSlideEdit] = useState("");
  const [linkTrailerEdit, setLinkTrailerEdit] = useState("");
 
  const [openEditMovie, setOpenEditMovie] = useState(false);
  const handleOpenEditMovie = async (item) =>{
    setOpenEditMovie(true);
  }

  const [formatPremiereDate, setFormatPremiereDate] = useState();
  // Hàm chuyển đổi kiểu ngày
    function chuyenDoiNgay(premiereDateEdit) {
      var parts = premiereDateEdit?.split('/'); // Tách chuỗi thành mảng ["dd", "mm", "yyyy"]
      setFormatPremiereDate(parts[2] + '-' + parts[1] + '-' + parts[0]); // Ghép lại thành chuỗi "dd-mm-yyyy"
    }
  useEffect(() =>{
    setNameEdit(dataDetailMovie?.name);
    setDescriptionEdit(dataDetailMovie?.description);
    setContentEdit(dataDetailMovie?.content);
    setStampEdit(dataDetailMovie?.stamp);
    setCategoryEdit(dataDetailMovie?.category);
    setNationEdit(dataDetailMovie?.nation);
    setPremiereDateEdit(dataDetailMovie?.premiereDate ? chuyenDoiNgay(formatDate(dataDetailMovie?.premiereDate.split("T")[0])) : "");
    setPremiereYearEdit(dataDetailMovie?.premiereYear);
    setMovieDurationEdit(dataDetailMovie?.movieDuration);
    setAuthorEdit(dataDetailMovie?.author);
    setProducerEdit(dataDetailMovie?.producer);
    setActorEdit(dataDetailMovie?.actor);
    setMainSlideEdit(dataDetailMovie?.mainSlide);
    setContainerSlideEdit(dataDetailMovie?.containerSlide);
    setLinkTrailerEdit(dataDetailMovie?.linkTrailer);
  }, [dataDetailMovie, movie])
  
  // update movie success
  const handleUpdateMovie = async () => {
    if (
      nameEdit === "" ||
      descriptionEdit === "" ||
      contentEdit === "" ||
      stampEdit === "" ||
      categoryEdit === "" ||
      nationEdit === "" ||
      premiereDateEdit === "" ||
      premiereYearEdit === "" ||
      movieDurationEdit === "" ||
      authorEdit === "" ||
      producerEdit === "" ||
      actorEdit === "" ||
      linkTrailerEdit === ""
    ) {
      toast.info("Vui lòng nhập đầy đủ thông tin !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }else{
      const newMovie = {
        UserId: 4,
        name: nameEdit,
        description: descriptionEdit,
        content: contentEdit,
        stamp: stampEdit,
        category: categoryEdit,
        nation: nationEdit,
        premiereYear: premiereYearEdit,
        premiereDate: formatPremiereDate,
        movieDuration: movieDurationEdit,
        author: authorEdit,
        producer: producerEdit,
        actor: actorEdit,
        linkTrailer: linkTrailerEdit,
        mainSlide: mainSlideEdit,
        containerSlide: containerSlideEdit,
      }
      setDataDetailMovie(newMovie);
      
      await updateMovieApi(dataDetailMovie.id, newMovie, dispatch);
      toast.success("Cập nhật phim thành công !", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setOpenEditMovie(false);
    }
  }

  // ====== delete ====
  const [openDeleteMovie, setOpenDeLeteMovie] = useState(false);
  const handleOpenDeleteMovie = async() => {
    setOpenDeLeteMovie(true);
  }

  const handleConfirmDeleteMovie = async() => {
    await deleteMovieApi(dataDetailMovie.id, dispatch);
    setOpenDeLeteMovie(false);
    setOpenDetailMovie(false);
    toast.success(
      "Xóa bộ phim này thành công !",
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      }      
    );    
  }

  // ======search=======
  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const handleChangeSearch = () => {
    var dataSearchs = []
    if(search === ""){
      setOpenSearch(false);
    }else{
      setOpenSearch(true);
      movies.forEach(item =>{
        if(item.data.name.toLowerCase().includes(search.toLowerCase())){
          dataSearchs.push(item);
        }
      } )
    }
    setDataSearch(dataSearchs)
  }

  useEffect(() => {
    if(search === ""){
      setOpenSearch(false);
    }
  }, [search])

  // === trạng thái phim đang chiếu và sắp chiếu ======
    // Tạo một đối tượng Date mới
    var date = new Date();
    // Lấy thông tin về ngày, tháng, năm
    var day = date.getDate();
    var month = date.getMonth() + 1; // Lưu ý: tháng trong JavaScript bắt đầu từ 0
    var year = date.getFullYear();

    const [stateMovieSmall, setStateMovieSmall] = useState(false)
    const [stateMovieBig, setStateMovieBig] = useState(false)

    useEffect(() => {
      var btnSmallElement = document.querySelector(".action-btn-small");
      var btnBigElement = document.querySelector(".action-btn-big");
      if(stateMovieSmall === true){
          btnSmallElement.style.backgroundColor = 'red';
      }else{
        btnSmallElement.style.backgroundColor = '#304343';
      }
      if(stateMovieBig === true){
          btnBigElement.style.backgroundColor = 'red';
      }else{
        btnBigElement.style.backgroundColor = '#304343';
      }
    }, [stateMovieSmall, stateMovieBig])

    useEffect(() => {
      if(stateMovieSmall === false && stateMovieBig === false){
        const getAllMovies = async () => {
          await getAllMoviesApi(dispatch);
        }
        getAllMovies();
      }
    }, [stateMovieBig, stateMovieSmall])

  const handleStateSmallMovie = async () => {
    setStateMovieSmall(!stateMovieSmall)
    if(stateMovieBig === true) {
      setStateMovieBig(false);
    }
      await getMovieSmallApi(year + "-" + month + "-" + day, dispatch)
    }

  const handleStateBigMovie = async () => {
    if(stateMovieSmall === true) {
      setStateMovieSmall(false)
    }
    setStateMovieBig(!stateMovieBig);
      await getMovieBigApi(year + "-" + month + "-" + day, dispatch);     
  }

  return (
    <div className="movie">
      {
        openVideoTrailler && (
          <div className="movie-trailer">
            <CancelIcon onClick={() => setOpenVideoTrailler(false)} />
            <YouTube
              videoId={videoId}
              opts={{
                height: '360',
                width: '640',
                playerVars: {
                  autoplay: 1,
                  controls: 1,
                },
              }}
            />
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
      {
        openDetailMovie ? 
          <>
            <div className="movie-detail">
              <div className="movie-detail-back">
                <button onClick={() => setOpenDetailMovie(false)}>Quay lại</button>
                <div className="movie-detail-action">
                  <button onClick={()=>handleOpenEditMovie()}>Sửa</button>
                  <button onClick = {() => handleOpenDeleteMovie()}>Xóa</button>
                </div>
              </div>
              <div className="movie-detail-main">
                <div className="movie-detail-containerImg">
                  <img src={dataDetailMovie.containerSlide || Container} alt="" />
                </div>
                <div className="movie-detail-container">
                  <div className="movie-detail-mainSlide">
                    <img src={dataDetailMovie.mainSlide || NoAvatar} alt="" />
                    <PlayCircleOutlineIcon onClick={() => handlePlayVideoTrailler(dataDetailMovie.linkTrailer || "")} />
                  </div>
                  <div className="movie-detail-content">
                    <h1>{dataDetailMovie.name}</h1>
                    <p>{dataDetailMovie.description}</p>
                    <p className="movie-detail-text-content">{dataDetailMovie.content}</p>
                    <div className="movie-detail-list">
                      <div className="movie-detail-item">
                        <p>Khởi chiếu</p>
                        <p>{formatDate(dataDetailMovie.premiereDate)}</p>
                      </div>
                      <div className="movie-detail-item">
                        <p>Thời lượng</p>
                        <p>{dataDetailMovie.movieDuration}</p>
                      </div>
                      <div className="movie-detail-item">
                        <p>Giới hạn tuổi</p>
                        <p>{dataDetailMovie.stamp}</p>
                      </div>
                    </div>
                    <div className="movie-detail-footer">
                      <div className="movie-detail-category">
                        <p>Thể loại: </p>
                        <p>{dataDetailMovie.category}</p>
                      </div>
                      <div className="movie-detail-nation">
                        <p>Quốc gia: </p>
                        <p>{dataDetailMovie.nation}</p>
                      </div>
                    </div>
                  </div>
                  <div className="movie-detail-info">
                    <div className="movie-detail-actor">
                      <h2>Diễn viên</h2>
                      <p>{dataDetailMovie.actor}</p>
                    </div>
                    <div className="movie-detail-author">
                      <h2>Đạo diễn</h2>
                      <p>{dataDetailMovie.author}</p>
                    </div>
                    <div className="movie-detail-producer">
                      <h2>Nhà sản xuất</h2>
                      <p>{dataDetailMovie.producer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
               
         :
         !openSearch &&
        <>
          <div className="movie-header">
            <div className="movie-header-title">
              <h1>Thông tin phim</h1>
            </div>
          </div>
          <div className="movie-action">
          <div className="movie-action-search">
            <input type="text" placeholder="Tìm kiếm tại đây" onChange={(e) => setSearch(e.target.value)} />
            <button onClick={() => handleChangeSearch()} >Tìm kiếm</button>
          </div>
          <div className="movie-action-types">
            <button className="action-btn-small" onClick={() =>handleStateSmallMovie()}>Phim đang chiếu</button>
            <button className="action-btn-big" onClick={() =>handleStateBigMovie()}>Phim sắp chiếu</button>
          </div>
          <div className="movie-action-add">
            <button onClick={() => handleOpenAddMovie()}>Thêm phim mới</button>
          </div>
          </div>
          <div className="movie-container">
            <div className="movie-container-listItems">
              {
                movies.map(item =>(
                <div key={item.data.id} className="movie-contaner-item" onClick={() => handleDetailMovie(item.data)}>
                  <div className="movie-item-img">
                    <img src={item.data.mainSlide || NoAvatar} alt="" />
                    <p>{item.data.premiereDate ? formatDate(item?.data?.premiereDate.split("T")[0]) : ""}</p>
                  </div>    
                  <div className="movie-item-info">
                    <h2>{item.data.name}</h2>
                    <p>({item.data.premiereYear})</p>
                    <p>{item.data.description}</p>
                  </div>        
                </div>
                ))
              }
            </div>
          </div>
      </>
      ||
      <>
      <div className="movie-header">
        <div className="movie-header-title">
          <h1>Thông tin phim</h1>
        </div>
      </div>
      <div className="movie-action">
      <div className="movie-action-search">
        <input type="text" placeholder="Tìm kiếm tại đây" onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => handleChangeSearch()} >Tìm kiếm</button>
      </div>
      <div className="movie-action-types">
        <button className="action-btn-small" onClick={() =>handleStateSmallMovie()}>Phim đang chiếu</button>
        <button className="action-btn-big" onClick={() =>handleStateBigMovie()}>Phim sắp chiếu</button>
      </div>
      <div className="movie-action-add">
        <button onClick={() => handleOpenAddMovie()}>Thêm phim mới</button>
      </div>
      </div>
      <div className="movie-container">
        <div className="movie-container-listItems">
          {
            dataSearch?.map(item =>(
            <div key={item.data.id} className="movie-contaner-item" onClick={() => handleDetailMovie(item.data)}>
              <div className="movie-item-img">
                <img src={item.data.mainSlide || NoAvatar} alt="" />
                <p>{item.data.premiereDate ? formatDate(item?.data?.premiereDate.split("T")[0]) : ""}</p>
              </div>    
              <div className="movie-item-info">
                <h2>{item.data.name}</h2>
                <p>({item.data.premiereYear})</p>
                <p>{item.data.description}</p>
              </div>        
            </div>
            ))
          }
        </div>
      </div>
  </>
      }
      {/* open form add movie */}
      {openAddMovie && (
              <div
                className="userinfo-dialogAdd"
                onClick={() => handleCancelAddMovie()}
              >
                <div
                  className="userinfo-dialogAddContainer movieContainer"
                  onClick={(e) => handlePropagation(e)}
                >
                  <div className="userinfo-dialog-header">
                    <h1>Thêm phim mới</h1>
                    <CancelIcon onClick={() => handleCancelAddMovie()} />
                  </div>
                  <div className="userinfo-dialog-content">
                    <div className="userinfo-dialog-left">
                      <img
                        className="movie-size"
                        src={containerSlide ? URL.createObjectURL(containerSlide) : NoAvatar}
                        alt=""
                      />
                      <div className="userinfo-dialog-image">
                        <label>Ảnh lớn </label>
                        <input
                          type="file"
                          onChange={(e)=>setContainerSlide(e.target.files[0])}
                        />
                      </div>
                      <img className="movie-size movie-img"
                        src={mainSlide ? URL.createObjectURL(mainSlide) : NoAvatar}
                        alt=""
                      />
                      <div className="userinfo-dialog-image ">
                        <label>Ảnh nhỏ:  </label>
                        <input
                          type="file"
                          onChange={(e)=>setMainSlide(e.target.files[0])}
                        />
                      </div>
                    </div>
                    <div className="userinfo-dialog-right">
                      <form>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Tên phim: </label>
                          <input
                            type="name"
                            placeholder="VD: Lật mặt 6"
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Mô tả: </label>
                          <input
                            type="text"
                            placeholder="Mô tả"
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Link Trailer: </label>
                          <input
                            type="text"
                            placeholder="VD: https://www.youtube.com/watch?v"
                            onChange={(e) => setLinkTrailer(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Ngày ra mắt: </label>
                          <input
                            type="date"
                            placeholder="14/02/2023"
                            onChange={(e) => setPremiereDate(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Năm ra mắt: </label>
                          <input
                            type="text"
                            placeholder="VD: 2023"
                            onChange={(e) => setPremiereYear(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Độ tuổi: </label>
                          <input
                            type="text"
                            placeholder="13+"
                            onChange={(e) => setStamp(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Thể loại: </label>
                          <input
                            type="text"
                            placeholder="Hài, gia đình"
                            onChange={(e) => setCategory(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Quốc gia: </label>
                          <input
                            type="text"
                            placeholder="Việt Nam"
                            onChange={(e) => setNation(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Thời lượng: </label>
                          <input
                            type="text"
                            placeholder="120"
                            onChange={(e) => setMovieDuration(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Nội dung: </label>
                          <textarea
                            type="text"
                            placeholder="nội dung"
                            onChange={(e) => setContent(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Đạo diễn: </label>
                          <input
                            type="text"
                            placeholder="Vũ"
                            onChange={(e) => setAuthor(e.target.value)}
                          />
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Nhà sản xuất: </label>
                          <input
                            type="text"
                            placeholder="Media"
                            onChange={(e) => setProducer(e.target.value)}
                          />                          
  
                        </div>
                        <div className="userinfo-dialog-info movie-dialog-info">
                          <label>Diễn viên: </label>
                          <input
                            type="text"
                            placeholder="Thái Hòa..."
                            onChange={(e) => setActor(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="userinfo-dialog-footer">
                    <button onClick={() => handleNotifyMovie()}>Lưu lại</button>
                    <button onClick={() => handleCancelAddMovie()}>Hủy</button>
                  </div>
                </div>
              </div>
        )
      }
      {
        openEditMovie && (
        <div
          className="userinfo-dialogAdd"
          onClick={() => setOpenEditMovie(false)}
        >
          <div
            className="userinfo-dialogAddContainer movieContainer"
            onClick={(e) => handlePropagation(e)}
          >
            <div className="userinfo-dialog-header">
              <h1>Chỉnh sửa thông tin phim</h1>
              <CancelIcon onClick={() => setOpenEditMovie(false)} />
            </div>
            <div className="userinfo-dialog-content">
              <div className="userinfo-dialog-left">
                <img
                  className="movie-size"
                  src={containerSlide ? URL.createObjectURL(containerSlide) : NoAvatar}
                  alt=""
                />
                <div className="userinfo-dialog-image">
                  <label>Ảnh lớn </label>
                  <input
                    type="file"
                    // onChange={(e)=>setContainerSlide(e.target.files[0])}
                  />
                </div>
                <img className="movie-size movie-img"
                  src={mainSlide ? URL.createObjectURL(mainSlide) : NoAvatar}
                  alt=""
                />
                <div className="userinfo-dialog-image ">
                  <label>Ảnh nhỏ:  </label>
                  <input
                    type="file"
                    // onChange={(e)=>setMainSlide(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="userinfo-dialog-right">
                <form>
                  <div className="userinfo-dialog-info">
                    <label>Tên phim: </label>
                    <input
                      type="name"
                      placeholder="VD: Lật mặt 6"
                      value={nameEdit}
                      onChange={(e) => setNameEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Mô tả: </label>
                    <input
                      type="text"
                      placeholder="Mô tả"
                      value={descriptionEdit}
                      onChange={(e) => setDescriptionEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                          <label>Link Trailer: </label>
                          <input
                            type="text"
                            placeholder="VD: https://www.youtube.com/watch?v"
                            value={linkTrailerEdit}
                            onChange={(e) => setLinkTrailerEdit(e.target.value)}
                          />
                        </div>
                  <div className="userinfo-dialog-info">
                    <label>Ngày ra mắt: </label>
                    <input
                      type="date"
                      placeholder="14/02/2023"
                      value={formatPremiereDate}
                      onChange={(e) => setFormatPremiereDate(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Năm ra mắt: </label>
                    <input
                      type="text"
                      placeholder="VD: 2023"
                      value={premiereYearEdit}
                      onChange={(e) => setPremiereYearEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Độ tuổi: </label>
                    <input
                      type="text"
                      placeholder="13+"
                      value={stampEdit}
                      onChange={(e) => setStampEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Thể loại: </label>
                    <input
                      type="text"
                      placeholder="Hài, gia đình"
                      value={categoryEdit}
                      onChange={(e) => setCategoryEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Quốc gia: </label>
                    <input
                      type="text"
                      placeholder="Việt Nam"
                      value={nationEdit}
                      onChange={(e) => setNationEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Thời lượng: </label>
                    <input
                      type="text"
                      placeholder="120"
                      value={movieDurationEdit}
                      onChange={(e) => setMovieDurationEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Nội dung: </label>
                    <textarea
                      type="text"
                      placeholder="nội dung"
                      value={contentEdit}
                      onChange={(e) => setContentEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Đạo diễn: </label>
                    <input
                      type="text"
                      placeholder="Vũ"
                      value={authorEdit}
                      onChange={(e) => setAuthorEdit(e.target.value)}
                    />
                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Nhà sản xuất: </label>
                    <input
                      type="text"
                      placeholder="Media"
                      value={producerEdit}
                      onChange={(e) => setProducerEdit(e.target.value)}
                    />                          

                  </div>
                  <div className="userinfo-dialog-info">
                    <label>Diễn viên: </label>
                    <input
                      type="text"
                      placeholder="Thái Hòa..."
                      value={actorEdit}
                      onChange={(e) => setActorEdit(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="userinfo-dialog-footer">
              <button onClick={() => handleUpdateMovie()}>Lưu lại</button>
              <button onClick={() => setOpenEditMovie(false)}>Hủy</button>
            </div>
          </div>
        </div>
        )
      }
      {
        openDeleteMovie && (
          <div className="userinfo-dialog-delete">
            <div className="userinfo-dialog-deleteForm">
              <InfoIcon />
              <span>Xác nhận</span>
              <p>Bạn có chắc xóa bộ phim này không!</p>
              <div className="userinfo-dialog-delete-btn">
                <button onClick={() => handleConfirmDeleteMovie()}>OK</button>
                <button onClick={() => setOpenDeLeteMovie(false)}> Hủy</button>
              </div>
            </div>
          </div>
        )
      }
      <ToastContainer />
    </div>
  )
}

export default Movie