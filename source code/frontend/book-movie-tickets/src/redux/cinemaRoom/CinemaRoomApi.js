import axios from "axios";
import { cinemaRoomError, cinemaRoomStart, createCinemaRoom, getAllCinemaRoomByCinemaNameId } from "./CinemaRoomSlice";

export const getAllCinemaRoomByCinemaNameIdApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaRoomStart());
    try{
        const res = await axios.get(`${PK}/cinemaroom/cinemaName?cinemaNameId=${param}`);
        dispatch(getAllCinemaRoomByCinemaNameId(res.data));
    }catch(err){
        dispatch(cinemaRoomError());
    }
}

export const createCinemaRoomApi = async(cinemaRoom, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaRoomStart());
    try{
        const res = await axios.post(`${PK}/cinemaroom`, cinemaRoom);
        dispatch(createCinemaRoom(res.data));
    }catch(err){
        dispatch(cinemaRoomError());
    }
}

export const updateCinemaRoomApi = async(param, cinemaRoom, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaRoomStart());
    try{
        const res = await axios.put(`${PK}/cinemaroom/${param}`, cinemaRoom);
        dispatch(createCinemaRoom(res.data));
    }catch(err){
        dispatch(cinemaRoomError());
    }
}

export const DeleteCinemaRoomApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaRoomStart());
    try{
        const res = await axios.delete(`${PK}/cinemaroom/${param}`);
        dispatch(createCinemaRoom(res.data));
    }catch(err){
        dispatch(cinemaRoomError());
    }
}



