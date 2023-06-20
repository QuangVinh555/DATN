import { createSlice } from "@reduxjs/toolkit";
export const UserPointSlice = createSlice({
    name: "userPoint",
    initialState:{
        pending: false,
        error: false,
        userPoint: null,
    },
    reducers:{
        userPointStart: (state) => {
            state.pending = true
        },
        userPointError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getUserPointByUserId: (state, action) => {
            state.pending = false;
            state.userPoint = action.payload;
            state.error = false;
        }
    }
});

export const {userPointStart, userPointError, getUserPointByUserId} = UserPointSlice.actions;
export default UserPointSlice.reducer;