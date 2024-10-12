import { ParentComponent } from 'solid-js';
import ClientRoot from './ClientRoot';
import ClientLayout from './ClientLayout';

export const ClientRoute: ParentComponent = (props) => (
  <ClientRoot>
    <ClientLayout>Hello</ClientLayout>
  </ClientRoot>
);
