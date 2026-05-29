import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "i.pravatar.cc", "upload.wikimedia.org"],
  },
  typescript:{
    ignoreBuildErrors: true,
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
