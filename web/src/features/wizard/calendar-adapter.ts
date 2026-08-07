/**
 * The bits of calendar-system knowledge `CalendarNav`/`MonthYearPopover`
 * need that differ between the Hebrew and Gregorian pickers — everything
 * else (grid rendering, the `JumpButton` select-dispatch trick) is already
 * calendar-agnostic, since `DateItemType`'s `month`/`year` fields are just
 * numbers regardless of which config produced them.
 */

import { HDate, gematriya } from '@hebcal/core'

import { hebrewMonthName, stepHebrewMonth } from '@/features/wizard/hebrew-datepicker-config'

export interface CalendarAdapter {
  monthName(month: number, year: number): string
  yearLabel(year: number): string
  monthsInYear(year: number): number
  stepMonth(month: number, year: number, direction: 1 | -1): { month: number; year: number }
  /** A date of death can't be in the future — used to disable months
   * (and, at the day-grid level, individual days) beyond today. */
  isFutureMonth(month: number, year: number): boolean
  /** Whether every month of `year` is in the future — used to disable
   * year buttons/pagination. Not just `isFutureMonth(1, year)`: in the
   * Hebrew adapter month 1 (Nisan) isn't the year's chronological start,
   * Tishrei (7) is (see hebrew-datepicker-config.ts). */
  isFutureYear(year: number): boolean
}

export const hebrewCalendarAdapter: CalendarAdapter = {
  monthName: hebrewMonthName,
  yearLabel: (year) => gematriya(year),
  monthsInYear: (year) => HDate.monthsInYear(year),
  stepMonth: stepHebrewMonth,
  isFutureMonth: (month, year) => new HDate(1, month, year).greg().getTime() > Date.now(),
  isFutureYear: (year) => new HDate(1, 7, year).greg().getTime() > Date.now(),
}

/** Gregorian has a fixed 12 months/year, so unlike the Hebrew adapter its
 * `stepMonth` needs no lookahead at all — the library's own `next`/`prev`
 * day-mode actions would actually be safe here, but reusing `JumpButton`
 * for both keeps one code path instead of two. */
export function gregorianCalendarAdapter(locale: string): CalendarAdapter {
  return {
    monthName: (month, year) =>
      new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(year, month - 1, 1)),
    yearLabel: (year) => String(year),
    monthsInYear: () => 12,
    stepMonth: (month, year, direction) => {
      const next = month + direction
      if (next < 1) return { month: 12, year: year - 1 }
      if (next > 12) return { month: 1, year: year + 1 }
      return { month: next, year }
    },
    isFutureMonth: (month, year) => new Date(year, month - 1, 1).getTime() > Date.now(),
    isFutureYear: (year) => new Date(year, 0, 1).getTime() > Date.now(),
  }
}
