import { createSlice } from "@reduxjs/toolkit";
export const UserSlice = createSlice({
    name: "user",
    initialState:{
        pending: false,
        error: false,
        user: null,
        users: [],
        listSearch: []
    },
    reducers:{
        userStart: (state) => {
            state.pending = true
        },
        userError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllUsers: (state,action) => {
            state.pending = false;
            state.users = action.payload
            state.error = false;
        },
        createUser: (state, action) => {
            state.pending = false;
            state.user = action.payload
            state.error = false;
        },
        updateUser: (state, action) => {
            state.pending = false;
            state.user = action.payload
            state.error = false;
        },
        deleteUser: (state, action) => {
            state.pending = false;
            state.user = action.payload
            state.error = false;
        },
        getAllSearchUser: (state, action) => {
            state.pending = false;
            state.listSearch = action.payload
            state.error = false;
        },
        getIdUserByLoginGG: (state, action) => {
            state.pending = false;
            state.user = action.payload
            state.error = false;
        },
        getUserById: (state, action) => {
            state.pending = false;
            state.user = action.payload
            state.error = false;
        }
    }
});

export const {userStart, userError, getAllUsers, createUser, updateUser, deleteUser, getAllSearchUser, getIdUserByLoginGG, getUserById} = UserSlice.actions;
export default UserSlice.reducer;