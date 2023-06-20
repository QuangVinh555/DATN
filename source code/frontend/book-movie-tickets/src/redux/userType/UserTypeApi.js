import axios from "axios";
import { createUserType, deleteUserType, getAllUserTypes, updateUserType, userTypeError, userTypeStart } from "./UserTypeSlice";

export const getAllUserTypesApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(userTypeStart());
    try{
        const res = await axios.get(`${PK}/role`);
        dispatch(getAllUserTypes(res.data));
    }catch(err){
        dispatch(userTypeError());
    }
}

export const createUserTypeApi = async(userType, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userTypeStart());
    try{
        const res = await axios.post(`${PK}/role`, userType);
        await dispatch(createUserType(res.data));
    }catch(err){
        await dispatch(userTypeError());
    }
}

export const updateUserTypeApi = async(userType, param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userTypeStart());
    try{
        const res = await axios.put(`${PK}/role/${param}`, userType);
        await dispatch(updateUserType(res.data));
    }catch(err){
        await dispatch(userTypeError());
    }
}

export const deleteUserTypeApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userTypeStart());
    try{
        const res = await axios.delete(`${PK}/role/${param}`);
        await dispatch(deleteUserType(res.data));
    }catch(err){
        await dispatch(userTypeError());
    }
}
