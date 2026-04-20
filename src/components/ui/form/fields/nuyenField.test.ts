import { describe, expect, it } from "vitest"

import {
  applyCommasToDigits,
  computeNuyenEdit,
  countCommasBeforeDigit,
  formatNuyenDisplay,
} from "#/components/ui/form/fields/nuyenField.tsx"

describe("applyCommasToDigits", () => {
  it("does not add commas for three or fewer digits", () => {
    // Arrange / Act / Assert
    expect(applyCommasToDigits("")).toBe("")
    expect(applyCommasToDigits("1")).toBe("1")
    expect(applyCommasToDigits("12")).toBe("12")
    expect(applyCommasToDigits("123")).toBe("123")
  })

  it("adds a comma after the first digit for four-digit numbers", () => {
    // Arrange
    // Act
    const result = applyCommasToDigits("1234")

    // Assert
    expect(result).toBe("1,234")
  })

  it("handles larger numbers", () => {
    // Arrange / Act / Assert
    expect(applyCommasToDigits("12345")).toBe("12,345")
    expect(applyCommasToDigits("123456")).toBe("123,456")
    expect(applyCommasToDigits("1234567")).toBe("1,234,567")
  })

  it("preserves leading zeros (transient mid-edit state)", () => {
    // Arrange / Act / Assert
    expect(applyCommasToDigits("00")).toBe("00")
    expect(applyCommasToDigits("0100")).toBe("0,100")
  })
})

describe("formatNuyenDisplay", () => {
  it("returns empty string for undefined", () => {
    // Arrange / Act / Assert
    expect(formatNuyenDisplay(undefined)).toBe("")
  })

  it("returns empty string for NaN", () => {
    // Arrange / Act / Assert
    expect(formatNuyenDisplay(NaN)).toBe("")
  })

  it("formats 0 as '0'", () => {
    // Arrange / Act / Assert
    expect(formatNuyenDisplay(0)).toBe("0")
  })

  it("formats positive integers with commas", () => {
    // Arrange / Act / Assert
    expect(formatNuyenDisplay(1000)).toBe("1,000")
    expect(formatNuyenDisplay(15000)).toBe("15,000")
  })
})

describe("countCommasBeforeDigit", () => {
  it("returns 0 when there are no commas before the digit position", () => {
    // Arrange / Act / Assert
    expect(countCommasBeforeDigit("1,234", 1)).toBe(0)
    expect(countCommasBeforeDigit("123", 3)).toBe(0)
  })

  it("returns 1 when one comma precedes the digit position", () => {
    // Arrange / Act / Assert
    expect(countCommasBeforeDigit("1,234", 2)).toBe(1)
    expect(countCommasBeforeDigit("1,234", 4)).toBe(1)
  })

  it("returns 2 for positions after two commas", () => {
    // Arrange / Act / Assert
    expect(countCommasBeforeDigit("1,234,567", 7)).toBe(2)
  })

  it("returns 0 for digit position 0", () => {
    // Arrange / Act / Assert
    expect(countCommasBeforeDigit("1,234", 0)).toBe(0)
  })
})

// UX scenarios: each tuple is [inputValue, selectionStart, expectedFormatted, expectedCursor]
// The `inputValue` is what the browser hands us after its own edit; `selectionStart`
// is where the browser placed the cursor. We verify the formatted output and where
// our cursor-tracking logic places the caret in that output.
describe("computeNuyenEdit — UX test scenarios", () => {
  describe("typing digits from empty to 1,234,567", () => {
    it("empty → '1' at end", () => {
      // Arrange / Act
      const result = computeNuyenEdit("1", 1)

      // Assert
      expect(result).toEqual({ rawDigits: "1", formatted: "1", cursor: 1 })
    })

    it("'1' → '12' at end", () => {
      // Arrange / Act
      const result = computeNuyenEdit("12", 2)

      // Assert
      expect(result).toEqual({ rawDigits: "12", formatted: "12", cursor: 2 })
    })

    it("'12' → '123' at end", () => {
      // Arrange / Act
      const result = computeNuyenEdit("123", 3)

      // Assert
      expect(result).toEqual({ rawDigits: "123", formatted: "123", cursor: 3 })
    })

    it("'123' → '1234' — comma inserted, cursor moves past it", () => {
      // Arrange / Act
      // Browser gives us "1234" with cursor at 4; we expect formatted "1,234" cursor at 5
      const result = computeNuyenEdit("1234", 4)

      // Assert
      expect(result).toEqual({ rawDigits: "1234", formatted: "1,234", cursor: 5 })
    })

    it("'1,234' → '12345' — cursor at end after adding digit mid-5-digit number", () => {
      // Arrange / Act
      // Before: "1,234", cursor at 5. User types '5' → browser gives "1,2345", cursor 6
      const result = computeNuyenEdit("1,2345", 6)

      // Assert
      expect(result).toEqual({ rawDigits: "12345", formatted: "12,345", cursor: 6 })
    })

    it("'1,234,567' at end", () => {
      // Arrange / Act
      const result = computeNuyenEdit("1,234,567", 9)

      // Assert
      expect(result).toEqual({ rawDigits: "1234567", formatted: "1,234,567", cursor: 9 })
    })
  })

  describe("backspace sequence from 100 to empty then retype", () => {
    it("'100|' → backspace → '10'", () => {
      // Arrange / Act
      const result = computeNuyenEdit("10", 2)

      // Assert
      expect(result).toEqual({ rawDigits: "10", formatted: "10", cursor: 2 })
    })

    it("'10|' → backspace → '1'", () => {
      // Arrange / Act
      const result = computeNuyenEdit("1", 1)

      // Assert
      expect(result).toEqual({ rawDigits: "1", formatted: "1", cursor: 1 })
    })

    it("'1|' → backspace → empty", () => {
      // Arrange / Act
      const result = computeNuyenEdit("", 0)

      // Assert
      expect(result).toEqual({ rawDigits: "", formatted: "", cursor: 0 })
    })

    it("'|' → type '1' → '1'", () => {
      // Arrange / Act
      const result = computeNuyenEdit("1", 1)

      // Assert
      expect(result).toEqual({ rawDigits: "1", formatted: "1", cursor: 1 })
    })

    it("'150|' → type '0' → '1,500'", () => {
      // Arrange / Act
      const result = computeNuyenEdit("1500", 4)

      // Assert
      expect(result).toEqual({ rawDigits: "1500", formatted: "1,500", cursor: 5 })
    })

    it("'1,500|' → type '0' → '15,000'", () => {
      // Arrange / Act
      // Browser hands us "1,5000", cursor at 6
      const result = computeNuyenEdit("1,5000", 6)

      // Assert
      expect(result).toEqual({ rawDigits: "15000", formatted: "15,000", cursor: 6 })
    })
  })

  describe("backspace in middle of number (test case 3)", () => {
    it("'1|00' → backspace → '|00' (cursor at 0, display keeps leading zero)", () => {
      // Arrange / Act
      // Before: "100" cursor at 1. Backspace removes '1' → browser gives "00", cursor 0
      const result = computeNuyenEdit("00", 0)

      // Assert
      expect(result).toEqual({ rawDigits: "00", formatted: "00", cursor: 0 })
    })

    it("'|00' → type '2' → '2|00'", () => {
      // Arrange / Act
      // Browser gives "200", cursor at 1
      const result = computeNuyenEdit("200", 1)

      // Assert
      expect(result).toEqual({ rawDigits: "200", formatted: "200", cursor: 1 })
    })

    it("'2|00' → type '0' → '2,0|00' (comma inserted before cursor)", () => {
      // Arrange / Act
      // Before: "200" cursor at 1. Type '0' → browser gives "2000", cursor 2
      const result = computeNuyenEdit("2000", 2)

      // Assert
      expect(result).toEqual({ rawDigits: "2000", formatted: "2,000", cursor: 3 })
    })
  })

  describe("delete in middle then insert (test case 4)", () => {
    it("'1|00' → delete → '1|0'", () => {
      // Arrange / Act
      // Before: "100" cursor at 1. Delete key removes '0' at pos 1 → browser gives "10", cursor 1
      const result = computeNuyenEdit("10", 1)

      // Assert
      expect(result).toEqual({ rawDigits: "10", formatted: "10", cursor: 1 })
    })

    it("'1|0' → type '2' → '12|0'", () => {
      // Arrange / Act
      // Browser gives "120", cursor at 2
      const result = computeNuyenEdit("120", 2)

      // Assert
      expect(result).toEqual({ rawDigits: "120", formatted: "120", cursor: 2 })
    })

    it("'12|0' → type '0' → '1,20|0' (comma shifts cursor)", () => {
      // Arrange / Act
      // Before: "120" cursor at 2. Type '0' → browser gives "1200", cursor 3
      const result = computeNuyenEdit("1200", 3)

      // Assert
      expect(result).toEqual({ rawDigits: "1200", formatted: "1,200", cursor: 4 })
    })
  })
})
