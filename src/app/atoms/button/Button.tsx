import { klassed } from '@klass/solid';
import { Button as KButton } from '@kobalte/core/button';

const Button = klassed(KButton, {
  base: 'transition duration-150 inline-flex justify-center',
  variants: {
    size: {
      small: 'px-3 py-1 rounded-lg',
      medium: 'px-4 py-2 rounded-xl',
    },
    color: {
      primary:
        'bg-rose-500 text-white hover:bg-rose-700 disabled:bg-rose-500/50',
      danger: 'bg-red-500 text-white hover:bg-red-700 disabled:bg-red-500/50',
      secondary:
        'bg-slate-200 text-black dark:text-white hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-900',
    },
  },
});

export default Button;
