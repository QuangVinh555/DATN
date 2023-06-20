import axios from "axios";
import { cinemaNameError, cinemaNameStart, createCinemaName, getAllCinemaNames, getAllCinemaNamesByCinemaTypeId, getAllCinemaNamesByLocationId, getAllCinemaNamesByLocationIdAndCinemaTypeId, getAllCinemaNamesByPage, getByMovieId, getByMovieIdAll } from "./CinemaNameSlice";

export const getAllCinemaNamesByPageApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaNameStart());
    try{
        const res = await axios.get(`${PK}/cinemaname/page?page=${param}`);
        dispatch(getAllCinemaNamesByPage(res.data));
    }catch(err){
        dispatch(cinemaNameError());
    }
}

export const getAllCinemaNamesApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaNameStart());
    try{
        const res = await axios.get(`${PK}/cinemaname`);
        dispatch(getAllCinemaNames(res.data));
    }catch(err){
        dispatch(cinemaNameError());
    }
}

export const getAllCinemaNamesByLocationIdApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaNameStart());
    try{
        const res = await axios.get(`${PK}/cinemaname?locationId=${param}`);
        dispatch(getAllCinemaNamesByLocationId(res.data));
    }catch(err){
        dispatch(cinemaNameError());
    }
}

export const getAllCinemaNamesByCinemaTypeIdApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaNameStart());
    try{
        const res = await axios.get(`${PK}/cinemaname?cinemaTypeId=${param}`);
        dispatch(getAllCinemaNamesByCinemaTypeId(res.data));
    }catch(err){
        dispatch(cinemaNameError());
    }
}

export const getAllCinemaNamesByLocationIdAndCinemaTypeIdApi = async(param1, param2, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaNameStart());
    try{
        const res = await axios.get(`${PK}/cinemaname?locationId=${param1}&cinemaTypeId=${param2}`);
        dispatch(getAllCinemaNamesByLocationIdAndCinemaTypeId(res.data));
    }catch(err){
        dispatch(cinemaNameError());
    }
}

export const createCinemaNameApi = async(cinemaName, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(cinemaNameStart());
    try{
        const res = await axios.post(`${PK}/cinemaname`, cinemaName);
        await dispatch(createCinemaName(res.data));
    }catch(err){
        await dispatch(cinemaNameError());
    }
}

export const getByMovieIdApi = async(locationId, movieId, date, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaNameStart());
    try{
        const res = await axios.get(`${PK}/cinemaname/bymovie?locationId=${locationId}&movieId=${movieId}&date=${date}`);
        dispatch(getByMovieId(res.data));
    }catch(err){
        dispatch(cinemaNameError());
    }
}

export const getByMovieIdAllApi = async(locationId, cinemaTypeId, movieId, date, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(cinemaNameStart());
    try{
        const res = await axios.get(`${PK}/cinemaname/bymovie?locationId=${locationId}&cinemaTypeId=${cinemaTypeId}&movieId=${movieId}&date=${date}`);
        dispatch(getByMovieIdAll(res.data));
    }catch(err){
        dispatch(cinemaNameError());
    }
}
