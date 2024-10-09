import { Show, children } from 'solid-js'
import * as StyledSwitch from './styled/switch'

export type SwitchProps = StyledSwitch.RootProps

export const Switch = (props: SwitchProps) => {
  const getChildren = children(() => props.children)

  return (
    <StyledSwitch.Root {...props}>
      <StyledSwitch.HiddenInput class='peer' />
      <StyledSwitch.Control>
        <StyledSwitch.Thumb />
      </StyledSwitch.Control>
      <Show when={getChildren()}>
        <StyledSwitch.Label>{getChildren()}</StyledSwitch.Label>
      </Show>
    </StyledSwitch.Root>
  )
}
