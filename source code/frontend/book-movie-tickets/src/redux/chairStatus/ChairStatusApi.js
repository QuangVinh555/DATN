import axios from "axios";
import { chairStatusError, chairStatusStart, getAllChairStatusByCinemaRoomId } from "./ChairStatusSlice";

export const getAllChairStatusByCinemaRoomIdApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(chairStatusStart());
    try{
        const res = await axios.get(`${PK}/chairstatus/hourtime/${param}`);
        dispatch(getAllChairStatusByCinemaRoomId(res.data));
    }catch(err){
        dispatch(chairStatusError());
    }
}