import { createSlice } from "@reduxjs/toolkit";
export const MovieSlice = createSlice({
    name: "movie",
    initialState:{
        pending: false,
        error: false,
        movie: null,
        movies: [],
    },
    reducers:{
        movieStart: (state) => {
            state.pending = true
        },
        movieError: (state) => {
            state.pending = false;
            state.error = true;
        },
        getAllMovies: (state, action) => {
            state.pending = false;
            state.movies = action.payload;
            state.error = false;
        },
        createMovie: (state, action) => {
            state.pending = false;
            state.movie = action.payload;
            state.error = false;
        },
        updateMovie: (state, action) => {
            state.pending = false;
            state.movie = action.payload;
            state.error = false;
        },
        deleteMovie: (state, action) => {
            state.pending = false;
            state.movie = action.payload;
            state.error = false;
        },
        getMovieBig: (state, action) => {
            state.pending = false;
            state.movies = action.payload;
            state.error = false;
        },
        getMovieSmall: (state, action) => {
            state.pending = false;
            state.movies = action.payload;
            state.error = false;
        },
    }
});

export const {movieStart, movieError, getAllMovies, 
    createMovie, updateMovie, deleteMovie, getMovieBig, getMovieSmall} = MovieSlice.actions;
export default MovieSlice.reducer;