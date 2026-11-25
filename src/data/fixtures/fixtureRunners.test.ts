import { load } from "js-yaml"
import { describe, expect, it } from "vitest"

import type { JsonObject } from "#/common/json/jsonUtils.ts"
import { MetatypeType } from "#/data/biology/metatypeData.ts"
import { ImplantType, isImplant } from "#/data/items/implantData.ts"
import { isFocusData } from "#/data/items/magicalData.ts"
import { isVehicleData, VehicleCategory } from "#/data/items/vehicleData.ts"
import { SpiritDataSchema } from "#/data/magic/spiritData.ts"
import { LATEST_MIGRATION_TIMESTAMP } from "#/data/migrations/migrations.ts"
import { AdeptPowerDataSchema } from "#/data/powers/adeptPowerData.ts"
import { getItemCatalog } from "#/data/runner/runnerTraits.ts"

import { fixtureRunnerYaml, loadFixtureRunner, loadFixtureRunners } from "./fixtureRunners.ts"

const items = (fileName: string) => Object.values(getItemCatalog(loadFixtureRunner(fileName)))

describe.concurrent("fixture Runners", () => {
  it.each(Object.entries(fixtureRunnerYaml))("%s.sin is stored at the latest schema", (_name, yaml) => {
    // Arrange / Act
    const stored = load(yaml) as { _meta_: JsonObject }

    // Assert — otherwise `yarn fixtures:update` hasn't been run since the last migration
    expect(stored._meta_.sinVersion).toBe(LATEST_MIGRATION_TIMESTAMP)
  })

  it("gives every fixture Runner a unique id", () => {
    // Arrange / Act
    const ids = loadFixtureRunners().map((runner) => runner.id)

    // Assert
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("stores valid adept powers and spirits on every fixture Runner", () => {
    // Arrange / Act
    const runners = loadFixtureRunners()

    // Assert
    for (const runner of runners) {
      for (const power of runner.powers) expect(AdeptPowerDataSchema.safeParse(power).success).toBe(true)
      for (const spirit of runner.spirits) expect(SpiritDataSchema.safeParse(spirit).success).toBe(true)
    }
  })

  it("includes a face with bioware", () => {
    // Arrange / Act
    const bioware = items("silk").filter((item) => isImplant(item) && item.implantType === ImplantType.bioware)

    // Assert
    expect(bioware.length).toBeGreaterThan(1)
  })

  it("includes a street samurai with cyberware", () => {
    // Arrange / Act
    const cyberware = items("razor").filter((item) => isImplant(item) && item.implantType === ImplantType.cyberware)

    // Assert
    expect(cyberware.length).toBeGreaterThan(1)
  })

  it("includes an adept with powers", () => {
    // Arrange / Act
    const { powers } = loadFixtureRunner("kestrel")

    // Assert
    expect(powers.length).toBeGreaterThan(1)
  })

  it("includes a magician with multiple bonded foci", () => {
    // Arrange / Act
    const bondedFoci = items("ashgrove").filter((item) => isFocusData(item) && item.bonded)

    // Assert
    expect(bondedFoci.length).toBeGreaterThan(1)
  })

  it("includes a summoner with spirits", () => {
    // Arrange / Act
    const { spirits } = loadFixtureRunner("mossback")

    // Assert
    expect(spirits.length).toBeGreaterThan(1)
  })

  it("includes a rigger with drones", () => {
    // Arrange / Act
    const drones = items("gearbox").filter((item) => isVehicleData(item) && item.vehicleCategory === VehicleCategory.drone)

    // Assert
    expect(drones.length).toBeGreaterThan(1)
  })

  it("includes an AI on an active home node", () => {
    // Arrange / Act
    const echo = loadFixtureRunner("echo")

    // Assert
    expect(echo.biology.metatype).toBe(MetatypeType.AI)
    expect(echo.gameState.matrix.knownNodes.map((node) => node.id)).toContain(echo.gameState.matrix.activeNodeId)
  })

  it("includes a Pixie", () => {
    // Arrange / Act
    const thistle = loadFixtureRunner("thistle")

    // Assert
    expect(thistle.biology.metatype).toBe(MetatypeType.Pixie)
  })
})
