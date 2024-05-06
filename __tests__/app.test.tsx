import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home page', () => {
    it('renders without crashing', () => {
        render(<Home />);
        const test = screen.getByText('Get started by editing');
        console.log(test.textContent);
        expect(test.textContent).toBe('Get started by editing');
    });
});