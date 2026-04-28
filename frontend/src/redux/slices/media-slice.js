import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const modifyFiles = (existingFilesLengh, files) => {
  let fileToUpload = [];

  for (let i = 0; i < files.length; i++) {
    const id = existingFilesLengh + i + 1;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    fileToUpload.push({
      id,
      file: files[i],
      progress: 0,
      cancelSource: source,
      status: "ready",
    });
  }

  return fileToUpload;
};

export const filesUpload = createAsyncThunk(
  "media/upload",
  (files, { dispatch, rejectWithValue }) => {
    if (files.length) {
      files.forEach(async (item) => {
        const formData = new FormData();
        formData.append("file", item.file);
        try {
          const response = await axios({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api",
            url: "/media",
            method: "post",
            data: formData,
            cancelToken: item.cancelSource.token,
            onUploadProgress: (progress) => {
              const { loaded, total } = progress;
              const percentageProgress = Math.floor((loaded / total) * 100);
              dispatch(
                setUploadProgress({
                  id: item.id,
                  progress: percentageProgress,
                })
              );
            },
          });
          dispatch(updateStatus({ id: item.id, status: "success" }));
          return response;
        } catch (error) {
          if (axios.isCancel(error)) {
          }

          dispatch(updateStatus({ id: item.id, status: "failed" }));

          return rejectWithValue("error data");
        }
      });
    }

    return false;
  }
);

const initialState = {
  fileProgress: [
    // format will be like below
    // 1: {
    //   id: 1,
    //   file,
    //   progress: 0,
    //   cancelSource: source,
    //   status: 0,
    // },
  ],
  totalFile: 0,
};

export const mediaSlice = createSlice({
  name: "mediaSlice",
  initialState,
  reducers: {
    setUploadFile(state, { payload }) {
      state.fileProgress = [
        ...state.fileProgress,
        ...modifyFiles(state.fileProgress.length, payload),
      ];
      state.totalFile = state.fileProgress.length;
    },
    setUploadProgress(state, { payload }) {
      const file = state.fileProgress.find((item) => item.id == payload.id);
      file.progress = payload.progress;
    },
    updateStatus(state, { payload }) {
      const file = state.fileProgress.find((item) => item.id == payload.id);
      file.status = payload.status;
    },
    removeFile(state, { payload }) {
      const fileIdx = state.fileProgress.findIndex(
        (item) => item.id === payload.id
      );

      state.fileProgress.splice(fileIdx, 1);
    },
    retryUpload(state, { payload }) {
      const CancelToken = axios.CancelToken;
      const cancelSource = CancelToken.source();

      const file = state.fileProgress.find((item) => item.id == payload.id);
      file.status = "uploading";
      //file.progress = 0;
      file.cancelSource = cancelSource;
    },
    // setEditedFle(state, { payload }) {
    //     state.fileProgress[payload.id] = {
    //         ...state.fileProgress[payload.id],
    //         file: payload.file,
    //     };
    // },
  },
  extraReducers: {
    [filesUpload.pending]: ({ isFetching }) => {
      isFetching = true;
    },
    [filesUpload.fulfilled]: (state, { payload }) => {},
    [filesUpload.rejected]: (state, action) => {
      if (axios.isCancel(state.error)) {
      }
    },
  },
});

export const retry = (id) => (dispatch, getState) => {
  dispatch(retryUpload({ id }));
  const { fileProgress } = getState().media;
  const reuploadFile = fileProgress.find((item) => item.id === id);
  dispatch(filesUpload([reuploadFile]));
};

export const uploadNow = () => (dispatch, getState) => {
  const { fileProgress } = getState().media;

  const fileToUpload = fileProgress.reduce(function (filtered, file) {
    if (file.status === "ready") {
      dispatch(updateStatus({ id: file.id, status: "uploading" }));
      filtered.push(file);
    }
    return filtered;
  }, []);

  dispatch(filesUpload(fileToUpload));
};

export const {
  setUploadFile,
  updateStatus,
  setUploadProgress,
  successUploadFile,
  failureUploadFile,
  retryUpload,
  setEditedFle,
  removeFile,
} = mediaSlice.actions;

export default mediaSlice.reducer;
