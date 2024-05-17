import { TextField as KTextField } from '@kobalte/core/text-field';
import { type JSX, Show, splitProps, type Component } from 'solid-js';

type InputProps = {
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date' | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  value: string | undefined;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  autocomplete?: string | undefined;
  ref: (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLFormElement
  ) => void;
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
};

const Input: Component<InputProps> = (props) => {
  const [rootProps, inputProps] = splitProps(
    props,
    ['name', 'value', 'required', 'disabled'],
    ['placeholder', 'ref', 'onInput', 'onChange', 'onBlur', 'autocomplete']
  );

  return (
    <KTextField
      {...rootProps}
      validationState={props.error === '' ? 'valid' : 'invalid'}
      class='flex flex-col gap-2'
    >
      <Show when={props.label}>
        <KTextField.Label>{props.label}</KTextField.Label>
      </Show>
      <Show
        when={props.multiline}
        fallback={
          <KTextField.Input
            {...inputProps}
            type={props.type}
            class='transition duration-200 rounded-xl p-2 ring ring-neutral/25 focus:ring-rose-500 focus:ring-2 outline-none disabled:cursor-not-allowed'
          />
        }
      >
        <KTextField.TextArea {...inputProps} autoResize />
      </Show>
      <KTextField.ErrorMessage class='text-red font-bold'>
        {props.error}
      </KTextField.ErrorMessage>
    </KTextField>
  );
};

export default Input;
