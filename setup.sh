#!/bin/bash
# Run this on any new machine after cloning to wire ~/.claude into the repo.
set -e

REPO="$(cd "$(dirname "$0")" && pwd)"

mkdir -p ~/.claude

symlink() {
  local src="$REPO/$1" dst="$HOME/.claude/$1"
  if [ -e "$dst" ] && [ ! -L "$dst" ]; then
    echo "Backing up existing $dst -> ${dst}.bak"
    mv "$dst" "${dst}.bak"
  fi
  ln -sfn "$src" "$dst"
  echo "Linked $dst -> $src"
}

symlink settings.json
symlink commands
symlink agents

echo "Done."
