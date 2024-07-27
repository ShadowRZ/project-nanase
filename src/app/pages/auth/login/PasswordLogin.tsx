import {
  createForm,
  FormError,
  required,
  type SubmitHandler,
} from '@modular-forms/solid';
import { Show, type Component } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import to from 'await-to-js';
import { useServerMeta } from '../WithServerMeta';
import { SSOLogin } from '../SSOLogin';
import LoginHeader from './LoginHeader';
import { loginWithPassword, sessionFromLoginResponse } from './utils';
import Input from '~/app/atoms/input/Input';
import Text from '~/app/atoms/text/Text';
import ProgressButton from '~/app/components/progress-button/ProgressButton';
import { findSSOFlows } from '~/lib/utils/matrix';
import { Flex, styled } from '~styled/jsx';
import { flex } from '~styled/patterns';
import KeyDuotone from '~icons/ph/key-duotone';
import { addSession } from '~/app/state/sessions';

// https://github.com/fabian-hiller/modular-forms/issues/2#issuecomment-1321178563
type LoginForm = {
  username: string;
  password: string;
};

const PasswordLogin: Component = () => {
  const serverMeta = useServerMeta();
  const [searchParams] = useSearchParams();
  const flows = () => serverMeta.authFlows.loginFlows;
  const mx = () => serverMeta.mx;
  const baseUrl = () => serverMeta.baseUrl;

  const [form, { Form, Field }] = createForm<LoginForm>({
    validateOn: 'input',
  });

  const onSubmit: SubmitHandler<LoginForm> = async (values) => {
    const { username, password } = values;
    const [err, res] = await to(loginWithPassword(mx(), username, password));
    if (err) throw new FormError<LoginForm>(err.message);
    addSession(sessionFromLoginResponse(baseUrl(), res));
  };

  return (
    <Flex direction='column' gap='2'>
      <LoginHeader />
      <Show
        when={flows().flows.some((value) => value.type === 'm.login.password')}
      >
        <div>
          <styled.span
            display='inline-flex'
            flexDirection='row'
            alignItems='center'
            gap='2'
          >
            <KeyDuotone />
            <Text as='h2' size='medium' font='bold'>
              Sign in with password
            </Text>
          </styled.span>
          <Form
            onSubmit={onSubmit}
            class={flex({ direction: 'column', gap: '2' })}
          >
            <Field
              name='username'
              validate={[required('Please enter your username.')]}
            >
              {(field, props) => (
                <Input
                  {...props}
                  label='Username'
                  autocomplete='username'
                  value={searchParams.username ?? field.value}
                  error={field.error}
                  required
                  disabled={searchParams.username !== undefined}
                />
              )}
            </Field>
            <Field
              name='password'
              validate={[required('Please enter your password.')]}
            >
              {(field, props) => (
                <Input
                  {...props}
                  label='Password'
                  type='password'
                  autocomplete='current-password'
                  value={field.value}
                  error={field.error}
                  required
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
                type='submit'
                text='Login'
                busy={form.submitting}
              />
            </Flex>
          </Form>
        </div>
      </Show>
      <Show when={findSSOFlows(flows())}>
        {(idps) => <SSOLogin idps={idps()} client={mx()} />}
      </Show>
    </Flex>
  );
};

export default PasswordLogin;
