import { Checkbox as KCheckbox } from '@kobalte/core/checkbox';
import { Show, splitProps, type Component } from 'solid-js';
import CheckBold from '~icons/ph/check-bold';
import { css } from '~styled/css';
import { Flex, Square, styled } from '~styled/jsx';

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

const Checkbox: Component<CheckboxProps> = (props) => {
  const [, inputProps] = splitProps(props, [
    'label',
    'description',
    'error',
    'checked',
    'onChange',
  ]);
  return (
    <KCheckbox
      checked={props.checked}
      onChange={props.onChange}
      as={Flex}
      direction='row'
      gap='2'
      validationState={props.error ? 'invalid' : 'valid'}
    >
      <KCheckbox.Input {...inputProps} />
      <KCheckbox.Control
        as={Square}
        size='6'
        rounded='md'
        overflow='clip'
        css={{
          flexShrink: 0,
          boxSizing: 'content-box',
          borderWidth: '1px',
          borderColor: 'mauve.7',
          outlineOffset: '2px',
          outlineColor: 'ruby.8',
          _focus: {
            outlineStyle: 'solid',
            outlineWidth: '2px',
          },
        }}
      >
        <KCheckbox.Indicator
          as={Flex}
          w='6'
          h='6'
          align='center'
          justify='center'
          css={{
            _checked: {
              bg: 'ruby.9',
            },
          }}
        >
          <CheckBold class={css({ color: 'white' })} />
        </KCheckbox.Indicator>
      </KCheckbox.Control>
      <div>
        <KCheckbox.Label as={styled.label} fontWeight='bold'>
          {props.label}
        </KCheckbox.Label>
        <Show when={props.description && !props.error}>
          <KCheckbox.Description>{props.description}</KCheckbox.Description>
        </Show>
        <KCheckbox.ErrorMessage
          as={styled.div}
          color='red.11'
          fontWeight='bold'
        >
          {props.error}
        </KCheckbox.ErrorMessage>
      </div>
    </KCheckbox>
  );
};

export default Checkbox;
