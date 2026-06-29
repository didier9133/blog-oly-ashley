import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";
import fs from "node:fs";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.dev https://clerk.dev https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://dgw9atod1ju2x.cloudfront.net https://cdn.pixabay.com https://*.clerk.dev",
      "connect-src 'self' https://*.clerk.dev https://clerk.dev https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      "frame-src 'self' https://*.clerk.dev",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

/**
 * Webpack plugin: copies a file into the build output at a fixed relative path.
 * Used to work around Next.js 15.5.19 + jsdom 26.x bug where a bundled chunk
 * does `readFileSync(path.resolve(__dirname, "../../browser/default-stylesheet.css"))`
 * but the file is never created in the build output. We read the source CSS
 * from the .pnpm-resolved jsdom 28.x and emit it under .next/browser/.
 */
class CopyToOutputPlugin {
  constructor(private src: string, private destRel: string) {}
  apply(compiler: {
    options: { output: { path?: string } };
    hooks: {
      afterEmit: {
        tapAsync: (
          name: string,
          fn: (
            compilation: unknown,
            callback: (err?: Error) => void,
          ) => void,
        ) => void;
      };
    };
  }) {
    compiler.hooks.afterEmit.tapAsync(
      "CopyToOutputPlugin",
      (_compilation, callback) => {
        const outDir = compiler.options.output.path ?? "";
        // The bundled chunk's __dirname is outDir/chunks/, and it does
        // `path.resolve(__dirname, "../../browser/default-stylesheet.css")`,
        // which resolves to outDir/../browser/ — i.e. one level above outDir.
        const parent = path.resolve(outDir, "..");
        const dest = path.join(parent, this.destRel);
        try {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(this.src, dest);
          callback();
        } catch (err) {
          callback(err as Error);
        }
      },
    );
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/photo/**",
      },
      {
        protocol: "https",
        hostname: "dgw9atod1ju2x.cloudfront.net",
        pathname: "/uploads/**",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Find jsdom's default-stylesheet in the pnpm store
      const pnpmJsdom = fs
        .readdirSync(path.resolve(__dirname, "node_modules/.pnpm"))
        .find((d) => d.startsWith("jsdom@"));
      if (pnpmJsdom) {
        const cssSrc = path.resolve(
          __dirname,
          `node_modules/.pnpm/${pnpmJsdom}/node_modules/jsdom/lib/jsdom/browser/default-stylesheet.css`,
        );
        if (fs.existsSync(cssSrc)) {
          config.plugins = [
            ...(config.plugins ?? []),
            new CopyToOutputPlugin(cssSrc, "browser/default-stylesheet.css"),
          ];
        }
      }
    }
    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)\\.(ico|svg|png|jpg|jpeg|gif|webp|avif|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingIncludes: {
    "/**": [
      "./.next/browser/default-stylesheet.css",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Allow larger uploads for private S3 files
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

