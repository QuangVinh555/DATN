import axios from "axios";
import { cinemaTypeError, cinemaTypeStart, createCinemaType, deleteCinemaType, getAllCinemaTypes, updateCinemaType } from "./CinemaTypeSlice";

export const getAllCinemaTypesApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaTypeStart());
    try{
        const res = await axios.get(`${PK}/typecinema`);
        dispatch(getAllCinemaTypes(res.data));
    }catch(err){
        dispatch(cinemaTypeError());
    }
}

export const createCinemaTypeApi = async(cinemaType, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(cinemaTypeStart());
    try{
        const res = await axios.post(`${PK}/typecinema`, cinemaType);
        await dispatch(createCinemaType(res.data));
    }catch(err){
        await dispatch(cinemaTypeError());
    }
}

export const updateCinemaTypeApi = async(cinemaType, param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(cinemaTypeStart());
    try{
        const res = await axios.put(`${PK}/typecinema/${param}`, cinemaType);
        await dispatch(updateCinemaType(res.data));
    }catch(err){
        await dispatch(cinemaTypeError());
    }
}

export const deleteCinemaTypeApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(cinemaTypeStart());
    try{
        const res = await axios.delete(`${PK}/typecinema/${param}`);
        await dispatch(deleteCinemaType(res.data));
    }catch(err){
        await dispatch(cinemaTypeError());
    }
}
