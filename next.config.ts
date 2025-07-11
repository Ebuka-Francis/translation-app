// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */
   env: {
      NEXT_PUBLIC_BACKEND_API: 'https://igbo-translator-backend.onrender.com',
   },
};

export default nextConfig;
