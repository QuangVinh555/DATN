import axios from "axios";
import { userRankError, userRankStart, getAllUserRanks, createUserRank, updateUserRank, deleteUserRank } from "./UserRankSlice";

export const getAllUserRanksApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(userRankStart());
    try{
        const res = await axios.get(`${PK}/rankuser`);
        dispatch(getAllUserRanks(res.data));
    }catch(err){
        dispatch(userRankError());
    }
}

export const createUserRankApi = async(userRank, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userRankStart());
    try{
        const res = await axios.post(`${PK}/rankuser`, userRank);
        await dispatch(createUserRank(res.data));
    }catch(err){
        await dispatch(userRankError());
    }
}

export const updateUserRankApi = async(userRank, param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userRankStart());
    try{
        const res = await axios.put(`${PK}/rankuser/${param}`, userRank);
        await dispatch(updateUserRank(res.data));
    }catch(err){
        await dispatch(userRankError());
    }
}

export const deleteUserRankApi = async(param, dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    await dispatch(userRankStart());
    try{
        const res = await axios.delete(`${PK}/rankuser/${param}`);
        await dispatch(deleteUserRank(res.data));
    }catch(err){
        await dispatch(userRankError());
    }
}
