#!/usr/bin/env bash
# Runs the guard with python3, else python (common on Windows); silent if neither works.
guard="${0%/*}/guard.py"
python3 "$guard" 2>/dev/null || python "$guard" 2>/dev/null || true
