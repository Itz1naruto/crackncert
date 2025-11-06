import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed redirect to allow landing page at "/"
  // Authenticated users are redirected client-side in page.tsx

  async redirects() {
    return [
      // SEO redirects - handle common 404 errors and broken routes
      {
        source: '/home',
        destination: '/',
        permanent: true, // 308 permanent redirect for SEO
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
