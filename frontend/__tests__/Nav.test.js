import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import { CartStateProvider } from '../lib/cartState';


// Make some Mocks for being logged out, logged in, and logged in with cart items
const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    request: { data: { authenticatedItem: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    request: { data: { authenticatedItem: fakeUser() } },
  },
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: fakeUser({
          cart: [fakeCartItem()],
        }),
      },
    },
  },
];

describe('<Nav/>', () => {
  // it('Renders a minimal nav when signed out', () => {
  //   const { container, debug } = render(
  //       <CartStateProvider>
  //         <MockedProvider mocks={notSignedInMocks}>
  //           <Nav />
  //         </MockedProvider>
  //       </CartStateProvider>
  //   );
  //   expect(container).toHaveTextContent('Sign In');
  //   const link = screen.getByText('Sign In');
  //   expect(link).toHaveAttribute('href', '/signin');
  //   const productsLink = screen.getByText('Sign In');
  //   expect(productsLink).toBeInTheDocument();
  //   expect(productsLink).toHaveAttribute('href', '/product');
  // });

  // it('renders a full nav when signed in', async () => {
  //   const { container, debug } = render(
  //     <CartStateProvider>
  //       <MockedProvider mocks={signedInMocks}>
  //         <Nav />
  //       </MockedProvider>
  //     </CartStateProvider>
  //   );
  //   await screen.findByText('Account');
  //   expect(container).toMatchSnapshot();
  //   expect(container).toHaveTextContent('Sign Out');
  //   expect(container).toHaveTextContent('My Cart');
  // });

  it('Renders the amount of items in the cart', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    expect(screen.getByText('3')).toBeInTheDocument();
  })
});
