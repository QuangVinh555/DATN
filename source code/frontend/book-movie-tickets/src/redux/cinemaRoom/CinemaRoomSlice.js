import { createSlice } from "@reduxjs/toolkit";
export const CinemaRoomSlice = createSlice({
    name: "cinemaRoom",
    initialState:{
        pending: false,
        error: false,
        cinemaRoom: null,
        cinemaRooms: [],
    },
    reducers:{
        cinemaRoomStart: (state) => {
            state.pending = true
        },
        cinemaRoomError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllCinemaRoomByCinemaNameId: (state,action) => {
            state.pending = false;
            state.cinemaRooms = action.payload
            state.error = false;
        },
        createCinemaRoom: (state,action) => {
            state.pending = false;
            state.cinemaRoom = action.payload
            state.error = false;
        },
        updateCinemaRoom: (state,action) => {
            state.pending = false;
            state.cinemaRoom = action.payload
            state.error = false;
        },
        DeleteCinemaRoom: (state,action) => {
            state.pending = false;
            state.cinemaRoom = action.payload
            state.error = false;
        }
       
    }
});

export const {cinemaRoomStart, cinemaRoomError, 
    getAllCinemaRoomByCinemaNameId, createCinemaRoom, 
    updateCinemaRoom, DeleteCinemaRoom} = CinemaRoomSlice.actions;
export default CinemaRoomSlice.reducer;