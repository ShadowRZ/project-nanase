import {
  Show,
  type ParentComponent,
  Suspense,
  createResource,
  type Component,
} from 'solid-js';

const IDBUnsupported: Component = () => {
  return (
    <div class='h-dvh flex items-center justify-center flex-col text-center p-4'>
      <span class='text-lg font-bold text-red'>
        A Feature required by the app is missing
      </span>
      <span>
        This app requires IndexedDB, however we can't find such support on your
        browser.
      </span>
      <span>Please make sure to enable such support and allow cookies.</span>
    </div>
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
    <Suspense>
      <Show when={idbSupport() !== undefined}>
        <Show when={idbSupport()} fallback={<IDBUnsupported />}>
          {props.children}
        </Show>
      </Show>
    </Suspense>
  );
};

export default FeatureCheck;
