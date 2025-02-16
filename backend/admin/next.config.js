/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https://localhost:* http://localhost:*",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:* https://localhost:*",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://localhost:* https://localhost:*",
              "font-src 'self' https://fonts.gstatic.com https://use.typekit.net data: http://localhost:* https://localhost:*",
              "connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://fonts.googleapis.com https://fonts.gstatic.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "manifest-src 'self'",
              "block-all-mixed-content",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()"
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          }
        ],
      },
    ]
  },
  // Development server configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve development error overlay
      config.devServer = {
        ...config.devServer,
        hot: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        client: {
          overlay: {
            errors: true,
            warnings: false,
          },
        },
      }
    }

    // Add rule to block unwanted external requests
    if (!isServer) {
      config.module = {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.(js|jsx|ts|tsx)$/,
            enforce: 'pre',
            use: [
              {
                loader: 'string-replace-loader',
                options: {
                  search: 's1.npass.app',
                  replace: 'localhost:3000',
                  flags: 'g'
                }
              }
            ]
          }
        ]
      }
    }

    return config
  },
}

module.exports = nextConfig 