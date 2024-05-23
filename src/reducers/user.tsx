import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '@/store/store';

interface UserState {
  loggedIn: boolean;
}

const initialState: UserState = {
  loggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state) => {
      state.loggedIn = true;
    },
    logOut: (state) => {
      state.loggedIn = false;
    },
  },
});

export const {logIn, logOut} = userSlice.actions;

export const selectLoggedIn = (state: RootState) => state.user.loggedIn;

export default userSlice.reducer;
