import { yamlToRunnerData } from "#/data/exportImport/exportUtils.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"

// Every `.sin` file beside this module is a fixture Runner — dropping a new export in here is all
// it takes to seed it. Keep them current with `yarn fixtures:update`.
const fixtureFiles = import.meta.glob("./*.sin", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

/** The raw YAML of every fixture Runner, keyed by file name without the `.sin` extension (e.g. `"razor"`). */
export const fixtureRunnerYaml: Record<string, string> = Object.fromEntries(
  Object.entries(fixtureFiles).map(([path, yaml]) => [path.replace(/^.*\//, "").replace(/\.sin$/, ""), yaml]),
)

/**
 * Parses and migrates every fixture Runner. Each call returns fresh {@link RunnerData} objects, so callers
 * may mutate them freely.
 */
export function loadFixtureRunners(): RunnerData[] {
  return Object.values(fixtureRunnerYaml).map((yaml) => yamlToRunnerData(yaml))
}

/**
 * Parses and migrates the fixture Runner stored in `<fileName>.sin`.
 *
 * @example
 * const razor = loadFixtureRunner("razor")
 */
export function loadFixtureRunner(fileName: string): RunnerData {
  const yaml = fixtureRunnerYaml[fileName]
  if (yaml === undefined) throw new Error(`No fixture Runner named "${fileName}.sin"`)
  return yamlToRunnerData(yaml)
}
