# ShadowSIN

A Shadowrun 4th Edition character sheet web app. **Players** create and manage one or more
**Runners** (player characters), tracking attributes, skills, gear, magic, and resources across
sessions.

## Language

### Core entities

**Player**:
The person using the app. A Player manages one or more Runners.
_Avoid_: user (too generic)

**Game Master (GM)**:
The person running the Shadowrun game. In the app, the GM can create a **Game** and invite
Players, giving them a shared view of the Runners in the group.
_Avoid_: dungeon master, DM, storyteller (use GM)

**Game**:
A GM-managed group that links multiple Players and their Runners together. Allows the GM to
view all Runners in the group.
_Avoid_: campaign, session (session is in-combat state), party

**Runner**:
A player character in Shadowrun. The primary thing a Player creates and manages. A Player may
have multiple Runners.
_Avoid_: Character (ambiguous with DOM/Node types), PC

**RunnerData**:
The complete serialised data record for a single Runner. The root type of the domain model,
persisted as JSON and versioned via migrations. Formerly called `CharacterSheet`; renamed to align
with the `*Data` naming convention used throughout the domain (e.g. `ItemData`, `SpellData`,
`QualityData`).
_Avoid_: CharacterSheet, CharacterData (conflicts with DOM/Node globals)

**sheet** _(variable-name alias)_:
Shorthand identifier for a `RunnerData` value used in hook selectors, component props, and update
functions. Preserved as an alias so existing call sites do not need renaming.
_Avoid_: `character` as a variable name for this type

### Damage

**Damage Track**:
A counted record of damage boxes filled on a subject. Track capacity is derived from stats
(never stored directly); only the current filled-box count is persisted.

**Physical Damage Track**:
Tracks lethal damage on a Runner or Vehicle. Capacity = `8 + ⌈Body / 2⌉`. Overflow spills into
the Stun track (for Runners); a Vehicle at full physical damage is destroyed.
_Avoid_: HP, health points, wounds

**Stun Damage Track**:
Tracks non-lethal damage on a Runner. Capacity = `8 + ⌈Willpower / 2⌉`. When filled, overflow
converts to Physical damage.
_Avoid_: stun points, fatigue

**Matrix Damage Track**:
Tracks damage taken in the matrix. Applies to:
- **Runners** (hot-sim VR biofeedback)
- **Sprites** (matrix Entities — their primary damage track)
- **Matrix-capable devices** (commlinks, nodes — tracked on the device's StatusSheet)

Capacity formula varies by subject type. Separate from Physical/Stun because it heals separately
and applies to non-biological subjects.

**Wound Modifier**:
A dice pool penalty derived from filled damage boxes. Formula per track:
`floor(max(0, damage − hptOffset) / woundInterval)`. Default interval is 3 boxes per −1 die.
**High Pain Tolerance** increases the offset (ignoring the first N boxes); **Low Pain Tolerance**
shrinks the interval (penalties kick in sooner). Both are read from `GameEffect` entries on
equipped gear and active qualities. Implemented in `damageUtils.ts`; tested in
`useWoundModifier.test.tsx`.
_Avoid_: wound penalty, damage penalty (use Wound Modifier)

### Reputation

**Street Cred**:
A tracked count of a Runner's professional reputation. Awarded by the GM for notable runs.
Contributes to the derived **Public Awareness** value.

**Notoriety**:
A tracked count of a Runner's negative or infamous reputation. Awarded by the GM for reckless or
criminal acts. Contributes to the derived **Public Awareness** value. Gaining Notoriety does not
automatically remove Street Cred — they are independent tallies.

**Public Awareness**:
A derived value representing how recognisable the Runner is to the general public.
Formula: `Street Cred + Notoriety + publicAwarenessModifier`. The modifier is a GM-controlled
delta that can be positive (extra exposure) or negative (exceptional anonymity).
_Avoid_: fame, infamy (use Public Awareness)

### Progression & Economy

**Karma**:
The experience currency used to purchase improvements to a Runner after character creation.
In the **Karma Build** creation method, Karma is also the creation currency.
_Avoid_: XP, experience points

**Build Points (BP)**:
The creation-time budget for the standard **BP Build** method. Spent on attributes, skills, gear,
and qualities during character creation. Not used post-creation.
_Avoid_: creation points, starting points

**Loan**:
A debt record on a Runner tracking principal, interest rate, and lender. Interest is
automatically deducted from `nuyen.current` when the Player triggers the **End of Month**
action. If there is insufficient Nuyen to pay, the unpaid interest compounds into the principal.
The in-game consequences of unpaid loans are managed by the GM outside the app.

**End of Month**:
A Player-triggered action on the finances page that processes all outstanding Loans — deducting
interest from `nuyen.current` and compounding any shortfall into each Loan's principal.
_Avoid_: monthly tick, interest sweep

**Build Mode**:
The ruleset used to create a Runner. Determines which resources are available and how they are
allocated. Three modes are planned:

- **BP Build** _(current)_ — a fixed pool of Build Points covers all creation spending.
- **Priority Build** _(planned)_ — a static priority table (ratings A–E) assigns resource
  allocations across categories (metatype, attributes, skills, magic, resources).
- **Karma Build** _(planned)_ — the entire Runner is built using only Karma; no BP pool.

Only one Build Mode is active per Runner. Karma as a post-creation advancement currency is
independent of Build Mode.
_Avoid_: character creation method, build system

**Nuyen (¥)**:
The in-world monetary currency. Spent on gear during play and character creation. Tracked in
`RunnerData.nuyen.current`. Does not include funds stored on Credsticks.
_Avoid_: credits, money

**Credstick**:
An anonymous, untraceable currency carrier stored as an Item (`ItemType.credstick`). Tracked
separately from `nuyen.current` — the value on a credstick is not part of the Runner's main
Nuyen balance. May be dropped as a feature in the future.
_Avoid_: cash, anonymous funds

### Biology & Awakening

**Metatype**:
The species of a Runner (Human, Ork, Dwarf, Elf, Troll, Pixie, AI). Determines base attribute
ranges and any innate qualities or powers.
_Avoid_: race, species

**Awakening**:
A Runner's relationship to magic or the matrix (Mundane, Adept, Magician, Mystic Adept,
Technomancer). Determines which special attributes (Magic or Resonance) are available.
_Avoid_: class, archetype (archetype is a separate freeform profile field)

### Capabilities

**Attribute**:
A numerical stat (1–6 base, higher with metatype bonuses). Grouped as **Physical** (BOD, AGI, REA,
STR), **Mental** (CHA, INT, LOG, WIL), or **Special** (MAG, RES, EDG, ESS).

**Edge**:
A special attribute with two distinct roles. `RunnerData.attributes.edge` is the **Edge Rating**
— it sets the maximum size of the Edge pool and is the number of bonus dice added to a roll
when Edge is spent. `RunnerData.edge.current` is the **Edge Pool** — the spendable points
available right now, decremented when the Player spends Edge during play.
_Avoid_: luck points, hero points (use Edge)

**Skill**:
A rated capability tied to an attribute. Comes in three flavours: **Active** (used in tests),
**Knowledge** (background expertise), and **Language**. Active skills may have a
**Specialization** (+2 dice for that narrow focus).

**Quality**:
A positive or negative trait a Runner possesses (e.g. High Pain Tolerance, Uneducated). Purchased
with BP at creation; some are innate to the metatype.

**Spirit**:
A magical Entity summoned and bound by a Magician or Mystic Adept. Has its own stat block,
Force rating, and a pool of Services owed to the Runner.

**Sprite**:
A matrix Entity compiled by a Technomancer. Analogous to a Spirit in the matrix domain. Has its
own stat block, Level rating, and Services owed.

**Entity**:
Collective term for Spirits and Sprites — summoned or compiled beings controlled by a Runner
that have their own stat block, damage track, and in-play state. Each Entity requires a
**StatusSheet**.
_Avoid_: creature, critter (critter is a specific Shadowrun term for wild paranatural animals)

### Magic & Matrix

**Spell**:
A magical effect cast by a Magician or Mystic Adept. Has a Drain cost paid as stun damage.

**Drain**:
The stun damage a caster takes after casting a spell. Resisted with a Drain resistance test.

**Adept Power**:
A physical or mystical ability available only to Adepts and Mystic Adepts. Purchased with Power
Points derived from the Magic attribute.

**Complex Form**:
A Technomancer's equivalent of a spell — a matrix effect compiled from Resonance.

**Tradition**:
A magical discipline that governs a Magician's drain resistance attribute and available spirits.

**Focus**:
A magical item that a Runner can own, bond, and activate. Owning a focus has no mechanical
effect on its own — a focus must first be **bonded** (a permanent Karma expenditure) before it
can be **activated** (a play-time toggle). Only activated foci contribute `GameEffect` entries
to dice pools or sustain spells. Focus subtypes include Power, Spellcasting, Summoning,
Banishing, Centering, Sustaining, and Weapon.
_(Not yet implemented — see issue #282)_
_Avoid_: fetish, magical tool

**Bond** / **Bonding**:
A one-time Karma expenditure that permanently links a Focus to a Runner. Bonding is a
prerequisite for activation — a focus cannot be activated until it has been bonded. Recorded as
a `bondFocus` ImprovementEntry. Karma spent on bonding is permanently lost if the Focus is
subsequently lost, destroyed, or un-bonded.
_Avoid_: activate, attune (bonding is not the same as activating — a bonded focus can still be
inactive)

**Activate** / **Activation**:
A play-time action that switches a bonded Focus on or off. Only bonded foci can be activated.
Activation is toggled via a UI action on the focus item card in the Viewer; it does not cost
Karma. Only activated foci contribute effects. Stored as `ItemData.equipped` — the existing
field that gates `GameEffect` application.
_Avoid_: bond (activation is free and reversible; bonding is permanent and costs Karma)

**Bonded Foci Limit**:
The cap on how many foci a Runner can have bonded simultaneously. Rule: count of bonded foci
≤ Magic attribute (SR4A p.199). Bonding an additional focus past the cap is prohibited
regardless of activation state. The app surfaces a violation as a warning chip, not a hard block.
_Avoid_: active foci limit, focus cap, foci cap (the limit applies to bonded foci, not activated ones)

**Foci Force Limit**:
The cap on the total Force of foci a Runner can have bonded at one time. Rule: sum of Force
ratings of all bonded foci ≤ Magic × 5 (SR4A p.199). Applies regardless of activation state —
bonding a new focus that would push the total over the cap is prohibited.
_Avoid_: bonded foci cap, total force cap (the limit applies to combined Force, not count)

**Sustaining Focus**:
A Focus subtype that holds one `Sustained` spell active so the caster does not need to maintain
concentration. Linked to a specific spell via `slottedSpellId`; the spell category
(`spellCategory`) is fixed at item creation and restricts which spells can be slotted. The
slotted spell still appears in the Runner's spell list.
_Avoid_: spell holder

**Commlink**:
A Runner's personal matrix device and network hub. Has four hardware stats — **Response**,
**System**, **Firewall**, and **Signal** — that substitute for attributes in matrix tests.
Stored as an Item with `ItemType.device`. May have Programs loaded onto it as Attachments.

**Program**:
Software loaded onto a Commlink. Used in matrix tests the same way Active Skills are used in
physical tests — e.g. `Response + Analyze` forms a valid dice pool. A Commlink has a limited
number of program slots determined by its System rating.
_Avoid_: app, software (software is the broader category; Program is the matrix-test-relevant subtype)

**Matrix Test**:
A dice pool test using a Commlink stat (Response, System, Firewall, or Signal) combined with a
Program rating. Parallel in structure to a skill test (Attribute + Skill).
_Avoid_: hacking roll, matrix roll (use Matrix Test)

**Contact**:
An NPC with whom a Runner has an established relationship, rated by **Connection** (how useful
and well-networked they are) and **Loyalty** (how much they like the Runner). Currently stored
as reference data for legwork and roleplay tracking only — no mechanical integration. A planned
upgrade will let players roll checks through a contact to locate gear or gather information for
a Nuyen fee.
_Avoid_: ally, NPC (too broad)



**Item**:
Any physical or digital piece of equipment a Runner owns. Typed by `ItemType` (armor, firearm,
implant, software, vehicle, etc.).

**Vehicle**:
An Item with `ItemType.vehicle`. Has its own stat block (Pilot, Sensor, Armor, Body, damage
track) and requires a **StatusSheet** during play.
_Avoid_: asset, transport

**Drone**:
A conceptual subtype of Vehicle — typically small, unmanned, and remote-controlled. Has no
mechanical distinction from a Vehicle in the data model; the same `ItemType.vehicle` is used.
Any Vehicle can be a Drone, but not all Drones are cars, planes, ships, or tanks.
_Avoid_: bot, UAV, UGV (use Drone)

**StatusSheet**:
The in-play tracking view for an Entity (Spirit or Sprite) or Vehicle, showing its own damage
track, stats, and session state independently of the Runner's main sheet.
_Avoid_: mini-sheet, sub-sheet, stat block (stat block is the data; StatusSheet is the UI view)



**Attachment**:
An Item that is mounted on, installed in, or otherwise associated with a parent Item. Attachments
may themselves have attachments (e.g. a scope on a rifle that also has a laser sight). Stored as
sibling entries in `RunnerData.gear`; the relationship is expressed via `attachmentIds` on the
parent and `attachedToId` on the child. _(Note: a migration is planned to rename the current
`childIds` / `parentId` fields to `attachmentIds` / `attachedToId`.)_
_Avoid_: child item, accessory (too weapon-specific), mod

**SIN** _(System Identification Number)_:
A matrix identity stored as an Item (`ItemType.sin`). Runners typically carry one or more fake
SINs. Licences are logically tied to a SIN — owning a Restricted item legally requires a Licence
on an active SIN.
_Avoid_: ID, identity (use SIN)

**Licence**:
An Item (`ItemType.license`) granting legal permission to carry a Restricted piece of gear.
Currently freeform — no mechanical link to the gear it covers or the SIN it belongs to.
Planned: a quick-buy flow that creates one or more Licences attached to a chosen SIN.
_Avoid_: permit, registration

**Availability**:
A rating + restriction code on an Item describing how hard it is to obtain and whether ownership
is legal. Restriction codes: none (legal), **Restricted** (`R`, requires Licence), **Forbidden**
(`F`, illegal to own). Displayed via `AvailabilityChip`.

**GameEffect**:
A mechanical modifier that changes a derived stat — e.g. an attribute bonus, dice pool modifier,
extra initiative passes, or pain tolerance adjustment. Can originate from many sources: **Items**
(cyberware, weapons, armor), **Qualities**, **Spells** (sustained), **Adept Powers**, drugs,
matrix connection mode (AR / Hot-sim VR / Cold-sim VR), and potentially others. How active
effects from all sources are aggregated and applied is an open design question.
_Avoid_: modifier, bonus (too generic)

**Source**:
A reference to the rulebook and page number where a rule or item is defined
(e.g. `{ book: "SR4A", page: 42 }`).

**Optional Rule**:
A published variant rule from a Shadowrun source book that modifies core SR4e mechanics and must
be explicitly opted into. Optional Rules are stored as `featureFlags.optionalRules` on a Runner
and are disabled by default. Known Optional Rules are defined in the `optionalRulesRegistry`.
_Avoid_: house rule (a house rule is GM-invented; an Optional Rule is from a source book)

### Dice

**Dice Pool**:
The number of d6s rolled for a test. Assembled from Attribute + Skill (or Program for matrix
tests) plus any active **GameEffect** modifiers. The Wound Modifier subtracts from the pool.

**Hit**:
A die result of 5 or 6. Hits are counted against a threshold to determine success.

**Glitch**:
Triggered when half or more of the dice in the pool show 1s. A **Critical Glitch** occurs when
the pool also scores zero hits.

**Digital Roll**:
The app assembles the dice pool, rolls digitally, and displays the hit count and glitch status.

**Physical Roll**:
The Player rolls real dice and records the result in the app. The app still provides the
calculated pool size; the Player enters hits (and optionally the 1s count for glitch detection).

### App Contexts

**Builder**:
The character creation and editing mode. Operates on a BP budget, allows structural changes to
a Runner (metatype, awakening, attribute allocation, quality selection). Accessed via
`src/components/builder/`.
_Avoid_: editor, creator, creation mode

**Viewer**:
The play-time mode for an existing Runner. Used to track damage, roll dice, spend Edge, and
manage active resources during a session. Accessed via `src/components/runner/`.
_Avoid_: sheet view, player view, read mode

### Infrastructure

**RunnerMeta**:
Versioning metadata embedded in every `RunnerData` record. Tracks the schema version and the set
of migration IDs already applied.

**RunnerId**:
A string that uniquely identifies a Runner within the app. Format: `source|uuid` (e.g.
`local|3f8a…`). A plain UUID with no `|` defaults to the `"local"` source. Because the source is
embedded in the ID, copying a Runner to a different storage location always produces a new
`RunnerId` with a new UUID — a copy is a distinct Runner, not a replica.
_Avoid_: UUID alone (ambiguous without source), character key, CharacterId

**StorageSource**:
A named, pluggable persistence backend (e.g. `"local"` for `localStorage`, `"gdrive"` for Google
Drive). A Runner belongs to exactly one source at a time; moving it to another source requires
generating a new `RunnerId`. The underlying `localStorage` key format (`characters/<uuid>`,
`character-form/<uuid>`) is a fixed historical string and intentionally was **not** renamed
alongside `CharacterId`/`CharacterManager` — changing it would orphan every already-saved Runner.
`RunnerManager`, the migration system, and the legacy-format detection in
`20250101_normalizeOldFormatCharacter.ts` (and its frozen test fixtures under
`testUtils/fixtures/characters/`) all still reference `character`-shaped literal strings on
purpose.

**Session State**:
Combat-round and in-session data stored directly on `RunnerData` (e.g. initiative rolls, passes
completed, sustained spells). Persisted to the active **StorageSource** on every change — not
cleared between sessions — so that a page reload does not lose in-progress combat. A future
`SessionApi` backed by the browser's `sessionStorage` may provide a separate, tab-scoped tier
for truly transient state, but all state is currently written to the primary source.
_Avoid_: temporary state, volatile state (all state is durable by design)

**Migration**:
A single, immutable schema-upgrade step that transforms one version of `RunnerData` into the
next. Migrations operate on potentially invalid or incomplete data and must never be edited after
commit — if a migration has a bug, a new migration fixes the output. The current system tracks
applied migrations as an array of string IDs in `RunnerMeta.appliedMigrations`; this is
planned to be replaced with a single integer **schema version** number checked against the
ordered migration list. Because migration files must never be edited, the shared
`CharacterMigration<T>` type in `src/data/characterMigration.ts` and the migration files
themselves (`src/data/migrations/`) were deliberately left out of the `character`→`runner`
identifier rename — renaming the shared type would have forced an edit into every migration file.
_Avoid_: upgrade, patch, update (use migration)

## Relationships

- A **Player** manages one or more **Runners**; a **Game** groups multiple Players' Runners
  under a single GM _(Game not yet implemented)_
- A **Runner** belongs to exactly one **StorageSource** at a time; copying to another source
  generates a new **RunnerId** (new UUID + new source prefix) — the copy is a distinct Runner
- **RunnerData** holds a flat `Record<id, Item>` for gear — **Attachment** relationships are
  expressed via `attachmentIds` on the parent and `attachedToId` on the child; attachments may
  nest recursively _(field names are pending migration from `childIds` / `parentId`)_
- **GameEffect** entries attach to **Items**, **Qualities**, and **Spells** — never stored
  directly on base attributes
- **Karma** and **Build Points** are separate economies: BP is creation-only, Karma is
  post-creation
- An **Awakening** of Adept, Magician, or Mystic Adept unlocks the **Magic** special attribute;
  Technomancer unlocks **Resonance**; Mundane locks both to 0

## Example dialogue

> **Dev:** "When a user buys new **gear**, do we deduct from **Karma** or **Nuyen**?"
> **Domain expert:** "Gear costs **Nuyen**, not Karma. Karma is only for improving **Attributes**,
> **Skills**, and buying **Qualities** after creation."
>
> **Dev:** "What's the difference between the `sheet` prop and a `RunnerData` type?"
> **Domain expert:** "They're the same thing. `sheet` is just the variable name convention;
> `RunnerData` is the type. We kept the alias so we didn't have to rename every selector."

## Flagged ambiguities

- `CharacterSheet` was used as the root type to avoid a naming collision with `CharacterData` (a
  DOM/Node global). Resolved: canonical type name is **RunnerData**; `sheet` is the variable-name
  alias.
- `character` as a variable name was overloaded between Runner identity and `RunnerData` payload.
  Resolved: use `sheet` for the data payload variable; `runner` for identity/display contexts.
- `CharacterId`, `CharacterManager`, `src/character/`, and the various `character`-named
  components/hooks/builder files were renamed to `RunnerId`, `RunnerManager`, `src/runner/`, etc.
  Resolved, with one deliberate exception: the `localStorage` key literals (`characters/<uuid>`,
  `character-form/<uuid>`), the legacy YAML export's `characterId` field detection, and the
  migration subsystem (`src/data/migrations/`, `characterMigration.ts`,
  `testUtils/fixtures/characters/`) were left untouched — see **StorageSource** and **Migration**
  above.
