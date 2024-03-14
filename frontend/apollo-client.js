import { ApolloClient, InMemoryCache } from "@apollo/client";
import { endPoint, prodEndpoint } from './config';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const createApolloClient = (headers) => {
  return new ApolloClient({
    link: createUploadLink({
      uri: process.env.NODE_ENV === 'development' ? endPoint : prodEndpoint,
      headers: {
        "Apollo-Require-Preflight": "true",
      },
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // TODO: Add Products pagination
          }
        }
      }
    }),
  });
}

export default createApolloClient;
