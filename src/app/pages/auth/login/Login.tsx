import {
  createForm,
  FormError,
  valiForm,
  type SubmitHandler,
} from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import to from 'await-to-js';
import { Show, type Component } from 'solid-js';
import * as v from 'valibot';
import ArrowRightBold from '~icons/ph/arrow-right-bold';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import { getLoginPath } from '~/app/utils/paths';
import { Card } from '~/components/ui/card';
import { Field as UIField } from '~/components/ui/field';
import { matchMXID, MXIDRegex } from '~/lib/utils/user-id';
import { flex } from '~styled/patterns';
import { getServerMeta } from '../getServerMeta';
import LoginHeader from './LoginHeader';
import { Button } from '@/components/ui/button';

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
    // @ts-expect-error: Not sure why.
    validate: valiForm(LoginSchema),
  });

  return (
    <>
      <LoginHeader />
      <Form onSubmit={onSubmit} class={flex({ direction: 'column', gap: '2' })}>
        <Card.Body>
          <Field name='user_id'>
            {(field, props) => (
              <UIField.Root invalid={!!field.error}>
                <UIField.Label>Matrix ID</UIField.Label>
                <UIField.Input
                  value={field.value}
                  placeholder='@example:example.com'
                  {...props}
                />
                <UIField.ErrorText>{field.error}</UIField.ErrorText>
              </UIField.Root>
            )}
          </Field>
        </Card.Body>
        <Card.Footer w='full' justifyContent='center'>
          <Button disabled={form.submitting}>
            Continue
            <Show when={form.submitting} fallback={<ArrowRightBold />}>
              <LoadingIndicator />
            </Show>
          </Button>
        </Card.Footer>
      </Form>
    </>
  );
};

export default Login;
