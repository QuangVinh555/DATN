import { createSlice } from "@reduxjs/toolkit";
export const GooleLoginSlice = createSlice({
    name: "googleLogin",
    initialState:{
        pending: false,
        error: false,
        googleLogin: null,
        tokenGG: ""
    },
    reducers:{
        loginGoogleStart: (state) => {
            state.pending = true
        },
        loginGoogleError: (state) => {
            state.pending = false;
            state.error = true;
        },
        updateTokenGG: (state, action) => {
            state.pending = false;
            state.tokenGG = action.payload;
            state.error = false;
        },
        loginGoogleSuccess: (state, action) => {
            state.pending = false;
            state.googleLogin = action.payload
            state.error = false;
        }
    }
});

export const {loginGoogleStart, loginGoogleError,updateTokenGG, loginGoogleSuccess} = GooleLoginSlice.actions;
export default GooleLoginSlice.reducer;