import {render, screen} from '@testing-library/react';
import {describe, it, expect} from '@jest/globals';
import {Provider} from 'react-redux';
import {store} from '../src/store/store';
import Home from '../src/app/page';

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Provider store={store}>
      <Home />
    </Provider>);
    const test = screen.getByText('Get started by editing');
    console.log(test.textContent);
    expect(test.textContent).toBe('Get started by editing');
  });
});
