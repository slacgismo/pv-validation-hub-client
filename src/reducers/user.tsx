import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '@/store/store';

type UserState = {
  loggedIn: boolean;
  username: string;
}

const initialState: UserState = {
  loggedIn: false,
  username: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.loggedIn = true;
      state.username = action.payload;
    },
    logOut: (state) => {
      state.loggedIn = false;
      state.username = '';
    },
  },
});

export const {logIn, logOut} = userSlice.actions;

export const selectLoggedIn = (state: RootState) => state.user.loggedIn;

export default userSlice.reducer;
