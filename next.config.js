/** @type {import('next').NextConfig} */
const nextConfig = {
  // The appDir option is no longer needed in Next.js 14
  // as the app directory is enabled by default
  images: {
    domains: ['img.logo.dev'],
  },
}

module.exports = nextConfig