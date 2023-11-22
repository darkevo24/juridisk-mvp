/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        protocol: "https",
      },
      {
        hostname: "cdn.openai.com",
        protocol: "https",
      },
    ],
  },
}

module.exports = nextConfig
