#!/bin/bash
# Async SessionStart hook for Claude Code on the web.
#
# Installs project dependencies via Yarn (Corepack resolves the pinned
# 4.18.0 from package.json's "packageManager" field). Runs in the background
# so it doesn't block session start — note this introduces a race where the
# agent might try to run tests/lint/build before install has completed.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

cd "$CLAUDE_PROJECT_DIR"
corepack enable >/dev/null 2>&1 || true
yarn install
