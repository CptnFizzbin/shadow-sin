import { describe, expect, it, vi } from "vitest"

// Mock the route modules to avoid router dependency
vi.mock("#/routes/$characterId/about.tsx", () => ({ Route: { id: "about", path: "/about" } }))
vi.mock("#/routes/$characterId/contacts.tsx", () => ({ Route: { id: "contacts", path: "/contacts" } }))
vi.mock("#/routes/$characterId/defense.tsx", () => ({ Route: { id: "defense", path: "/defense" } }))
vi.mock("#/routes/$characterId/drones.tsx", () => ({ Route: { id: "drones", path: "/drones" } }))
vi.mock("#/routes/$characterId/gear.tsx", () => ({ Route: { id: "gear", path: "/gear" } }))
vi.mock("#/routes/$characterId/notes.tsx", () => ({ Route: { id: "notes", path: "/notes" } }))
vi.mock("#/routes/$characterId/offense.tsx", () => ({ Route: { id: "offense", path: "/offense" } }))
vi.mock("#/routes/$characterId/qualities.tsx", () => ({ Route: { id: "qualities", path: "/qualities" } }))
vi.mock("#/routes/$characterId/skills.tsx", () => ({ Route: { id: "skills", path: "/skills" } }))
vi.mock("#/routes/$characterId/spells.tsx", () => ({ Route: { id: "spells", path: "/spells" } }))
vi.mock("#/routes/$characterId/vehicles.tsx", () => ({ Route: { id: "vehicles", path: "/vehicles" } }))

import {
  characterSectionOrder,
  characterSections,
  SectionKey,
} from "#/components/Character/character-sections.ts"

describe("SectionKey", () => {
  it("defines the expected section keys", () => {
    expect(SectionKey.about).toBe("about")
    expect(SectionKey.defense).toBe("defense")
    expect(SectionKey.offense).toBe("offense")
    expect(SectionKey.gear).toBe("gear")
    expect(SectionKey.skills).toBe("skills")
    expect(SectionKey.spells).toBe("spells")
    expect(SectionKey.drones).toBe("drones")
    expect(SectionKey.vehicles).toBe("vehicles")
    expect(SectionKey.contacts).toBe("contacts")
    expect(SectionKey.qualities).toBe("qualities")
    expect(SectionKey.notes).toBe("notes")
  })

  it("has exactly 11 section keys", () => {
    // Arrange / Act
    const keys = Object.values(SectionKey)

    // Assert
    expect(keys).toHaveLength(11)
  })
})

describe("characterSections", () => {
  it("has an entry for every SectionKey", () => {
    // Arrange
    const keys = Object.values(SectionKey)

    // Act / Assert
    for (const key of keys) {
      expect(characterSections).toHaveProperty(key)
    }
  })

  it("each section has an id, label, and route property", () => {
    // Arrange
    const sections = Object.values(characterSections)

    // Act / Assert
    for (const section of sections) {
      expect(section).toHaveProperty("id")
      expect(section).toHaveProperty("label")
      expect(section).toHaveProperty("route")
    }
  })

  it("each section id matches its SectionKey", () => {
    // Arrange / Act / Assert
    for (const [key, section] of Object.entries(characterSections)) {
      expect(section.id).toBe(key)
    }
  })

  it("section labels are non-empty strings", () => {
    // Arrange
    const sections = Object.values(characterSections)

    // Act / Assert
    for (const section of sections) {
      expect(typeof section.label).toBe("string")
      expect(section.label.length).toBeGreaterThan(0)
    }
  })

  it("about section has correct id and label", () => {
    // Arrange / Act
    const aboutSection = characterSections[SectionKey.about]

    // Assert
    expect(aboutSection.id).toBe(SectionKey.about)
    expect(aboutSection.label).toBe("About")
  })

  it("gear section label is 'Cyberware'", () => {
    // Arrange / Act
    const gearSection = characterSections[SectionKey.gear]

    // Assert
    expect(gearSection.label).toBe("Cyberware")
  })

  it("skills section has correct label", () => {
    // Arrange / Act
    const skillsSection = characterSections[SectionKey.skills]

    // Assert
    expect(skillsSection.label).toBe("Skills")
  })
})

describe("characterSectionOrder", () => {
  it("contains the same number of sections as characterSections", () => {
    // Arrange
    const sectionCount = Object.keys(characterSections).length

    // Act / Assert
    expect(characterSectionOrder).toHaveLength(sectionCount)
  })

  it("contains all sections defined in characterSections", () => {
    // Arrange
    const sectionIds = characterSectionOrder.map((s) => s.id)

    // Act / Assert
    for (const key of Object.values(SectionKey)) {
      expect(sectionIds).toContain(key)
    }
  })

  it("has about section as the first entry", () => {
    // Arrange / Act
    const firstSection = characterSectionOrder[0]

    // Assert
    expect(firstSection.id).toBe(SectionKey.about)
  })

  it("has notes section as the last entry", () => {
    // Arrange / Act
    const lastSection = characterSectionOrder[characterSectionOrder.length - 1]

    // Assert
    expect(lastSection.id).toBe(SectionKey.notes)
  })

  it("has no duplicate sections", () => {
    // Arrange
    const sectionIds = characterSectionOrder.map((s) => s.id)
    const uniqueIds = new Set(sectionIds)

    // Act / Assert
    expect(uniqueIds.size).toBe(sectionIds.length)
  })
})