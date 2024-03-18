import { gql, useMutation } from "@apollo/client"

const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(where: { id: $id }) {
      id
      name
    }
  }
`;

function update(cache, paylod) {
  cache.evict(cache.identify(paylod.data.deleteProduct));
}

export default function DeleteProduct({ id, children }) {

  const [deleteProduct, { loading }] = useMutation(
    DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  }
  );

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        if (confirm('Are you sure you want to delete this item?')) {
          // go ahead and delete it
          deleteProduct().catch(err => alert(err.message));
        }
      }}>
      {children}
    </button>
  )
}
