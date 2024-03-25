import { mergeSchemas } from '@graphql-tools/schema';
import type { GraphQLSchema } from 'graphql';
import addToCart from './addToCart';
import checkout from './checkout';


export function extendGraphqlSchema(schema: GraphQLSchema) {
  return mergeSchemas({
    schemas: [schema],
    typeDefs: `
        type Mutation {
          addToCart(productId: ID): CartItem
          checkout(token: String!): Order
        }
      `,
    resolvers: {
      Mutation: {
        addToCart,
        checkout,
      }
    }
  })
};
