import axios from "axios";
import { createLocation, getAllLocations, getAllSearchLocation, locationError, locationStart } from "./LocationSlice";

export const getAllUsersByPageApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(locationStart());
    try{
        const res = await axios.get(`${PK}/location/page?page=${param}`);
        dispatch(getAllLocations(res.data));
    }catch(err){
        dispatch(locationError());
    }
}

export const createLocationApi = async(province, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(locationStart());
    try{
        const res = await axios.post(`${PK}/location`, province);
        await dispatch(createLocation(res.data));
    }catch(err){
        await dispatch(locationError());
    }
}

// export const updateUserApi = async(user, param, dispatch) => {
//     const PK = process.env.REACT_APP_PUBLIC_API;
//     await dispatch(userStart());
//     try{
//         const res = await axios.put(`${PK}/user/${param}`, user);
//         await dispatch(updateUser(res.data));
//     }catch(err){
//         await dispatch(userError());
//     }
// }

// export const deleteUserApi = async(param, dispatch) => {
//     const PK = process.env.REACT_APP_PUBLIC_API;
//     await dispatch(userStart());
//     try{
//         const res = await axios.delete(`${PK}/user/${param}`);
//         await dispatch(deleteUser(res.data));
//     }catch(err){
//         await dispatch(userError());
//     }
// }

export const getAllSearchLocationApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(locationStart());
    try{
        const res = await axios.get(`${PK}/location`);
        await dispatch(getAllSearchLocation(res.data));
    }catch(err){
        await dispatch(locationError());
    }
}