#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install project skills into ~/.claude/skills/
SKILLS_SRC="${CLAUDE_PROJECT_DIR}/.claude/skills"
SKILLS_DEST="${HOME}/.claude/skills"

if [ -d "$SKILLS_SRC" ]; then
  mkdir -p "$SKILLS_DEST"
  cp -r "$SKILLS_SRC"/. "$SKILLS_DEST/"
fi
