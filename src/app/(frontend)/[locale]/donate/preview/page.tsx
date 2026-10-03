import { redirect } from 'next/navigation'
import type { Locale } from '@/i18n/routing'

export default async function DonationPreviewRedirect({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  redirect(`/${locale}/donate`)
}
