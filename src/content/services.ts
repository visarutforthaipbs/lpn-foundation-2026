/**
 * Services page content — verbatim from the live lpnfoundation.org site
 * (checked 2026-09-30). Kept in a data module so the page component stays
 * readable and the bilingual copy is easy to diff against the live site.
 */

export type Item = { title: string; body: string }

export type ServicesCopy = {
  hero: { eyebrow: string; title: string; lede: string; lede2: string }
  programsTitle: string
  programs: { title: string; body: string; cta: string }[]
  raid: { eyebrow: string; title: string; paras: string[]; items: Item[] }
  advocacy: { eyebrow: string; title: string; paras: string[]; items: Item[] }
  education: { eyebrow: string; title: string; paras: string[]; items: Item[]; closing: string[] }
}

export const servicesTh: ServicesCopy = {
  hero: {
    eyebrow: 'การทำงานของเรา',
    title: 'การทำงานของเรามาจากการปรับใช้ประสบการณ์ตรงกว่า 15 ปีที่ทำงานร่วมกับแรงงานข้ามชาติ',
    lede:
      'LPN ทำงานเพื่อปกป้องสิทธิของแรงงานข้ามชาติที่อาศัยอยู่ในประเทศไทย โดย LPN สนับสนุนเรื่องสิทธิในการักษาพยาบาล ความปลอดภัยในที่ทำงาน การเข้าถึงการศึกษา และบริการทางสังคม ซึ่งกว่า 15 ปีที่ผ่านมา พวกเราได้ค้นพบวิธีการที่มีประสิทธิภาพที่สุดในการปฎิบัติการช่วยเหลือแรงงาน สร้างเครือแรงงานที่เชื่อถือได้เพื่อคอยให้ข้อมูลและสร้างพื้นที่ปลอดภัยสำหรับเยาวชนข้ามชาติสำหรับการเรียนรู้ สร้างกระบวนการปกป้องเด็กและผู้หญิง และยังได้มีการผลิตและพัฒนาสื่อสำหรับแรงงานในภาษาของพวกเขาเอง',
    lede2:
      'โครงการเหล่านี้ของเราประสบความสำเร็จได้เพราะเรานำเอาความต้องการของกลุ่มแรงงานเป็นหัวใจหลักในประเมินและปรับปรุงเแผนงานเป็นประจำในทุก ๆ ปีเพื่อให้มีประสิทธิภาพมากยิ่งขึ้น',
  },
  programsTitle: 'โครงการของเรา',
  programs: [
    {
      title: 'บุกช่วยเหลือเหยื่อการค้ามนุษย์',
      body: 'ในปัจจุบันยัง LPN ยังคนได้รับการร้องขอความช่วยเหลืออยู่บ่อยครั้งจากเหยื่อของการค้ามนุษย์และแรงงานที่ถูกเอารัดเอาเปรียบ งานของเราจึงเป็นการช่วยเหลือเหยื่อให้รอดพ้นจากสถานการณ์อันเลวร้ายไม่ว่าจะเป็นการบุกเข้าช่วยเหลือทั้งบนบกและในทะเล หรือการช่วยเหลือเหยื่อในการด้านฟื้นฟูจิตใจหลังถูกทำร้าย อย่างเช่น การให้ที่พักพิง ดูแลด้านจิตใจ และสนับสนุนทางกฏหมายเพื่อดำเนินคดีเรียกร้องค่าเสียหายและเอาผิด',
      cta: 'ดูผลงานของเรา',
    },
    {
      title: 'สื่อสารและรณรงค์เกี่ยวกับสิทธิของแรงงานข้ามชาติ',
      body: 'การต่อสู้กับการละเมิดสิทธิของแรงงานข้ามชาติและการค้ามนุษย์ ถือได้ว่ายังต้องฝ่าฟันอีกมาก ดังนั้น LPN จึงทำงานหลายด้านทั้งการวิจัยเพื่อวิเคราะห์ปัญหาและหาทางออก พัฒนาและสร้างสื่อการสอน รวมไปถึงการรณรงค์เพื่อทำให้เกิดการเปลี่ยนแปลงนโยบายจัดอบรมและสร้างความเข้าใจในเรื่องสิทธิของแรงงาน',
      cta: 'ดูผลงานของเรา',
    },
    {
      title: 'ศูนย์การเรียนรู้สำหรับเยาวชนแรงงานข้ามชาติ',
      body: 'ลูกหลายแรงงานข้ามชาติมักจะเป็นกลุ่มแรก ๆ ที่เข้าไม่ถึงและหลุดออกจากระบบการศึกษาไทย ดังนั้นงานที่เราทำนี้จะเป็นความพยายามในการสร้างพื้นที่ให้กับกลุ่มลูกหลานแรงงานข้ามชาติที่จะได้เข้าถึงการศึกษาของรัฐไทย และด้วยการศึกษาจะช่วยทำให้พวกเขาสามารถปรับตัวให้เข้ากับประเทศไทยได้',
      cta: 'ดูผลงานของเรา',
    },
  ],
  raid: {
    eyebrow: 'Raid & rescue',
    title: 'การบุกช่วยเหลือ เหยื่อการค้ามนุษย์',
    paras: [
      'Since 2012 our raids and rescues have shined an international spotlight on the inhumane treatment of fishermen in domestic and international waters.',
      'Each rescue is a painstaking process of research and perseverance.',
      'LPN builds long term relationships on the ground with migrants across South East Asia. Our watchdog network helps us uncover instances of domestic abuse, sexual violence, child abuse, debt bondage, slavery at sea and more.',
      'After being away from home and unable to reach their families, reunion and repatriation is our most rewarding service. Every day we hope to be able to write more and more of these stories, see more happy endings. Please consider supporting our organization through a donation.',
    ],
    items: [
      {
        title: 'ปฏิบัติการช่วยชีวิตลูกเรือประมงในประเทศอินโดนีเซียน',
        body: 'การทำงานเพื่อหยุดยั้งการขูดรีดและช่วยเหลือลูกเรือประมงในน่านน้ำประเทศอินโดนีเซียกลายเป็นจุดเน้นของ LPN มาหลายปี โดยการทำงานเพื่อช่วยเหลือลูกเรือที่ถูกเอารัดเอาเปรียดในประเทศอินโดนีเซียนี้เกิดขึ้นมาจากการที่ LPN ได้รับรายงานจากลูกเรือกว่า 128 ครั้งที่บอกเล่าถึงการถูกทำร้ายหลังจากที่ออกจากน่านน้ำไทยเพื่อไปทำงานยังน่านน้ำในประเทศอินโดนีเซีย ทำให้ปฏิบัติการเพื่อช่วยเหลือลูกเรือประมงกว่า 12 ครั้งที่เกิดขึ้นตั้งแต่ปี 2014 ถึง 2016 ทำให้เราสามารถช่วยเหลือลูกเรือประมงที่ถูกทิ้งอยู่ในเกาะอัมบนและเบญจิน่าได้กว่า 2,000 คน ซึ่งการช่วยเหลือครั้งนี้ได้ทำให้สังคมโลกมองตระหนักถึงปัญหาการค้ามนุษย์ในประเทศไทย โดยในปฏิบัติการนี้ LPN ยังได้ทำงานร่วมกับหลายภาคส่วน อย่างสื่อมวลชน องค์การระหว่างประเทศเพื่อการโยกย้ายถิ่นฐาน (IOM) และรัฐบาลประเทศอินโดนีเซีย จากการทำงานร่วมกันนี้เราได้เผยให้เห็นโครงข่ายการค้ามนุษย์ขนาดใหญ่ที่ไม่เคยเปิดเผยมาก่อน',
      },
      {
        title: 'การบุกช่วยเหลือแรงงานในพื้นที่โรงงาน',
        body: 'LPN ยังได้สร้างความตระหนักในเรื่องการเอารัดเอาเปรียบแรงงานด้วยการทำงานร่วมกันกับเจ้าหน้าที่รัฐและหน่วยตำรวจในการวางแผนและบุกช่วยเหลือแรงงานที่ถูกเอาเปรียบในโรงงานที่เป็นพื้นที่ปิดอย่างโรงงานแปรรูปกุ้ง และได้ช่วยเหลือแรงงานพม่ากว่า 66 คนที่ถูกกักขังและถูกบังคับให้ใช้แรงงาน',
      },
      {
        title: 'ศูนย์พักพิงชั่วคราวและระยะยาว',
        body: 'สำนักงานหลักของเราตั้งอยู่ในตำบลมหาชัย จังหวัดสมุทรสาคร โดยได้ทำหน้าที่เป็นศูนย์พักพิงให้กับแรงงานที่ตกเป็นเหยื่อทั้งในระยะยาวและชั่วคราว โดยในศูนย์พักพิงนี้คือสถานที่ ๆ เหยื่อจากความรุนแรงอย่างผู้หญิง เด็ก และแรงงาน ที่กำลังอยู่ในกระบวนการด้านเอกสาร ด้านคดีความ มาพักพิงเพื่อรอคอยหรือกลุ่มคนที่กำลังอยู่ในระหว่างการฟ้องเรียกค่าเสียหายและค่าชดเชยจากนายจ้างซึ่งในกลุ่มนี้มักจะต้องการที่พักอาศัยนานกว่ากลุ่มแรกเพราะกระบวนการทางกฏหมายนั้นจะใช้เวลาอย่างน้อย 5 เดือนถึงจะเสร็จสิ้น ในขณะนี้เรากำลังพยายามที่จะสร้างศูนย์พักพิงสำหรับแรงงานประมงเพื่อที่จะเป็นที่พึ่ง เป็นพื้นที่ปลอดภัย และให้คำปรึกษาและดูแลด้านจิตใจหลังจากผ่านเหตุการณ์ร้าย ๆ นอกจากนั้นยังออกแบบให้พื้นที่นี้เป็นพื้นที่ ๆ แรงงานประมงได้มาพักคอยในระหว่างการดำเนินคดี หรือเรียนรู้ทักษะการทำงานใหม่ ๆ โดยกิจกรรมทั้งหมดมีเป้าหมายเพื่อให้บรรดาลูกเรือประมงสามารถกลับเข้าสู่สังคมได้ ในขณะนี้เรากำลังพยายามรวบรวมและระดมทุนเพื่อใช้เป็นต้นทุนในการสร้างก่อสร้าง บำรุงดูแล และใช้จ่ายสำหรับกิจกรรมที่เกิดขึ้น',
      },
      {
        title: 'เครื่อข่ายหมาเฝ้าบ้านและเครือข่ายข้อมูล',
        body: 'LPN รวบรวมข้อมูลที่เกี่ยวข้องกับสถานที่ทำงาน สภาพการทำงาน จากการแจ้งเข้ามาของทั้งตัวแรงงานเองและเครือข่ายในชุมชนแรงงาน LPN มักจะเป็นคนแรก ๆ ที่กลุ่มแรงงานไว้วางใจในการร้องเรียนเรื่องการละเมิดสิทธิแรงงาน และหลังจากได้รับเรื่องมาแล้ว LPN ก็จะจัดการดำเนินงานต่อโดยการทำงานร่วมกับรัฐบาลและผู้รักษาทางกฎหมาย โดยเฉพาะอย่างยิ่งในการทำงานกับกรมสอบสวนคดีพิเศษ (DSI) โดยผลจากการทำงานในลักษณะเครือข่ายของเราสามารถเห็นได้ใน รายงานการติดตามและการดำเนินงานต่อต้านการค้ามนุษย์ หรือ Trafficking in Persons (TIP) report ที่ตัวอย่างของการละเมิดสิทธิในรายงานกว่า 4 ใน 6 กรณี คือกรณีที่ LPN ส่งต่อไปยังรัฐ เครือข่ายอาสาสมัครแรงงานที่คอยช่วยเฝ้าระวังให้กับ LPN คือกลุ่มของแรงงานข้ามชาติที่ได้รับการฝึกฝนให้ช่วยสังเกตุการณ์และคอยรายงานหากพบเห็นการทำร้ายร่างกาย หรือให้คำแนะนำ รวมไปถึงรายงานกลับมายัง LPN ทั้งในพื้นที่ของการทำงานและพื้นที่ชุมชน ในปัจจุบันเครือข่ายแรงงานที่ทำงานร่วมกับเรายังมีอยู่เฉพาะกับในกลุ่มของแรงงานข้ามชาติสัญชาติเมียนมา ดังนั้นเราจึงมีแผนที่จะสร้างเครือข่ายเฝ้าระวังของทั้งแรงงานข้ามชาติสัญชาติกัมพูชา ลาว และไทย ซึ่งในปัจจุบันสมาชิกในเครือข่ายแรงงานข้ามชาติของเรามีกว่า 100 คน แบ่งออกเป็นกว่า 20 กลุ่มซึ่งจะกระจายกันอยู่ในจังหวัดที่มีแรงงานข้ามชาติอยู่จำนวนมากอย่าง สมุทรปราการ สมุทรสาคร ตราด และระยอง และสมาชิกในเครือข่ายแรงงานของเราในจังหวัดสมุทรสาครจะมีการพบปะกันในทุก ๆ วันอาทิตย์เพื่อประชุมพูดคุยกันในประเด็นที่กำลังเป็นที่สนใจหรือนโยบายที่เกี่ยวข้องกับกลุ่มแรงงานที่ปรับเปลี่ยนไป และเรายังมีการฝึกฝนกลุ่มเครือข่ายแรงงานเพื่อสร้างความแข็งแรงของเครือข่ายอีกด้วย',
      },
    ],
  },
  advocacy: {
    eyebrow: 'Labour rights',
    title: 'การรณรงค์สนับสนุนสิทธิแรงงานและการสื่อสาร',
    paras: [
      'Wherever there are migrants, there exists a misunderstanding of their rights in Thailand. Many don’t know their rights to time off, breaks, minimum hour work day, standards for working conditions and opportunities for recourse. An ignorance of their rights is exploited by traffickers and ill-intentioned employers. Much of our training is conducted in person, in their native language.',
      'We partner with businesses to help ensure their employees understand their rights, employers meet and exceed labour compliance criteria, and proper grievance mechanisms are established should any issues arise in the future.',
      'As a part of LPN’s community outreach programming, they source, pack and deliver goods to children and families in response to natural disasters such as this 2018 flood in Myanmar.',
    ],
    items: [
      {
        title: 'การรณรงค์กับภาครัฐและภาคประชาสังคม',
        body: 'ประเทศไทยมีชื่อเสียงอย่างมากในด้านลบจากปัญหาการค้ามนุษย์ที่เกิดขึ้นจากความล้มเหลวของกระบวนการตรวจสอบ ในช่วงปีที่ผ่านมาเราเริ่มเห็นความพยายามในการพลักดันเพื่อแก้ปัญหาเรื่องนี้หลักจากประเทศไทยล้มเหลวในการควบคุมมาตารฐานให้เทียบเท่าระดับสากล แม้ว่าจะมีการเปลี่ยนแปลงด้านนโยบายภายใต้การบริหารของบารัค โอบาม่า แต่ก็ยากที่จะทำให้รัฐบาลเปลี่ยนแปลงได้ ในขณะเดียวกันได้มีแรงกดดันจากภาคธุรกิจโดยเฉพาะกับภาคธุรกิจที่คำนึงถึงหลักความรับผิดชอบทางสังคมเชิงบรรษัท (Corporate social responsibility) และเหล่าบรรดาเซฟทำอาหารก็ได้รวมตัวกันภายใต้ Seafood Taskforce ซึ่งเกิดจากการรวมตัวกันของภาคธุรกิจที่ต้องการสร้างระบบติดตามและตรวจสอบ รวมไปถึงหลักการในการปฎิบัติงานเพื่อสร้างความเปลี่ยนแปลงในระดับภูมิภาคในงานประมง ซึ่ง LPN เองนั้นก็เชื่อว่าการเปลี่ยนแปลงที่สำคัญนั้นต้องมาจากภาคประชาสังคม ด้วยเหตุผลที่เชื่อในการเปลี่ยนแปลงที่มาจากภาคประชาสังคม ทำให้เราเข้าร่วมเป็นส่วนหนึ่งของการรวมตัวของภาคประชาสังคมที่เริ่มต้นขึ้นเมื่อปี 2016 ด้วยเป้าหมายและภารกิจที่ต้องการกำจัดการเป็นทาสในสมัยใหม่ให้หมดไป และการทำประมงที่ผิดกฎหมาย ขาดการรายงาน และไร้การควบคุม (IUU) ให้หมดไปจากห่วงโซ่การผลิตของอาหารทะเลไทย และภายใต้การทำงานที่นำโดย Oxfam กลุ่มภาคประชาสังคมได้รวบรวม 12 องค์กรด้านสิ่งแวดล้อมและด้านสังคมให้มาร่วมแบ่งปันแนวทางปฏิบัติงาน สร้างแผนงาน และร่วมกันทำงานกับภาครัฐไทยและผู้ซื้อและผู้ขายอาหารทะเล การทำงานของ LPN บ่อยครั้งจะเป็นการทำงานร่วมกับหน่วยงานรัฐที่เกี่ยวข้องกับแรงงานข้ามชาติอย่างเช่นกระทรวงพัฒนาสังคมและความมั่นคงของมนุษย์ กระทรวงแรงงาน และ กระทรวงการต่างประเทศ เพื่อที่จะกำจัดขบวนการการค้ามนุษย์ที่เกิดขึ้นใน 9 จังหวัดใหญ่ ๆ ที่ตั้งอยู่ติดกับทะเลอ่าวไทย โดยทางมูลนิธิ LPN ยังได้เข้าไปเป็นส่วนหนึ่งของคณะกรรมการภายในกระทรวงแรงงานที่จัดตั้งขึ้นมาเพื่อแก้ปัญหาเรื่องแรงงานเด็กและแรงงานบังคับในโรงงานแปรรูปกุ้ง รวมไปถึงโรงงานแปรรูปอาหารทะเล และในภาคการเกษตรอีกด้วย',
      },
      {
        title: 'การทำงานร่วมกับภาคธุรกิจและภาคประชาสังคมในพื้นที่',
        body: 'LPN ทำงานอย่างหนักเพื่อสร้างพันธมิตรร่วมกันกับภาคธุรกิจที่อยู่ในและอยู่รอบ ๆ จังหวัดสมุทรสาคร เพื่อทำให้เกิดความโปร่งใสในกระบวนการผลิตและยกระดับสภาพการทำงานโดยได้มีการจัดตั้งโครงการ เสียงของแรงงาน เพื่อที่จะสร้างความตระหนักในเรื่องสิทธิแรงงานในกลุ่มชาวไทยและแรงงานข้ามชาติโดยเป็นการทำงานในลักษณะของการอบรมและเข้าถึงชุมชนเพื่อช่วยสร้างพื้นที่ปลอดภัยสำหรับการร้องเรียนปัญหาที่แรงงานพบผ่านสายด่วนของ LPN ที่ให้บริการตลอด 24 ชั่วโมง งานอีกด้านของ LPN คือการสนับสนุนให้เกิดการมีส่วนร่วมกันระหว่างกลุ่มแรงงานข้ามชาติกลุ่มอื่น ๆ รวมไปถึงกลุ่มที่สนับสนุนสิทธิของแรงงานข้ามชาติ อย่างเช่นเครือข่ายปฏิบัติการเพื่อแรงงานข้ามชาติ (ANM) เครือข่ายองค์กรด้านประชากรข้ามชาติ (MWG) เครือข่ายปฏิบัติการต่อต้านการค้ามนุษย์ (ATN) เครือข่ายปฏิบัติการต่อต้านการค้ามนุษย์ในประเทศกัมพูชาและประเทศไทย (CAHT) เพื่อที่จะเข้ามาทำงานร่วมกันและสร้างให้เกิด เครือข่ายความร่วมมือด้านแรงงานข้ามชาติในประเทศไทย (MUNT) ซึ่งในการรวมตัวกันนี้จะรวมไปถึงกลุ่มอื่น ๆ อย่างเช่นองค์กรชุมชน (Community Based Organizations)',
      },
      {
        title: 'การลงโทษผู้กระทำความผิด / การดำเนินคดีอาญา',
        body: 'LPN ได้ช่วยเหลือทางด้านกฎหมายกับแรงงานข้ามชาติกว่า 3,000 คนต่อปี ทีมงานด้านกฎหมายของเราทำงานอย่างหนักเห็นได้จากการตอบรับสายที่โทรเข้ามาจากแรงงานข้ามชาติกว่า 200 สายต่อวัน ซึ่งมีทั้งการโทรเข้ามาสอบถามเรื่องสภาพการทำงาน สถานะทางด้านกฎหมายของแรงงานข้ามชาติ หรือการแจ้งการถูกทำร้ายในที่ทำงาน และเมื่อแรงงานต้องการความช่วยเหลือด้านกฎหมาย ทางทีมงานของเราก็จะช่วยเหยื่อในกระบวนการทางกฎหมายทั้งหมด ทั้งการต่อรองกับนายจ้างเรื่องค่าชดเชย การคุ้มครอบพยาน การให้ที่พักพิง การเตรียมการให้ปากคำ การสืบค้นข้อมูลและพยานหลักฐาน รวมไปถึงการเดินทางไปศาล แม้ว่าเหยื่อของการค้ามนุษย์จะมีสิตามกฎหมายที่จะได้รับความคุ้มครองจ้ารัฐและการสนับสนุนด้านกฎหมายเมื่อพวกเขาได้รับการระบุและยืนยืนโดยรัฐแล้ว แต่ในระหว่างกระบวนการยืนยันนี้เองที่เหยื่อหลายคนของขบวนการค้ามนุษย์จะไม่ได้รับการคุ้มครองเพราะไม่สามารถยืนยันว่าเป็นเหยื่อของขบวนการค้ามนุษย์ได้โดยเฉพาะอย่างยิ่งกับกรณีของแรงงานประมง และเมื่อเป็นอย่างนั้น LPN จึงมีส่วนสำคัญในการให้ยื่นฟ้องในข้อหาอื่น ๆ แทนอย่างการกักขังหน่วงเหนี่ยวเพื่อให้แรงงานได้รับการชดเฉยในรูปแบบอื่น',
      },
      {
        title: 'ข่าวแรงงานข้ามชาติ การสื่อสาร และค้นคว้าหาข้อมูล',
        body: 'LPN ได้ทำงานร่วมกับสื่อมวลชนของแต่ละประเทศที่แรงงานข้ามชาติเดินทางมาเพื่อแบ่งปันข่าวสารเกี่ยวกับข้อตกลงการนำเข้าแรงงานที่มีการปรับเปลี่ยน หรือกระบวนการลงทะเบียนและสมัครเพื่อเข้ามาทำงานในประเทศไทย และยังรวมไปถึงเทคนิคในการเคลื่อนย้ายข้ามแดนให้ปลอดภัย LPN ยังได้ทำงานร่วมกับสื่อออนไลน์ในพื้นที่โซเซี่ยลมีเดียอื่น ๆ อีกกว่า 100,000 แห่ง โดยที่สื่อเหล่านั้นก็ได้ให้คำแนะนำ และอธิบายถึงการเดินทางข้ามแดนอย่างปลอดภัย การสร้างความตระหนักเรื่องสิทธิหรือเพิ่มโอกาสในการสร้างเครือข่ายของแรงงานข้ามชาติในประเทศต้นทาง นอกเหนือจากนั้น LPN ยังเปิดโอกาสสำหรับนักศึกษา นักวิจัย นักข่าวและองค์กรต่าง ๆ ในประเทศไทย ในเอเชียตะวันออกเฉียงใต้และในโลก โดย LPN ทำหน้าที่เป็นเหมือนข้อมูลสำหรับการเผยแผร่ประเด็นสำคัญของสิทธิแรงงานและการต่อต้านการค้ามนุษย์ LPN ยังได้ร่วมทำงานกับหน่วยงานการศึกษาและหน่วยงานการวิจัยอย่าง สถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย สถาบันวิจัยประชากรและสังคม มหาลัยมหิดล คณะสังคมสงเคราะห์ศาสตร์ มหาวิทยาลัยธรรมศาสตร์ มหาวิทยาลัยเชียงใหม่ มหาวิทยาลัยบูรพา สถาบันเทคโนโลยีแห่งเอเชีย และอีกหลากหลายมหาวิทยาลัย',
      },
    ],
  },
  education: {
    eyebrow: 'Education',
    title: 'ศูนย์เรียนรู้สำหรับลูกหลานแรงงานข้ามชาติ',
    paras: [
      'Many migrant families live in industry living quarters near their job site. Here is an example of one - the rooms are constructed from shipping container-like compartments stacked on each other, with a single window. This is where our teacher begins her day, collecting the students and bringing them to school.',
      'LPN provides uniforms, school supplies and transportation to school from nearby migrant communities.',
      'Thai language is the secret to success in local Thai schools, and the difference between a lifetime of manual labour and a real future. Supporting migrant families with school registration drives, language training, uniforms and school supplies means a future generation has a chance to grow up and give back to Thai society and the world in unforeseen and powerful ways.',
    ],
    items: [],
    closing: [
      'ที่ LPN เรามองว่าการเลือกปฎิบัติและการทำให้เป็นคนชายขอบคือรากฐานของปัญหาการค้ามนุษย์และการขูดรีดแรงงาน และเพื่อที่จะหยุดวัฐจักรนี้เราได้ทำงานอย่างหนักเพื่อพลักดันให้ลูกหลานของแรงงาข้ามชาติเข้าเรียนในโรงเรียนของรัฐไทย โดยยุทธศาสตร์ของเราจะประกอบไปด้วยการสร้างศูนย์การเรียนรู้ในพื้นที่อาศัยของแรงงานข้ามชาติ การสร้างชั้นเรียน 2 ภาษาที่สอนภาษาแม่ของแรงงานข้ามชาติและภาษาไทยเพื่อช่วยเตรียมความพร้อมให้กับลูกหลานของแรงงานข้ามชาติ การสร้างห้องเรียนเคลื่อนที่ที่ช่วยให้ลูกหลานของแรงงานข้ามชาติลงทะเบียนเพื่อเข้าสู่ระบบโรงเรียน นอกเหนือจากนั้นยังมีการสร้างค่ายเตรียมความพร้อมทั้งพ่อแม่และลูกหลานของแรงงานข้ามชาติเพื่อสร้างความไว้เนื้อเชื่อใจระหว่างคนในพื้นที่กับกลุ่มแรงงานข้ามชาติ โดยการทำงานของเรานี้ได้รับถูกนำเอาไปใช้โดยนักการศึกษาและยังแสดงให้เห็นถึงความสำเร็จจากสถิตของนักเรียนที่ยังคงอยู่ในชั้นเรียน',
      'LPN เชื่อว่าการศึกษาคือทางออกที่ดีที่สุดในการปกป้องกลุ่มคนและชุมชนที่มีความเปราะบาง ซึ่งจะช่วยให้พวกเขาเรียนรู้และป้องกันตนเองจากขบวนการค้ามนุษย์ และสำหรับครอบครัวของแรงงานข้ามชาติที่มักจะต้องเคลื่อนย้ายบ่อยครั้งเพื่อชีวิตที่ดีขึ้น พวกเขามักจะต้องพบกับสภาพความเป็นอยู่ที่ยากลำบากซึ่งจะทำให้พวกเขาไม่มีทางเลือกมากนักสำหรับลูกหลาน เพราะต้องเลือกระหว่างการที่จะต้องนำเอาลูกหลานไปยังที่ทำงานด้วยซึ่งมักจะมีสภาพอันตรายอย่างไซต์ก่อสร้าง หรือปล่อยลูกหลานทิ้งไว้ในที่พักที่มักจะไม่มีใครคอยดูแล',
      'โดย LPN ได้มุ่งเน้นการทำงานในพื้นที่นี้ ที่ ๆ กลุ่มแรงงานข้ามชาติมักจะอยู่กันอย่างแออัดแต่กลับไม่มีภาคประชาสังคมเข้าไปทำงานมากนัก โดย LPN ได้ทำการสร้างพื้นที่ปลอดภัยสำหรับเยาวชนที่จะได้เรียนรู้ทักษะที่สำคัญและเตรียมความพร้อมสำหรับการเข้าเรียนในโรงเรียนรัฐบาลไทย LPN เร่ิมต้นด้วยการให้ความรู้กับครอบครัวของแรงงานข้ามชาติถึงความสำคัญของการนำเอาลูกหลานเข้าสู่ระบบการศึกษา โดย LPN ได้ช่วยจัดเตรียมและฝึกสอนครูที่สามารถสื่อสารกับลูกหลานของแรงงานได้ทั้งในภาษาไทยและภาษาแม่ของแรงงานเอง',
    ],
  },
}

export const servicesEn: ServicesCopy = {
  hero: {
    eyebrow: 'Our programs',
    title: 'Our programs are informed by 15 years of direct, in-the-field experience with migrants',
    lede:
      'LPN works to protect the rights of migrants in Thailand, including the right to health, safe work, education, and social services. Over 15 years, we have found the most effective ways of conducting raids, building a wide and trusted intelligence network, creating safe spaces for migrant children to learn, protecting women and children, and developing engaging and informative media for migrants in their native language.',
    lede2:
      'These programs are successful because they put the needs and protection of the affected communities at the center, and have been meticulously refined each year to be more and more effective.',
  },
  programsTitle: 'Our programs',
  programs: [
    {
      title: 'Raids, rescue and victim assistance',
      body: 'We are still getting distress calls. These projects include the investigation and rescue of victims on land and at sea, and offers post-rescue services such as healthcare, trauma services, shelter and legal support.',
      cta: 'See our work',
    },
    {
      title: 'Labour rights advocacy and media',
      body: 'Not enough is being done to combat human rights abuse and trafficking. LPN conducts research, development and translation of rights-education materials, advocates for policy change, and conducts labour rights training.',
      cta: 'See our work',
    },
    {
      title: 'Migrant education centers',
      body: 'Migrant children are often cut off from education. These projects include creating safe spaces for migrant children to learn, integrate into local schools and build a new life in Thailand.',
      cta: 'See our work',
    },
  ],
  raid: {
    eyebrow: 'Raid & rescue',
    title: 'Raids, Rescue & Victim Assistance',
    paras: [
      'Since 2012 our raids and rescues have shined an international spotlight on the inhumane treatment of fishermen in domestic and international waters.',
      'Each rescue is a painstaking process of research and perseverance.',
      'LPN builds long term relationships on the ground with migrants across South East Asia. Our watchdog network helps us uncover instances of domestic abuse, sexual violence, child abuse, debt bondage, slavery at sea and more.',
      'After being away from home and unable to reach their families, reunion and repatriation is our most rewarding service.',
      'Every day we hope to be able to write more and more of these stories, see more happy endings. Please consider supporting our organization through a donation.',
    ],
    items: [
      {
        title: 'Indonesian Rescue Operations',
        body: 'Combating the exploitation of fishermen in Indonesian waters has been a focal point of LPN for many years. In between 2006 and 2014, LPN received a total of 128 reports of labor abuse of fishermen leaving from Thailand to work in Indonesian waters. A total of 12 rescue operations were conducted in Indonesia from 2014 to 2016 to rescue Thai & migrant fishermen stranded on the islands of Ambon and Benjina. The rescues culminated in a highly publicized rescue operation in Indonesian waters that brought international attention to human trafficking in Thailand. A rescue team was organized consisting of reporters, LPN, the International Organization of Migration (IOM), and the Indonesian government. This effort led to the successful release of more than 2,000 captives; an unprecedented scale of human trafficking.',
      },
      {
        title: 'Factory Raids',
        body: 'Once LPN is made aware of severe cases of abuse, it will coordinate with the appropriate government agencies and police divisions to plan and implement a workplace raid. LPN has raided many factories over the years, such as a shrimp processing facility that freed 66 Burmese workers who were in forced labor.',
      },
      {
        title: 'Temporary and Long-term Shelters',
        body: 'Our main office in Mahachai also functions as a short or long-term shelter for victims. The shelter is a safe place for victims of violence (women, children, and laborers) in the process of sorting out-migration documentation, legal proceedings, government petitions for compensation, or other redresses. Those pursuing a medical or wage complaint case against employers typically stay longer, as the legal process can take about 5 months to complete. We are currently in the process of building a rescue center for fishermen that can offer a comfortable, safe place for them to receive trauma counseling, await their trials, learn new skills, receive health care and participate in group counseling to help them transition peacefully back into society. We are actively seeking funding to complete the building and cover operational, maintenance and programming costs.',
      },
      {
        title: 'Watchdog & Intelligence Network',
        body: 'LPN receives information on workplace abuse from its casework and community network. It is often the first to hear of new cases and to bring them to the attention of the government and police, particularly the DSI (Department of Special Investigations). 4 of the 6 prosecutions alluded to in the U.S. State Department’s 2017 TIP Report were referred to the government by LPN. Community volunteer “Watchdogs” are migrant workers that we have trained to monitor their workplaces and communities, recognize abuse, give advice, and refer people to LPN. Thus far the network has consisted of Burmese workers; we plan to create new networks of Cambodian and Thai watchdog volunteers. There are currently over 100 workers organized in 20 migrant network groups across Thailand in provinces such as Samut Prakan, Samut Sakhon, Trat, and Rayong. Those members based in Samut Sakhon meet at LPN every Sunday to discuss current issues and changes in government policy. We will be training more volunteers in more communities and strengthening the networks between them.',
      },
    ],
  },
  advocacy: {
    eyebrow: 'Labour rights',
    title: 'Labour Rights Advocacy and Media',
    paras: [
      'Wherever there are migrants, there exists a misunderstanding of their rights in Thailand. Many don’t know their rights to time off, breaks, minimum hour work day, standards for working conditions and opportunities for recourse. An ignorance of their rights is exploited by traffickers and ill-intentioned employers. Much of our training is conducted in person, in their native language.',
      'We partner with businesses to help ensure their employees understand their rights, employers meet and exceed labour compliance criteria, and proper grievance mechanisms are established should any issues arise in the future.',
      'As a part of LPN’s community outreach programming, they source, pack and deliver goods to children and families in response to natural disasters such as this 2018 flood in Myanmar.',
    ],
    items: [
      {
        title: 'Advocacy & Lobbying with the Government & Civil Society Organizations (CSOs)',
        body: 'Thailand is infamous for its problems with human trafficking. The issues can in large part be attributed to systemic failures in regulation. The last few years have seen a dramatic impetus for reform as we have witnessed fallouts from international scandals, changes of policy under President Obama, desperate government reforms, and the explosion of reactionary Corporate Social Responsibility. Chief among them is the Seafood Taskforce, an industry-led coalition which aims to establish credible tracing and auditing systems, develop a model code of conduct, and drive regional improvements in fishery. LPN believes civil society is a catalyst for change. This is why it is part of a Thai CSO Coalition, which began in 2016 with a mission to eradicate modern-day slavery and IUU fishing in the Thai seafood supply chains. Under the direction of Oxfam, the Coalition has brought together 12 environmental and social NGOs to share best practices, co-create strategies, and collectively engage the Thai government and leading seafood buyers and sellers. LPN regularly engages with the Ministry of Social Development and Human Security, the Ministry of Labour, and the Ministry of Foreign Affairs in order to eliminate the trafficking of persons in nine seriously affected provinces around the Gulf of Thailand. The foundation is also a member of a committee within the Ministry of Labour that seeks to resolve issues of child labour and forced labour in the shrimp fishing industry, the seafood processing industry, and the agricultural sector.',
      },
      {
        title: 'Partnering with Businesses and Local Groups',
        body: 'LPN is actively establishing partnerships with the private sector in and around Samut Sakhon province to promote greater supply chain transparency and foster improved working conditions. The organization’s “Worker Voice Program” raises awareness about labor rights among Thai and migrant workers through trainings & community outreach while providing a safe means to voice complaints via LPN’s 24 hour hotline. LPN regularly encourages the participation of other migrant and labour rights non-governmental organizations, such as the Action Network for Migrants (ANM), the Migrant Working Group (MWG), the Anti-Human Trafficking Network in Thailand (ATN), and the Cambodia and Thailand Anti-Human Trafficking Network (CAHT), in its push to establish a Migrant Union Network in Thailand (MUNT). This initiative also includes other Community Based Organizations.',
      },
      {
        title: 'Criminal Prosecutions',
        body: 'LPN provides legal aid to around 3,000 migrants each year. Our team of dedicated legal officers fields an average of 200 calls per day, from simple inquiries on working conditions and immigration status to more serious cases of labour abuse. When legal assistance is required, we accompany victims throughout the judicial process: negotiating with employers for compensation, witness protection, shelter, testimony preparation, fact-finding for their case, and transportation to court hearings. Victims of human trafficking have a right to government protection and legal assistance once they are officially identified. But due to continued issues with the victim identification process, many victims with signs of human-trafficking go unrecognized, especially in the fishing industry. In such cases, LPN plays an important role in seeking prosecution under other criminal charges, such as deception or confinement, in an effort to obtain some kind of remediation.',
      },
      {
        title: 'Migrant news, media & research',
        body: 'LPN partners with local media outlets in migrant source countries to share the latest information regarding MOUs, registration process and other technical aspects of migration. LPN also operates several social media properties - with a network over 100,000 - where they offer guides, tips and methods for safe migration, local rights promotion events and opportunities to network with other migrants from their home country. LPN has always opened its doors to students, researchers, journalists and organisations working in Thailand, Southeast Asia, and worldwide. The foundation also functions as a base for national and international media associations, distributing information about the urgency and significance of migrant labour rights and the anti-human trafficking movement. LPN undertakes joint research projects with some of Thailand’s largest academic institutions, such as the Asian Institute at Chulalongkorn University, the Institute for Population and Social Research at Mahidol University, the faculties of Social Administration at Thammasat University, Chiang Mai University, Burapha University, and the Asian Institute of Technology (AIT), as well as a number of international universities.',
      },
    ],
  },
  education: {
    eyebrow: 'Education',
    title: 'Migrant education centers',
    paras: [
      'Many migrant families live in industry living quarters near their job site. Here is an example of one - the rooms are constructed from shipping container-like compartments stacked on each other, with a single window. This is where our teacher begins her day, collecting the students and bringing them to school.',
      'LPN provides uniforms, school supplies and transportation to school from nearby migrant communities.',
      'Thai language is the secret to success in local Thai schools, and the difference between a lifetime of manual labour and a real future. Supporting migrant families with school registration drives, language training, uniforms and school supplies means a future generation has a chance to grow up and give back to Thai society and the world in unforeseen and powerful ways.',
    ],
    items: [],
    closing: [
      'At LPN we recognize that discrimination and marginalization are some of the root causes of trafficking and labor exploitation. To break this cycle, we have been pushing hard for the integration of migrant children into public schools. Our strategy includes: temporary education centers in worker camps, bilingual classrooms to ease the transition of migrant children into public schools, a mobile education team that visits migrant communities to register children for school, as well as youth camps and parent workshops that build mutual trust between local residents and migrants. This replicable model has already been embraced by educators and is showing fantastic student retention rates.',
      'LPN believes that education is the best way to protect vulnerable communities, and inoculate them from the risks of human trafficking. For migrant families that move together to find a better life, they are often met with difficult living conditions and no options for safe child care while they are working. Parents are forced to either take their children to their place of work - often dangerous working conditions such as construction - or leave them unsupervised for the day in the migrant living quarters.',
      'LPN focuses on these areas where the migrant population is high and social services are low, and provides safe places for children to learn the skills necessary to thrive in Thai public schools. LPN begins by educating the families on the importance of registering their children for school and preparing them to succeed. They also provide teachers trained in fluent Thai and native migrant languages.',
    ],
  },
}
