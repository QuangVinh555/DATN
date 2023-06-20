import axios from "axios";
import { loginGoogleError, loginGoogleStart, loginGoogleSuccess } from "./GooleLoginSlice";

export const loginGooleApi = async(tokenGG, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(loginGoogleStart());
    try{
        const res = await axios.post(`${PK}/tokengoogle`, tokenGG);
        dispatch(loginGoogleSuccess(res.data));
    }catch(err){
        dispatch(loginGoogleError());
    }
}