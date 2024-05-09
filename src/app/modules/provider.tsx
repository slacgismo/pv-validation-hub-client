'use client';
// *********** START OF IMPORTS ***********
import React from 'react';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

import {store} from '@/store/store';
import {Provider} from 'react-redux';

// *********** END OF IMPORTS ***********

/**
 * The ReduxProvider component provides the Redux store to the app.
 * @param {React.ReactNode} children The children of the ReduxProvider component.
 * @return {JSX.Element} The ReduxProvider component.
*/
export function ReduxProvider({children}: {children: React.ReactNode}) {
  return <Provider store={store}> {children} </Provider>;
}
