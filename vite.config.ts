/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

import { nodeEnv } from "./env.node.ts"

console.log(`Building ${nodeEnv.VITE_APP_TITLE}...`)

const config = defineConfig({
  server: {
    host: nodeEnv.SERVER_HOST,
    port: nodeEnv.SERVER_PORT,
  },

  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    devtools(),
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      // Use the existing public/manifest.json rather than having the plugin
      // generate one — this lets us maintain full manual control over the
      // manifest fields (icons, display, theme colours, etc.).
      manifest: false,
      workbox: {
        // Cache the app shell and static assets for offline use
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // Network-first for navigation (always fetch fresh HTML when online)
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Cache Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            // Cache Google Fonts webfont files long-term
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year in seconds
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  test: {
    include: ["**/*.test.{ts,tsx}"],
    environment: "happy-dom",
    // Concurrent test execution is disabled because tests using
    // `vi.useFakeTimers()` (notably `src/system/dice/diceRoller.test.ts`)
    // share a global timer mock and can interleave when run in parallel.
    sequence: {
      concurrent: false,
    },
  },
})

export default config
