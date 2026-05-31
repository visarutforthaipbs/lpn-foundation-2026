/**
 * Seed baseline content: admin user, blog categories, site globals (header/footer
 * with real LPN contact + bank details), and the core pages so nav links resolve.
 *
 *   pnpm seed
 *
 * Idempotent: categories matched by slug, pages by slug, globals overwritten.
 * Content is seeded in English; Thai falls back to English until translated in the admin.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { lexical, para, heading, bulletList } from './lexical'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@lpnfoundation.org'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'changeme123!'

type SeedPage = {
  slug: string
  title: string
  layout: unknown[]
  meta?: {
    title?: string
    description?: string
  }
}

async function upsertPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  locale: 'en' | 'th',
  page: SeedPage,
) {
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: page.slug } },
    limit: 1,
    locale,
  })

  const data = {
    title: page.title,
    slug: page.slug,
    layout: page.layout as never,
    meta: page.meta,
    _status: 'published' as const,
  }

  if (found.docs[0]) {
    await payload.update({ collection: 'pages', id: found.docs[0].id, locale, data })
    payload.logger.info(`page updated (${locale}): ${page.slug}`)
  } else {
    await payload.create({ collection: 'pages', locale, data })
    payload.logger.info(`page created (${locale}): ${page.slug}`)
  }
}

/**
 * Recursively copy `id` fields from a saved doc node onto a target node by
 * position. Payload aligns *localized* values inside blocks/arrays by their row
 * `id`; without this, updating a second locale regenerates rows and wipes the
 * first locale's content. Covers blocks AND nested arrays (e.g. stats items).
 */
function copyIds(source: any, target: any): void {
  if (Array.isArray(source) && Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) copyIds(source[i], target[i])
  } else if (source && typeof source === 'object' && target && typeof target === 'object') {
    if (source.id !== undefined) target.id = source.id
    for (const k of Object.keys(target)) copyIds(source[k], target[k])
  }
}

/** Seed a page in BOTH locales on one document, preserving localized block content. */
async function seedBilingualPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  en: SeedPage,
  th?: SeedPage,
) {
  const found = await payload.find({ collection: 'pages', where: { slug: { equals: en.slug } }, limit: 1 })
  const enData = {
    title: en.title,
    slug: en.slug,
    layout: en.layout as never,
    meta: en.meta,
    _status: 'published' as const,
  }

  let id: number | string
  if (found.docs[0]) {
    id = found.docs[0].id
    await payload.update({ collection: 'pages', id, locale: 'en', data: enData })
  } else {
    id = (await payload.create({ collection: 'pages', locale: 'en', data: enData })).id
  }
  payload.logger.info(`page (en): ${en.slug}`)

  if (!th) return
  // Read back the saved EN doc so we know the generated block/array ids, then
  // stamp them onto the TH layout so TH attaches to the same rows.
  const saved = await payload.findByID({ collection: 'pages', id, locale: 'en' })
  const thLayout = JSON.parse(JSON.stringify(th.layout))
  copyIds(saved.layout, thLayout)
  await payload.update({
    collection: 'pages',
    id,
    locale: 'th',
    data: { title: th.title, slug: en.slug, layout: thLayout as never, meta: th.meta },
  })
  payload.logger.info(`page (th): ${th.slug}`)
}

async function upsertTeamMember(
  payload: Awaited<ReturnType<typeof getPayload>>,
  member: {
    name: string
    roleEn: string
    roleTh: string
    bioEn: string[]
    bioTh: string[]
    order: number
  },
) {
  const found = await payload.find({
    collection: 'teamMembers',
    where: { name: { equals: member.name } },
    limit: 1,
  })

  const enData = {
    name: member.name,
    role: member.roleEn,
    bio: lexical(member.bioEn.map((line) => para(line))),
    order: member.order,
  }

  if (found.docs[0]) {
    await payload.update({
      collection: 'teamMembers',
      id: found.docs[0].id,
      locale: 'en',
      data: enData,
    })
  } else {
    await payload.create({ collection: 'teamMembers', locale: 'en', data: enData })
  }

  const ref = await payload.find({
    collection: 'teamMembers',
    where: { name: { equals: member.name } },
    limit: 1,
  })

  if (ref.docs[0]) {
    await payload.update({
      collection: 'teamMembers',
      id: ref.docs[0].id,
      locale: 'th',
      data: {
        name: member.name,
        role: member.roleTh,
        bio: lexical(member.bioTh.map((line) => para(line))),
        order: member.order,
      },
    })
  }
}

async function main() {
  const payload = await getPayload({ config: await config })

  // 1. Admin user
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    payload.logger.info(`Created admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD} (change this!)`)
  }

  // 2. Categories
  const categories = [
    { title: "What's New", slug: 'whats-new' },
    { title: 'Press', slug: 'press' },
    { title: 'Publications', slug: 'publications' },
  ]
  for (const c of categories) {
    const found = await payload.find({
      collection: 'categories',
      where: { slug: { equals: c.slug } },
      limit: 1,
    })
    if (!found.docs[0]) {
      await payload.create({ collection: 'categories', locale: 'en', data: c })
      payload.logger.info(`category: ${c.slug}`)
    }
  }

  // 3. Header global
  await payload.updateGlobal({
    slug: 'header',
    locale: 'en',
    data: {
      navItems: [
        { label: 'About Us', href: '/about' },
        { label: 'Ghost Fleet', href: '/ghost-fleet' },
        { label: 'Team', href: '/team' },
        { label: 'Services', href: '/services' },
        { label: 'Partners', href: '/projects' },
        { label: 'Blog', href: '/blog' },
        { label: 'News', href: '/news' },
        { label: 'Contact', href: '/contact' },
      ],
      donateLabel: 'Donate',
      donateHref: '/donate',
    },
  })

  await payload.updateGlobal({
    slug: 'header',
    locale: 'th',
    data: {
      navItems: [
        { label: 'เกี่ยวกับเรา', href: '/about' },
        { label: 'Ghost Fleet', href: '/ghost-fleet' },
        { label: 'ทีมงาน', href: '/team' },
        { label: 'บริการ', href: '/services' },
        { label: 'พันธมิตร', href: '/projects' },
        { label: 'บล็อก', href: '/blog' },
        { label: 'ข่าวสาร', href: '/news' },
        { label: 'ติดต่อเรา', href: '/contact' },
      ],
      donateLabel: 'ร่วมบริจาค',
      donateHref: '/donate',
    },
  })

  // 4. Footer global (real contact + bank details from the live site)
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      address: lexical([
        para('Labour Rights Promotion Network Foundation'),
        para('Samut Sakhon, Thailand'),
      ]),
      hotlines: [
        { language: 'Thai', phone: '+66 84 121 1609' },
        { language: 'Khmer', phone: '+66 85 534 1595' },
        { language: 'Lao', phone: '+66 92 321 1516' },
        { language: 'Burmese', phone: '+66 34 434 726' },
      ],
      socials: [{ platform: 'Facebook', url: 'https://www.facebook.com/LPNFoundation' }],
      bankDetails: lexical([
        para('Account Name: Labour Rights Promotion Network'),
        para('Bank: Krungthai Bank PCL, Chamchuri Square branch'),
        para('Account Number: 162-0-09432-0'),
        para('SWIFT: KRTHTHBK'),
      ]),
    },
  })

  // 5. Team members (used by Team Grid block)
  const members = [
    {
      name: 'Patima Tungpuchayakul',
      roleEn: 'Executive Director',
      roleTh: 'ผู้อำนวยการ LPN',
      bioEn: [
        'Patima leads LPN rescue operations and anti-trafficking advocacy across Thailand and Southeast Asia.',
        'Her work to assist fishers trapped in forced labour networks has been recognized internationally.',
      ],
      bioTh: [
        'ปฏิมานำทีม LPN ในการปฏิบัติการช่วยเหลือและการรณรงค์ต่อต้านการค้ามนุษย์ทั้งในไทยและภูมิภาคเอเชียตะวันออกเฉียงใต้',
        'การทำงานช่วยเหลือลูกเรือประมงที่ตกเป็นเหยื่อแรงงานบังคับของเธอได้รับการยอมรับในระดับนานาชาติ',
      ],
      order: 1,
    },
    {
      name: 'Sompong Srakaew',
      roleEn: 'Co-Founder',
      roleTh: 'ผู้ร่วมก่อตั้ง',
      bioEn: [
        'Sompong has worked on migrant worker justice for decades, combining legal advocacy, community organizing, and policy work.',
        'He helps drive structural reforms to improve labour protections in Thailand.',
      ],
      bioTh: [
        'สมพงษ์ทำงานด้านความเป็นธรรมของแรงงานข้ามชาติมาอย่างต่อเนื่อง โดยผสานงานกฎหมาย งานชุมชน และงานนโยบาย',
        'เขามีบทบาทสำคัญในการผลักดันการปฏิรูปเชิงระบบเพื่อยกระดับการคุ้มครองแรงงานในประเทศไทย',
      ],
      order: 2,
    },
    {
      name: 'Samak Thuptanee',
      roleEn: 'Labour Protection Lead',
      roleTh: 'หัวหน้าฝ่ายคุ้มครองแรงงาน',
      bioEn: [
        'Samak supports frontline labour protection and survivor-centered assistance.',
        'He contributes to rescue coordination and long-term worker safeguarding programs.',
      ],
      bioTh: [
        'สมัครทำงานคุ้มครองแรงงานในแนวหน้าและสนับสนุนการช่วยเหลือที่ยึดผู้เสียหายเป็นศูนย์กลาง',
        'เขามีบทบาททั้งการประสานงานช่วยเหลือเร่งด่วนและการสร้างระบบคุ้มครองแรงงานระยะยาว',
      ],
      order: 3,
    },
    {
      name: 'Migrant Youth Network Team',
      roleEn: 'Youth Network',
      roleTh: 'ทีมเยาวชนแรงงานข้ามชาติ',
      bioEn: [
        'LPN youth network members lead peer education on rights, safety, and access to education.',
        'They are key partners in community awareness and prevention efforts.',
      ],
      bioTh: [
        'ทีมเยาวชนของ LPN ทำงานให้ความรู้เพื่อนแรงงานเรื่องสิทธิ ความปลอดภัย และการเข้าถึงการศึกษา',
        'กลุ่มเยาวชนเป็นกำลังสำคัญในการสร้างความตระหนักและงานป้องกันในระดับชุมชน',
      ],
      order: 4,
    },
  ]

  for (const m of members) await upsertTeamMember(payload, m)

  // 6. Core pages (EN)
  const pagesEn: SeedPage[] = [
    {
      slug: 'home',
      title: 'Home',
      meta: {
        title: 'Home',
        description:
          'LPN Foundation works to end human trafficking and forced labour, especially in fisheries and migrant worker communities.',
      },
      layout: [
        {
          blockType: 'hero',
          heading: 'We are modern-day abolitionists, working to end slavery at sea',
          subheading:
            'The Labour Rights Promotion Network (LPN) Foundation has spent more than 15 years protecting migrant workers and rescuing victims of human trafficking and forced labour.',
          ctaLabel: 'Support our work',
          ctaHref: '/donate',
        },
        {
          blockType: 'stats',
          heading: 'The scale of the problem',
          items: [
            {
              value: '7 in 10',
              label: 'fishers in Thai fisheries show indicators of forced labour',
            },
            { value: '15+', label: 'years of frontline protection for migrant workers' },
            {
              value: '4,986',
              label: 'fishers released from slavery with support from our network',
            },
          ],
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('How we create change'),
            para(
              'LPN combines emergency rescue with long-term prevention: assisting survivors, strengthening worker networks, and advocating for policy and supply-chain accountability.',
            ),
            para(
              'From Indonesia rescue operations documented in Ghost Fleet to local legal and community support in Thailand, our work centers dignity, safety, and worker voice.',
            ),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'Help us end modern slavery',
          body: 'Your support funds rescue operations, worker protection networks, and anti-trafficking prevention programmes.',
          ctaLabel: 'Donate now',
          ctaHref: '/donate',
        },
      ],
    },
    {
      slug: 'about',
      title: 'About Us',
      meta: {
        title: 'About Us',
        description:
          'Why LPN focuses on migrant worker rights and anti-trafficking work in Thailand.',
      },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('Who we are and why this work matters'),
            para(
              'LPN was established to improve the lives of migrant workers in Thailand by confronting exploitation, discrimination, and structural inequality.',
            ),
            para(
              'Migrant workers are among the most vulnerable groups to abuse, trafficking, and forced labour. We therefore combine urgent rescue operations with long-term rights education and community-based prevention.',
            ),
            para(
              'Our theory of change links direct survivor assistance, legal support, evidence gathering, and policy advocacy so that immediate protection can lead to durable systemic reform.',
            ),
          ]),
        },
      ],
    },
    {
      slug: 'team',
      title: 'Team',
      meta: {
        title: 'Team',
        description:
          'Meet the LPN team of social workers, activists, and migrant community leaders.',
      },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('Our people'),
            para(
              'LPN is a network of activists, social workers, and former migrant workers fighting to stop human rights abuses.',
            ),
            para('Photo by: Visarut Sankham'),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('“My goal is to save lives”'),
            para('Photo by: JJ Rose, Al Jazeera'),
            para(
              'Patima Tungpuchayakul, Director of LPN, has become one of the leading figures in the fight to end slavery aboard fishing vessels across Southeast Asia. She led LPN’s rescue operations for fishers — work documented in the award-winning film “Ghost Fleet” — and was a 2017 Nobel Peace Prize nominee.',
            ),
            para(
              'Her life as an activist began after she survived cancer at the age of 22, dedicating the rest of her life to fighting for others. Over more than 20 years, Patima has played a central role in raising human-rights awareness and protecting workers of more than 10 nationalities across the region.',
            ),
            para(
              'In 2004, Patima and her husband, Sompong Srakaew, co-founded the Labour Rights Promotion Network. Together they have assisted more than 5,000 Thai and migrant workers, and her determination helped free over 2,000 fishers trafficked to Indonesia in 2014 — an operation whose reporting earned the Associated Press a Pulitzer Prize.',
            ),
            para(
              'Today Patima continues to work to transform labour conditions for workers both on land and at sea.',
            ),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('Our vision'),
            heading('“This work is my life”', 'h3'),
            para(
              'Sompong Srakaew began working with migrant communities after graduating in social work in 1990. He founded LPN in 2004 to seek justice for migrant workers in Thailand, and that same year helped lead a raid that freed 66 Myanmar workers forced to labour in a small shrimp-processing shed. He also campaigned for 99 fishers who had been tortured through confinement and starvation — abuse that left 39 of them dead.',
            ),
            para(
              'His relentless campaigning and evidence work drove direct changes to Thai human-rights law: in 2008 the Anti-Trafficking in Persons Act was amended to increase penalties for traffickers and brokers. He also received the 2008 award for outstanding work promoting and protecting human rights — underscoring his effort to end modern slavery in Thai society.',
            ),
            para(
              'Today Sompong continues advising and shaping policy affecting workers, civil society, and fisheries businesses to improve the rights and quality of life of migrant workers, believing that collaboration is key to lasting success.',
            ),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('Awards & recognition'),
            bulletList([
              '2021 — Winner, Societal Leader Category, ICLIF Leadership Energy Awards',
              '2018 — Jairo Mora Sandoval Award, The Society for Conservation Biology',
              '2018 — Seafood Champion, SeaWeb (A Project of the Ocean Foundation)',
              '2017 — Nominee, Nobel Peace Prize',
              '2016 — Pulitzer Prize feature on her work, “Seafood from Slaves” (AP)',
              '2016 — Honorable Mention, Human Rights Watch Asia',
            ]),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('Our team'),
            heading('Samak Thuptanee', 'h3'),
            para(
              'Samak Thuptanee works with LPN as head of the labour protection unit, playing a major role in rescuing more than 2,000 fishers trafficked to Indonesia. For this work he received the 2019 Human Rights Defender award, given to those with special expertise in preventing human trafficking.',
            ),
            heading('Migrant Youth Network Team', 'h3'),
            para(
              'Beyond our full-time staff, we have a migrant youth network that works with us to campaign on children’s rights, safety, and education for migrant children and youth.',
            ),
          ]),
        },
        { blockType: 'teamGrid', heading: 'LPN Team Members' },
      ],
    },
    {
      slug: 'services',
      title: 'Services',
      meta: {
        title: 'Services',
        description:
          'LPN services: rescue, legal assistance, rights education, and community protection.',
      },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('How we work in practice'),
            para(
              'Our services are built from over 15 years of frontline experience with migrant communities: rescue and victim assistance, legal support, rights communication, and education access.',
            ),
            heading('Rescue and victim protection', 'h3'),
            para(
              'LPN responds to trafficking and severe labour abuse cases through direct assistance, safe shelter coordination, psychosocial support, and legal case support.',
            ),
            heading('Rights communication and advocacy', 'h3'),
            para(
              'We train workers in their own languages on rights, complaint channels, and safe migration while advocating with state and civil-society actors for better protections.',
            ),
            heading('Education for migrant children', 'h3'),
            para(
              'We support learning pathways and access to Thai public education for migrant children to prevent exclusion and intergenerational exploitation.',
            ),
          ]),
        },
      ],
    },
    {
      slug: 'projects',
      title: 'Partners',
      meta: {
        title: 'Partners',
        description:
          'LPN partners, funders, and collaborative initiatives advancing labour rights.',
      },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('Our partners and supporters'),
            para(
              'LPN works with funders, civic groups, worker networks, and international partners to drive anti-trafficking action and improve labour rights in Thailand.',
            ),
            heading('Priority issues we work on', 'h3'),
            para(
              'Human rights and labour rights, trauma recovery and shelter support, anti-trafficking prevention, general and reproductive health, child labour prevention, and education access for migrant communities.',
            ),
            heading('Collaborative initiatives', 'h3'),
            para(
              'Our collaboration includes support from organizations and public stakeholders such as JTIP, Plan International, Freedom Fund, GVC Italy, Safe Child Thailand, Ashoka Foundation, and other partners in civil society and academia.',
            ),
            para(
              'We also support worker-led structures such as the Thai and Migrant Fishers Union Group and MAST to improve accountability in fisheries supply chains.',
            ),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'Partner with us',
          body: 'If your organization is committed to ending exploitation and strengthening labour rights, we would like to collaborate.',
          ctaLabel: 'Contact LPN',
          ctaHref: '/contact',
        },
      ],
    },
    {
      slug: 'ghost-fleet',
      title: 'Ghost Fleet',
      meta: {
        title: 'Ghost Fleet',
        description: 'The documentary following LPN’s rescue of enslaved fishers.',
      },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('Ghost Fleet'),
            para(
              '“Ghost Fleet” is an award-winning documentary that follows LPN activists as they risk their lives to rescue enslaved fishers stranded on remote Indonesian islands.',
            ),
            para(
              'The film brought global attention to forced labour in the seafood supply chain — and to the survivors who reclaimed their freedom and dignity.',
            ),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'Stand with the survivors',
          body: 'Support the rescue and rehabilitation work behind the story.',
          ctaLabel: 'Donate',
          ctaHref: '/donate',
        },
      ],
    },
    {
      slug: 'news',
      title: 'News',
      meta: { title: 'News', description: 'Latest news and updates from LPN Foundation.' },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('News & updates'),
            para(
              'Read the latest announcements, press coverage, and field updates from LPN Foundation on our blog.',
            ),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'Read our latest stories',
          body: 'Articles, press, and publications from our team.',
          ctaLabel: 'Go to the blog',
          ctaHref: '/blog',
        },
      ],
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      meta: {
        title: 'Contact Us',
        description: 'Reach LPN Foundation and our multilingual support hotlines.',
      },
      layout: [
        {
          blockType: 'contactInfo',
          heading: 'Get help now',
          content: lexical([
            para('If you or someone you know needs help, call our multilingual hotlines:'),
            para('Thai: +66 84 121 1609'),
            para('Khmer: +66 85 534 1595'),
            para('Lao: +66 92 321 1516'),
            para('Burmese: +66 34 434 726'),
            para('Office: Labour Rights Promotion Network Foundation, Samut Sakhon, Thailand'),
          ]),
        },
      ],
    },
    {
      slug: 'donate',
      title: 'Donate',
      meta: {
        title: 'Donate',
        description: 'Support LPN Foundation’s work to end human trafficking and forced labour.',
      },
      layout: [
        {
          blockType: 'donationDetails',
          heading: 'Support our work',
          content: lexical([
            para(
              'Your gift funds rescue operations, survivor assistance, and prevention programmes. You can support LPN through a direct bank transfer:',
            ),
            para('Account Name: Labour Rights Promotion Network'),
            para('Bank: Krungthai Bank PCL, Chamchuri Square branch'),
            para('Account Number: 162-0-09432-0'),
            para('SWIFT: KRTHTHBK'),
            para('To sponsor a specific project, please contact us directly.'),
          ]),
        },
      ],
    },
  ]

  // 7. Core pages (TH)
  const pagesTh: SeedPage[] = [
    {
      slug: 'home',
      title: 'หน้าแรก',
      meta: {
        title: 'หน้าแรก',
        description:
          'LPN ทำงานเพื่อยุติการค้ามนุษย์และแรงงานบังคับ โดยเฉพาะในอุตสาหกรรมประมงและชุมชนแรงงานข้ามชาติ',
      },
      layout: [
        {
          blockType: 'hero',
          heading: 'เราคือนักเลิกทาสยุคใหม่ ที่ทำงานเพื่อยุติการค้าทาสในท้องทะเล',
          subheading:
            'มูลนิธิเครือข่ายส่งเสริมสิทธิแรงงาน (LPN) ทำงานมากว่า 15 ปี เพื่อปกป้องแรงงานข้ามชาติและช่วยเหลือผู้เสียหายจากการค้ามนุษย์และแรงงานบังคับ',
          ctaLabel: 'ร่วมสนับสนุนการทำงานของเรา',
          ctaHref: '/donate',
        },
        {
          blockType: 'stats',
          heading: 'ภาพรวมปัญหาที่เราทำงานอยู่',
          items: [
            { value: '7 ใน 10', label: 'แรงงานประมงไทยมีลักษณะของการเป็นแรงงานบังคับ' },
            { value: '15+', label: 'ปีของการทำงานแนวหน้าเพื่อคุ้มครองแรงงานข้ามชาติ' },
            {
              value: '4,986',
              label: 'แรงงานประมงที่หลุดพ้นจากการเป็นทาสบนทะเลผ่านเครือข่ายของเรา',
            },
          ],
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('แนวทางการทำงานของ LPN'),
            para(
              'เราเชื่อมงานช่วยเหลือเร่งด่วนกับการป้องกันระยะยาว ทั้งการช่วยเหลือผู้เสียหาย การสร้างเครือข่ายแรงงาน และการผลักดันนโยบายให้ห่วงโซ่อุปทานโปร่งใส',
            ),
            para(
              'ตั้งแต่ปฏิบัติการช่วยเหลือลูกเรือประมงในอินโดนีเซียที่ถูกบันทึกในสารคดี Ghost Fleet ไปจนถึงงานกฎหมายและงานชุมชนในประเทศไทย เราทำงานโดยยึดศักดิ์ศรีและความปลอดภัยของแรงงานเป็นศูนย์กลาง',
            ),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'ร่วมยุติระบบทาสสมัยใหม่ไปด้วยกัน',
          body: 'การสนับสนุนของคุณช่วยให้เราทำงานช่วยชีวิตแรงงาน สร้างเครือข่ายคุ้มครอง และขยายงานป้องกันการค้ามนุษย์',
          ctaLabel: 'ร่วมบริจาค',
          ctaHref: '/donate',
        },
      ],
    },
    {
      slug: 'about',
      title: 'เกี่ยวกับเรา',
      meta: {
        title: 'เกี่ยวกับเรา',
        description:
          'เหตุผลและแนวทางที่ LPN มุ่งทำงานด้านสิทธิแรงงานข้ามชาติและการต่อต้านการค้ามนุษย์',
      },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('เราเป็นใคร และทำไมเราจึงทำงานนี้'),
            para(
              'มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN) ก่อตั้งขึ้นเพื่อทำให้แรงงานข้ามชาติในประเทศไทยมีชีวิตที่ดีขึ้น ด้วยการเผชิญหน้ากับการเอารัดเอาเปรียบ การเลือกปฏิบัติ และความไม่เท่าเทียมเชิงโครงสร้าง',
            ),
            para(
              'แรงงานข้ามชาติเป็นหนึ่งในกลุ่มที่เปราะบางที่สุดต่อการละเมิดสิทธิ การค้ามนุษย์ และแรงงานบังคับ เราจึงทำงานทั้งการช่วยเหลือเร่งด่วนและการป้องกันระยะยาวควบคู่กัน',
            ),
            para(
              'ทฤษฎีเพื่อการเปลี่ยนแปลงของเราเชื่อมการช่วยเหลือผู้เสียหาย การสนับสนุนทางกฎหมาย การเก็บข้อมูลเชิงประจักษ์ และการผลักดันนโยบาย เพื่อให้การคุ้มครองรายกรณีนำไปสู่การเปลี่ยนแปลงเชิงระบบ',
            ),
          ]),
        },
      ],
    },
    {
      slug: 'team',
      title: 'ทีมงาน',
      meta: {
        title: 'ทีมงาน',
        description: 'ทำความรู้จักทีม LPN ที่ประกอบด้วยนักสังคมสงเคราะห์ นักกิจกรรม และผู้นำแรงงาน',
      },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('ทีมของเรา'),
            para(
              'LPN คือเครือข่ายนักกิจกรรม นักสังคมสงเคราะห์ และอดีตแรงงานข้ามชาติ ที่ต่อสู้เพื่อให้หยุดการละเมิดสิทธิมนุษยชน',
            ),
            para('ภาพโดย: วิศรุต แสนคำ'),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('“เป้าหมายของฉันคือการช่วยชีวิตคน”'),
            para('ภาพโดย: JJ Rose, Al Jazeera'),
            para(
              'นส. ปฏิมา ตั้งปรัชญากูล ผู้อำนวยการ LPN ได้กลายเป็นหนึ่งในผู้นำที่มีบทบาทคนสำคัญในการหยุดระบบแรงงานทาสของแรงงานประมงบนเรือในทะเลของเอเชียตะวันออกเฉียงใต้ เธอคือผู้นำของ LPN ในการปฏิบัติการช่วยเหลือลูกเรือประมงและได้ถูกบันทึกเอาไว้ในภาพยนตร์สารคดีที่ได้รับรางวัลมากมายชื่อ “Ghost Fleet” และเธอยังได้รับการเสนอชื่อในการรับรางวัล Nobel Peace Prize ในปี 2017',
            ),
            para(
              'โดยชีวิตการเป็นนักกิจกรรมของเธอเริ่มต้นขึ้นหลังจากที่เธอรอดชีวิตจากโรคมะเร็งเมื่อตอนอายุ 22 ปี และได้ใช้ชีวิตที่เหลืออยู่ในการต่อสู้เพื่อผู้อื่น จนปัจจุบันเป็นเวลากว่า 20 ปีมาแล้วที่ปฏิมาได้มีส่วนสำคัญในการสร้างความตระหนักรับรู้ในเรื่องสิทธิมนุษยชนและปกป้องแรงงานหลากหลายสัญชาติกว่า 10 ประเทศในภูมิภาค',
            ),
            para(
              'ในปี 2004 ปฏิมาและสามีหรือสมพงษ์ สระแก้ว ได้ร่วมกันก่อตั้งมูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน พวกเขาทั้งสองได้ทำงานช่วยเหลือแรงงานมาแล้วกว่า 5,000 คน ทั้งแรงงานไทยและแรงงานข้ามชาติ และด้วยความตั้งใจและมุ่งมานะในการทำงานทำให้เธอได้ช่วยชีวิตลูกเรือประมงที่ถูกหลอกไปทำงานในประเทศอินโดนีเซียกว่า 2,000 คน ในปี 2014 โดยสำนักข่าว AP ที่ร่วมช่วยเหลือปฏิบัติการนี้ได้รับรางวัล Pulitzer สำหรับการรายงานข่าวนี้',
            ),
            para('ปัจจุบันปฏิมายังคงมุ่งมั่นทำงานเพื่อเปลี่ยนแปลงสภาพการทำงานของแรงงานทั้งบนบกและในทะเล'),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('วิสัยทัศน์ของเรา'),
            heading('“งานนี้คือชีวิตของผม”', 'h3'),
            para(
              'สมพงษ์ สระแก้ว เริ่มการทำงานกับกลุ่มแรงงานข้ามชาติหลังจากเรียนจบจากสาขาสังคมสงเคราะห์ในปี 1990 เขาเริ่มก่อตั้ง LPN ในปี 2004 เพื่อเรียกร้องความยุติธรรมให้กับแรงงานข้ามชาติในประเทศไทย และในปีเดียวกันเขาก็ได้มีส่วนร่วมสำคัญที่ทำให้เกิดการบุกช่วยเหลือแรงงานข้ามชาติที่ถูกบังคับให้ทำงานในล้งหรือโรงงานแปรรูปกุ้งขนาดเล็ก ในการบุกช่วยเหลือครั้งนั้นเขาได้ช่วยให้แรงงานชาวเมียนมากว่า 66 คนให้เป็นอิสระ เขายังได้มีส่วนสำคัญในการช่วยรณรงค์และเรียกร้องให้กลุ่มลูกเรือประมงกว่า 99 คน ที่ถูกทรมานโดยการกักขังและให้อดอาหารส่งผลให้ลูกเรือกว่า 39 คนเสียชีวิต',
            ),
            para(
              'ด้วยการรณรงค์และทำงานด้านข้อมูลอย่างหนักของเขา ได้ส่งผลโดยตรงให้เกิดการเปลี่ยนแปลงกฎหมายในประเทศไทยที่เกี่ยวข้องกับสิทธิมนุษยชน โดยในปี 2008 พระราชบัญญัติป้องกันและปราบปรามการค้ามนุษย์ได้มีการปรับเปลี่ยนและเพิ่มโทษต่อผู้คนที่เกี่ยวข้องหรือนายหน้าในขบวนการค้ามนุษย์ นอกเหนือจากนั้นเขายังได้รับรางวัลบุคคลที่มีผลงานดีเด่นด้านการส่งเสริม ปกป้อง และคุ้มครองสิทธิมนุษยชนประจำปี 2008 ยิ่งเป็นการย้ำถึงความพยายามของเขาในการทำให้ระบบทาสสมัยใหม่หมดไปจากสังคมไทย',
            ),
            para(
              'ในปัจจุบันสมพงษ์ สระแก้ว ยังคงทำงานอย่างต่อเนื่องในการให้คำแนะนำและออกแบบนโยบายที่ส่งผลต่อกลุ่มแรงงาน กลุ่มภาคประชาสังคม และกลุ่มธุรกิจที่ดำเนินงานเกี่ยวกับการประมง ในการที่จะพัฒนาสิทธิและคุณภาพของชีวิตแรงงานข้ามชาติ เขายังเชื่อว่าการทำงานร่วมกันนั้นเป็นหมุดหมายสำคัญที่จะทำให้ประสบผลสำเร็จได้ในระยะยาว',
            ),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('รางวัลที่เคยได้รับ'),
            bulletList([
              '2021 — Winner, Societal Leader Category, ICLIF Leadership Energy Awards',
              '2018 — Jairo Mora Sandoval Award, The Society for Conservation Biology',
              '2018 — Seafood Champion, SeaWeb (A Project of the Ocean Foundation)',
              '2017 — Nominee, Nobel Peace Prize',
              '2016 — Pulitzer Prize feature on her work, “Seafood from Slaves” (AP)',
              '2016 — Honorable Mention, Human Rights Watch Asia',
            ]),
          ]),
        },
        {
          blockType: 'richText',
          content: lexical([
            heading('ทีมงานของเรา'),
            heading('สมัคร ทัพธานี', 'h3'),
            para(
              'สมัคร ทัพธานี ทำงานร่วมกับ LPN ในฐานะหัวหน้าของแผนกคุ้มครองแรงงาน ซึ่งทำให้เขามีส่วนสำคัญอย่างมากในการช่วยชีวิตลูกเรือกว่า 2,000 คนที่ถูกหลอกไปทำงานในประเทศอินโดนีเซีย และจากการทำงานของเขาทำให้ในปี 2019 เขาได้รับรางวัลนักปกป้องสิทธิมนุษยชน ซึ่งเป็นรางวัลที่มอบให้กับผู้ที่มีความเชี่ยวชาญพิเศษในการป้องกันการค้ามนุษย์',
            ),
            heading('ทีมเยาวชนแรงงานข้ามชาติ', 'h3'),
            para(
              'นอกเหนือไปจากพนักงานประจำแล้ว เรายังมีเครือข่ายเยาวชนแรงงานข้ามชาติที่ได้เข้ามาร่วมทำงานกับเราในการรณรงค์เรื่องสิทธิเด็ก ความปลอดภัย และการศึกษาของเด็กและเยาวชนข้ามชาติ',
            ),
          ]),
        },
        { blockType: 'teamGrid', heading: 'สมาชิกทีม LPN' },
      ],
    },
    {
      slug: 'services',
      title: 'บริการ',
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('แนวทางการทำงานของเรา'),
            para(
              'งานของ LPN เกิดจากประสบการณ์ภาคสนามกว่า 15 ปี กับกลุ่มแรงงานข้ามชาติ เราพัฒนางานช่วยเหลือให้ตอบโจทย์จริงของแรงงานอย่างต่อเนื่อง',
            ),
            heading('บุกช่วยเหลือเหยื่อการค้ามนุษย์', 'h3'),
            para(
              'เราช่วยเหลือเหยื่อที่ถูกบังคับใช้แรงงานทั้งบนบกและในทะเล รวมถึงการพักพิง การฟื้นฟูสภาพจิตใจ และการสนับสนุนทางกฎหมาย',
            ),
            heading('สื่อสารและรณรงค์สิทธิแรงงานข้ามชาติ', 'h3'),
            para(
              'เราฝึกอบรมและสื่อสารเรื่องสิทธิแรงงานในภาษาของแรงงาน พร้อมทำงานร่วมกับภาครัฐและภาคประชาสังคมเพื่อผลักดันนโยบาย',
            ),
            heading('ศูนย์การเรียนรู้สำหรับเยาวชนแรงงานข้ามชาติ', 'h3'),
            para(
              'เราเสริมโอกาสทางการศึกษาให้ลูกหลานแรงงานข้ามชาติ เพื่อหยุดวงจรความเปราะบางและลดความเสี่ยงจากการค้ามนุษย์',
            ),
          ]),
        },
      ],
    },
    {
      slug: 'projects',
      title: 'พันธมิตร',
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('พันธมิตรและผู้สนับสนุนของเรา'),
            para(
              'LPN ทำงานร่วมกับผู้ให้ทุน เครือข่ายภาคประชาสังคม และพันธมิตรในประเทศและต่างประเทศ เพื่อขับเคลื่อนงานคุ้มครองสิทธิแรงงานและต่อต้านการค้ามนุษย์',
            ),
            heading('ประเด็นหลักที่เราทำงาน', 'h3'),
            para(
              'สิทธิมนุษยชนและสิทธิแรงงาน การฟื้นฟูสภาพจิตใจและที่พักพิง การป้องกันการค้ามนุษย์ สุขภาพและอนามัยการเจริญพันธุ์ การป้องกันแรงงานเด็ก และการศึกษาของแรงงานข้ามชาติ',
            ),
            heading('เครือข่ายความร่วมมือ', 'h3'),
            para(
              'เราร่วมทำงานกับองค์กรและผู้สนับสนุนหลายภาคส่วน เช่น JTIP, Plan International, Freedom Fund, GVC Italy, Safe Child Thailand, Ashoka Foundation และเครือข่ายวิชาการ/ภาคประชาสังคมอื่น ๆ',
            ),
            para(
              'เรายังสนับสนุนเครือข่ายที่นำโดยแรงงาน เช่น กลุ่มสหภาพแรงงานประมงไทยและแรงงานข้ามชาติ และ MAST เพื่อเปลี่ยนแปลงห่วงโซ่อุปทานประมงให้รับผิดชอบมากขึ้น',
            ),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'ร่วมเป็นพันธมิตรกับเรา',
          body: 'หากองค์กรของคุณต้องการร่วมยุติการขูดรีดแรงงานและขับเคลื่อนสิทธิมนุษยชน เราพร้อมร่วมออกแบบความร่วมมือไปด้วยกัน',
          ctaLabel: 'ติดต่อ LPN',
          ctaHref: '/contact',
        },
      ],
    },
    {
      slug: 'ghost-fleet',
      title: 'Ghost Fleet',
      meta: { title: 'Ghost Fleet', description: 'สารคดีที่ติดตามภารกิจช่วยเหลือลูกเรือประมงของ LPN' },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('Ghost Fleet'),
            para(
              '“Ghost Fleet” คือสารคดีที่ติดตามนักกิจกรรมของ LPN ในภารกิจเสี่ยงชีวิตเพื่อช่วยเหลือลูกเรือประมงที่ตกเป็นทาสบนเกาะห่างไกลในอินโดนีเซีย',
            ),
            para(
              'ภาพยนตร์เรื่องนี้จุดประเด็นเรื่องแรงงานบังคับในห่วงโซ่อุปทานอาหารทะเลให้โลกได้รับรู้ และบอกเล่าเรื่องราวของผู้รอดชีวิตที่ทวงคืนอิสรภาพและศักดิ์ศรีของตน',
            ),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'ร่วมยืนเคียงข้างผู้รอดชีวิต',
          body: 'สนับสนุนงานช่วยเหลือและฟื้นฟูเบื้องหลังเรื่องราวนี้',
          ctaLabel: 'ร่วมบริจาค',
          ctaHref: '/donate',
        },
      ],
    },
    {
      slug: 'news',
      title: 'ข่าวสาร',
      meta: { title: 'ข่าวสาร', description: 'ข่าวสารและความเคลื่อนไหวล่าสุดจาก LPN' },
      layout: [
        {
          blockType: 'richText',
          content: lexical([
            heading('ข่าวสารและความเคลื่อนไหว'),
            para('ติดตามประกาศ ข่าวจากสื่อ และความเคลื่อนไหวภาคสนามล่าสุดของ LPN ได้ที่บล็อกของเรา'),
          ]),
        },
        {
          blockType: 'cta',
          heading: 'อ่านเรื่องราวล่าสุดของเรา',
          body: 'บทความ ข่าว และสิ่งพิมพ์จากทีมงานของเรา',
          ctaLabel: 'ไปที่บล็อก',
          ctaHref: '/blog',
        },
      ],
    },
    {
      slug: 'contact',
      title: 'ติดต่อเรา',
      meta: { title: 'ติดต่อเรา', description: 'ติดต่อ LPN และสายด่วนช่วยเหลือหลายภาษา' },
      layout: [
        {
          blockType: 'contactInfo',
          heading: 'ขอความช่วยเหลือตอนนี้',
          content: lexical([
            para('หากคุณหรือคนที่คุณรู้จักต้องการความช่วยเหลือ โทรสายด่วนหลายภาษาของเรา:'),
            para('ไทย: +66 84 121 1609'),
            para('เขมร: +66 85 534 1595'),
            para('ลาว: +66 92 321 1516'),
            para('พม่า: +66 34 434 726'),
            para('สำนักงาน: มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน จังหวัดสมุทรสาคร'),
          ]),
        },
      ],
    },
    {
      slug: 'donate',
      title: 'ร่วมบริจาค',
      meta: { title: 'ร่วมบริจาค', description: 'ร่วมสนับสนุนงานของ LPN เพื่อยุติการค้ามนุษย์และแรงงานบังคับ' },
      layout: [
        {
          blockType: 'donationDetails',
          heading: 'ร่วมสนับสนุนการทำงานของเรา',
          content: lexical([
            para(
              'การบริจาคของคุณช่วยสนับสนุนงานช่วยเหลือผู้เสียหาย การฟื้นฟู และงานป้องกันการค้ามนุษย์ คุณสามารถบริจาคผ่านการโอนเงินเข้าบัญชีธนาคารได้โดยตรง:',
            ),
            para('ชื่อบัญชี: Labour Rights Promotion Network'),
            para('ธนาคาร: ธนาคารกรุงไทย สาขาจามจุรีสแควร์'),
            para('เลขที่บัญชี: 162-0-09432-0'),
            para('SWIFT: KRTHTHBK'),
            para('หากต้องการสนับสนุนโครงการใดเป็นการเฉพาะ กรุณาติดต่อเราโดยตรง'),
          ]),
        },
      ],
    },
  ]

  // Seed each page in both locales on a single document (preserves localized blocks).
  for (const en of pagesEn) {
    const th = pagesTh.find((p) => p.slug === en.slug)
    await seedBilingualPage(payload, en, th)
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

void main()
