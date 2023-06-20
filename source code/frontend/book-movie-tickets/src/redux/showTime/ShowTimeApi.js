import axios from "axios";
import { createShowTime, deleteShowTime, getAllShowTimeByCinemaNameIdAndDate, getAllShowTimeByMovieId, showTimeError, showTimeStart, updateShowTime } from "./ShowTimeSlice";

export const getAllShowTimeByCinemaNameIdAndDateApi = async(param1, param2, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(showTimeStart());
    try{
        const res = await axios.get(`${PK}/showtime/info?cinemaName_id=${param1}&date=${param2}`);
        dispatch(getAllShowTimeByCinemaNameIdAndDate(res.data));
    }catch(err){
        dispatch(showTimeError());
    }
}

export const createShowTimeApi = async(showTime, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(showTimeStart());
    try{
        const res = await axios.post(`${PK}/showtime`, showTime);
        dispatch(createShowTime(res.data));
    }catch(err){
        dispatch(showTimeError());
    }
}

export const updateShowTimeApi = async(showTime, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(showTimeStart());
    try{
        const res = await axios.put(`${PK}/showtime`, showTime);
        dispatch(updateShowTime(res.data));
    }catch(err){
        dispatch(showTimeError());
    }
}

export const deleteShowTimeApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(showTimeStart());
    try{
        const res = await axios.delete(`${PK}/showtime/${param}`);
        dispatch(deleteShowTime(res.data));
    }catch(err){
        dispatch(showTimeError());
    }
}

export const getAllShowTimeByMovieId3Api = async(movieId, locationId, date, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(showTimeStart());
    try{
        const res = await axios.get(`${PK}/showtime/movie?movieId=${movieId}&locationId=${locationId}&date=${date}`);
        dispatch(getAllShowTimeByMovieId(res.data));
    }catch(err){
        dispatch(showTimeError());
    }
}

export const getAllShowTimeByMovieId4Api = async(movieId, locationId, date, cinemaTypeId, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(showTimeStart());
    try{
        const res = await axios.get(`${PK}/showtime/movie?movieId=${movieId}&locationId=${locationId}&date=${date}&cinemaTypeId=${cinemaTypeId}`);
        dispatch(getAllShowTimeByMovieId(res.data));
    }catch(err){
        dispatch(showTimeError());
    }
}