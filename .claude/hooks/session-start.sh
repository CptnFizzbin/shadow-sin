#!/bin/bash
# SessionStart hook for Claude Code on the web.
#
# a) Installs project dependencies via Yarn (Corepack resolves the pinned
#    4.18.0 from package.json's "packageManager" field).
# b) Symlinks .agents/skills/ to .claude/skills/ so the repo's fallow-managed
#    skills (grill-me, to-issues, prototype, etc. — see skills-lock.json) are
#    discoverable as regular Claude Code skills, without duplicating them
#    on disk.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

corepack enable >/dev/null 2>&1 || true
yarn install

ln -sfn "$CLAUDE_PROJECT_DIR/.agents/skills" "$CLAUDE_PROJECT_DIR/.claude/skills"
