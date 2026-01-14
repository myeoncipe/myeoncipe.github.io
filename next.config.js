/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// 배포 환경인지 확인
const isProd = process.env.NODE_ENV === 'production'
const basePath = process.env.BASE_PATH || undefined

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // ✅ 정적 배포 설정
  output: isProd ? 'export' : undefined,
  basePath,
  reactStrictMode: true,
  trailingSlash: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // ✅ 오류를 일으키는 turbo, eslint experimental 설정 제거
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
    unoptimized: true, // output: export 시 필수
  },

  // ✅ 중요: output: export 환경에서는 headers와 rewrites를 사용할 수 없습니다.
  // 배포 서비스(Vercel, Netlify, Cloudflare 등)의 설정 파일에서 처리해야 합니다.

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

module.exports = withContentlayer(withBundleAnalyzer(nextConfig))
