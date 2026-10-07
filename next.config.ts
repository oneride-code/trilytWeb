import type { NextConfig } from "next";

/**
 * The oneRyde backend, which owns the invite landing page and the API.
 * Override with BACKEND_ORIGIN if the API ever moves.
 */
const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN ?? "https://oneryde-api.fly.dev";

const nextConfig: NextConfig = {
  // Self-contained server bundle, so the Docker image doesn't ship node_modules.
  output: "standalone",

  // Pin the workspace root — otherwise Next walks up and picks up a stray
  // package-lock.json in the home directory.
  turbopack: {
    root: __dirname,
  },

  /**
   * The Instagram carousel points at the short, memorable /rides. Until there
   * are several listings to index, send it to the one that's on sale — 307 not
   * 308, so this becomes a real index page later without a cached redirect
   * fighting it.
   */
  async redirects() {
    return [
      {
        source: "/rides",
        destination: "/rides/kolli-hills",
        permanent: false,
      },
    ];
  },

  /**
   * trilyt.com was serving the backend before this site took the domain over.
   * Invite links and QR codes already in the wild point at
   * https://trilyt.com/join/{code}, and the shipped app cannot be changed
   * without a store release — so those paths must keep working byte-for-byte.
   *
   * These are rewrites, not redirects: the URL the user sees stays on
   * trilyt.com, and the backend remains the single source of truth for the
   * page. /api is proxied as defensive cover for any caller we don't know
   * about; the mobile app talks to the backend directly and does not rely on it.
   */
  async rewrites() {
    return [
      {
        source: "/join/:path*",
        destination: `${BACKEND_ORIGIN}/join/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
