import { createSlice } from "@reduxjs/toolkit";
export const BookTicketDetailSlice = createSlice({
    name: "bookTicketDetail",
    initialState:{
        pending: false,
        error: false,
        bookTicketDetail: null,
        bookTicketDetails: [],
    },
    reducers:{
        bookTicketDetailStart: (state) => {
            state.pending = true
        },
        bookTicketDetailError: (state) => {
            state.pending = false;
            state.error = true;
        },   
        createBookTicketDetail: (state, action) => {
            state.pending = false;
            state.bookTicketDetail = action.payload;
            state.error = false;
        },   
        deleteBookTicketDetailByCancelChair: (state, action) => {
            state.pending = false;
            state.bookTicketDetail = action.payload;
            state.error = false;
        },   
        deleteBookTicketDetailByState: (state, action) => {
            state.pending = false;
            state.bookTicketDetail = action.payload;
            state.error = false;
        },   
    }
});

export const {bookTicketDetailStart, bookTicketDetailError, createBookTicketDetail, 
    deleteBookTicketDetailByCancelChair, deleteBookTicketDetailByState} = BookTicketDetailSlice.actions;
export default BookTicketDetailSlice.reducer;