import { describe, expect, it } from "vitest"

import { AttributeKey } from "#data/attributes/attributeKey.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { getItemCatalog } from "#data/runner/runnerTraits.ts"
import { SkillKey } from "#data/skills/skillKey.ts"

import { SkillPoolSelectors } from "./skillPools.selector.ts"

const lockpickerState = (locksmithRating: number) => {
  const runner = runnerDataFactory({ afterBuild: (s) => {
    s.skills.activeSkills = [{ name: SkillKey.locksmith, rating: locksmithRating }]
  } })
  return { runner, entity: runner, items: getItemCatalog(runner) }
}

const aidGroups = (groups: { name: string, size: number }[]) =>
  groups.filter(({ name }) => name.startsWith("Aid:") || name === "Teamwork limit").map(({ name, size }) => [name, size])

describe.concurrent("SkillPoolSelectors.selectActiveSkillTest aid", () => {
  it("adds a die per assistant hit and a spirit's Force", () => {
    // Arrange
    const state = lockpickerState(4)

    // Act
    const pool = SkillPoolSelectors.selectActiveSkillTest(state, {
      skill: SkillKey.locksmith,
      attr: AttributeKey.agility,
      aid: [
        { kind: "teamwork", name: "Twitch", hits: 2 },
        { kind: "spirit", name: "Watcher", force: 1 },
      ],
    })

    // Assert
    expect(aidGroups(pool.groups)).toEqual([["Aid: Twitch", 2], ["Aid: Watcher", 1]])
  })

  it("takes back Teamwork dice beyond the leader's skill Rating", () => {
    // Arrange
    const state = lockpickerState(2)

    // Act
    const pool = SkillPoolSelectors.selectActiveSkillTest(state, {
      skill: SkillKey.locksmith,
      attr: AttributeKey.agility,
      aid: [
        { kind: "teamwork", name: "Twitch", hits: 2 },
        { kind: "teamwork", name: "Hammer", hits: 3 },
      ],
    })

    // Assert
    expect(aidGroups(pool.groups)).toEqual([["Aid: Twitch", 2], ["Aid: Hammer", 3], ["Teamwork limit", -3]])
  })

  it("adds no aid groups when no aid is given", () => {
    // Arrange
    const state = lockpickerState(4)

    // Act
    const pool = SkillPoolSelectors.selectActiveSkillTest(state, { skill: SkillKey.locksmith, attr: AttributeKey.agility })

    // Assert
    expect(aidGroups(pool.groups)).toEqual([])
  })
})

describe.concurrent("SkillPoolSelectors.selectKnowledgeSkillTest aid", () => {
  it("limits Teamwork dice by the Knowledge Skill's rating", () => {
    // Arrange
    const state = lockpickerState(0)

    // Act
    const pool = SkillPoolSelectors.selectKnowledgeSkillTest(state, {
      knowledge: "Seattle Gangs",
      rating: 1,
      aid: [{ kind: "teamwork", name: "Twitch", hits: 3 }],
    })

    // Assert
    expect(aidGroups(pool.groups)).toEqual([["Aid: Twitch", 3], ["Teamwork limit", -2]])
  })
})
