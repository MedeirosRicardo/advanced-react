import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from "@apollo/client";
import { endPoint, prodEndpoint } from './config';

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'development' ? endPoint : prodEndpoint
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || null,
    }
  }));
  return forward(operation);
});


const createApolloClient = () => {
  return new ApolloClient({
    link: concat(authMiddleware, httpLink),
    credentials: 'include',
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
