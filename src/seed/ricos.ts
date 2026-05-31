/**
 * Converts Wix Ricos rich content (Blog API) into Payload Lexical state.
 * Handles paragraphs, headings, lists, blockquotes, and images. Text decorations
 * (bold/italic/underline) and links are preserved. Images are uploaded via the
 * provided async callback and inserted as Lexical upload nodes.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

const FORMAT = { BOLD: 1, ITALIC: 2, STRIKETHROUGH: 4, UNDERLINE: 8, CODE: 16 }

function textNode(text: string, format = 0) {
  return { type: 'text', version: 1, text, detail: 0, format, mode: 'normal', style: '' }
}

function inlineChildren(ricosNodes: any[] = []): any[] {
  const out: any[] = []
  for (const n of ricosNodes) {
    if (n.type !== 'TEXT') continue
    const text: string = n.textData?.text ?? ''
    if (!text) continue
    const decos: any[] = n.textData?.decorations ?? []
    let format = 0
    let link: string | undefined
    for (const d of decos) {
      if (d.type === 'BOLD') format |= FORMAT.BOLD
      else if (d.type === 'ITALIC') format |= FORMAT.ITALIC
      else if (d.type === 'UNDERLINE') format |= FORMAT.UNDERLINE
      else if (d.type === 'LINK') link = d.linkData?.link?.url
    }
    const tn = textNode(text, format)
    if (link) {
      out.push({
        type: 'link',
        version: 3,
        fields: { linkType: 'custom', url: link, newTab: true },
        direction: 'ltr',
        format: '',
        indent: 0,
        children: [tn],
      })
    } else {
      out.push(tn)
    }
  }
  return out
}

const paragraph = (children: any[]) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  children: children.length ? children : [],
})

const headingTag = (level?: number) => (!level || level <= 2 ? 'h2' : 'h3')

export type UploadImage = (wixMediaId: string, alt: string) => Promise<number | undefined>

export async function ricosToLexical(
  richContent: any,
  uploadImage: UploadImage,
): Promise<any> {
  const children: any[] = []
  const nodes: any[] = richContent?.nodes ?? []

  for (const node of nodes) {
    switch (node.type) {
      case 'PARAGRAPH':
        children.push(paragraph(inlineChildren(node.nodes)))
        break

      case 'HEADING':
        children.push({
          type: 'heading',
          tag: headingTag(node.headingData?.level),
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          children: inlineChildren(node.nodes),
        })
        break

      case 'BULLETED_LIST':
      case 'ORDERED_LIST': {
        const ordered = node.type === 'ORDERED_LIST'
        const items = (node.nodes ?? []).map((li: any, i: number) => {
          // Flatten the list item's paragraphs into inline children.
          const inline: any[] = []
          for (const child of li.nodes ?? []) {
            if (child.type === 'PARAGRAPH') inline.push(...inlineChildren(child.nodes))
          }
          return {
            type: 'listitem',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            value: i + 1,
            children: inline.length ? inline : [textNode('')],
          }
        })
        children.push({
          type: 'list',
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          listType: ordered ? 'number' : 'bullet',
          tag: ordered ? 'ol' : 'ul',
          start: 1,
          children: items,
        })
        break
      }

      case 'BLOCKQUOTE': {
        const inline: any[] = []
        for (const child of node.nodes ?? []) {
          if (child.type === 'PARAGRAPH') inline.push(...inlineChildren(child.nodes))
        }
        children.push({
          type: 'quote',
          version: 1,
          direction: 'ltr',
          format: '',
          indent: 0,
          children: inline.length ? inline : [textNode('')],
        })
        break
      }

      case 'IMAGE': {
        const wixId = node.imageData?.image?.src?.id
        if (wixId) {
          const mediaId = await uploadImage(wixId, '')
          if (mediaId) {
            children.push({
              type: 'upload',
              version: 3,
              relationTo: 'media',
              value: mediaId,
              fields: null,
              format: '',
            })
          }
        }
        break
      }

      default:
        // Unknown node — try to salvage any inline text.
        if (Array.isArray(node.nodes)) {
          const inline = inlineChildren(node.nodes)
          if (inline.length) children.push(paragraph(inline))
        }
    }
  }

  return { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }
}
