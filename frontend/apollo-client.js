import { ApolloClient, InMemoryCache } from "@apollo/client";
import { endPoint, prodEndpoint } from './config';

const createApolloClient = () => {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endPoint : prodEndpoint,
    credentials: 'include',
    // headers,
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
