/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing CDN
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
