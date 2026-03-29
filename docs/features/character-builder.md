# Character Builder — Feature Checklist

Features still needed to finish the builder portion of the app. Ordered by priority, with a focus on a working
prototype. Gameplay features (combat, dice rolling, etc.) are out of scope here.

> Items marked ✅ are covered by an open PR and pending merge.

---

## Architecture note

The character creation form is implemented as `CharacterBuilder` (not TanStack Form). State lives in two
`@tanstack/store` stores — one for the `CharacterSheet` draft, one for transient builder state — both persisted to
`localStorage` via `StorePersister` / `usePersistedStore`. The storage key format is `shadow-sin:character-form:builder:{id}:character` for new characters and `shadow-sin:character-form:builder:{characterId}:character` for edits.

---

## 1. Character Creation — Form & Save (Blocker)

`CharacterBuilder` captures profile, biology, attributes, skills, qualities, resources, gear, and contacts. Draft state
is persisted to `localStorage` on every store change via `StorePersister`, but save to `characterManager` is not yet
wired.

- [x] Persist form state to localStorage on every field change — keyed by character id or `"new"` for new
  characters ✅ PR #2
- [x] Add a **Reset Form** button that clears localStorage and resets fields to defaults ✅ PR #2
- [ ] Wire `SaveCharacterButton` to call `characterManager.saveCharacter` — button exists and gates on error alerts,
  but has no `onClick` save handler yet
- [ ] Generate a stable `id` (`crypto.randomUUID()`) for new characters on save
- [ ] Redirect to `/$characterId/about` after a successful save
- [ ] Show an inline error if the save fails

---

## 2. Build Point Budget Tracker

Qualities BP spend is wired (PR #1 ✅). A sticky `BpSummaryFooter` with a full per-category breakdown and inline warnings
was added in PR #7 ✅. Attribute BP costs are written reactively by the increment/decrement buttons.

- [x] Track net BP spent on qualities (positive cost, negative grant, cap at −35 BP) ✅ PR #1
- [x] Display a persistent **BP summary bar** (total / spent / remaining) — sticky footer at bottom of creation form ✅
  PR #7
- [x] Break down spending by category: Biology, Qualities, Attributes, Skills, Awakened (conditional), Gear, Contacts ✅
  PR #7
- [x] Apply real-time BP costs as attribute values change (wired via increment/decrement buttons) ✅ PR #7
- [x] Block form submission when the character is over budget — `SaveCharacterButton` disables when any `"error"`
  severity alert is active (includes over-budget)
- [ ] Show a warning when within 10 BP of the limit

---

## 3. Skills (Creation Form)

Full skills section implemented in PR #8 ✅ — Active skills (by name or skill group), Knowledge skills, and Language
skills. Duplicate-skill prevention is handled via disabled menu items. BP costs are calculated dynamically in
`useBuildPointsApi` from the skills arrays. Free SP = (Logic + Intuition) × 3 for knowledge/language skills.

- [x] **Add active skill** — free-text skill name, rating (1–6), optional specialization ✅ PR #8
- [x] **Add skill group** — group name, rating ✅ PR #8
- [x] **Edit / remove** added skills before saving ✅ PR #8
- [x] Separate sections for Active, Knowledge, and Language skills ✅ PR #8
- [x] Reflect BP cost per skill (active: rating × 4; group: rating × 10; specialization: +2 BP) in the build budget ✅ PR
  #8

---

## 4. Qualities (Creation Form)

The full add/edit/delete flow is implemented in PR #1 ✅. Manual entry of name, source, and costs is sufficient for the
prototype — no pre-built catalog needed.

- [x] **Add quality** dialog — name, positive/negative toggle, BP cost, description, source (book + page) ✅ PR #1
- [x] **Edit quality** — tap a row to open a view/edit/delete dialog ✅ PR #1
- [x] **Remove quality** ✅ PR #1
- [x] Group qualities by positive and negative with net-BP summary ✅ PR #1

---

## 5. Awakened / Resources (Creation Form)

Conditional sections are rendered in `AwakenedSection` based on the character's `awakening` type. Each section is fully
wired into the builder store and the BP summary footer.

- [x] **Magician** — add/edit/remove spells; BP cost per spell; warning when approaching free-spell cap
- [x] **Adept** — add/edit/remove adept powers; Power Point tracker (used / max)
- [x] **Technomancer** — add/edit/remove Complex Forms and Sprites; BP cost tracking

---

## 6. Contacts (Creation Form)

A full contacts section is integrated into the creation form (`ContactsBuilderSection` → `ContactsList`). Contact BP
(connection + loyalty per contact) is included in the budget summary footer.

- [x] **Add contact** — name, connection (1–6), loyalty (1–6), optional notes
- [x] **Edit contact** — tap a row to open a view/edit/delete dialog
- [x] **Remove contact**
- [x] BP cost per contact (connection + loyalty) reflected in build budget
- [ ] Role field (field exists in `ContactData` but is not surfaced in `ContactFormFields`)

---

## 7. Edit Existing Character

`CharacterBuilder` accepts an optional `character?: CharacterSheet` prop and pre-populates all stores from it. The
storage key uses the character's own `id`. What's missing is a UI entry point.

- [x] Pre-populate `CharacterBuilder` with existing character data; persist edits to localStorage under the character's
  own id ✅ PR #2
- [ ] Add an **Edit** route reachable from the character sheet (e.g., `/$characterId/edit`)
- [ ] On save, update the existing record via `characterManager.saveCharacter` (same `id`)
- [ ] Add an **Edit Character** button/link from `/$characterId/about`

---

## 8. Character Deletion

`characterManager.deleteCharacter` exists but has no UI.

- [ ] Add a **Delete** button on the character roster card
- [ ] Show a confirmation dialog before deletion
- [ ] Remove the character from the roster list after deletion

---

## 9. Skills (Character Sheet View)

The `/$characterId/skills` route is a placeholder stub. The creation-form skills feed this view.

- [ ] List all character skills with name, linked attribute, rating, and specialization
- [ ] Show whether a skill is defaultable (for unlearned skills used at rating 0)
- [ ] Show skill groups; allow editing group-level rating

---

## 10. Gear (Creation Form)

A gear section is fully integrated into the creation form. SINs & Licenses (PR #5 ✅) and all other gear categories (
Weapons, Armor, Vehicles, Cyberware, Misc — PR #6 ✅) support full add/edit/remove with a shared `GearItemFormState` (
name, cost, optional availability, source, description). Nuyen totals from all sections are summed into the gear BP line
in the budget footer. The `/$characterId/gear` view route is still a stub.

- [x] Gear budget tracker — nuyen progress bar (250 k¥ / 50 BP cap), over-budget error alert ✅ PR #5
- [x] **SINs & Licenses** — add/edit/remove fake SINs (rating × 1 000¥) and one real SIN (free); attach named licenses
  with rating (rating × 100¥); delete-confirmation dialog when a SIN has attached licenses ✅ PR #5
- [x] **Weapons** — add/edit/remove; name, cost, availability, source, description ✅ PR #6
- [x] **Armor** — add/edit/remove; name, cost, availability, source, description ✅ PR #6
- [x] **Vehicles** — add/edit/remove; name, cost, availability, source, description ✅ PR #6
- [x] **Cyberware / Implants** — add/edit/remove; name, cost, availability, source, description ✅ PR #6
- [x] **Misc** — add/edit/remove generic gear items ✅ PR #6
- [x] Compute and display running **Essence cost** from implants — `CyberwarePanel` shows used / remaining with
  grade-adjusted multipliers; error alert when essence is depleted
- [ ] `/$characterId/gear` view page — list all gear grouped by type

---

## 11. Contacts Page

Route exists (`/$characterId/contacts`) but shows only a heading.

- [ ] List current contacts with name, connection rating, loyalty rating, role, and notes
- [ ] **Add contact** — name, connection (1–6), loyalty (1–6), optional role/notes
- [ ] **Edit contact** — update any field inline or via a form
- [ ] **Remove contact**

---

## 12. Character Notes / Background

Route exists (`/$characterId/notes`) but is a placeholder stub.

- [ ] Free-text **Background / Description** field (maps to `profile.description`)
- [ ] Free-text **Personality** field (maps to `profile.personality`)
- [ ] Auto-save changes to the character store

---

## 13. Form Validation & UX Polish

- [ ] Validate required fields (alias, metatype, awakening) before allowing save
- [ ] Show field-level error messages for out-of-range attribute values
- [ ] Prompt "Unsaved changes — leave anyway?" when navigating away mid-edit
- [ ] Disable the Save button and show a spinner while the async save is in progress

---

## Post-Sunday / Gameplay (Out of Scope for Prototype)

These features belong to the gameplay / session-play portion and can be tackled after the builder prototype ships.

- [ ] Offense page — attack dice pools, weapons combat view
- [ ] Spells / adept powers page — spell list management, drain values
- [ ] Vehicles & drones page
- [ ] Karma spend and advancement tracking
- [ ] Google Drive sync (stub exists in `src/integrations/google-drive/`)
- [ ] Character export / import (JSON)

## Post-Prototype / Catalog & Data Quality

Catalog data entry is sufficient as manual name + source + costs for the prototype. These enhancements can follow once
the core builder ships.

- [ ] Pre-built catalog of common SR4e qualities to pick from
- [ ] Skill picker backed by the `SkillKey` enum (replaces free-text name entry)
- [ ] Show quality incompatibility warnings (e.g., Allergy vs. Resistance)
- [ ] Validate that skill names match known skills (warn on unknown names)
