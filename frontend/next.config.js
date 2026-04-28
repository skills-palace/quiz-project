/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "server-end-point.skillspalace.com",
      "skillspalace.com",
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;