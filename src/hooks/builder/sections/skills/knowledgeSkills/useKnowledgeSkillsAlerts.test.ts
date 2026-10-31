import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { makeRunnerDataWrapper } from "#testUtils/renderUtils.tsx"

import { useKnowledgeSkillsAlerts } from "./useKnowledgeSkillsAlerts.ts"

describe("useKnowledgeSkillsAlerts", () => {
  it("does not flag knowledge/language skill ratings above the active-skill cap", () => {
    // Arrange — the "one Rating 6, two Rating 5" cap is an active-skill-only rule (SR4A p.72);
    // knowledge and language skills have no equivalent restriction.
    const sheet = runnerDataFactory({
      afterBuild: (runner) => {
        runner.skills = {
          ...runner.skills,
          knowledgeSkills: [
            { id: crypto.randomUUID(), name: "Corporate Politics", rating: 6 },
            { id: crypto.randomUUID(), name: "Sprawl Gangs", rating: 6 },
          ],
          languageSkills: [
            { id: crypto.randomUUID(), name: "Japanese", isNative: false, rating: 5 },
            { id: crypto.randomUUID(), name: "Or'zet", isNative: false, rating: 5 },
            { id: crypto.randomUUID(), name: "Sperethiel", isNative: false, rating: 5 },
          ],
        }
      },
    })

    // Act
    const { result } = renderHook(() => useKnowledgeSkillsAlerts(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current.find((alert) => alert.title === "Invalid skill ratings")).toBeUndefined()
  })

  it("still flags more than one native language", () => {
    // Arrange
    const sheet = runnerDataFactory({
      afterBuild: (runner) => {
        runner.skills = {
          ...runner.skills,
          languageSkills: [
            { id: crypto.randomUUID(), name: "Japanese", isNative: true },
            { id: crypto.randomUUID(), name: "English", isNative: true },
          ],
        }
      },
    })

    // Act
    const { result } = renderHook(() => useKnowledgeSkillsAlerts(), {
      wrapper: makeRunnerDataWrapper(sheet),
    })

    // Assert
    expect(result.current.find((alert) => alert.title === "Too many native languages")).toBeDefined()
  })
})
