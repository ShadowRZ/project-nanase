import { type Component, Show, onMount } from 'solid-js';
import { createScriptLoader } from '@solid-primitives/script-loader';
import { type FlowData } from '~/lib/auth';
import UserFocusDuotone from '~icons/ph/user-focus-duotone';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';

const GRECAPTCHA_LOAD_CALLBACK = '__PROJECT_NANASE_GRECAPTCHA_LOADED__';
const GRECAPTCHA_LOADER_URL = `https://www.recaptcha.net/recaptcha/api.js?onload=${GRECAPTCHA_LOAD_CALLBACK}&render=explicit`;

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    [GRECAPTCHA_LOAD_CALLBACK]: () => void;
  }
}

type ReCaptchaFormProps = {
  sitekey: string;
  session?: string;
  finishFlow: (auth: FlowData) => void;
  busy: boolean;
};

const ReCaptchaForm: Component<ReCaptchaFormProps> = (props) => {
  let ref!: HTMLDivElement;
  const renderCaptcha = (): void => {
    window.grecaptcha.render(ref, {
      sitekey: props.sitekey,
      callback(response) {
        props.finishFlow({
          type: 'm.login.recaptcha',
          response,
          session: props.session,
        });
      },
    });
  };

  onMount(() => {
    if (window.grecaptcha === undefined) {
      window[GRECAPTCHA_LOAD_CALLBACK] = renderCaptcha;
      createScriptLoader({
        src: GRECAPTCHA_LOADER_URL,
      });
    } else {
      renderCaptcha();
    }
  });

  return (
    <div class='mt-2 flex flex-col gap-2'>
      <span class='inline-flex flex-row items-center gap-2'>
        <UserFocusDuotone />
        <h2 class='font-bold text-lg'>Confirm you are human</h2>
      </span>
      <p>
        To prevent unsolicited requests, your homeserver requires you to check
        the box below:
      </p>
      <div class='flex justify-center'>
        <div ref={ref} id='project-nanase-grecaptcha' />
      </div>
      <Show
        when={props.busy}
        fallback={<p>Registration will continue automatically.</p>}
      >
        <p class='inline-flex flex-row items-center gap-2'>
          <LoadingIndicator />
          Please wait...
        </p>
      </Show>
    </div>
  );
};

export default ReCaptchaForm;
