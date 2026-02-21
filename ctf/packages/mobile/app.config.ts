import type { ExpoConfig } from "expo/config";

const appName = "TI Skills Economy";
const appSlug = "ti-skills-economy";

const config: ExpoConfig = {
  name: appName,
  slug: appSlug,
  version: "0.1.0",
  scheme: "tiskillseconomy",
  orientation: "portrait",
  platforms: ["android"],
  updates: {
    url: process.env.EXPO_MOBILE_UPDATES_URL,
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  android: {
    package: "org.chargingthefuture.tiskillseconomy",
  },
  extra: {
    eas: {
      projectId: process.env.EXPO_MOBILE_PROJECT_ID,
    },
  },
};

export default config;
