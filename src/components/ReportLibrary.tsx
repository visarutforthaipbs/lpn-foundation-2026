'use client'

import { useState } from 'react'
import type { Report } from '@/payload-types'
import type { Locale } from '@/i18n/routing'

const topics = {
  'cross-cutting': { en: 'Cross-cutting', th: 'หลายประเด็น' },
  rights: { en: 'Worker rights', th: 'สิทธิแรงงาน' },
  health: { en: 'Health', th: 'สุขภาพ' },
  education: { en: 'Education and youth', th: 'การศึกษาและเยาวชน' },
  safety: { en: 'Trafficking and safety', th: 'การค้ามนุษย์และความปลอดภัย' },
  policy: { en: 'Policy and systems', th: 'นโยบายและระบบ' },
}
const kinds = {
  annual: { en: 'Annual report', th: 'รายงานประจำปี' },
  research: { en: 'Field research', th: 'งานวิจัยภาคสนาม' },
  programme: { en: 'Programme report', th: 'รายงานโครงการ' },
}

export function ReportLibrary({ reports, locale }: { reports: Report[]; locale: Locale }) {
  const th = locale === 'th'
  const [year, setYear] = useState('all')
  const [topic, setTopic] = useState('all')
  const [kind, setKind] = useState('all')
  const [language, setLanguage] = useState('all')
  const years = [...new Set(reports.map((report) => String(report.year)))].sort((a, b) => Number(b) - Number(a))
  const visible = reports.filter((report) =>
    (year === 'all' || String(report.year) === year) &&
    (topic === 'all' || report.topic === topic) &&
    (kind === 'all' || report.kind === kind) &&
    (language === 'all' || report.documentLanguage === language),
  )

  return <>
    <div className="mt-9 grid gap-4 border border-black/15 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
      <label className="grid gap-2 text-sm font-bold">{th ? 'ปี' : 'Year'}
        <select value={year} onChange={(event) => setYear(event.target.value)} className="min-h-11 border border-black/30 bg-white px-3 text-black">
          <option value="all">{th ? 'ทุกปี' : 'All years'}</option>
          {years.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold">{th ? 'ประเด็น' : 'Topic'}
        <select value={topic} onChange={(event) => setTopic(event.target.value)} className="min-h-11 border border-black/30 bg-white px-3 text-black">
          <option value="all">{th ? 'ทุกประเด็น' : 'All topics'}</option>
          {Object.entries(topics).map(([key, value]) => <option key={key} value={key}>{value[locale]}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold">{th ? 'ประเภท' : 'Type'}
        <select value={kind} onChange={(event) => setKind(event.target.value)} className="min-h-11 border border-black/30 bg-white px-3 text-black">
          <option value="all">{th ? 'ทุกประเภท' : 'All types'}</option>
          {Object.entries(kinds).map(([key, value]) => <option key={key} value={key}>{value[locale]}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold">{th ? 'ภาษาเอกสาร' : 'Document language'}
        <select value={language} onChange={(event) => setLanguage(event.target.value)} className="min-h-11 border border-black/30 bg-white px-3 text-black">
          <option value="all">{th ? 'ทุกภาษา' : 'All languages'}</option>
          <option value="th">ไทย</option><option value="en">English</option><option value="multilingual">{th ? 'หลายภาษา' : 'Multilingual'}</option>
        </select>
      </label>
    </div>
    <p className="mt-5 text-sm text-black/75" aria-live="polite">{th ? `แสดง ${visible.length} จาก ${reports.length} รายงาน` : `Showing ${visible.length} of ${reports.length} reports`}</p>
    {visible.length ? <div className="mt-5 grid gap-5 md:grid-cols-2">{visible.map((report) => <article key={report.id} className="border-l-4 border-brand-yellow bg-paper p-6">
      <p className="t-label text-black/70">{report.year} · {kinds[report.kind][locale]} · {report.topic ? topics[report.topic]?.[locale] : (th ? 'ไม่ระบุประเด็น' : 'Uncategorised')} · {report.documentLanguage.toUpperCase()}</p>
      <h3 className="t-h3 mt-3">{report.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-black/75">{report.summary}</p>
      {report.method && <p className="mt-3 text-sm leading-relaxed text-black/70"><strong>{th ? 'วิธีการและขอบเขต: ' : 'Method and scope: '}</strong>{report.method}</p>}
      <div className="mt-5 flex flex-wrap gap-5 text-sm font-bold">
        <a href={report.sourceURL} className="link-mark text-black">{th ? 'ดูแหล่งที่มา' : 'View source'} →</a>
        {report.downloadURL && <a href={report.downloadURL} className="link-mark text-black">{th ? 'ดาวน์โหลด' : 'Download'} →</a>}
      </div>
    </article>)}</div> : <p className="mt-6 bg-paper p-6 text-sm text-black/75">{th ? 'ไม่พบรายงานตามตัวกรองนี้' : 'No reports match these filters.'}</p>}
  </>
}
