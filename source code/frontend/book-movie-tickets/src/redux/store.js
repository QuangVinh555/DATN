import { configureStore } from "@reduxjs/toolkit";
import GlobalReducer from "./global/GlobalSlice";
import UserReducer from "./user/UserSlice";
import UserTypeReducer from "./userType/UserTypeSlice";
import UserRankReducer from "./userRank/UserRankSlice";
import LocationReducer from "./location/LocationSlice";
import CinemaTypeReducer from "./cinemaType/CinemaTypeSlice";
import CinemaNameReducer from "./cinemaName/CinemaNameSlice";
import CinemaRoomReducer from "./cinemaRoom/CinemaRoomSlice";
import ChairReducer from "./chair/ChairSlice";
import MovieReducer from "./movie/MovieSlice";
import ShowTimeReducer from "./showTime/ShowTimeSlice";
import HourTimeReducer from "./hourTime/HourTimeSlice";
import AuthReducer from "./auth/AuthSlice";
import ChairStatusReducer from "./chairStatus/ChairStatusSlice";
import BookTicketReducer from "./bookTicket/BookTicketSlice";
import BookTicketDetailReducer from "./bookTicketDetail/BookTicketDetailSlice";
import ComboReducer from "./combo/ComboSlice";
import UserPointReducer from "./usePoint/UserPointSlice";
import GoogleLoginReducer from "./gooleLogin/GooleLoginSlice";
import CommentReducer from "./comment/CommentSlice";
export default configureStore({
    reducer: {
        global: GlobalReducer,
        user: UserReducer,
        userType: UserTypeReducer,
        userRank: UserRankReducer,
        location: LocationReducer,
        cinemaType: CinemaTypeReducer,
        cinemaName: CinemaNameReducer,
        cinemaRoom: CinemaRoomReducer,
        chair: ChairReducer,
        movie: MovieReducer,
        showTime: ShowTimeReducer,
        hourTime: HourTimeReducer,
        auth: AuthReducer,
        chairStatus: ChairStatusReducer,
        bookTicket: BookTicketReducer,
        bookTicketDetail: BookTicketDetailReducer,
        combo: ComboReducer,
        userPoint: UserPointReducer,
        googleLogin: GoogleLoginReducer,
        comment: CommentReducer,
    }  
});