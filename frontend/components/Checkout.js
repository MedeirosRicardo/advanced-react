import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import styled from "styled-components";
import SickButton from "./styles/SickButton";
import { useState } from "react";
import nProgress from "nprogress";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useCart } from "../lib/cartState";
import { CURRENT_USER_QUERY } from "./User";

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      item {
        id
        name
      }
    }
  }
`;

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {

  const [error, setError] = useState();
  const [loading, setloading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(CREATE_ORDER_MUTATION,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(e) {

    // 1. Stop the form from submitting and turn the loader on
    e.preventDefault();
    setloading(true);

    // 2. Start the page transition
    nProgress.start();

    // 3. Create the payment method via stripe (If success gets the token)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    // 4. Handle any errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
      return;
    }

    // 5. Send the tolen from step 3 to our keystone server via a custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id
      },
    });

    // 6. Change the page to view the order
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });

    // 7. Close the cart
    closeCart();

    // 8. Turn the loader off
    setloading(false);
    nProgress.done();
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export { Checkout };
