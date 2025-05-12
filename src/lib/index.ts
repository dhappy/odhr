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

export const GregorianConversion = (
  (date: Date, months: Array<Month>, negative = true) => {
    const [sign, ...more] = months.filter((prev: Month, idx: number) => {
      const next = months[(idx + 1) % months.length]
      return (
        prev.start.getDate() <= date.getDate()
        && prev.start.getMonth() <= date.getMonth()
        && next.start.getDate() >= date.getDate()
        && next.start.getMonth() >= date.getMonth()
      )
    })

    if(more.length > 0) {
      console.error({ date, sign, more })
      throw new Error('Returned too many months.')
    }

    const day = sign.start.getDate()
    const year = date.getFullYear()
    return `${year}⁄${sign.symbol}⁄${day}`
  }
)