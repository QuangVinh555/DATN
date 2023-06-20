import axios from "axios";
import { bookTicketDetailError, bookTicketDetailStart, createBookTicketDetail, deleteBookTicketDetailByCancelChair, deleteBookTicketDetailByState } from "./BookTicketDetailSlice";

export const createBookTicketDetailApi = async(bookTicketDetail, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(bookTicketDetailStart());
    try{
        const res = await axios.post(`${PK}/bookticketdetail`, bookTicketDetail);
        dispatch(createBookTicketDetail(res.data));
    }catch(err){
        dispatch(bookTicketDetailError());
    }
}

export const deleteBookTicketDetailByCancelChairApi = async(chairStatusId, bookTicketId , dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(bookTicketDetailStart());
    try{
        const res = await axios.delete(`${PK}/bookticketdetail?chairStatusId=${chairStatusId}&bookTicketId=${bookTicketId}`);
        dispatch(deleteBookTicketDetailByCancelChair(res.data));
    }catch(err){
        dispatch(bookTicketDetailError());
    }
}

export const deleteBookTicketDetailByStateApi = async(bookTicketId, hourTimeId , dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(bookTicketDetailStart());
    try{
        const res = await axios.delete(`${PK}/bookticketdetail/bookticket?bookTicketId=${bookTicketId}&hourTimeId=${hourTimeId}`);
        dispatch(deleteBookTicketDetailByState(res.data));
    }catch(err){
        dispatch(bookTicketDetailError());
    }
}
