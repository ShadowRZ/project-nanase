import '@fontsource-variable/inter';
import 'uno.css';
import 'prismjs/themes/prism.min.css';
import { render } from 'solid-js/web';
import './index.css';
import App from './app/pages/App';

const root = document.querySelector('#root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
  );
}

render(() => <App />, root!);
