import axios from "axios";
import { createHourTime, deleteHourTime, getAllHourTimeByCinemaRoomId, getAllHourTimeByShowTimeId, getAllHourTimes, hourTimeError, hourTimeStart } from "./HourTimeSlice";

export const getAllHourTimeByCinemaRoomIdApi = async(param1, param2, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(hourTimeStart());
    try{
        const res = await axios.get(`${PK}/hourtime/cinemaroom?cinemaroom_id=${param1}&showTime_id=${param2}`);
        dispatch(getAllHourTimeByCinemaRoomId(res.data));
    }catch(err){
        dispatch(hourTimeError());
    }
}

export const getAllHourTimeByShowTimeIdApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(hourTimeStart());
    try{
        const res = await axios.get(`${PK}/hourtime/showtime/${param}`);
        dispatch(getAllHourTimeByShowTimeId(res.data));
    }catch(err){
        dispatch(hourTimeError());
    }
}

export const getAllHourTimesApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(hourTimeStart());
    try{
        const res = await axios.get(`${PK}/hourtime`);
        dispatch(getAllHourTimes(res.data));
    }catch(err){
        dispatch(hourTimeError());
    }
}

export const createHourTimeApi = async(hourTime, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(hourTimeStart());
    try{
        const res = await axios.post(`${PK}/hourtime`, hourTime);
        dispatch(createHourTime(res.data));
    }catch(err){
        dispatch(hourTimeError());
    }
}

export const deleteHourTimeApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(hourTimeStart());
    try{
        const res = await axios.delete(`${PK}/hourtime/${param}`);
        dispatch(deleteHourTime(res.data));
    }catch(err){
        dispatch(hourTimeError());
    }
}