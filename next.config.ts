/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing CDN
        port: "",
        pathname: "/**",     // Allow all image paths from utfs.io
      },
    ],
  },
};

export default nextConfig;
