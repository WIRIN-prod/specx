#!/usr/bin/env python3
"""SpecX guard, a PreToolUse hook.

Denies edits outside a task's scope file, and makes a person confirm merges and
history-destroying git commands.

shortcut: it sees file tools and the Bash command text, not what a command does
(so a bare `git push` to a branch tracking main, or quoted text, is misjudged),
so a shell redirect or script can still edit outside scope, and a `cd` inside a
command is not followed. It reads the worktree from the hook's cwd, so an edit
outside the worktree is caught only when cwd is that worktree. Upgrade to a
sandbox if agents are found working around it.
"""
import json
import os
import re
import subprocess
import sys

GIT = r"\bgit(?:\s+-\S+(?:\s+[^-\s]\S*)??)*\s+"
GH = r"\bgh(?:\s+-\S+\s+\S+)*\s+"
RISKY_COMMAND = re.compile(
    GH + r"pr\s+merge\b"
    r"|" + GH + r"api\b[^|;&]*/pulls/\S+/merge\b"
    r"|" + GIT + r"push\b[^|;&]*?\s(--force\S*|-[a-zA-Z]*f[a-zA-Z]*|\+\S+)(\s|$)"
    r"|" + GIT + r"reset\b[^|;&\n]*\s--hard\b"
    r"|" + GIT + r"clean\b(?![^|;&\n]*\s(-n|--dry-run)\b)"
    r"|" + GIT + r"stash\b(?!\s+(list|show)\b)"
    r"|" + GIT + r"push\b[^|;&]*?\s(--delete\b|-d\b|:\S+)"
    # shortcut: guesses the main branch is `main` or `master`; read it from specx/spec.md if others appear.
    r"|" + GIT + r"push\b[^|;&]*?\s(\S*:)?(refs/heads/)?(main|master)(\s|$)"
    r"|" + GIT + r"push\b[^|;&]*?\s--mirror\b"
    r"|" + GIT + r"pull\b[^|;&\n]*\s(--rebase|-r)\b"
    r"|" + GIT + r"(rebase|filter-branch)\b"
    r"|" + GIT + r"commit\b[^|;&\n]*\s--amend\b"
    r"|" + GIT + r"checkout\b[^|;&\n]*\s(--|\.|-f|--force)(\s|$)"
    r"|" + GIT + r"switch\b[^|;&\n]*\s(--discard-changes|-f|--force)\b"
    r"|" + GIT + r"restore\b(?![^|;&\n]*\s(--staged|-S)\b)"
    r"|" + GIT + r"restore\b[^|;&\n]*\s(--worktree|-W)\b"
)


def git(cwd, *args):
    done = subprocess.run(
        ["git", "-C", cwd, *args], capture_output=True, text=True, check=False
    )
    return done.stdout.strip() if done.returncode == 0 else None


def is_specx_project(cwd):
    top = git(cwd, "rev-parse", "--show-toplevel")
    return bool(top) and os.path.isfile(os.path.join(top, "specx", "RULES.md"))


def scope_of(folder):
    """Return (top, allowed paths) for a folder's git worktree, or None."""
    top = git(folder, "rev-parse", "--show-toplevel")
    git_dir = git(folder, "rev-parse", "--absolute-git-dir")
    if not top or not git_dir:
        return None
    scope_file = os.path.join(git_dir, "specx-scope")
    if not os.path.isfile(scope_file):
        return None
    with open(scope_file, encoding="utf-8") as handle:
        return top, [line.strip().rstrip("/") for line in handle if line.strip()]


def check_edit(path, cwd):
    path = os.path.realpath(os.path.join(cwd, path))
    if os.path.basename(path) == "specx-scope":
        return "deny", "SpecX: an agent may not change its own scope."
    folder = os.path.dirname(path)
    while not os.path.isdir(folder):
        folder = os.path.dirname(folder)
    scope = (os.path.isdir(cwd) and scope_of(cwd)) or scope_of(folder)
    if not scope:
        return None
    top, allowed = scope
    relative = os.path.relpath(path, os.path.realpath(top)).replace(os.sep, "/")
    if any(relative == entry or relative.startswith(entry + "/") for entry in allowed):
        return None
    return "deny", f"SpecX: {relative} is outside this task's Files. Stop and report."


def check(payload):
    tool = payload.get("tool_name", "")
    tool_input = payload.get("tool_input") or {}
    cwd = payload.get("cwd") or os.getcwd()
    if tool == "Bash":
        command = tool_input.get("command", "")
        if RISKY_COMMAND.search(command) and is_specx_project(cwd):
            return "ask", "SpecX: this merges or rewrites history. Confirm you approved it."
        return None
    path = tool_input.get("file_path") or tool_input.get("notebook_path")
    return check_edit(path, cwd) if path else None


def main():
    try:
        result = check(json.load(sys.stdin))
    except (OSError, ValueError, AttributeError, TypeError):
        return  # A broken guard must not stop all work; the rules still apply.
    if result:
        decision, reason = result
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": decision,
                        "permissionDecisionReason": reason,
                    }
                }
            )
        )


if __name__ == "__main__":
    main()
