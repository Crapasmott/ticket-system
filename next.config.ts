const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',  // ← agrega esta línea
}

module.exports = nextConfig