/**
 * Rewrites fixture Runner `.sin` files in place: each one is parsed, run through every pending
 * migration, and re-exported, so the fixtures stay at the latest schema.
 *
 * Usage:
 *   yarn fixtures:update [--check] [file.sin ...]
 *
 * With no files, updates every `.sin` file in `src/data/fixtures/`. With `--check`, writes nothing
 * and exits non-zero if any file is out of date.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { parseArgs } from "node:util"

const repoRoot = path.resolve(import.meta.dirname, "../..")
const defaultFixtureDir = path.join(repoRoot, "src/data/fixtures")

const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    check: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
})

if (options.help) {
  console.log("Usage: yarn fixtures:update [--check] [file.sin ...]")
  process.exit(0)
}

// `src/data/appVersion.ts` reads a constant Vite normally injects at build time; this script runs
// outside Vite, so supply it before loading any app code (hence the dynamic import below).
Object.assign(globalThis, { __APP_VERSION__: new Date().toISOString() })
const { runnerDataToYaml, yamlToRunnerData } = await import("#/components/system/exportImport/exportUtils.ts")

const files = positionals.length > 0
  ? positionals.map((file) => path.resolve(file))
  : readdirSync(defaultFixtureDir)
      .filter((file) => file.endsWith(".sin"))
      .map((file) => path.join(defaultFixtureDir, file))

const outdated: string[] = []

for (const file of files) {
  const relativePath = path.relative(repoRoot, file)
  const original = readFileSync(file, "utf8")
  const runner = yamlToRunnerData(original)
  // A migration run stamps the live app version, which would make every update look like a change.
  const updated = runnerDataToYaml({ ...runner, _meta_: { ...runner._meta_, appVersion: null } })

  if (updated === original) {
    console.log(`  up to date  ${relativePath}`)
    continue
  }

  outdated.push(relativePath)
  if (options.check) {
    console.log(`  outdated    ${relativePath}`)
  } else {
    writeFileSync(file, updated)
    console.log(`  updated     ${relativePath}`)
  }
}

if (options.check && outdated.length > 0) {
  console.error(`\n${outdated.length} fixture(s) out of date — run \`yarn fixtures:update\`.`)
  process.exit(1)
}
