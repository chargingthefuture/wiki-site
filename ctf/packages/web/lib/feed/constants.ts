export const FEED_PLUGIN_ID = 'feed';
export const ANNOUNCEMENTS_PLUGIN_ID = 'announcements';

export const FEED_ERROR_CODE = {
  invalidPayload: 'FEED_INVALID_PAYLOAD',
  notFound: 'FEED_NOT_FOUND',
  conflict: 'FEED_CONFLICT',
  persistenceUnavailable: 'FEED_PERSISTENCE_UNAVAILABLE',
  csrfDenied: 'FEED_CSRF_DENIED',
  dismissNotAllowed: 'FEED_DISMISS_NOT_ALLOWED',
} as const;

export const FEED_DEFAULT_PAGE = 1;
export const FEED_DEFAULT_PAGE_SIZE = 20;
export const FEED_MAX_PAGE_SIZE = 100;

export const FEED_MAX_TITLE_LENGTH = 160;
export const FEED_MAX_BODY_LENGTH = 4000;
