import MenuList from "@mui/material/MenuList"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementAction } from "./cardElementAction.tsx"

describe("CardElementAction", () => {
  it("renders the label and fires onClick", () => {
    const onClick = vi.fn()
    render(
      <MenuList>
        <CardElementAction label="Cast" onClick={onClick} />
      </MenuList>,
      { wrapper: ThemeWrapper },
    )

    fireEvent.click(screen.getByRole("menuitem", { name: "Cast" }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it("respects disabled", () => {
    const onClick = vi.fn()
    render(
      <MenuList>
        <CardElementAction label="Cast" onClick={onClick} disabled />
      </MenuList>,
      { wrapper: ThemeWrapper },
    )

    expect(screen.getByRole("menuitem", { name: "Cast" }).getAttribute("aria-disabled")).toBe("true")
  })
})
