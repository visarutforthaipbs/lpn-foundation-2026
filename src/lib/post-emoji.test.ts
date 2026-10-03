import assert from 'node:assert/strict'
import test from 'node:test'
import { hasEmoji, stripEmoji, stripEmojiFromRichText } from './post-emoji'

test('removes emoji clusters while preserving Thai and English copy', () => {
  assert.equal(stripEmoji('🏷️ ป้ายกำกับ'), 'ป้ายกำกับ')
  assert.equal(stripEmoji('มั่นใจ‼️ CPF'), 'มั่นใจ CPF')
  assert.equal(stripEmoji('📞 Mobile: +66 85 534 1595'), 'Mobile: +66 85 534 1595')
  assert.equal(stripEmoji('ข้อ 1️⃣ สำคัญ'), 'ข้อ สำคัญ')
  assert.equal(stripEmoji('แรงงานข้ามชาติ'), 'แรงงานข้ามชาติ')
  assert.equal(hasEmoji('แรงงานข้ามชาติ'), false)
})

test('cleans Lexical text without changing links or formatting', () => {
  const value = {
    root: {
      children: [{
        type: 'link',
        fields: { url: 'https://example.org/report.pdf' },
        children: [{ type: 'text', format: 1, text: '📄 ดาวน์โหลดรายงาน' }],
      }],
    },
  }
  const cleaned = stripEmojiFromRichText(value)
  assert.equal(cleaned.root.children[0].children[0].text, 'ดาวน์โหลดรายงาน')
  assert.equal(cleaned.root.children[0].fields.url, 'https://example.org/report.pdf')
  assert.equal(cleaned.root.children[0].children[0].format, 1)
  assert.equal(value.root.children[0].children[0].text, '📄 ดาวน์โหลดรายงาน')
})
