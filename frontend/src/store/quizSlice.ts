import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api";
import type { Question, Quiz } from "../types";

export const loadQuizzes = createAsyncThunk(
  "data/quizzes",
  async () => (await api.get<Quiz[]>("/quizzes")).data,
);

export const loadQuestions = createAsyncThunk(
  "data/questions",
  async () => (await api.get<Question[]>("/questions")).data,
);

const quizSlice = createSlice({
  name: "data",
  initialState: {
    quizzes: [] as Quiz[],
    questions: [] as Question[],
    loading: false,
    error: "",
  },
  reducers: {
    clearData(state) {
      state.quizzes = [];
      state.questions = [];
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuizzes.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload;
        state.loading = false;
      })
      .addCase(loadQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Could not load quizzes.";
      })
      .addCase(loadQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
      });
  },
});

export const { clearData } = quizSlice.actions;
export default quizSlice.reducer;
