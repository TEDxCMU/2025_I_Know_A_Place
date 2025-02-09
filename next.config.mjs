/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI,
      },
};

export default nextConfig;
