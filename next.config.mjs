/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ 정적 사이트로 export 하게 설정 추가

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true, 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
