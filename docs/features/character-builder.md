# Character Builder — Feature Checklist

Features still needed to finish the builder portion of the app. Ordered by priority, with a focus on a working prototype. Gameplay features (combat, dice rolling, etc.) are out of scope here.

---

## 1. Character Creation — Form & Save (Blocker)

The creation form captures profile, biology, and attributes but has no working submit path.

- [ ] Add a **Save Character** submit button to `CharacterForm`
- [ ] Wire `handleSubmit` in `UseCharacterForm` to `CharacterManager.saveCharacter`
- [ ] Generate a stable `id` (`crypto.randomUUID()`) for new characters on save
- [ ] Redirect to `/$characterId/about` after a successful save
- [ ] Show an inline error if the save fails

---

## 2. Build Point Budget Tracker

The form state already tracks `buildPoints.spent` by category but nothing renders it.

- [ ] Display a persistent **BP summary bar** (total / spent / remaining) at the top of the creation form
- [ ] Break down spending by category: Metatype, Attributes, Skills, Qualities, Gear
- [ ] Apply real-time BP costs as attribute values change (currently attributes cost is not wired to `buildPoints.spent.attributes`)
- [ ] Block form submission when the character is over budget
- [ ] Show a warning when within 10 BP of the limit

---

## 3. Skills Page

Route exists (`/$characterId/skills`) but is a placeholder stub.

- [ ] List all current character skills with name, linked attribute, rating, and specialization
- [ ] **Add skill** — pick from `SkillKey` enum, set rating (1–6)
- [ ] **Edit skill** — change rating, add/remove specialization
- [ ] **Remove skill**
- [ ] Separate tabs or sections for Active, Knowledge, and Language skills
- [ ] Display whether a skill is defaultable (for skills with rating 0)
- [ ] Show skill groups and allow group-level rating for linked skills
- [ ] Reflect BP cost per skill (rating × 4 for active skills) in the build budget

---

## 4. Qualities Page

Route exists (`/$characterId/qualities`) but shows only a heading.

- [ ] List the character's current positive and negative qualities with name, BP cost, and description
- [ ] **Add quality** — searchable/filterable catalog drawn from a static quality list
- [ ] **Remove quality**
- [ ] Track BP gained from negative qualities (cap at −35 BP total)
- [ ] Show incompatibility warnings (e.g., "Incompatible with Magician" on resonance-related qualities)
- [ ] Reflect quality costs/gains in the build budget

---

## 5. Edit Existing Character

`CharacterForm` accepts an optional `character` prop but there is no edit route or entry point.

- [ ] Add an **Edit** route or drawer reachable from the character sheet (e.g., `/$characterId/edit`)
- [ ] Pre-populate `CharacterForm` with existing character data when editing
- [ ] On save, update the existing record via `CharacterManager.saveCharacter` (same `id`)
- [ ] Add an **Edit Character** button/link from `/$characterId/about`

---

## 6. Character Deletion

`CharacterManager.deleteCharacter` exists but has no UI.

- [ ] Add a **Delete** button on the character roster card
- [ ] Show a confirmation dialog before deletion
- [ ] Remove the character from the roster list after deletion

---

## 7. Gear Management Page

Route exists (`/$characterId/gear`) but is a placeholder stub. Types and factory helpers are fully defined.

- [ ] List all gear on the character grouped by `GearType` (weapons, armor, implants, devices, etc.)
- [ ] **Add weapon** — name, type (`WeaponType`/`FirearmType`), damage, reach/range, availability
- [ ] **Add armor** — name, ballistic/impact ratings
- [ ] **Add implant** — name, `ImplantType`, `ImplantGrade`, essence cost
- [ ] **Add device** — commlink, RCC, or other device
- [ ] **Remove any gear item**
- [ ] Compute and display running **Essence cost** from implants (subtract from 6.0)

---

## 8. Contacts Page

Route exists (`/$characterId/contacts`) but shows only a heading.

- [ ] List current contacts with name, connection rating, loyalty rating, role, and notes
- [ ] **Add contact** — name, connection (1–6), loyalty (1–6), optional role/notes
- [ ] **Edit contact** — update any field inline or via a form
- [ ] **Remove contact**

---

## 9. Character Notes / Background

Route exists (`/$characterId/notes`) but is a placeholder stub.

- [ ] Free-text **Background / Description** field (maps to `profile.description`)
- [ ] Free-text **Personality** field (maps to `profile.personality`)
- [ ] Auto-save changes to the character store

---

## 10. Form Validation & UX Polish

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
