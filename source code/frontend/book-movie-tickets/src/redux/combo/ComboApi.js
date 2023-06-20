import axios from "axios";
import { comboError, comboStart, getComboByDateNow } from "./ComboSlice";

export const getAllComboByDateNowApi = async(dispatch) => {
    const PK = process.env.REACT_APP_PUBLIC_API;
    dispatch(comboStart());
    try{
        const res = await axios.get(`${PK}/combo/datenow`);
        dispatch(getComboByDateNow(res.data));
    }catch(err){
        dispatch(comboError());
    }
}