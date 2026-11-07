#!/usr/bin/env python3
"""Self-check for guard.py, using a real git repository and worktree."""
import json
import os
import shutil
import subprocess
import sys
import tempfile

HOOKS = os.path.dirname(os.path.abspath(__file__))
GUARD = os.path.join(HOOKS, "guard.py")
BASH = shutil.which("bash")


def script(name, cwd, path, payload=""):
    """Run a hook script the way hooks.json does, with a chosen PATH."""
    done = subprocess.run(
        [BASH, os.path.join(HOOKS, name)], input=payload, capture_output=True,
        text=True, cwd=cwd, env={"PATH": path}, check=False,
    )
    assert done.returncode == 0, (name, done.stderr)
    return done.stdout


def run(payload):
    done = subprocess.run(
        [sys.executable, GUARD], input=payload, capture_output=True, text=True, check=True,
        cwd=os.sep,  # the guard falls back to its own cwd; keep it outside any scoped worktree
    )
    if not done.stdout:
        return None
    return json.loads(done.stdout)["hookSpecificOutput"]["permissionDecision"]


def edit(path, cwd=None):
    return run(json.dumps({"tool_name": "Edit", "tool_input": {"file_path": path}, "cwd": cwd}))


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
    assert edit(os.path.join(repo, "other.py"), tree) == "deny", "leaving the worktree"
    assert edit("/tmp/specx-guard-outside", tree) == "deny", "outside any repository"
    assert edit("src/a.py", tree) is None, "relative path inside scope"
    assert edit(os.path.join(git_dir, "specx-scope"), tree) == "deny", "own scope file"

    for command in (
        "gh pr merge 3 --merge",
        "git push --force origin x",
        "git push -f origin x",
        "git reset --hard HEAD~1",
        "git clean -fd",
        "git stash",
        "git -C /x push --force",
        "git -C /x reset --hard",
        "git -c a=b push -f origin x",
        "git push -fu origin x",
        "git push -uf origin x",
        "git push origin +x",
        "git reset -q --hard",
        "git push origin x \\\n  --force",
        "gh -R a/b pr merge 3",
        "gh api -X PUT repos/a/b/pulls/3/merge",
        "git push origin --delete x",
        "git push origin :x",
        "git push -u origin main",
        "git push origin HEAD:master",
        "git rebase main",
        "git -C /x filter-branch",
        "git commit --amend",
        "git checkout -- .",
        "git restore .",
        "git push origin HEAD:refs/heads/main",
        "git push origin x:refs/heads/master",
        "git push --mirror origin",
        "git pull --rebase",
        "git checkout .",
        "git checkout HEAD .",
        "git checkout -f main",
        "git switch --discard-changes main",
        "git restore --source=x --staged --worktree f",
    ):
        assert bash(command, repo) == "ask", command
    assert bash("git push origin specx/T1", repo) is None, "ordinary push"
    assert bash("git status", repo) is None, "ordinary command"
    for command in (
        "git stash list",
        "git stash show",
        "git clean -n",
        "git push -u origin x",
        "git push origin specx/delivery-main-page",
        "git checkout specx/T1",
        "git restore --staged a",
        "git branch -D specx/T1",
        "git worktree remove --force ../t",
        "git commit -m amend",
        "git switch --no-track -c specx/delivery-M1",
        "git pull --ff-only",
        "git branch -d specx/delivery-M1",
        "git merge --no-ff origin/main",
        "git merge --abort",
        "git push -u origin specx/delivery-M1",
        "gh pr create --base main --head specx/delivery-M1",
        "git checkout specx/main-x",
    ):
        assert bash(command, repo) is None, command
    assert bash("gh pr merge 3 --merge", root) is None, "not a SpecX project"

    # Python fallback and warning (ROOT-R25).
    only_python = os.path.join(root, "only-python")
    os.makedirs(only_python)
    os.symlink(sys.executable, os.path.join(only_python, "python"))
    os.symlink(shutil.which("git"), os.path.join(only_python, "git"))
    payload = json.dumps({"tool_name": "Edit", "tool_input": {"file_path": "docs/b.md"}, "cwd": tree})
    assert "deny" in script("run-guard.sh", tree, only_python, payload), "falls back to python"
    assert script("run-guard.sh", tree, "/nonexistent", payload) == "", "no python: silent"
    assert script("run-guard.sh", tree, os.environ["PATH"], payload), "python3 still used"
    assert "guard hook is off" in script("check-python.sh", repo, "/nonexistent"), "warns"
    assert script("check-python.sh", repo, only_python) == "", "python is enough"
    assert script("check-python.sh", root, "/nonexistent") == "", "not a SpecX project"

assert run("not json") is None, "bad input does not block work"
assert run("[1]") is None, "wrong shape does not block work"
print("guard ok")
