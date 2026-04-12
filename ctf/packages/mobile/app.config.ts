import type { ConfigContext, ExpoConfig } from 'expo/config';

function firstDefined(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => typeof value === 'string' && value.length > 0);
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const projectId = firstDefined(
    process.env.EXPO_MOBILE_PROJECT_ID,
    process.env.MOBILE_PROJECT_ID,
  );
  const updatesUrl = firstDefined(
    process.env.EXPO_MOBILE_UPDATES_URL,
    process.env.MOBILE_UPDATES_URL,
  );

  return {
    ...config,
    name: 'ChargingTheFuture',
    slug: 'charging-the-future',
    version: '0.1.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.chargingthefuture.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.chargingthefuture.app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    updates: {
      ...(updatesUrl ? { url: updatesUrl } : {}),
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      ...(config.extra ?? {}),
      mobileAppUrl: process.env.MOBILE_APP_URL,
      chymeRequestIdentity: {
        userId: process.env.MOBILE_CTF_USER_ID,
        username: process.env.MOBILE_CTF_USERNAME,
        role: process.env.MOBILE_CTF_USER_ROLE || 'member',
        isApproved: process.env.MOBILE_CTF_USER_APPROVED || 'approved',
      },
      mobileAuthPublishableKeyStaging:
        process.env.MOBILE_AUTH_PUBLISHABLE_KEY_STAGING
        || process.env.MOBILE_CLERK_PUBLISHABLE_KEY_STAGING,
      mobileAuthPublishableKeyProduction:
        process.env.MOBILE_AUTH_PUBLISHABLE_KEY_PRODUCTION
        || process.env.MOBILE_CLERK_PUBLISHABLE_KEY_PRODUCTION,
      mobileObservabilityProvider:
        process.env.MOBILE_OBSERVABILITY_PROVIDER
        || process.env.OBSERVABILITY_PROVIDER
        || 'noop',
      mobileSentryDsn: process.env.MOBILE_SENTRY_DSN || process.env.EXPO_SENTRY_DSN,
      eas: {
        ...(config.extra?.eas ?? {}),
        ...(projectId ? { projectId } : {}),
      },
    },
    owner: process.env.EXPO_OWNER || undefined,
  };
};
