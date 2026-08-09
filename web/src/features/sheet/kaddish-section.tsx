/**
 * KaddishSection: one kaddish exchange — the mourners' line plus the
 * congregation's response it ends in (or the standalone joint line
 * "הקהל והאבלים: יהא שמה רבא") — as its own self-contained component.
 *
 * The whole קדיש יתום block is one [data-content="kaddish"] container
 * (rendered by sheet-document.tsx); each exchange inside it is this
 * component's own [data-content="kaddish-section"] div. The structured data
 * (data/liturgy.json → content.ts) carries only the speaker role
 * (KaddishSpeaker) and the text; this component re-adds the traditional
 * printed labels at render time. Each line is a single inline span keyed by
 * data-speaker (label + text folded into the same element — no nested
 * wrapper), so the layout CSS (preview.css / pdf.css) can drive everything
 * via [data-content] / [data-speaker] selectors. The one exception is the
 * joint line (הקהל והאבלים): its instruction renders as its own
 * [data-speaker="joint-cue"] span above the [data-speaker="joint"] text span,
 * so the two can stack onto separate rows.
 */

import type { ReactNode } from 'react'

import type { KaddishSectionChunk } from '@/features/sheet/content'
import type { KaddishResponseLabel } from '@/features/sheet/layout'
import type { KaddishSpeaker } from '@/lib/liturgy'

/**
 * Printed cue word for the congregation's response, per `KaddishResponseLabel`
 * — "none" prints the response text itself unlabeled (no parens either).
 */
const KADDISH_RESPONSE_CUE: Record<Exclude<KaddishResponseLabel, 'none'>, string> = {
  congregation: 'הקהל',
  responders: 'עונים',
}

/** Printed prefix/suffix around a congregation response line, e.g.
 * "(הקהל: " / ")" — mourners' lines and the joint/note lines never get a
 * label, regardless of `responseLabel`. */
function speakerPrefix(speaker: KaddishSpeaker, responseLabel: KaddishResponseLabel): string {
  if (speaker !== 'congregation' || responseLabel === 'none') return ''
  return `(${KADDISH_RESPONSE_CUE[responseLabel]}: `
}

function speakerSuffix(speaker: KaddishSpeaker, responseLabel: KaddishResponseLabel): string {
  return speaker === 'congregation' && responseLabel !== 'none' ? ')' : ''
}

export interface KaddishSectionProps {
  chunk: KaddishSectionChunk
  responseLabel: KaddishResponseLabel
}

/** One kaddish exchange rendered as its own div: each line is a single
 * inline span keyed by data-speaker, the joint line and rubric notes wrap
 * onto their own full-width rows via the CSS. `data-chunk` carries the
 * chunk's role (lead/wide/joint/note/plain, computed in content.ts) so the
 * layout CSS can target it without relying on nusach-specific nth-child
 * positions — the ashkenaz and sepharadi rites have a different number of
 * exchanges before the joint line. */
export function KaddishSection({ chunk, responseLabel }: KaddishSectionProps): ReactNode {
  return (
    <div data-content="kaddish-section-chunk" data-chunk={chunk.role} data-prayer="kaddish">
      {chunk.lines.map((line, index) =>
        line.speaker === 'joint' ? (
          <span key={index} data-content="joint-line">
            <span data-speaker="joint-cue">הקהל והאבלים</span>
            <span data-speaker="joint" dangerouslySetInnerHTML={{ __html: line.html }} />
          </span>
        ) : (
          <span
            key={index}
            data-speaker={line.speaker}
            dangerouslySetInnerHTML={{
              __html: `${speakerPrefix(line.speaker, responseLabel)}${line.html}${speakerSuffix(line.speaker, responseLabel)}`,
            }}
          />
        ),
      )}
    </div>
  )
}
