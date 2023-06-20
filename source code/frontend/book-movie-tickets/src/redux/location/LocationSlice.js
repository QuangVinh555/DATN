import { createSlice } from "@reduxjs/toolkit";
export const LocationSlice = createSlice({
    name: "location",
    initialState:{
        pending: false,
        error: false,
        location: null,
        locations: [],
        listSearch: []
    },
    reducers:{
        locationStart: (state) => {
            state.pending = true
        },
        locationError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllLocations: (state,action) => {
            state.pending = false;
            state.locations = action.payload
            state.error = false;
        },
        createLocation: (state, action) => {
            state.pending = false;
            state.location = action.payload
            state.error = false;
        },
        updateLocation: (state, action) => {
            state.pending = false;
            state.location = action.payload
            state.error = false;
        },
        deleteLocation: (state, action) => {
            state.pending = false;
            state.location = action.payload
            state.error = false;
        }, 
        getAllSearchLocation: (state, action) => {
            state.pending = false;
            state.listSearch = action.payload
            state.error = false;
        },
    }
});

export const {locationStart, locationError, getAllLocations, createLocation, updateLocation, deleteLocation, getAllSearchLocation} = LocationSlice.actions;
export default LocationSlice.reducer;