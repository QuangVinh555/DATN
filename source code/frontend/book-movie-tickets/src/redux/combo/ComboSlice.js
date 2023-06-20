import { createSlice } from "@reduxjs/toolkit";
export const ComboSlice = createSlice({
    name: "combo",
    initialState:{
        pending: false,
        error: false,
        combo: null,
        combos: [],
    },
    reducers:{
        comboStart: (state) => {
            state.pending = true
        },
        comboError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getComboByDateNow: (state,action) => {
            state.pending = false;
            state.combos = action.payload
            state.error = false;
        },

    }
});

export const {comboStart, comboError, getComboByDateNow} = ComboSlice.actions;
export default ComboSlice.reducer;