import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    keyArgs: false,
    read(existing = [], { args, cache }) {
      
      // Tells apollo we will take care of everything
      const { skip, take } = args;
      
      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?.productsCount;
      const page = skip / take +1;
      const pages = Math.ceil(count / take);

      // Check if we have existing items
      const items = existing.slice(skip, skip + take).filter((x) => x);
      
      // If there are items
      // AND there aren't enough items to satisfy how many we requested
      // AND we are on the last page
      // THEN just send it
      if(items.length && items.length !== take && page === pages) {
        return items;
      }
      if(items.length !== take) {
        // We don't have any items, we must go to the network to fetch them
        return false;
      }
      
      // If there are items, just return from the cache, and we don't need to go to the network
      if(items.length) {
        return items;
      }

      // Fallback to network
      return false;
    },

    merge(existing, incoming, { args }) {
      const { skip, take } = args;
      // This runs when Apollo client comes back from the network with our product
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // Return the merged items from the cache
      return merged;
    }
  }
}
