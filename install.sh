#!/usr/bin/env bash
set -euo pipefail

PACKAGE="@abhisahani/forge-stack"
INSTALL_TARGET="${PACKAGE}@latest"

reset="\033[0m"
bold="\033[1m"
cyan="\033[36m"
green="\033[32m"
yellow="\033[33m"
red="\033[31m"

log() {
  printf "%b%s%b\n" "${cyan}${bold}" "$1" "${reset}"
}

ok() {
  printf "%b%s%b\n" "${green}${bold}" "$1" "${reset}"
}

warn() {
  printf "%b%s%b\n" "${yellow}${bold}" "$1" "${reset}"
}

fail() {
  printf "%b%s%b\n" "${red}${bold}" "$1" "${reset}" >&2
}

if ! command -v npm >/dev/null 2>&1; then
  fail "npm is required but was not found on PATH."
  exit 1
fi

printf "%b\n" "${bold}Forge Stack installer${reset}"
log "Package: ${PACKAGE}"
log "Channel: latest"
warn "This will install the newest published version from npm."

if npm install -g "$INSTALL_TARGET"; then
  ok "Forge Stack installed successfully."
  printf "%b\n" "Run: forge-stack create"
else
  fail "Installation failed."
  exit 1
fi
