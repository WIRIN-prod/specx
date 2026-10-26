#!/usr/bin/env bash
# Remove the files the old SpecX CLI (0.1.x) generated in a project, so only the
# SpecX plugin's /specx:plan, /specx:execute and /specx:review remain.
#
# Usage: upgrade-from-0.1.sh [project-dir] [--dry-run] [--yes] [--include-old-record]
#
#   --dry-run             show what would be removed and change nothing
#   --yes                 do not ask for confirmation
#   --include-old-record  also delete the old specx/ record (knowledge, proposals,
#                         plans, specifications, work, and the old Home.md).
#                         Without this flag your old record is left untouched.
#
# It only touches files SpecX generated, by exact name. Files you wrote are kept,
# and a shared file such as AGENTS.md only loses its SpecX section.
set -euo pipefail

dir="."; dry=0; yes=0; record=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry=1 ;;
    --yes) yes=1 ;;
    --include-old-record) record=1 ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    -*) echo "Unknown option: $arg" >&2; exit 2 ;;
    *) dir="$arg" ;;
  esac
done
cd "$dir"
echo "Project: $(pwd)"

names="approve discover execute plan propose resume review specify archive build critic design revise graph sdd spec specialist tasks verify"
rm_paths=()      # files and folders to delete
section_files=() # files that lose a managed section, as "file|marker"

for n in $names; do
  for base in .claude/skills .cursor/skills .github/skills .agents/skills; do
    [ -e "$base/specx-$n" ] && rm_paths+=("$base/specx-$n")
    [ -e "$base/source-command-specx-$n" ] && rm_paths+=("$base/source-command-specx-$n")
  done
  [ -f ".claude/commands/specx/$n.md" ] && rm_paths+=(".claude/commands/specx/$n.md")
  [ -f ".cursor/commands/specx-$n.md" ] && rm_paths+=(".cursor/commands/specx-$n.md")
  [ -f ".specx/commands/$n.md" ] && rm_paths+=(".specx/commands/$n.md")
done
for n in init status link; do
  for base in .agents/skills .claude/skills; do
    [ -e "$base/source-command-specx-$n" ] && rm_paths+=("$base/source-command-specx-$n")
  done
done
[ -f .specx/AGENTS.md ] && grep -q "specX agent rules" .specx/AGENTS.md && rm_paths+=(".specx/AGENTS.md")
[ -f .specx/specx.yaml ] && rm_paths+=(".specx/specx.yaml")
[ -f .cursor/rules/specx.mdc ] && head -3 .cursor/rules/specx.mdc | grep -qi "SpecX" && rm_paths+=(".cursor/rules/specx.mdc")
for pair in "AGENTS.md|agents" ".github/copilot-instructions.md|copilot"; do
  f="${pair%%|*}"; m="${pair##*|}"
  [ -f "$f" ] && grep -q "<!-- specx:$m:begin -->" "$f" && section_files+=("$pair")
done
if [ "$record" = 1 ]; then
  for d in knowledge proposals plans specifications work; do
    [ -d "specx/$d" ] && rm_paths+=("specx/$d")
  done
  [ -f specx/Home.md ] && grep -q "SpecX project record" specx/Home.md && rm_paths+=("specx/Home.md")
fi

if [ ${#rm_paths[@]} -eq 0 ] && [ ${#section_files[@]} -eq 0 ]; then
  echo "Nothing from SpecX 0.1 found. Nothing to do."
  exit 0
fi

echo; echo "Will delete:"
for p in "${rm_paths[@]}"; do echo "  $p"; done
echo "Will remove only the SpecX section from:"
for pair in "${section_files[@]}"; do echo "  ${pair%%|*}"; done
if [ "$record" = 0 ]; then
  old=""; for d in knowledge proposals plans specifications work; do [ -d "specx/$d" ] && old="$old specx/$d"; done
  [ -n "$old" ] && echo && echo "Left untouched (old record; add --include-old-record to delete):$old"
fi

[ "$dry" = 1 ] && { echo; echo "Dry run: nothing changed."; exit 0; }
if [ "$yes" = 0 ]; then
  printf '\nProceed? [y/N] '
  read -r answer < /dev/tty || answer=""
  case "$answer" in y|Y|yes|YES) ;; *) echo "Cancelled."; exit 1 ;; esac
fi

for p in "${rm_paths[@]}"; do rm -rf -- "$p"; done
for pair in "${section_files[@]}"; do
  f="${pair%%|*}"; m="${pair##*|}"
  awk -v b="<!-- specx:$m:begin -->" -v e="<!-- specx:$m:end -->" '
    index($0,b){skip=1} !skip{print} index($0,e){skip=0}' "$f" > "$f.tmp"
  # Delete the file if nothing but whitespace and a bare "# AGENTS.md" title remains.
  if [ -z "$(tr -d '[:space:]' < "$f.tmp" | sed 's/^#AGENTS\.md$//')" ]; then rm -f -- "$f" "$f.tmp"
  else mv -- "$f.tmp" "$f"; fi
done
# Remove folders the cleanup emptied, but never anything that still has content.
for d in .claude/commands/specx .claude/commands .cursor/commands .claude/skills .cursor/skills .cursor/rules .cursor \
         .github/skills .agents/skills .agents .specx/commands .specx; do
  [ -d "$d" ] && rmdir -- "$d" 2>/dev/null || true
done

echo; echo "Done. Next, in Claude Code run /reload-plugins, then /specx:plan."
