import { createContext, type ParentComponent, useContext } from 'solid-js';

const HTMLParserContext = createContext<{
  parse: (body: string) => HTMLElement;
}>();

export const useHTMLParser = () => {
  const parsset = useContext(HTMLParserContext);
  if (!parsset) throw new Error("Parser context wasn't provided!");
  return parsset;
};

export const HTMLParserProvider: ParentComponent = (props) => {
  const parser = new DOMParser();

  return (
    <HTMLParserContext.Provider
      value={{
        parse(body) {
          const doc = parser.parseFromString(body, 'text/html');
          return doc.body;
        },
      }}
    >
      {props.children}
    </HTMLParserContext.Provider>
  );
};
