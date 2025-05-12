import JSON5 from 'json5'
import { parseDate } from '$lib'

type RetValue = {
  symbol: string
  name: string
  start: string
  end: string
}

export async function load({ fetch }) {
  const res = await fetch('Rotated IAU months.json5')
  const raw = JSON5.parse(await res.text())
  return {
    months: (
      raw.map((month: RetValue) => ({
        ...month,
        start: parseDate(month.start),
        end: parseDate(month.end),
      }))
    )
  }
}