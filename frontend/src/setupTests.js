import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach } from 'vitest';

// Setup global variables for JSDOM
beforeAll(() => {
  // Define global self for plotly
  global.self = global;
  
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  
  // Mock window.scrollTo
  window.scrollTo = vi.fn();
  
  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
});