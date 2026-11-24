/** @type {import('next').NextConfig} */

// روی GitHub Pages سایت زیر /<repo-name>/ سرو می‌شود.
// هنگام بیلد برای انتشار: NEXT_PUBLIC_BASE_PATH=/franchise-plus
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
