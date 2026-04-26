# Gameplay Tool — Feature Checklist

Features needed to use ShadowSIN as a **session-play companion** — a tool runners can open at the table to manage their
character during an active Shadowrun 4e game. This document tracks work beyond the character-builder prototype
(`docs/features/character-builder.md`).

> Items marked ✅ are fully implemented. Items marked ⚠️ are partially implemented (stub or incomplete).

---

## Priority order

Features are listed roughly in descending priority for making the app _useful at the table_:

1. Complete the character-sheet viewer (stubs → real pages)
2. Combat: damage tracking, defense rolls, attack dice pools
3. Initiative tracking
4. Edge management
5. Magic & resonance in play
6. Karma advancement
7. Session utilities (import/export, cloud sync)

---

## 1. Character Sheet Viewer — Complete Stub Pages

The viewer routes exist but most are placeholder stubs. A runner needs to _see_ their character at a glance without
opening the builder.

### 1-intro. About Page (`/$characterId/about`) ✅ implemented — PR #65

- [x] Rich profile header — alias as heading (falls back to real name), real name + archetype/metatype subtitle ✅ PR #65
- [x] Lifestyle, street cred, notoriety, and public awareness chips ✅ PR #65
- [x] Biology section — metatype, awakening, optional physical fields (gender, age, height, weight) ✅ PR #65
- [x] SINs & Licenses overview — card list with nested licenses; hidden when empty ✅ PR #65
- [x] Edit button → `ProfileEditDialog` for non-mechanical profile and biology details ✅ PR #65

### 1a. Skills Page (`/$characterId/skills`) ⚠️ partially implemented — PR #63

- [x] List all active skills — name, linked attribute, rating, optional specialization ✅ PR #63
- [x] Show the full dice pool per skill (`rating + linked-attribute-value + wound-mod`) ✅ PR #63
- [x] Mark skills where the character is defaulting (rating 0 but attribute allows default roll at −1) ✅ PR #63
- [x] Filter/search bar to quickly find a skill by name ✅ PR #63
- [ ] Group skills by skill group; highlight when a group rating is set
- [ ] List knowledge skills and language skills in a separate section below active skills

### 1b. Gear Page (`/$characterId/gear`) ✅ implemented — PR #67

- [x] Show gear grouped by type: Weapons, Armor, Cyberware/Bioware, Devices, Vehicles, SINs & Licenses, Misc ✅ PR #67
- [x] Display key stats per category inline (weapon DV/AP, armor ballistic/impact, implant essence cost) ✅ PR #67
- [x] Show equipped/wireless flags for each item ✅ PR #67
- [x] Show availability rating and notes ✅ PR #67
- [x] Show item cost (for mid-campaign purchase reference) ✅ PR #67
- [x] Show running essence total in the Cyberware section header ✅ PR #67
- [x] Search bar — AND-per-term substring match on name + description; matching sections auto-expand ✅ PR #67

### 1c. Spells & Powers Page (`/$characterId/spells`) ⚠️ in progress — PR #64 _(Needs Changes)_

- [x] List spells — name, type, range, duration, drain value, description ✅ PR #64
- [x] Show casting dice pool per spell (`Magic + Spellcasting skill`) ✅ PR #64
- [x] Show drain resistance pool (`Willpower + relevant resistance attribute`) ✅ PR #64
- [x] Gate spell list on `CharacterSheet.biology.awakening` (`AwakeningType.Magician` or `AwakeningType.MysticAdept` — string values `"Magician"` / `"Mystic Adept"` only) ✅ PR #64
- [x] Force selector on the cast dialog (default = MAG, max = 2×MAG); overcasting section highlighted when force > MAG ✅ PR #64
- [x] Quick-apply drain button group (0 through drain DV) ✅ PR #64
- [ ] List adept powers — name, power point cost, description
- [ ] Show total power points used vs. available (`Magic` rating)
- [ ] Gate adept powers on `CharacterSheet.biology.awakening` (`AwakeningType.Adept` or `AwakeningType.MysticAdept` — string values `"Adept"` / `"Mystic Adept"` only)
- [ ] List complex forms — name, target, duration, fade value
- [ ] Show compiling/registering dice pool (`Resonance + relevant skill`)
- [ ] Gate complex forms on `CharacterSheet.biology.awakening` (`AwakeningType.Technomancer` — string value `"Technomancer"` only)
- [ ] List sprites — type, tasks remaining; fade resistance pool
- [ ] List foci — name, type, rating, force; show bonding status

### 1d. Contacts Page (`/$characterId/contacts`) ✅ implemented — PR #66

- [x] List contacts — name, connection rating, loyalty rating, role, notes ✅ PR #66
- [x] Search bar to filter contacts by name ✅ PR #66
- [x] **Add contact** inline on the page (no redirect to builder) ✅ PR #66
- [x] **Edit contact** — tap a row to open an edit dialog ✅ PR #66
- [x] **Remove contact** with confirmation ✅ PR #66

### 1e. Vehicles & Drones Pages (`/$characterId/vehicles`, `/$characterId/drones`) ⚠️ stub

- [ ] List vehicles with stats: handling, acceleration, body, armor, pilot, sensor
- [ ] List drones with the same stat block; separate section or tab from full vehicles
- [ ] Show vehicle condition monitor (body × 2 + damage boxes)
- [ ] Link pilot skill dice pool for rigging calculations

### 1f. Notes Page (`/$characterId/notes`) ⚠️ stub

- [ ] **Background / Description** free-text field (maps to `profile.description`)
- [ ] **Personality** free-text field (maps to `profile.personality`)
- [ ] Auto-save changes back to character store without requiring a separate save action
- [ ] **Run notes** free-text scratch pad — ephemeral session notes that are _not_ persisted to the character record

---

## 2. Damage Tracking & Condition Monitors

The defense page has a working damage track, but several gameplay interactions are missing.

### 2a. Physical & Stun Damage Monitors ✅ (core working, subtasks below pending)

- [x] Display physical and stun damage tracks with correct box counts (`8 + ceil(Body / 2)` physical; `8 + ceil(Willpower / 2)` stun — halves rounded up)
- [x] Tap/click boxes to apply damage
- [x] Display wound modifier (`−1 per 3 boxes filled` across both tracks)
- [ ] **Overflow damage** — when stun track fills, excess converts to physical at 1:1 with a visual indicator
- [ ] **Heal controls** — reduce current damage directly on the sheet (right-click or dedicated −1 button)
- [ ] **First aid / medicine roll reminder** — tooltip or side note showing the healing dice pool

### 2b. Matrix Condition Monitor

- [ ] Display matrix condition monitor for characters with a cyberdeck or commlink (`Device Rating × 2` boxes)
- [ ] Tap/click to apply matrix damage
- [ ] Show matrix wound modifier (separate from physical/stun)
- [ ] Link to equipped commlink/cyberdeck from the gear list

### 2c. Vehicle Condition Monitor (in defense context)

- [ ] Show active vehicle damage track when the character is piloting (derived from vehicle body)
- [ ] Integrate with `/$characterId/vehicles` page

---

## 3. Offense — Attack Dice Pools

The offense route (`/$characterId/offense`) is a near-empty stub.

- [ ] List all equipped/carried weapons from `CharacterSheet.gear`
- [ ] Show attack dice pool per weapon (`linked-skill + Agility + modifiers`)
  - Firearms: Agility + relevant Firearms skill (Automatics, Heavy Weapons, Pistols, Rifles, Shotguns)
  - Melee: Agility + relevant Close Combat skill (Blades, Clubs, Unarmed Combat)
  - Thrown: Agility + Throwing Weapons
- [ ] Show weapon DV (Damage Value) and AP (Armor Penetration) inline
- [ ] Show effective range category for ranged weapons (short/medium/long/extreme)
- [ ] Show reach modifier for melee weapons
- [ ] **Recoil tracker** — running recoil penalty counter (reset on Complex/Simple Action) per firearm
- [ ] **Ammo tracker** — current rounds loaded / magazine capacity with reload action button
- [ ] Show burst-fire and full-auto DV bonus / recoil penalty options

---

## 4. Initiative Tracking

Initiative is central to every combat turn and is currently not implemented anywhere.

- [ ] **Roll Initiative** button — calculates `Reaction + Intuition + 1d6` (physical), `Reaction + Intuition + 2d6`
  (wired rigging), or `Resonance + Intuition + 1d6` (matrix hot sim) depending on mode
- [ ] Display current initiative score prominently on the defense or a dedicated combat page
- [ ] **Initiative pass tracker** — decrement score by 10 after each pass; show how many passes remain in the turn
- [ ] **Simple/Complex action tracker** — mark actions used in the current initiative pass
- [ ] Support **Wired Reflexes / adept power** extra initiative dice and extra passes (auto-detected from gear/powers)
- [ ] Adrenaline / drug modifier input (add bonus dice or flat bonus to the roll)

---

## 5. Edge Management

Edge is a metacurrency spent during play to gain mechanical advantages; it needs to be tracked session-to-session.

- [ ] Display current Edge on the about / defense page (`CharacterSheet.edge.current`)
- [ ] **Spend Edge** button — decrement `CharacterSheet.edge.current` by 1 with a floor of 0
- [ ] **Recover Edge** button — increment `CharacterSheet.edge.current` by 1 up to the character's Edge attribute rating (`CharacterSheet.attributes.edge`)
- [ ] Persist Edge changes immediately to storage so they survive a page refresh
- [ ] Show a visual indicator when Edge is at max vs. depleted

---

## 6. Magic & Resonance in Play

Players with awakened or technomancer characters need quick access to their magic/resonance actions.

### 6a. Spellcasting & Drain

- [ ] Per-spell **Cast** action — show the casting dice pool inline (`Magic + Spellcasting`)
- [ ] **Drain** prompt after casting — show drain resistance pool and drain DV; log the result
- [ ] Force selection slider before casting (1 to `Magic` rating); update drain DV dynamically
- [ ] Sustained spell tracker — mark a spell as sustained; display a running list of sustained spells with drain DV

### 6b. Summoning & Binding ⚠️ partially implemented — PR #163

- [x] **Summon spirit** action — `Magic + Summoning` dice pool with force vs. Magic overcast warning and drain application ✅ PR #163
- [x] Track summoned spirits — type, force, services (used/max), bound status, optional powers, notes; edit and dismiss with confirmation ✅ PR #163
- [ ] Spirit condition monitor — track each summoned spirit's physical/stun damage and status (using a dedicated spirit model, separate from technomancer `sprites` / `spriteData.ts`)
- [x] Binding roll support — `Magic + Binding` dice pool with specialization detection, switching based on Bound checkbox ✅ PR #163
- [ ] Watcher spirit support — watcher spirits have different initiative passes than standard spirits; track separately

### 6c. Adept Powers in Play

- [ ] Display each adept power with activation instructions (sustained, simple action, passive)
- [ ] Sustained power tracker — mark a power as active; show running power point drain

### 6d. Technomancer Actions

- [ ] **Compile sprite** action — `Resonance + Compiling` roll; show thread cost
- [ ] Track compiled sprites — type, level, tasks remaining
- [ ] **Register sprite** action — `Resonance + Registering` roll
- [ ] Complex form reference — target, duration, fade value; show fading dice pool (`Resonance + Willpower`)

---

## 7. Karma & Advancement

Between runs runners spend karma to improve their characters. This is currently not implemented.

- [ ] Display current karma (`CharacterSheet.karma.current`) and total earned (`CharacterSheet.karma.total`)
- [ ] **Award Karma** — GM-entry field to add karma at session end
- [ ] **Spend Karma** flows for each advancement type with correct costs:
  - Active skill: `new rating × 2` karma
  - Skill group: `new rating × 5` karma
  - Attribute: `new rating × 5` karma (capped at racial maximum)
  - Specialization: `2` karma
  - Complex form: `4` karma
  - Knowledge/Language skill: `new rating × 1` karma
  - Quality (positive): listed BP cost ÷ 5 karma
- [ ] Validate against racial attribute maximums before confirming an attribute purchase
- [ ] **Karma log** — ordered list of karma award/spend events with timestamp and reason
- [ ] Persist karma changes immediately to storage

---

## 8. Character Edit & Lifecycle (Prerequisite for Gameplay)

These items are also in `character-builder.md` but block gameplay use because a character that can't be saved or edited
is not usable at the table.

- [x] `SaveCharacterButton` calls `localCharacterManager.saveCharacter` and redirects to `/$characterId` (which redirects to `/about`)
- [ ] Add `/$characterId/edit` route that opens `CharacterBuilder` pre-populated with the existing character
- [ ] Add **Edit** button/link on `/$characterId/about`
- [ ] Add **Delete** button on the roster card with a confirmation dialog
- [ ] Show inline error if save fails; show spinner while save is in progress

---

## 9. Data Import / Export & Cloud Sync

Characters must be portable so runners can share them, back them up, or restore them on a new device.

- [ ] **JSON export** — download the full `CharacterSheet` as `.json` (currently only YAML is supported)
- [ ] **JSON import** — upload a `.json` file to restore or add a character; run schema migrations on import
- [ ] **YAML import** — accept the existing YAML export format for round-trip fidelity
- [ ] **Google Drive sync** — persist to Drive using the existing stub in `src/integrations/google-drive/api.ts`
  - [ ] OAuth2 login flow
  - [ ] Save character to Drive on every auto-save
  - [ ] Load characters from Drive on app start; merge with local copies
  - [ ] Conflict resolution: show a diff when the local and remote versions diverge

---

## 10. Session Utilities

Small quality-of-life features that make the app genuinely useful at the table.

- [ ] **Free dice roller** — input a pool size and roll; display individual dice, hits, and glitch/critical-glitch status
  - Extended test mode: track accumulated hits across rolls with a threshold input
  - Opposed test mode: roll two pools and compare hits automatically
- [ ] **Threshold / limit display** — show the effective limit for a given roll (Physical, Mental, Social, Matrix) derived
  from the character's attributes
- [ ] **Wound modifier badge** — persistent display of the current `−X` wound modifier on every page header so it's
  never missed
- [ ] **Quick-reference sidebar** — collapsible panel showing common dice pool formulas (initiative, defense, resist)
  without leaving the current page
- [ ] **Dark mode toggle** — session play often happens in dimly lit spaces; dark theme improves readability

---

## 11. Navigation & UX

Structural UX improvements needed for in-session use where speed matters.

- [ ] Nav tab bar is visible and correctly labelled on all pages (Skills, Gear, Spells, Combat, Contacts, Notes)
- [ ] Active tab is highlighted to show the current section
- [ ] **Combat view** shortcut — single tap to reach offense + defense + damage track from any page
- [ ] Breadcrumb or back button from character sub-pages to the roster
- [ ] Responsive layout on phone-sized screens (most players use phones at the table, not laptops)
  - [ ] Touch targets ≥ 48 px for all interactive elements (dice pool buttons, damage boxes, edge controls)
  - [ ] Horizontal scrolling is avoided; sections stack vertically on narrow viewports
  - [ ] Text remains legible at default browser font size on iOS/Android

---

## Out of Scope (Post-Gameplay)

Features that would make ShadowSIN a full GM/campaign tool but are beyond a single-runner play companion.

- [ ] NPC / enemy tracking — initiative, damage, condition monitors for multiple combatants
- [ ] Campaign session log — notes tied to runs, contacts met, gear acquired
- [ ] Vehicle combat system — full rigging rules, mounted weapons, chase mechanics
- [ ] Astral combat — separate astral initiative and damage track
- [ ] Full hacking / matrix narrative — IC interactions, host ratings, trace mechanics
- [ ] Multiplayer / shared session — real-time sync between GM and players
- [ ] Compendium / rules reference — searchable SR4e rules inline
