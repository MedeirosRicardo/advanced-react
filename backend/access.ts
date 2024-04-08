import { permissionsList } from "./lib/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(permissionsList.map(
  permission => [
    permission,
    function({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission]
    },
  ]
));

// Permission check if someone meets a creteria
export const permissions = {
  ...generatedPermissions,
};

// Rule based function
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permission of canManageProducts
    if(permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this product
    return { user: { id: { equals: session.itemId }}}
  },

  canReadProducts({ session }: ListAccessArgs) {
    if(permissions.canManageProducts({ session })) {
      return true; // They can read everything
    }

    // They should only see available products
    return { statusbar: { equals: 'AVAILABLE' }};
  }
}
