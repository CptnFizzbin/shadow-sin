import { expect, test } from "@playwright/test"

import {
  addActiveSkill,
  addContact,
  addMiscGearItem,
  addQuality,
  addSkillGroup,
  addSpell,
  incAttr,
  setupNewCharacter,
  verifyBpSummary,
} from "./helpers.ts"

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
  await setupNewCharacter(page)

  // ─── Biology ────────────────────────────────────────────────────────────

  await page.getByRole("combobox", { name: "Metatype" }).click()
  await page.getByRole("option", { name: "Elf" }).click()

  await page.getByRole("combobox", { name: "Awakening" }).click()
  await page.getByRole("option", { name: "Magician" }).click()

  // ─── Attributes ─────────────────────────────────────────────────────────
  // Elf minimums: BOD 1, AGI 2, REA 1, STR 1, CHA 3, INT 1, LOG 1, WIL 1
  // Magic min 1 (Magician), EDG min 1
  // Target: B3 A4 R4 S3 C4 I3 L4 W4 MAG5 EDG2
  // Normal-attr budget used: (2+2+3+2+1+2+3+3)×10 = 180 / 200 BP

  await incAttr(page, "BOD", 2) // 1→3
  await incAttr(page, "AGI", 2) // 2→4
  await incAttr(page, "REA", 3) // 1→4
  await incAttr(page, "STR", 2) // 1→3
  await incAttr(page, "CHA", 1) // 3→4
  await incAttr(page, "INT", 2) // 1→3
  await incAttr(page, "LOG", 3) // 1→4
  await incAttr(page, "WIL", 3) // 1→4
  await incAttr(page, "MAG", 4) // 1→5  (special — not in 200 BP budget)
  await incAttr(page, "EDG", 1) // 1→2  (special — not in 200 BP budget)

  // ─── Active Skills ───────────────────────────────────────────────────────
  // 12 + 8 + 12 + 12 + 10 + 8 + 12 + 20 = 94 BP individual
  // Conjuring group 3 = 30 BP
  // Total skills = 124 BP

  await addActiveSkill(page, "Astral Combat", 3)
  await addActiveSkill(page, "Blades", 2)
  await addActiveSkill(page, "Counterspelling", 3)
  await addActiveSkill(page, "Dodge", 3)
  await addActiveSkill(page, "Etiquette", 2, "Street") // +2 BP for spec
  await addActiveSkill(page, "Perception", 2)
  await addActiveSkill(page, "Pistols", 3)
  await addActiveSkill(page, "Spellcasting", 5)
  await addSkillGroup(page, "Conjuring", 3) // 30 BP

  // ─── Qualities (negatives only — Magician quality is in Biology) ──────

  await addQuality(page, "Mild Allergy to Sunlight", "negative", 10)
  await addQuality(page, "Addiction (Mild, Simsense)", "negative", 5)
  await addQuality(page, "Addiction (Mild, Stimulants)", "negative", 5)
  await addQuality(page, "Sensitive System", "negative", 15)

  // ─── Spells (8 × 3 BP = 24 BP) ──────────────────────────────────────────

  await addSpell(page, "Armor", "Physical", "Stun", "Touch")
  await addSpell(page, "Clout", "Physical", "Physical", "Line of Sight")
  await addSpell(page, "Increase Initiative", "Physical", "Stun", "Touch")
  await addSpell(page, "Levitate", "Physical", "Stun", "Line of Sight")
  await addSpell(page, "Lightning Bolt", "Physical", "Physical", "Line of Sight")
  await addSpell(page, "Manaball", "Mana", "Physical", "Line of Sight")
  await addSpell(page, "Manabolt", "Mana", "Physical", "Line of Sight")
  await addSpell(page, "Physical Barrier", "Physical", "Stun", "Touch")

  // ─── Gear ────────────────────────────────────────────────────────────────
  // 18,000 ¥ + 2,000 ¥ (Low lifestyle default) = 20,000 ¥ → 4 BP

  await addMiscGearItem(page, "Magical Equipment", 18_000)

  // ─── Contacts ────────────────────────────────────────────────────────────

  await addContact(page, "Fixer", 2, 2)
  await addContact(page, "Talismonger", 2, 2)

  // ─── Verify BP summary ───────────────────────────────────────────────────

  await verifyBpSummary(page, [
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
