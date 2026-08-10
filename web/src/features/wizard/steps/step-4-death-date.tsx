import { HDate } from '@hebcal/core'
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { Datepicker, config as gregorianDatepickerConfig } from 'headless-datetimepicker'
import type { DateItemType } from 'headless-datetimepicker'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  gregorianCalendarAdapter,
  hebrewCalendarAdapter,
  type CalendarAdapter,
} from '@/features/wizard/calendar-adapter'
import { hebrewDatepickerConfig } from '@/features/wizard/hebrew-datepicker-config'
import type { WizardQuery } from '@/features/wizard/wizard-query'
import { StepShell } from '@/features/wizard/steps/step-shell'
import { cn } from '@/lib/utils'

interface StepProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
}

type SunsetAnswer = 'before' | 'after' | 'unsure'
type CalendarMode = 'hebrew' | 'gregorian'

const SUNSET_ANSWERS: SunsetAnswer[] = ['before', 'after', 'unsure']
const YEAR_PAGE_SIZE = 12

/** month/year select items only carry a `value` through the reducer (see
 * hebrew-datepicker-config.ts's doc comment) — the rest of the fields are
 * unused by that code path, so a minimal stub is enough. */
function navItem(type: 'month' | 'year', value: number): DateItemType {
  return {
    type,
    key: `nav-${type}-${value}`,
    isToday: false,
    isSelected: false,
    isHeader: false,
    isDisabled: false,
    value,
    text: '',
  }
}

/**
 * A jump target that may need to move month AND year together (e.g. from
 * Adar II — only valid in a leap year — to a plain year, which has no
 * month 13). Renders as two real, visually hidden `Datepicker.Item`s
 * (the one exported primitive whose click *does* reach the reducer's
 * exact, non-modulo `month`/`year` assignment) and clicks both when
 * pressed, so one user click applies both fields atomically. Every custom
 * nav control in this file uses this instead of the library's own
 * `next`/`prev` day-mode actions, which hardcode a 12-months-per-year
 * rollover and silently skip Adar II in leap years.
 */
function JumpButton({
  targetMonth,
  targetYear,
  selected,
  disabled,
  label,
  ariaLabel,
  className,
  onPicked,
}: {
  targetMonth: number
  targetYear: number
  selected?: boolean
  disabled?: boolean
  label: ReactNode
  ariaLabel?: string
  className?: string
  onPicked?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <>
      <div ref={ref} className="hidden">
        <Datepicker.Item data-y item={navItem('year', targetYear)} />
        <Datepicker.Item data-m item={navItem('month', targetMonth)} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(selected && 'border-gold bg-gold/20', className)}
        onClick={() => {
          ref.current?.querySelector<HTMLButtonElement>('[data-y]')?.click()
          ref.current?.querySelector<HTMLButtonElement>('[data-m]')?.click()
          onPicked?.()
        }}
      >
        {label}
      </Button>
    </>
  )
}

/**
 * Single dropdown reached by the pencil after the month+year label — a
 * year pager/grid on top, a month grid (for whichever year is currently
 * showing) below. Picking a year re-centres the month grid on it without
 * closing the popover, so a far jump ("that Adar three years ago") is one
 * open, two clicks; picking a month applies it and closes.
 */
function MonthYearPopover({
  month,
  year,
  adapter,
}: {
  month: number
  year: number
  adapter: CalendarAdapter
}) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const [open, setOpen] = useState(false)
  const [yearPageStart, setYearPageStart] = useState(year - Math.floor(YEAR_PAGE_SIZE / 2))

  // Re-centre the year page on the live year each time the popover opens —
  // simpler to reason about than remembering the last scroll position.
  useEffect(() => {
    if (open) setYearPageStart(year - Math.floor(YEAR_PAGE_SIZE / 2))
  }, [open, year])

  const pageYears = Array.from({ length: YEAR_PAGE_SIZE }, (_, i) => yearPageStart + i)
  const monthCount = adapter.monthsInYear(year)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="hover:bg-muted flex items-center gap-1.5 rounded-md px-2 py-1"
        >
          <span className="text-sm font-medium">
            {adapter.monthName(month, year)} {adapter.yearLabel(year)}
          </span>
          <Pencil className="text-muted-foreground size-3" aria-hidden />
          <span className="sr-only">{t('wizard.deathDate.editMonthYear')}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => setYearPageStart((p) => p - YEAR_PAGE_SIZE)}
                aria-label={t('wizard.deathDate.earlierYears')}
              >
                {isRtl ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
              </Button>
              <span className="text-muted-foreground text-xs">
                {adapter.yearLabel(yearPageStart)}–{adapter.yearLabel(yearPageStart + YEAR_PAGE_SIZE - 1)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6"
                disabled={adapter.isFutureYear(yearPageStart + YEAR_PAGE_SIZE)}
                onClick={() => setYearPageStart((p) => p + YEAR_PAGE_SIZE)}
                aria-label={t('wizard.deathDate.laterYears')}
              >
                {isRtl ? <ChevronLeft className="size-3" /> : <ChevronRight className="size-3" />}
              </Button>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1" role="group" aria-label={t('wizard.deathDate.chooseYear')}>
              {pageYears.map((y) => (
                <JumpButton
                  key={y}
                  targetMonth={Math.min(month, adapter.monthsInYear(y))}
                  targetYear={y}
                  selected={y === year}
                  disabled={adapter.isFutureYear(y)}
                  ariaLabel={adapter.yearLabel(y)}
                  label={adapter.yearLabel(y)}
                  className="h-8 px-1 text-xs"
                />
              ))}
            </div>
          </div>
          <div className="border-t pt-3">
            <div className="grid grid-cols-3 gap-1" role="group" aria-label={t('wizard.deathDate.chooseMonth')}>
              {Array.from({ length: monthCount }, (_, i) => i + 1).map((m) => (
                <JumpButton
                  key={m}
                  targetMonth={m}
                  targetYear={year}
                  selected={m === month}
                  disabled={adapter.isFutureMonth(m, year)}
                  ariaLabel={adapter.monthName(m, year)}
                  onPicked={() => setOpen(false)}
                  label={adapter.monthName(m, year)}
                  className="h-8 px-1 text-xs"
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function CalendarNav({
  month,
  year,
  adapter,
}: {
  month: number
  year: number
  adapter: CalendarAdapter
}) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const prevTarget = adapter.stepMonth(month, year, -1)
  const nextTarget = adapter.stepMonth(month, year, 1)

  return (
    <div className="flex items-center justify-between">
      <JumpButton
        targetMonth={prevTarget.month}
        targetYear={prevTarget.year}
        ariaLabel={t('common.previous')}
        className="size-9 px-0"
        label={isRtl ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      />
      <MonthYearPopover month={month} year={year} adapter={adapter} />
      <JumpButton
        targetMonth={nextTarget.month}
        targetYear={nextTarget.year}
        disabled={adapter.isFutureMonth(nextTarget.month, nextTarget.year)}
        ariaLabel={t('common.next')}
        className="size-9 px-0"
        label={isRtl ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      />
    </div>
  )
}

export function Step4DeathDate({ search, setSearch }: StepProps) {
  const { t, i18n } = useTranslation()
  const [pendingDate, setPendingDate] = useState<Date | null>(null)
  const [mode, setMode] = useState<CalendarMode>('hebrew')
  // Bumped whenever the calendar needs a clean slate (back-to-calendar,
  // change) — the picker library tracks its own internal "selected day"
  // separately from our pendingDate/deathDate state, so clearing our state
  // alone leaves its old selection highlighted and can even swallow a
  // re-click on that same day (no value change → no onChange). Folding
  // this into the `key` forces a full remount instead.
  const [calendarResetToken, setCalendarResetToken] = useState(0)

  const confirmedHDate = search.deathDate ? new HDate(search.deathDate) : undefined
  const adapter = mode === 'hebrew' ? hebrewCalendarAdapter : gregorianCalendarAdapter(i18n.language)
  const activeConfig = mode === 'hebrew' ? hebrewDatepickerConfig : gregorianDatepickerConfig

  const chooseSunset = (answer: SunsetAnswer) => {
    if (!pendingDate) return
    const base = new HDate(pendingDate).abs()
    setSearch({ deathDate: answer === 'after' ? base + 1 : base })
    setPendingDate(null)
  }

  const backToCalendar = () => {
    setPendingDate(null)
    setCalendarResetToken((n) => n + 1)
  }

  const startOver = () => {
    setPendingDate(null)
    setSearch({ deathDate: undefined })
    setCalendarResetToken((n) => n + 1)
  }

  const pendingHDate = pendingDate ? new HDate(pendingDate) : undefined
  const gregorianLabel = pendingDate
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(pendingDate)
    : ''
  // A day is "chosen" the moment it's tapped, not only once the sunset
  // question is answered too — the calendar-mode toggle, instructions, and
  // skip link are all stale from that point on, not just once confirmed.
  const dateChosen = Boolean(pendingDate || confirmedHDate)

  // Overlays share this box's size, so the sunset question and the
  // confirmed-date summary never resize the step — only their
  // opacity/pointer-events toggle. See debug notes: the Hebrew calendar
  // always renders 6 day-rows, but Gregorian months swing between 5 and 7
  // (verified live: 168px–240px) — `min-h-60` (240px) reserves for the
  // worst case in both modes.
  return (
    <StepShell
      stepNumber={4}
      titleKey="wizard.steps.4.title"
      descriptionKey="wizard.steps.4.description"
    >
      <div className="flex flex-col gap-4">
        {/* Stale from the moment a day is tapped, not just once confirmed —
         * faded out (not unmounted) so this row still reserves its height
         * and the container stays the same size. */}
        <div
          className={cn(
            'flex items-center justify-between gap-2 transition-opacity',
            dateChosen ? 'pointer-events-none opacity-0' : 'opacity-100',
          )}
        >
          <p className="text-muted-foreground text-sm">{t('wizard.deathDate.instructions')}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setMode((m) => (m === 'hebrew' ? 'gregorian' : 'hebrew'))}
          >
            {mode === 'hebrew'
              ? t('wizard.deathDate.switchToGregorian')
              : t('wizard.deathDate.switchToHebrew')}
          </Button>
        </div>

        <div className="relative">
          <Datepicker
            key={`${mode}-${calendarResetToken}`}
            as="div"
            config={activeConfig}
            startOfWeek={0}
            onChange={(date) => {
              if (date) setPendingDate(date)
            }}
          >
            <Datepicker.Picker
              alwaysOpen
              defaultType="day"
              className="rounded-xl border bg-card p-3 shadow-sm sm:p-4"
            >
              {(slot) => (
                <div className="flex flex-col gap-3">
                  <CalendarNav month={slot.month} year={slot.year} adapter={adapter} />
                  <Datepicker.Items type="day">
                    {({ items }) => (
                      <div dir={i18n.dir()} className="grid min-h-60 grid-cols-7 content-start gap-1">
                        {items.map((item) => {
                          if (item.isHeader) {
                            return (
                              <span
                                key={item.key}
                                className="text-muted-foreground py-1 text-center text-xs font-medium"
                              >
                                {item.text}
                              </span>
                            )
                          }
                          // A date of death can't be in the future.
                          const isFuture = item.value.getTime() > Date.now()
                          return (
                            <Datepicker.Item
                              key={item.key}
                              item={item}
                              disabled={item.isDisabled || isFuture}
                              className={cn(
                                'rounded-md py-1.5 text-center text-sm transition-colors',
                                item.isInCurrentMonth && !isFuture
                                  ? 'text-foreground hover:bg-muted'
                                  : 'text-muted-foreground/40',
                                item.isToday && 'ring-primary/50 ring-1',
                                item.isSelected && 'bg-gold text-gold-foreground hover:bg-gold',
                              )}
                            >
                              {item.text}
                            </Datepicker.Item>
                          )
                        })}
                      </div>
                    )}
                  </Datepicker.Items>
                </div>
              )}
            </Datepicker.Picker>
          </Datepicker>

          {/* Sunset question: overlays the (still-visible, blurred) calendar
           * instead of pushing a new block below it. */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-xl bg-card/95 p-4 backdrop-blur-sm transition-opacity duration-200',
              pendingDate && !confirmedHDate ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <div className="flex w-full max-w-sm flex-col gap-3 text-center">
              <p className="text-sm">
                {t('wizard.deathDate.dateSelected', {
                  hebrew: pendingHDate?.renderGematriya() ?? '',
                  gregorian: gregorianLabel,
                })}
              </p>
              <span className="text-sm font-medium">{t('wizard.deathDate.sunsetQuestion')}</span>
              {/* Plain buttons, not a RadioGroup: picking an answer commits
               * immediately (chooseSunset fades this overlay out right
               * away), so a radio dot never has time to register as
               * "checked" — it only added visual noise, and Radix's
               * RadioGroup defaults to `dir="ltr"` unless told otherwise,
               * which flipped the dot to the wrong side under Hebrew. */}
              <div role="group" aria-label={t('wizard.deathDate.sunsetQuestion')} className="grid grid-cols-1 gap-2">
                {SUNSET_ANSWERS.map((answer) => (
                  <button
                    key={answer}
                    type="button"
                    onClick={() => chooseSunset(answer)}
                    className="hover:border-primary/50 flex cursor-pointer flex-col gap-1 rounded-md border bg-card p-3 text-start text-sm font-medium transition-colors"
                  >
                    <span>{t(`wizard.deathDate.${answer}`)}</span>
                    <span className="text-muted-foreground text-xs font-normal">
                      {t(`wizard.deathDate.${answer}Hint`)}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="text-muted-foreground self-center text-xs underline underline-offset-4"
                onClick={backToCalendar}
              >
                {t('wizard.deathDate.pickAnotherDay')}
              </button>
            </div>
          </div>

          {/* Confirmed date: same box, same size — "שנה" just fades this
           * back out, it doesn't unmount/remount the calendar underneath. */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center rounded-xl bg-card/95 p-4 backdrop-blur-sm transition-opacity duration-200',
              confirmedHDate ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {t('wizard.deathDate.confirmedLabel')}
              </span>
              <span dir="rtl" lang="he" className="font-display text-2xl">
                {confirmedHDate?.renderGematriya()}
              </span>
              <p className="text-muted-foreground max-w-xs text-xs">
                {t('wizard.deathDate.nextStepHint')}
              </p>
              <div className="mt-1 flex flex-col items-center gap-2">
                <Button onClick={() => setSearch({ step: search.step + 1 })}>
                  {t('wizard.deathDate.continueToSheet')}
                  {i18n.dir() === 'rtl' ? (
                    <ChevronLeft className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={startOver}>
                  {t('wizard.deathDate.change')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={cn(
            'text-muted-foreground self-start text-sm underline underline-offset-4 transition-opacity',
            dateChosen ? 'pointer-events-none opacity-0' : 'opacity-100',
          )}
          onClick={() => setSearch({ deathDate: undefined, step: search.step + 1 })}
        >
          {t('wizard.deathDate.skip')}
        </button>
      </div>
    </StepShell>
  )
}
