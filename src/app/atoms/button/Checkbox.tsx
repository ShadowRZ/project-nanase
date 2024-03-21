import { splitProps, type Component, type JSX, Show } from 'solid-js';
import { Checkbox as KCheckbox } from '@kobalte/core';
import Text from '~/app/atoms/text/Text';
import CheckBold from '~icons/ph/check-bold';

type CheckboxProps = {
  [key: string]: any;
  value?: string;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

const LabelText: Component = (props) => {
  return <Text as='label' font='bold' {...props} />;
};

const DescText: Component = (props) => {
  return <Text as='div' {...props} />;
};

const ErrorText: Component = (props) => {
  return <Text as='div' font='bold' color='error' {...props} />;
};

const Checkbox: Component<CheckboxProps> = (props) => {
  const [, inputProps] = splitProps(props, [
    'label',
    'description',
    'error',
    'checked',
    'onChange',
  ]);
  return (
    <KCheckbox.Root
      checked={props.checked}
      onChange={props.onChange}
      class='flex flex-row gap-2'
      validationState={props.error ? 'invalid' : 'valid'}
    >
      <KCheckbox.Input {...inputProps} class='peer' />
      <KCheckbox.Control class='shrink-0 mt-1 box-content size-6 rounded-md border peer-focus:outline ui-checked:outline ui-checked:outline-2 focus:outline-2 outline-offset-2 outline-rose-500 ui-checked:bg-rose-500'>
        <KCheckbox.Indicator class='size-6 flex items-center justify-center'>
          <CheckBold class='text-white' />
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <div>
        <KCheckbox.Label as={LabelText}>{props.label}</KCheckbox.Label>
        <Show when={props.description && !props.error}>
          <KCheckbox.Description as={DescText}>
            {props.description}
          </KCheckbox.Description>
        </Show>
        <KCheckbox.ErrorMessage as={ErrorText}>
          {props.error}
        </KCheckbox.ErrorMessage>
      </div>
    </KCheckbox.Root>
  );
};

export default Checkbox;
