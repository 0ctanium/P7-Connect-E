/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: { esmExternals: true },
  images: {
    domains: ['oct-groupomania.s3.eu-west-3.amazonaws.com'],
  }
}

module.exports = nextConfig
