'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, Check, CreditCard, Globe2, Landmark, LockKeyhole, QrCode } from 'lucide-react'
import { buttonVariants } from '@/components/ui'

type Channel = 'thailand' | 'international'

export function DonationChannelPreview({ locale }: { locale: 'th' | 'en' }) {
  const th = locale === 'th'
  const [channel, setChannel] = useState<Channel>('thailand')
  const [method, setMethod] = useState<'qr' | 'bank'>('qr')
  const [frequency, setFrequency] = useState('once')
  const [amounts, setAmounts] = useState({ thailand: '500', international: '50' })
  const [custom, setCustom] = useState({ thailand: '', international: '' })
  const [country, setCountry] = useState('us')
  const [paymentStep, setPaymentStep] = useState(false)
  const domestic = channel === 'thailand'
  const amount = amounts[channel] === 'other' ? custom[channel] : amounts[channel]
  const currency = domestic ? 'THB' : 'USD'
  const currencySymbol = domestic ? '฿' : '$'
  const options = domestic ? ['300', '500', '1000'] : ['25', '50', '100']
  const choiceClass = 'flex min-h-12 cursor-pointer items-center justify-center gap-2 border px-4 py-3 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white'

  function changeChannel(next: Channel) {
    setChannel(next)
    setPaymentStep(false)
  }

  return <div id="giving-channels" className="scroll-mt-44">
    <fieldset className="min-w-0">
      <legend className="t-h2 mb-7 max-w-full">{th ? 'คุณต้องการบริจาคจากที่ไหน?' : 'Where are you giving from?'}</legend>
      <div className="grid gap-4 md:grid-cols-2">
        {([
          ['thailand', Landmark, th ? 'ในประเทศไทย' : 'In Thailand', th ? 'เงินบาท · แอปธนาคารหรือโอนเงิน' : 'Thai baht · Banking app or transfer'],
          ['international', Globe2, th ? 'จากต่างประเทศ' : 'Internationally', th ? 'บัตรหรือช่องทางออนไลน์ผ่านพันธมิตร' : 'Cards or online payments through a partner'],
        ] as const).map(([value, Icon, title, description]) => <label key={value} className={`relative flex cursor-pointer items-center gap-3 border-2 p-4 transition-colors sm:gap-5 sm:p-7 ${channel === value ? 'border-black bg-white' : 'border-black/15 bg-white/50 hover:border-black/50'} has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-black`}>
          <input type="radio" name="giving-channel" value={value} checked={channel === value} onChange={() => changeChannel(value)} className="sr-only" />
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14 ${channel === value ? 'bg-brand-yellow' : 'bg-black/5'}`}><Icon size={27} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block text-lg font-bold sm:text-2xl">{title}</span><span className="mt-2 block text-sm text-black/65">{description}</span></span>
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${channel === value ? 'border-black bg-black text-white' : 'border-black/25'}`}>{channel === value && <Check size={15} aria-hidden="true" />}</span>
        </label>)}
      </div>
    </fieldset>

    <div className="mt-6 grid border border-black/15 bg-white lg:grid-cols-[1.25fr_1fr]">
      <div className="p-6 sm:p-9">
        <div className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-black/60"><span className="flex h-7 w-7 items-center justify-center bg-black text-white">{paymentStep ? '2' : '1'}</span>{paymentStep ? (th ? 'ดูขั้นตอนการชำระเงิน' : 'Payment step preview') : (th ? 'เลือกการบริจาค' : 'Choose your gift')}<span className="ml-auto">{currency}</span></div>
        {paymentStep ? <div>
          <h3 className="t-h3">{domestic ? (method === 'qr' ? (th ? 'ชำระผ่านแอปธนาคาร' : 'Pay with your banking app') : (th ? 'โอนเข้าบัญชีมูลนิธิ' : 'Transfer to the foundation')) : (th ? 'ไปยังหน้าชำระเงินของพันธมิตร' : 'Continue to our partner’s checkout')}</h3>
          <p className="mt-4 text-black/65">{th ? 'ตัวอย่างขั้นตอนสำหรับตรวจแบบ ช่องทางชำระเงินจริงยังไม่ได้เปิดใช้งาน' : 'This is a design preview. The payment channel has not been activated.'}</p>
          {domestic && method === 'qr' ? <div className="mt-7 flex flex-col items-center border border-dashed border-black/25 bg-paper px-5 py-9 text-center">
            <QrCode size={64} strokeWidth={1.3} className="text-black/35" aria-hidden="true" />
            <p className="mt-4 font-semibold">{th ? 'พื้นที่แสดง QR ที่ LPN ยืนยันแล้ว' : 'Space for LPN’s verified payment QR'}</p>
            <p className="mt-2 text-sm text-black/60">{th ? 'ภาพนี้ใช้สแกนชำระเงินไม่ได้' : 'This illustration cannot be scanned for payment.'}</p>
          </div> : domestic ? <dl className="mt-7 divide-y divide-black/10 border-y border-black/10">{[
            [th ? 'ชื่อบัญชี' : 'Account holder', th ? 'บัญชีมูลนิธิที่ LPN ยืนยัน' : 'LPN’s verified foundation account'],
            [th ? 'ธนาคาร / เลขบัญชี' : 'Bank / Account number', th ? 'รอยืนยันจาก LPN' : 'Awaiting LPN confirmation'],
          ].map(([label, value]) => <div key={label} className="py-4"><dt className="text-sm text-black/60">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl> : <div className="mt-7 border border-dashed border-black/25 bg-paper p-7">
            <LockKeyhole size={35} aria-hidden="true" /><p className="mt-4 font-semibold">{th ? 'หน้าชำระเงินที่ปลอดภัยของพันธมิตร' : 'Secure checkout hosted by our partner'}</p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">{th ? 'ผู้บริจาคจะเลือกวิธีชำระเงินและตรวจเงื่อนไขใบเสร็จที่นี่ โดยไม่กรอกข้อมูลบัตรบนเว็บไซต์ LPN' : 'Donors choose a payment method and review receipt terms here. Card details are entered on the partner’s checkout.'}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide">{th ? 'รอเลือกผู้ให้บริการร่วมกับปฏิมา' : 'Provider to be agreed with Patima'}</p>
          </div>}
          <button type="button" className={`${buttonVariants({ variant: 'ghostDark' })} mt-7`} onClick={() => setPaymentStep(false)}><ArrowLeft size={17} aria-hidden="true" />{th ? 'กลับไปเลือกจำนวนเงิน' : 'Back to gift options'}</button>
        </div> : <form onSubmit={event => { event.preventDefault(); setPaymentStep(true) }}>
          {!domestic && <fieldset className="mb-7"><legend className="mb-3 font-semibold">{th ? 'ความถี่' : 'How often?'}</legend><div className="grid grid-cols-2 gap-2">{[['once', th ? 'ครั้งเดียว' : 'One-time'], ['monthly', th ? 'ทุกเดือน' : 'Monthly']].map(([value, title]) => <label key={value} className={choiceClass}><input className="sr-only" type="radio" name="giving-frequency" value={value} checked={frequency === value} onChange={() => setFrequency(value)} />{title}</label>)}</div></fieldset>}
          <fieldset><legend className="mb-3 font-semibold">{th ? 'เลือกจำนวนเงิน' : 'Choose an amount'}</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[...options, 'other'].map(value => <label key={value} className={choiceClass}><input className="sr-only" type="radio" name="giving-amount" value={value} checked={amounts[channel] === value} onChange={() => setAmounts({ ...amounts, [channel]: value })} />{value === 'other' ? (th ? 'ระบุเอง' : 'Other') : `${currencySymbol}${Number(value).toLocaleString()}`}</label>)}</div></fieldset>
          {amounts[channel] === 'other' && <label className="mt-4 block text-sm font-semibold">{th ? `จำนวนเงิน (${currency})` : `Amount (${currency})`}<input type="number" min="1" step={domestic ? '1' : '0.01'} required inputMode="decimal" value={custom[channel]} onChange={event => setCustom({ ...custom, [channel]: event.target.value })} className="mt-2 block min-h-12 w-full border border-black/30 bg-white p-3 text-lg" /></label>}
          {domestic ? <fieldset className="mt-7"><legend className="mb-3 font-semibold">{th ? 'ช่องทางที่เสนอ' : 'Proposed payment method'}</legend><div className="grid grid-cols-2 gap-2">{([
            ['qr', QrCode, 'PromptPay QR'], ['bank', Building2, th ? 'โอนเงิน' : 'Bank transfer'],
          ] as const).map(([value, Icon, title]) => <label key={value} className={choiceClass}><input className="sr-only" type="radio" name="giving-method" value={value} checked={method === value} onChange={() => setMethod(value)} /><Icon size={18} aria-hidden="true" />{title}</label>)}</div></fieldset> : <label className="mt-7 block font-semibold">{th ? 'ประเทศที่บริจาค' : 'Giving from'}<select value={country} onChange={event => setCountry(event.target.value)} className="mt-3 block min-h-12 w-full border border-black/25 bg-white px-3 text-sm"><option value="us">{th ? 'สหรัฐอเมริกา' : 'United States'}</option><option value="other">{th ? 'ประเทศอื่น' : 'Another country'}</option></select></label>}
          <button type="submit" className={`${buttonVariants({ variant: 'primary' })} mt-8 w-full`}>{th ? 'ดูตัวอย่างขั้นตอนถัดไป' : 'Preview the next step'}<ArrowRight size={18} aria-hidden="true" /></button>
          <p className="mt-3 text-center text-xs leading-relaxed text-black/60">{th ? 'จำนวนเงินเป็นตัวอย่างสำหรับตรวจแบบ ไม่มีการเรียกเก็บเงิน' : 'Example amounts for review. No payment will be taken.'}</p>
        </form>}
      </div>

      <aside className="border-t border-black/15 bg-paper p-6 sm:p-9 lg:border-t-0 lg:border-l" aria-label={th ? 'สรุปการบริจาค' : 'Gift summary'}>
        <p className="eyebrow text-black/60">{th ? 'การสนับสนุนของคุณ' : 'Your support'}</p>
        <p className="mt-5 break-words text-5xl font-semibold tracking-tight">{amount ? `${currencySymbol}${Number(amount).toLocaleString()}` : '—'}<span className="ml-2 text-sm font-normal tracking-normal text-black/60">{currency}</span></p>
        <p className="mt-2 text-sm text-black/65">{!domestic && frequency === 'monthly' ? (th ? 'ต่อเดือน · ช่องทางที่เสนอ' : 'Per month · proposed option') : (th ? 'บริจาคครั้งเดียว' : 'One-time gift')}</p>
        <div className="my-7 h-px bg-black/15" />
        <h3 className="text-xl font-semibold">{th ? 'เคียงข้างแรงงานและครอบครัว' : 'Stand beside workers and families'}</h3>
        <p className="mt-3 text-sm leading-relaxed text-black/70">{th ? 'สนับสนุนงานช่วยเหลือ การเรียนรู้ในชุมชน และการสร้างระบบที่เป็นธรรมของ LPN' : 'Support LPN’s direct assistance, community learning, and work towards fairer systems.'}</p>
        <div className="mt-7 flex items-start gap-3 text-sm leading-relaxed text-black/70"><CreditCard size={20} className="mt-0.5 shrink-0" aria-hidden="true" /><p>{domestic ? (th ? 'โอนตรงเข้าบัญชีมูลนิธิที่ผ่านการยืนยัน' : 'Transfer to a verified foundation account.') : (th ? 'ชำระผ่านพันธมิตรที่ LPN เลือกและยืนยัน' : 'Pay through a partner selected and verified by LPN.')}</p></div>
        <details className="mt-6 border-t border-black/15 pt-5"><summary className="cursor-pointer text-sm font-semibold">{th ? 'ใบเสร็จและข้อมูลภาษี' : 'Receipts and tax information'}</summary><p className="mt-3 text-sm leading-relaxed text-black/65">{domestic ? (th ? 'ต้องยืนยันขั้นตอนขอใบเสร็จและสถานะการลดหย่อนภาษีกับ LPN ก่อนเปิดใช้' : 'LPN needs to confirm receipt requests and any Thai tax eligibility before launch.') : country === 'us' ? (th ? 'ข้อมูลใบเสร็จสำหรับสหรัฐฯ จะแสดงหลังยืนยันพันธมิตรแล้ว' : 'U.S. receipt information will appear once the receiving partner is confirmed.') : (th ? 'จะแสดงข้อมูลใบเสร็จตามผู้ให้บริการและประเทศ ไม่ควรถือว่าใบเสร็จใช้ลดหย่อนภาษีได้ทุกประเทศ' : 'Receipt information will depend on the provider and country. Eligibility needs confirmation for each jurisdiction.')}</p></details>
        {!domestic && frequency === 'monthly' && <p className="mt-5 text-sm leading-relaxed text-black/65">{th ? 'การยกเลิกหรือเปลี่ยนยอดรายเดือนต้องจัดการผ่านพันธมิตร ช่องทางนี้รอยืนยัน' : 'Monthly gift changes and cancellation would be managed through the partner. This option needs confirmation.'}</p>}
      </aside>
    </div>
  </div>
}
