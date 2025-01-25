import { ErrorBoundary, Suspense, type ParentComponent } from 'solid-js';
import WithServerMeta from './WithServerMeta';
import { Text } from '@hanekokoro-ui/solid';

const AuthFormLayout: ParentComponent = (props) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary
        fallback={(err: Error) => (
          <Text color='fg.error' fontWeight='bold'>
            {err.message}
          </Text>
        )}
      >
        <WithServerMeta>{props.children}</WithServerMeta>
      </ErrorBoundary>
    </Suspense>
  );
};

export default AuthFormLayout;
