import { createSlice } from "@reduxjs/toolkit";
import { fetchRandomNeko } from "../thunks/nekoThunks";

const nekoSlice = createSlice({
    name: "neko",
    initialState: {
        data: null,      
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRandomNeko.pending, state => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchRandomNeko.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload; 
            })
            .addCase(fetchRandomNeko.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default nekoSlice.reducer;
