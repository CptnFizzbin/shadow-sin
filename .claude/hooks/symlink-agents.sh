#!/bin/bash
# Sync SessionStart hook for Claude Code on the web.
#
# Symlinks the harness-neutral agent config under .agents/ into .claude/ so
# Claude Code discovers it without duplicating files on disk:
#   .agents/skills/ -> .claude/skills/  (vendored skills, see skills-lock.json)
#   .agents/agents/ -> .claude/agents/  (subagent profiles, e.g. architecture-reviewer)
# Runs synchronously (it's near-instant) so both are available from the very
# first turn of the session.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

ln -sfn "$CLAUDE_PROJECT_DIR/.agents/skills" "$CLAUDE_PROJECT_DIR/.claude/skills"
ln -sfn "$CLAUDE_PROJECT_DIR/.agents/agents" "$CLAUDE_PROJECT_DIR/.claude/agents"
