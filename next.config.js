/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s3.us-west-1.amazonaws.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SUPERADMIN: process.env.SUPERADMIN,
  },
};

module.exports = nextConfig;
