import Form from './styles/Form';
import useForm from '../lib/useForm';
import { gql, useMutation } from '@apollo/client';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email)
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [requestReset, { data, loading, error }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: inputs,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // Send the email and password to the graphqlAPI
    await requestReset().catch(console.error);
    resetForm(); 
  }

  return (
    <Form method='POST' onSubmit={handleSubmit}>
      <h2>Request a Password Reset</h2>
      <DisplayError error={error} />
      <fieldset>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link!</p>
        )}
        <label htmlFor='email'>
          Email
          <input
            type='email'
            name='email'
            placeholder='Your Email Address'
            autoComplete='email'
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <button type='submit'>Request Reset</button>
      </fieldset>
    </Form>
  );
}

export { REQUEST_RESET_MUTATION };
