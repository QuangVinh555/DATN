import axios from "axios";
import { userError, userStart, getAllUsers, createUser, updateUser, deleteUser, getAllSearchUser, getIdUserByLoginGG, getUserById } from "./UserSlice";

export const getAllUsersApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(userStart());
    try{
        const res = await axios.get(`${PK}/user/page?page=${param}`);
        dispatch(getAllUsers(res.data));
    }catch(err){
        dispatch(userError());
    }
}

export const createUserApi = async(user, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userStart());
    try{
        const res = await axios.post(`${PK}/user`, user);
        await dispatch(createUser(res.data));
    }catch(err){
        await dispatch(userError());
    }
}

export const updateUserApi = async(user, param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userStart());
    try{
        const res = await axios.put(`${PK}/user/${param}`, user);
        await dispatch(updateUser(res.data));
    }catch(err){
        await dispatch(userError());
    }
}

export const deleteUserApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userStart());
    try{
        const res = await axios.delete(`${PK}/user/${param}`);
        await dispatch(deleteUser(res.data));
    }catch(err){
        await dispatch(userError());
    }
}

export const getAllSearchUserApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userStart());
    try{
        const res = await axios.get(`${PK}/user`);
        await dispatch(getAllSearchUser(res.data));
    }catch(err){
        await dispatch(userError());
    }
}

export const getIdUserByLoginGGApi = async(email, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userStart());
    try{
        const res = await axios.get(`${PK}/user/email?email=${email}`);
        await dispatch(getIdUserByLoginGG(res.data));
    }catch(err){
        await dispatch(userError());
    }
}

export const getUserByIdApi = async(userId, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userStart());
    try{
        const res = await axios.get(`${PK}/user/${userId}`);
        await dispatch(getUserById(res.data));
    }catch(err){
        await dispatch(userError());
    }
}