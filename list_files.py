#!/usr/bin/env python3
"""
Recursively lists every file under ./src and ./packages (relative to the
current working directory), printing each path exactly as it would appear
from the project root, e.g.:

    /src/app/page.tsx
    /packages/ui/Button.tsx

Read-only: does not create, modify, move, or delete anything.
Run this script from the parent folder that contains both `src` and
`packages`.
"""

import os
from pathlib import Path

TARGET_DIRS = ["src", "packages"]


def list_files(base_dir: str) -> list[str]:
    """Return a sorted list of file paths (relative to cwd, with a leading
    slash) for every file under base_dir."""
    results = []
    root_path = Path(base_dir)

    if not root_path.is_dir():
        return results

    for dirpath, _dirnames, filenames in os.walk(root_path):
        for filename in filenames:
            full_path = Path(dirpath) / filename
            # Normalize to forward slashes and prefix with "/"
            rel_path = "/" + full_path.as_posix()
            results.append(rel_path)

    return results


def main():
    all_files = []
    for target in TARGET_DIRS:
        if not Path(target).is_dir():
            print(f"Note: '{target}' directory not found in current path, skipping.")
            continue
        all_files.extend(list_files(target))

    all_files.sort()

    for f in all_files:
        print(f)

    print(f"\nTotal files found: {len(all_files)}")


if __name__ == "__main__":
    main()
