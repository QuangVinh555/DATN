import axios from "axios";
import { getUserPointByUserId, userPointError, userPointStart } from "./UserPointSlice";

export const getUserPointByUserIdApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(userPointStart());
    try{
        const res = await axios.get(`${PK}/userpoint/${param}`);
        dispatch(getUserPointByUserId(res.data));
    }catch(err){
        dispatch(userPointError());
    }
}
