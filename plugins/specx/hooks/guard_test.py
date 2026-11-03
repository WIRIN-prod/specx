#!/usr/bin/env python3
"""Self-check for guard.py, using a real git repository and worktree."""
import json
import os
import subprocess
import sys
import tempfile

GUARD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "guard.py")


def run(payload):
    done = subprocess.run(
        [sys.executable, GUARD], input=payload, capture_output=True, text=True, check=True
    )
    if not done.stdout:
        return None
    return json.loads(done.stdout)["hookSpecificOutput"]["permissionDecision"]


def edit(path):
    return run(json.dumps({"tool_name": "Edit", "tool_input": {"file_path": path}}))


def bash(command, cwd):
    return run(json.dumps({"tool_name": "Bash", "tool_input": {"command": command}, "cwd": cwd}))


def git(cwd, *args):
    subprocess.run(["git", "-C", cwd, *args], check=True, capture_output=True)


with tempfile.TemporaryDirectory() as root:
    repo = os.path.join(root, "repo")
    os.makedirs(os.path.join(repo, "specx"))
    with open(os.path.join(repo, "specx", "RULES.md"), "w", encoding="utf-8") as rules:
        rules.write("rules\n")
    git(repo, "init", "-q")
    git(repo, "add", ".")
    git(repo, "-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "x")

    tree = os.path.join(root, "task")
    git(repo, "worktree", "add", "-q", tree, "-b", "specx/T1")
    git_dir = subprocess.run(
        ["git", "-C", tree, "rev-parse", "--absolute-git-dir"],
        capture_output=True, text=True, check=True,
    ).stdout.strip()

    assert edit(os.path.join(tree, "src", "a.py")) is None, "no scope file: allowed"

    with open(os.path.join(git_dir, "specx-scope"), "w", encoding="utf-8") as scope:
        scope.write("src/\ndocs/a.md\n")

    assert edit(os.path.join(tree, "src", "new", "a.py")) is None, "inside a folder"
    assert edit(os.path.join(tree, "docs", "a.md")) is None, "exact file"
    assert edit(os.path.join(tree, "srcx", "a.py")) == "deny", "name prefix only"
    assert edit(os.path.join(tree, "specx", "spec.md")) == "deny", "specx is not in scope"
    assert edit(os.path.join(tree, "docs", "b.md")) == "deny", "sibling file"
    assert edit(os.path.join(repo, "other.py")) is None, "main checkout has no scope"

    for command in (
        "gh pr merge 3 --merge",
        "git push --force origin x",
        "git push -f origin x",
        "git reset --hard HEAD~1",
        "git clean -fd",
        "git stash",
    ):
        assert bash(command, repo) == "ask", command
    assert bash("git push origin specx/T1", repo) is None, "ordinary push"
    assert bash("git status", repo) is None, "ordinary command"
    assert bash("gh pr merge 3 --merge", root) is None, "not a SpecX project"

assert run("not json") is None, "bad input does not block work"
print("guard ok")
