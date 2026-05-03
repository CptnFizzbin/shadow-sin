import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { AddTemporaryEffectDialog } from "./addTemporaryEffectDialog.tsx"

describe("AddTemporaryEffectDialog", () => {
  it("renders without crashing when open", () => {
    // Arrange / Act
    renderWithProviders(
      <AddTemporaryEffectDialog
        open
        onClose={vi.fn()}
        onAdd={vi.fn()}
      />,
    )

    // Assert
    expect(screen.getByText("Add Temporary Effect")).toBeTruthy()
  })

  it("does not render dialog content when closed", () => {
    // Arrange / Act
    render(
      <AddTemporaryEffectDialog
        open={false}
        onClose={vi.fn()}
        onAdd={vi.fn()}
      />,
    )

    // Assert
    expect(screen.queryByText("Add Temporary Effect")).toBeNull()
  })

  it("renders the Label field and Add button", () => {
    // Arrange / Act
    renderWithProviders(
      <AddTemporaryEffectDialog
        open
        onClose={vi.fn()}
        onAdd={vi.fn()}
      />,
    )

    // Assert
    expect(screen.getByLabelText(/label/i)).toBeTruthy()
    expect(screen.getByRole("button", { name: /^add$/i })).toBeTruthy()
  })
})
