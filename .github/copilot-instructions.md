<!-- Copilot project instructions for ShadowSIN -->

# Copilot instructions — ShadowSIN

Follow the repository conventions described in `AGENTS.md` and these additional project-specific rules:

- Don't use short or ambiguous variable names. Prefer descriptive identifiers (for example `characterHealth` instead of
  `hp`, `damageThreshold` instead of `dt`). Short names are acceptable only for well-known conventions (`id`, `ok`,
  `vs`) or in tiny local scopes where a longer name reduces clarity.
- One React component per `.tsx` file. Combine a tiny helper with the main component only when the helper is trivial and
  used exclusively by the parent (no props, pure presentational fragment). Otherwise, place each component in its own
  file and export it.
- Prefer functional React components using the style in `src/components/UI/Header.tsx`: use a named exported const with
  an explicit props interface (for example `export const Header: FC<Props> = ({ ... }) => { ... }`). Avoid class
  components and default anonymous exports when possible.

Formatting and tooling notes:

- The project uses Biome for formatting and linting. Use 2 spaces for indentation and double quotes for JS/TS strings.
- Respect the existing path alias `#/` → `src/` and other conventions in `AGENTS.md`.
- After making changes, always verify with `yarn fix` (auto-fix lint/format) followed by `yarn tsc` (type check). Both
  must pass before considering a change complete.
- When a task involves any UI change (new component, layout update, added controls, style adjustments), **always include
  at least one screenshot** of the affected area. Start the dev server (`yarn dev`), capture the relevant region of the
  browser, and attach the image to the PR or response so reviewers can verify the visual result without running the app.

When you discover patterns or troubleshooting steps relevant to contributors, update this file with the problem, the
solution, and minimal reproducible steps. Do not include machine-specific paths or shell preferences.
