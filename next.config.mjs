/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para despliegue en Render
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
