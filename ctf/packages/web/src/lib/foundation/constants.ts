export const FOUNDATION_DEFAULT_PAGE = 1;
export const FOUNDATION_DEFAULT_PAGE_SIZE = 20;
export const FOUNDATION_MAX_PAGE_SIZE = 100;

export const FOUNDATION_QUOTE_STATES = ['requested', 'provider_responded', 'closed'] as const;
export const FOUNDATION_CALL_MODALITIES = ['voice', 'video'] as const;

export const FOUNDATION_ERROR_CODE = {
  invalidPayload: 'FOUNDATION_INVALID_PAYLOAD',
  persistenceUnavailable: 'FOUNDATION_PERSISTENCE_UNAVAILABLE',
  csrfDenied: 'FOUNDATION_CSRF_DENIED',
  providerNotFound: 'FOUNDATION_PROVIDER_NOT_FOUND',
  threadNotFound: 'FOUNDATION_THREAD_NOT_FOUND',
  notThreadParticipant: 'FOUNDATION_NOT_THREAD_PARTICIPANT',
  invalidQuoteTransition: 'FOUNDATION_INVALID_QUOTE_TRANSITION',
  quoteNotFound: 'FOUNDATION_QUOTE_NOT_FOUND',
  notificationNotFound: 'FOUNDATION_NOTIFICATION_NOT_FOUND',
  rateLimitExceeded: 'FOUNDATION_RATE_LIMIT_EXCEEDED',
  streamUnavailable: 'FOUNDATION_STREAM_UNAVAILABLE',
  policyDenied: 'FOUNDATION_POLICY_DENIED',
} as const;
