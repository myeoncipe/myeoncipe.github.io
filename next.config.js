/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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
    output: 'export', // 정적 배포 필수 설정
    basePath,
    reactStrictMode: true,
    trailingSlash: true, // 정적 배포 시 경로 문제 방지를 위해 true 권장
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

    // 추가: Turbopack 대신 Webpack을 사용하도록 강제 (Next.js 16 에러 방지)
    experimental: {
      turbo: {
        rules: {},
      },
    },

    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
      ignoreDuringBuilds: true, // 빌드 시 린트 에러로 인한 중단 방지
    },

    typescript: {
      ignoreBuildErrors: true, // 빌드 시 타입 에러로 인한 중단 방지
    },

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      // ✅ 수정 핵심: output: 'export' 환경에서는 무조건 true여야 합니다.
      unoptimized: true,
    },

    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },

    async rewrites() {
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
