import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
      return <img {...props} />;
    },
  }));

describe('Home page', () => {
    it('renders without crashing', () => {
        render(<Home />);
        const test = screen.getByText('Get started by editing');
        console.log(test.textContent);
        expect(test.textContent).toBe('Get started by editing');
    });
});