/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || "http://localhost:4000",
        BASE_URL: process.env.BASE_URL || "http://localhost:3000"
    }
};

module.exports = nextConfig;
