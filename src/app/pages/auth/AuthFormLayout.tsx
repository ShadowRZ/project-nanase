import { ErrorBoundary, Suspense, type ParentComponent } from 'solid-js';
import WithServerMeta from './WithServerMeta';
import Text from '~/app/atoms/text/Text';

const AuthFormLayout: ParentComponent = (props) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary
        fallback={(err: Error) => (
          <Text color='error' font='bold'>
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
