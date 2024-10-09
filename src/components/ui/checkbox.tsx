import { Show, children } from 'solid-js';
import * as StyledCheckbox from './styled/checkbox';
import CheckBold from '~icons/ph/check-bold';
import MinusBold from '~icons/ph/minus-bold';

export type CheckboxProps = StyledCheckbox.RootProps;

export const Checkbox = (props: CheckboxProps) => {
  const getChildren = children(() => props.children);

  return (
    <StyledCheckbox.Root {...props}>
      <StyledCheckbox.HiddenInput class='peer' />
      <StyledCheckbox.Control>
        <StyledCheckbox.Indicator>
          <CheckBold />
        </StyledCheckbox.Indicator>
        <StyledCheckbox.Indicator indeterminate>
          <MinusBold />
        </StyledCheckbox.Indicator>
      </StyledCheckbox.Control>

      <Show when={getChildren()}>
        <StyledCheckbox.Label>{getChildren()}</StyledCheckbox.Label>
      </Show>
    </StyledCheckbox.Root>
  );
};
