import Menu from "@mui/material/Menu"
import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactElement } from "react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementQuickAction } from "./cardElementQuickAction.tsx"

/** MenuItem requires a MenuList context, so tests render it inside an open Menu. */
const renderInMenu = (element: ReactElement) =>
  render(<Menu open anchorEl={document.body}>{element}</Menu>, { wrapper: ThemeWrapper })

describe("CardElementQuickAction", () => {
  it("renders the label and fires onClick", () => {
    const onClick = vi.fn()
    renderInMenu(<CardElementQuickAction label="Edit" onClick={onClick} />)

    fireEvent.click(screen.getByText("Edit"))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it("respects disabled", () => {
    const onClick = vi.fn()
    renderInMenu(<CardElementQuickAction label="Edit" onClick={onClick} disabled />)

    expect(screen.getByRole("menuitem").getAttribute("aria-disabled")).toBe("true")
  })
})
