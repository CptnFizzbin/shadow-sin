import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { MarkdownText } from "./markdownText.tsx"

describe("MarkdownText", () => {
  it("renders headings as bold paragraphs instead of heading elements", () => {
    // Arrange
    const description = "# Background\nGrew up in the Barrens."

    // Act
    render(<MarkdownText>{description}</MarkdownText>)

    // Assert
    expect(screen.queryByRole("heading")).toBeNull()
    const heading = screen.getByText("Background")
    expect(heading.tagName).toBe("P")
    expect(getComputedStyle(heading).fontWeight).toBe("700")
  })

  it("keeps single newlines as line breaks", () => {
    // Arrange
    const description = "First line\nSecond line"

    // Act
    const { container } = render(<MarkdownText>{description}</MarkdownText>)

    // Assert
    expect(container.querySelectorAll("br")).toHaveLength(1)
  })

  it("renders inline Markdown formatting", () => {
    // Arrange
    const description = "A **bold** and *italic* claim"

    // Act
    render(<MarkdownText>{description}</MarkdownText>)

    // Assert
    expect(screen.getByText("bold").tagName).toBe("STRONG")
    expect(screen.getByText("italic").tagName).toBe("EM")
  })

  it("does not render raw HTML", () => {
    // Arrange
    const description = "<script>alert(1)</script>Safe text"

    // Act
    const { container } = render(<MarkdownText>{description}</MarkdownText>)

    // Assert
    expect(container.querySelector("script")).toBeNull()
  })

  it("renders indented text as a paragraph rather than a code block", () => {
    // Arrange
    const description = "      Indented prose pasted from a rulebook"

    // Act
    const { container } = render(<MarkdownText>{description}</MarkdownText>)

    // Assert
    expect(container.querySelector("code")).toBeNull()
    expect(screen.getByText("Indented prose pasted from a rulebook").tagName).toBe("P")
  })
})
