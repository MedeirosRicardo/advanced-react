import { gql, useMutation } from "@apollo/client";
import useForm from "../lib/useForm";
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from "./Products";
import Router from "next/router";

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # Which variables are getting passed in and what types they are
    $name: String!
    $description: String!
    $price: Int!
    $image: ImageFieldInput
  ) {
    createProduct(
      data:{
        name: $name
        description: $description
        price: $price
        statusbar: "AVAILABLE"
        photo: {
          create: {
            image: $image
            altText: $name
          }
        }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {

  const { inputs, handleChange, resetForm, clearForm } = useForm({
    image: '',
    name: 'Nice Shoes',
    price: 34234,
    description: 'These are nice shoes!'
  });

  const [createProduct, { loading, error, data }] = useMutation(CREATE_PRODUCT_MUTATION,
    {
      variables: {
        name: inputs.name,
        description: inputs.description,
        price: inputs.price,
        image: {
          upload: inputs.image,
        },
        altText: inputs.name,
      },
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  return (
    <Form encType="multipart/form-data"
      onSubmit={async (e) => {
        e.preventDefault();
        // Submit the input fields to the backend
        const res = await createProduct();
        clearForm();
        // Go to that product's page!
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}
