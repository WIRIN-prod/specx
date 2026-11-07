#!/usr/bin/env bash
# Warns at session start (also on resume, /clear and compaction) when the guard cannot run because Python 3 is missing.
# Find the project the way guard.py does: from the git top level.
top=$(git rev-parse --show-toplevel 2>/dev/null) && cd "$top"
[ -f specx/RULES.md ] || exit 0
for p in python3 python; do
  "$p" -c 'import sys; sys.exit(sys.version_info < (3, 7))' 2>/dev/null && exit 0
done
echo '{"systemMessage": "SpecX: the guard hook is off because Python 3 was not found. Install Python 3 to turn it on."}'
