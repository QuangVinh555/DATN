import { createSlice } from "@reduxjs/toolkit";
export const ChairStatus = createSlice({
    name: "chairStatus",
    initialState:{
        pending: false,
        error: false,
        chairStatus: null,
        listChairStatus: [],
    },
    reducers:{
        chairStatusStart: (state) => {
            state.pending = true
        },
        chairStatusError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllChairStatusByCinemaRoomId: (state,action) => {
            state.pending = false;
            state.listChairStatus = action.payload
            state.error = false;
        },
       
    }
});

export const {chairStatusStart, chairStatusError, getAllChairStatusByCinemaRoomId} = ChairStatus.actions;
export default ChairStatus.reducer;