import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import Product from "./Product";
import { perPage } from "../config";

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($skip: Int = 0, $take: Int) {
    products(take: $take, skip: $skip) {
      id
      name
      price
      description
      photo {
        id
        image {
          url
        }
      }
    }
  }
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Products({ page }) {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY,
    {
      variables: {
        skip: page * perPage - perPage,
        take: perPage,
      }
    });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return (
    <div>
      <ProductsListStyles>
        {data.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ProductsListStyles>
    </div>
  );
}
