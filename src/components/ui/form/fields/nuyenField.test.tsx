import { fireEvent, render } from "@testing-library/react"
import type { FC } from "react"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import { NuyenField } from "#/components/ui/form/fields/nuyenField.tsx"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

// ── Test helpers ──────────────────────────────────────────────────────────────

const ControlledNuyenField: FC<{ initial?: number }> = ({ initial }) => {
  const [value, setValue] = useState(initial)
  return <NuyenField value={value} onChange={setValue} />
}

function renderField(initial?: number) {
  const { container } = render(<ControlledNuyenField initial={initial} />, { wrapper: ThemeWrapper })
  return container.querySelector("input")! as HTMLInputElement
}

/** Sets the field value by firing a change event, cursor placed at the end. */
function setInputValue(input: HTMLInputElement, value: string) {
  fireEvent.change(input, { target: { value, selectionStart: value.length } })
}

/** Positions the cursor inside the input without triggering React events. */
function setCursorPosition(input: HTMLInputElement, pos: number) {
  input.setSelectionRange(pos, pos)
}

/**
 * Simulates a key press: computes the resulting DOM string the browser would
 * produce for the given key, then fires a change event so the component's
 * handler runs.
 *
 * Supported keys: any single printable character (e.g. "0"–"9"), "Backspace",
 * and "Delete".
 */
function pressKey(input: HTMLInputElement, key: string) {
  const currentValue = input.value
  const selStart = input.selectionStart ?? currentValue.length
  const selEnd = input.selectionEnd ?? currentValue.length

  let nextValue: string
  let nextCursor: number

  if (key === "Backspace") {
    if (selStart !== selEnd) {
      nextValue = currentValue.slice(0, selStart) + currentValue.slice(selEnd)
      nextCursor = selStart
    } else if (selStart > 0) {
      nextValue = currentValue.slice(0, selStart - 1) + currentValue.slice(selStart)
      nextCursor = selStart - 1
    } else {
      return
    }
  } else if (key === "Delete") {
    if (selStart !== selEnd) {
      nextValue = currentValue.slice(0, selStart) + currentValue.slice(selEnd)
      nextCursor = selStart
    } else if (selStart < currentValue.length) {
      nextValue = currentValue.slice(0, selStart) + currentValue.slice(selStart + 1)
      nextCursor = selStart
    } else {
      return
    }
  } else if (key.length === 1) {
    nextValue = currentValue.slice(0, selStart) + key + currentValue.slice(selEnd)
    nextCursor = selStart + 1
  } else {
    return
  }

  fireEvent.change(input, { target: { value: nextValue, selectionStart: nextCursor } })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("NuyenField", () => {
  describe("UX scenario 1: typing digits from empty to 1,234,567", () => {
    it("formats with commas as each digit is appended", () => {
      // Arrange
      const input = renderField()

      // Act / Assert — step through each keystroke
      pressKey(input, "1")
      expect(input.value).toBe("1")
      expect(input.selectionStart).toBe(1)

      pressKey(input, "2")
      expect(input.value).toBe("12")

      pressKey(input, "3")
      expect(input.value).toBe("123")

      // 4th digit causes comma insertion; cursor must jump past it
      pressKey(input, "4")
      expect(input.value).toBe("1,234")
      expect(input.selectionStart).toBe(5)

      pressKey(input, "5")
      expect(input.value).toBe("12,345")
      expect(input.selectionStart).toBe(6)

      pressKey(input, "6")
      expect(input.value).toBe("123,456")
      expect(input.selectionStart).toBe(7)

      // 7th digit inserts a second comma
      pressKey(input, "7")
      expect(input.value).toBe("1,234,567")
      expect(input.selectionStart).toBe(9)
    })
  })

  describe("UX scenario 2: backspace from 100 to empty, then retype to 15,000", () => {
    it("decreases count then reformats on re-entry", () => {
      // Arrange
      const input = renderField(100)
      setCursorPosition(input, 3) // place cursor at end of "100"

      // Act / Assert — backspace to empty
      pressKey(input, "Backspace")
      expect(input.value).toBe("10")
      expect(input.selectionStart).toBe(2)

      pressKey(input, "Backspace")
      expect(input.value).toBe("1")

      pressKey(input, "Backspace")
      expect(input.value).toBe("")

      // Retype to 15,000
      pressKey(input, "1")
      expect(input.value).toBe("1")

      pressKey(input, "5")
      expect(input.value).toBe("15")

      pressKey(input, "0")
      expect(input.value).toBe("150")

      pressKey(input, "0")
      expect(input.value).toBe("1,500")
      expect(input.selectionStart).toBe(5)

      pressKey(input, "0")
      expect(input.value).toBe("15,000")
      expect(input.selectionStart).toBe(6)
    })
  })

  describe("UX scenario 3: backspace from the middle", () => {
    it("cursor stays in position through mid-number edits that introduce a comma", () => {
      // Arrange
      const input = renderField()
      setInputValue(input, "100")
      setCursorPosition(input, 2) // cursor between '10' and '0' in "100"

      // Act / Assert
      pressKey(input, "Backspace") // removes first '0' → "10"
      expect(input.value).toBe("10")
      expect(input.selectionStart).toBe(1)

      pressKey(input, "Backspace") // removes '1' → "0"
      expect(input.value).toBe("0")
      expect(input.selectionStart).toBe(0)

      pressKey(input, "2") // inserts at start → "20"
      expect(input.value).toBe("20")
      expect(input.selectionStart).toBe(1)

      pressKey(input, "0") // "200"
      expect(input.value).toBe("200")
      expect(input.selectionStart).toBe(2)

      pressKey(input, "0") // "2000" → "2,000"; cursor shifts past new comma
      expect(input.value).toBe("2,000")
      expect(input.selectionStart).toBe(4)
    })
  })

  describe("UX scenario 4: delete then insert in the middle", () => {
    it("removes the digit ahead of the cursor then reformats on insertion", () => {
      // Arrange
      const input = renderField(100)
      setCursorPosition(input, 1) // cursor after '1'

      // Act / Assert
      pressKey(input, "Delete") // removes first '0' → "10"
      expect(input.value).toBe("10")
      expect(input.selectionStart).toBe(1)

      pressKey(input, "2") // inserts at cursor → "120"
      expect(input.value).toBe("120")
      expect(input.selectionStart).toBe(2)

      pressKey(input, "0") // "1200" → "1,200"; cursor shifts past new comma
      expect(input.value).toBe("1,200")
      expect(input.selectionStart).toBe(4)
    })
  })
})
