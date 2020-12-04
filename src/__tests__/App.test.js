import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { render, screen } from '@testing-library/react';
import App from '../App';

let container = null;
describe('App', () => {
  beforeEach(() => {
    // Create DOM element before test
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean after test
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });
  test('Home', async() => {
    render(
        <App />
    );
    // Home
    expect(screen.getByText(/Welcome to We Sell Houses/)).toBeInTheDocument();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});
