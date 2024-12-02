import { Link } from '@kobalte/core/link';
import { type Component } from 'solid-js';
import { styled, Flex } from '@shadowrz/hanekokoro-ui/styled-system/jsx';

const StyledLink = styled(Link, {
  base: {
    textDecoration: { base: 'inherit', _hover: 'underline' },
    color: 'colorPalette.11',
  },
});

const AuthFooter: Component = () => (
  <Flex
    direction='row'
    gap='4'
    alignItems='center'
    justifyContent='center'
    my='4'
  >
    <span>Project Nanase</span>
    <StyledLink href='https://github.com/ShadowRZ/project-nanase'>
      Source Code
    </StyledLink>
  </Flex>
);

export default AuthFooter;
