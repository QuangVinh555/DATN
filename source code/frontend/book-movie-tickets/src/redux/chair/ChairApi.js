import axios from "axios";
import { chairError, chairStart, createChair, deleteChair, getAllChairByCinemaRoomId, updateChair } from "./ChairSlice";

export const getAllChairByCinemaRoomIdApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(chairStart());
    try{
        const res = await axios.get(`${PK}/chair/cinemaRoom/${param}`);
        dispatch(getAllChairByCinemaRoomId(res.data));
    }catch(err){
        dispatch(chairError());
    }
}

export const createChairApi = async(chair, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(chairStart());
    try{
        const res = await axios.post(`${PK}/chair`, chair);
        dispatch(createChair(res.data));
    }catch(err){
        dispatch(chairError());
    }
}

export const updateChairApi = async(param, chair, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(chairStart());
    try{
        const res = await axios.put(`${PK}/chair/${param}`, chair);
        dispatch(updateChair(res.data));
    }catch(err){
        dispatch(chairError());
    }
}

export const deleteChairApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(chairStart());
    try{
        const res = await axios.delete(`${PK}/chair/${param}`);
        dispatch(deleteChair(res.data));
    }catch(err){
        dispatch(chairError());
    }
}



