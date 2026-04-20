import { fireEvent, render } from "@testing-library/react"
import type { FC } from "react"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import { NuyenField } from "#/components/ui/form/fields/nuyenField.tsx"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

const ControlledNuyenField: FC<{ initial?: number }> = ({ initial }) => {
  const [value, setValue] = useState(initial)
  return <NuyenField value={value} onChange={setValue} />
}

function renderField(initial?: number) {
  const { container } = render(<ControlledNuyenField initial={initial} />, { wrapper: ThemeWrapper })
  return container.querySelector("input")! as HTMLInputElement
}

/** Simulates the browser posting a change event after a key press. */
function pressKey(input: HTMLInputElement, resultValue: string, cursorAfter: number) {
  fireEvent.change(input, { target: { value: resultValue, selectionStart: cursorAfter } })
}

describe("NuyenField", () => {
  describe("UX scenario 1: typing digits from empty to 1,234,567", () => {
    it("formats with commas as each digit is appended", () => {
      // Arrange
      const input = renderField()

      // Act / Assert — step through each keystroke
      pressKey(input, "1", 1)
      expect(input.value).toBe("1")
      expect(input.selectionStart).toBe(1)

      pressKey(input, "12", 2)
      expect(input.value).toBe("12")
      expect(input.selectionStart).toBe(2)

      pressKey(input, "123", 3)
      expect(input.value).toBe("123")
      expect(input.selectionStart).toBe(3)

      // 4th digit — comma is inserted
      pressKey(input, "1234", 4)
      expect(input.value).toBe("1,234")
      expect(input.selectionStart).toBe(5)

      // 5th digit
      pressKey(input, "1,2345", 6)
      expect(input.value).toBe("12,345")
      expect(input.selectionStart).toBe(6)

      // 6th digit
      pressKey(input, "12,3456", 7)
      expect(input.value).toBe("123,456")
      expect(input.selectionStart).toBe(7)

      // 7th digit — second comma is inserted
      pressKey(input, "123,4567", 8)
      expect(input.value).toBe("1,234,567")
      expect(input.selectionStart).toBe(9)
    })
  })

  describe("UX scenario 2: backspace 100 → empty, then retype to 15,000", () => {
    it("decreases count then reformats on re-entry", () => {
      // Arrange
      const input = renderField(100)
      expect(input.value).toBe("100")

      // Act / Assert
      pressKey(input, "10", 2)
      expect(input.value).toBe("10")

      pressKey(input, "1", 1)
      expect(input.value).toBe("1")

      pressKey(input, "", 0)
      expect(input.value).toBe("")

      pressKey(input, "1", 1)
      expect(input.value).toBe("1")

      pressKey(input, "15", 2)
      expect(input.value).toBe("15")

      pressKey(input, "150", 3)
      expect(input.value).toBe("150")

      // 4th digit — comma inserted
      pressKey(input, "1500", 4)
      expect(input.value).toBe("1,500")
      expect(input.selectionStart).toBe(5)

      // 5th digit
      pressKey(input, "1,5000", 6)
      expect(input.value).toBe("15,000")
      expect(input.selectionStart).toBe(6)
    })
  })

  describe("UX scenario 3: backspace in the middle of 100", () => {
    it("preserves leading zeros and tracks cursor through mid-number edits", () => {
      // Arrange — initial value "100", cursor after '1' (pos 1)
      const input = renderField(100)

      // Act / Assert
      // Backspace removes '1' → "00", cursor at 0
      pressKey(input, "00", 0)
      expect(input.value).toBe("00")
      expect(input.selectionStart).toBe(0)

      // Type '2' → "200", cursor at 1
      pressKey(input, "200", 1)
      expect(input.value).toBe("200")
      expect(input.selectionStart).toBe(1)

      // Type '0' → "2000" → "2,000", cursor shifts past new comma → pos 3
      pressKey(input, "2000", 2)
      expect(input.value).toBe("2,000")
      expect(input.selectionStart).toBe(3)
    })
  })

  describe("UX scenario 4: delete then insert in the middle of 100", () => {
    it("removes the character ahead of the cursor then inserts correctly", () => {
      // Arrange — initial value "100", cursor after '1' (pos 1)
      const input = renderField(100)

      // Act / Assert
      // Delete removes '0' after cursor → "10", cursor stays at 1
      pressKey(input, "10", 1)
      expect(input.value).toBe("10")
      expect(input.selectionStart).toBe(1)

      // Type '2' → "120", cursor at 2
      pressKey(input, "120", 2)
      expect(input.value).toBe("120")
      expect(input.selectionStart).toBe(2)

      // Type '0' → "1200" → "1,200", cursor shifts past new comma → pos 4
      pressKey(input, "1200", 3)
      expect(input.value).toBe("1,200")
      expect(input.selectionStart).toBe(4)
    })
  })
})
