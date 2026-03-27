import { describe, expect, it } from "vitest"

import {
  ContactCostPerConnection,
  ContactCostPerLoyalty,
  getContactBpCost,
} from "#/components/CharacterBuilder/Contacts/ContactsUtils.ts"
import type { ContactData } from "#/lib/system/contactData.ts"

function makeContact(
  overrides: Partial<ContactData> & { connection: number, loyalty: number },
): ContactData {
  return {
    id: "test-contact",
    name: "Test Contact",
    ...overrides,
  }
}

describe("ContactsUtils constants", () => {
  it("costs 1 BP per connection point", () => {
    expect(ContactCostPerConnection).toBe(1)
  })

  it("costs 1 BP per loyalty point", () => {
    expect(ContactCostPerLoyalty).toBe(1)
  })
})

describe("getContactBpCost", () => {
  it("returns 0 for a contact with zero connection and loyalty", () => {
    expect(getContactBpCost(makeContact({ connection: 0, loyalty: 0 }))).toBe(0)
  })

  it("returns connection + loyalty as the total BP cost", () => {
    expect(getContactBpCost(makeContact({ connection: 4, loyalty: 3 }))).toBe(7)
  })

  it("handles high connection with low loyalty", () => {
    expect(getContactBpCost(makeContact({ connection: 6, loyalty: 1 }))).toBe(7)
  })

  it("handles low connection with high loyalty", () => {
    expect(getContactBpCost(makeContact({ connection: 1, loyalty: 6 }))).toBe(7)
  })

  it("handles equal connection and loyalty", () => {
    expect(getContactBpCost(makeContact({ connection: 3, loyalty: 3 }))).toBe(6)
  })
})
