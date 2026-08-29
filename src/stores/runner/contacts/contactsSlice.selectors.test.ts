import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { ContactsSelectors } from "./contactsSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("ContactsSelectors.selectAll", () => {
  it("returns the runner's contacts", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(ContactsSelectors.selectAll(stateFor(runner))).toBe(runner.contacts)
  })
})
