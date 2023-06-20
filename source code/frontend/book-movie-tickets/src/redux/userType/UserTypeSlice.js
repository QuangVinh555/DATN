import { createSlice } from "@reduxjs/toolkit";
export const UserTypeSlice = createSlice({
    name: "userType",
    initialState:{
        pending: false,
        error: false,
        userType: null,
        userTypes: [],
    },
    reducers:{
        userTypeStart: (state) => {
            state.pending = true
        },
        userTypeError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllUserTypes: (state,action) => {
            state.pending = false;
            state.userTypes = action.payload
        },
        createUserType: (state, action) => {
            state.pending = false;
            state.userType = action.payload
            state.error = false;
        },
        updateUserType: (state, action) => {
            state.pending = false;
            state.userType = action.payload
            state.error = false;
        },
        deleteUserType: (state, action) => {
            state.pending = false;
            state.userType = action.payload
            state.error = false;
        },
    }
});

export const {userTypeStart, userTypeError, getAllUserTypes, createUserType, updateUserType, deleteUserType} = UserTypeSlice.actions;
export default UserTypeSlice.reducer;