import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementStatusIcon } from "./cardElementStatusIcon.tsx"

describe("CardElementStatusIcon", () => {
  it.each([
    ["equipped", "Equipped"],
    ["stashed", "Stashed"],
    ["fixed", "Fixed"],
    ["wireless-enabled", "Wireless"],
    ["wireless-disabled", "Wireless off"],
    ["wireless-removed", "Wireless removed"],
    ["sustained", "Sustained"],
    ["not-sustained", "Not Sustained"],
  ] as const)("renders the %s icon labeled %s", (status, label) => {
    // Arrange / Act
    render(<CardElementStatusIcon status={status} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByLabelText(label)).toBeDefined()
  })

  it("renders as a plain, non-interactive icon when no onClick is given", () => {
    // Arrange / Act
    render(<CardElementStatusIcon status="sustained" />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("becomes tappable and fires onClick when provided", () => {
    // Arrange
    const onClick = vi.fn()
    render(<CardElementStatusIcon status="not-sustained" onClick={onClick} />, { wrapper: ThemeWrapper })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Not Sustained" }))

    // Assert
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("stops the click from bubbling to an enclosing card's onOpen", () => {
    // Arrange
    const onClick = vi.fn()
    const onOpen = vi.fn()
    render(
      <div onClick={onOpen}>
        <CardElementStatusIcon status="sustained" onClick={onClick} />
      </div>,
      { wrapper: ThemeWrapper },
    )

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Sustained" }))

    // Assert
    expect(onClick).toHaveBeenCalledOnce()
    expect(onOpen).not.toHaveBeenCalled()
  })
})
