import { createSlice } from "@reduxjs/toolkit";
export const CinemaNameSlice = createSlice({
    name: "cinemaName",
    initialState:{
        pending: false,
        error: false,
        cinemaName: null,
        cinemaNames: [],
        listSearch: [],
        // listSearchByLocations: []
    },
    reducers:{
        cinemaNameStart: (state) => {
            state.pending = true
        },
        cinemaNameError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllCinemaNamesByPage: (state,action) => {
            state.pending = false;
            state.cinemaNames = action.payload
            state.error = false;
        }, 
        getAllCinemaNamesByLocationId: (state,action) => {
            state.pending = false;
            state.cinemaNames = action.payload
            state.error = false;
        },
        getAllCinemaNamesByCinemaTypeId: (state,action) => {
            state.pending = false;
            state.cinemaNames = action.payload
            state.error = false;
        },
        getAllCinemaNamesByLocationIdAndCinemaTypeId: (state,action) => {
            state.pending = false;
            state.cinemaNames = action.payload
            state.error = false;
        },
        getAllCinemaNames: (state,action) => {
            state.pending = false;
            state.listSearch = action.payload
            state.error = false;
        },
        createCinemaName: (state, action) => {
            state.pending = false;
            state.cinemaName = action.payload
            state.error = false;
        },
        updateCinemaName: (state, action) => {
            state.pending = false;
            state.cinemaName = action.payload
            state.error = false;
        },
        deleteCinemaName: (state, action) => {
            state.pending = false;
            state.cinemaName = action.payload
            state.error = false;
        },
        getByMovieId: (state,action) => {
            state.pending = false;
            state.cinemaNames = action.payload
            state.error = false;
        },
        getByMovieIdAll: (state,action) => {
            state.pending = false;
            state.cinemaNames = action.payload
            state.error = false;
        },
    }
});

export const {cinemaNameStart, cinemaNameError, 
    getAllCinemaNamesByPage, getAllCinemaNames, createCinemaName, 
    updateCinemaName, deleteCinemaName, getAllCinemaNamesByLocationId, 
    getAllCinemaNamesByCinemaTypeId,
    getAllCinemaNamesByLocationIdAndCinemaTypeId,
    getByMovieId, getByMovieIdAll} = CinemaNameSlice.actions;
export default CinemaNameSlice.reducer;