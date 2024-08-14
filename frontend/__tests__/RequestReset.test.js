import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import RequestReset, { REQUEST_RESET_MUTATION } from '../components/RequestReset';

let email = 'test@test.com';
const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: email },
    },
    result: {
      data: {
        sendUserPasswordResetLink: null,
      },
    },
  },
];

describe('<RequestReset', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('calls the mutation when submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // Type into the email box
    userEvent.type(screen.getByPlaceholderText(/email/i), email);
    // Click submit
    userEvent.click(screen.getByText(/request reset/i));
    const success = await screen.findByText(/shoot/i);
    expect(success).toBeInTheDocument();
  });
});
