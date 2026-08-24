import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { KnowledgeSkillsList } from "./knowledgeSkillsList.tsx"

describe("KnowledgeSkillsList", () => {
  it("renders skills with name, rating, and optional specialization", () => {
    renderWithProviders(<KnowledgeSkillsList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (runnerData) => {
        runnerData.skills.knowledgeSkills = [
          { name: "Seattle Street Rumors", rating: 3, specialization: "Redmond" },
          { name: "Ancient History", rating: 4 },
        ]
        return runnerData
      } })),
    })

    expect(screen.getByText("Knowledge Skills")).toBeTruthy()
    expect(screen.getByText("Ancient History")).toBeTruthy()
    expect(screen.getByText("Seattle Street Rumors")).toBeTruthy()
    expect(screen.getByText("Redmond")).toBeTruthy()
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1)
  })

  it("renders an empty state when no knowledge skills exist", () => {
    renderWithProviders(<KnowledgeSkillsList />)

    expect(screen.getByText("No knowledge skills added")).toBeTruthy()
  })
})
