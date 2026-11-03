#!/usr/bin/env python3
"""SpecX guard, a PreToolUse hook.

Denies edits outside a task's scope file, and makes a person confirm merges and
history-destroying git commands.

shortcut: it sees file tools and the Bash command text, not what a command does,
so a shell redirect or script can still edit outside scope. Upgrade to a sandbox
if agents are found working around it.
"""
import json
import os
import re
import subprocess
import sys

RISKY_COMMAND = re.compile(
    r"\bgh\s+pr\s+merge\b"
    r"|\bgit\s+push\b[^|;&\n]*\s(--force|--force-with-lease|-f)\b"
    r"|\bgit\s+reset\s+--hard\b"
    r"|\bgit\s+clean\b"
    r"|\bgit\s+stash\b"
)


def git(cwd, *args):
    done = subprocess.run(
        ["git", "-C", cwd, *args], capture_output=True, text=True, check=False
    )
    return done.stdout.strip() if done.returncode == 0 else None


def is_specx_project(cwd):
    top = git(cwd, "rev-parse", "--show-toplevel")
    return bool(top) and os.path.isfile(os.path.join(top, "specx", "RULES.md"))


def check_edit(path):
    path = os.path.realpath(path)
    folder = os.path.dirname(path)
    while not os.path.isdir(folder):
        folder = os.path.dirname(folder)
    top = git(folder, "rev-parse", "--show-toplevel")
    git_dir = git(folder, "rev-parse", "--absolute-git-dir")
    if not top or not git_dir:
        return None
    scope_file = os.path.join(git_dir, "specx-scope")
    if not os.path.isfile(scope_file):
        return None
    with open(scope_file, encoding="utf-8") as handle:
        allowed = [line.strip().rstrip("/") for line in handle if line.strip()]
    relative = os.path.relpath(path, os.path.realpath(top)).replace(os.sep, "/")
    if any(relative == entry or relative.startswith(entry + "/") for entry in allowed):
        return None
    return "deny", f"SpecX: {relative} is outside this task's Files. Stop and report."


def check(payload):
    tool = payload.get("tool_name", "")
    tool_input = payload.get("tool_input") or {}
    if tool == "Bash":
        command = tool_input.get("command", "")
        cwd = payload.get("cwd") or os.getcwd()
        if RISKY_COMMAND.search(command) and is_specx_project(cwd):
            return "ask", "SpecX: this merges or rewrites history. Confirm you approved it."
        return None
    path = tool_input.get("file_path") or tool_input.get("notebook_path")
    return check_edit(path) if path else None


def main():
    try:
        result = check(json.load(sys.stdin))
    except (OSError, ValueError):
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
