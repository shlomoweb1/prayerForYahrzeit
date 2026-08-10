/**
 * A `DatepickerConfig` for `headless-datetimepicker` (the library only
 * ships the rendering "what goes in each grid cell" side of a calendar
 * system as a config object - the same seam its own Jalali calendar uses)
 * that swaps the default Gregorian grid for the Hebrew one, via
 * `@hebcal/core`'s `HDate`.
 *
 * Known gap: the library's own `next`/`prev` day-mode navigation assumes a
 * fixed 12-months-per-year calendar (`(month % 12) + 1`), which breaks on
 * Hebrew leap years (13 months - Adar I/Adar II). Step 4's own prev/next
 * month buttons therefore do NOT use `<Datepicker.Button action="next">`;
 * they dispatch `{type:'select', payload:{item: {type:'month'|'year', ...}}}`
 * directly (see step-4-death-date.tsx), which the library's reducer applies
 * as a plain assignment with no modulo math - safe for any month count.
 */

import { HDate, Locale, gematriya } from '@hebcal/core'
import type { DatepickerConfig, DateItemType } from 'headless-datetimepicker'

type DayItem = Extract<DateItemType, { type: 'day' }>
type DayHeaderItem = Extract<DayItem, { isHeader: true }>
type DayCellItem = Extract<DayItem, { isHeader: false }>

function mod(value: number, n: number): number {
  return ((value % n) + n) % n
}

/** `HDate.getMonthName()` returns the English transliteration ("Av") -
 * this is the Hebrew-script name ("אב"), no niqud, for calendar UI labels. */
export function hebrewMonthName(month: number, year: number): string {
  return Locale.gettext(new HDate(1, month, year).getMonthName(), 'he-x-NoNikud')
}

/**
 * Chronological month order within a Hebrew calendar year, as `HDate`
 * numbers it: Nisan=1 ... Adar(II)=12/13, but the *year number* itself
 * rolls over at Tishrei (7), not at Nisan (1) - so Tishrei..Adar comes
 * first within a given year value, then Nisan..Elul finishes it out
 * (verified against `HDate(1, m, year).abs()`; e.g. for year 5786, month
 * 7/Tishrei is Sept 2025 while month 1/Nisan is March 2026 - later in the
 * same numbered year, not earlier). `stepHebrewMonth` below is the one
 * safe way to move by a month: the library's own `next`/`prev` day-mode
 * actions hardcode `(month % 12) + 1`, which is simply wrong here.
 */
function chronologicalMonthOrder(year: number): number[] {
  const count = HDate.monthsInYear(year)
  const afterTishrei = Array.from({ length: count - 6 }, (_, i) => i + 7)
  const throughElul = [1, 2, 3, 4, 5, 6]
  return [...afterTishrei, ...throughElul]
}

export function stepHebrewMonth(
  month: number,
  year: number,
  direction: 1 | -1,
): { month: number; year: number } {
  const order = chronologicalMonthOrder(year)
  const nextIndex = order.indexOf(month) + direction
  if (nextIndex < 0) return { month: 6, year: year - 1 }
  if (nextIndex >= order.length) return { month: 7, year: year + 1 }
  return { month: order[nextIndex]!, year }
}

/** Hebrew calendar year `state.year`/`state.month` operate in - Nisan=1
 * through Adar(=12, or Adar II=13 in a leap year), per `HDate`'s own
 * numbering (see `HDate.monthsInYear`/`getMonth`). */
export const hebrewDatepickerConfig: DatepickerConfig = {
  dayNames: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
  monthNames: [],

  format(date) {
    return date ? new HDate(date).renderGematriya() : ''
  },
  parse(_date, _format, referenceDate) {
    return referenceDate ?? new Date()
  },

  toDateParts(date) {
    const hd = new HDate(date)
    return { day: hd.getDate(), month: hd.getMonth(), year: hd.getFullYear() }
  },

  days({ month, year, value, startOfWeek }) {
    const daysInMonth = HDate.daysInMonth(month, year)
    const firstOfMonth = new HDate(1, month, year)
    const startOffset = mod(firstOfMonth.greg().getDay() - startOfWeek, 7)
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7
    const gridStartAbs = firstOfMonth.abs() - startOffset

    const todayAbs = new HDate(new Date()).abs()
    const selectedAbs = value ? new HDate(value).abs() : 0

    const headers: DayHeaderItem[] = this.dayNames.map((name, i) => ({
      type: 'day',
      key: `weekday-${i}`,
      isToday: false,
      isSelected: false,
      isHeader: true,
      isDisabled: false,
      value: i,
      text: name,
    }))

    const days: DayCellItem[] = Array.from({ length: totalCells }, (_, i) => {
      const abs = gridStartAbs + i
      const hd = new HDate(abs)
      const isInCurrentMonth = hd.getMonth() === month && hd.getFullYear() === year
      return {
        type: 'day',
        key: abs,
        isToday: abs === todayAbs,
        isSelected: abs === selectedAbs,
        isHeader: false,
        isInCurrentMonth,
        isDisabled: !isInCurrentMonth,
        text: gematriya(hd.getDate()),
        value: hd.greg(),
      }
    })

    return [...headers, ...days]
  },

  months({ year }) {
    const count = HDate.monthsInYear(year)
    return Array.from({ length: count }, (_, i) => {
      const month = i + 1
      return {
        type: 'month',
        key: `month-${month}`,
        isToday: false,
        isSelected: false,
        isHeader: false,
        isDisabled: false,
        value: month,
        text: hebrewMonthName(month, year),
      }
    })
  },

  years({ year }) {
    const currentYear = new HDate(new Date()).getFullYear()
    const span = 150
    return Array.from({ length: span * 2 + 1 }, (_, i) => {
      const value = currentYear - span + i
      return {
        type: 'year',
        key: `year-${value}`,
        isToday: value === currentYear,
        isSelected: value === year,
        isHeader: false,
        isDisabled: false,
        value,
        text: gematriya(value),
      }
    })
  },

  // Not used - step 4 never opens the hour/minute pickers.
  hours: () => [],
  minutes: () => [],
}
