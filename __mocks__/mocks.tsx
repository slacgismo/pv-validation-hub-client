
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import {mockIntersectionObserver, mockResizeObserver} from 'jsdom-testing-mocks';
import 'jest-location-mock';
import mockRouter from 'next-router-mock';
import {createDynamicRouteParser} from 'next-router-mock/dynamic-routes';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

mockIntersectionObserver();

const resizeObserver = mockResizeObserver();
