import { gql, useQuery } from "@apollo/client";
import ErrorMessage from '../components/ErrorMessage';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import Head from "next/head";
import formatMoney from '../lib/formatMoney';
import styled from "styled-components";
import Link from "next/link";

const USERS_ORDERS_QUERY = gql`
  query USERS_ORDERS_QUERY {
    orders {
      id
      charge
      total
      user {
        id
      }
      item {
        id
        name
        description
        price
        quantity
        photo {
          image {
            url
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
  return order.item.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USERS_ORDERS_QUERY);

  if (loading) return <p>Loading...</p>
  if (error) return <ErrorMessage error={error} />

  const { orders } = data;

  return (
    <div>
      <Head>
        <title>Your Orders ({orders.length})</title>
      </Head>
      <h2>You have {orders.length} orders!</h2>
      <OrderUl>
        {orders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={`/order/${order.id}`}>
              <div className="order-meta">
                <p>{countItemsInAnOrder(order)} {countItemsInAnOrder(order) === 1 ? 'Item' : 'Items'}</p>
                <p>{order.item.length} {order.item.length === 1 ? 'Product' : 'Products'}</p>
                <p>{formatMoney(order.total)}</p>
              </div>
              <div className="images">
                {order.item.map(item =>
                <img
                  key={`image-${item.id}`}
                  src={item.photo?.image?.url}
                  alt={item.name}
                />)}
              </div>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
