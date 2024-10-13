import { splitProps, type Component } from 'solid-js';
import { styled } from '~styled/jsx';

const timeOnlyFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
});
const dateOnlyFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

export type TimeProps = {
  timestamp: number;
};

function isInSameDay(dt2: Date, dt1: Date) {
  return (
    dt2.getFullYear() === dt1.getFullYear() &&
    dt2.getMonth() === dt1.getMonth() &&
    dt2.getDate() === dt1.getDate()
  );
}

const $Time: Component<TimeProps> = (props) => {
  const [baseProps, rootProps] = splitProps(props, ['timestamp']);
  const timestamp = () => baseProps.timestamp;
  const date = () => new Date(timestamp());
  const formatted = () => {
    const current = new Date();
    if (isInSameDay(current, date())) {
      return timeOnlyFormatter.format(timestamp());
    }

    return dateOnlyFormatter.format(timestamp());
  };

  return (
    <time
      {...rootProps}
      dateTime={date().toISOString()}
      title={date().toLocaleString()}
    >
      {formatted()}
    </time>
  );
};

export const Time = styled($Time);
