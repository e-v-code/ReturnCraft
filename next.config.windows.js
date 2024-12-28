/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 기존 설정 ...
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'punycode': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 