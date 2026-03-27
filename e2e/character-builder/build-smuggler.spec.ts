import { expect, test } from "@playwright/test"

import {
  addActiveSkill,
  addContact,
  addMiscGearItem,
  addQuality,
  addSkillGroup,
  incAttr,
  setupNewCharacter,
  verifyBpSummary,
} from "./helpers.ts"

/**
 * Full build test for a Smuggler (Human, Mundane).
 *
 * BP accounting (total = 400):
 *   Biology      0 — Human (0) + Mundane (0)
 *   Attributes 210 — (2+4+4+1+1+4+2+2)×10 normal + 1×10 EDG special
 *   Qualities  -30 — 0 positive − 30 negative
 *   Skills     156 — 10 individual skills + Mechanic group 2
 *   Gear        50 — 248,000 ¥ items + 2,000 ¥ Low lifestyle = 250,000 ¥
 *   Contacts    14 — Fixer C2/L2 (4) + Mechanic C2/L3 (5) + Mr. Johnson C4/L1 (5)
 *
 * Note: The normal-attribute budget (200 BP) is exactly used:
 *   BOD 2 + AGI 4 + REA 4 + STR 1 + CHA 1 + INT 4 + LOG 2 + WIL 2 = 20 clicks.
 */
test("Smuggler — full build uses all 400 BP with correct summary", async ({
  page,
}) => {
  await setupNewCharacter(page)

  // Human + Mundane are the defaults — no biology changes needed.

  // ─── Attributes ─────────────────────────────────────────────────────────
  // Human minimums: BOD 1, AGI 1, REA 1, STR 1, CHA 1, INT 1, LOG 1, WIL 1, EDG 2
  // Target: B3 A5 R5 S2 C2 I5 L3 W3 EDG3
  // Normal budget: (2+4+4+1+1+4+2+2)×10 = 200/200 BP (exactly at limit)

  await incAttr(page, "BOD", 2) // 1→3
  await incAttr(page, "AGI", 4) // 1→5
  await incAttr(page, "REA", 4) // 1→5
  await incAttr(page, "STR", 1) // 1→2
  await incAttr(page, "CHA", 1) // 1→2
  await incAttr(page, "INT", 4) // 1→5
  await incAttr(page, "LOG", 2) // 1→3
  await incAttr(page, "WIL", 2) // 1→3
  await incAttr(page, "EDG", 1) // 2→3  (special — not in 200 BP budget)

  // ─── Active Skills ───────────────────────────────────────────────────────
  // Dodge 3 (12) + Etiquette 2+spec (10) + Electronic Warfare 4 (16) +
  // Gunnery 4 (16) + Navigation 2 (8) + Negotiation 2+spec (10) +
  // Perception 3 (12) + Pilot Aircraft 4 (16) + Pilot Ground Craft 5 (20) +
  // Pistols 1 (4) + Infiltration 3 (12) = 136 BP individual
  // Mechanic group 2 = 20 BP  →  total = 156 BP

  await addActiveSkill(page, "Dodge", 3)
  await addActiveSkill(page, "Etiquette", 2, "Smugglers")
  await addActiveSkill(page, "Electronic Warfare", 4)
  await addActiveSkill(page, "Gunnery", 4)
  await addActiveSkill(page, "Navigation", 2)
  await addActiveSkill(page, "Negotiation", 2, "Bargaining")
  await addActiveSkill(page, "Perception", 3)
  await addActiveSkill(page, "Pilot Aircraft", 4)
  await addActiveSkill(page, "Pilot Ground Craft", 5)
  await addActiveSkill(page, "Pistols", 1)
  await addActiveSkill(page, "Infiltration", 3)
  await addSkillGroup(page, "Mechanic", 2)

  // ─── Qualities (negatives only) ──────────────────────────────────────────

  await addQuality(page, "Elf Poser", "negative", 5)
  await addQuality(page, "Low Pain Tolerance", "negative", 10)
  await addQuality(page, "Moderate Allergy to Sunlight", "negative", 15)

  // ─── Gear ────────────────────────────────────────────────────────────────
  // 248,000 ¥ + 2,000 ¥ (Low lifestyle default) = 250,000 ¥ → 50 BP

  await addMiscGearItem(page, "Gear and Equipment", 248_000)

  // ─── Contacts ────────────────────────────────────────────────────────────

  await addContact(page, "Fixer", 2, 2)       // 4 BP
  await addContact(page, "Mechanic", 2, 3)    // 5 BP
  await addContact(page, "Mr. Johnson", 4, 1) // 5 BP

  // ─── Verify BP summary ───────────────────────────────────────────────────
  // Biology = 0 (Human + Mundane) — no value cell shown for zero-cost rows.

  await verifyBpSummary(page, [
    { label: "Biology", bp: 0 },
    { label: "Attributes", bp: 210 },
    { label: "Qualities", bp: -30 },
    { label: "Skills", bp: 156 },
    { label: "Gear", bp: 50 },
    { label: "Contacts", bp: 14 },
  ])

  await expect(page.getByRole("alert")).toHaveCount(0)
})
