import { describe, expect, it } from "vitest"

import { runnerDataToYaml, yamlToRunnerData } from "#/components/runner/exportImport/exportUtils.ts"
import { toJsonValue } from "#/lib/jsonUtils.ts"
import { getItemCatalog } from "#/system/runnerTraits.ts"
import BlurYaml from "#testUtils/fixtures/characters/blur.yaml?raw"
import {
  characterV0,
  characterV1,
  TEST_CHARACTER_ID,
  TEST_LOAN_ID,
  TEST_OLD_FORMAT_CHARACTER_ID,
  TEST_OLD_FORMAT_LICENSE_ID,
  TEST_OLD_FORMAT_SIN_ID,
} from "#testUtils/fixtures/characters/runnerDataFixtures.ts"
import { makeTestRunnerManager } from "#testUtils/storage/makeTestRunnerManager.ts"

import { APP_VERSION } from "./appVersion.ts"

// Each test seeds its own manager/storage (rather than sharing one from `beforeEach`) so the
// suite can run concurrently.
async function makeMigratedRunnerManager() {
  const { manager, storage } = makeTestRunnerManager()
  await storage.setItem(
    `characters/${TEST_CHARACTER_ID}`,
    toJsonValue(characterV1),
  )
  return { manager, storage }
}

describe.concurrent("runner migrations + yaml round-trip", () => {
  it("applies all pending migrations to a partially-migrated runner", async () => {
    // Arrange — a runner at legacy _meta_.version 7
    const { manager } = await makeMigratedRunnerManager()

    // Act
    const migrated = await manager.getRunner(TEST_CHARACTER_ID)

    // Assert
    expect(migrated._meta_.appVersion).toBe(APP_VERSION)
    expect("version" in (migrated as object)).toBe(false)
  })

  it("migrates a fully-shaped runner that has no _meta_ field at all", async () => {
    // Arrange — a runner already carrying every field the migrations would add, but never
    // stamped with `_meta_` (e.g. hand-authored or created before the field existed at all)
    const { _meta_, ...withoutMeta } = characterV1
    const { manager: freshManager, storage: freshStorage } = makeTestRunnerManager()
    await freshStorage.setItem(
      `characters/${TEST_CHARACTER_ID}`,
      toJsonValue(withoutMeta),
    )

    // Act
    const migrated = await freshManager.getRunner(TEST_CHARACTER_ID)

    // Assert — treated as unmigrated (appVersion defaults to the epoch) but every migration is
    // idempotent, so it still lands at the current app version with no error
    expect(migrated._meta_.appVersion).toBe(APP_VERSION)
  })

  it("safely re-runs every migration for a runner still on the legacy _meta_.version scheme", async () => {
    // Arrange — characterV1 is shaped as if migrations 001–007 (legacy version 7) had already
    // run, with a loan carrying a known stable ID; a legacy `version` is treated as unmigrated,
    // so all 32 migrations run again — every one is idempotent, so this doesn't change the data
    const { manager: freshManager, storage: freshStorage } = makeTestRunnerManager()
    await freshStorage.setItem(
      `characters/${TEST_CHARACTER_ID}`,
      toJsonValue(characterV1),
    )

    // Act
    const migrated = await freshManager.getRunner(TEST_CHARACTER_ID)

    // Assert — loan ID unchanged (addLoanIdAndInterestRate only assigns one when missing)
    expect(migrated.nuyen.loans[0]?.id).toBe(TEST_LOAN_ID)
    expect(migrated._meta_.appVersion).toBe(APP_VERSION)
  })

  it("yaml export/import round-trips a fully migrated runner", async () => {
    // Arrange — migrate the partially-migrated runner
    const { manager } = await makeMigratedRunnerManager()
    const migrated = await manager.getRunner(TEST_CHARACTER_ID)

    // Act
    const yaml = runnerDataToYaml(migrated)
    const restored = yamlToRunnerData(yaml)

    // Assert — scalar fields survive the round-trip
    expect(restored.id).toBe(migrated.id)
    expect(restored._meta_).toEqual(migrated._meta_)
    expect(restored.nuyen).toEqual(migrated.nuyen)
    expect(restored.spells).toEqual(migrated.spells)
  })

  it("yaml-imported runner is already at the current version", async () => {
    // Arrange — migrate then export/import
    const { manager } = await makeMigratedRunnerManager()
    const migrated = await manager.getRunner(TEST_CHARACTER_ID)
    const yaml = runnerDataToYaml(migrated)
    const restored = yamlToRunnerData(yaml)

    // Save the restored (already-migrated) runner into fresh storage
    const { manager: freshManager, storage: freshStorage } = makeTestRunnerManager()
    await freshStorage.setItem(`characters/${restored.id}`, toJsonValue(restored))

    // Act — loading should not re-run any migrations
    const reloaded = await freshManager.getRunner(restored.id)

    // Assert
    expect(reloaded._meta_.appVersion).toBe(migrated._meta_.appVersion)
  })

  it("normalises an old-format runner into the current RunnerData shape", async () => {
    // Arrange — save the old-format runner into fresh storage
    const { manager: freshManager, storage: freshStorage } = makeTestRunnerManager()
    await freshStorage.setItem(
      `characters/${TEST_OLD_FORMAT_CHARACTER_ID}`,
      toJsonValue(characterV0),
    )

    // Act
    const migrated = await freshManager.getRunner(TEST_OLD_FORMAT_CHARACTER_ID)

    // Assert — runner loaded without error

    // id migrated from runnerId
    expect(migrated.id).toBe(TEST_OLD_FORMAT_CHARACTER_ID)

    // profile/biology populated from flat fields
    expect(migrated.profile.alias).toBe("Blur")
    expect(migrated.profile.name).toBe("Long")
    expect(migrated.profile.lifestyle).toEqual({ quality: "Low", monthsPaid: 3 })
    expect(migrated.biology.metatype).toBe("Human")
    expect(migrated.biology.awakening).toBe("Mystic Adept")
    expect(migrated.biology.age).toBe(0)

    // attributes are flat numbers
    expect(migrated.attributes.body).toBe(4)
    expect(migrated.attributes.agility).toBe(5)
    expect(migrated.attributes.magic).toBe(5)
    expect(migrated.attributes.essence).toBe(6)

    // skill groups use `name` instead of `groupName`
    expect(migrated.skills.skillGroups).toHaveLength(1)
    expect(migrated.skills.skillGroups[0].name).toBe("Athletics")
    expect(migrated.skills.skillGroups[0].rating).toBe(2)

    // native language skill uses `"native"` rating
    const english = migrated.skills.languageSkills.find((s) => s.name === "English")
    expect(english?.rating).toBe("native")
    const sylvan = migrated.skills.languageSkills.find((s) => s.name === "Sylvan")
    expect(sylvan?.rating).toBe(4)

    // spells promoted from awakened to top-level
    expect(migrated.spells).toHaveLength(2)
    expect(migrated.powers).toHaveLength(4)
    expect(migrated.complexForms).toHaveLength(0)

    // gear is a Record, empty items stripped, itemTypes normalised
    const gearValues = Object.values(getItemCatalog(migrated))
    const weapon = gearValues.find((item) => item.name === "SM-4")
    expect(weapon?.itemType).toBe("weapon")
    const device = gearValues.find((item) => item.name === "Contact Lenses 3")
    expect(device?.itemType).toBe("device")
    const other = gearValues.find((item) => item.name === "Power Foci 2")
    expect(other?.itemType).toBe("other")
    const vehicle = gearValues.find((item) => item.name === "Indian Pathfinder")
    expect(vehicle?.itemType).toBe("vehicle")

    // license linked to SIN via parentId
    const sin = getItemCatalog(migrated)[TEST_OLD_FORMAT_SIN_ID]
    expect(sin).toBeDefined()
    expect(sin.itemType).toBe("sin")
    const license = getItemCatalog(migrated)[TEST_OLD_FORMAT_LICENSE_ID]
    expect(license).toBeDefined()
    expect(license.itemType).toBe("license")
    expect(license.items.parentId).toBe(TEST_OLD_FORMAT_SIN_ID)
    expect(sin.items.childIds).toContain(TEST_OLD_FORMAT_LICENSE_ID)

    // fully migrated
    expect(migrated._meta_.appVersion).toBe(APP_VERSION)
  })

  it("imports blur.yaml (v0 export) via yamlToRunnerData into a valid RunnerData", () => {
    // Act
    const runner = yamlToRunnerData(BlurYaml)

    // Assert — top-level RunnerData fields
    expect(runner.id).toBe("00000000-0000-0000-0000-000000000000")
    expect(runner.profile.alias).toBe("Blur")
    expect(runner.profile.name).toBe("Long")
    expect(runner.profile.lifestyle).toEqual({ quality: "Low", monthsPaid: 3 })
    expect(runner.biology.metatype).toBe("Human")
    expect(runner.biology.awakening).toBe("Mystic Adept")

    // attributes are flat numbers
    expect(runner.attributes.body).toBe(4)
    expect(runner.attributes.agility).toBe(5)
    expect(runner.attributes.magic).toBe(5)

    // skills migrated
    expect(runner.skills.skillGroups).toHaveLength(1)
    expect(runner.skills.skillGroups[0].name).toBe("Athletics")
    const english = runner.skills.languageSkills.find((s) => s.name === "English")
    expect(english?.rating).toBe("native")

    // spells promoted from awakened wrapper
    expect(runner.spells).toHaveLength(2)
    expect(runner.powers).toHaveLength(4)

    // gear is a Record, empty entries stripped, itemTypes normalised
    const gearValues = Object.values(getItemCatalog(runner))
    expect(gearValues.find((item) => item.name === "SM-4")?.itemType).toBe("weapon")
    expect(gearValues.find((item) => item.name === "Contact Lenses 3")?.itemType).toBe("device")
    expect(gearValues.find((item) => item.name === "Power Foci 2")?.itemType).toBe("other")

    // license linked to its parent SIN
    const sin = gearValues.find((item) => item.itemType === "sin")
    const license = gearValues.find((item) => item.itemType === "license")
    expect(sin).toBeDefined()
    expect(license).toBeDefined()
    expect(license!.items.parentId).toBe(sin!.id)
    expect(sin!.items.childIds).toContain(license!.id)

    // fully migrated
    expect(runner._meta_.appVersion).toBe(APP_VERSION)
  })
})
