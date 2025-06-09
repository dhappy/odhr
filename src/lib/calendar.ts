export function toHijri(date: Date) {
  const formatter = new Intl.DateTimeFormat(
    'default', { calendar: 'islamic-civil' },
  )
  const parts = Object.fromEntries(
    formatter.formatToParts(date)
    .map(({ type, value }) => [type, value])
  )
  return `${parts.year}⁄${parts.month}⁄${parts.day}`
}

export function toSortableDate(date: Date) {
  const parts = Object.fromEntries(
    Intl.DateTimeFormat(
      'default',
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }
    )
    .formatToParts(date)
    .map(({ type, value }) => [type, value])
  )
  return `${parts.year}⁄${parts.month}⁄${parts.day}`
}

export function toBabylonianClock(date: Date, { seconds = true } = {}) {
  const parts = Object.fromEntries(
    Intl.DateTimeFormat(
      'default',
      {
        hour12: false,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }
    )
    .formatToParts(date)
    .map(({ type, value }) => [type, value])
  )
  return `${parts.hour}:${parts.minute}${
    !seconds ? '' : ':' + parts.second
  }`
}

export function toPercentage(date: Date) {
  return (
    (
      date.getHours() * 60 * 60 * 1000
      + date.getMinutes() * 60 * 1000
      + date.getSeconds() * 1000
      + date.getMilliseconds()
    ) / (
      24 * 60 * 60 * 1000
    )
  )
}

export function toPercentClock(date: Date, { day = 'hijri' } = {}) {
  return toPercentage(date).toFixed(2).replace('.', 'ʜ͋')
}

export function toTimestamp(
  date: Date,
  { day = 'hijri', time = 'percent' }:
  {
    day?: 'hijri' | 'gregorian' | false,
    time?: 'percent' | 'babylonian' | false,
  } = {}
) {
  return (`${
    (() => { switch(day) {
      case 'hijri': return toHijri(date)
      case 'gregorian': return toSortableDate(date)
      default: return ''
    } })()
  }${day && time ? '@' : ''}${(() => { switch(time) {
    case 'percent': return toPercentClock(date)
    case 'babylonian': return toBabylonianClock(date)
    default: return ''
  } })()}`)
}

export function addTo(date: Date, offset: number) {
  const newDate = new Date(date)
  const days = Math.floor(offset / 100)
  newDate.setDate(newDate.getDate() + days)
  const time = ((offset % 100) / 100) * 24
  const hours = Math.floor(time)
  newDate.setHours(newDate.getHours() + hours)
  const minusHours = time - hours
  const minutes = Math.round(minusHours * 60)
  newDate.setMinutes(newDate.getMinutes() + minutes)
  const minusMinutes = Math.round(minusHours * 100) % 1
  const seconds = minusMinutes * 60
  newDate.setSeconds(newDate.getSeconds() + seconds)
  return newDate
}