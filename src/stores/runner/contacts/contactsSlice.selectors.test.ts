import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { ContactsSelectors, selectContacts } from "./contactsSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("selectContacts", () => {
  it("returns the runner's contacts", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectContacts(runner)).toBe(runner.contacts)
  })
})

describe("ContactsSelectors.selectAll", () => {
  it("returns the runner's contacts", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(ContactsSelectors.selectAll(stateFor(runner))).toBe(runner.contacts)
  })
})
