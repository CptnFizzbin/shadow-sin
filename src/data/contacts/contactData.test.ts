import { describe, expect, it } from "vitest"

import { ContactDataSchema } from "./contactData.ts"
import { ContactSkillType } from "./contactSkillData.ts"

const baseContact = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Fixer Sam",
  connection: 3,
  loyalty: 2,
}

describe.concurrent("ContactDataSchema", () => {
  it("treats an imported skill without a type as a knowledge skill", () => {
    // Arrange
    const input = { ...baseContact, skills: [{ name: "Street Gangs" }] }

    // Act
    const contact = ContactDataSchema.parse(input)

    // Assert
    expect(contact.skills).toEqual([{ id: expect.any(String), name: "Street Gangs", type: ContactSkillType.knowledge }])
  })

  it("keeps an imported skill's id and type", () => {
    // Arrange
    const skill = { id: "00000000-0000-4000-8000-000000000002", name: "Pistols", type: ContactSkillType.keyActive }
    const input = { ...baseContact, skills: [skill] }

    // Act
    const contact = ContactDataSchema.parse(input)

    // Assert
    expect(contact.skills).toEqual([skill])
  })

  it("imports rated knowledgeSkills as unrated knowledge skills", () => {
    // Arrange
    const input = { ...baseContact, knowledgeSkills: [{ name: "Street Gangs", rating: 3, specialization: "Halloweeners" }] }

    // Act
    const contact = ContactDataSchema.parse(input)

    // Assert
    expect(contact.skills).toEqual([
      { id: expect.any(String), name: "Street Gangs", type: ContactSkillType.knowledge, specialization: "Halloweeners" },
    ])
    expect(contact).not.toHaveProperty("knowledgeSkills")
  })
})
