import { createSlice } from '@reduxjs/toolkit';

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    error: null,
  },
  reducers: {
    fetchFilesSuccess: (state, action) => {
      console.log('Data received in files reducer:', action.payload);
      state.files = action.payload;
      state.error = null;
    },
    fetchFilesFailure: (state, action) => {
      console.log('Error received in files reducer:', action.payload); 
      state.error = { message: action.payload.message, stack: action.payload.stack };
    },
  },
});

export const { fetchFilesSuccess, fetchFilesFailure } = filesSlice.actions;
export default filesSlice.reducer;
