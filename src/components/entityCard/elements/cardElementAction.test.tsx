import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementAction } from "./cardElementAction.tsx"

describe("CardElementAction", () => {
  it("renders the label and fires onClick", () => {
    const onClick = vi.fn()
    render(<CardElementAction label="Cast" onClick={onClick} />, { wrapper: ThemeWrapper })

    fireEvent.click(screen.getByRole("button", { name: "Cast" }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it("respects disabled", () => {
    const onClick = vi.fn()
    render(<CardElementAction label="Cast" onClick={onClick} disabled />, { wrapper: ThemeWrapper })

    expect(screen.getByRole("button", { name: "Cast" })).toHaveProperty("disabled", true)
  })
})
