import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  cacheOnNavigation: true,
  disable: false, // Ensure service worker runs in dev for PWA testing
});

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16.
  // Serwist's withSerwist injects a webpack plugin, so we add an
  // empty turbopack config to silence the warning.
  turbopack: {},
  allowedDevOrigins: ['192.168.1.7'],
};

export default withSerwist(nextConfig);
