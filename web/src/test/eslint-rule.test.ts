import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'

import plugin from '../../eslint-local/plugin.js'

const linter = new Linter()

const ruleName = 'izkor/logical-props'

function lint(code: string) {
  return linter.verify(
    code,
    [
      {
        files: ['**/*.{ts,tsx}'],
        plugins: { izkor: plugin as never },
        languageOptions: {
          parserOptions: { ecmaVersion: 2023, sourceType: 'module', ecmaFeatures: { jsx: true } },
        },
        rules: { [ruleName]: 'error' },
      },
    ],
    { filename: 'test.tsx' },
  )
}

describe('eslint logical-props rule', () => {
  it('flags directional physical padding and margin utilities', () => {
    const messages = lint('export const C = () => <div className="pl-4 pr-2 ml-3 mr-1" />')
    const tokens = messages.map((m) => m.message)
    expect(tokens).toHaveLength(4)
    expect(tokens[0]).toContain('ps-')
    expect(tokens[1]).toContain('pe-')
    expect(tokens[2]).toContain('ms-')
    expect(tokens[3]).toContain('me-')
  })

  it('flags physical borders, radii, insets and text alignment', () => {
    const messages = lint(
      'export const C = () => <div className="border-l border-r rounded-l rounded-r inset-x-0 text-left text-right" />',
    )
    expect(messages).toHaveLength(7)
  })

  it('flags left/right utilities', () => {
    const messages = lint('export const C = () => <div className="left-4 right-0" />')
    expect(messages).toHaveLength(2)
  })

  it('flags template literals inside className', () => {
    const messages = lint('export const C = () => <div className={`p-2 mr-4`} />')
    expect(messages).toHaveLength(1)
  })

  it('does not flag logical or symmetric utilities', () => {
    const messages = lint(
      'export const C = () => <div className="ps-4 pe-2 ms-3 me-1 px-4 py-2 mx-auto my-0 text-start border-s border-e rounded-s rounded-e inset-inline-0 inset-0 gap-4 size-4" />',
    )
    expect(messages).toHaveLength(0)
  })

  it('does not flag class strings that only resemble physical props', () => {
    const messages = lint('export const C = () => <div className="mls-4 prs-2" />')
    expect(messages).toHaveLength(0)
  })
})
