import { describe, expect, it } from 'bun:test'
import {
  formatCoAuthorTrailer,
  parseCoAuthor,
  stripMatchingQuotes,
  USAGE,
} from './commit-message.js'

describe('commit-message command helpers', () => {
  it('parses quoted co-author names with a plain email', () => {
    expect(parseCoAuthor('"GPT 5.5" noreply@openclaude.dev')).toEqual({
      name: 'GPT 5.5',
      email: 'noreply@openclaude.dev',
    })
  })

  it('parses co-author trailers with angle-bracket emails', () => {
    expect(parseCoAuthor('OpenCodex (gpt-5.5) <noreply@openclaude.dev>')).toEqual(
      {
        name: 'OpenCodex (gpt-5.5)',
        email: 'noreply@openclaude.dev',
      },
    )
  })

  it('rejects co-author trailers with empty sanitized names', () => {
    expect(parseCoAuthor('"  " noreply@openclaude.dev')).toBeNull()
    expect(parseCoAuthor('"  " <noreply@openclaude.dev>')).toBeNull()
  })

  it('strips one pair of matching quotes from custom attribution text', () => {
    expect(stripMatchingQuotes('"Generated with OpenCodex"')).toBe(
      'Generated with OpenCodex',
    )
    expect(stripMatchingQuotes("'Generated with OpenCodex'")).toBe(
      'Generated with OpenCodex',
    )
    expect(stripMatchingQuotes('"Generated with OpenCodex')).toBe(
      '"Generated with OpenCodex',
    )
  })

  it('formats a sanitized co-author trailer', () => {
    expect(
      formatCoAuthorTrailer('OpenCodex <gpt>\n', '<noreply@openclaude.dev>'),
    ).toBe('Co-Authored-By: OpenCodex gpt <noreply@openclaude.dev>')
  })

  it('makes set scope explicit with example text', () => {
    expect(USAGE).toContain(
      'Controls only the attribution text appended after /commit messages.',
    )
    expect(USAGE).toContain(
      '/commit-message set "Generated with OpenCodex using GPT-5.5"',
    )
    expect(USAGE).not.toContain('/commit-message set-attribution')
  })
})
