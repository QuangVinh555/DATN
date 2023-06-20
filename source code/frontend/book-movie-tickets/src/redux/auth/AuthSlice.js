import { createSlice } from "@reduxjs/toolkit";
export const ChairSlice = createSlice({
    name: "auth",
    initialState:{
        pending: false,
        error: false,
        auth: null,
        token: "",
        isAuth: 0,
        isPage: 0,
    },
    reducers:{
        authStart: (state) => {
            state.pending = true
        },
        authError: (state) => {
            state.pending = false;
            state.error = true;
        },
        updateAuth: (state, action) => {
            state.pending = false;
            state.isAuth = action.payload
            state.error = false;
        },
        login: (state, action) => {
            state.pending = false;
            state.auth = action.payload
            state.error = false;
        },
        getToken: (state, action) => {
            state.token = action.payload
        },
        register: (state, action) => {
            state.pending = false;
            state.auth = action.payload
            state.error = false;
        },
        getPage(state, action) {
            state.pending = false;
            state.isPage = action.payload
            state.error = false;
        }
    }
});

export const {authStart, authError, updateAuth, login, getToken, register, getPage} = ChairSlice.actions;
export default ChairSlice.reducer;