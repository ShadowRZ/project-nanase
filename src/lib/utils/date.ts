import {
  getLocalTimeZone,
  fromAbsolute,
  today,
  toCalendarDate,
} from '@internationalized/date'

const timeOnlyFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
})
const dateOnlyFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

export function formatDate(ts: number): string {
  const tz = getLocalTimeZone()
  const datetime = fromAbsolute(ts, tz)
  const nowDate = today(tz)
  const date = toCalendarDate(datetime)
  if (date.compare(nowDate) === 0) {
    return timeOnlyFormatter.format(ts)
  }

  return dateOnlyFormatter.format(ts)
}
