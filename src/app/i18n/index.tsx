import {
  createContext,
  createMemo,
  untrack,
  useContext,
  type ParentComponent,
} from 'solid-js';
import * as i18n from '@solid-primitives/i18n';
import * as en from './en';

type I18NContextProps = {
  translator: i18n.Translator<i18n.BaseRecordDict>;
};

const I18NContext = createContext<I18NContextProps>();

export const I18NProvider: ParentComponent = (props) => {
  const dict: () => i18n.BaseRecordDict = createMemo(() =>
    i18n.flatten(en.dict)
  );

  const translator = untrack(() => i18n.translator(dict));

  return (
    <I18NContext.Provider value={{ translator }}>
      {props.children}
    </I18NContext.Provider>
  );
};

const t = (key: string): string => {
  const provider = useContext(I18NContext);
  if (!provider) return key;

  return provider.translator(key) as string;
};

export default t;
