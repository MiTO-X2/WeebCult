import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomNeko } from "../../api/nekoSource.js";

const initialState = {
    data: null,
    promiseState: {
        promise: null,
        error: null
    }
};

export const fetchRandomNeko = createAsyncThunk(
  "neko/fetchRandom",
  async (_, { rejectWithValue }) => {
    const neko = await getRandomNeko();
    if (!neko) {
      return rejectWithValue("No safe neko image found");
    }
    return neko;
  }
);

const nekoSlice = createSlice({
    name: "neko",
    initialState,
    reducers: {
        clearNeko(state) {
            state.data = null;
            state.promiseState.promise = null;
            state.promiseState.error = null;
        }
    },

    extraReducers: builder => {
        builder
            .addCase(fetchRandomNeko.pending, (state, action) => {
                state.promiseState.promise = action.meta.promise;
                state.promiseState.error = null;
            })
            .addCase(fetchRandomNeko.fulfilled, (state, action) => {
                state.data = action.payload;
                state.promiseState.promise = null;
            })
            .addCase(fetchRandomNeko.rejected, (state, action) => {
                state.promiseState.error = action.payload || action.error;
                state.promiseState.promise = null;
            });
    },
});

export default nekoSlice.reducer;
