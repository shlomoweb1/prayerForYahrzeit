/**
 * P3-05 Live settings panel for the split editor.
 *
 * Renders the sheet settings (font, nikud, deco, acrostic, blessing, paper,
 * section toggles) bound to the wizard URL query, so every change is
 * immediately reflected in the live preview and survives a reload.
 *
 * Simple / advanced mode: `editorMode` gates a second tier of controls
 * (per-role fonts, line density) that only make sense once someone wants
 * finer control — simple mode keeps the original one-font, one-density
 * surface. Controls are grouped under headings (design, content, sections)
 * rather than one flat list, both because RTL scanning benefits from clear
 * visual chunks and because this panel keeps growing.
 */

import { DownloadIcon, FileCode2Icon, FileTextIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SHEET_FONTS } from '@/features/sheet/fonts'
import { SHEET_FONT_CLASS } from '@/features/sheet/generated/sheet-font-ids'
import { SHEET_SECTIONS } from '@/features/sheet/layout'
import type { SheetFontId } from '@/features/sheet/layout'
import { cn } from '@/lib/utils'
import { downloadBlob, exportSheetHtml } from '@/features/wizard/sheet-actions'
import type { WizardQuery } from '@/features/wizard/wizard-query'

export interface SheetSettingsPanelProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
  className?: string
}

/** A labeled group of controls, visually separated from the next one — the
 * drawer reads as a handful of clear sections instead of one flat list. */
function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function FontSelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (value: SheetFontId) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SheetFontId)}>
      <SelectTrigger id={id}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(SHEET_FONTS).map((def) => (
          <SelectItem key={def.id} value={def.id} className={SHEET_FONT_CLASS[def.id]}>
            {def.cssFamily}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/**
 * A segmented pill control backed by a RadioGroup (each option stays a real
 * radio input, just visually hidden), so keyboard/tab behavior is unchanged.
 * Options render as a 2-column grid of toggle-like buttons; the selected one
 * is highlighted. Labels come from the caller so translation keys stay
 * statically typed.
 */
function SegmentedRadioGroup<V extends string>({
  idPrefix,
  name,
  value,
  onValueChange,
  options,
  getLabel,
}: {
  idPrefix: string
  name: string
  value: V
  onValueChange: (value: string) => void
  options: readonly V[]
  getLabel: (option: V) => string
}) {
  return (
    <RadioGroup
      id={`${idPrefix}-${name}`}
      value={value}
      onValueChange={onValueChange}
      className="grid grid-cols-2 gap-2"
    >
      {options.map((option, index) => (
        <Label
          key={option}
          htmlFor={`${idPrefix}-${name}-${option}`}
          className={cn(
            'cursor-pointer justify-center rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors',
            options.length % 2 === 1 && index === options.length - 1 && 'col-span-2',
            value === option
              ? 'border-primary bg-primary/10 text-primary'
              : 'text-muted-foreground hover:border-primary/50 hover:text-foreground',
          )}
        >
          <RadioGroupItem id={`${idPrefix}-${name}-${option}`} value={option} className="sr-only" />
          {getLabel(option)}
        </Label>
      ))}
    </RadioGroup>
  )
}

function SheetSettingsControls({ search, setSearch, idPrefix }: SheetSettingsPanelProps & { idPrefix: string }) {
  const { t } = useTranslation()
  const isAdvanced = search.editorMode === 'advanced'

  const toggleSection = (section: (typeof SHEET_SECTIONS)[number], checked: boolean) => {
    const next = checked
      ? [...search.sections, section]
      : search.sections.filter((value) => value !== section)
    setSearch({ sections: next })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-editor-mode`}>{t('wizard.labels.editorMode')}</Label>
        <SegmentedRadioGroup
          idPrefix={idPrefix}
          name="editorMode"
          value={search.editorMode}
          onValueChange={(value) => setSearch({ editorMode: value as 'simple' | 'advanced' })}
          options={['simple', 'advanced']}
          getLabel={(mode) => t(`wizard.options.editorMode.${mode}`)}
        />
      </div>

      <SettingsGroup title={t('wizard.groups.design')}>
        {isAdvanced ? (
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}-font-title`}>{t('wizard.labels.fontTitle')}</Label>
              <FontSelect
                id={`${idPrefix}-font-title`}
                value={search.fontTitle ?? search.font}
                onChange={(value) => setSearch({ fontTitle: value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}-font-heading`}>{t('wizard.labels.fontHeading')}</Label>
              <FontSelect
                id={`${idPrefix}-font-heading`}
                value={search.fontHeading ?? search.font}
                onChange={(value) => setSearch({ fontHeading: value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${idPrefix}-font-body`}>{t('wizard.labels.fontBody')}</Label>
              <FontSelect
                id={`${idPrefix}-font-body`}
                value={search.fontBody ?? search.font}
                onChange={(value) => setSearch({ fontBody: value })}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor={`${idPrefix}-font`}>{t('wizard.labels.font')}</Label>
            <FontSelect
              id={`${idPrefix}-font`}
              value={search.font}
              onChange={(value) => setSearch({ font: value })}
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-paper`}>{t('wizard.labels.paper')}</Label>
          <Select
            value={search.paper}
            onValueChange={(value) => setSearch({ paper: value as 'a4' | 'letter' })}
          >
            <SelectTrigger id={`${idPrefix}-paper`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(['a4', 'letter'] as const).map((paper) => (
                <SelectItem key={paper} value={paper}>
                  {t(`wizard.options.paper.${paper}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isAdvanced ? (
          <div className="grid gap-2">
            <Label>{t('wizard.labels.lineDensity')}</Label>
            <RadioGroup
              value={search.lineDensity}
              onValueChange={(value) => setSearch({ lineDensity: value as 'tidy' | 'normal' | 'loose' })}
              className="flex flex-row gap-4"
            >
              {(['tidy', 'normal', 'loose'] as const).map((density) => (
                <div key={density} className="flex items-center gap-2">
                  <RadioGroupItem value={density} id={`${idPrefix}-density-${density}`} />
                  <Label htmlFor={`${idPrefix}-density-${density}`}>
                    {t(`wizard.options.lineDensity.${density}`)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : null}
      </SettingsGroup>

      <SettingsGroup title={t('wizard.groups.content')}>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={`${idPrefix}-nikud`}>{t('wizard.labels.nikud')}</Label>
          <Switch
            id={`${idPrefix}-nikud`}
            checked={search.nikud === 1}
            onCheckedChange={(checked) => setSearch({ nikud: checked ? 1 : 0 })}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={`${idPrefix}-deco`}>{t('wizard.labels.deco')}</Label>
          <Switch
            id={`${idPrefix}-deco`}
            checked={search.deco === 1}
            onCheckedChange={(checked) => setSearch({ deco: checked ? 1 : 0 })}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={`${idPrefix}-blessing`}>{t('wizard.labels.blessing')}</Label>
          <Switch
            id={`${idPrefix}-blessing`}
            checked={search.blessing === 1}
            onCheckedChange={(checked) => setSearch({ blessing: checked ? 1 : 0 })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-acrostic`}>{t('wizard.labels.acrostic')}</Label>
          <SegmentedRadioGroup
            idPrefix={idPrefix}
            name="acrostic"
            value={search.acrostic}
            onValueChange={(value) =>
              setSearch({ acrostic: value as 'both' | 'name' | 'parent' | 'none' })
            }
            options={['both', 'name', 'parent', 'none']}
            getLabel={(mode) => t(`wizard.options.acrostic.${mode}`)}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title={t('wizard.groups.sections')}>
        <div className="flex flex-col gap-3">
          {SHEET_SECTIONS.map((section) => (
            <div key={section} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${idPrefix}-section-${section}`}
                  checked={search.sections.includes(section)}
                  onCheckedChange={(checked) => toggleSection(section, checked === true)}
                />
                <Label htmlFor={`${idPrefix}-section-${section}`} className="min-h-5 flex-1 py-0.5">
                  {t(`wizard.sections.${section}`)}
                </Label>
              </div>
              {section === 'hashkava' && search.sections.includes('hashkava') ? (
                <SegmentedRadioGroup
                  idPrefix={idPrefix}
                  name="hashkava"
                  value={search.hashkavaVariant}
                  onValueChange={(value) =>
                    setSearch({ hashkavaVariant: value as 'elMaleh' | 'traditional' | 'both' })
                  }
                  options={['elMaleh', 'traditional', 'both']}
                  getLabel={(variant) => t(`wizard.options.hashkavaVariant.${variant}`)}
                />
              ) : null}
            </div>
          ))}
        </div>
      </SettingsGroup>
    </div>
  )
}

/**
 * Dev-only debug tools: a toggle for the hidden `?editor=1` preview flag
 * (step-5-review.tsx — forces the live HTML editor-preview instead of the
 * Folio-rendered PDF viewer) and a button that downloads the exact
 * standalone HTML document (compiled CSS, embedded fonts, paginated pages)
 * `renderPdf` hands to the Folio wasm worker — the same source
 * `renderSheetHTML` already stashes on `window.__lastSheetHtml`, but as a
 * real file so it can be opened directly or diffed/debugged with Node
 * instead of pasted out of devtools.
 */
function DevTools({ search, setSearch }: SheetSettingsPanelProps) {
  const [busy, setBusy] = useState(false)
  const editorMode = search.editor === 1

  const handleExport = async () => {
    setBusy(true)
    try {
      const { blob, filename } = await exportSheetHtml(search)
      downloadBlob(blob, filename)
    } finally {
      setBusy(false)
    }
  }

  return (
    <SettingsGroup title="Debug">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSearch({ editor: editorMode ? 0 : 1 })}
      >
        {editorMode ? <FileCode2Icon className="size-4" /> : <FileTextIcon className="size-4" />}
        {editorMode ? 'Switch to PDF preview' : 'Switch to editor preview'}
      </Button>
      <Button variant="outline" size="sm" onClick={() => void handleExport()} disabled={busy}>
        <DownloadIcon className="size-4" />
        {busy ? 'Exporting…' : 'Export PDF HTML'}
      </Button>
    </SettingsGroup>
  )
}

export function SheetSettingsPanel({ search, setSearch, className }: SheetSettingsPanelProps) {
  const idPrefix = useId()

  return (
    <div className={className}>
      <SheetSettingsControls search={search} setSearch={setSearch} idPrefix={idPrefix} />
      {import.meta.env.DEV ? <DevTools search={search} setSearch={setSearch} /> : null}
    </div>
  )
}
