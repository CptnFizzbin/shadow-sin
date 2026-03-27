import { expect, test } from "@playwright/test"

import { CharacterBuilderPage } from "../page-objects/CharacterBuilderPage.ts"

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
  const builder = new CharacterBuilderPage(page)
  await builder.setup()

  // Human + Mundane are the defaults — no biology changes needed.

  // ─── Attributes ─────────────────────────────────────────────────────────
  // Human minimums: BOD 1, AGI 1, REA 1, STR 1, CHA 1, INT 1, LOG 1, WIL 1, EDG 2
  // Target: B3 A5 R5 S2 C2 I5 L3 W3 EDG3
  // Normal budget: (2+4+4+1+1+4+2+2)×10 = 200/200 BP (exactly at limit)

  await builder.attributes.increment("BOD", 2) // 1→3
  await builder.attributes.increment("AGI", 4) // 1→5
  await builder.attributes.increment("REA", 4) // 1→5
  await builder.attributes.increment("STR", 1) // 1→2
  await builder.attributes.increment("CHA", 1) // 1→2
  await builder.attributes.increment("INT", 4) // 1→5
  await builder.attributes.increment("LOG", 2) // 1→3
  await builder.attributes.increment("WIL", 2) // 1→3
  await builder.attributes.increment("EDG", 1) // 2→3  (special — not in 200 BP budget)

  // ─── Active Skills ───────────────────────────────────────────────────────
  // Dodge 3 (12) + Etiquette 2+spec (10) + Electronic Warfare 4 (16) +
  // Gunnery 4 (16) + Navigation 2 (8) + Negotiation 2+spec (10) +
  // Perception 3 (12) + Pilot Aircraft 4 (16) + Pilot Ground Craft 5 (20) +
  // Pistols 1 (4) + Infiltration 3 (12) = 136 BP individual
  // Mechanic group 2 = 20 BP  →  total = 156 BP

  await builder.skills.addSkill("Dodge", 3)
  await builder.skills.addSkill("Etiquette", 2, "Smugglers")
  await builder.skills.addSkill("Electronic Warfare", 4)
  await builder.skills.addSkill("Gunnery", 4)
  await builder.skills.addSkill("Navigation", 2)
  await builder.skills.addSkill("Negotiation", 2, "Bargaining")
  await builder.skills.addSkill("Perception", 3)
  await builder.skills.addSkill("Pilot Aircraft", 4)
  await builder.skills.addSkill("Pilot Ground Craft", 5)
  await builder.skills.addSkill("Pistols", 1)
  await builder.skills.addSkill("Infiltration", 3)
  await builder.skills.addGroup("Mechanic", 2)

  // ─── Qualities (negatives only) ──────────────────────────────────────────

  await builder.qualities.add("Elf Poser", "negative", 5)
  await builder.qualities.add("Low Pain Tolerance", "negative", 10)
  await builder.qualities.add("Moderate Allergy to Sunlight", "negative", 15)

  // ─── Gear ────────────────────────────────────────────────────────────────
  // 248,000 ¥ + 2,000 ¥ (Low lifestyle default) = 250,000 ¥ → 50 BP

  await builder.gear.addMiscItem("Gear and Equipment", 248_000)

  // ─── Contacts ────────────────────────────────────────────────────────────

  await builder.contacts.add("Fixer", 2, 2) // 4 BP
  await builder.contacts.add("Mechanic", 2, 3) // 5 BP
  await builder.contacts.add("Mr. Johnson", 4, 1) // 5 BP

  // ─── Verify BP summary ───────────────────────────────────────────────────
  // Biology = 0 (Human + Mundane) — no value cell shown for zero-cost rows.

  await builder.bpSummary.verify([
    { label: "Biology", bp: 0 },
    { label: "Attributes", bp: 210 },
    { label: "Qualities", bp: -30 },
    { label: "Skills", bp: 156 },
    { label: "Gear", bp: 50 },
    { label: "Contacts", bp: 14 },
  ])

  await expect(page.getByRole("alert")).toHaveCount(0)
})
