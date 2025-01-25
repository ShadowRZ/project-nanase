import type { Component } from 'solid-js';
import { Flex, styled } from '@hanekokoro-ui/styled-system/jsx';

export const Welcome: Component = () => {
  return (
    <Flex grow='1' align='center' justify='center'>
      <styled.span
        bg='bg.subtle'
        px='2'
        py='1'
        rounded='lg'
        border='2px solid token(colors.border.default)'
      >
        Select a chat from left panel.
      </styled.span>
    </Flex>
  );
};
