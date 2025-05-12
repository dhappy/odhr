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
type Delta = {
  day: Bounds
  month: Bounds
}


export const offsets = ({ month, date }) => {
  const times = ['start', 'end'] as const
  return {
    day: Object.fromEntries(
      times.map((pos) => [pos, month[pos].getDate() - date.getDate()])
    ) as Bounds,
    month: Object.fromEntries(
      times.map((pos) => [pos, month[pos].getMonth() - date.getMonth()])
    ) as Bounds,
  }

}

export const GregorianConversion = (
  (
    { date, months, yearZero = 2029 }:
    { date: Date, months: Array<Month>, yearZero?: number }
  ) => {
    console.debug({ date, months, yearZero })
    const [sign, ...more] = months.filter((month: Month, idx: number) => {
      const Δ = offsets({ month, date })
      return (
        (Δ.month.start === 0 && Δ.day.start <= 0)
        || (Δ.month.start === -1 && Δ.day.start >= 0)
      )
    })

    if(!sign) {
      throw new Error('Couldn’t find a sign.')
    }
    if(more.length > 0) {
      console.error({ date, sign, more })
      throw new Error('Returned too many months.')
    }

    const Δ = offsets({ month: sign, date })
    console.debug({ date, sign, Δ })

    const year = date.getFullYear() - yearZero + 1
    return `${year}⁄${sign.symbol}⁄${Δ.day[year >= 0 ? 'start' : 'end']}`
  }
)