import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../page-objects/CharacterBuilderPage.ts"

/**
 * Full build test for a Combat Mage (Elf, Magician).
 *
 * BP accounting (total = 400):
 *   Biology    45  — Elf (30) + Magician awakening (15)
 *   Attributes 230 — see incAttr calls below
 *   Qualities  -35 — 0 positive (Magician is in awakening) − 35 negative
 *   Skills     124 — 8 individual skills + Conjuring group 3
 *   Spells      24 — 8 spells × 3 BP each
 *   Gear         4 — 18,000 ¥ items + 2,000 ¥ Low lifestyle = 20,000 ¥
 *   Contacts     8 — Fixer C2/L2 (4) + Talismonger C2/L2 (4)
 *
 * The Magician quality (15 BP) is already included in the awakening cost that
 * appears under Biology, so it is NOT added as a separate quality entry.
 */
test("Combat Mage — full build uses all 400 BP with correct summary", async ({
  page,
}) => {
  const builder = new CharacterBuilderPage(page)
  await builder.setup()

  // ─── Biology ────────────────────────────────────────────────────────────

  await builder.setMetatype("Elf")
  await builder.setAwakening("Magician")

  // ─── Attributes ─────────────────────────────────────────────────────────
  // Elf minimums: BOD 1, AGI 2, REA 1, STR 1, CHA 3, INT 1, LOG 1, WIL 1
  // Magic min 1 (Magician), EDG min 1
  // Target: B3 A4 R4 S3 C4 I3 L4 W4 MAG5 EDG2
  // Normal-attr budget used: (2+2+3+2+1+2+3+3)×10 = 180 / 200 BP

  await builder.attributes.increment("BOD", 2) // 1→3
  await builder.attributes.increment("AGI", 2) // 2→4
  await builder.attributes.increment("REA", 3) // 1→4
  await builder.attributes.increment("STR", 2) // 1→3
  await builder.attributes.increment("CHA", 1) // 3→4
  await builder.attributes.increment("INT", 2) // 1→3
  await builder.attributes.increment("LOG", 3) // 1→4
  await builder.attributes.increment("WIL", 3) // 1→4
  await builder.attributes.increment("MAG", 4) // 1→5  (special — not in 200 BP budget)
  await builder.attributes.increment("EDG", 1) // 1→2  (special — not in 200 BP budget)

  // ─── Active Skills ───────────────────────────────────────────────────────
  // 12 + 8 + 12 + 12 + 10 + 8 + 12 + 20 = 94 BP individual
  // Conjuring group 3 = 30 BP
  // Total skills = 124 BP

  await builder.skills.addSkill("Astral Combat", 3)
  await builder.skills.addSkill("Blades", 2)
  await builder.skills.addSkill("Counterspelling", 3)
  await builder.skills.addSkill("Dodge", 3)
  await builder.skills.addSkill("Etiquette", 2, "Street") // +2 BP for spec
  await builder.skills.addSkill("Perception", 2)
  await builder.skills.addSkill("Pistols", 3)
  await builder.skills.addSkill("Spellcasting", 5)
  await builder.skills.addGroup("Conjuring", 3) // 30 BP

  // ─── Qualities (negatives only — Magician quality is in Biology) ──────

  await builder.qualities.add("Mild Allergy to Sunlight", "negative", 10)
  await builder.qualities.add("Addiction (Mild, Simsense)", "negative", 5)
  await builder.qualities.add("Addiction (Mild, Stimulants)", "negative", 5)
  await builder.qualities.add("Sensitive System", "negative", 15)

  // ─── Spells (8 × 3 BP = 24 BP) ──────────────────────────────────────────

  await builder.spells.add("Armor", "Physical", "Stun", "Touch")
  await builder.spells.add("Clout", "Physical", "Physical", "Line of Sight")
  await builder.spells.add("Increase Initiative", "Physical", "Stun", "Touch")
  await builder.spells.add("Levitate", "Physical", "Stun", "Line of Sight")
  await builder.spells.add("Lightning Bolt", "Physical", "Physical", "Line of Sight")
  await builder.spells.add("Manaball", "Mana", "Physical", "Line of Sight")
  await builder.spells.add("Manabolt", "Mana", "Physical", "Line of Sight")
  await builder.spells.add("Physical Barrier", "Physical", "Stun", "Touch")

  // ─── Gear ────────────────────────────────────────────────────────────────
  // 18,000 ¥ + 2,000 ¥ (Low lifestyle default) = 20,000 ¥ → 4 BP

  await builder.gear.addMiscItem("Magical Equipment", 18_000)

  // ─── Contacts ────────────────────────────────────────────────────────────

  await builder.contacts.add("Fixer", 2, 2)
  await builder.contacts.add("Talismonger", 2, 2)

  // ─── Verify BP summary ───────────────────────────────────────────────────

  await builder.bpSummary.verify([
    { label: "Biology", bp: 45 },
    { label: "Attributes", bp: 230 },
    { label: "Qualities", bp: -35 },
    { label: "Skills", bp: 124 },
    { label: "Spells", bp: 24 },
    { label: "Gear", bp: 4 },
    { label: "Contacts", bp: 8 },
  ])

  await expect(page.getByRole("alert")).toHaveCount(0)
})
