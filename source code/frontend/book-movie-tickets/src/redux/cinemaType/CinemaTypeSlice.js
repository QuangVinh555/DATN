import { createSlice } from "@reduxjs/toolkit";
export const CinemaType = createSlice({
    name: "cinemaType",
    initialState:{
        pending: false,
        error: false,
        cinemaType: null,
        cinemaTypes: [],
    },
    reducers:{
        cinemaTypeStart: (state) => {
            state.pending = true
        },
        cinemaTypeError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllCinemaTypes: (state,action) => {
            state.pending = false;
            state.cinemaTypes = action.payload
            state.error = false;
        },
        createCinemaType: (state, action) => {
            state.pending = false;
            state.cinemaType = action.payload
            state.error = false;
        },
        updateCinemaType: (state, action) => {
            state.pending = false;
            state.cinemaType = action.payload
            state.error = false;
        },
        deleteCinemaType: (state, action) => {
            state.pending = false;
            state.cinemaType = action.payload
            state.error = false;
        },
    }
});

export const {cinemaTypeStart, cinemaTypeError, getAllCinemaTypes, createCinemaType, updateCinemaType, deleteCinemaType} = CinemaType.actions;
export default CinemaType.reducer;