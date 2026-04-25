import path from "node:path"
import { fileURLToPath } from "node:url"

import { createEnv } from "@t3-oss/env-core"
import dotenv from "dotenv"
import { z } from "zod"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({
  override: true,
  quiet: true,
  path: [
    path.resolve(rootDir, ".env.production"),
    path.resolve(rootDir, ".env"),
  ],
})

export const nodeEnv = createEnv({
  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: z.string().min(1).default("ShadowSIN"),
  },

  server: {
    CI: z.stringbool().default(false),
    SERVER_HOST: z.string().default("localhost"),
    SERVER_PORT: z.coerce.number().default(3000),
  },

  createFinalSchema: (shape) =>
    z.object(shape).transform((env) => {
      return {
        ...env,
        SERVER_URL: `http://${env.SERVER_HOST}:${env.SERVER_PORT}`,
      }
    }),

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
