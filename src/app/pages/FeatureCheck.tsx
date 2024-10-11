import {
  Show,
  type ParentComponent,
  createResource,
  type Component,
} from 'solid-js';
import { Flex, styled } from '~styled/jsx';

const IDBUnsupported: Component = () => {
  return (
    <Flex
      direction='column'
      textAlign='center'
      h='dvh'
      alignItems='center'
      justifyContent='center'
      p='4'
    >
      <styled.span textStyle='lg' fontWeight='bold' color='fg.error'>
        A Feature required by the app is missing
      </styled.span>
      <span>
        This app requires IndexedDB, however we can't find such support on your
        browser.
      </span>
      <span>Please make sure to enable such support and allow cookies.</span>
    </Flex>
  );
};

const FeatureCheck: ParentComponent = (props) => {
  const [idbSupport] = createResource(async (): Promise<boolean> => {
    const ts = Date.now();
    const dbName = `project-nanase:idb-check:${ts}`;
    return new Promise((resolve) => {
      let db;
      try {
        db = indexedDB.open(dbName);
      } catch {
        resolve(false);
        return;
      }

      db.onsuccess = () => {
        resolve(true);
        indexedDB.deleteDatabase(dbName);
      };

      // eslint-disable-next-line unicorn/prefer-add-event-listener
      db.onerror = () => {
        resolve(false);
        indexedDB.deleteDatabase(dbName);
      };
    });
  });

  return (
    <Show when={!idbSupport.loading}>
      <Show when={idbSupport() === true} fallback={<IDBUnsupported />}>
        {props.children}
      </Show>
    </Show>
  );
};

export default FeatureCheck;
