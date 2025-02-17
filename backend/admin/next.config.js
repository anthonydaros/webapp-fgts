/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita o modo estrito do React para melhor detecção de problemas
  reactStrictMode: true,

  // Habilita minificação com SWC (compilador Rust) para melhor performance
  swcMinify: true,

  // Configura o build para ser standalone (pode ser executado independentemente)
  output: 'standalone',

  // Configuração de domínios permitidos para imagens
  images: {
    domains: ['localhost'],
  },

  // Configuração de headers HTTP para segurança
  async headers() {
    return [
      {
        // Aplica headers para todas as rotas
        source: '/:path*',
        headers: [
          {
            // Content Security Policy (CSP) para proteger contra XSS e outros ataques
            key: 'Content-Security-Policy',
            value: [
              // Permite carregar recursos apenas da mesma origem
              "default-src 'self'",
              // Permite imagens de fontes específicas
              "img-src 'self' data: blob: https://localhost:* http://localhost:*",
              // Permite scripts com algumas exceções necessárias
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' http://localhost:* https://localhost:*",
              // Permite estilos com fontes do Google
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://localhost:* https://localhost:*",
              // Permite fontes de fontes específicas
              "font-src 'self' https://fonts.gstatic.com https://use.typekit.net data: http://localhost:* https://localhost:*",
              // Permite conexões WebSocket e APIs
              "connect-src 'self' http://localhost:* https://localhost:* ws://localhost:* wss://localhost:* https://fonts.googleapis.com https://fonts.gstatic.com",
              // Previne clickjacking
              "frame-ancestors 'none'",
              // Restringe URIs base
              "base-uri 'self'",
              // Restringe formulários
              "form-action 'self'",
              // Restringe manifestos
              "manifest-src 'self'",
              // Bloqueia conteúdo misto
              "block-all-mixed-content",
              // Força HTTPS
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // Previne clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Previne MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Controla como o referrer é enviado
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Restringe features do navegador
          {
            key: 'Permissions-Policy',
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()"
          },
          // Isolamento de processos
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // Requer CORS para recursos
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          // Política de recursos cross-origin
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          }
        ],
      },
    ]
  },

  // Configuração do webpack para desenvolvimento
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Melhora o overlay de erros em desenvolvimento
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

    // Adiciona regra para bloquear requisições externas indesejadas
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