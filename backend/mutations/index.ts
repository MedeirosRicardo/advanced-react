import { mergeSchemas } from '@graphql-tools/schema';
import type { GraphQLSchema } from 'graphql';
import addToCart from './addToCart';

export function extendGraphqlSchema(schema: GraphQLSchema) {
  return mergeSchemas({
    schemas: [schema],
    typeDefs: `
        type Mutation {
          addToCart(productId: ID): CartItem
        }
      `,
    resolvers: {
      Mutation: {
        addToCart,
      }
    }
  })
};
