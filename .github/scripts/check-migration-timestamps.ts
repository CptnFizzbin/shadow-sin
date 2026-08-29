#!/usr/bin/env -S npx tsx
/**
 * Verifies that every runner migration added in this PR has a `timestamp` newer than the base
 * branch's SIN version — i.e. newer than every migration already registered on the base branch —
 * see "Character migrations" in AGENTS.md.
 *
 * Usage:
 *   npx tsx check-migration-timestamps.ts <base-ref>
 */

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const MIGRATIONS_DIR = "src/data/migrations/"

/** Mirrors `RUNNER_META_EPOCH` (`src/system/runnerData.ts`) — the sentinel SIN version for a base branch with no registered migrations at all. */
const RUNNER_META_EPOCH = "1970-01-01T00:00:00.000Z"

const [, , baseRef] = process.argv

if (!baseRef) {
  console.error("Usage: check-migration-timestamps.ts <base-ref>")
  process.exit(1)
}

function git(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

function isMigrationFile(path: string): boolean {
  return path.endsWith(".ts") && !path.endsWith(".test.ts")
}

function extractTimestamp(contents: string): string | undefined {
  const match = /timestamp:\s*"([^"]+)"/.exec(contents)
  return match?.[1]
}

function addedMigrationFiles(): string[] {
  const diff = git(["diff", "--name-status", `${baseRef}...HEAD`, "--", MIGRATIONS_DIR])
  return diff
    .split("\n")
    .filter(Boolean)
    .filter((line) => line.startsWith("A"))
    .map((line) => line.split("\t").at(-1) as string)
    .filter(isMigrationFile)
}

/**
 * The SIN version the base branch produces once fully migrated — the highest `timestamp` among
 * every migration already registered there (mirrors `LATEST_MIGRATION_TIMESTAMP`,
 * `src/data/migrations.ts`), or {@link RUNNER_META_EPOCH} if the base branch has none yet.
 */
function baseSinVersion(): string {
  const paths = git(["ls-tree", "-r", "--name-only", baseRef, "--", MIGRATIONS_DIR])
    .split("\n")
    .filter(Boolean)
    .filter(isMigrationFile)

  const timestamps = paths
    .map((path) => extractTimestamp(git(["show", `${baseRef}:${path}`])))
    .filter((timestamp): timestamp is string => Boolean(timestamp))

  if (timestamps.length === 0) return RUNNER_META_EPOCH

  return timestamps.reduce((latest, timestamp) => (
    new Date(timestamp).getTime() > new Date(latest).getTime() ? timestamp : latest
  ))
}

const baseSinVersionValue = baseSinVersion()
const baseSinVersionMs = new Date(baseSinVersionValue).getTime()

const addedFiles = addedMigrationFiles()

if (addedFiles.length === 0) {
  console.log("No new migration files in this PR — nothing to check.")
  process.exit(0)
}

let failed = false

console.log(`Base branch (${baseRef}) SIN version: ${baseSinVersionValue}\n`)

for (const filePath of addedFiles) {
  const timestamp = extractTimestamp(readFileSync(filePath, "utf8"))

  if (!timestamp) {
    console.error(`❌ ${filePath}: could not find a \`timestamp\` field.`)
    failed = true
    continue
  }

  const timestampMs = new Date(timestamp).getTime()

  if (Number.isNaN(timestampMs)) {
    console.error(`❌ ${filePath}: \`timestamp: "${timestamp}"\` is not a valid date.`)
    failed = true
    continue
  }

  if (timestampMs <= baseSinVersionMs) {
    console.error(
      `❌ ${filePath}: timestamp "${timestamp}" must be newer than the base branch's SIN version `
      + `("${baseSinVersionValue}") — the newest \`timestamp\` among migrations already registered `
      + `there. Otherwise a runner already fully migrated on the base branch would never see this `
      + `migration run (\`migration.timestamp > _meta_.sinVersion\` would never be true for it). `
      + `Update the migration's \`timestamp\` field (and, by convention, its filename prefix) to `
      + `the current time.`,
    )
    failed = true
    continue
  }

  console.log(`✅ ${filePath}: timestamp "${timestamp}"`)
}

console.log()

if (failed) {
  console.error("❌ One or more new migrations have a timestamp that isn't newer than the base branch's SIN version.")
  process.exit(1)
} else {
  console.log("✅ Migration timestamp check passed.")
}
