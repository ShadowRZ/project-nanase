import Prism from 'prismjs';
import { onMount, type ParentComponent } from 'solid-js';
// Prism plugins
// Prism plugins are all incompatible with ESLint import/no-unassigned-import
/* eslint-disable import/no-unassigned-import */
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
/* eslint-enable import/no-unassigned-import */

type HighlightCodeProps = {
  lang?: string;
  class?: string;
};

const HighlightCode: ParentComponent<HighlightCodeProps> = (props) => {
  let ref!: HTMLElement;

  onMount(() => {
    Prism.highlightElement(ref);
  });

  return (
    <pre class={props.class}>
      <code
        ref={ref}
        class={`language-${props.lang ?? 'plain'}`}
        style='text-wrap: wrap; word-break: break-all;' // @unocss-ignore
      >
        {props.children}
      </code>
    </pre>
  );
};

export default HighlightCode;
