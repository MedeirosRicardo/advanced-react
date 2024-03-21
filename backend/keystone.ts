import 'dotenv/config';
// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';
import { extendGraphqlSchema } from './mutations';

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: 'sqlite',
      url: process.env.DATABASE_URL,
    },
    lists,
    extendGraphqlSchema,
    storage: {
      my_local_images: {
        kind: 'local',
        type: 'image',
        generateUrl: path => `${process.env.BASE_URL}/images${path}`,
        serverRoute: {
          path: '/images',
        },
        storagePath: 'public/images',
      },
    },
    session,
    server: {
      cors: { origin: [process.env.FRONTEND_URL], credentials: true },
    }
  }),
);
