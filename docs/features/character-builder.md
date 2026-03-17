# Character Builder — Feature Checklist

Features still needed to finish the builder portion of the app. Ordered by priority, with a focus on a working prototype. Gameplay features (combat, dice rolling, etc.) are out of scope here.

> Items marked ✅ are covered by an open PR and pending merge.

---

## 1. Character Creation — Form & Save (Blocker)

The creation form captures profile, biology, and attributes. Form state is persisted to localStorage on every change (PR #2 ✅), but there is no path to actually save a finished character.

- [x] Persist form state to localStorage on every field change — keyed by character id or `NULL_CHARACTER_ID` for new characters ✅ PR #2
- [x] Add a **Reset Form** button that clears localStorage and resets fields to defaults ✅ PR #2
- [ ] Add a **Save Character** submit button to `CharacterForm`
- [ ] Wire `handleSubmit` in `UseCharacterForm` to `CharacterManager.saveCharacter`
- [ ] Generate a stable `id` (`crypto.randomUUID()`) for new characters on save
- [ ] Redirect to `/$characterId/about` after a successful save
- [ ] Show an inline error if the save fails

---

## 2. Build Point Budget Tracker

The form state already tracks `buildPoints.spent` by category. Qualities BP spend is now wired (PR #1 ✅), but nothing is rendered and attribute costs are not tracked.

- [x] Track net BP spent on qualities (positive cost, negative grant, cap at −35 BP) ✅ PR #1
- [ ] Display a persistent **BP summary bar** (total / spent / remaining) at the top of the creation form
- [ ] Break down spending by category: Metatype, Attributes, Skills, Qualities, Gear
- [ ] Apply real-time BP costs as attribute values change (wire to `buildPoints.spent.attributes`)
- [ ] Block form submission when the character is over budget
- [ ] Show a warning when within 10 BP of the limit

---

## 3. Skills (Creation Form)

Skills are a major BP sink and need to be part of the creation form before a character can be saved in a legal state.

- [ ] **Add skill** section in the creation form — pick from `SkillKey` enum, set rating (1–6), optional specialization
- [ ] **Edit / remove** added skills before saving
- [ ] Separate display for Active, Knowledge, and Language skills
- [ ] Reflect BP cost per skill (active: rating × 4; specialization: +2 BP) in the build budget

---

## 4. Qualities (Creation Form)

The full add/edit/delete flow is implemented in PR #1 ✅. Remaining gaps are a pre-built catalog and incompatibility enforcement.

- [x] **Add quality** dialog — name, positive/negative toggle, BP cost, description, source (book + page) ✅ PR #1
- [x] **Edit quality** — tap a row to open a view/edit/delete dialog ✅ PR #1
- [x] **Remove quality** ✅ PR #1
- [x] Group qualities by positive and negative with net-BP summary ✅ PR #1
- [ ] Pre-built catalog of common SR4e qualities to pick from (avoid manual data entry)
- [ ] Show incompatibility warnings (e.g., Allergy vs. Resistance)

---

## 5. Edit Existing Character

Form-side persistence is in place (PR #2 ✅ keys off `character.id`). What's missing is a UI entry point to reach the form for an existing character.

- [x] Pre-populate `CharacterForm` with existing character data; persist edits to localStorage under the character's own id ✅ PR #2
- [ ] Add an **Edit** route reachable from the character sheet (e.g., `/$characterId/edit`)
- [ ] On save, update the existing record via `CharacterManager.saveCharacter` (same `id`)
- [ ] Add an **Edit Character** button/link from `/$characterId/about`

---

## 6. Character Deletion

`CharacterManager.deleteCharacter` exists but has no UI.

- [ ] Add a **Delete** button on the character roster card
- [ ] Show a confirmation dialog before deletion
- [ ] Remove the character from the roster list after deletion

---

## 7. Skills (Character Sheet View)

The `/$characterId/skills` route is a placeholder stub. The creation-form skills feed this view.

- [ ] List all character skills with name, linked attribute, rating, and specialization
- [ ] Show whether a skill is defaultable (for unlearned skills used at rating 0)
- [ ] Show skill groups; allow editing group-level rating

---

## 8. Gear Management Page

Route exists (`/$characterId/gear`) but is a placeholder stub. Types and factory helpers are fully defined.

- [ ] List all gear grouped by `GearType` (weapons, armor, implants, devices, etc.)
- [ ] **Add weapon** — name, type (`WeaponType`/`FirearmType`), damage, reach/range, availability
- [ ] **Add armor** — name, ballistic/impact ratings
- [ ] **Add implant** — name, `ImplantType`, `ImplantGrade`, essence cost
- [ ] **Add device** — commlink, RCC, or other device
- [ ] **Remove any gear item**
- [ ] Compute and display running **Essence cost** from implants (subtract from 6.0)

---

## 9. Contacts Page

Route exists (`/$characterId/contacts`) but shows only a heading.

- [ ] List current contacts with name, connection rating, loyalty rating, role, and notes
- [ ] **Add contact** — name, connection (1–6), loyalty (1–6), optional role/notes
- [ ] **Edit contact** — update any field inline or via a form
- [ ] **Remove contact**

---

## 10. Character Notes / Background

Route exists (`/$characterId/notes`) but is a placeholder stub.

- [ ] Free-text **Background / Description** field (maps to `profile.description`)
- [ ] Free-text **Personality** field (maps to `profile.personality`)
- [ ] Auto-save changes to the character store

---

## 11. Form Validation & UX Polish

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
