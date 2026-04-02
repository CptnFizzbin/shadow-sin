import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const docPath = resolve(process.cwd(), "docs/features/gameplay.md")
const content = readFileSync(docPath, "utf8")
const lines = content.split("\n")

describe("docs/features/gameplay.md — document structure", () => {
  it("exists and has content", () => {
    expect(content.length).toBeGreaterThan(0)
    expect(lines.length).toBeGreaterThan(200)
  })

  it("starts with the correct H1 title", () => {
    const title = lines[0]
    expect(title).toBe("# Gameplay Tool — Feature Checklist")
  })

  it("contains a Priority order section", () => {
    expect(content).toContain("## Priority order")
  })

  it("lists exactly 7 items in the priority order", () => {
    // Arrange
    const priorityStart = content.indexOf("## Priority order")
    const nextSection = content.indexOf("\n## ", priorityStart + 1)
    const priorityBlock = content.slice(priorityStart, nextSection)

    // Act — numbered list items at the start of a line
    const priorityItems = priorityBlock.match(/^\d+\. /gm) ?? []

    // Assert
    expect(priorityItems).toHaveLength(7)
  })

  it("contains all 11 numbered H2 sections", () => {
    for (let i = 1; i <= 11; i++) {
      expect(content).toContain(`## ${i}.`)
    }
  })

  it("contains the Out of Scope section", () => {
    expect(content).toContain("## Out of Scope")
  })

  it("section numbers are sequential with no gaps (1 through 11)", () => {
    // Act — collect all top-level numbered H2 headings
    const sectionHeadings = lines
      .filter((line) => /^## \d+\./.test(line))
      .map((line) => {
        const match = line.match(/^## (\d+)\./)
        return match ? parseInt(match[1], 10) : null
      })
      .filter((n): n is number => n !== null)

    // Assert
    expect(sectionHeadings).toHaveLength(11)
    for (let i = 0; i < sectionHeadings.length; i++) {
      expect(sectionHeadings[i]).toBe(i + 1)
    }
  })
})

describe("docs/features/gameplay.md — section 1 (Character Sheet Viewer) sub-sections", () => {
  it("contains sub-section 1a for the Skills page", () => {
    expect(content).toContain("### 1a.")
    expect(content).toContain("/$characterId/skills")
  })

  it("contains sub-section 1b for the Gear page", () => {
    expect(content).toContain("### 1b.")
    expect(content).toContain("/$characterId/gear")
  })

  it("contains sub-section 1c for the Spells & Powers page", () => {
    expect(content).toContain("### 1c.")
    expect(content).toContain("/$characterId/spells")
  })

  it("contains sub-section 1d for the Contacts page", () => {
    expect(content).toContain("### 1d.")
    expect(content).toContain("/$characterId/contacts")
  })

  it("contains sub-section 1e for the Vehicles & Drones pages", () => {
    expect(content).toContain("### 1e.")
    expect(content).toContain("/$characterId/vehicles")
    expect(content).toContain("/$characterId/drones")
  })

  it("contains sub-section 1f for the Notes page", () => {
    expect(content).toContain("### 1f.")
    expect(content).toContain("/$characterId/notes")
  })
})

describe("docs/features/gameplay.md — section 2 (Damage Tracking) sub-sections", () => {
  it("contains sub-section 2a for Physical & Stun Damage Monitors", () => {
    expect(content).toContain("### 2a.")
  })

  it("documents the correct physical track formula", () => {
    expect(content).toContain("8 + ceil(Body / 2)")
  })

  it("documents the correct stun track formula", () => {
    expect(content).toContain("8 + ceil(Willpower / 2)")
  })

  it("contains sub-section 2b for Matrix Condition Monitor", () => {
    expect(content).toContain("### 2b.")
    expect(content).toContain("Device Rating")
  })

  it("contains sub-section 2c for Vehicle Condition Monitor", () => {
    expect(content).toContain("### 2c.")
  })
})

describe("docs/features/gameplay.md — section 4 (Initiative Tracking)", () => {
  it("documents the physical initiative formula", () => {
    expect(content).toContain("Reaction + Intuition + 1d6")
  })

  it("documents the wired-rigging initiative formula", () => {
    expect(content).toContain("Reaction + Intuition + 2d6")
  })

  it("documents the matrix hot-sim initiative formula", () => {
    expect(content).toContain("Resonance + Intuition + 1d6")
  })

  it("documents the initiative pass decrement rule", () => {
    expect(content).toContain("decrement score by 10")
  })
})

describe("docs/features/gameplay.md — section 5 (Edge Management)", () => {
  it("references CharacterSheet.edge.current for current Edge", () => {
    expect(content).toContain("CharacterSheet.edge.current")
  })

  it("references CharacterSheet.attributes.edge for the Edge ceiling", () => {
    expect(content).toContain("CharacterSheet.attributes.edge")
  })

  it("documents Spend Edge floor of 0", () => {
    expect(content).toContain("floor of 0")
  })
})

describe("docs/features/gameplay.md — section 6 (Magic & Resonance) sub-sections", () => {
  it("contains sub-section 6a for Spellcasting & Drain", () => {
    expect(content).toContain("### 6a.")
    expect(content).toContain("Magic + Spellcasting")
  })

  it("contains sub-section 6b for Summoning & Binding", () => {
    expect(content).toContain("### 6b.")
    expect(content).toContain("Magic + Summoning")
  })

  it("contains sub-section 6c for Adept Powers in Play", () => {
    expect(content).toContain("### 6c.")
  })

  it("contains sub-section 6d for Technomancer Actions", () => {
    expect(content).toContain("### 6d.")
    expect(content).toContain("Resonance + Compiling")
  })

  it("gates spell list on AwakeningType.Magician and AwakeningType.MysticAdept", () => {
    expect(content).toContain("AwakeningType.Magician")
    expect(content).toContain("AwakeningType.MysticAdept")
  })

  it("gates adept powers on AwakeningType.Adept", () => {
    expect(content).toContain("AwakeningType.Adept")
  })

  it("gates complex forms on AwakeningType.Technomancer", () => {
    expect(content).toContain("AwakeningType.Technomancer")
  })
})

describe("docs/features/gameplay.md — section 7 (Karma & Advancement)", () => {
  it("references CharacterSheet.karma.current", () => {
    expect(content).toContain("CharacterSheet.karma.current")
  })

  it("references CharacterSheet.karma.total", () => {
    expect(content).toContain("CharacterSheet.karma.total")
  })

  it("documents the active skill karma cost (new rating × 2)", () => {
    expect(content).toContain("new rating × 2")
  })

  it("documents the skill group karma cost (new rating × 5)", () => {
    expect(content).toContain("new rating × 5")
  })

  it("documents the specialization karma cost (2 karma)", () => {
    // Arrange
    const section7Start = content.indexOf("## 7.")
    const section8Start = content.indexOf("## 8.")
    const section7 = content.slice(section7Start, section8Start)

    // Assert — cost of `2` karma for specialization
    expect(section7).toContain("Specialization: `2` karma")
  })

  it("documents the complex form karma cost (4 karma)", () => {
    // Arrange
    const section7Start = content.indexOf("## 7.")
    const section8Start = content.indexOf("## 8.")
    const section7 = content.slice(section7Start, section8Start)

    // Assert
    expect(section7).toContain("Complex form: `4` karma")
  })

  it("documents the knowledge/language skill karma cost (new rating × 1)", () => {
    expect(content).toContain("new rating × 1")
  })
})

describe("docs/features/gameplay.md — checkbox syntax", () => {
  it("uses only valid GFM checkbox syntax ([ ] or [x])", () => {
    // Arrange
    const checkboxLines = lines.filter((line) => /^\s*- \[/.test(line))

    // Act — all checkbox lines should match the valid patterns
    const invalidLines = checkboxLines.filter((line) => !/^\s*- \[(x| )\]/.test(line))

    // Assert
    expect(invalidLines).toHaveLength(0)
  })

  it("has at least one completed ([x]) item", () => {
    const completedItems = lines.filter((line) => /^\s*- \[x\]/.test(line))
    expect(completedItems.length).toBeGreaterThan(0)
  })

  it("has more pending ([ ]) items than completed ([x]) items", () => {
    // Arrange
    const pendingItems = lines.filter((line) => /^\s*- \[ \]/.test(line))
    const completedItems = lines.filter((line) => /^\s*- \[x\]/.test(line))

    // Assert — doc reflects work-in-progress state
    expect(pendingItems.length).toBeGreaterThan(completedItems.length)
  })

  it("contains the ✅ fully-implemented status marker", () => {
    expect(content).toContain("✅")
  })

  it("contains the ⚠️ partial-implementation status marker", () => {
    expect(content).toContain("⚠️")
  })
})

describe("docs/features/gameplay.md — section 9 (Data Import/Export)", () => {
  it("mentions JSON export and JSON import", () => {
    const section9Start = content.indexOf("## 9.")
    const section10Start = content.indexOf("## 10.")
    const section9 = content.slice(section9Start, section10Start)

    expect(section9).toContain("JSON export")
    expect(section9).toContain("JSON import")
  })

  it("mentions YAML import for round-trip fidelity", () => {
    expect(content).toContain("YAML import")
  })

  it("mentions Google Drive sync and OAuth2 login flow", () => {
    expect(content).toContain("Google Drive sync")
    expect(content).toContain("OAuth2 login flow")
  })
})

describe("docs/features/gameplay.md — boundary and regression cases", () => {
  it("ends with a trailing newline", () => {
    // EditorConfig mandates a final newline
    expect(content.endsWith("\n")).toBe(true)
  })

  it("does not contain Windows-style CRLF line endings", () => {
    // EditorConfig mandates LF
    expect(content).not.toContain("\r\n")
  })

  it("references the companion character-builder document", () => {
    expect(content).toContain("docs/features/character-builder.md")
  })

  it("does not reference section 12 or higher (scope boundary)", () => {
    const highNumberedSection = content.match(/^## 1[2-9]\./m)
    expect(highNumberedSection).toBeNull()
  })

  it("offensive section references CharacterSheet.gear for weapons", () => {
    expect(content).toContain("CharacterSheet.gear")
  })

  it("skill dice pool formula includes wound modifier", () => {
    // Section 1a specifies the formula
    expect(content).toContain("rating + linked-attribute-value + wound-mod")
  })
})