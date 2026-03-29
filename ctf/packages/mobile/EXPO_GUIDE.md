# Expo Mobile Development Guide

## Setup Complete ✅

The mobile app is now configured for Expo development with **both QR code scanning and account linking**.

## How to Use

### Option 1: QR Code Scanning (Works Immediately)
1. Run `pnpm start` or `npx expo start` in `/ctf/packages/mobile`
2. Open **Expo Go** app on your phone
3. Scan the QR code shown in the terminal
4. App loads on your device

### Option 2: Account Linking (Auto-Discovery)
1. **Login to Expo** (one-time):
   ```bash
   cd /workspaces/chargingthefuture/ctf/packages/mobile
   npx expo login
   ```
   Enter your Expo account credentials

2. **Link this project** to your account:
   ```bash
   npx expo start
   ```
   When prompted, select "Yes" to create/link the project to your account

3. **Future runs**: After linking, the project will automatically appear in your Expo Go app under "Development servers" when you run `npx expo start`

### Both Methods Work!
- **QR Code**: Always available, works without account
- **Auto-discovery**: After linking, project appears automatically in Expo Go when dev server is running

## Commands

```bash
pnpm start          # Start Expo dev server
pnpm run android    # Start and open on Android emulator (if available)
pnpm run ios        # Start and open on iOS simulator (if available)
pnpm run web        # Start and open in web browser
```

## Expo Go App
Install from:
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## Current Status
- ✅ Expo SDK 55 installed
- ✅ React Native configured
- ✅ Basic app component created
- ✅ Both QR and account-linking methods available
- ⏳ Awaiting Expo account login (run `npx expo login`)
