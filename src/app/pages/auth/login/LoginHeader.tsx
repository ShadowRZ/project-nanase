import { type Component } from 'solid-js';
import { Card } from '@hanekokoro-ui/solid';

const LoginHeader: Component = () => (
  <Card.Header mb='2'>
    <Card.Title textStyle='xl' fontWeight='bold'>
      Sign In
    </Card.Title>
    <Card.Description>
      You need to provide your credentials to proceed.
    </Card.Description>
  </Card.Header>
);

export default LoginHeader;
