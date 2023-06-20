import { createSlice } from "@reduxjs/toolkit";
export const CommentSlice = createSlice({
    name: "comment",
    initialState:{
        pending: false,
        error: false,
        comment: null,
        comments: [],
    },
    reducers:{
        commentStart: (state) => {
            state.pending = true
        },
        commentError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getCommentsByMovieId: (state,action) => {
            state.pending = false;
            state.comments = action.payload
            state.error = false;
        },
        createComment: (state,action) => {
            state.pending = false;
            state.comment = action.payload
            state.error = false;
        },
    }
});

export const {commentStart, commentError, getCommentsByMovieId, createComment} = CommentSlice.actions;
export default CommentSlice.reducer;