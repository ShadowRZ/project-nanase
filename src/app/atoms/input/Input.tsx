import { TextField as KTextField } from '@kobalte/core/text-field';
import { type JSX, Show, splitProps, type Component } from 'solid-js';
import { Flex, styled } from '~styled/jsx';
import { flex } from '~styled/patterns';

const InputField = styled(KTextField.Input, {
  base: {
    transitionProperty: 'outline-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineOffset: '2px',
    outlineColor: 'mauve.7',
    borderRadius: '0.75rem',
    padding: '0.5rem',
    _disabled: {
      cursor: 'not-allowed',
    },
    _focus: {
      outlineColor: 'ruby.9',
    },
  },
});

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
      as={Flex}
      direction='column'
      gap='2'
    >
      <Show when={props.label}>
        <KTextField.Label>{props.label}</KTextField.Label>
      </Show>
      <Show
        when={props.multiline}
        fallback={<InputField {...inputProps} type={props.type} />}
      >
        <KTextField.TextArea {...inputProps} autoResize />
      </Show>
      <KTextField.ErrorMessage as={styled.div} fontWeight='bold' color='red.11'>
        {props.error}
      </KTextField.ErrorMessage>
    </KTextField>
  );
};

export default Input;
