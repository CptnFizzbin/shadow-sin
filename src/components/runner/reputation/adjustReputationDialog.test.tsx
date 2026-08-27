import { fireEvent, screen, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { useAdjustReputationDialog } from "./adjustReputationDialog.tsx"

// `useAdjustReputationDialog` only exposes `{ open, outlet }` — this harness stands in for a
// real trigger (the About page's "Adjust Reputation" button) so the dialog it renders can be
// exercised through the public hook API, same as a consumer would use it.
const Harness: FC = () => {
  const dialog = useAdjustReputationDialog()
  return (
    <>
      <button type="button" onClick={() => dialog.open()}>Open Adjust Reputation</button>
      {dialog.outlet}
    </>
  )
}

function renderHarness(afterBuild?: (sheet: RunnerData) => void) {
  renderWithProviders(<Harness />, { runnerStore: new RunnerDataStore(runnerDataFactory({ afterBuild })) })
  fireEvent.click(screen.getByRole("button", { name: "Open Adjust Reputation" }))
}

describe("AdjustReputationDialog", () => {
  it("shows the runner's current reputation values and an empty ledger", () => {
    // Arrange / Act — streetCred=4, notoriety=0 ⇒ awareness rating floor((4+0)/3)=1 ("Shadow"):
    // this is the same full-size ReputationDisplay the About page uses, rank title included
    renderHarness((sheet) => {
      sheet.profile.streetCred = 4
      sheet.profile.notoriety = 0
    })

    // Assert
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("0")).toBeTruthy()
    expect(screen.getByText("1 - Shadow")).toBeTruthy()
    expect(screen.getByText("No reputation events recorded yet")).toBeTruthy()
  })

  // Regression test: the Add Entry form is rendered as a sibling of ControlledDialog, not nested
  // inside it — DialogRoot only renders its recognized Title/Content/Actions slots and silently
  // drops any other child, so nesting the form's outlet there mounted it nowhere and the button
  // did nothing.
  it("opens the Add Entry form when its button is clicked", () => {
    // Arrange
    renderHarness()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Add Entry" }))

    // Assert
    expect(screen.getByText("Add Reputation Event")).toBeTruthy()
  })

  it("adds a ledger entry and reflects it in both the ledger and the totals above", async () => {
    // Arrange
    renderHarness((sheet) => {
      sheet.profile.streetCred = 4
      sheet.profile.notoriety = 0
    })

    // Act — open the form, pick Street Cred (the default), bump the value, add a note, submit
    fireEvent.click(screen.getByRole("button", { name: "Add Entry" }))
    fireEvent.change(screen.getByLabelText("Value"), { target: { value: "3" } })
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Pulled off the data heist clean" } })
    fireEvent.click(screen.getByRole("button", { name: "Add Event" }))

    // Assert — form closed (MUI's exit transition is async, so this waits it out), entry now
    // listed, and the total above reflects base + entry (4 + 3)
    await waitFor(() => expect(screen.queryByText("Add Reputation Event")).toBeNull())
    expect(screen.getByText("Pulled off the data heist clean")).toBeTruthy()
    expect(screen.getByText("7")).toBeTruthy()
  })

  it("closes without adding an entry when the form is cancelled", async () => {
    // Arrange
    renderHarness()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Add Entry" }))
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    // Assert
    await waitFor(() => expect(screen.queryByText("Add Reputation Event")).toBeNull())
    expect(screen.getByText("No reputation events recorded yet")).toBeTruthy()
  })
})
