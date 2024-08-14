import Form from './styles/Form';
import useForm from '../lib/useForm';
import { gql, useMutation } from '@apollo/client';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: {
      email: $email
      name: $name
      password: $password
    }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // Send the email and password to the graphqlAPI
    await signup().catch(console.error);
    resetForm();
  }

  return (
    <Form method='POST' onSubmit={handleSubmit}>
      <h2>Sign Up For An Account</h2>
      <DisplayError error={error} />
      <fieldset>
        {data?.createUser && (
          <p>Signed up with {data.createUser.email} - Please go Ahead and Sign In!</p>
        )}
        <label htmlFor='name'>
          Name
          <input
            type='name'
            name='name'
            placeholder='Your name Address'
            autoComplete='name'
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
        <label htmlFor='password'>
          Password
          <input
            type='password'
            name='password'
            placeholder='Password'
            autoComplete='password'
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type='submit'>Sign In!</button>
      </fieldset>
    </Form>
  );
}
export { SIGNUP_MUTATION };
