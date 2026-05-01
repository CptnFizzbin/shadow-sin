#!/usr/bin/env node
/**
 * Compares two vitest coverage-summary.json files and fails if any tracked
 * metric (lines, branches, functions, statements) has dropped by more than
 * MAX_DROP_PERCENTAGE_POINTS
 *
 * Usage:
 *   node check-coverage.mjs <base-summary.json> <pr-summary.json>
 */

import { readFileSync } from "fs"

const MAX_DROP_PERCENTAGE_POINTS = 5

const [, , basePath, prPath] = process.argv

if (!basePath || !prPath) {
  console.error("Usage: check-coverage.mjs <base-summary.json> <pr-summary.json>")
  process.exit(1)
}

function readSummary(filePath) {
  const raw = JSON.parse(readFileSync(filePath, "utf8"))
  return raw.total
}

const baseTotal = readSummary(basePath)
const prTotal = readSummary(prPath)

const metrics = ["lines", "branches", "functions", "statements"]

let failed = false

console.log("\n📊 Coverage comparison (base → PR):\n")
console.log(
  `${"Metric".padEnd(12)} ${"Base".padStart(7)} ${"PR".padStart(7)} ${"Δ".padStart(7)}`,
)
console.log("─".repeat(38))

for (const metric of metrics) {
  const basePct = baseTotal[metric].pct
  const prPct = prTotal[metric].pct
  const delta = prPct - basePct
  const sign = delta >= 0 ? "+" : ""
  const flag = delta < -MAX_DROP_PERCENTAGE_POINTS ? " ❌" : delta < 0 ? " ⚠️" : " ✅"

  console.log(
    `${metric.padEnd(12)} ${`${basePct.toFixed(2)}%`.padStart(7)} ${`${prPct.toFixed(2)}%`.padStart(7)} ${`${sign}${delta.toFixed(2)}%`.padStart(7)}${flag}`,
  )

  if (delta < -MAX_DROP_PERCENTAGE_POINTS) {
    failed = true
  }
}

console.log()

if (failed) {
  console.error(
    `❌ Coverage dropped by more than ${MAX_DROP_PERCENTAGE_POINTS} percentage points in one or more metrics. Please add tests to cover the new code.`,
  )
  process.exit(1)
} else {
  console.log("✅ Coverage check passed.")
}
