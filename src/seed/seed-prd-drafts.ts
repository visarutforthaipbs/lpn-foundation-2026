/** Idempotent editorial starting point. These records remain drafts until LPN review. */
import './loadenv'
import { getPayload } from 'payload'
import config from '../payload.config'

const source = 'https://d90624d9-477d-4d0e-8335-c4795fa13a13.usrfiles.com/ugd/d90624_78b68c9d8aff4a41856fc475cd1d5c37.pdf'

const figures = [
  { slug: '2024-assistance-cases', value: '135', en: ['Worker-assistance cases', 'cases', 'Worker-assistance cases reported by LPN in 2024.'], th: ['กรณีช่วยเหลือแรงงาน', 'กรณี', 'จำนวนกรณีช่วยเหลือแรงงานที่ LPN รายงานในปี 2024'] },
  { slug: '2024-people-benefiting', value: '707', en: ['People benefiting', 'people', 'People benefiting from the 135 worker-assistance cases. This is related to the case count and must not be added to it.'], th: ['ผู้ได้รับประโยชน์', 'คน', 'จำนวนคนที่ได้รับประโยชน์จากกรณีช่วยเหลือแรงงาน 135 กรณี ไม่ควรนำมาบวกกับจำนวนกรณี'] },
  { slug: '2024-workers-trained', value: '832', en: ['Workers trained', 'workers', 'Workers reported by LPN as having received training in 2024.'], th: ['แรงงานได้รับการอบรม', 'คน', 'จำนวนแรงงานที่ LPN รายงานว่าเข้าร่วมการอบรมในปี 2024'] },
  { slug: '2024-youth-supported', value: '80', en: ['Young people supported', 'youth', 'Young people in an education and support project reported by LPN for 2024.'], th: ['เยาวชนในโครงการ', 'คน', 'จำนวนเยาวชนในโครงการด้านการศึกษาและการสนับสนุนที่ LPN รายงานในปี 2024'] },
] as const

async function main() {
  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'reports', where: { slug: { equals: 'lpn-annual-report-2024' } }, limit: 1 })
  let reportId = existing.docs[0]?.id
  if (!reportId) {
    const report = await payload.create({
      collection: 'reports', locale: 'en', data: {
        title: 'LPN Annual Report 2024', slug: 'lpn-annual-report-2024',
        kind: 'annual', topic: 'cross-cutting', year: 2024,
        summary: 'LPN’s 2024 programme activity and reported results.',
        method: 'See the original report for programme scope and definitions. Counts of cases and people benefiting are related, not additive.',
        sourceURL: source, downloadURL: source, documentLanguage: 'multilingual', _status: 'draft',
      },
    })
    reportId = report.id
    await payload.update({ collection: 'reports', id: reportId, locale: 'th', data: {
      title: 'รายงานประจำปี LPN 2024',
      summary: 'กิจกรรมและผลการทำงานที่ LPN รายงานในปี 2024',
      method: 'ดูขอบเขตและนิยามของแต่ละโครงการในรายงานต้นฉบับ จำนวนกรณีและจำนวนผู้ได้รับประโยชน์เกี่ยวข้องกัน ไม่ควรนำมาบวกกัน',
    } })
  }
  if (existing.docs[0] && !existing.docs[0].topic) {
    await payload.update({ collection: 'reports', id: reportId!, data: { topic: 'cross-cutting' } })
  }

  for (const [order, figure] of figures.entries()) {
    const found = await payload.find({ collection: 'impact-metrics', where: { and: [{ value: { equals: figure.value } }, { sourceURL: { equals: source } }] }, limit: 1 })
    if (found.docs[0]) continue
    const metric = await payload.create({ collection: 'impact-metrics', locale: 'en', data: {
      label: figure.en[0], value: figure.value, unit: figure.en[1], periodLabel: '2024',
      periodStart: '2024-01-01T00:00:00.000Z', periodEnd: '2024-12-31T23:59:59.000Z',
      definition: figure.en[2], sourceReport: reportId, sourceURL: source,
      order: order + 1, featured: true, _status: 'draft',
    } })
    await payload.update({ collection: 'impact-metrics', id: metric.id, locale: 'th', data: {
      label: figure.th[0], unit: figure.th[1], periodLabel: 'ปี 2024', definition: figure.th[2],
    } })
  }
  payload.logger.info('PRD evidence drafts are ready for LPN review.')
  process.exit(0)
}

void main()
