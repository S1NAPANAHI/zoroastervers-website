/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enable ESLint during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable type checking during builds
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
