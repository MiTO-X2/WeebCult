import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { traceMoeSearch } from "../../api/traceMoeSource.js";

const initialState = {
    data: [],
    promiseState: {
        promise: null,
        error: null
    }
};

export const fetchTraceMoeResult = createAsyncThunk(
    "traceMoe/fetchResult",
    async (imageUrl, { rejectWithValue }) => {
        const result = await traceMoeSearch(imageUrl);
        if (!result || result.length === 0) {
            return rejectWithValue("No anime match found");
        }
        return result;
    }
);

const traceMoeSlice = createSlice({
    name: "traceMoe",
    initialState,
    reducers: {
        clearTraceMoe(state) {
            state.data = null;
            state.promiseState.promise = null;
            state.promiseState.error = null;
        }
    },

    extraReducers: builder => {
        builder
            .addCase(fetchTraceMoeResult.pending, (state, action) => {
                state.promiseState.promise = action.meta.promise;
                state.promiseState.error = null;
            })
            .addCase(fetchTraceMoeResult.fulfilled, (state, action) => {
                state.data = action.payload;
                state.promiseState.promise = null;
            })
            .addCase(fetchTraceMoeResult.rejected, (state, action) => {
                state.promiseState.error = action.payload || action.error;
                state.promiseState.promise = null;
            });
    },
});

export const { clearTraceMoe } = traceMoeSlice.actions;
export default traceMoeSlice.reducer;
