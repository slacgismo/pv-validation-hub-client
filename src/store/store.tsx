import {configureStore} from '@reduxjs/toolkit';
import userReducer from '@/reducers/user';
import curAnalysis from '@/reducers/curAnalysis';
import curSubmission from '@/reducers/curSubmission';
// import {createWrapper} from 'next-redux-wrapper';
import {TypedUseSelectorHook, useSelector} from 'react-redux';

export const store = configureStore({
  reducer: {
    user: userReducer,
    curAnalysis: curAnalysis,
    curSubmission: curSubmission,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
