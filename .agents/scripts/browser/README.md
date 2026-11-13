# Agent browser

A small CLI (`yarn browser`) that lets agents drive a real Chromium against the dev server — navigate, click, fill
forms, read the page, and take screenshots — one shell command at a time.

`start` launches a browser in a detached background process that stays alive between commands. Every other command
attaches to it over CDP, acts on the **active tab** (the most recently opened one), and detaches. Page state,
localStorage (where Runners live), and history all persist until `stop`.

## Setup

Dependencies (`playwright`, `commander`) are dev dependencies, so `yarn install` covers them. Playwright needs a
Chromium build matching its version:

- **Claude Code cloud sessions** ship one preinstalled (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) — nothing to do.
  The `playwright` version in `package.json` is pinned to match it; don't bump it without checking.
- **Locally**, run `yarn playwright install chromium` once.

## Typical session

```bash
yarn dev &                                   # the app on :3000
yarn browser start /                         # paths resolve against http://localhost:3000
yarn browser snapshot                        # ARIA tree — find names/roles to target
yarn browser click 'role=button[name="Artemis Elf · Rigger"]'
yarn browser fill 'role=textbox[name="Name"]' "Hexen"
yarn browser press Enter
yarn browser screenshot screenshots/desktop.png
yarn browser screenshot screenshots/pixel8.png --device "Pixel 8"
yarn browser console                         # console messages and page errors
yarn browser stop
```

## Commands

Run `yarn browser --help` or `yarn browser <command> --help` for every option.

| Command | Does |
|---|---|
| `start [url] [--device <name>] [--headed] [--base-url <url>]` | Start the background browser (no-op if running) |
| `stop` / `status` | Stop the browser / list its open tabs |
| `open <url>` (alias `goto`), `reload`, `back` | Navigate the active tab |
| `click <selector>` | Click an element |
| `fill <selector> <value>` | Replace an input's value |
| `select <selector> <option>` | Pick an option in a native `<select>` |
| `press <key> [-s <selector>]` | Press a key (`Enter`, `Escape`, `Control+A`, …) |
| `wait <selector> [--state] [--timeout]` | Wait for an element to be visible/hidden/attached/detached |
| `text [selector]` | Print visible text |
| `snapshot [selector]` | Print an ARIA snapshot — the quickest way to discover selectors |
| `eval <expression>` | Evaluate JS in the page (`await` allowed) and print the JSON result |
| `screenshot <file> [-s <selector>] [--full-page] [--device <name>] [--scale <n>]` | Save a PNG |
| `viewport <width> <height>` | Resize the active tab |
| `console [-n <lines>] [--clear]` | Print captured console output |

Selectors are [Playwright selectors](https://playwright.dev/docs/other-locators): CSS (`button.save`), text
(`text=Save`), role (`role=button[name="Save"]`), and chained (`role=dialog >> role=button[name="Close"]`).
Commands time out after 10 seconds and exit non-zero with the error message, so failures are visible to the agent.

## Screenshots for UI changes

`AGENTS.md` asks for desktop and Pixel 8 screenshots of UI changes. With a desktop session (the default, 1440×900):

```bash
yarn browser screenshot shots/desktop.png --scale 2 -s 'role=heading[name="Qualities"]'
yarn browser screenshot shots/pixel8.png --device "Pixel 8" -s 'role=heading[name="Qualities"]'
```

`--device "Pixel 8"` uses the 412×915 viewport `AGENTS.md` asks for. `--device` and `--scale` re-open the current URL in a throwaway context seeded with the session's cookies and
localStorage, so the capture shows the same Runner without changing the main session. Navigation state that isn't in
the URL or storage (an open dialog, an expanded section) isn't carried over — for those, start the whole session on the
device instead with `yarn browser start --device "Pixel 8"`.

Keep screenshots out of the repo (the scratchpad directory or `docs/workspace/`, which is git-ignored).

## State

Session info, the browser profile, and logs live in `node_modules/.tmp/agent-browser/`. If the browser fails to start,
`server.log` there has the details. A session whose process died is detected and cleaned up automatically.
