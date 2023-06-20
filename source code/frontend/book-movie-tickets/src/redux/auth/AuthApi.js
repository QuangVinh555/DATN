import axios from "axios";
import { authError, authStart, login, register } from "./AuthSlice";
import { LOCAL_STORAGE_TOKEN_NAME } from "../../localStorage/localStorage";

export const loginApi = async(user, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(authStart());
    try{
        const res = await axios.post(`${PK}/token`, user);
        dispatch(login(res.data));
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, res.data.data);
    }catch(err){
        dispatch(authError());
    }
}
export const registerApi = async(user, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(authStart());
    try{
        const res = await axios.post(`${PK}/user`, user);
        dispatch(register(res.data));
    }catch(err){
        dispatch(authError());
    }
}