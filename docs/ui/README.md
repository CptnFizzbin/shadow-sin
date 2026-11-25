# UI Components

Reusable UI primitives in `src/ui/`. These components wrap MUI (or
other base libraries) and enforce the application's visual language. They
intentionally expose **only functional/behavioural props** — no `sx`,
`className`, or other styling overrides — so the look of common UI elements
stays uniform across the application.

They never use the router. Anything navigational comes in from the caller: an `href` or `onClick` prop, or an
adapter supplied through a context provider (as the dialog's back-button handling does).

## Components

| File | Component(s) | Description |
|------|-------------|-------------|
| [`dialog/`](./dialog.md) | `Dialog`, `Dialog.Title`, `Dialog.Content`, `Dialog.Actions` | Compound modal dialog |
| [`prototype/`](./prototype.md) | `Prototype`, `Prototype.Item` | Tab switcher for comparing in-progress prototypes |
