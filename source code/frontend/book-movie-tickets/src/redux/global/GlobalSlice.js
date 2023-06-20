import { createSlice } from "@reduxjs/toolkit";
export const GlobalSlice = createSlice({
    name: "global",
    initialState:{
        title: "",
        checked: false,
    },
    reducers:{
        updatedTitle(state, action) {
            state.title = action.payload
        },
        updatedChecked(state, action) {
            state.checked = action.payload
        },
    }
});

export const {updatedTitle, updatedChecked} = GlobalSlice.actions;
export default GlobalSlice.reducer;