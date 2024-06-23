import { TextField as KTextField } from '@kobalte/core/text-field';
import { Show, splitProps, type Component, type JSX } from 'solid-js';
import { Flex, styled } from '~styled/jsx';

const InputField = styled(KTextField.Input, {
  base: {
    transition: 'common',
    outlineWidth: '2',
    outlineStyle: 'solid',
    outlineOffset: '0.5',
    outlineColor: 'mauve.7',
    rounded: 'xl',
    padding: '2',
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
