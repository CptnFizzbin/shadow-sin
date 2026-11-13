/**
 * Builds the client as a self-contained static site that can be published as a claude.ai Artifact,
 * then checks it and writes the arguments for the Artifact `publish` call. See
 * `.agents/skills/build-as-artifact/SKILL.md`.
 *
 * Usage:
 *   yarn tsx .agents/cli/build-as-artifact.ts [--out <dir>] [--mode development|production] [--no-smoke]
 */

import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { parseArgs } from "node:util"

import type { PublishManifest } from "./lib/artifactBuild.ts"
import {
  createPublishManifest,
  escapeReplacementCharactersInDir,
  findLimitProblems,
  findRootRelativeAssetReferences,
  formatBytes,
  hostOnlyFiles,
  readBuildFiles,
} from "./lib/artifactBuild.ts"
import { smokeTest } from "./lib/smokeTest.ts"

const repoRoot = path.resolve(import.meta.dirname, "../..")

const { values: options } = parseArgs({
  options: {
    "out": { type: "string", default: path.join(repoRoot, "dist", "artifact") },
    "mode": { type: "string", default: "development" },
    "no-smoke": { type: "boolean", default: false },
    "help": { type: "boolean", short: "h", default: false },
  },
})

if (options.help) {
  console.log("Usage: yarn tsx .agents/cli/build-as-artifact.ts [--out <dir>] [--mode development|production] [--no-smoke]")
  process.exit(0)
}

if (options.mode !== "development" && options.mode !== "production") {
  console.error(`--mode must be "development" or "production", not "${options.mode}"`)
  process.exit(1)
}

const outDir = path.resolve(options.out)
const manifestPath = `${outDir}.publish.json`

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim()
  } catch {
    return "unknown"
  }
}

function step(message: string) {
  console.log(`\n▶ ${message}`)
}

function fail(message: string): never {
  console.error(`\n✖ ${message}`)
  process.exit(1)
}

step(`Building (${options.mode}) into ${outDir}`)
execFileSync(
  path.join(repoRoot, "node_modules", ".bin", "vite"),
  ["build", "--mode", options.mode, "--base", "./", "--outDir", outDir, "--emptyOutDir", "--logLevel", "warn"],
  {
    cwd: repoRoot,
    stdio: "inherit",
    // `--mode` alone only picks the .env files; NODE_ENV is what selects React's development build.
    env: { ...process.env, NODE_ENV: options.mode },
  },
)

step("Removing host-only files")
for (const file of hostOnlyFiles) {
  const filePath = path.join(outDir, file)
  if (existsSync(filePath)) {
    rmSync(filePath)
    console.log(`  removed ${file}`)
  }
}

step("Escaping literal U+FFFD characters")
const escapedFiles = escapeReplacementCharactersInDir(outDir)
console.log(escapedFiles.length > 0 ? escapedFiles.map((file) => `  escaped in ${file}`).join("\n") : "  none found")

step("Checking Artifact limits and asset paths")
const files = readBuildFiles(outDir)
const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
console.log(`  ${files.length} files, ${formatBytes(totalBytes)}`)

const limitProblems = findLimitProblems(files)
if (limitProblems.length > 0) fail(`The build can't be published as one Artifact:\n  ${limitProblems.join("\n  ")}`)

const rootRelative = files
  .filter((file) => /\.(js|css|html)$/.test(file.path))
  .flatMap((file) => findRootRelativeAssetReferences(readFileSync(path.join(outDir, file.path), "utf8"))
    .map((reference) => `${file.path}: ${reference}`))
if (rootRelative.length > 0) fail(`Root-relative asset paths would 404 under the Artifact's sub-path:\n  ${rootRelative.join("\n  ")}`)
console.log("  ok")

if (options["no-smoke"]) {
  step("Skipping smoke test (--no-smoke)")
} else {
  step("Smoke-testing in headless Chromium from a sub-path")
  const result = await smokeTest(outDir)
  if (result.errors.length > 0) {
    fail(`Smoke test failed:\n  ${result.errors.join("\n  ")}`)
  } else {
    console.log(`  ok — landing page: "${result.landingText}"`)
  }
}

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"])
const commit = git(["rev-parse", "--short", "HEAD"])
const dirty = git(["status", "--porcelain"]) ? " + uncommitted changes" : ""

// The manifest sits beside `outDir`, so `--emptyOutDir` leaves the previous build's one in place to
// compare against.
const previousManifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8")) as PublishManifest
  : undefined

const manifest = createPublishManifest(outDir, files, {
  previous: previousManifest,
  description: `${options.mode === "development" ? "Development" : "Production"} build of the ShadowSIN client from ${branch} @ ${commit}${dirty}.`,
  label: `${branch} @ ${commit}`.slice(0, 60),
})
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

step("Done")
console.log(`  Publish manifest: ${manifestPath}`)
if (manifest.stale.length > 0) console.log(`  ${manifest.stale.length} paths from the previous build are stale (see "stale")`)
console.log("  Pass its file_path, root, files, description and label to the Artifact tool's publish call.")
