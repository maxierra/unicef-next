/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para despliegue en Render
  output: 'standalone',
  // Indicar explícitamente la ubicación del directorio src
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
