'use client'

import { useState } from 'react'
import type { Locale } from '@/i18n/routing'

type Project = {
  name: string
  start: number
  end: number
  focus: string
  description: string
}

export function PartnerTimeline({ locale, projects }: { locale: Locale; projects: Project[] }) {
  const [year, setYear] = useState<number | null>(null)
  const isThai = locale === 'th'
  const years = [2015, 2016, 2017, 2018, 2019, 2020]
  const visible = projects.filter((project) => year === null || (project.start <= year && year <= project.end))

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2" aria-label={isThai ? 'กรองโครงการตามปี' : 'Filter projects by year'}>
        <button type="button" aria-pressed={year === null} onClick={() => setYear(null)} className={`tactile-pill min-h-11 px-4 text-sm font-semibold ${year === null ? 'active' : ''}`}>
          {isThai ? 'ทั้งหมด' : 'All years'}
        </button>
        {years.map((item) => (
          <button key={item} type="button" aria-pressed={year === item} onClick={() => setYear(item)} className={`tactile-pill min-h-11 px-4 text-sm font-semibold ${year === item ? 'active' : ''}`}>
            {isThai ? item + 543 : item}
          </button>
        ))}
      </div>

      <p className="mt-5 text-sm text-black/75" aria-live="polite">
        {isThai ? `แสดง ${visible.length} โครงการที่เคยร่วมงาน${year ? ` ในปี ${year + 543}` : ''}` : `Showing ${visible.length} past collaborations${year ? ` active in ${year}` : ''}`}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((project) => (
          <details key={project.name} className="card card-marked group p-6 open:bg-white">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="t-label text-black/70">{isThai ? project.start + 543 : project.start}–{isThai ? project.end + 543 : project.end}</span>
                  <h3 className="t-h3 mt-2">{project.name}</h3>
                  <p className="mt-2 text-sm text-black/70">{project.focus}</p>
                </div>
                <span className="text-xl font-bold text-black/60 group-open:rotate-45" aria-hidden="true">+</span>
              </div>
              <span className="mt-4 inline-block text-xs font-bold underline decoration-brand-yellow decoration-2 underline-offset-4">
                {isThai ? 'อ่านรายละเอียด' : 'Read project details'}
              </span>
            </summary>
            <p className="mt-5 border-t border-black/10 pt-5 text-sm leading-relaxed text-black/75 whitespace-pre-line">{project.description}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
