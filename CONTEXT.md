# ShadowSIN

A Shadowrun 4th Edition character sheet web app. **Players** create and manage one or more
**Runners** (player characters), tracking attributes, skills, gear, magic, and resources across
sessions.

> **Agents:** read the `domain-modeling` skill before editing this file. This is a glossary, not a
> spec or an implementation reference — keep entries free of code identifiers, file paths, and
> other implementation details.

## Language

### Core entities

**Player**:
The person using the app. A Player manages one or more Runners.
_Avoid_: user (too generic)

**Game Master (GM)**:
The person running the Shadowrun game. The GM can create a **Game** and invite Players into it.
_Avoid_: dungeon master, DM, storyteller (use GM)

**Game**:
A GM-managed group that links multiple Players and their Runners together, so the GM can view
every Runner in the group.
_Avoid_: campaign, session (session is in-combat state), party

**Runner**:
A player character in Shadowrun — the primary thing a Player creates and manages. A Player may
have multiple Runners.
_Avoid_: character, PC

**Contact**:
An NPC a Runner has an established relationship with, rated by **Connection** (how useful and
well-networked they are) and **Loyalty** (how much they like the Runner).
_Avoid_: ally, NPC (too broad)

**Entity**:
Anything with a stat block, ratings, or effects it can contribute — a stat-bearing thing, not just
carried equipment. Runners, Items, Spirits, Sprites, Qualities, Spells, Complex Forms, Adept
Powers, and **Matrix Entities** are all Entities. Every Item is an Entity; not every Entity is an
Item.
_Avoid_: object, game entity

**Rating**:
The strength or level of an Entity — e.g. Armor's protection, an Adept Power's level, a Spirit's
Force, a Program's or Device's rating. Not every Entity has one (Spells don't). Cases with no
meaningful rating — a Real SIN, a Real Licence, a native Language — are marked as such rather than
given a placeholder rating.
_Avoid_: confusing with **AI Rating**, an unrelated AI-metatype value

### Damage

**Damage Track**:
A count of damage boxes filled on a subject. Its capacity always comes from the subject's stats;
only the number of filled boxes is recorded.

**Physical Damage Track**:
Tracks lethal damage on a Runner or Vehicle. Capacity is 8 + half Body, rounded up. For a Runner,
overflow spills into the Stun track; a Vehicle with a full Physical track is destroyed.
_Avoid_: HP, health points, wounds

**Stun Damage Track**:
Tracks non-lethal damage on a Runner. Capacity is 8 + half Willpower, rounded up. When filled,
further Stun damage becomes Physical damage.
_Avoid_: stun points, fatigue

**Matrix Damage Track**:
Tracks damage taken in the matrix, by Runners (hot-sim VR biofeedback), **Sprites** (their primary
track), and matrix-capable devices. Kept separate from Physical/Stun because it heals separately
and applies to non-biological subjects. Capacity depends on the kind of subject.

**Wound Modifier**:
A dice pool penalty from filled damage boxes: −1 die for every full interval of damage (3 boxes by
default). **High Pain Tolerance** ignores the first few boxes; **Low Pain Tolerance** shortens the
interval so penalties start sooner.
_Avoid_: wound penalty, damage penalty

### Reputation

**Street Cred**:
A Runner's professional reputation: one point per 10 Karma earned in total, plus any adjustments
the GM awards for notable runs. Contributes to **Public Awareness**.

**Notoriety**:
A Runner's negative or infamous reputation, awarded by the GM for reckless or criminal acts.
Contributes to **Public Awareness**. Independent of Street Cred — gaining one never removes the
other.

**Public Awareness**:
How recognisable the Runner is to the general public: Street Cred + Notoriety + a GM adjustment,
which can be positive (extra exposure) or negative (exceptional anonymity).
_Avoid_: fame, infamy

### Progression & Economy

**Karma**:
The experience currency spent to improve a Runner after creation. In a **Karma Build**, Karma is
also the creation currency.
_Avoid_: XP, experience points

**Build Points (BP)**:
The creation-time budget in a **BP Build**, spent on attributes, skills, gear, and qualities. Not
used after creation.
_Avoid_: creation points, starting points

**Build Mode**:
The ruleset used to create a Runner, deciding which resources are available and how they're
allocated:
- **BP Build** — one fixed pool of Build Points covers all creation spending.
- **Priority Build** — a priority table (A–E) allocates resources across metatype, attributes,
  skills, magic, and resources.
- **Karma Build** — the whole Runner is built with Karma alone.

A Runner has exactly one Build Mode. Post-creation Karma advancement works the same regardless.
_Avoid_: character creation method, build system

**Nuyen (¥)**:
The in-world currency, spent on gear during creation and play. A Runner's Nuyen balance does not
include funds held on **Credsticks**.
_Avoid_: credits, money

**Credstick**:
An anonymous, untraceable currency carrier. Its balance is separate from the Runner's main Nuyen.
_Avoid_: cash, anonymous funds

**Loan**:
A debt a Runner owes a lender, with a principal and an interest rate. Interest is paid from the
Runner's Nuyen at **End of Month**; any unpaid interest is added to the principal. The in-game
consequences of unpaid loans are the GM's business.

**End of Month**:
A Player-triggered action that settles every Loan's interest for the month.
_Avoid_: monthly tick, interest sweep

### Biology & Awakening

**Metatype**:
A Runner's species (Human, Ork, Dwarf, Elf, Troll, Pixie, AI). Sets base attribute ranges and any
innate qualities or powers.
_Avoid_: race, species

**Awakening**:
A Runner's relationship to magic or the matrix: Mundane, Adept, Magician, Mystic Adept,
Technomancer, or None. Decides whether Magic or Resonance is available. **None** belongs to the AI
metatype alone — an AI can never Awaken, which is a different statement from a metahuman being
Mundane, even though both rule out Magic and Resonance. None is assigned automatically when a
Runner becomes an AI and is never a choice for anyone else.
_Avoid_: class, archetype (archetype is a separate freeform profile detail)

**AI Rating**:
An AI Runner's overall capability — the average of its four Mental attributes, rounded up — which
also caps its natural Edge. Unrelated to **Rating** despite the name.

### Capabilities

**Attribute**:
A numeric stat (1–6 base, higher with metatype bonuses), grouped as **Physical** (Body, Agility,
Reaction, Strength), **Mental** (Charisma, Intuition, Logic, Willpower), or **Special** (Magic,
Resonance, Edge, Essence).

**Edge**:
A special attribute with two sides. The **Edge Rating** is the attribute itself — the size of the
Edge Pool, and the number of bonus dice Edge adds to a roll. The **Edge Pool** is how many Edge
points the Runner can still spend right now.
_Avoid_: luck points, hero points

**Skill**:
A rated capability tied to an attribute, in three flavours: **Active** (used in tests),
**Knowledge** (background expertise), and **Language**. Active skills may have a
**Specialization** (+2 dice in that narrow focus). Knowledge and Language skills are named by the
Player rather than picked from a fixed list, and keep their identity when renamed — effects that
target one still apply after a rename.

**Quality**:
A positive or negative trait (e.g. High Pain Tolerance, Uneducated). Bought at creation; some are
innate to the metatype.

**Spirit**:
A magical being summoned and bound by a Magician or Mystic Adept. Has its own stat block, Force,
and a number of Services owed. Needs a **StatusSheet**.
_Avoid_: creature, critter (critter is a specific Shadowrun term for paranatural animals)

**Sprite**:
A matrix being compiled by a Technomancer — the matrix counterpart of a Spirit. Has its own stat
block, Level, and Services owed. Needs a **StatusSheet**.
_Avoid_: creature, critter

### Magic

**Spell**:
A magical effect cast by a Magician or Mystic Adept, costing **Drain**.

**Drain**:
The Stun damage a caster takes after casting, resisted with a Drain resistance test.

**Tradition**:
A magical discipline that sets a Magician's Drain resistance attribute and the spirits available
to them.

**Adept Power**:
A physical or mystical ability for Adepts and Mystic Adepts, bought with Power Points that come
from Magic.

**Complex Form**:
A Technomancer's equivalent of a spell — a matrix effect compiled from Resonance.

**Focus**:
A magical item a Runner can own, **Bond**, and **Activate**. Owning a focus does nothing by itself;
it must be bonded before it can be activated, and only activated foci add effects or sustain
spells. Subtypes: Power, Spellcasting, Summoning, Banishing, Centering, Sustaining, and Weapon.
_Avoid_: fetish, magical tool

**Bond** / **Bonding**:
A one-time Karma cost that permanently links a Focus to a Runner, and a prerequisite for
activating it. The Karma is lost for good if the focus is later lost, destroyed, or unbonded.
_Avoid_: activate, attune (a bonded focus can still be inactive)

**Activate** / **Activation**:
Switching a bonded Focus on or off during play. Free and reversible, unlike Bonding. An activated
focus is the focus's form of **Equipped**.
_Avoid_: bond

**Bonded Foci Limit**:
A Runner may have at most as many bonded foci as their Magic (SR4A p.199), whether or not they're
active. Going over is flagged as a warning rather than blocked.
_Avoid_: active foci limit, focus cap (the limit counts bonded foci, not active ones)

**Foci Force Limit**:
The combined Force of a Runner's bonded foci may not exceed Magic × 5 (SR4A p.199), whether or not
they're active.
_Avoid_: bonded foci cap, total force cap

**Sustaining Focus**:
A Focus that keeps one sustained spell running so the caster needn't concentrate on it. Its spell
category is fixed when the focus is made and limits which spells it can hold. The held spell still
appears in the Runner's spell list.
_Avoid_: spell holder

### Matrix

**Matrix Attributes**:
Response, System, Firewall, and Signal — the stats that stand in for Attributes in a **Matrix
Test**. They are ordinary attributes; a subject with no matrix side has 0 in each. An AI Runner is
the one Runner with matrix attributes of its own: System and Firewall come from its Mental
attributes, and Response and Signal come from its current **Active Node**.
_Avoid_: hardware stats, device stats

**Matrix Entity**:
The matrix side of anything that can act as a matrix node — a commlink, a drone, a smartgun, a
**Known Node**, an **Agent**. It has Matrix Attributes, a **Node Type**, the Programs **Loaded** on
it, and the Programs **Running** on it. A device's physical accessories belong to the device, not
to its Matrix Entity.
_Avoid_: persona (a Runner's own matrix self, not a device's)

**Node**:
Any Matrix Entity a Runner can connect to and run Programs on — the Runner's own devices as well as
systems they've hacked into.
_Avoid_: host

**Node Type** (General | Nexus):
Decides a Node's **Processor Limit** and nothing else. A Node is General unless stated otherwise.

**Processor Limit**:
How many Programs a Node can run before it slows down: System for a General node, System × 3 for a
Nexus. Going over isn't forbidden — each full multiple of the limit reached costs the Node 1
Response (e.g. with a limit of 3: −1 at 3 programs running, −2 at 6, −3 at 9).

**Known Node**:
A Node the Runner doesn't own but has some access to — a corp server, a security system, another
character's commlink. A newly known Node starts at **Public** access: being known only means the
Runner is aware of it and can reach its public surface.
_Avoid_: subscribed node (every Known Node other than the Active Node is informally a subscription)

**Active Node**:
The Node the Runner is working in right now — one of their own devices or a Known Node.
_Avoid_: current node

**Subscription Limit**:
How many Known Nodes a Runner can hold at once: the System of the commlink they're running their
persona from.

**Access Level** (None | Public | User | Security | Admin):
How much access the Runner has on a Known Node. Public needs no hacking at all; None means no
access whatsoever. The hacking threshold to reach User, Security, or Admin is Firewall (+ System
when Probing), +0 for User, +3 for Security, +6 for Admin.

**Clear Matrix Session**:
A Player-triggered action at the start of a new run that forgets every Known Node and stops
everything Running on them.

**Commlink**:
A Runner's personal matrix device and network hub, and their most common Node. Its Matrix
Attributes are its hardware ratings.

**Program**:
Software that runs on a Node. In a Matrix Test a Program plays the part a Skill plays in a physical
test (e.g. Response + Analyze). Each copy of a Program is **Loaded** on at most one Matrix Entity.
_Avoid_: app, software (software is the broader category; Program is the kind used in tests)

**Loaded** (Program):
A Program stored on a Matrix Entity. Putting it on a second device means moving it or making a new
copy.
_Avoid_: installed

**Running** (Program):
A Program active on a Node, as opposed to merely **Loaded** somewhere. Running a Program on a Known
Node needs at least User access there, and each running Program counts toward that Node's
**Processor Limit**.
_Avoid_: active (overloaded with Active Node), executing

**Terminate**:
Stopping a **Running** Program.
_Avoid_: kill, close

**Copy Protection**:
A property of a Program: a copy-protected Program can be moved to another device but never copied.

**Agent**:
An autonomous Program — a matrix construct that acts on its own, not just software a persona uses.
It is also a **Matrix Entity**: it has its own Loaded and Running Programs, which go with it when it
moves to another Node, and a script. Its Rating serves as its Pilot, System, Firewall, and the
skill side of any test it rolls; its Response and Signal always come from the Node it's running on.
Needs a **StatusSheet**.
_Avoid_: bot

**Matrix Test**:
A test rolling a Matrix Attribute + a Program — the matrix counterpart of Attribute + Skill.
_Avoid_: hacking roll, matrix roll

### Gear

**Item**:
Any physical or digital piece of equipment a Runner owns — armor, firearms, implants, devices,
programs, vehicles, and so on. "Gear" is acceptable in on-screen wording.
_Avoid_: gear (outside on-screen wording)

**Attachment**:
An Item mounted on, installed in, or otherwise belonging to another Item — a scope on a rifle, a
Licence on a SIN. Attachments can have attachments of their own.
_Avoid_: child item, accessory (too weapon-specific), mod

**Equipped**:
Whether an Item is actively worn or wielded right now, as opposed to merely owned. Never true of a
**Stashed** Item.

**Stashed**:
Whether an Item has been left behind ("at the safehouse") rather than carried. Stashing an Item
unequips it, and un-stashing restores whatever it was before; stashing an Item stashes its
Attachments too. Stashed Items are greyed out and listed last.
_Avoid_: unequipped (an Item can be carried and unequipped, e.g. a spare pistol in a holster)

**Available**:
Not **Stashed** — an Item the Runner has on hand, Equipped or not.
_Avoid_: confusing with **Availability**, an unrelated Item term

**Vehicle**:
An Item with its own stat block (Pilot, Sensor, Armor, Body, damage track) that needs a
**StatusSheet** during play, like a Spirit or Sprite.
_Avoid_: asset, transport

**Drone**:
A small, unmanned, remote-controlled Vehicle. Mechanically no different from any other Vehicle.
_Avoid_: bot, UAV, UGV

**StatusSheet**:
The in-play tracking view for a Spirit, Sprite, Vehicle, or Agent — its own damage track, stats,
and session state, separate from the Runner's main sheet.
_Avoid_: mini-sheet, sub-sheet, stat block (the stat block is the data; the StatusSheet is the view)

**SIN** _(System Identification Number)_:
A matrix identity. Runners usually carry one or more fake SINs. Every SIN a Runner holds is equally
valid — there's no "active" SIN.
_Avoid_: ID, identity, active SIN

**Licence**:
Legal permission to carry Restricted gear, issued against a SIN. One Licence can cover several
Items, usually several of the same kind, but each Item is covered by at most one Licence. A Real
SIN's Licence is Real and has no rating; a Fake SIN's Licence is Fake and has a rating (3 unless
changed). Forbidden gear can never be licensed.
_Avoid_: permit, registration

**Availability**:
How hard an Item is to obtain and whether owning it is legal: a rating plus a restriction —
none (legal), **Restricted** (needs a Licence), or **Forbidden** (illegal to own).

**License Check**:
A simulated security scan of what a Runner is carrying: every SIN and every Restricted Item is
tested against a **Verification System Rating** to see whether its credentials hold up. Only the
Player runs it on themselves; there's no GM-triggered version.
_Avoid_: security check, license scan

**Verification System Rating**:
The 1–6 strength of the scanning system in one License Check, chosen fresh by the Player each time.

### Effects & Rules

**GameEffect**:
A mechanical modifier to a derived stat — an attribute bonus, a dice pool modifier, extra
initiative passes, a pain tolerance change. Comes from Items (cyberware, weapons, armor),
Qualities, sustained Spells, Complex Forms, Adept Powers, drugs, or the Runner's matrix connection
mode (AR, hot-sim VR, cold-sim VR). Spirits, Sprites, and Agents are Entities but don't grant
GameEffects; a connection mode is a state the Runner is in, not an Entity.
_Avoid_: modifier, bonus (too generic)

**Granted Effects**:
The GameEffects a single source carries as its own.

**Applied Effects**:
The GameEffects that actually land on a given target — an Item or the Runner — once every source's
**Scope** has been worked out from where that source sits among the Runner's Items.
_Avoid_: "effects for X" (ambiguous — say "applied to" or "granted by")

**Scope**:
Which Items a GameEffect reaches, independent of what it modifies. By default, only the Item that
grants it (or the Runner, for effects not on an Item). It can be widened to that Item's parent,
children, siblings, all ancestors, or all descendants, or to everything under the top of its
ownership chain (e.g. a drone's autosoft reaching the other weapons mounted on the same drone). It
can also be narrowed to one kind of Item. Effects from Qualities, Spells, Complex Forms, and Powers
always start from the Runner.
_Avoid_: target (reserved for which dice pool an effect modifies — see **Pool Id**)

**Source**:
The rulebook and page where a rule or item is defined (e.g. SR4A p.42).

**Optional Rule**:
A published variant rule from a Shadowrun sourcebook that changes core SR4 mechanics. Always cites
its Source and is off unless a table turns it on.
_Avoid_: house rule

**House Rule**:
A mechanical choice the app itself invents, with no sourcebook behind it, that a table can still
switch on or off. Each House Rule picks its own default — often on, since it's usually how a
feature was designed to work.
_Avoid_: optional rule

### Dice

**Dice Pool**:
The number of d6s rolled for a test: Attribute + Skill (or Matrix Attribute + Program), plus any
GameEffects, minus the Wound Modifier. Every Dice Pool belongs to a **Pool Id**, which is what
GameEffects target.

**Pool Id**:
Which kind of test a Dice Pool is, independent of any particular Item. Pool Ids form a tree of
categories (e.g. Active Skills, Knowledge Skills, Attack), with one entry per Active Skill and one
per Knowledge or Language skill the Player has added. A whole branch can be targeted at once (e.g.
"all Knowledge skill tests").
_Avoid_: target (without saying "pool") — conflicts with **Scope**

**Hit**:
A die showing 5 or 6. Hits are counted against a **Threshold**.

**Threshold**:
The number of Hits a test needs to succeed — met in one roll for a **Standard Test**, or built up
over several for an **Extended Test**. An **Opposed Test** has none.

**Standard Test**:
One Dice Pool rolled against a Threshold. The default kind of test.

**Opposed Test**:
Two Dice Pools rolled against each other; the side with more Hits wins by the difference (net
Hits). When the other side is someone the app doesn't track, the Player enters their Hits by hand.

**Extended Test**:
A Standard Test rolled repeatedly over time, adding up Hits toward the Threshold, with each roll
recorded. Optionally the pool shrinks by one die per roll.

**Hidden Test**:
A test whose Hits are kept from the Player (typically Perception), so failing looks the same as
there being nothing to notice.

**Glitch**:
Half or more of the dice show 1s. A **Critical Glitch** is a Glitch with zero Hits.

**Digital Roll**:
The app builds the pool, rolls it, and shows the Hits and any Glitch.

**Physical Roll**:
The Player rolls real dice and enters the result; the app still works out the pool size.

### App Contexts

**Builder**:
The mode for creating and restructuring a Runner — metatype, awakening, attribute allocation,
quality selection — against their creation budget.
_Avoid_: editor, creator, creation mode

**Viewer**:
The play-time mode for an existing Runner: tracking damage, rolling dice, spending Edge, and
managing resources during a session.
_Avoid_: sheet view, player view, read mode

**Session State**:
In-play details such as initiative rolls, completed passes, and sustained spells. Saved as durably
as everything else, so reloading the page mid-combat loses nothing.
_Avoid_: temporary state, volatile state

### Storage & Versioning

**Runner ID**:
What uniquely identifies a Runner: which **Storage Source** it lives in plus a unique code. Copying
a Runner to another Storage Source produces a new Runner with a new ID, not a replica.
_Avoid_: character key

**Storage Source**:
Where a Runner is saved — e.g. this browser or Google Drive. A Runner lives in exactly one at a
time.

**Migration**:
One permanent upgrade step that brings saved Runners from an older data shape to a newer one. A
Migration is never changed once released; a mistake is fixed by a later Migration. Each carries a
**Migration Timestamp**, and a Runner only goes through the ones newer than its **SIN Version**, in
order.
_Avoid_: upgrade, patch, update

**Migration Timestamp**:
When a Migration was created. Every new Migration must be newer than all released ones, so that
already-upgraded Runners still pick it up.

**SIN Version**:
The Migration Timestamp of the last Migration a Runner went through — the only thing that decides
which Migrations it still needs. Unrelated to a **SIN**.
_Avoid_: app version

**App Version**:
Which build of the app last saved a Runner. For reference only; it never decides which Migrations
run.

## Relationships

- A **Player** manages one or more **Runners**; a **Game** groups several Players' Runners under
  one GM.
- A **Runner** lives in exactly one **Storage Source**; copying it elsewhere makes a new Runner.
- An **Item** can have **Attachments**, which can have their own, to any depth.
- An **Item** can have a **Matrix Entity**, which makes it a **Node**. A **Program** is **Loaded**
  on exactly one Matrix Entity and can be **Running** on any number of Nodes.
- An **Agent** is both a **Program** and a **Matrix Entity**, so Programs can be Loaded and Running
  on an Agent, which is itself Loaded and Running somewhere else.
- **GameEffects** come from Items, Qualities, Spells, Complex Forms, and Adept Powers — never from
  Spirits, Sprites, or Agents — and each one's **Scope** is worked out from where its source sits
  among the Runner's Items.
- **Karma** and **Build Points** are separate economies: BP is creation-only, Karma is
  post-creation.
- An **Awakening** of Adept, Magician, or Mystic Adept unlocks Magic; Technomancer unlocks
  Resonance; Mundane and None lock both to 0.

## Example dialogue

> **Dev:** "When a Runner buys new gear, do we deduct **Karma** or **Nuyen**?"
> **Domain expert:** "Gear costs **Nuyen**. Karma is only for improving **Attributes** and
> **Skills** and buying **Qualities** after creation."
>
> **Dev:** "If I **Terminate** the sniffer program on the corp server, is it gone from my
> commlink?"
> **Domain expert:** "No — it's still **Loaded** on your commlink. It just isn't **Running** on
> that **Known Node** any more."

## Flagged ambiguities

- "Character" meant both the Runner and the record holding their data. Resolved: say **Runner**.
- "Node" meant only hacked systems, excluding the Runner's own devices. Resolved: a **Node** is any
  Matrix Entity you can connect to; a **Known Node** is one you don't own.
- "Active" is used for the **Active Node**, activating a **Focus**, and **Active** Skills. A
  Program on a Node is **Running**, never "active".
- **Available** (not stashed) and **Availability** (how hard an Item is to obtain) are unrelated.
- **Rating** and **AI Rating** are unrelated.
