import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { uuid } from "#/common/uuid/uuidUtils.ts"
import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import type { KnowledgeSkillData } from "#/data/skills/knowledgeSkillData.ts"
import type { LanguageSkillData } from "#/data/skills/languageSkillData.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { useBuilderBuildPointsApi, useBuilderSkillsBuildPoints } from "./useBuildPointsApi.ts"
import { useKnowledgeSkillsBuildPoints } from "./useKnowledgeSkillsBuildPoints.ts"

interface KnowledgeBpCase {
  name: string
  logic: number
  intuition: number
  knowledgeSkills: Omit<KnowledgeSkillData, "id">[]
  languageSkills: Omit<LanguageSkillData, "id">[]
  expectedBp: number
}

// Free SP = (Logic + Intuition) × 3; each SP beyond that costs 2 BP.
const cases: KnowledgeBpCase[] = [
  {
    name: "no skills",
    logic: 3,
    intuition: 3,
    knowledgeSkills: [],
    languageSkills: [],
    expectedBp: 0,
  },
  {
    name: "spending within the free skill points",
    logic: 3,
    intuition: 3,
    knowledgeSkills: [{ name: "Corporate Politics", rating: 4 }, { name: "Sprawl Gangs", rating: 3 }],
    languageSkills: [],
    expectedBp: 0,
  },
  {
    name: "spending exactly the free skill points",
    logic: 3,
    intuition: 3,
    knowledgeSkills: [{ name: "Corporate Politics", rating: 6 }, { name: "Sprawl Gangs", rating: 6 }],
    languageSkills: [{ name: "Japanese", isNative: false, rating: 6 }],
    expectedBp: 0,
  },
  {
    name: "one skill point over the free allowance via a specialization",
    logic: 3,
    intuition: 3,
    knowledgeSkills: [
      { name: "Corporate Politics", rating: 6, specialization: "Aztechnology" },
      { name: "Sprawl Gangs", rating: 6 },
    ],
    languageSkills: [{ name: "Japanese", isNative: false, rating: 6 }],
    expectedBp: 2,
  },
  {
    name: "low attributes shrinking the free allowance",
    logic: 1,
    intuition: 1,
    knowledgeSkills: [{ name: "Corporate Politics", rating: 5 }],
    languageSkills: [{ name: "Japanese", isNative: false, rating: 3 }],
    expectedBp: 4,
  },
  {
    name: "a native language costing nothing",
    logic: 1,
    intuition: 1,
    knowledgeSkills: [{ name: "Corporate Politics", rating: 6 }],
    languageSkills: [{ name: "English", isNative: true }],
    expectedBp: 0,
  },
  {
    name: "a native language with a lingo costing only the lingo",
    logic: 1,
    intuition: 1,
    knowledgeSkills: [{ name: "Corporate Politics", rating: 6 }],
    languageSkills: [{ name: "English", isNative: true, lingo: "Street" }],
    expectedBp: 2,
  },
  {
    name: "a non-native language with no rating",
    logic: 1,
    intuition: 1,
    knowledgeSkills: [{ name: "Corporate Politics", rating: 6 }],
    languageSkills: [{ name: "Japanese", isNative: false }],
    expectedBp: 0,
  },
  {
    name: "knowledge and language skills both over the allowance",
    logic: 2,
    intuition: 4,
    knowledgeSkills: [
      { name: "Corporate Politics", rating: 6, specialization: "Aztechnology" },
      { name: "Sprawl Gangs", rating: 6 },
      { name: "Magical Theory", rating: 4 },
    ],
    languageSkills: [
      { name: "English", isNative: true, lingo: "Street" },
      { name: "Japanese", isNative: false, rating: 4, lingo: "Kansai" },
    ],
    expectedBp: 10,
  },
]

const makeSheet = ({ logic, intuition, knowledgeSkills, languageSkills }: KnowledgeBpCase) => runnerDataFactory({
  afterBuild: (runner) => {
    runner.attributes[AttributeKey.logic] = logic
    runner.attributes[AttributeKey.intuition] = intuition
    runner.skills = {
      ...runner.skills,
      knowledgeSkills: knowledgeSkills.map((skill) => ({ ...skill, id: uuid.v7() })),
      languageSkills: languageSkills.map((skill) => ({ ...skill, id: uuid.v7() })),
    }
  },
})

describe("Knowledge Skill BP", () => {
  it.each(cases)("agrees across the builder's BP figures for $name", (testCase) => {
    // Arrange
    const sheet = makeSheet(testCase)

    // Act
    const { result } = renderHook(() => ({
      section: useKnowledgeSkillsBuildPoints().spent,
      skillsTotal: useBuilderSkillsBuildPoints().knowledgeSkills.bpSpent,
      buildPointsTotal: useBuilderBuildPointsApi().lineItems
        .find((item) => item.sectionId === BuilderSectionId.knowledgeSkills)?.spent,
    }), { wrapper: makeRunnerDataWrapper(sheet) })

    // Assert
    expect(result.current).toEqual({
      section: testCase.expectedBp,
      skillsTotal: testCase.expectedBp,
      buildPointsTotal: testCase.expectedBp,
    })
  })
})
