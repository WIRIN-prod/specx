#!/usr/bin/env bash
# Warns once per session when the guard cannot run because Python 3 is missing.
# shortcut: checks the session's starting folder only; a session started in a subfolder gets no warning.
[ -f specx/RULES.md ] || exit 0
for p in python3 python; do
  "$p" -c 'import sys; sys.exit(sys.version_info < (3, 6))' 2>/dev/null && exit 0
done
echo '{"systemMessage": "SpecX: the guard hook is off because Python 3 was not found. Install Python 3 to turn it on."}'
