/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["https://test21.lucho.uk", "http://localhost:3000"],
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
        {
          protocol: "https",
          hostname: "content.stack-auth.com",
        },
      ],
    },
  },
};

export default nextConfig;
