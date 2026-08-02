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
- **Sprites** (compiled matrix beings — their primary damage track)
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
A magical being summoned and bound by a Magician or Mystic Adept. Has its own stat block, Force
rating, and a pool of Services owed to the Runner. Requires a **StatusSheet**.
_Avoid_: creature, critter (critter is a specific Shadowrun term for wild paranatural animals)

**Sprite**:
A matrix being compiled by a Technomancer. Analogous to a Spirit in the matrix domain. Has its
own stat block, Level rating, and Services owed. Requires a **StatusSheet**.
_Avoid_: creature, critter (same reasoning as Spirit)

**Entity**:
The umbrella term for anything a Runner can possess that carries ratings/stats and may
contribute a **GameEffect**. Currently covers **Item**, **Quality**, **Spell**, and **Adept
Power**, with **Drug** planned once it exists as its own type — this mirrors the existing
source list on the **GameEffect** entry below, minus matrix connection mode (a state the Runner
is in, not a possessed thing).

Deliberately *not* a general "has stats" test: **Spirit**, **Sprite**, and **Agent**
_(Agent not yet implemented)_ are independently-tracked beings with their own **StatusSheet**
and are *not* classified as Entities, even though they clearly have stat blocks too — they were
formerly grouped under this same term, but that grouping was dropped since Spirit/Sprite/Agent
are never displayed alongside Entities and don't yet need a shared name. This is a pragmatic
grouping around the existing `GameEffect`-sourcing shape, not a strict conceptual boundary —
revisit if Spirit/Sprite/Agent ever need to share data shape or display with Entities.
_Avoid_: GameEntity (redundant with this term); Object (too broad/generic); Data (reserved for
the `*Data` DTO suffix convention — see RunnerData)

**EntityData** _(not yet implemented — planned)_:
The concrete interface underlying **Entity**: `{ id, name, description?, source?, effects?,
rating? }` — the fields shared by every current category (`ItemData`, `QualityData`,
`SpellData`, `AdeptPowerData`). Each category-level type extends it with its own additional
fields (e.g. `ItemData` adds `cost`/`quantity`/`availability`/`equipped`/`stashed`; `SpellData`
adds `drain`/`duration`/`category`/`range`). `PowerData` (`src/system/powers/powerData.ts`)
already implements close to this exact shape today, scoped to the power family only.

**EntityCardRoot** _(not yet implemented — planned)_:
The generic Entity-tier root component, replacing today's bare `DataCard` (renamed for
consistency with `ItemDataCardRoot`/`ItemDetailsRoot`'s existing "owns layout, auto-renders
known fields" naming). Assembles a fixed set of generic layout regions — **Header**,
**Subheader**, **Content**, **Footer** — and auto-renders the `EntityData` core (name,
description, source, effects, rating) into them without any category- or type-specific card
needing to ask for them, the same pattern `ItemDetailsRoot` already uses for `ItemData`'s common
fields (`docs/adr/0009-item-details-page.md`). Notably, this *unifies* two things that are split
in today's `DataCard`: the inline body area (stat row / damage track / subitems) and the
separate below-box `DataCard.Content` slot (used today only by `spiritDataCard.tsx`, to hold
Spirit's entire non-Item-shaped stat block) collapse into one generic **Content** region.
`ItemDataCardRoot` sits one tier below (name not yet revisited), owning Item-only concepts
(Cost, Availability, DamageTrack, Subitem) that never become `EntityCardRoot`-level regions —
e.g. a Weapon's DamageTrack is just content placed into `EntityCardRoot`'s **Content** region by
`ItemDataCardRoot`, not a slot `EntityCardRoot` itself knows about.
_(Whether `EntityDetailsRoot`, the details-page analog, reuses `EntityCardSlots` or gets its own
bespoke slot module is still open — ADR-0009 deliberately rejected sharing slots between card and
details for `Item` due to a density mismatch, and the same reasoning may apply here.)_

**EntityCardSlots** _(not yet implemented — planned)_:
The compound-component namespace attached to `EntityCardRoot` (`EntityCardRoot.Title`,
`EntityCardRoot.Stat`, etc. — mirroring today's `DataCard`/`DataCardSlot` relationship), split
into three kinds:
- **Region markers** (`Header`, `Subheader`, `Content`, `Footer`) — say *where* a child renders;
  carry no data themselves.
- **Field-bound components** (`Title`, `Rating`, `Source`, `Effects`, description) — auto-rendered
  directly from `EntityData` by `EntityCardRoot`; a type-specific card never populates these
  itself.
- **Generic presentational primitives** (`Stat`) and **UI-interaction affordances** (`Action`) —
  carry no `EntityData` field behind them; type-specific cards reach for `Stat` to render their
  own bespoke numbers (a Weapon's Accuracy, a Spell's Drain) in a consistent style, and `Action`
  to expose edit/remove/context-menu behavior, exactly as today's `onEdit`/`onRemove`/
  `QuickAction` do.

**Rating**:
An optional field on **EntityData** representing the strength or level of anything that has
one — e.g. Armor's protection rating, an Adept Power's rating, software/Complex Form/Device
ratings. Not every Entity populates it (Spells have none). Typed via a shared, parameterized
`Rating<TSentinel extends string = never> = number | TSentinel` (planned location:
`src/system/rating.ts`, kept neutral rather than living in `entityData.ts`, since non-Entity
consumers use it too — see below). `EntityData.rating?: Rating` defaults to plain `number`.
`SinData`/`LicenseData` (both Items, so both Entities) declare `rating: Rating<"real">` for the
Real SIN/Licence case; `LanguageSkillData` (not an Entity — Skill isn't in scope) declares
`rating: Rating<"native">`. Each consumer only accepts the sentinel meaningful to it, rather than
one global union every Rating field would nominally accept.
_Avoid_: `ItemData.rating`'s current `number | string` (used by Armor) — this was never a real
Armor need, just `ItemData`'s loose base type leaking into `ArmorDataSchema` through
inheritance; `ArmorData` doesn't even declare its own `rating` (its real stats are
`ballistic`/`impact`). Tighten to plain `Rating` (i.e. `number`) once the rename lands.

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
implant, software, vehicle, etc.). **Gear** is an accepted UI-copy-only synonym (route labels,
section headings, e.g. "Add Gear") — code identifiers (types, props, filenames, directories) use
**Item**, not Gear. _(A rename is planned for the TS-only identifiers: `src/system/gear/`,
`GearTreeNode`, `GearItem`, `GearViewSectionProps`, etc. → `Item`-prefixed equivalents; the
`/gear` route path and user-facing copy are unaffected. `RunnerData.gear` itself is a heavier,
separate decision — it's a persisted JSON field, not just a TS identifier, so renaming it to
`RunnerData.items` would need a migration like the planned `childIds`/`parentId` →
`attachmentIds`/`attachedToId` rename on **Attachment**, not a plain find-and-replace. Not yet
decided whether it's in scope.)_
_Avoid_: Gear (as a code identifier — reserved for user-facing copy only)

**Equipped**:
`ItemData._state.equipped` — whether an item is actively worn/wielded right now, as opposed to
merely owned. Currently opt-in per `ItemType`: only weapons and armor forms expose the toggle
(`equipable: { forced: true }`); other item types don't offer it.
`docs/features/0012-item-stashing.md` plans to make Equip a free, per-item opt-in on every
`ItemType` instead (dropping the per-`ItemType` forcing) as part of unifying it with **Stash**
into one action menu.
Read via `isEquipped(item)` from `src/system/items/itemUtils.ts` wherever the raw value is needed
— the leading underscore on `_state` marks it as internal storage, same convention as
`RunnerData._meta_`. There is deliberately no combined "actively equipped" helper: call sites that
care whether an item's Equipped effect is actually active check `isEquipped(item) &&
!isStashed(item)` directly. `_state` holds only **Equipped** and **Stash** — the other per-item
booleans (`fixed`, `wireless`) stay top-level on `ItemData` since they don't combine with anything
else the way Equipped and Stash do.

**Stash** _(not yet implemented — see `docs/features/0012-item-stashing.md`)_:
`ItemData._state.stashed` — whether an item is with the Runner at all right now ("left at the
safehouse"), as opposed to **Equipped**, which only asks whether a *present* item is actively
worn/wielded. Stash and Equipped are independent, coexisting flags — an item can be `_state: {
equipped: true, stashed: true }` at once. Stash overrides Equipped's mechanical effect without
clearing its stored value (so un-stashing needs no separate restore step). A stashed item is
greyed out and sorted to the bottom of gear listings, and cascades to its child items (stashing a
weapon stashes its attachments too).
_Avoid_: unequipped (that's the absence of Equipped, not Stash — an item can be present,
unequipped, and not stashed, e.g. a spare pistol in a holster)

**Vehicle**:
An Item with `ItemType.vehicle`. Has its own stat block (Pilot, Sensor, Armor, Body, damage
track) and requires a **StatusSheet** during play. As an Item, Vehicle is also an **Entity** —
independently of its StatusSheet, which tracks a separate concern (in-play state) that only
Vehicle, Spirit, and Sprite currently need. No conflict: Entity membership and StatusSheet
membership are orthogonal, not the same axis.
_Avoid_: asset, transport

**Drone**:
A conceptual subtype of Vehicle — typically small, unmanned, and remote-controlled. Has no
mechanical distinction from a Vehicle in the data model; the same `ItemType.vehicle` is used.
Any Vehicle can be a Drone, but not all Drones are cars, planes, ships, or tanks.
_Avoid_: bot, UAV, UGV (use Drone)

**StatusSheet**:
The in-play tracking view for a Spirit, Sprite, or Vehicle, showing its own damage
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
on a SIN. There is no "active"/"in use" distinction between a Runner's SINs — every owned SIN is
equally valid and equally eligible (e.g. for **License Check**), since a SIN is a held identity,
not carried gear with a state of its own.
_Avoid_: active SIN (there is no activity state — see above)
_Avoid_: ID, identity (use SIN)

**Licence**:
An Item (`ItemType.license`) granting legal permission to carry a Restricted piece of gear.
Belongs to a SIN via the existing Attachment mechanism (`Licence.parentId` = the SIN's id). A
Licence may cover multiple gear items — typically several instances of the same item, since a
Licence generally certifies a gear type rather than a single serial number — via each covered
Item's `licenseId` field; an item is covered by at most one Licence, so assigning an already-
covered item to a different Licence silently moves it. Acquiring, changing, or removing the
Licence covering a Restricted item is done from that item's own edit form (Builder and Viewer
both); adding or removing the items a Licence covers is done from the Licence's own edit form.
Not offered for **Forbidden** items — Forbidden gear has no legal Licence path. The Licence's
rating always matches its SIN's reality — the Real SIN produces a free, unrestricted Real
Licence with no rating to set; a Fake SIN produces a Fake Licence with an adjustable rating,
defaulting to 3 (`DefaultFakeLicenseRating`). In the Builder the Licence is simply added (its
cost counts toward the Gear BP budget like any other item); in the Viewer, Nuyen is withdrawn
unless the Player chooses "Acquire" (free, matching the existing acquire/purchase distinction on
new gear). _(Formerly acquired through a standalone Quick-Buy dialog; see
`docs/adr/0007-license-management-moves-into-item-form.md`.)_
_Avoid_: permit, registration; Licence Quick-Buy (retired term — see ADR-0007)

**Availability**:
A rating + restriction code on an Item describing how hard it is to obtain and whether ownership
is legal. Restriction codes: none (legal), **Restricted** (`R`, requires Licence), **Forbidden**
(`F`, illegal to own). Displayed via `AvailabilityChip`.

**License Check** _(not yet implemented — see `docs/features/0011-license-check-dialog.md`)_:
A simulated security scan of a Runner's carried gear: every owned SIN and every Restricted item is
Opposed-Tested against a **Verification System Rating** to see whether its credentials hold up.
Player self-check only — there is no GM-triggered variant.
_Avoid_: security check, license scan (use License Check)

**Verification System Rating** _(not yet implemented — see `docs/features/0011-license-check-dialog.md`)_:
The 1–6 rating representing a scanning system's strength for one **License Check** run; a fresh
Player-chosen value each run, not persisted or tied to any location. Forms one side of each
Opposed Test in that check.

**GameEffect**:
A mechanical modifier that changes a derived stat — e.g. an attribute bonus, dice pool modifier,
extra initiative passes, or pain tolerance adjustment. Can originate from many sources: **Items**
(cyberware, weapons, armor), **Qualities**, **Spells** (sustained), **Adept Powers**, drugs,
matrix connection mode (AR / Hot-sim VR / Cold-sim VR), and potentially others. How active
effects from all sources are aggregated and applied is an open design question. The
possessed-thing subset of this list (Items, Qualities, Spells, Adept Powers, and eventually
Drugs) is exactly what **Entity** now names; matrix connection mode is the one source that
isn't a possessed Entity.
_Avoid_: modifier, bonus (too generic)

**Source**:
A reference to the rulebook and page number where a rule or item is defined
(e.g. `{ book: "SR4A", page: 42 }`).

**Optional Rule**:
A published variant rule from a Shadowrun source book that modifies core SR4e mechanics and must
be explicitly opted into. Optional Rules are stored as `featureFlags.optionalRules` on a Runner,
carry a `Source` citation, and are disabled by default. Known Optional Rules are defined in the
`optionalRulesRegistry`. See `docs/adr/0002-feature-flags-design.md`.
_Avoid_: house rule (a House Rule is app-invented; an Optional Rule is from a source book — see
below)

**House Rule** _(not yet implemented — see `docs/adr/0005-house-rules-feature-flag-namespace.md`)_:
An app-invented mechanical choice that isn't from a Shadowrun source book — so it carries no
`Source` citation — but still needs to be toggleable per table. Stored as `featureFlags.houseRules`
(dotted, feature-namespaced keys, e.g. `items.licenseCheck.ratingPlusRating`), in a
`houseRulesRegistry` parallel to `optionalRulesRegistry`. Each House Rule sets its own default
(often enabled, since it's usually core to how a feature was designed to behave) rather than
uniformly defaulting to disabled like Optional Rules.
_Avoid_: optional rule (reserve for published sourcebook variants — see above)

### Dice

**Dice Pool**:
The number of d6s rolled for a test. Assembled from Attribute + Skill (or Program for matrix
tests) plus any active **GameEffect** modifiers. The Wound Modifier subtracts from the pool.

**Hit**:
A die result of 5 or 6. Hits are counted against a **Threshold** to determine success.

**Threshold**:
The target Hit count a test must meet or exceed to succeed (`DiceTrayState.threshold`). Set
directly for a **Standard Test**, or accumulated toward across multiple rolls for an **Extended
Test**. An **Opposed Test** has no Threshold — the two pools are compared to each other instead.

**Standard Test**:
A single **Dice Pool** rolled against a fixed **Threshold** (a target Hit count); meeting or
exceeding it succeeds. The default `TestType` in the dice tray (`testType.ts`).

**Opposed Test**:
Two Dice Pools compared against each other; the side with more Hits wins (net Hits = difference).
In the dice tray (`TestType.Opposed`), only the Player's own pool is rolled digitally — the
opposing side's Hit count (`opposedHits`) is entered manually, since the app does not track the
opposing character. **License Check** (`docs/features/0011-license-check-dialog.md`) is a second
consumer of the same concept, but rolls both sides digitally in one place since both pools belong
to values the app already tracks.

**Extended Test**:
A **Standard Test** repeated across multiple rolls, accumulating Hits toward the Threshold over
time (`extendedInterval`); each intermediate roll is logged (`extendedHistory`), and
`shrinkingPool` optionally removes a die from the pool each subsequent roll.

**Hidden Test**:
_Not yet implemented — `TestType.Hidden` exists in `testType.ts` but has no dice-tray behavior
wired to it yet._ In SR4e, a Hidden Test is rolled without revealing the Hit count to the Player
(typically Perception-type tests), so a failure can't be distinguished from nothing to notice.

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
- **GameEffect** entries attach to **Entities** (currently Items, Qualities, Spells, and Adept
  Powers) — never stored directly on base attributes
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
