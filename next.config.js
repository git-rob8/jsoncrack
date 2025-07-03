/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    config.experiments = { asyncWebAssembly: true, layers: true };

    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
    }

    return config;
  },
};

module.exports = nextConfig;