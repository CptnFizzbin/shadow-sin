import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementSkillList } from "./cardElementSkillList.tsx"

describe("CardElementSkillList", () => {
  it("renders nothing when there are no skills", () => {
    // Arrange / Act
    const { container } = render(<CardElementSkillList skills={[]} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders each skill's name and pool as a chip, under a default 'Skills' label", () => {
    // Arrange / Act
    render(
      <CardElementSkillList skills={[{ name: "Perception", pool: 7 }, { name: "Dodge", pool: 9 }]} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Skills")).toBeDefined()
    expect(screen.getByText("Perception [7]")).toBeDefined()
    expect(screen.getByText("Dodge [9]")).toBeDefined()
  })

  it("renders a custom label", () => {
    // Arrange / Act
    render(<CardElementSkillList label="Optional Skills" skills={[{ name: "Arcana", pool: 4 }]} />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    expect(screen.getByText("Optional Skills")).toBeDefined()
  })
})
