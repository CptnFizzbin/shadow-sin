#!/usr/bin/env node
/**
 * Verifies that every runner migration added in this PR has a `timestamp` newer than the base
 * branch's latest commit — see "Character migrations" in AGENTS.md.
 *
 * Usage:
 *   node check-migration-timestamps.mjs <base-ref>
 */

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const MIGRATIONS_DIR = "src/data/migrations/"

const [, , baseRef] = process.argv

if (!baseRef) {
  console.error("Usage: check-migration-timestamps.mjs <base-ref>")
  process.exit(1)
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

function addedMigrationFiles() {
  const diff = git(["diff", "--name-status", `${baseRef}...HEAD`, "--", MIGRATIONS_DIR])
  return diff
    .split("\n")
    .filter(Boolean)
    .filter((line) => line.startsWith("A") && !line.endsWith(".test.ts"))
    .map((line) => line.split("\t").at(-1))
}

function extractTimestamp(filePath) {
  const contents = readFileSync(filePath, "utf8")
  const match = /timestamp:\s*"([^"]+)"/.exec(contents)
  return match?.[1]
}

const baseCommitTimestamp = git(["log", "-1", "--format=%cI", baseRef])
const baseCommitMs = new Date(baseCommitTimestamp).getTime()

const addedFiles = addedMigrationFiles()

if (addedFiles.length === 0) {
  console.log("No new migration files in this PR — nothing to check.")
  process.exit(0)
}

let failed = false

console.log(`Base branch (${baseRef}) latest commit: ${baseCommitTimestamp}\n`)

for (const filePath of addedFiles) {
  const timestamp = extractTimestamp(filePath)

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

  if (timestampMs <= baseCommitMs) {
    console.error(
      `❌ ${filePath}: timestamp "${timestamp}" must be newer than the base branch's latest `
      + `commit ("${baseCommitTimestamp}"). Update the migration's \`timestamp\` field (and, by `
      + `convention, its filename prefix) to the current time.`,
    )
    failed = true
    continue
  }

  console.log(`✅ ${filePath}: timestamp "${timestamp}"`)
}

console.log()

if (failed) {
  console.error("❌ One or more new migrations have a timestamp that isn't newer than the base branch.")
  process.exit(1)
} else {
  console.log("✅ Migration timestamp check passed.")
}
