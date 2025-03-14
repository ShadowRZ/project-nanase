import {
  createForm,
  FormError,
  required,
  type SubmitHandler,
} from '@modular-forms/solid';
import { Button, Card, Input, Text } from '@hanekokoro-ui/solid';
import { Flex, styled } from '@hanekokoro-ui/styled-system/jsx';
import { flex } from '@hanekokoro-ui/styled-system/patterns';
import { useSearchParams } from '@solidjs/router';
import to from 'await-to-js';
import { Show, type Component } from 'solid-js';
import { addSession } from '../../../state/sessions';
import { findSSOFlows } from '../../../../lib/utils/matrix';
import ArrowRightBold from '~icons/ph/arrow-right-bold';
import KeyDuotone from '~icons/ph/key-duotone';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import { SSOLogin } from '../SSOLogin';
import { useServerMeta } from '../WithServerMeta';
import LoginHeader from './LoginHeader';
import { loginWithPassword, sessionFromLoginResponse } from './utils';

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
    <>
      <LoginHeader />
      <Card.Body>
        <Show
          when={flows().flows.some(
            (value) => value.type === 'm.login.password'
          )}
        >
          <div>
            <styled.span
              display='inline-flex'
              flexDirection='row'
              alignItems='center'
              gap='2'
              mb='0.5'
            >
              <KeyDuotone />
              <styled.h2 fontWeight='bold'>Sign in with password</styled.h2>
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
                  <Flex direction='column' gap='2'>
                    <styled.label for={field.name} fontWeight='bold'>
                      Username
                    </styled.label>
                    <Input
                      value={searchParams.username ?? field.value}
                      autocomplete='username'
                      required
                      disabled={searchParams.username !== undefined}
                      {...props}
                    />
                    <Show when={!!field.error}>
                      <Text fontWeight='bold' color='fg.error'>
                        {field.error}
                      </Text>
                    </Show>
                  </Flex>
                )}
              </Field>
              <Field
                name='password'
                validate={[required('Please enter your password.')]}
              >
                {(field, props) => (
                  <Flex direction='column' gap='2'>
                    <styled.label for={field.name} fontWeight='bold'>
                      Password
                    </styled.label>
                    <Input
                      value={field.value}
                      type='password'
                      autocomplete='current-password'
                      required
                      {...props}
                    />
                    <Show when={!!field.error}>
                      <Text fontWeight='bold' color='fg.error'>
                        {field.error}
                      </Text>
                    </Show>
                  </Flex>
                )}
              </Field>
              <Flex w='full' justifyContent='center'>
                <Button disabled={form.submitting}>
                  Continue
                  <Show when={form.submitting} fallback={<ArrowRightBold />}>
                    <LoadingIndicator />
                  </Show>
                </Button>
              </Flex>
            </Form>
          </div>
        </Show>
        <styled.div h='4' />
        <Show when={findSSOFlows(flows())}>
          {(idps) => <SSOLogin idps={idps()} client={mx()} />}
        </Show>
      </Card.Body>
    </>
  );
};

export default PasswordLogin;
