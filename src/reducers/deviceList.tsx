import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import type {RootState} from '../store/store';

// Define a type for the slice state
export interface Devices {
  name: string,
  ip: string,
  watt: number,
  amp: number,
  volt: number,
  accumulation: number,
  type: string,
  poweredOn: boolean,
}

// Define the initial state using that type
const initialState: Devices[] = [];

export const deviceList = createSlice({
  name: 'devices',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addDevice: (state, action: PayloadAction<Devices>) => {
      // Add the device object to the state array
      state.push(action.payload);
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      // Find the index of the device with the matching IP
      const index = state.findIndex((device) => device.ip === action.payload);

      // If found, remove the device object from the state array
      if (index > -1) {
        state.splice(index, 1);
      }
    },
    updateDevice: (state, action: PayloadAction<Devices>) => {
      // Find the index of the device with the matching IP
      const index = state.findIndex(
          (device) => device.ip === action.payload.ip);

      // If found, update the properties except for ip and type
      if (index > -1) {
        const updatedDevice = {
          ...state[index],
          ...action.payload,
          ip: state[index].ip, // Keep the original ip
          type: state[index].type, // Keep the original type
        };
        state[index] = updatedDevice;
      }
    },
  },
});

export const {addDevice, removeDevice, updateDevice} = deviceList.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default deviceList.reducer;
