import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Default from "./layout/Default/Default";
import AdminLayout from "./layout/Admin/Admin";
// import Sidebar from "./layout/Sidebar/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import User from "./pages/user/User";
import MovieTheater from "./pages/movietheater/MovieTheater";
import Movie from "./pages/movie/Movie";
import ShowTime from "./pages/showtime/ShowTime";
import Ticket from "./pages/ticket/Ticket";
import New from "./pages/new/New";
import Default from "./layout/Default/Default";
import BuyTicket from "./pages/buyTicket/BuyTicket";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { LOCAL_STORAGE_TOKEN_NAME } from "./localStorage/localStorage";
import { getToken } from "./redux/auth/AuthSlice";
import { useEffect } from "react";
import { useState } from "react";
import Home from "./pages/home/Home";
import Personal from "./pages/personal/Personal";
import MovieDetail from "./pages/moviedetail/MovieDetail";
 

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth.auth)
  const [dataDecode, setDataDecode] = useState();
  useEffect(() => {
    if(localStorage[LOCAL_STORAGE_TOKEN_NAME]){
      var token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
      var decoded = jwt_decode(token);
      dispatch(getToken(decoded));
      setDataDecode(decoded);
    }
  }, [auth])
  
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Default Layout */}
          <Route element={<Default />}>
            <Route index path="/" element={<Home />} />
            <Route path="/muave" element={<BuyTicket />} />
            <Route path="/muavetheophim" element={<MovieDetail />} />
            <Route path="/taikhoan" element={<Personal />} />
          </Route>

            {dataDecode?.RoleId === '2' && (
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user" element={<User />} />
              <Route path="/movietheater" element={<MovieTheater />} />
              <Route path="/movies" element={<Movie />} />
              <Route path="/showtimes" element={<ShowTime />} />
              <Route path="/tickets" element={<Ticket />} />
              <Route path="/news" element={<New />} />
            </Route>
            )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
