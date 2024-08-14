import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import CreateProduct, { CREATE_PRODUCT_MUTATION } from '../components/CreateProduct';
import { fakeItem, makePaginationMocksFor } from '../lib/testUtils';
import { ALL_PRODUCTS_QUERY } from '../components/Products';
import wait from 'waait';

const item = fakeItem();

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('<CreateProduct/>', () => {
  it('renders and matches snapshot', () => {
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('handle the updating', async () => {
    // 1. Render the form out
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    // 2. Type into the boxes
    await userEvent.type(screen.getByPlaceholderText(/name/i), item.name);
    await userEvent.type(screen.getByPlaceholderText(/price/i), item.price.toString());
    await userEvent.type(screen.getByPlaceholderText(/description/i), item.description);
    // 3. Check that those boxes are populated
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it('creates the items when the form is submitted', async () => {
    // create the mocks for this one
    const mocks = [
      {
        request: {
          query: CREATE_PRODUCT_MUTATION,
          variables: {
            name: item.name,
            description: item.description,
            price: item.price,
            image: {
              upload: '',
            },
            altText: item.name,
          },
        },
        result: {
          data: {
            createProduct: {
              ...item, // all the fake fields
              id: 'abc123',
              __typename: 'Item',
            },
          },
        },
      },
      {
        request: {
          query: ALL_PRODUCTS_QUERY,
          variables: {
            skip: 0,
            take: 2,
          },
        },
        result: {
          data: {
            allProducts: [item],
          },
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );
    // Type into the inputs
    await userEvent.type(screen.getByPlaceholderText(/name/i), item.name);
    await userEvent.type(screen.getByPlaceholderText(/price/i), item.price.toString());
    await userEvent.type(screen.getByPlaceholderText(/description/i), item.description);

    // Submit it and see if the page change has been called
    await userEvent.click(screen.getByText(/add/i));
    await waitFor(() => wait(500));
    // expect(Router.push).toHaveBeenCalled();
    // expect(Router.push).toHaveBeenCalledWith({ pathname: '/product/abc123' });
  });
});
