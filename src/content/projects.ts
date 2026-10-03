/**
 * Projects/Partners page content — verbatim from the live lpnfoundation.org
 * site (checked 2026-09-30): funder entries with taglines + grant years, and
 * the Extended LPN Network descriptions.
 */

export type Partner = { name: string; tagline: string; years?: string; body: string }

export type ProjectsCopy = {
  funders: { title: string; intro: string; items: Partner[] }
  network: { title: string; intro: string; items: Partner[] }
  cta: { heading: string; body: string; cta: string }
}

export const projectsTh: ProjectsCopy = {
  funders: {
    title: 'ผู้ให้ทุน ผู้สนับสนุน และผู้ลงุทนร่วมกับ LPN',
    intro:
      'LPN คือองค์กรที่เชี่ยวชาญในการทำงานแนวหน้าทั้งเรื่องการสืบค้นหาความจริงและการป้องกันค้ามนุษย์ เราต้องขอขอบคุณผู้สนับสนุนการทำงานของเราจากหลายภาคส่วนทั้งผู้ให้ทุน ผู้ลงทุน และเครือข่ายของพันธมิตรที่ร่วมสนับสนุนการทำงานในภาคสนามของเรา และด้วยการสนับสนุนของพวกเขาทำให้เราสามารถพัฒนาชีวิตของแรงงานข้ามชาติหลายพันคนที่อยู่ในภาวะเสี่ยงอันตรายให้มีชีวิตที่ปลอดภัย นอกเหนือจากนั้นยังสนับสนุนแรงงานข้ามชาติทั้งในด้านกฎหมายและด้านสิทธิ รวมไปถึงลงโทษผู้ที่ทำร้ายและเอาเปรียบแรงงาน โดยรายละเอียดของผู้สนับสนุนการทำงานของเราสามารถหาอ่านได้ด้านล่างและแม้จะมีบางส่วนที่ไม่ประสงค์จะออกนาม อย่างไรก็ตามพวกเราก็ต้องขอขอบคุณเป็นอย่างมากสำหรับการสนับสนุนนี้',
    items: [
      {
        name: 'กระทรวงการต่างประเทศสหรัฐฯ - JTIP',
        tagline: 'ปราบปรามการค้ามนุษย์และช่วยเหลือเยื่อการค้ามนุษย์',
        years: '2016 - 2019',
        body: 'กระทรวงการต่างประเทศสหรัฐอเมริกาได้ออกรายงานสถานการณ์การค้ามนุษย์ (Trafficking in Persons Report: TIP Report) ประจำปี ซึ่งรายงงานนี้เป็นรวบรวมและประเมินการทำงานด้านการป้องกันและปราบปรามการค้ามนุษย์ของรัฐบาล โดยรายงานนี้ยังได้ถูกนำไปใช้เป็นหลักการในการปฏิบัติการที่รัฐบาลสหรัฐใช้ในการสัมพันธ์กับรัฐบาลต่างประเทศในเรื่องการค้ามนุษย์ โดยในการจัดทำรายงานนี้นี้กระทรวงการต่างประเทศสหรัฐอเมริกาได้พึ่งพาข้อมูลจากภาคประชาสังคมและผู้ที่ทำงานเพื่อปกป้องสิทธิมนุษยชนในประเทศต้นทาง อย่างเช่นในรายงานปี 2017 กว่า 4 ใน 6 กรณีการละเมิดสิทธิมนุษยชนที่อยู่ในรายงงานถูกส่งต่อไปยังรัฐบาลผ่าน LPN',
      },
      {
        name: 'Plan International',
        tagline: 'หยุดการแสวงหาผลประโยชน์ผ่านบริการที่เข้าถึงได้',
        years: '2015 - 2018',
        body: 'องค์กรแพลน อินเตอร์เนชั่นแนล คือองค์กรพัฒนาเอกชนและช่วยเหลือด้านมนุษยธรรมที่ทำงานสนับสนุนสิทธิเด็กและความเท่าเทียมสำหรับเด็กผู้หญิง องค์กรแพลนทำงานเพื่อที่จะพยายามสร้างโลกที่เป็นธรรมโดยเป็นการทำงานร่วมกับเด็กและเยาวชนเพื่อส่งเสริมอิสรภาพ การเข้าถึงการศึกษาอย่างเท่าเทียมสำหรับเด็กทุกคนตั้งแต่ระดับเริ่มต้นถึงระดับมัธยมในกว่า 75 ประเทศ โดย PLAN ได้ทำงานร่วมกับ LPN ในการช่วยเหลือชุมชนชายขอบในการเข้าถึงการศึกษาสำหรับลูกหลานของพวกเขา',
      },
      {
        name: 'กองทุนเสรีภาพ',
        tagline: 'โครงการฮอตสปอตประเทศไทย',
        years: '2015 - 2018',
        body: 'The Freedom Fund คือองค์กรที่โดนเด่นในระดับโลกที่ทำงานเพื่อหยุดระบบทาสในยุคสมัยใหม่ การทำงานของพวกเขาได้รวมไปถึงความพยายามในการระบุต้นตอและลงทุนในการทำงานด่านหน้าเพื่อกำจัดระบบทาสในสมัยใหม่ที่อยู่ในภาคส่วนและประเทศต่าง ๆ และด้วยการทำงานกับกลุ่มนักลงทุนที่มีวิสัยทัศน์ รัฐบาล และองค์กรที่ทำงานเพื่อต่อต้านระบบทาสและรวมไปถึงกลุ่มที่เสี่ยงต่อการถูกขูดรีด งานที่ทำจึงเป็นการจัดการกับระบบหรือโครงสร้างที่ทำให้เกิดระบบทาสนี้ ในประเทศไทย Freedom Fund ได้ทำงานร่วมกับ LPN ในการปกป้องกลุ่มเสี่ยงที่จะถูกเอาเปรียบและเข้าสู่ขบวนการค้ามนุษย์ โดยทำงานกับกลุ่มประชากรที่เข้าถึงได้ยาก และช่วยเหลือให้แรงงานทาสได้เป็นอิสระ ฟื้นฟูสภาพจิตใจ ให้ที่พักพิง',
      },
      {
        name: 'GVC Italy',
        tagline: 'MIG-RIGHTS : รณรงค์และสนับสนุนสิทธิของแรงงานข้ามชาติสัญชาติกัมพูชาในประเทศไทย',
        years: '2017 - 2020',
        body: 'WeWorld-GVC คือองค์กรอิสระจากประเทศอิตาลีที่เกิดจากการรวมตัวกันของกว่า 30 ประเทศเพื่อสนับสนุนเรื่องสิทธิมนุษยชน โดยองค์กรได้ทำงานร่วมกับกลุ่มเด็ก ผู้หญิง และเยาวชน ในฐานะผู้สร้างความเปลี่ยนแปลงของแต่ละชุมชน โดยการทำงานขององค์กรสามารถแบ่งออกได้เป็น 1) การแทรกแซงสนับสนุนด้านสิทธิมนุษยชน อย่างเช่นความเท่าเทียมทางเพศ ป้องกันความรุนแรงต่อผู้หญิง เด็ก และแรงงานข้ามชาติ 2) การช่วยเหลือด้านมนุษยชน ทั้งในด้านการป้องกันและการเสริมสร้าง 3)ด้านความมั่นคงทางอาหาร 4)การเข้าถึงน้ำและความความสะอาด 5)เรื่องสุขภาพ 6)การศึกษาและการเรียนรู้ 7)การพัฒนาด้านเศรษฐกิจและสังคม 8) การปกป้องสิ่งแวดล้อม 9)การเป็นผลเมืองโลกและอาสาสมัครในระดับนานาชาติ',
      },
      {
        name: 'Safe Child Thailand',
        tagline: 'ให้ความปลอดภัยและการเข้าถึงการศึกษาของเด็กที่อยู่ในกลุ่มเสี่ยง',
        years: '2017 - 2018',
        body: 'Safe Child Thailand คือองค์กรที่มีเป้าหมายเพื่อช่วยเหลือและปกป้องเด็กที่อยู่ในกลุ่มเสี่ยงที่อาศัยอยู่ในประเทศไทย โดยการเสริมสร้างและสนับสนุนให้พวกเขาพัฒนาตามศักยภาพสูงสุดของพวกเขา Safe Child Thailand ได้เข้ามาทำงานร่วมกับ LPN เพื่อต้องการช่วยเหลือและเด็ก ๆ และเยาวชนที่อาศัยอยู่ในประเทศไทยสามารถเข้าถึงการศึกษาที่มีคุณภาพ อาหารและที่พักที่เพียงพอ และได้มีชีวิตที่ปลอดภัยจากการดูถูกและขูดรีด โดยงานส่วนนี้ LPN ได้พัฒนาโครงการขึ้นมาเพื่อช่วยเหลือและให้ที่พักพิงกับเยาวชนที่ถูกทำร้ายจากครอบครัวทั้งทางเพศและทางกายภาพนอกเหนือจากการช่วยเหลือแล้วยังได้สนับสนุนให้เข้าถึงการศึกษากับชุมชนแรงงานข้ามชาติอีกด้วย',
      },
      {
        name: 'Ashoka Foundation (มูลนิธิอโศกฯ)',
        tagline: 'การคุ้มครองและการศึกษาสำหรับเด็กข้ามชาติและแรงงานเด็ก',
        years: '2016 -2017',
        body: 'Ashoka Foundation ได้สร้างและรวบรวมผู้นำจากหลากหลายชุมชนผู้ที่ต้องการจะสร้างให้ทุก ๆ เป็นผู้ที่สามารถสร้างความเปลี่ยนแปลงได้ ด้วยการทำงานร่วมกัน Ashoka Foundation ได้ทำงานเพื่อเปลี่ยนแปลงองค์กรและวัฒนะรรมทั่วโลกเพื่อให้เกิดการเปลี่ยนแปลงสังคมไปในทางที่ดีขึ้น โดยองค์กร Ashoka ได้สนับสนุนการทำงานของผู้นำที่สามารถเปลี่ยนแปลงกลุ่มคนที่เคยถูกเอาเปรียบหรือเหยื่อให้สามารถกลายเป็นผู้ปฏิบัติงานและรณรงค์เพื่อสนับสนุนผู้อื่นต่อได้อย่างในกรณีของ LPN ที่สามารถเปลี่ยนอดีตลูกเรือประมงที่ถูกค้ามนุษย์ให้กลายมาเป็นนักกิจกรรมที่ทำงานเพื่อรณรงค์ต่อต้านการค้ามนุษย์ได้',
      },
      {
        name: 'Embassy of Japan (สถานทูตญี่ปุ่น)',
        tagline: 'สร้างความสัมพันธ์ที่ดีระหว่างประเทศไทยและประเทศญี่ปุ่น',
        years: '2017 -2018',
        body: 'สถานฑูตประเทศญี่ปุ่นได้พยามอย่างเต็มที่ในการสนับสนุนความร่วมมือกันทั้งในด้านการเมือง ความมั่นคง เศรษฐกิจและในด้านการต่างประเทศ และมีส่วนสนับสนุนในการพัฒนาภูมิภาคทั้งหมดนี้ผ่านการกระชับความสัมพันธ์ฉันมิตรระหว่างญี่ปุ่นและไทย และระหว่างญี่ปุ่นและอาเซียน',
      },
    ],
  },
  network: {
    title: 'การขยายเครือข่ายการทำงานของ LPN',
    intro:
      'LPN เชื่อว่ากลุ่มแรงงานข้ามชาติสามารถเปลี่ยนจากกลุ่มที่เปราะบางไปสู่กลุ่มที่แข็งแรงได้ผ่านการสร้างเครือข่าย แบ่งปันข้อมูล ช่วยเหลือกันและกัน และทำงานเป็นหนึ่งเดียวกัน โดยจากประสบการณ์การทำงานที่ผ่านมาเราได้เห็นพลังการเปลี่ยนแปลงที่เกิดจากการสร้างชุมชนที่แข็งแรง และได้ช่วยให้เกิดการสร้างและรวมตัวกันขององค์กรอื่น ๆ ต่อไป โดยด้านล่างนี้จะเป็นเครือข่ายที่เกิดจากการทำงานหรือร่วมสร้างของ LPN',
    items: [
      {
        name: 'กลุ่มสหภาพแรงงานประมงไทยและแรงงานข้ามชาติ',
        tagline: 'สิทธิของแรงงานประมงและการสร้างเครือข่ายที่คอยสนับสนุน',
        body: 'กลุ่มลูกเรือประมง (FLG) หรือในชื่อเดิมคือ กลุ่มสหภาพลูกเรือประมงไทยและข้ามชาติ (TMFG) คือกลุ่มของเหยื่อและอดีตลูกเรือประมงที่เคยตกเป็นทาสทำงานบนเรือประมงในทะเล โดยกลุ่มนี้ถือได้ว่าเป็นกลุ่มแรก ๆ ในประเทศไทยที่ได้รวมเอาแรงงานประมงไทยและต่างประเทศเข้าด้วยกันเพื่อที่จะสร้างชุมชนที่พวกเขาไว้ใจในการแบ่งปันประสบการณ์และเรื่องราวของพวกเขา โดยเรื่องราวของพวกเขาได้ถูกนำเอามาใช้เป็นหลักฐานสำคัญในการสนับสนุนและสร้างปฏิบัตการช่วยเหลือลูกเรือประมง รวมไปถึงการสร้างนโนยบายที่เหมาะสมเพื่อควบคุมอุสาหกรรมประมง พัฒนาสภาพการทำงาน โดยกลุ่มนี้ยังได้กลายเป็นเครื่องมือสำคัญการในการสนับสนุนกลุ่มลูกเรือประมงที่เคยถูกหลอกไปทำงานบนเรือโดยไดให้โอกาสพวกเขาในการกลายเป็นผู้ให้ความช่วยเหลือส่งจะเสริมสร้างความภาคภุมิใจและความเชื่อมั่นในตัวเองหลังจากที่เคยเสียไปตอนที่ถูกหลอกไปเป็นเหยื่อของการค้ามนุษย์ LPN ได้พยายามอย่างหนักในการทำงานเพื่อเปลี่ยนกลุ่มที่ไม่เป็นทางการนี้ให้เป็นองค์กรแรงงานอย่างเป็นทางการด้วยเชื่อว่าจะสามารถเป็นเครื่องมือที่สำคัญในการสนับสนุนแรงงานประมงเอง และพัฒนาอนาคตของแรงงานประมงในประเทศไทย',
      },
      {
        name: 'MAST',
        tagline: 'เปลี่ยนแปลงห่วงโซ่อุปทานและทำงานร่วมกับแรงงานประมง',
        body: 'MAST (Multi-stakeholder Initiative for Accountable Supply Chain of Thai Fisheries) ก่อตั้งขึ้นในเดือนมีนาคม 2559 ที่กรุงวอชิงตัน ดี.ซี. โดย LPN และ TLCS กลุ่มผู้สนับสนุนทางกฎหมายในกรุงเทพฯ พร้อมด้วยพันธมิตรในสหรัฐอเมริกา MAST เป็นความคิดริเริ่มที่มีความทะเยอทะยานในการแก้ไขปัญหาที่ต้นเหตุของการค้ามนุษย์และการประมง IUU ในภาคการประมงในเอเชียตะวันออกเฉียงใต้ด้วยแนวทางที่สร้างสรรค์ MAST มีเป้าหมายระยะใกล้คือการจัดตั้งศูนย์ชาวประมงที่ท่าเรือหลักเพื่อให้ที่พักพิง อาหาร และการปฐมพยาบาล การสื่อสารกับครอบครัว คำแนะนำทางกฎหมาย และกลไกการร้องทุกข์แก่ชาวประมง คลินิกกฎหมายที่เชี่ยวชาญกรณีการทารุณกรรมชาวประมง และการเสริมสร้างความตระหนักรู้ของสาธารณชนเกี่ยวกับสภาพความเป็นอยู่ของแรงงานข้ามชาติ และในระยะยาว MAST จะเรียกร้องให้มีการปรับปรุงกฎระเบียบของรัฐบาลและการตรวจสอบเรือประมงทุกขนาด และนำเทคโนโลยีการติดตามและการตรวจสอบบนเรือที่ดีขึ้นมาใช้ (ระบบข้อมูล Pelagic) ซึ่งสามารถตรวจจับกิจกรรมที่น่าสงสัยบนเรือประมงได้',
      },
    ],
  },
  cta: {
    heading: 'ร่วมเป็นพันธมิตรกับเรา',
    body: 'ถ้าองค์กรของคุณมีเป้าหมายที่ต้องการจะกำจัดความไม่เท่าเทียม การขูดรีดเอาเปรียบแรงงานแล้ว และต้องการที่จะสนับสนุนด้านสิทธิมนุษยชนทั่วโลกแล้ว เราอยากจะชวนคุณมาร่วมเป็นพันธมิตรกับเรา สามารถติดต่อเราได้เลยทันทีและพูดคุยเพื่อหาทางออก และสร้างเป้าหมายร่วมกัน',
    cta: 'ร่วมสร้างความแตกต่าง',
  },
}

export const projectsEn: ProjectsCopy = {
  funders: {
    title: 'Funders, Grantors & Investors in LPN',
    intro:
      'LPN is an expert frontline organisation for investigating and preventing human rights abuse at land or at sea. We are grateful for the generous support we receive from our grantors, investors and network of partners that rely on on-the-ground partners to help fulfill their mission and goals. With their support, we are transforming the lives of thousands of at-risk migrants by making migration safer, empowering them with legal support and rights advocacy, and helping to bring human rights abusers to justice. More information about our key donors can be found below. Some donors choose to support our work anonymously and are not featured on this page, but nevertheless have our deep gratitude.',
    items: [
      {
        name: 'U.S. State Department - JTIP',
        tagline: 'Anti-trafficking and victim assistance',
        years: '2016 - 2019',
        body: 'The United States Department of State issues an annual Trafficking in Persons (TIP) Report, which is the world’s most comprehensive resource of governmental anti-trafficking efforts. This report is the U.S. Government’s principal diplomatic tool to engage foreign governments on human trafficking. To conduct its thorough research, the US State Department relies on local activists and frontline defenders of human rights issues like LPN. In 2017, 4 out of the 6 cases alluded to in the US TIP Report were referred to the government by LPN.',
      },
      {
        name: 'Plan International',
        tagline: 'Stopping Exploitation through Accessible services',
        years: '2015 - 2018',
        body: 'Plan International is an independent development and humanitarian organisation that advances children’s rights and equality for girls. They work towards a just world, working together with children and young people to promote free, equal access to quality education for all children - from early learning to secondary education - in over 75 countries. Plan works with organizations like LPN to help marginalized migrant communities have access to safe and high quality education for their children.',
      },
      {
        name: 'The Freedom Fund',
        tagline: 'Thailand Hotspot Project',
        years: '2015 - 2018',
        body: 'The Freedom Fund is a leader in the global movement to end modern slavery. They identify and invest in the most effective frontline efforts to eradicate modern slavery in the countries and sectors where it is most prevalent. Partnering with visionary investors, governments, anti-slavery organisations and those at risk of exploitation, they tackle the systems that allow slavery to persist and thrive. Freedom Fund works with organizations like LPN to protect vulnerable populations and communities, serve hard-to-reach populations, liberate and reintegrate victims of slavery, and provide post-rescue shelter, trauma care and social services.',
      },
      {
        name: 'GVC Italy',
        tagline: 'MIG-RIGHTS: Supporting & Advocating for Cambodian Migrants’ Rights in Thailand',
        years: '2017 - 2020',
        body: 'WeWorld-GVC is an Italian independent organisation formed to strengthen human rights in nearly 30 countries. Children, women and youth, actors of change in every community, are the protagonists of WeWorld-GVC projects and campaigns in the following fields of intervention: human rights (gender equality, prevention and contrast of violence against women and children, migrations), humanitarian aid (prevention, aid and reconstruction), food security, water and sanitation, health, education and learning, socio-economic development, environmental protection, global citizenship education and international volunteering.',
      },
      {
        name: 'Safe Child Thailand',
        tagline: 'Safety, security and equal access to education for at-risk children',
        years: '2017 - 2018',
        body: 'Safe Child Thailand’s mission is to identify and safeguard at-risk children in Thailand and empower them to reach their fullest potential. They partner with bold Thai organisations like LPN to ensure all Thai children have access to quality education, adequate food and shelter, a life free from discrimination and exploitation. LPN has developed highly effective programs to rescue and shelter children from domestic and sexual abuse, and provide quality education to migrant communities.',
      },
      {
        name: 'Ashoka Foundation',
        tagline: 'Protection & Education for migrant children and child labourers',
        years: '2016 -2017',
        body: 'Ashoka builds and cultivates a community of change leaders who see that the world now requires everyone to be a change-maker. Together, they collaborate to transform institutions and cultures worldwide to support change-making for the good of society. Ashoka is especially interested in outstanding leaders with the potential to transform disadvantaged or rescued victims into advocates for their own and other’s empowerment.',
      },
      {
        name: 'Embassy of Japan',
        tagline: 'Peaceful relations between Thailand and Japan',
        years: '2017 -2018',
        body: 'The Embassy will try its best to continue to promote cooperation in the political, security, economic, and international spheres and indeed contribute to the development of this whole region through the deepening of the amicable relationships between Japan and Thailand and between Japan and ASEAN.',
      },
    ],
  },
  network: {
    title: 'Extended LPN Network',
    intro:
      'LPN believes that migrant populations can transform their vulnerability into a strength by forming networks, sharing information, helping one another and acting collectively. Over the years we have seen the power of community-building, and have mentored and supported the launch of several community-based organizations. These are some of the networks that have spun out of LPN, or have been mentored by LPN’s leadership.',
    items: [
      {
        name: 'Thai & Migrant Fishers Union Group',
        tagline: 'Fishers rights and advocacy network',
        body: 'Formerly known as the Thai & Migrant Fisherman’s Union Group, the Fisherman Labour Group is led and run by rescued victims of slave labor at sea. It is the first organization in Thailand that combines Thai and migrant fishermen into a trusted community where they can share their experiences and stories. These stories form powerful evidence to help advocate for just operations, better fishing policies, and humane working conditions. The group is also an important tool for empowerment as it provides returned fishermen with the opportunity to conduct their own operations and regain the sense of autonomy and agency they lost as trafficking victims. We are currently working to turn this informal group into a formally registered worker union, with the power to advocate on behalf of former, existing and future fishermen in Thailand.',
      },
      {
        name: 'MAST',
        tagline: 'Supply chain innovation & in-port fishermen services',
        body: 'The MAST (Multi-stakeholder Initiative for Accountable Supply Chain of Thai Fisheries) was established in March 2016 at Washington DC by LPN and Bangkok legal advocacy group TLCS, along with partners in the US. MAST is an ambitious initiative to address the root cause of human trafficking and IUU fishing in the Southeast Asia fishing sector with a constructive approach. MAST’s immediate goals include the establishment of fishermen drop in centers at major ports to provide shelter, food, and first aid, communication with families, legal advice and grievance mechanisms to fishermen; a legal clinic specializing in cases of fishermen abuse, and the strengthening of public awareness of migrant workers’ living conditions. In the long term, MAST will demand improvements to government regulation and monitoring of fishing vessels of all sizes and pursue the adoption of better vessel monitoring technology (Pelagic data systems) which can detect suspicious activity on fishing vessels.',
      },
    ],
  },
  cta: {
    heading: 'Partner with us',
    body: 'If your organization’s mission is to eradicate inequality and exploitation, and to promote human rights around the world, we would love to speak with you. Contact us today about how we might achieve our collective missions together.',
    cta: 'Make a difference',
  },
}
