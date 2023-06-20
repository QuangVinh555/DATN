import { createSlice } from "@reduxjs/toolkit";
export const BookTicketSlice = createSlice({
    name: "bookTicket",
    initialState:{
        pending: false,
        error: false,
        bookTicket: null,
        bookTickets: [],
    },
    reducers:{
        bookTicketStart: (state) => {
            state.pending = true
        },
        bookTicketError: (state) => {
            state.pending = false;
            state.error = true;
        },   
        cancelErrorBookTicket: (state,action) => {
            state.error = action.payload
        },
        createBookTicket: (state, action) => {
            state.pending = false;
            state.bookTicket = action.payload;
            state.error = false;
        },   
        updateBookTicket: (state, action) => {
            state.pending = false;
            state.bookTicket = action.payload;
            state.error = false;
        },   
        getBookTicketById: (state, action) => {
            state.pending = false;
            state.bookTicket = action.payload;
            state.error = false;
        },
        getBookTicketByUserId: (state, action) => {
            state.pending = false;
            state.bookTickets = action.payload;
            state.error = false;
        }
    }
});

export const {bookTicketStart, bookTicketError, createBookTicket, 
    updateBookTicket, cancelErrorBookTicket, getBookTicketById, getBookTicketByUserId} = BookTicketSlice.actions;
export default BookTicketSlice.reducer;