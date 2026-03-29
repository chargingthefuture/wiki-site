#!/usr/bin/env bash
set -e

# Install/update Codacy CLI
.codacy/cli.sh --version || bash .codacy/cli.sh

# Install/update GitHub CLI
echo "Checking for GitHub CLI (gh)..."
if ! command -v gh &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y gh
else
  echo "GitHub CLI already installed."
fi

# Install/update Railway CLI
echo "Checking for Railway CLI..."
if ! command -v railway &> /dev/null; then
  npm install -g railway
else
  echo "Railway CLI already installed."
fi

# Install/update Vercel CLI
echo "Checking for Vercel CLI..."
if ! command -v vercel &> /dev/null; then
  npm install -g vercel
else
  echo "Vercel CLI already installed."
fi


# Ensure pnpm is installed
echo "Checking for pnpm..."
if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
else
  echo "pnpm already installed."
fi

# Install system libraries required for Expo/React Native DevTools
echo "Installing system libraries for Expo/React Native DevTools..."
sudo apt-get update && sudo apt-get install -y libatk1.0-0 libgtk-3-0 libnotify4 libgdk-pixbuf2.0-0 libxss1 libasound2 libnss3 libx11-xcb1

# Ensure expo-cli is installed globally (for direct CLI use)
echo "Checking for expo-cli..."
if ! command -v expo &> /dev/null; then
  pnpm add -g expo-cli
else
  echo "expo-cli already installed."
fi

# Install all monorepo dependencies (including expo-cli for mobile)
echo "Installing all pnpm dependencies..."
pnpm install

# Prompt for login if needed
echo "If you need to log in to GitHub, Railway, or Vercel, run:"
echo "  gh auth login"
echo "  railway login"
echo "  vercel login"
