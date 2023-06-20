import { createSlice } from "@reduxjs/toolkit";
export const UserRankSlice = createSlice({
    name: "userRank",
    initialState:{
        pending: false,
        error: false,
        userRank: null,
        userRanks: [],
    },
    reducers:{
        userRankStart: (state) => {
            state.pending = true
        },
        userRankError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllUserRanks: (state,action) => {
            state.pending = false;
            state.userRanks = action.payload
            state.error = false;
        },
        createUserRank: (state, action) => {
            state.pending = false;
            state.userRank = action.payload
            state.error = false;
        },
        updateUserRank: (state, action) => {
            state.pending = false;
            state.userRank = action.payload
            state.error = false;
        },
        deleteUserRank: (state, action) => {
            state.pending = false;
            state.userRank = action.payload
            state.error = false;
        },
    }
});

export const {userRankStart, userRankError, getAllUserRanks, createUserRank, updateUserRank, deleteUserRank} = UserRankSlice.actions;
export default UserRankSlice.reducer;