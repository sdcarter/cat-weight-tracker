import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});

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

// Mock ResizeObserver
global.ResizeObserver = class {
  observe() {
    // Mock implementation - intentionally empty
  }
  unobserve() {
    // Mock implementation - intentionally empty
  }
  disconnect() {
    // Mock implementation - intentionally empty
  }
};

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor() {
    // Mock constructor - intentionally empty
  }
  observe() {
    // Mock implementation - intentionally empty
  }
  unobserve() {
    // Mock implementation - intentionally empty
  }
  disconnect() {
    // Mock implementation - intentionally empty
  }
};
