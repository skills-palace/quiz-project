import toast from "react-hot-toast";
import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  stage: "intro",
  questions: 1,
  startTime: 0,
  answers: [],
};

export const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    clean(state, action) {
      state.stage = "intro";
      state.questions = 1;
      state.answers = [];
    },
    setQtime(state, { payload }) {
      state.spendTime = payload;
    },
    setStage(state, { payload }) {
      if (payload === "quiz") state.startTime = Date.now();
      state.stage = payload;
    },
    question(state, { payload }) {
      state.questions = payload;
    },
    answers({ answers }, { payload }) {
      answers.push(payload);
    },
  },
});

// Action creators are generated for each case reducer function
//export const { } = authSlice.actions;
export const { setStage, question, answers, clean, setQtime } =
  lessonSlice.actions;

export default lessonSlice.reducer;
