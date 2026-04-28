import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// slices
import lessonSlice from "./slices/lesson-slice";
import mediaSlice from "./slices/media-slice";
import appSlice from "./slices/app-slice";

// api
import { utilsApi } from "./api/utils-api";
import { userApi } from "./api/user-api";
import { meApi } from "./api/me-api";
import { quizApi } from "./api/quiz-api";
import { lessonApi } from "./api/lesson-api";
import { learnerApi } from "./api/learner-api";
import { learnGroupApi } from "./api/learn-group-api";
import { mediaApi } from "./api/media-api";
import AppApi from "./api/app-api";
import fileManagerApi from "./api/file-manager-api";
import { skillsApi } from "./api/skills-api"; // Add skillsApi import

const store = configureStore({
  reducer: {
    app: appSlice,
    lesson: lessonSlice,
    media: mediaSlice,
    [quizApi.reducerPath]: quizApi.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [utilsApi.reducerPath]: utilsApi.reducer,
    [meApi.reducerPath]: meApi.reducer,
    [learnerApi.reducerPath]: learnerApi.reducer,
    [learnGroupApi.reducerPath]: learnGroupApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [AppApi.reducerPath]: AppApi.reducer,
    [fileManagerApi.reducerPath]: fileManagerApi.reducer,
    [skillsApi.reducerPath]: skillsApi.reducer, // Add skillsApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      quizApi.middleware,
      lessonApi.middleware,
      learnerApi.middleware,
      learnGroupApi.middleware,
      userApi.middleware,
      meApi.middleware,
      utilsApi.middleware,
      mediaApi.middleware,
      AppApi.middleware,
      fileManagerApi.middleware,
      skillsApi.middleware, // Add skillsApi middleware
    ]),
});

const { dispatch } = store;

setupListeners(dispatch);

export { store, dispatch };
