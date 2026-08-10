import type { SheetGender } from '@/features/sheet/layout'

/** "המנוחה" for female, "הנפטר" for male — used mid-sentence (loading copy, section headings). */
export function deceasedWord(gender: SheetGender): string {
  return gender === 'female' ? 'המנוחה' : 'הנפטר'
}
