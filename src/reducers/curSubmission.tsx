import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SubmissionState {
  selectedSubmission: string | number;
}

const initialState: SubmissionState = {
  selectedSubmission: '',
};

const submissionSlice = createSlice({
  name: 'submission',
  initialState,
  reducers: {
    setSelectedSubmission: (state, action: PayloadAction<string | number>) => {
      state.selectedSubmission = action.payload;
    },
  },
});

export const {setSelectedSubmission} = submissionSlice.actions;

export default submissionSlice.reducer;
