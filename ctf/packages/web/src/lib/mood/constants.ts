export const MOOD_ERROR_CODE = {
  invalidPayload: 'mood_invalid_payload',
  cooldownActive: 'mood_cooldown_active',
  csrfDenied: 'mood_csrf_denied',
  persistenceUnavailable: 'mood_persistence_unavailable',
} as const;

export const MOOD_COOLDOWN_DAYS = 7;
