/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// 배포 환경인지 확인 (production일 때만 output: 'export' 적용)
const isProd = process.env.NODE_ENV === 'production'

// CSP 설정
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app https://www.youtube.com https://youtube.com;
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const basePath = process.env.BASE_PATH || undefined

/**
 * @type {import('next').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    // ✅ 로컬 개발 시(dev)에는 undefined, 배포 빌드 시에만 'export' 사용
    output: isProd ? 'export' : undefined,

    basePath,
    reactStrictMode: true,
    trailingSlash: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

    experimental: {
      turbo: {
        rules: {},
      },
    },

    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
      ignoreDuringBuilds: true,
    },

    typescript: {
      ignoreBuildErrors: true,
    },

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized: true,
    },

    async headers() {
      // output: 'export' 모드에서는 headers가 무시되지만, 로컬 개발을 위해 유지
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },

    async rewrites() {
      // output: 'export' 모드에서는 rewrites가 무시되지만, 로컬 개발 시 주소 연결을 위해 유지
      return [
        { source: '/recipe', destination: '/blog' },
        { source: '/recipe/page/:page', destination: '/blog/page/:page' },
        { source: '/recipe/category/:category', destination: '/blog/category/:category' },
        {
          source: '/recipe/category/:category/page/:page',
          destination: '/blog/category/:category/page/:page',
        },
        { source: '/recipe/:slug*', destination: '/blog/:slug*' },
      ]
    },

    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
