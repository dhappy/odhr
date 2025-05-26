export const parseDate = (str: string) => {
  const [, yearParam, monthParam, dayParam] = (
    str.match(/(?:(\d+)[/⁄])?(\d+)[/⁄](\d+)/) ?? []
  )
  const year = yearParam != null ? Number(yearParam) : new Date().getFullYear()
  const month = Number(monthParam)
  const day = Number(dayParam)
  return new Date(`${year}-${month}-${day}`)
}

type Month = {
  symbol: string
  name: string
  start: Date
  end: Date
}

type Bounds = {
  start: number
  end: number
}

export function offsets({ month, date }: { month: Month, date: Date }) {
  const times = ['start', 'end'] as const
  return {
    day: Object.fromEntries(
      times.map((pos) => [pos, dayOfYear(month[pos]) - dayOfYear(date)])
    ) as Bounds,
    month: Object.fromEntries(
      times.map((pos) => [pos, month[pos].getMonth() - date.getMonth()])
    ) as Bounds,
  }
}

export function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const dayLength = 24 * 60 * 60 * 1000
  return Math.floor(diff / dayLength)
}

export function GregorianConversion(
  { date, months, yearZero = 2029 }:
  { date: Date, months: Array<Month>, yearZero?: number }
) {
  const [sign, ...more] = months.filter((month: Month) => {
    const Δ = offsets({ month, date })
    const member = Δ.day.start >= 0 && Δ.day.end <= 0
    if(member) console.debug(`Match: ${JSON.stringify({ date, month, Δ }, null, 2)}`)
    return member
  })

  if(!sign) {
    throw new Error('Couldn’t find a sign.')
  }
  if(more.length > 0) {
    throw new Error(
      `Returned too many months: ${JSON.stringify({ date, sign, more }, null, 2)}`
    )
  }

  const Δ = offsets({ month: sign, date })
  const year = date.getFullYear() - yearZero + 1
  return `${year}⁄${sign.symbol}⁄${Δ.day[year >= 0 ? 'start' : 'end']}`
}
