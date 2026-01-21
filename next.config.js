/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // Enable for Netlify deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  },
};

module.exports = nextConfig;
