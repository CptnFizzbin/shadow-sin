import { describe, expect, it } from "vitest"

import type { ContactData } from "#/system/model/contacts/contactData.ts"

import { mergeContacts } from "./contacts.actions.ts"
import { contactsReducer } from "./contacts.state.ts"

const makeContact = (overrides: Partial<ContactData>): ContactData => ({
  id: crypto.randomUUID(),
  name: "Fixer",
  connection: 3,
  loyalty: 2,
  ...overrides,
})

describe.concurrent("mergeContacts", () => {
  it("appends contacts the runner doesn't already have", () => {
    // Arrange
    const existing = makeContact({ name: "Mama Hu" })
    const incoming = makeContact({ name: "Doc Wagon" })

    // Act
    const next = contactsReducer([existing], mergeContacts([incoming]))

    // Assert
    expect(next).toEqual([existing, incoming])
  })

  it("replaces an existing contact that shares an incoming contact's id", () => {
    // Arrange
    const existing = makeContact({ name: "Mama Hu", connection: 2 })
    const updated = { ...existing, connection: 5 }

    // Act
    const next = contactsReducer([existing], mergeContacts([updated]))

    // Assert
    expect(next).toEqual([updated])
  })
})
