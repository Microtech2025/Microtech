/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Use this for easier deployment or if you have many static assets
  },
};

export default nextConfig;
