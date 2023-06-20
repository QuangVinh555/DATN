import { createSlice } from "@reduxjs/toolkit";
export const ShowTimeSlice = createSlice({
    name: "showtime",
    initialState:{
        pending: false,
        error: false,
        showTime: null,
        showTimes: [],
    },
    reducers:{
        showTimeStart: (state) => {
            state.pending = true
        },
        showTimeError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllShowTimeByCinemaNameIdAndDate: (state, action) => {
            state.pending = false;
            state.showTimes = action.payload;
            state.error = false;
        },
        createShowTime: (state, action) => {
            state.pending = false;
            state.showTime = action.payload;
            state.error = false;
        },
        updateShowTime: (state, action) => {
            state.pending = false;
            state.showTime = action.payload;
            state.error = false;
        },
        deleteShowTime: (state, action) => {
            state.pending = false;
            state.showTime = action.payload;
            state.error = false;
        },
        getAllShowTimeByMovieId: (state, action) => {
            state.pending = false;
            state.showTimes = action.payload;
            state.error = false;
        },
    }
});

export const {showTimeStart, showTimeError, getAllShowTimeByCinemaNameIdAndDate, 
    createShowTime, updateShowTime, deleteShowTime, getAllShowTimeByMovieId} = ShowTimeSlice.actions;
export default ShowTimeSlice.reducer;