import axios from "axios";
import { createMovie, deleteMovie, getAllMovies, getMovieBig, getMovieSmall, movieError, movieStart, updateMovie } from "./MovieSlice";

export const getAllMoviesApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(movieStart());
    try{
        const res = await axios.get(`${PK}/movie`);
        dispatch(getAllMovies(res.data));
    }catch(err){
        dispatch(movieError());
    }
}

export const createMovieApi = async(movie, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(movieStart());
    try{
        const res = await axios.post(`${PK}/movie`, movie);
        dispatch(createMovie(res.data));
    }catch(err){
        dispatch(movieError());
    }
}

export const updateMovieApi = async(param, movie, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(movieStart());
    try{
        const res = await axios.put(`${PK}/movie/${param}`, movie);
        dispatch(updateMovie(res.data));
    }catch(err){
        dispatch(movieError());
    }
}

export const deleteMovieApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(movieStart());
    try{
        const res = await axios.delete(`${PK}/movie/${param}`);
        dispatch(deleteMovie(res.data));
    }catch(err){
        dispatch(movieError());
    }
}

export const getMovieBigApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(movieStart());
    try{
        const res = await axios.get(`${PK}/movie/datebig?id=${param}`);
        dispatch(getMovieBig(res.data));
    }catch(err){
        dispatch(movieError());
    }
}

export const getMovieSmallApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(movieStart());
    try{
        const res = await axios.get(`${PK}/movie/datesmall?id=${param}`);
        dispatch(getMovieSmall(res.data));
    }catch(err){
        dispatch(movieError());
    }
}


