import { type Component } from 'solid-js';

type NotificationCountProps = {
  count: number;
  highlight?: boolean;
};

const NotificationCount: Component<NotificationCountProps> = (props) => {
  return (
    <div
      class='rounded-full w-fit min-w-6 h-6 px-1 text-center'
      classList={{
        'bg-rose-500 text-rose-50': props.highlight,
        'bg-slate-100 text-black/75': !props.highlight,
      }}
    >
      {props.count}
    </div>
  );
};

export default NotificationCount;
