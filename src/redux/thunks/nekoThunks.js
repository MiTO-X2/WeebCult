import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomNeko } from "../../api/nekoSource.js";

export const fetchRandomNeko = createAsyncThunk(
  "neko/fetchRandom",
  async () => {
    console.log("Thunk: fetchRandomNeko called"); // <-- log start

    const neko = await getRandomNeko();

    console.log("Thunk: fetched neko object", neko); // <-- log response

    return neko;
  }
);
