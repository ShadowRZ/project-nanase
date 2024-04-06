import { splitProps, type Component, type ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type IconButtonProps = {
  [key: string]: any;
  as?: ValidComponent;
  type: 'large-bordered' | 'small-bordered' | 'normal' | 'circle';
  icon: ValidComponent;
  class?: string;
  iconClass?: string;
  checked?: boolean;
};

const IconButton: Component<IconButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'as',
    'checked',
    'class',
    'icon',
    'iconClass',
    'type',
  ]);

  return (
    <Dynamic
      component={local.as ?? 'button'}
      class={`${local.class ?? ''} transition duration-150 flex items-center justify-center bg-transparent`}
      classList={{
        'size-12 rounded-full border-2 outline-none focus:border-rose-500':
          local.type === 'large-bordered',
        'size-6 rounded-full border-2 outline-none focus:border-rose-500':
          local.type === 'small-bordered',
        'rounded-md p-1 hover:bg-slate-200 dark:hover-bg-slate-800':
          local.type === 'normal',
        'rounded-full p-1 hover:bg-slate-200 dark:hover-bg-slate-800':
          local.type === 'circle',
        'border-rose-500': local.checked,
        'border-rose-500/50': !local.checked,
      }}
      {...others}
    >
      <Dynamic
        component={local.icon}
        classList={{
          'size-8': local.type === 'large-bordered',
          'size-4': local.type === 'small-bordered',
          'size-6': local.type === 'normal' || local.type === 'circle',
        }}
        class={local.iconClass}
      />
    </Dynamic>
  );
};

export default IconButton;
