export const CHYME_PLUGIN_ID = 'chyme';
export const CHYME_MAIN_ROOM_KEY = 'chyme-main-room';
export const CHYME_MAIN_ROOM_NAME = 'Chyme Main Room';
export const CHYME_MAX_MESSAGE_LENGTH = 1000;
export const CHYME_DEFAULT_MESSAGES_LIMIT = 100;

export const CHYME_ERROR_CODE = {
  invalidPayload: 'CHYME_INVALID_PAYLOAD',
  streamUnavailable: 'CHYME_STREAM_UNAVAILABLE',
  persistenceUnavailable: 'CHYME_PERSISTENCE_UNAVAILABLE',
  internalError: 'CHYME_INTERNAL_ERROR',
} as const;

export type ChymeErrorCode = (typeof CHYME_ERROR_CODE)[keyof typeof CHYME_ERROR_CODE];
