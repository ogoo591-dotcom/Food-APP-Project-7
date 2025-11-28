/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PUBLIC_BACKEND_URL: process.env.PUBLIC_BACKEND_URL || "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
