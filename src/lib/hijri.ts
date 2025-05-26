export function weekDay(wdn: number){
  switch(wdn) {
    case 0: { return 'Monday' }
    case 1: { return 'Tuesday' }
    case 2: { return 'Wednesday' }
    case 3: { return 'Thursday' }
    case 4: { return 'Friday' }
    case 5: { return 'Saturday' }
    case 6: { return 'Sunday' }
    default: {
      throw new Error(`Invalid Week Day: ${wdn}`)
    }
  }
}

export function mod(a: number , b: number) {
  return a - (b * Math.floor(a / b))
}

export function intPart(floatNum: number) {
  if(floatNum < -0.0000001) {
    return Math.ceil(floatNum - 0.0000001)
  }
  return Math.floor(floatNum + 0.0000001)
}

export class Hijri {
  static readonly LUNAR_MONTH_DAYS = 29.530588853
  static readonly JULIAN_YEAR_DAYS = 365.25
  static readonly HIJRI_EPOCH_JULIAN = 1948439.5
  static readonly GREGORIAN_EPOCH_JULIAN = 4716
  static readonly MONTH_BOUNDARY = 30.6001
  // Julian days begin @ noon
  static readonly DAY_OFFSET = -1 * (1524 + 0.5)
  static readonly PRECISE = true

  static fromGregorian(date: Date) {
    const formatter = new Intl.DateTimeFormat(
      'default', { calendar: 'islamic-civil' },
    )
    const parts = formatter.formatToParts(date)
    const comps = Object.fromEntries(
      parts.map(({ type, value }) => [type, value])
    )
    return `${comps.year}/${comps.month}/${comps.day}`

    if(this.PRECISE) {
      const [year, month, day] = (
        [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      )
      let jd
      if(
        (year > 1582)
        || ((year === 1582) && (month > 10))
        || ((year === 1582) && (month === 10) && (day > 14))
      ) {
				jd = (
          intPart((1461 * (year + 4800 + intPart((month - 14) / 12))) / 4)
          + intPart((367 * (month - 2 - 12 * (intPart((month - 14) / 12)))) / 12)
          - intPart((3 * (intPart((year + 4900 + intPart((month - 14) / 12)) / 100))) / 4)
          + day - 32075
        )
			} else {
				jd = (
          367 * year
          - intPart((7 * (year + 5001 + intPart((month - 9) / 7))) / 4)
          + intPart((275 * month) / 9) + day + 1729777
        )
      }
      let l = jd - 1948440 + 10632
      const n = intPart((l - 1) / 10631)
      l = l - 10631 * n + 354
      const j = (
        (intPart((10985 - l) / 5316))
        * (intPart((50 * l) / 17719))
        + (intPart(l / 5670))
        * (intPart((43 * l) / 15238))
      )
      l = (
        l - (intPart((30 - j) / 15))
        * (intPart((17719 * j) / 50))
        - (intPart(j / 16))
        * (intPart((15238 * j) / 43))
        + 29
      )
      const m = intPart((24 * l) / 709)
      const d = l - intPart((709 * m) / 24)
      const y = 30 * n + j - 30

      console.debug({ y, m, d, jd, l, n, j })

      return this.createHijriDate({ year: y, month: m, day: d })
    }

    const jdn = this.gregorianToJulian(date)
    const daysSinceEpoch = jdn - this.HIJRI_EPOCH_JULIAN
    const totalLunarMonths = (
      Math.floor(daysSinceEpoch / this.LUNAR_MONTH_DAYS)
    )
    const monthStart = totalLunarMonths * this.LUNAR_MONTH_DAYS
    const hijri = {
      year: Math.floor(totalLunarMonths / 12) + 1,
      month: (totalLunarMonths % 12) + 1,
      day: Math.floor(daysSinceEpoch - monthStart) + 1,
    }

    return this.createHijriDate(hijri)
  }

  static toGregorian(year: number, month: number, day: number) {
    if(this.PRECISE) {
      const jd = (
        intPart((11 * year + 3) / 30) + 354 * year + 30 * month
        - intPart((month - 1) / 2) + day + 1948440 - 385
      )
      let y, m, d
      if(jd > 2299160) {
        let l = jd + 68569
				const n = intPart((4 * l) / 146097)
        l -= intPart((146097 * n + 3) / 4)
        const i = intPart((4000 * (l + 1)) / 1461001)
        l -= intPart((1461 * i) / 4) + 31
        const j = intPart((80 * l) / 2447)
        d = l - intPart((2447 * j) / 80)
        l = intPart(j / 11)
        m = j + 2 - 12 * l
        y = 100 * (n - 49) + i + l
      } else {
        let j = jd + 1402
        const k = intPart((j - 1) / 1461)
        const l = j - 1461 * k
        const n = intPart((l - 1) / 365) - intPart(l / 1461)
        let i = l - 365 * n + 30
        j = intPart((80 * i) / 2447)
        d = i - intPart((2447 * j) / 80)
        i = intPart(j / 11)
        m = j + 2 - 12 * i
        y = 4 * k + n + i - 4716
      }
      return new Date(y, m - 1, d, 0, 0, 0)
    }

    const totalMonths = (year - 1) * 12 + (month - 1)
    const daysSinceEpoch = (totalMonths * this.LUNAR_MONTH_DAYS) + (day - 1)
    const jdn = daysSinceEpoch + this.HIJRI_EPOCH_JULIAN
    return this.julianToGregorian(jdn)
  }

  static gregorianLeap(year: number) {
    return (
      ((year % 4) === 0)
      && (!(((year % 100) === 0) && ((year % 400) !== 0)))
    )
  }

  static gregorianToJulian(date: Date) {
    let [year, month, day] = (
      [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    )

    if(this.PRECISE) {
      const GREGORIAN_EPOCH = 1721425.5
      return (
        (GREGORIAN_EPOCH - 1)
        + (365 * (year - 1))
        + Math.floor((year - 1) / 4)
        + (-Math.floor((year - 1) / 100))
        + Math.floor((year - 1) / 400)
        + Math.floor(
          (((367 * month) - 362) / 12)
          + ((month <= 2) ? 0 : (this.gregorianLeap(year) ? -1 : -2))
          + day
        )
      )
    }

    // March is the first month of the year, making Feb. the last
    if(month <= 2) {
      year -= 1
      month += 12
    }

    const century = Math.floor(year / 100)
    const reform = 2 - century + Math.floor(century / 4)

    return (
      Math.round(
        Math.floor(
          this.JULIAN_YEAR_DAYS * (year + this.GREGORIAN_EPOCH_JULIAN)
        )
        + Math.floor(this.MONTH_BOUNDARY * (month + 1))
        + day + reform + this.DAY_OFFSET
      )
    )
  }

  static julianToGregorian(jdn: number): Date {
    if(this.PRECISE) {
      const GREGORIAN_EPOCH = 1721425.5
      const wjd = Math.floor(jd - 0.5) + 0.5
      const depoch = wjd - GREGORIAN_EPOCH
      const quadricent = Math.floor(depoch / 146097)
      const dqc = mod(depoch, 146097)
      const cent = Math.floor(dqc / 36524)
      const dcent = mod(dqc, 36524)
      const quad = Math.floor(dcent / 1461)
      const dquad = mod(dcent, 1461)
      const yindex = Math.floor(dquad / 365)
      let year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex
      if(!((cent === 4) || (yindex === 4))) {
        year++
      }
      const yearday = wjd - this.gregorianToJulian(new Date(year, 1 - 1, 1, 0, 0))
      const leapadj = (
        wjd < this.gregorianToJulian(new Date(year, 3 - 1, 1, 0, 0, 0))
        ? 0
        : this.gregorianLeap(year) ? 1 : 2
      )
      const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367)
      const day = (
        (wjd - this.gregorianToJulian(new Date(year, month - 1, 1, 0, 0, 0))) + 1
      )

      return new Date(year, month - 1, day, 0, 0, 0)
    }

    const z = Math.floor(jdn + 0.5)
    let a = Math.floor((z - 1867216.25) / 36524.25)
    a = z + 1 + a - Math.floor(a / 4)
    const b = a + 1524
    const c = Math.floor((b - 122.1) / 365.25)
    const d = Math.floor(365.25 * c)
    const e = Math.floor((b - d) / 30.6001)

    const day = b - d - Math.floor(e * 30.6001)
    const month = e - (e > 13.5 ? 13 : 1)
    let year = c - (month > 2.5 ? 4716 : 4715)

    if(year <= 0) year--

    return new Date(year, month - 1, day)
  }

  private static createHijriDate(
    { year, month, day }:
    { year: number, month: number, day: number }
  ) {
    const monthNames = [
      "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
      "Jumada al-awwal", "Jumada al-thani", "Rajab", "Sha'aban",
      "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ]

    return {
      year,
      month,
      day,
      monthName: monthNames[month - 1],
      toString: () => `${year}⁄${month}⁄${day}`,
      toFormat: (format: string, { pad = false } = {}) => (
        format
        .replace(/YYYY/g, year.toString())
        .replace(/mm/g, month.toString().padStart(pad ? 2 : 0, '0'))
        .replace(/dd/g, day.toString().padStart(pad ? 2 : 0, '0'))
      )
    }
  }
}