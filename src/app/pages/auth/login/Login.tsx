import {
  createForm,
  FormError,
  valiForm,
  type SubmitHandler,
} from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { type Component } from 'solid-js';
import * as v from 'valibot';
import to from 'await-to-js';
import { getServerMeta } from '../getServerMeta';
import LoginHeader from './LoginHeader';
import Input from '~/app/atoms/input/Input';
import Text from '~/app/atoms/text/Text';
import ProgressButton from '~/app/components/progress-button/ProgressButton';
import { getLoginPath } from '~/app/utils/paths';
import { matchMXID, MXIDRegex } from '~/lib/utils/user-id';
import { Flex, styled } from '~styled/jsx';
import { flex } from '~styled/patterns';

const LoginSchema = v.object({
  user_id: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your Matrix ID.'),
    v.regex(MXIDRegex, 'The Matrix ID is not valid.')
  ),
});

export type LoginForm = v.InferInput<typeof LoginSchema>;

const Login: Component = () => {
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginForm> = async (values) => {
    const { user_id } = values;
    const { username, homeserver } = matchMXID(user_id)!;

    // Populate cache
    const [err] = await to(getServerMeta(homeserver));
    if (err) throw new FormError<LoginForm>(err.message);
    navigate(getLoginPath(homeserver, username));
  };

  const [form, { Form, Field }] = createForm<LoginForm>({
    validateOn: 'submit',
    validate: valiForm(LoginSchema),
  });

  return (
    <Flex direction='column'>
      <LoginHeader />
      <Form onSubmit={onSubmit} class={flex({ direction: 'column', gap: '2' })}>
        <Field name='user_id'>
          {(field, props) => (
            <Input
              {...props}
              label='Matrix ID'
              value={field.value}
              error={field.error}
              required
              placeholder='@example:example.com'
            />
          )}
        </Field>
        <Text
          color='error'
          font='bold'
          css={{ _empty: { display: 'none' }, mt: '2' }}
        >
          {form.response.message}
        </Text>
        <Flex w='full' mt='2' justifyContent='center'>
          <ProgressButton
            disabled={form.invalid}
            type='submit'
            text='Next'
            busy={form.submitting}
          />
        </Flex>
      </Form>
    </Flex>
  );
};

export default Login;
