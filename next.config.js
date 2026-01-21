/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: 'export', // Disabled for Netlify Functions support
  trailingSlash: true,
  images: {
    unoptimized: true
  },
};

module.exports = nextConfig;
