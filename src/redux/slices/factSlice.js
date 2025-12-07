import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomAnimeFact } from "/src/api/animeSource.js"; // your API function

// Thunk to fetch a random fact
export const fetchRandomFact = createAsyncThunk(
  "fact/fetchRandomFact",
  async (_, { rejectWithValue }) => {
    try {
      const fact = await getRandomAnimeFact();
      return fact; // { anime, fact }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  data: null,       // { anime, fact }
  loading: false,
  error: null
};

export const factSlice = createSlice({
  name: "fact",
  initialState,
  reducers: {
    clearFact(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomFact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchRandomFact.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRandomFact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFact } = factSlice.actions;
export default factSlice.reducer;
