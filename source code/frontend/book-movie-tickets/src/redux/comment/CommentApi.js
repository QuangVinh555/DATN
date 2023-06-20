import axios from "axios";
import { commentError, commentStart, createComment, getCommentsByMovieId } from "./CommentSlice";

export const getAllCommentsByMovieIdApi = async(movieId, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(commentStart());
    try{
        const res = await axios.get(`${PK}/comment/movie/${movieId}`);
        dispatch(getCommentsByMovieId(res.data));
    }catch(err){
        dispatch(commentError());
    }
}

export const createCommentApi = async(newComment, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(commentStart());
    try{
        const res = await axios.post(`${PK}/comment`, newComment);
        dispatch(createComment(res.data));
    }catch(err){
        dispatch(commentError());
    }
}