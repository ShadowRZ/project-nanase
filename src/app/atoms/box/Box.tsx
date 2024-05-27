import { klassed } from '@klass/solid';

const Box = klassed('div', {
  base: 'rounded-lg p-2',
  variants: {
    color: {
      default: 'bg-slate-200 dark:bg-slate-800',
      primary: 'bg-rose-500 text-white',
      secondary: 'bg-rose-100 dark:bg-rose-900',
    },
  },
});

export default Box;
