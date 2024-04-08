import 'dotenv/config';
// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { graphql, list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  image,
  virtual,
} from '@keystone-6/core/fields';

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';
import formatMoney from './lib/formatMoney';
import { permissionFields } from './lib/fields';
import { isSignedIn, permissions, rules } from './access';

export const lists: Lists = {
  User: list({
    access: {
      operation: {
        create: () => true,
        // only people with the permission can delete themselves!
        // You can't delete yourself
        delete: permissions.canManageUsers,
      },
      filter: {
        query: rules.canManageUsers,
        update: rules.canManageUsers,
      },
    },

    ui: {
      hideCreate: args => !permissions.canManageUsers(args),
      hideDelete: args => !permissions.canManageUsers(args),
    },

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      // posts: relationship({ ref: 'Post.author', many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
      cart: relationship({
        ref: 'CartItem.user',
        many: true,
        ui: {
          createView: {
            fieldMode: 'hidden',
          },
          itemView: {
            fieldMode: 'read',
          },
        }
      }),
      orders: relationship({
        ref: 'Order.user',
        many: true,
      }),
      role: relationship({
        ref: 'Role.assignedTo',
        access: {
          create: permissions.canManageUsers,
          update: permissions.canManageUsers,
        }
      }),
      products: relationship({
        ref: 'Product.user',
        many: true,
      }),
    },
  }),

  // This is our product list
  Product: list({
    access: {
      operation: {
        create: isSignedIn,
      },
      filter: {
        query: rules.canReadProducts,
        update: rules.canManageProducts,
        delete: rules.canManageProducts,
      }
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text({
        ui: {
          displayMode: 'textarea',
        },
      }),
      photo: relationship({
        ref: 'ProductImage.product',
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'altText'],
          inlineCreate: {
            fields: ['image', 'altText'],
          },
          inlineEdit: {
            fields: ['image', 'altText'],
          },
        },
      }),
      statusbar: select({
        options: [
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Available', value: 'AVAILABLE' },
          { label: 'Unavailable', value: 'UNAVAILABLE' },
        ],
        defaultValue: 'DRAFT',
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      price: integer(),
      user: relationship({
        ref: 'User.products',
        hooks: {
          resolveInput: ({ context }: any) => ({ connect: { id: context.session.itemId } })
        },
      })
    },
  }),

  // This is our image field
  ProductImage: list({
    access: {
      operation: {
        create: isSignedIn,
        query: () => true,
        update: permissions.canManageProducts,
        delete: permissions.canManageProducts,
      },
    },
    fields: {
      image: image({ storage: 'my_local_images' }),
      altText: text(),
      product: relationship({
        ref: 'Product.photo'
      }),
    },
    ui: {
      listView: {
        initialColumns: ['image', 'altText', 'product'],
      },
    },
  }),

  // This is our cart list
  CartItem: list({
    access: {
      operation: {
        create: isSignedIn,
      },
      filter: {
        query: rules.canOrder,
        update: rules.canOrder,
        delete: rules.canOrder,
      },
    },
    fields: {
      quantity: integer({
        defaultValue: 1,
        validation: { isRequired: true },
      }),
      product: relationship({
        ref: 'Product'
      }),
      user: relationship({
        ref: 'User.cart'
      }),
    }
  }),

  // This is our OrderItem list
  OrderItem: list({
    access: {
      operation: {
        create: isSignedIn,
        update: () => false,
        delete: () => false,
      },
      filter: {
        query: rules.canManageOrderItems,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      description: text({
        ui: {
          displayMode: 'textarea',
        },
      }),
      photo: relationship({
        ref: 'ProductImage',
        ui: {
          displayMode: 'cards',
          cardFields: ['image', 'altText'],
          inlineCreate: {
            fields: ['image', 'altText'],
          },
          inlineEdit: {
            fields: ['image', 'altText'],
          },
        },
      }),
      price: integer(),
      quantity: integer(),
      order: relationship({
        ref: 'Order.item',
      }),
    },
  }),

  // This is our Order list
  Order: list({
    access: {
      operation: {
        create: isSignedIn,
        update: () => false,
        delete: () => false,
      },
      filter: {
        query: rules.canOrder,
      }
    },
    fields: {
      label: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve(item) {
            return `${formatMoney(item.total)}`;
          },
        }),
      }),
      total: integer(),
      item: relationship({
        ref: 'OrderItem.order',
        many: true,
      }),
      user: relationship({
        ref: 'User.orders'
      }),
      charge: text(),
    },
  }),

  // This is our Role list
  Role: list({
    access: {
      operation: {
        create: permissions.canManageRoles,
        query: permissions.canManageRoles,
        update: permissions.canManageRoles,
        delete: permissions.canManageRoles,
      },
    },
    ui: {
      hideCreate: args => !permissions.canManageRoles(args),
      hideDelete: args => !permissions.canManageRoles(args),
      isHidden: args => !permissions.canManageRoles(args),
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      ...permissionFields,
      assignedTo: relationship({
        ref: 'User.role',
        many: true,
        ui: {
          itemView: { fieldMode: 'read' },
        },
      }),
    }
  }),
};
