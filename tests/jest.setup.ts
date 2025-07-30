import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Add global TextEncoder/TextDecoder for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock MSW setup for unit tests (we'll conditionally enable it in tests that need it)
// This avoids the global Response issue during test setup

// Mock NextRequest for integration tests
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, options = {}) => {
    const parsedUrl = new URL(url);
    return {
      url,
      method: options.method || 'GET',
      headers: new Headers(options.headers || {}),
      body: options.body,
      nextUrl: {
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        searchParams: parsedUrl.searchParams,
      },
      json: async () => options.body ? JSON.parse(options.body) : {},
      formData: async () => options.body || new FormData(),
    };
  }),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
      headers: new Headers(),
    })),
  },
}));

// Setup cleanup
afterEach(() => {
  jest.clearAllMocks()
})
