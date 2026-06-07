const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  poweredByHeader: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: basePath(),
};

function basePath() {
  if (process.env.CI_PROJECT_NAMESPACE === undefined) {
    return '';
  }

  return `/${process.env.CI_PROJECT_NAMESPACE}/${process.env.CI_APP_NAME}`.trim();
}

module.exports = nextConfig;
