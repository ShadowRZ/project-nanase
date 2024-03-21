import { klassed } from '@klass/solid';

const Box = klassed('div', {
  base: 'rounded-lg p-2',
  variants: {
    color: {
      default: 'bg-slate-200 text-black dark:bg-slate-800 dark:text-white',
      primary: 'bg-rose-500 text-white',
    },
  },
});

export default Box;
