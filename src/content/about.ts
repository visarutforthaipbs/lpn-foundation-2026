/**
 * About page content — verbatim from the live lpnfoundation.org site
 * (checked 2026-09-30), including the org's rename footnote.
 */

export type AboutCard = { title: string; body: string }

export type AboutCopy = {
  hero: { title: string; credit: string; intro: string; courage: string; footnote: string }
  why: { eyebrow: string; title: string; sub: string; paras: string[]; prey: string; credit: string }
  sale: { title: string; cards: AboutCard[] }
  theory: { eyebrow: string; title: string; sub: string; paras: string[] }
  services: { eyebrow: string; title: string; items: AboutCard[] }
  critical: { title: string; items: string[] }
  donate: { heading: string; body: string; cta: string }
}

export const aboutTh: AboutCopy = {
  hero: {
    title: 'LPN ทำงานทั้งการช่วยเหลือเร่งด่วนและช่วยเหลือระยะยาว',
    credit: 'ภาพโดย: วิศรุต แสนคำ',
    intro:
      'เครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน (LPN) ก่อตั้งขึ้นเพื่อทำให้แรงงานข้ามชาติในประเทศไทยมีชีวิตที่ดีขึ้นโดยพยายามขจัดความไม่เป็นธรรมที่เกิดจากการเลือกปฏิบัติและความไม่เท่าเทียมกัน',
    courage:
      'มีเพียง LPN เท่านั้นที่มีปฏิบัติการช่วยเหลือเร่งด่วน นอกเหนือไปจากการทำงานด้านยุทธศาสตร์เพื่อทำงานกับแรงงานข้ามชาติ ในการต่อต้านและป้องกันการละเมิดสิทธิมนุษยชนในระยะยาว',
    footnote:
      '* เครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน ได้เปลี่ยนชื่อเป็น มูลนิธิเครือข่ายส่งเสริมคุณภาพชีวิตแรงงาน',
  },
  why: {
    eyebrow: 'ทำไมต้องเป็นแรงงานข้ามชาติ?',
    title: 'แรงงานข้ามชาติคือกลุ่มประชากรที่ถูกเอารัดเอาเปรียบมากที่สุดในประเทศไทย',
    sub: '',
    paras: [
      'การละเมิดสิทธิมนุษยชนกับกลุ่มแรงงานข้ามชาติของประเทศไทยมาจากหลายปัจจัยที่หล่อหลอมรวมกันทั้งความยากจน ความต้องการแรงงานราคาถูก สถานการณ์ทางการเมืองที่ไม่มั่นคงและการทุจริตของเจ้าหน้าที่รัฐ สถานการณ์เหล่านี้จึงได้กลายเป็นสาเหตุสำคัญที่ทำให้กลุ่มประชากรอย่างแรงงานข้ามชาติมีความเสี่ยงอย่างมากที่จะถูกเอารัดเอาเปรียบ เพราะว่าปัญหาในเรื่องการเข้าถึงสิทธิ ทั้งในเรื่องการเคลื่อนย้ายอย่างอิสระ การเปลี่ยนนายจ้างได้อย่างอิสระ การเข้าถึงการศึกษา และรวมไปถึงการรวมกลุ่มของแรงงาน',
      'การที่แรงงานข้ามชาติไม่สามารถเข้าถึงสิทธิเหล่านั้นที่พวกเขาพึ่งจะได้ ก็ส่งผลให้พวกเขาตกเป็นกลุ่มเสี่ยงที่จะถูกเอารัดเอาเปรียบจากทางภาครัฐและกลุ่มธุรกิจ',
    ],
    prey: 'โดยขบวนการค้ามนุษย์มักจะหากินกับกลุ่มคนที่อ่อนแอและเปราะบางอยู่แล้วอย่างเช่น กลุ่มเด็กกำพร้า',
    credit: 'ภาพโดย: วิศรุต แสนคำ',
  },
  sale: {
    title: 'มนุษย์ไม่ได้มีไว้เพื่อขาย',
    cards: [
      {
        title: 'ถูกจับมาเพื่อเป็นแรงงานเด็ก',
        body: 'เด็กอายุเพียง 9 ปี ก็ยังถูกจับและสวมบัตรประชาชนปลอมเพื่อให้ทำงานได้ ซึ่งจะทำให้เขาไม่มีทางเลยที่จะได้เจอครอบครัวอีกครั้ง',
      },
      {
        title: 'ถูกบีบบังคับภายใต้ความกลัวที่จะถูกทำร้าย',
        body: 'การทำร้ายร่างกายอย่าง การทุบตี เผา ทำให้อดอาหาร และการใช้ความรุนแรงอย่างการทำร้ายร่างกายคือเครื่องมือในการบังคับแรงงาน',
      },
      {
        title: 'บังคับทำงานชดใช้หนี้',
        body: 'แรงงานบางส่วนติดอยู่ในวงเวียนของการชดใช้หนี้ที่มาจากขบวนการค้ามนุษย์',
      },
      {
        title: 'หลอกและบังคับให้ทำงาน',
        body: 'แรงงานบางคนถูกบังคับให้ทำงาน 20 ชั่วโมงต่อวันตลอดทั้งอาทิตย์โดยไม่มีวันหยุดเป็นเวลาหลายปี โดยที่จ่ายค่าแรงเพียงเล็กน้อยหรือไม่จ่ายเลย',
      },
    ],
  },
  theory: {
    eyebrow: 'ทฤษฎีเพื่อการเปลี่ยนแปลงที่เรานำมาใช้',
    title: 'เราสร้างกลไกเพื่อการช่วยเหลือแบบเร่งด่วนและการป้องกันในระยะยาว',
    sub: '',
    paras: [
      'ในการทำงานของเรานั้น เรามีทั้งการให้ความช่วยเหลือกับแรงงานที่ต้องการความช่วยเหลืออย่างเร่งด่วน อย่างในกรณีของการถูกกักขังหน่วงเหนียว แต่นอกเหนือจากนั้นเรายังได้ทำงานในระยะยาวกับกลุ่มเยาวชนแรงงานเพื่อเป็นการสร้างความรู้ความเข้าใจให้กับเยาวชนถึงสิทธิมนุษยชน เพื่อป้องกันไม่ให้ตกเป็นเหยื่อของการค้ามนุษย์',
      'แม้ว่างานทั้ง 2 ส่วนนี้ของเราจะดูเป็นงานที่แตกต่างกันอย่างสิ้นเชิง แต่ก็ช่วยส่งเสริมกันและกันอย่างเช่นงานช่วยเหลือเร่งด่วนนั้นช่วยให้เราสามารถรวบรวมหลักฐานเพื่อนำไปใช้ในการรณรงค์เพื่อส่งเสริมในด้านสิทธิมนุษยชนให้ดีขึ้น ส่วนในงานระยะยาวของเราที่ทำด้านการป้องกันและเสริมสร้างความเข้าใจให้กับกลุ่มเยาวชนนั้นก็เป็นการสร้างกระบวนการในการเข้าถึงชุมชนของกลุ่มแรงงานเพื่อสร้างเครือข่ายในการทำงาน ดังนั้นงานด้านการศึกษานี้จึงมีส่วนสำคัญอย่างมากในการหยุดวงจรแห่งการเอารัดเอาเปรียบแรงงานข้ามชาติ',
      'ด้วยการทำงานสองส่วนนี้ผสานกันทำให้เป็นเครื่องมือสำคัญในการทำให้ชีวิตของแรงงานข้ามชาติในประเทศไทยดีขึ้น ซึ่งจะช่วยหยุดการเอารัดเอาเปรียบแรงงานข้ามชาติต่อไป',
    ],
  },
  services: {
    eyebrow: 'การทำงานของเรา',
    title: 'เรามุ่งเน้นการทำงานใน 3 ด้าน',
    items: [
      {
        title: 'บุกช่วยเหลือและปกป้องเหยื่อการค้ามนุษย์',
        body: 'ในปัจจุบันยัง LPN ยังคนได้รับการร้องเรียนและร้องขอความช่วยเหลืออยู่บ่อยครั้งจากเหยื่อของการมนุษย์และแรงงานที่ถูกเอารัดเอาเปรียบ งานของเราจึงเป็นการช่วยเหลือเหยื่อให้รอดพ้นจากสถานการณ์อันเลวร้ายนั้น ไม่ว่าจะเป็นการบุกเข้าช่วยเหลือทั้งบนบกและในทะเล หรือการช่วยเหลือเหยื่อในการด้านฟื้นฟูจิตใจหลังถูกทำร้าย อย่างเช่น การให้ที่พักพิง การดูแลด้านจิตใจ และการสนับสนุนด้านกฏหมายเพื่อดำเนินคดีเรียกร้องค่าเสียหายและเอาผิด',
      },
      {
        title: 'ศูนย์เรียนรู้สำหรับลูกหลานแรงงานข้ามชาติ',
        body: 'ลูกหลายแรงงานข้ามชาติมักจะเป็นกลุ่มแรก ๆ ที่ถูกตัดหรือหลุดออกจากระบบการศึกษาไทย ดังนั้นงานที่เราทำนี้จะเป็นความพยายามในการสร้างพื้นที่ให้กับกลุ่มลูกหลานแรงงานข้ามชาติที่จะได้เข้าถึงการศึกษาของรัฐไทย และจะช่วยทำให้พวกเขาสามารถปรับตัวให้เข้ากับประเทศไทยได้',
      },
      {
        title: 'สื่อสารและรณรงค์เกี่ยวกับสิทธิของแรงงานข้ามชาติ',
        body: 'การต่อสู้กับการละเมิดสิทธิของแรงงานข้ามชาติและการค้ามนุษย์ ถือได้ว่ายังต้องฝ่าฟันอีกมาก ดังนั้น LPN จึงได้ทำงานในหลายด้านทั้งการวิจัยเพื่อวิเคราะห์ปัญหาและหางทางออก พัฒนาและสร้างสื่อการเรียนการสอน รณรงค์เพื่อเปลี่ยนแปลงนโยบาย และจัดอบรมและสร้างความเข้าใจในเรื่องสิทธิของแรงงาน',
      },
    ],
  },
  critical: {
    title: 'กว่า 15 ปีของการทำงานในภาคสนาม ทำให้เราไ้ด้เรียนรู้ว่าอะไรคือสิ่งสำคัญในการแก้ปัญหา',
    items: [
      'แก้ปัญหาด้วยยุทธศาสตร์ : ด้วย LPN สามารถเข้าถึงเครือข่ายของนักกิจกรรมและบรรดาผู้นำจำนวนมากจึงสามรถสร้างผลลัพท์ได้',
      'การทำงานในภาคสนามเพื่อช่วยชีวิตผู้คน : พวกเราทำงานในภาคสนามอย่างต่อเนื่องและไม่หยุดหย่อนเพื่อสร้างความเป็นธรรมในสังคม',
      'เครือข่ายด้านข้อมูลที่ทรงพลัง : ด้วยความสัมพันธุ์ที่ไว้เนื้อเชื้อใจกัน พวกเราได้รวบรวมข้อมูลและหลักฐานของการละเมิดสิทธิมนุษยชย',
      'แหล่งข้อมูลจากแรงงานที่เชื่อใจ : รวดเร็ว ข้อมูลเที่ยงตรง และอยู่ในภาษาถิ่นของแรงงานข้ามชาติเอง',
      'บูรณาการผ่านการศึกษา : ภาษาและการศึกษาเป็นสิ่งที่เราให้ความสำคัญ เพื่อที่จะหยุดวงจรความยากจนของแรงงานข้ามชาติ',
    ],
  },
  donate: {
    heading: 'ร่วมบริจาค',
    body: 'ถ้าคุณเห็นว่าเรื่องราวเหล่านี้สำคัญ และอยากมีส่วนร่วมในการเปลี่ยนแปลง สามารถทำได้ผ่านการบริจาคโดยตรงมายัง LPN การสนับสนุนของคุณจะถูกนำไปใช้เพื่อเปลี่ยนแปลงและป้องการตกเป็นเหยื่อการค้ามนุษย์อีก เงินบริจาคทั้งหมดจะถูกนำไปใช้ในการปฏิบัติการช่วยเหลือแรงงาน ป้องกันการค้ามนุษย์ และรณรงค์ด้านสิทธิของแรงงาน',
    cta: 'ร่วมกันเปลี่ยนแปลง',
  },
}

export const aboutEn: AboutCopy = {
  hero: {
    title: 'LPN combines urgent rescues with long term advocacy',
    credit: 'Photo by: Visarut Sankham/Realframe',
    intro:
      'The Labour Protection Network* was formed to improve the lives of migrant labourers in Thailand by addressing the injustice brought on by discrimination and inequality.',
    courage:
      'Only LPN has the courage to orchestrate life-saving rescues in the near term and the strategic focus to inoculate communities against human rights abuse in the long term.',
    footnote:
      '* Labour Rights Promotion Network was renamed to Labour Protection Network to better reflect its well-known acronym, LPN',
  },
  why: {
    eyebrow: 'Why migrants?',
    title: 'Labour migrants are the most exploited population in Thailand.',
    sub: '',
    paras: [
      'A debilitating poverty, an insatiable demand for cheap labor and a backdrop of political upheaval and corruption creates a perfect storm for human rights abuse.',
      'And the most at-risk population within Thailand are migrants. They lack the basic rights afforded Thai nationals such as the ability to move freely, the freedom to change employers, access to education and the ability to organize. A lack of human rights opens them up to abuse and brutality at the hands of authorities and their employers.',
    ],
    prey: 'Traffickers prey on the weak, the lost, the orphaned, and the most vulnerable.',
    credit: 'Photo by: Visarut Sankham/Realframe',
  },
  sale: {
    title: 'Human beings are not for sale',
    cards: [
      {
        title: 'Captured as a child for labor',
        body: 'Children as young as 9 are caught and given fake identities, with no way to reach their families.',
      },
      {
        title: 'Crushed under threat of violence',
        body: 'Beatings, burnings, starvation and the constant fight for survival.',
      },
      {
        title: 'Illegally bonded by debt',
        body: 'Trapped in an impossible cycle to repay the debts set by their own traffickers.',
      },
      {
        title: 'Tricked and forced to work',
        body: '20 hours per day, 7 days a week, for years at a time with little to no pay.',
      },
    ],
  },
  theory: {
    eyebrow: 'Our theory of change',
    title: 'Create a virtuous cycle between urgent rescue and prevention',
    sub: '',
    paras: [
      'There are people in trouble now that need our help and care. Yet there are also younger generations of vulnerable people we need to prevent from becoming trafficked in the first place.',
      'Our urgent rescue work gives us the evidence we need to better advocate against human rights abuse and the insight we need to improve our prevention services.',
      'Our long term prevention and education work builds access and trust in communities to help us surface tips and leads on new instances of abuse. Education is the number one way to break the cycle of poverty and strengthen communities against exploitation.',
      'Together we have a powerful method for improving the lives of migrants in Thailand, and eradicating human rights abuse.',
    ],
  },
  services: {
    eyebrow: 'Our services',
    title: 'We focus on three primary service areas',
    items: [
      {
        title: 'Raids, rescue and victim assistance',
        body: 'We are still getting distress calls. These projects include the investigation and rescue of victims on land and at sea, and offers post-rescue services such as healthcare, trauma services, shelter and legal support.',
      },
      {
        title: 'Migrant education centers',
        body: 'Migrant children are frequently cut off from education. These projects include creating safe spaces for migrant children to learn, integrate into local schools and build a new life in Thailand.',
      },
      {
        title: 'Labour rights promotion advocacy and media',
        body: 'Not enough is being done to combat human rights abuse and trafficking. LPN conducts the research, development and translation of rights-education materials, advocates for policy change, and conducts labour rights training.',
      },
    ],
  },
  critical: {
    title:
      '15 years of direct, in-the-field experience has taught us what is most critical for success',
    items: [
      'Strategic problem-solving: the ability to marshal a wide network of activists and leaders to get results.',
      'Life-saving field work: groundbreaking rescue missions, and relentless drive for justice.',
      'Powerful intelligence network: trusted relationships for documenting & sharing evidence of human rights abuse.',
      'Trusted migrant resource: timely, relevant information, in the migrant’s home language.',
      'Integration through education: local language and education by a stable team of nurturing teachers to help break the cycle of poverty.',
    ],
  },
  donate: {
    heading: 'Donate now',
    body: 'If you are moved by these stories, please consider donating to LPN today. Your support has the power to transform lives and prevent human tragedy. All donations directly fund LPN’s raids & rescue, trafficking-prevention and rights advocacy work.',
    cta: 'Make a difference',
  },
}
