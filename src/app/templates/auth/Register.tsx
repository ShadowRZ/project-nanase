/* eslint-disable solid/reactivity */
import {
  FormError,
  createForm,
  custom,
  email,
  required,
  type SubmitHandler,
} from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import {
  type IAuthData,
  type ILoginFlowsResponse,
  type MatrixClient,
  type MatrixError,
} from 'matrix-js-sdk';
import { Match, Show, Switch, createSignal, type Component } from 'solid-js';
import ReCaptchaForm from './ReCaptchaForm';
import { SSOLogin } from './SSOLogin';
import {
  completeRegisterStage,
  type SessionData,
  type FlowData,
} from '~/lib/auth';
import { findSSOFlows } from '~/lib/utils/matrix';
import ProgressButton from '~/app/components/progress-button/ProgressButton';
import Input from '~/app/atoms/input/Input';
import Text from '~/app/atoms/text/Text';
import PenNibDuotone from '~icons/ph/pen-nib-duotone';
import KeyDuotone from '~icons/ph/key-duotone';
import EnvelopeDuotone from '~icons/ph/envelope-duotone';
import CheckBold from '~icons/ph/check-bold';
import Checkbox from '~/app/atoms/checkbox/Checkbox';

type EmailFormProps = {
  email: string;
  busy: boolean;
  session?: string;
  finishFlow: (auth: FlowData) => void;
  sid?: string;
  clientSecret?: string;
};

const EmailForm: Component<EmailFormProps> = (props) => {
  return (
    <div class='mt-2 flex flex-col gap-2'>
      <span class='inline-flex flex-row items-center gap-2'>
        <EnvelopeDuotone />
        <Text as='h2' size='medium' font='bold'>
          Check your email
        </Text>
      </span>
      <div>
        <p>
          An verification email has been sent from your homeserver to{' '}
          <strong class='font-bold'>{props.email}</strong>.
        </p>
        <p>Verify it before going further.</p>
      </div>
      <div class='mx-auto'>
        <ProgressButton
          onClick={() => {
            props.finishFlow({
              type: 'm.login.email.identity',
              threepid_creds: {
                sid: props.sid,
                client_secret: props.clientSecret,
              },
              session: props.session,
            });
          }}
          type='submit'
          text='Continue'
          busy={props.busy}
        />
      </div>
    </div>
  );
};

type TermsFormProps = {
  term: {
    name: string;
    link: string;
  };
  busy: boolean;
  session?: string;
  finishFlow: (auth: FlowData) => void;
};

const TermsForm: Component<TermsFormProps> = (props) => {
  return (
    <div class='mt-2 flex flex-col gap-2'>
      <span class='inline-flex flex-row items-center gap-2'>
        <PenNibDuotone />
        <Text as='h2' size='medium' font='bold'>
          Review terms
        </Text>
      </span>
      <div>
        <p>Review the following term: </p>
        <p>
          <a
            class='hover:underline text-rose-500 font-bold'
            rel='noreferrer'
            target='_blank'
            href={props.term.link}
          >
            {props.term.name}
          </a>
        </p>
      </div>
      <form>
        <span class='mb-2 inline-flex flex-row items-center gap-2'>
          <Checkbox
            id='project-nanase-terms-agreement'
            label='I agree to the terms shown above'
            required
          />
        </span>
        <ProgressButton type='submit' text='Continue' busy={props.busy} />
      </form>
    </div>
  );
};

type IdleProgress = {
  type: 'idle';
  session?: string;
};

type DoneProgress = {
  type: 'done';
  session?: undefined;
};

type RecaptchaProgress = {
  type: 'm.login.recaptcha';
  session?: string;
  siteKey: string;
};

type EmailProgress = {
  type: 'm.login.email.identity';
  session?: string;
  email: string;
};

type TermsProgress = {
  type: 'm.login.terms';
  session?: string;
  url: string;
  name: string;
};

type RegisterProgress =
  | IdleProgress
  | DoneProgress
  | RecaptchaProgress
  | EmailProgress
  | TermsProgress;

// https://github.com/fabian-hiller/modular-forms/issues/2#issuecomment-1321178563

type RegisterForm = {
  username: string;
  password: string;
  passwordconfirm: string;
  email?: string | undefined;
};

let sid: string | undefined;
let clientSecret: string | undefined;

export type RegisterProps = {
  registerInfo: IAuthData;
  loginFlows: ILoginFlowsResponse;
  client: MatrixClient;
  onClientCreated: (data: SessionData) => void;
};

export const Register: Component<RegisterProps> = (props) => {
  const navigate = useNavigate();
  const loginFlows = (): ILoginFlowsResponse => props.loginFlows;
  const client = (): MatrixClient => props.client;

  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal<string>();
  const [progress, setProgress] = createSignal<RegisterProgress>({
    type: 'idle',
    session: props.registerInfo.session,
  });

  const [, { Form, Field }] = createForm<RegisterForm>({
    validateOn: 'input',
    validate(values) {
      if (
        values.password !== '' &&
        values.passwordconfirm !== values.password
      ) {
        return {
          passwordconfirm: "Password doesn't match.",
        };
      }

      return {};
    },
  });

  let isEmail = false;
  let isEmailRequired = true;
  let isRecaptcha = false;
  let isTerms = false;
  let isDummy = false;

  let username: string;
  let password: string;
  let emailResult: string | undefined;

  const onSubmit: SubmitHandler<RegisterForm> = async (values) => {
    setBusy(true);
    username = values.username;
    password = values.password;
    emailResult = values.email;
    if (
      isEmail &&
      values.email !== undefined &&
      (values.email?.length ?? 0) > 0
    ) {
      try {
        clientSecret = client().generateClientSecret();
        const result = await client().requestRegisterEmailToken(
          values.email,
          clientSecret,
          1
        );
        sid = result.sid;
      } catch (error_) {
        const data = (error_ as MatrixError).data;
        if (data.errcode === 'M_THREEPID_IN_USE') {
          setBusy(false);
          throw new FormError<RegisterForm>('', {
            email: 'This email has already been used.',
          });
        } else {
          setBusy(false);
          setError(data.error);
          return;
        }
      }
    }

    finishFlow({ session: progress().session });
  };

  const finishFlow = (auth: FlowData): void => {
    setBusy(true);
    completeRegisterStage(client(), username, password, auth)
      .then((resp) => {
        if (resp.done) {
          const data: SessionData = {
            ...(resp.data as SessionData),
            homeserver: client().getHomeserverUrl(),
          };
          props.onClientCreated(data);
          navigate('/', { replace: true });
        } else {
          const completed = resp.data.completed ?? [];
          const params = resp.data.params ?? {};
          const session = resp.data.session;
          if (isRecaptcha && !completed.includes('m.login.recaptcha')) {
            const siteKey = params['m.login.recaptcha'].public_key as string;
            setBusy(false);
            setProgress({ type: 'm.login.recaptcha', siteKey, session });
            return;
          }

          if (isTerms && !completed.includes('m.login.terms')) {
            const pp = params['m.login.terms'].policies
              .privacy_policy as Record<
              string,
              {
                url: string;
                name: string;
              }
            >;
            const url = pp?.en?.url ?? pp[Object.keys(pp)[0]].url;
            const name = pp?.en?.name ?? pp[Object.keys(pp)[0]].name;
            setBusy(false);
            setProgress({ type: 'm.login.terms', url, name, session });
            return;
          }

          if (isEmail && emailResult !== undefined && emailResult.length > 0) {
            setBusy(false);
            setProgress({
              type: 'm.login.email.identity',
              email: emailResult,
              session,
            });
            return;
          }

          if (isDummy) {
            completeRegisterStage(client(), username, password, {
              type: 'm.login.dummy',
              session: props.registerInfo.session,
            })
              .then((dummyResp) => {
                if (dummyResp.done) {
                  const data: SessionData = {
                    ...(dummyResp.data as SessionData),
                    homeserver: client().getHomeserverUrl(),
                  };
                  props.onClientCreated(data);
                  navigate('/rooms', { replace: true });
                }
              })
              .catch((error_) => {
                setBusy(false);
                setError(error_.data?.error ?? 'Unknown Error');
              });
          }
        }
      })
      .catch((error_) => {
        setBusy(false);
        setError(error_.data?.error ?? 'Unknown Error');
      });
  };

  if (props.registerInfo.flows)
    for (const flow of props.registerInfo.flows) {
      if (isEmailRequired && !flow.stages.includes('m.login.email.identity'))
        isEmailRequired = false;
      isEmail ||= flow.stages.includes('m.login.email.identity');
      isRecaptcha ||= flow.stages.includes('m.login.recaptcha');
      isTerms ||= flow.stages.includes('m.login.terms');
      isDummy ||= flow.stages.includes('m.login.dummy');
    }

  return (
    <>
      <Switch>
        <Match when={progress().type === 'idle'}>
          <div>
            <span class='inline-flex flex-row items-center gap-2'>
              <KeyDuotone />
              <Text as='h2' size='medium' font='bold'>
                Register
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
                    autocomplete='new-password'
                    value={field.value}
                    error={field.error}
                    required
                  />
                )}
              </Field>
              <Field
                name='passwordconfirm'
                validate={[required('Please enter your password.')]}
              >
                {(field, props) => (
                  <Input
                    {...props}
                    label='Retype Password'
                    type='password'
                    autocomplete='new-password'
                    value={field.value}
                    error={field.error}
                    required
                  />
                )}
              </Field>
              <Show when={isEmail}>
                <Field
                  name='email'
                  validate={[
                    custom((value) => {
                      if (isEmailRequired && (value?.length ?? 0) > 0)
                        return false;
                      return true;
                    }, 'Please enter your email.'),
                    email('Invaild email input.'),
                  ]}
                >
                  {(field, props) => (
                    <Input
                      {...props}
                      label={'Email' + (isEmailRequired ? '' : ' (Optional)')}
                      required={isEmailRequired}
                      autocomplete='email'
                      type='email'
                      value={field.value}
                      error={field.error}
                    />
                  )}
                </Field>
              </Show>
              <div class='mt-2 w-full flex justify-center'>
                <ProgressButton type='submit' text='Register' busy={busy()} />
              </div>
            </Form>
          </div>
          <Show when={findSSOFlows(loginFlows())}>
            {(idps) => <SSOLogin idps={idps()} client={client()} register />}
          </Show>
        </Match>
        <Match when={progress().type === 'm.login.recaptcha'}>
          <ReCaptchaForm
            sitekey={(progress() as RecaptchaProgress).siteKey}
            finishFlow={finishFlow}
            busy={busy()}
            session={progress().session}
          />
        </Match>
        <Match when={progress().type === 'm.login.terms'}>
          <TermsForm
            busy={busy()}
            term={{
              name: (progress() as TermsProgress).name,
              link: (progress() as TermsProgress).url,
            }}
            finishFlow={finishFlow}
            session={progress().session}
          />
        </Match>
        <Match when={progress().type === 'm.login.email.identity'}>
          <EmailForm
            email={(progress() as EmailProgress).email}
            finishFlow={finishFlow}
            busy={busy()}
            session={progress().session}
            sid={sid}
            clientSecret={clientSecret}
          />
        </Match>
      </Switch>
      <Show when={error() !== undefined}>
        <div class='mt-2 text-red font-bold'>{error()}</div>
      </Show>
    </>
  );
};
