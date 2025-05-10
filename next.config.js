/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ← هذا يجب أن يكون في الجذر، وليس داخل eslint

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
