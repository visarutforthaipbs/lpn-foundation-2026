/** Remove emoji graphemes without disturbing Thai combining marks or nearby copy. */
const graphemes = new Intl.Segmenter('und', { granularity: 'grapheme' })
const pictographic = /[\p{Extended_Pictographic}\p{Emoji_Presentation}\u{1F1E6}-\u{1F1FF}]/u
const keycap = /[0-9#*]\uFE0F?\u20E3/u

export function hasEmoji(value: string): boolean {
  return pictographic.test(value) || keycap.test(value)
}

export function stripEmoji(value: string): string {
  if (!hasEmoji(value)) return value
  let cleaned = ''
  for (const { segment } of graphemes.segment(value)) {
    if (!hasEmoji(segment)) cleaned += segment
  }
  return cleaned.replace(/^[ \t\u00a0]+/u, '').replace(/[ \t]{2,}/gu, ' ')
}

/** Lexical text lives in `text` leaves; leave links, media IDs and formatting intact. */
export function stripEmojiFromRichText<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripEmojiFromRichText) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        key === 'text' && typeof child === 'string' ? stripEmoji(child) : stripEmojiFromRichText(child),
      ]),
    ) as T
  }
  return value
}
