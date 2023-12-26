/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:493722381,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"815a8c5038f71058810b0c026df12329",
  },
  images: {
    domains: ['lh3.googleusercontent.com',"localhost"],
  },
};

module.exports = nextConfig;
