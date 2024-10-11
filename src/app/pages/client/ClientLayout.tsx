import { type ParentComponent } from 'solid-js';
import ClientRoot from './ClientRoot';
import { SplashScreen } from '~/app/components/splash-screen/Splashscreen';
import { Flex, styled } from '~styled/jsx';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import { Text } from '@/components/ui/text';

const ClientLayout: ParentComponent = (props) => {
  return <ClientRoot>Hello</ClientRoot>;
};

export default ClientLayout;
