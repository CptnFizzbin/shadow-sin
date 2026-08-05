import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Icons } from "#/lib/icons.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementStatusIcon } from "./cardElementStatusIcon.tsx"

describe("CardElementStatusIcon", () => {
  it("renders the icon with its label", () => {
    render(<CardElementStatusIcon icon={Icons.item.equipped} label="Equipped" />, { wrapper: ThemeWrapper })

    expect(screen.getByLabelText("Equipped")).toBeDefined()
  })
})
