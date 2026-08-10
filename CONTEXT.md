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
**Specialization** (+2 dice for that narrow focus). Knowledge and Language skills are free-text,
Player-entered entries (no fixed list like Active skills) and carry their own identity independent
of their display name, so a `GameEffect` targeting one specific entry survives the Player renaming
it later.

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
The umbrella term for anything with a stat block, ratings, or effects it can contribute — a
stat-bearing thing, not just carried equipment. Covers **Item**, **Quality**, **Spell**,
**Complex Form**, **Adept Power**, **Drug** _(planned)_, **Spirit**, **Sprite**, and
**MatrixNode**. (**Program** and **Agent** are `Item` subtypes, not separate entries in this
list — see below.)
_Avoid_: GameEntity (redundant with this term); Object (too broad/generic); Data (reserved for
the `*Data` DTO suffix convention — see RunnerData)

**EntityCard**:
The shared card-rendering system for Entities, replacing the old `DataCard`. See
`docs/adr/0010-entity-card-composition.md` for the architecture.

**Rating**:
An optional numeric field representing the strength or level of an Entity — e.g. Armor's
protection rating, an Adept Power's rating, a Spirit's Force, software/Complex Form/Device
ratings. Not every Entity populates it (Spells have none). A few ratings use a special sentinel
instead of a number for an unrated/default case (e.g. a Real SIN or Licence, a native Language
skill) — see `docs/adr/0010-entity-card-composition.md` for the type design.

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

**MatrixAttrs**:
The four matrix-test stats — Firewall, Response, Signal, System — that substitute for Attributes
in Matrix Tests (see **Commlink**, **Matrix Test**). Added as members of the same `AttributeKey`
enum used for Runner attributes (BOD, AGI, …), rather than a separate enum, since Matrix Tests
already mirror Attribute + Skill tests structurally. `RunnerData.attributes` and any
`MatrixAttrs`-bearing bag are both `Partial<Record<AttributeKey, number>>`; `selectAttrBase` and
`selectAttrValue` return `0` for a key that's absent or not computable for that subject (e.g.
asking a Runner for Firewall).

**Entity Matrix Presence** _(`EntityData.matrix?: true | MatrixStats`)_:
Almost every **Entity** — not just `Item` — can be present in the matrix. `matrix: true` is a
"simplified" presence: all four `MatrixAttrs` resolve to the Entity's own **Rating**, with no
separate data stored (avoids a value that could drift out of sync after the Entity's Rating
changes). `matrix: MatrixStats` (a `Partial<MatrixAttrs>`) is a "fully specced" presence — set
keys override that stat, unset keys still fall back to Rating. `undefined` means the Entity has
no matrix presence at all. **Commlink** is the canonical fully-specced case. **MatrixNode**
(below) is always fully specced, by definition.

Response and Signal are a special case for anything *running on* a `MatrixNode` (a loaded
**Program**, a running **Agent**): those two stats are never stored on the running thing itself —
they're resolved live from whichever Node currently hosts it. Only System/Firewall (and, for
Agent, its Pilot/Skill use) come from the running thing's own rating.

**MatrixNode** _(displayed as "Node")_:
A hackable system in the matrix — a corp server, security system, or other host a Runner can
connect to and gain an account on. It is itself an **Entity** (added to the list under
**Entity**, below), not a field bolted onto some other Entity — its `matrix` is always a
`MatrixStats` value, since being a matrix presence is its entire purpose. User-facing copy and
rulebook references say "Node"; the code identifier is `MatrixNode` to avoid colliding with the
DOM global `Node` (same naming-collision class as `RunnerData` vs. `CharacterData` — see
`RunnerData` above).
_Avoid_: Node (as a code identifier — reserved for user-facing copy only), Host

**Node Type** (`General` | `Nexus`):
Determines a `MatrixNode`'s **Processor Limit** formula and nothing else — no other mechanical
difference between the two.

**Processor Limit**:
The cap on programs a `MatrixNode` can run simultaneously, mirroring the existing rule that a
Commlink's loaded programs are capped by its System rating (`docs/features/0005-matrix-programs.md`).
Formula depends on **Node Type**: `General` = System rating; `Nexus` = System rating × 3.
Exceeding it isn't a hard block — every multiple of the Processor Limit reached (running count ÷
Processor Limit, rounded down) drops the Node's effective Response by 1. E.g. Processor Limit 3:
Response −1 at 3 programs running, −2 at 6, −3 at 9.

**Subscription Limit**:
The cap on how many `MatrixNode`s a Runner can hold a **Known Node** entry for at once (see
**Matrix Game State**). Equal to the System rating of whichever Commlink the Runner is currently
running their persona from.

**Access Level** (`none` | `public` | `user` | `security` | `admin`):
How much access a Runner has on a given `MatrixNode`. `public` means an unauthenticated foothold
that needs no hacking test at all — the (display-only) hacking threshold
(`Firewall + (System if Probing) + Access Level offset`) only applies to the `user`/`security`/
`admin` rungs (`user` +0, `security` +3, `admin` +6); `none` means no access of any kind, not even
public. Player-set directly on a **Known Node** entry — this pass doesn't simulate the hacking
test itself (Hacking on the Fly / Probing), just tracks the outcome and displays the threshold as
a reference number.

**Matrix Game State** (`RunnerData.gameState.matrix`):
The Player-facing matrix session-management state — the helper-tools scope of this feature, as
opposed to simulating hacking tests or matrix combat. Holds:
- `knownNodes: KnownNode[]` — every `MatrixNode` the Runner currently has some access to
- `activeNodeId` — which Known Node the Runner is presently working in; every other Known Node is
  informally a "subscription" (nothing marks them separately — non-active is the only distinction)
- `activePrograms` — running copies of Programs/Agents (see **ActiveProgram**, below)

Cleared by the Player-triggered **Clear Matrix Session** action (start of a new run), not
automatically. `RunnerData.gameState` is a new top-level namespace intended to eventually hold
other in-play state beyond matrix (nothing else lives there yet).

**Known Node**:
`MatrixNodeData & { accessLevel: AccessLevel }` — a `MatrixNode` the Runner currently has some
access to, flattened with the Access Level onto one record (not wrapped in a separate `node`
field) since a Known Node only ever exists inside **Matrix Game State** today. A newly-added Known
Node defaults to `public` **Access Level** — being "known" only requires the Runner to be aware of
the Node and have its public-facing surface, not an authenticated account yet.
_Avoid_: Subscribed Node (there's no separate subscribed-nodes list — every Known Node other than
the Active Node is one)

**Clear Matrix Session**:
A Player-triggered action (parallel to **End of Month**) that wipes `gameState.matrix` —
`knownNodes` and `activePrograms` — at the start of a new run.

**Commlink**:
A Runner's personal matrix device and network hub. Has four hardware stats — **Response**,
**System**, **Firewall**, and **Signal** — that substitute for attributes in matrix tests.
Stored as an Item with `ItemType.device`. May have Programs loaded onto it as Attachments.

**Program**:
Software loaded onto a Commlink. Used in matrix tests the same way Active Skills are used in
physical tests — e.g. `Response + Analyze` forms a valid dice pool. A Commlink has a limited
number of program slots determined by its System rating. An owned Program can be run as an
**ActiveProgram** on a `MatrixNode` (see below).
_Avoid_: app, software (software is the broader category; Program is the matrix-test-relevant subtype)

**Agent**:
An `Item` subtype of **Program** (`Entity → Item → Program → Agent`) — an autonomous matrix
construct, not just loaded software. Like **Vehicle**, being an `Item` doesn't exclude requiring
a **StatusSheet**: Agent gets one, the same way Vehicle does. Its single `rating` doubles as
Pilot, System, Firewall, and the Skill side of any dice pool it rolls — an Agent has no separate
skill list. Its Response and Signal are never its own; they're resolved live from whichever
`MatrixNode` currently hosts it as an **ActiveProgram** (see **Entity Matrix Presence**).
_Avoid_: bot

**ActiveProgram**:
A running copy of a Program or Agent on a `MatrixNode` — `{ sourceId, nodeId }`, referencing the
owned Program/Agent `Item` and the Known Node hosting it. `(sourceId, nodeId)` is a unique pair: the
same source can run on several different Nodes at once, but not twice on the same Node. Each
running copy consumes one **Processor Limit** slot on its Node. Requires at least `user`
**Access Level** on that Node to start.
_Avoid_: Running Instance (earlier working name)

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
`ItemData.equipped` — whether an item is actively worn/wielded right now, as opposed to merely
owned. Currently opt-in per `ItemType`: only weapons and armor forms expose the toggle
(`equipable: { forced: true }`); other item types don't offer it.
`docs/features/0012-item-stashing.md` plans to make Equip a free, per-item opt-in on every
`ItemType` instead (dropping the per-`ItemType` forcing) as part of unifying it with **Stash**
into one action menu.
`isEquipped(item)` in `src/system/items/itemUtils.ts` is deprecated — read `item.equipped`
directly. It's always trustworthy on its own: the gear reducer forces it to `false` the moment
**Stash** turns on and restores it automatically on un-stash (see **Stash**), so no compound check
against `stashed` is needed at the read site.

**Stashed**:
`ItemData.stashed` — whether an item is with the Runner at all right now ("left at the
safehouse"), as opposed to **Equipped**, which only asks whether a *present* item is actively
worn/wielded. The gear reducer (`src/lib/stores/runner/gear/gearSlice.ts`) enforces the
interaction at the write boundary: the moment `stashed` becomes `true`, it forces `equipped` to
`false` and records the prior value in the internal `ItemData._state.equipOnUnstash` (leading
underscore, same convention as `RunnerData._meta_` — not read directly), restoring it
automatically when un-stashed. A stashed item is greyed out and sorted to the bottom of gear
listings, and cascades to its child items (stashing a weapon stashes its attachments too).
_Avoid_: unequipped (that's the absence of Equipped, not Stash — an item can be present,
unequipped, and not stashed, e.g. a spare pistol in a holster)

**Available**:
The inverse of **Stashed** — `!item.stashed`, i.e. an item the Runner currently has on hand,
regardless of whether it's **Equipped**. `isAvailable(item)` in `src/system/items/itemUtils.ts`
is deprecated — read `!item.stashed` directly. Used to exclude stashed gear from listings/logic
that only care about carried items, e.g. `selectAvailable`
(`src/lib/stores/runner/gear/gearSlice.selectors.ts`) and the **License Check** lane filters
(`src/components/runner/licenseCheck/licenseCheckLanes.ts`).
_Avoid_: confusing with **Availability** (the Item legality/rating term below) — unrelated
concept that happens to share the word

**Vehicle**:
An Item with `ItemType.vehicle`. Has its own stat block (Pilot, Sensor, Armor, Body, damage
track) and requires a **StatusSheet** during play, same as Spirit and Sprite.
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
(cyberware, weapons, armor), **Qualities**, **Spells** (sustained), **Complex Forms**, **Adept
Powers**, drugs, matrix connection mode (AR / Hot-sim VR / Cold-sim VR), and potentially others.
How a source's effects resolve onto a target is **Scope**'s job — see **Granted Effects** /
**Applied Effects** below. These sources are a *subset* of **Entity**, not all of it — Spirit,
Sprite, and Agent are Entities too but aren't GameEffect sources today; matrix connection mode is
a state the Runner is in, not an Entity at all.
_Avoid_: modifier, bonus (too generic)

**Granted Effects**:
The `GameEffect` entries a single source (an Item, Quality, Spell, ...) directly carries as its
own. Contrast with **Applied Effects**.

**Applied Effects**:
The `GameEffect` entries that actually resolve onto a given target — an Item, or the Runner
itself — once every source's **Scope** has been evaluated relative to that source's own position
in the item tree. See `docs/adr/0011-game-effect-scope-resolution.md`.
_Avoid_: "effects for X" (ambiguous with Granted Effects — always say "applied to" or "granted
by")

**Scope**:
Declares which item instance(s) a `GameEffect` reaches, independent of *what* it modifies.
Defaults to reaching only the item that grants the effect — or the Runner, for effects not
attached to an Item. Can instead be widened to that item's parent, children, or siblings, or to
its full chain of ancestors or descendants; or widened by first climbing to the top of its
ownership chain, so one item's effect can reach its siblings too (e.g. a drone's autosoft
reaching the other weapons mounted on that same drone, not just its own descendants — it has
none). Can also be narrowed to a specific kind of item. The Runner itself is the only valid
starting point for effects not attached to an Item (Qualities, Spells, Complex Forms, Powers),
since those aren't part of the Item ownership tree.
_Avoid_: "target" for describing which item(s) a Scope reaches — a `GameEffect`'s `target`
means something unrelated (see **Pool Id**)

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
tests) plus any active **GameEffect** modifiers. The Wound Modifier subtracts from the pool. Every
Dice Pool carries a stable **Pool Id** so a GameEffect can target it.

**Pool Id**:
A stable identifier for a Dice Pool's category — what kind of test it is — independent of any
specific item. Organized as a tree with a hand-authored branch shape (e.g. Active Skills,
Knowledge Skills, Attack); branches backed by a fixed list (like Active Skills) generate one leaf
per entry in that list, while free-text branches (Knowledge Skills, Languages, which a Player
types in themselves rather than picking from a fixed list) generate one leaf per entry the Player
has actually added — which is why those entries need an identity independent of their display
name (see **Skill**). A free-text branch can also be targeted as a whole (e.g. "all Knowledge
skill tests"). The tree's grouped, human-readable labels ("Skills / Active Skills / Data Search")
are for browsing only and don't need to match the identifier's own internal form.
_Avoid_: "target" used bare without saying "pool" — conflicts with **Scope**, a different concept
that also answers a "which" question

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

### State Access

**Selector**:
The single, canonical way to derive any value — raw or computed — from a Runner's data. Every derivable
value has exactly one Selector; nothing recomputes it a second, independent way.
_Avoid_: reading Runner fields directly, recomputing a value inline at the point where it's displayed

**Selector Alias**:
A Selector made reachable from more than one conceptual grouping, for values that genuinely belong to more
than one (e.g. a wound modifier is both a Damage concept and a Modifier concept). Always the same
Selector — an Alias is a second name, never a second implementation.
_Avoid_: duplicate selector, parallel selector

**Selector Catalog**:
The namespaced menu of Selectors offered to a caller, grouped by the domain each one conceptually belongs to
(mirroring the Runner's own data domains). A caller picks the specific Selector it needs from the Catalog
rather than importing one directly.
_Avoid_: selector registry, selector map

### Infrastructure

**RunnerMeta**:
Versioning metadata embedded in every `RunnerData` record. Holds a single integer `version` —
the highest migration `version` that has been applied — checked against the ordered migration
list in `src/data/migrations.ts`.

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
`001_normalizeOldFormatCharacter.ts` (and its frozen test fixtures under
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
commit — if a migration has a bug, a new migration fixes the output. Each migration has a
sequential integer `version` (file names are zero-padded to match, e.g. `001_...ts`,
`022_...ts`), and `applyMigrations` is the sole place that decides which migrations run: it
filters the registered list down to `version > _meta_.version` and calls `up` only on that
subset, in ascending order — individual migrations don't check `_meta_` themselves. Because
migration files must never be edited, the shared `CharacterMigration<T>` type in
`src/data/characterMigration.ts` and the migration files themselves (`src/data/migrations/`) were
deliberately left out of the `character`→`runner` identifier rename — renaming the shared type
would have forced an edit into every migration file.
_Avoid_: upgrade, patch, update (use migration)

## Relationships

- A **Player** manages one or more **Runners**; a **Game** groups multiple Players' Runners
  under a single GM _(Game not yet implemented)_
- A **Runner** belongs to exactly one **StorageSource** at a time; copying to another source
  generates a new **RunnerId** (new UUID + new source prefix) — the copy is a distinct Runner
- **RunnerData** holds a flat `Record<id, Item>` for gear — **Attachment** relationships are
  expressed via `attachmentIds` on the parent and `attachedToId` on the child; attachments may
  nest recursively _(field names are pending migration from `childIds` / `parentId`)_
- **GameEffect** entries attach to a subset of **Entities** — Items, Qualities, Spells, Complex
  Forms, and Adept Powers, not Spirits/Sprites/Agents — never stored directly on base attributes.
  Each entry's **Scope** is resolved relative to its own source's position in the Item ownership
  tree, independent of what the effect modifies (see `docs/adr/0011-game-effect-scope-resolution.md`)
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
