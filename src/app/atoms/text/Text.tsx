import { klassed } from '@klass/solid';

const Text = klassed('p', {
  base: 'm-0 p-0',
  variants: {
    content: {
      default: '',
      truncate: 'min-w-0 truncate',
    },
    font: {
      default: '',
      bold: 'font-bold',
      italic: 'font-italic',
    },
    size: {
      default: 'text-base',
      large: 'text-xl',
      medium: 'text-lg',
      small: 'text-sm',
      smaller: 'text-xs',
    },
    color: {
      default: '',
      warning: 'text-yellow',
      error: 'text-red',
    },
  },
});

export default Text;
