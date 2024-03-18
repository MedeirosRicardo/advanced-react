import { ApolloClient, InMemoryCache } from "@apollo/client";
import { endPoint, prodEndpoint } from './config';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import paginationField from "./lib/paginationField";

const createApolloClient = (headers) => {
  return new ApolloClient({
    link: createUploadLink({
      uri: process.env.NODE_ENV === 'development' ? endPoint : prodEndpoint,
      fetchOptions: {
        credentials: 'include',
      },
      headers,
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // TODO: Add Products pagination
            products: paginationField(),
          }
        }
      }
    }),
  });
}

export default createApolloClient;
