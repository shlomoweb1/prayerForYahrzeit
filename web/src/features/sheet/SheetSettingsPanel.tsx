/**
 * P3-05 Live settings panel for the split editor.
 *
 * Renders the sheet settings (font, nikud, deco, acrostic, blessing, paper,
 * section toggles) bound to the wizard URL query, so every change is
 * immediately reflected in the live preview and survives a reload.
 */

import { useTranslation } from 'react-i18next'
import { useId } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { SHEET_FONTS } from '@/features/sheet/fonts'
import { SHEET_FONT_CLASS } from '@/features/sheet/generated/sheet-font-ids'
import { SHEET_SECTIONS } from '@/features/sheet/layout'
import type { WizardQuery } from '@/features/wizard/wizard-query'

export interface SheetSettingsPanelProps {
  search: WizardQuery
  setSearch: (patch: Partial<WizardQuery>) => void
  className?: string
}

function SheetSettingsControls({ search, setSearch, idPrefix }: SheetSettingsPanelProps & { idPrefix: string }) {
  const { t } = useTranslation()

  const toggleSection = (section: (typeof SHEET_SECTIONS)[number], checked: boolean) => {
    const next = checked
      ? [...search.sections, section]
      : search.sections.filter((value) => value !== section)
    setSearch({ sections: next })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-font`}>{t('wizard.labels.font')}</Label>
        <Select value={search.font} onValueChange={(value) => setSearch({ font: value })}>
          <SelectTrigger id={`${idPrefix}-font`}>
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
      </div>

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
        <Label>{t('wizard.labels.acrostic')}</Label>
        <RadioGroup
          value={search.acrostic}
          onValueChange={(value) =>
            setSearch({ acrostic: value as 'both' | 'name' | 'parent' | 'none' })
          }
          className="flex flex-col gap-2"
        >
          {(['both', 'name', 'parent', 'none'] as const).map((mode) => (
            <div key={mode} className="flex items-center gap-2">
              <RadioGroupItem value={mode} id={`${idPrefix}-acrostic-${mode}`} />
              <Label htmlFor={`${idPrefix}-acrostic-${mode}`}>
                {t(`wizard.options.acrostic.${mode}`)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="grid gap-2">
        <Label>{t('wizard.labels.sections')}</Label>
        <div className="flex flex-col gap-2">
          {SHEET_SECTIONS.map((section) => (
            <div key={section} className="flex items-center gap-2">
              <Checkbox
                id={`${idPrefix}-section-${section}`}
                checked={search.sections.includes(section)}
                onCheckedChange={(checked) => toggleSection(section, checked === true)}
              />
              <Label htmlFor={`${idPrefix}-section-${section}`}>
                {t(`wizard.sections.${section}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SheetSettingsPanel({ search, setSearch, className }: SheetSettingsPanelProps) {
  const idPrefix = useId()

  return (
    <div className={className}>
      <SheetSettingsControls search={search} setSearch={setSearch} idPrefix={idPrefix} />
    </div>
  )
}
