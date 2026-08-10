import { render } from "@testing-library/react"
import type { FC } from "react"
import { describe, expect, it } from "vitest"

import { useDocumentTitle } from "./useDocumentTitle.ts"

const TitleSetter: FC<{ title: string }> = ({ title }) => {
  useDocumentTitle(title)
  return null
}

describe("useDocumentTitle", () => {
  it("sets document.title to the given value", () => {
    // Arrange / Act
    render(<TitleSetter title="Artemis - ShadowSIN" />)

    // Assert
    expect(document.title).toBe("Artemis - ShadowSIN")
  })

  it("updates document.title when the value changes", () => {
    // Arrange
    const { rerender } = render(<TitleSetter title="Artemis - ShadowSIN" />)

    // Act
    rerender(<TitleSetter title="Hexen - ShadowSIN" />)

    // Assert
    expect(document.title).toBe("Hexen - ShadowSIN")
  })

  it("restores the previous title on unmount", () => {
    // Arrange
    document.title = "ShadowSIN 4e"
    const { unmount } = render(<TitleSetter title="Artemis - ShadowSIN" />)

    // Act
    unmount()

    // Assert
    expect(document.title).toBe("ShadowSIN 4e")
  })
})
