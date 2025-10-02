/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['ecommerceimagens.s3.sa-east-1.amazonaws.com', 'www.mcnsistemas.com.br'],
  },
}

module.exports = nextConfig 