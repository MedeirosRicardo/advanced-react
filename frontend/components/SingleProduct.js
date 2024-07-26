import { gql, useQuery } from "@apollo/client"
import DisplayError from "./ErrorMessage";
import Head from "next/head";
import styled from "styled-components";

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: top;
  img {
    width: 100%;
    object-fit: contain;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
  product(where: {
    id: $id
  }) {
    name
    price
    description
    id
    photo {
      altText
      image {
        url
      }
    }
  }
}
`;

export default function SingleProduct({ id }) {

  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) {
    return (
      <p>Loading...</p>
    )
  }

  if (error) {
    return (
      <DisplayError error={error} />
    )
  }

  const { product } = data;

  return (
    <ProductStyles data-testid="singleProduct">
      <Head>
        <title>Sick Fits | {product.name}</title>
      </Head>
      <img src={product.photo.image.url} alt={product.photo.altText} />
      <div className="details">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
      </div>
    </ProductStyles>
  )
}

export { SINGLE_ITEM_QUERY };
