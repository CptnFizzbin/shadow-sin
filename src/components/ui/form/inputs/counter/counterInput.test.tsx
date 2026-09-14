import { fireEvent, render } from "@testing-library/react"
import type { FC } from "react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CounterInput } from "./counterInput.tsx"

interface ControlledCounterProps {
  initial?: number | null
  min?: number
  max?: number
}

const ControlledCounter: FC<ControlledCounterProps> = ({ initial = null, min, max }) => {
  const [value, setValue] = useState<number | null>(initial ?? null)
  return <CounterInput value={value} min={min} max={max} onChange={setValue} />
}

function renderCounter(initial?: number | null, min?: number, max?: number) {
  const { container } = render(<ControlledCounter initial={initial} min={min} max={max} />, {
    wrapper: ThemeWrapper,
  })
  return container.querySelector("input")! as HTMLInputElement
}

/**
 * Renders an uncontrolled CounterInput with a mock onChange and returns the
 * input element, the container, and the mock function for assertions.
 */
function renderCounterField(value: number | null, min: number, max: number) {
  const onChange = vi.fn<(newValue: number | null) => void>()
  const { container } = render(
    <CounterInput value={value} min={min} max={max} onChange={onChange} />,
    { wrapper: ThemeWrapper },
  )
  return {
    input: container.querySelector("input")! as HTMLInputElement,
    container,
    onChange,
  }
}

function focus(input: HTMLInputElement) {
  fireEvent.focus(input)
}

function change(input: HTMLInputElement, rawValue: string) {
  fireEvent.change(input, { target: { value: rawValue } })
}

function blur(input: HTMLInputElement) {
  fireEvent.blur(input)
}

describe("Counter", () => {
  describe("input filtering", () => {
    it("keeps only digits and ignores letters", () => {
      // Arrange
      const input = renderCounter()
      focus(input)

      // Act
      change(input, "abc123")

      // Assert
      expect(input.value).toBe("123")
    })

    it("keeps only digits and ignores symbols other than +, -, .", () => {
      // Arrange
      const input = renderCounter()
      focus(input)

      // Act
      change(input, "$5%!")

      // Assert
      expect(input.value).toBe("5")
    })

    it("preserves the + sign", () => {
      // Arrange
      const input = renderCounter()
      focus(input)

      // Act
      change(input, "+5")

      // Assert
      expect(input.value).toBe("+5")
    })

    it("preserves the - sign", () => {
      // Arrange
      const input = renderCounter()
      focus(input)

      // Act
      change(input, "-5")

      // Assert
      expect(input.value).toBe("-5")
    })

    it("preserves the decimal point", () => {
      // Arrange
      const input = renderCounter()
      focus(input)

      // Act
      change(input, "1.5")

      // Assert
      expect(input.value).toBe("1.5")
    })
  })

  describe("onChange timing", () => {
    it("calls onChange immediately when a valid number is typed", () => {
      // Arrange
      const { input, onChange } = renderCounterField(null, 0, 10)

      // Act
      focus(input)
      change(input, "7")

      // Assert — no blur needed; onChange fires as soon as the valid number is entered
      expect(onChange).toHaveBeenCalledWith(7)
    })

    it("does not call onChange while the draft is an incomplete value like '-'", () => {
      // Arrange
      const { input, onChange } = renderCounterField(null, 0, 10)

      // Act
      focus(input)
      change(input, "-")

      // Assert — "-" is not yet a valid number; onChange must not fire yet
      expect(onChange).not.toHaveBeenCalled()
    })

    it("does not call onChange while the field is empty mid-edit", () => {
      // Arrange
      const { input, onChange } = renderCounterField(5, 0, 10)

      // Act — clear without blurring
      focus(input)
      change(input, "")

      // Assert — empty draft must not propagate null yet
      expect(onChange).not.toHaveBeenCalled()
    })

    it("clamps immediately when the typed value exceeds max", () => {
      // Arrange
      const { input, onChange } = renderCounterField(null, 0, 6)

      // Act
      focus(input)
      change(input, "99")

      // Assert — clamped during typing, no blur required
      expect(onChange).toHaveBeenCalledWith(6)
    })
  })

  describe("clear and retype", () => {
    it("shows an empty field immediately when cleared during editing", () => {
      // Arrange
      const input = renderCounter(5)
      focus(input)

      // Act
      change(input, "")

      // Assert — external value is still 5, but the draft is ""
      expect(input.value).toBe("")
    })

    it("allows retyping after clearing without committing null to the parent", () => {
      // Arrange
      const { input, onChange } = renderCounterField(5, 0, 10)

      // Act — clear (invalid draft, no onChange), then retype a valid digit
      focus(input)
      change(input, "")
      // Assert — clearing must not propagate null while the user is still editing
      expect(onChange).not.toHaveBeenCalled()

      change(input, "3")
      // Assert — retyping a valid number commits it immediately (no blur needed)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(3)
      expect(input.value).toBe("3")
    })
  })

  describe("blur commits and clamps", () => {
    it("commits the typed value to the parent on blur", () => {
      // Arrange
      const { input, onChange } = renderCounterField(null, 0, 10)

      // Act
      focus(input)
      change(input, "7")
      blur(input)

      // Assert
      expect(onChange).toHaveBeenCalledWith(7)
    })

    it("clamps to min when the typed value is below min", () => {
      // Arrange
      const { input, onChange } = renderCounterField(null, 2, 10)

      // Act
      focus(input)
      change(input, "1")
      blur(input)

      // Assert
      expect(onChange).toHaveBeenCalledWith(2)
    })

    it("clamps to max when the typed value is above max", () => {
      // Arrange
      const { input, onChange } = renderCounterField(null, 0, 6)

      // Act
      focus(input)
      change(input, "99")
      blur(input)

      // Assert
      expect(onChange).toHaveBeenCalledWith(6)
    })

    it("calls onChange(null) when the field is empty on blur", () => {
      // Arrange
      const { input, onChange } = renderCounterField(5, 0, 10)

      // Act
      focus(input)
      change(input, "")
      blur(input)

      // Assert
      expect(onChange).toHaveBeenCalledWith(null)
    })

    it("calls onChange(null) when the input contains only non-numeric chars like '-'", () => {
      // Arrange
      const { input, onChange } = renderCounterField(null, 0, 10)

      // Act
      focus(input)
      change(input, "-")
      blur(input)

      // Assert
      expect(onChange).toHaveBeenCalledWith(null)
    })

    it("reverts the display to the external value after blur", () => {
      // Arrange — controlled component; external value = 5
      const input = renderCounter(5, 0, 10)

      // Act
      focus(input)
      change(input, "3")
      blur(input)

      // Assert — after blur the ControlledCounter updates to 3
      expect(input.value).toBe("3")
    })
  })

  describe("increment / decrement buttons", () => {
    it("increments the value when the + button is clicked", () => {
      // Arrange
      const { container, onChange } = renderCounterField(3, 0, 6)
      const buttons = container.querySelectorAll("button")
      const incrementButton = buttons[buttons.length - 1]

      // Act
      fireEvent.click(incrementButton)

      // Assert
      expect(onChange).toHaveBeenCalledWith(4)
    })

    it("decrements the value when the - button is clicked", () => {
      // Arrange
      const { container, onChange } = renderCounterField(3, 0, 6)
      const buttons = container.querySelectorAll("button")
      const decrementButton = buttons[0]

      // Act
      fireEvent.click(decrementButton)

      // Assert
      expect(onChange).toHaveBeenCalledWith(2)
    })

    it("disables the - button when value equals min", () => {
      // Arrange
      const { container } = renderCounterField(0, 0, 6)
      const decrementButton = container.querySelectorAll("button")[0]

      // Assert
      expect(decrementButton.hasAttribute("disabled")).toBe(true)
    })

    it("disables the + button when value equals max", () => {
      // Arrange
      const { container } = renderCounterField(6, 0, 6)
      const buttons = container.querySelectorAll("button")
      const incrementButton = buttons[buttons.length - 1]

      // Assert
      expect(incrementButton.hasAttribute("disabled")).toBe(true)
    })
  })
})
