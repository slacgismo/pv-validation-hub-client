import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AnalysisState {
  selectedAnalysis: string | number;
}

const initialState: AnalysisState = {
  selectedAnalysis: '',
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setSelectedAnalysis: (state, action: PayloadAction<string | number>) => {
      state.selectedAnalysis = action.payload;
    },
  },
});

export const {setSelectedAnalysis} = analysisSlice.actions;

export default analysisSlice.reducer;
