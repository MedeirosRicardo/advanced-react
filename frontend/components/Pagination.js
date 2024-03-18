import Head from "next/head";
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage'
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    productsCount
  }
`;

export default function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);

  if (loading) return null;
  if (error) return <DisplayError error={error} />

  const count = data.productsCount;
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>Sick Fits - Page {page} of {pageCount}</title>
      </Head>
      <Link href={`/products/${page - 1}`} aria-disabled={page <= 1}>← Prev</Link>
      <p>Page {page} of {pageCount}</p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`} aria-disabled={page >= pageCount}>Next →</Link>
    </PaginationStyles>
  );
}
