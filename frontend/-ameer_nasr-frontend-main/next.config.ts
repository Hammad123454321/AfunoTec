import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Required by the production Docker image (./Dockerfile).
  // Emits a self-contained server at .next/standalone so the runtime
  // image only needs to ship the server + .next/static + public.
  output: "standalone",
  images: {
    domains: ["images.unsplash.com", "i.pravatar.cc", "upload.wikimedia.org"],
  },
  typescript:{
    ignoreBuildErrors: true,
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
