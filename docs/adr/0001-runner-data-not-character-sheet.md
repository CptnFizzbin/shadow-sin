# RunnerData as the root type, not CharacterSheet

The root data type for a player character is named `RunnerData`. The original name `CharacterSheet`
was chosen to avoid a collision with `CharacterData`, a built-in type in the DOM/Node environments.
`RunnerData` was preferred over `CharacterSheet` because it aligns with the `*Data` naming
convention used throughout the domain (`ItemData`, `SpellData`, `QualityData`, etc.), and because
"Runner" is the correct domain term for a Shadowrun player character.

The variable-name alias `sheet` is preserved across selectors and component props so existing call
sites do not need to be renamed en masse.

## Considered Options

- **`CharacterSheet`** — original name; avoided the `CharacterData` DOM collision but introduced a
  naming inconsistency with the rest of the `*Data` types.
- **`RunnerSheet`** — domain-correct but breaks the `*Data` convention.
- **`RunnerData`** ✅ — domain-correct, consistent with `*Data` convention, no naming conflict.
