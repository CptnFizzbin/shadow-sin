# MUI

Only specify MUI style props, variants, and layout values when **explicitly deviating from the theme defaults**. Do not
pass props that merely repeat a default — if the theme already sets `gap`, `padding`, `fontSize`, `variant`,
`size`, `color`, etc., omitting the prop produces the same result and keeps the code easier to read.

```tsx
// ✅ — no padding/gap props; theme defaults apply
<Stack>…</Stack>

// ✅ — intentionally overrides the default gap for a tighter list
<Stack gap={0.5}>…</Stack>

// ❌ — just repeats the theme default, adds noise
<Stack gap={2} variant="outlined">…</Stack>
```

This applies to every MUI component: `Stack`, `Paper`, `Typography`, `Button`, `TextField`, `Chip`, etc. When in
doubt, omit the prop and let the theme do the work.

`colorSchemeSelector: "data"` is active, so palette callbacks like `(t) => t.palette.background.paper` return static hex
values that won't respond to color-scheme changes. Use CSS variable strings instead:
`"var(--mui-palette-background-paper)"`, and channel variables for opacity tints:
`"rgba(var(--mui-palette-error-mainChannel) / 0.15)"`.
