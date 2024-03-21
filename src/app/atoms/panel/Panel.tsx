import { klassed } from '@klass/solid';

const Panel = klassed('div', {
  base: 'rounded-lg bg-white dark:bg-black text-black dark:text-white',
  variants: {
    style: {
      bordered: 'border border-slate-200 dark:border-slate-800',
      shadow: 'shadow-md dark:shadow-slate-800/50',
    },
  },
});

export default Panel;
