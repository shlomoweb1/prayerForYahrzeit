/**
 * P3-03/04 Static stylesheet for sheet pages.
 *
 * The same CSS string powers the live preview AND the captured PDF document
 * (the style tag carries `data-izkor-sheet` so the capture pipeline can pick
 * exactly this sheet from document.styleSheets). Layout-specific numbers
 * (page size, margins, font sizes) are inline styles on the elements; this
 * file holds only structural rules.
 *
 * Word decoration uses the spike-proven flex pattern (FINDINGS.md P2-04):
 * a flex row of flex columns, one column per word, big letter above body.
 */

/** Attribute on the <style> tags injected by the sheet component. */
export const SHEET_STYLE_ATTR = 'data-izkor-sheet'

export function sheetCss(): string {
  return [
    '.izkor-page{box-sizing:border-box;overflow:hidden;background:#fff;}',
    '.izkor-header{font-weight:700;text-align:center;margin:0 0 0.9em;}',
    '.izkor-heading{font-weight:700;text-align:center;margin:1.15em 0 0.55em;}',
    '.izkor-subheading{font-weight:700;text-align:center;margin:0.95em 0 0.45em;opacity:0.92;}',
    '.izkor-verse{text-align:center;margin:0.16em 0;}',
    '.izkor-block{text-align:center;margin:0.3em 0;}',
    '.izkor-block b{font-weight:700;}',
    '.izkor-source{text-align:center;font-size:0.85em;opacity:0.75;margin:0 0 0.5em;}',
    '.izkor-mishnah{text-align:justify;text-align-last:center;margin:0.3em 0 0.9em;line-height:1.75;}',
    '.izkor-dline{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;',
    'align-items:flex-end;gap:0.3em 0.5em;}',
    '.izkor-dword{display:flex;flex-direction:column;align-items:center;}',
    '.izkor-ddeco{font-weight:700;line-height:1.05;}',
  ].join('\n')
}
