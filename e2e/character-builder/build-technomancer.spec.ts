import { expect, test } from "@playwright/test"

import {
  addActiveSkill,
  addComplexForm,
  addContact,
  addMiscGearItem,
  addQuality,
  addSkillGroup,
  incAttr,
  setupNewCharacter,
  verifyBpSummary,
} from "./helpers.ts"

/**
 * Full build test for a Technomancer (Human).
 *
 * BP accounting (total = 400):
 *   Biology     10 — Human (0) + Technomancer awakening (10)
 *   Attributes 230 — see incAttr calls below
 *   Qualities  -15 — Natural Hardening (10) − Combat Paralysis (20) − Weak Immune (5)
 *   Skills     134 — Cracking 3 + Electronics 3 + Tasking 4 groups + 4 individuals
 *   Technomancer 30 — 9 complex forms (reference minus Stealth 5)
 *   Gear         3 — 13,000 ¥ items + 2,000 ¥ Low lifestyle = 15,000 ¥
 *   Contacts     8 — Fixer C2/L2 (4) + Blogger C2/L2 (4)
 *
 * Why Stealth is omitted: the Technomancer awakening costs 10 BP in the app
 * (vs. 5 BP for the "Technomancer" quality listed in the reference sheet).
 * The extra 5 BP is offset by dropping one 5-rating complex form (Stealth).
 * The awakening quality cost is NOT verified as a separate line item.
 */
test("Technomancer — full build uses all 400 BP with correct summary", async ({
  page,
}) => {
  await setupNewCharacter(page)

  // ─── Biology ────────────────────────────────────────────────────────────

  await page.getByRole("combobox", { name: "Awakening" }).click()
  await page.getByRole("option", { name: "Technomancer" }).click()
  await expect(page.getByText("Complex Forms")).toBeVisible()

  // ─── Attributes ─────────────────────────────────────────────────────────
  // Human minimums: BOD 1, AGI 1, REA 1, STR 1, CHA 1, INT 1, LOG 1, WIL 1, EDG 2
  // Resonance min 1 (Technomancer), max 6
  // Target: B2 A3 R4 S2 C3 I5 L5 W3 RES5 EDG2
  // Normal budget: (1+2+3+1+2+4+4+2)×10 = 190 / 200 BP
  // Special: RES 4×10 = 40 BP; EDG stays at min (2), 0 clicks

  await incAttr(page, "BOD", 1) // 1→2
  await incAttr(page, "AGI", 2) // 1→3
  await incAttr(page, "REA", 3) // 1→4
  await incAttr(page, "STR", 1) // 1→2
  await incAttr(page, "CHA", 2) // 1→3
  await incAttr(page, "INT", 4) // 1→5
  await incAttr(page, "LOG", 4) // 1→5
  await incAttr(page, "WIL", 2) // 1→3
  await incAttr(page, "RES", 4) // 1→5  (special — not in 200 BP budget)

  // ─── Active Skills ───────────────────────────────────────────────────────
  // Cracking group 3 (30) + Electronics group 3 (30) + Tasking group 4 (40) +
  // Dodge 2 (8) + Negotiation 2 (8) + Perception 3 (12) +
  // Pistols 1+spec (6) = 134 BP

  await addSkillGroup(page, "Cracking", 3)
  await addSkillGroup(page, "Electronics", 3)
  await addSkillGroup(page, "Tasking", 4)
  await addActiveSkill(page, "Dodge", 2)
  await addActiveSkill(page, "Negotiation", 2)
  await addActiveSkill(page, "Perception", 3)
  await addActiveSkill(page, "Pistols", 1, "Light Pistols")

  // ─── Qualities ───────────────────────────────────────────────────────────

  await addQuality(page, "Natural Hardening", "positive", 10)
  await addQuality(page, "Combat Paralysis", "negative", 20)
  await addQuality(page, "Weak Immune System", "negative", 5)

  // ─── Complex Forms (9 forms = 30 BP; Stealth omitted — see header note) ─

  await addComplexForm(page, "Analyze", 2)
  await addComplexForm(page, "Armor", 3)
  await addComplexForm(page, "Browse", 3)
  await addComplexForm(page, "Attack", 4)
  await addComplexForm(page, "Decrypt", 3)
  await addComplexForm(page, "Exploit", 5)
  await addComplexForm(page, "Edit", 3)
  await addComplexForm(page, "Scan", 3)
  await addComplexForm(page, "Track", 4)

  // ─── Gear ────────────────────────────────────────────────────────────────
  // 13,000 ¥ + 2,000 ¥ (Low lifestyle default) = 15,000 ¥ → 3 BP

  await addMiscGearItem(page, "Matrix Equipment", 13_000)

  // ─── Contacts ────────────────────────────────────────────────────────────

  await addContact(page, "Fixer", 2, 2)
  await addContact(page, "Blogger", 2, 2)

  // ─── Verify BP summary ───────────────────────────────────────────────────

  await verifyBpSummary(page, [
    { label: "Biology", bp: 10 },
    { label: "Attributes", bp: 230 },
    { label: "Qualities", bp: -15 },
    { label: "Skills", bp: 134 },
    { label: "Technomancer", bp: 30 },
    { label: "Gear", bp: 3 },
    { label: "Contacts", bp: 8 },
  ])

  await expect(page.getByRole("alert")).toHaveCount(0)
})
