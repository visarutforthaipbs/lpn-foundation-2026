import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/images/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async rewrites() {
    // A local content snapshot contains media metadata, while the original
    // files remain in production Blob storage. Proxy public GETs during local
    // development without giving the dev server production storage write access.
    const mediaOrigin = process.env.NODE_ENV === 'development' ? process.env.DEV_MEDIA_ORIGIN : undefined
    if (!mediaOrigin) return []
    return {
      beforeFiles: [
        {
          source: '/api/media/file/:path*',
          destination: `${mediaOrigin.replace(/\/$/, '')}/api/media/file/:path*`,
        },
      ],
    }
  },
  async redirects() {
    // Old Wix paths whose slug changed in the rebuild. Unprefixed forms get a
    // locale prefix added by the i18n middleware first, so cover both shapes.
    const renamed: [string, string][] = [
      ['services-1', 'services'],
      // The old Wix events page is an empty placeholder — send visitors home
      // instead of a dead /events path.
      ['events-page', ''],
    ]
    return renamed.flatMap(([from, to]) => [
      { source: `/${from}`, destination: `/${to}`, permanent: true },
      { source: `/:locale(en|th)/${from}`, destination: `/:locale/${to}`, permanent: true },
    ])
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
