/**
 * Minimal helpers to build Payload Lexical rich-text state from plain content.
 * Returns are intentionally loosely typed (the node shapes are known-valid Lexical
 * but don't line up with the generated field unions); seed scripts only.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

const text = (t: string) => ({ type: 'text', version: 1, text: t, detail: 0, format: 0, mode: 'normal', style: '' })

export const para = (t: string): any => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  children: [text(t)],
})

export const heading = (t: string, tag: 'h2' | 'h3' = 'h2'): any => ({
  type: 'heading',
  tag,
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children: [text(t)],
})

export const bulletList = (items: string[]): any => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  children: items.map((t, i) => ({
    type: 'listitem',
    value: i + 1,
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: [text(t)],
  })),
})

export const lexical = (nodes: any[]): any => ({
  root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: nodes },
})
