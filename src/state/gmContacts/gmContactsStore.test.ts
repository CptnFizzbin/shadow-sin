import { describe, expect, it } from "vitest"

import type { ContactData } from "#/system/model/contacts/contactData.ts"

import { loadGmContacts, saveGmContacts } from "./gmContactsStore.ts"

const makeStorage = (): Storage => {
  const values = new Map<string, string>()
  return {
    get length() { return values.size },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key) },
    setItem: (key, value) => { values.set(key, value) },
  }
}

const contact: ContactData = {
  id: "5b0d2d0e-3f1c-4a8e-9b7a-2f6c1d9e4a10",
  name: "Mama Hu",
  connection: 4,
  loyalty: 2,
}

describe.concurrent("GM contacts persistence", () => {
  it("loads the contacts it saved", () => {
    // Arrange
    const storage = makeStorage()

    // Act
    saveGmContacts([contact], storage)

    // Assert
    expect(loadGmContacts(storage)).toEqual([contact])
  })

  it("loads no contacts when nothing is saved", () => {
    // Arrange
    const storage = makeStorage()

    // Act
    const loaded = loadGmContacts(storage)

    // Assert
    expect(loaded).toEqual([])
  })

  it("loads no contacts when the saved value is corrupt", () => {
    // Arrange
    const storage = makeStorage()
    storage.setItem("shadowsin:gm/contacts", "{not json")

    // Act
    const loaded = loadGmContacts(storage)

    // Assert
    expect(loaded).toEqual([])
  })
})
