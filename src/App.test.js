import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

jest.mock('react-gauge-chart', () => () => <div data-testid="bmi-gauge" />);
jest.mock('@mui/x-charts', () => ({
  Gauge: () => <div data-testid="gauge" />,
  LineChart: () => <div data-testid="line-chart" />,
}));
jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
  create: jest.fn(() => ({ get: jest.fn().mockResolvedValue({ data: {} }) })),
}));

test('renders the dashboard shell with authenticated data providers', async () => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/authorize')) {
      return Promise.resolve({ ok: true, json: async () => ({ authorized: true }) });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Calorie')).toBeInTheDocument();
});

test('redirects a logged-out user away from a private route', async () => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/authorize')) {
      return Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({ authorized: false }),
      });
    }
    throw new Error(`Unexpected request: ${url}`);
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <MemoryRouter initialEntries={['/plate']}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText('Welcome back')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('logs out, clears the private session, and returns to login', async () => {
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/authorize')) {
      return Promise.resolve({ ok: true, json: async () => ({ authorized: true }) });
    }
    if (url.endsWith('/logout')) {
      return Promise.resolve({ ok: true, status: 204 });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MemoryRouter>
  );

  fireEvent.click(await screen.findByRole('button', { name: 'Log out' }));

  expect(await screen.findByText('Welcome back')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/logout$/),
    expect.objectContaining({ method: 'POST', credentials: 'include' })
  );
});
