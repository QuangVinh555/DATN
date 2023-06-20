import axios from "axios";
import { bookTicketError, bookTicketStart, createBookTicket, getBookTicketById, getBookTicketByUserId, updateBookTicket } from "./BookTicketSlice";

export const createBookTicketApi = async(bookTicket, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(bookTicketStart());
    try{
        const res = await axios.post(`${PK}/bookticket`, bookTicket);
        dispatch(createBookTicket(res.data));
    }catch(err){
        dispatch(bookTicketError());
    }
}

export const updateBookTicketApi = async(param, bookTicket, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(bookTicketStart());
    try{
        const res = await axios.put(`${PK}/bookticket/${param}`, bookTicket);
        dispatch(updateBookTicket(res.data));
    }catch(err){
        dispatch(bookTicketError());
    }
}

export const getBookTicketApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(bookTicketStart());
    try{
        const res = await axios.get(`${PK}/bookticket/${param}`);
        dispatch(getBookTicketById(res.data));
    }catch(err){
        dispatch(bookTicketError());
    }
}

export const getBookTicketByUserIdApi = async(page, userId, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(bookTicketStart());
    try{
        const res = await axios.get(`${PK}/bookticket/page?page=${page}&userId=${userId}`);
        dispatch(getBookTicketByUserId(res.data));
    }catch(err){
        dispatch(bookTicketError());
    }
}
