import { createForm, required, type SubmitHandler } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { type ILoginFlowsResponse, type MatrixClient } from 'matrix-js-sdk';
import { Show, type Component } from 'solid-js';
import { SSOLogin } from './SSOLogin';
import { type SessionData } from '~/lib/auth';
import { findSSOFlows } from '~/lib/utils/matrix';
import Input from '~/app/atoms/input/Input';
import KeyDuotone from '~icons/ph/key-duotone';
import Text from '~/app/atoms/text/Text';
import ProgressButton from '~/app/components/progress-button/ProgressButton';

// https://github.com/fabian-hiller/modular-forms/issues/2#issuecomment-1321178563
type LoginForm = {
  username: string;
  password: string;
};

export type LoginProps = {
  flows: ILoginFlowsResponse;
  client: MatrixClient;
  onClientCreated: (data: SessionData) => void;
};

const Login: Component<LoginProps> = (props) => {
  const client = (): MatrixClient => props.client;
  const flows = (): ILoginFlowsResponse => props.flows;
  const navigate = useNavigate();
  const onClientCreated = props.onClientCreated;

  const onSubmit: SubmitHandler<LoginForm> = async (values) => {
    try {
      const result = await client().loginWithPassword(
        values.username,
        values.password
      );
      const data: SessionData = {
        ...result,
        homeserver: client().getHomeserverUrl(),
      };
      onClientCreated(data);
      navigate('/rooms', { replace: true });
    } catch (error: any) {
      throw new Error((error.data?.error as string) ?? 'Unknown Error');
    }
  };

  const [form, { Form, Field }] = createForm<LoginForm>({
    validateOn: 'input',
  });

  return (
    <div class='mt-2 flex flex-col gap-2'>
      <Show
        when={flows().flows.some((value) => value.type === 'm.login.password')}
      >
        <div>
          <span class='inline-flex flex-row items-center gap-2'>
            <KeyDuotone />
            <Text as='h2' size='medium' font='bold'>
              Sign in with password
            </Text>
          </span>
          <Form onSubmit={onSubmit} class='flex flex-col gap-2'>
            <Field
              name='username'
              validate={[required('Please enter your username.')]}
            >
              {(field, props) => (
                <Input
                  {...props}
                  label='Username'
                  autocomplete='username'
                  value={field.value}
                  error={field.error}
                  required
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
            <Text color='error' font='bold' class='empty:hidden mt-2'>
              {form.response.message}
            </Text>
            <div class='mt-2 w-full flex justify-center'>
              <ProgressButton
                type='submit'
                text='Login'
                busy={form.submitting}
              />
            </div>
          </Form>
        </div>
      </Show>
      <Show when={findSSOFlows(flows())}>
        {(idps) => <SSOLogin idps={idps()} client={client()} />}
      </Show>
    </div>
  );
};

export default Login;
