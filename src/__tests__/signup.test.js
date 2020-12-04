import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../components/signup';
let container = null;
describe('Sign up', () => {
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
  test('SignupForm', async () => {
    render(<SignUp />
    )
    userEvent.click(screen.getByText(/agent/i))
    expect(screen.getByText(/signup code/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrongemail' } })
    expect(screen.getByLabelText(/email/i)).toHaveValue('wrongemail')
  })
})
