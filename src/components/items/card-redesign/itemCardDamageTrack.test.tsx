import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCardDamageTrack } from "./itemCardDamageTrack.tsx"

describe("ItemCardDamageTrack", () => {
  it("forwards props to InlineDamageTrack", () => {
    const onChange = vi.fn()
    render(
      <ItemCardDamageTrack label="Damage" max={12} current={4} onChange={onChange} />,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByText("Damage 4/12")).toBeDefined()
  })

  it("calls onChange when a cell is tapped", () => {
    const onChange = vi.fn()
    render(
      <ItemCardDamageTrack label="Damage" max={4} current={0} onChange={onChange} />,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getAllByRole("button")[1])

    expect(onChange).toHaveBeenCalledWith(2)
  })
})
