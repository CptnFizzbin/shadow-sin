#!/bin/bash
# Sync SessionStart hook for Claude Code on the web.
#
# Symlinks .agents/skills/ to .claude/skills/ so the repo's fallow-managed
# skills (grill-me, to-issues, prototype, etc. — see skills-lock.json) are
# discoverable as regular Claude Code skills, without duplicating them on
# disk. Runs synchronously (it's near-instant) so skills are available from
# the very first turn of the session.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

ln -sfn "$CLAUDE_PROJECT_DIR/.agents/skills" "$CLAUDE_PROJECT_DIR/.claude/skills"
