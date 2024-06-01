import { Show, type Component } from 'solid-js';
import Button from '~/app/atoms/button/Button';
import ArrowRightBold from '~icons/ph/arrow-right-bold';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';

export type ProgressButtonProps = {
  text: string;
  busy: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

const ProgressButton: Component<ProgressButtonProps> = (props) => {
  return (
    <Button
      color='primary'
      size='medium'
      disabled={props.busy}
      type={props.type}
      onClick={props.onClick}
      class='flex flex-row items-center gap-1'
    >
      {props.text}
      <Show when={props.busy} fallback={<ArrowRightBold />}>
        <LoadingIndicator />
      </Show>
    </Button>
  );
};

export default ProgressButton;
