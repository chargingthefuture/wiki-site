// Chyme API client with a network fallback to an in-memory mock for Android parity
// Uses MOBILE_APP_URL if provided; otherwise provides a usable mock implementation

type Message = { id: string; text: string; sender?: string; createdAt: string };

declare const process: any;

const MOBILE_BASE = process?.env?.MOBILE_APP_URL || '';

// In-memory mock state used when no backend URL is configured
const mockState = {
  room: { id: 'room-1', title: 'Mock Chyme Room' },
  participants: [
    { id: '1', username: 'alice', role: 'speaker' },
    { id: '2', username: 'bob', role: 'listener' },
  ],
  messages: [
    { id: 'm1', text: 'Welcome to Chyme (mock)', sender: 'system', createdAt: new Date().toISOString() },
  ] as Message[],
};

function delay<T>(value: T, ms = 200) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
}

async function fetchOrMock<T>(path: string, options?: RequestInit, mockFactory?: () => T): Promise<T> {
  if (MOBILE_BASE) {
    const url = `${MOBILE_BASE}${path}`;
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Network request failed: ${res.status}`);
    return res.json();
  }
  // fallback to mock
  return delay(mockFactory ? mockFactory() : ({} as T), 250);
}

export async function getChymeRoom(token?: string) {
  return fetchOrMock('/api/chyme/room', { headers: token ? { Authorization: `Bearer ${token}` } : {} }, () => ({ ...mockState.room, participants: mockState.participants }));
}

export async function getChymeMessages(token?: string) {
  return fetchOrMock('/api/chyme/messages', { headers: token ? { Authorization: `Bearer ${token}` } : {} }, () => ({ messages: mockState.messages }));
}

export async function postChymeMessage(token: string | undefined, text: string) {
  return fetchOrMock('/api/chyme/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ text }),
  }, () => {
    const msg: Message = { id: `m${Date.now()}`, text, sender: 'me', createdAt: new Date().toISOString() };
    mockState.messages.push(msg);
    return msg;
  });
}

export async function postChymeJoin(token?: string) {
  return fetchOrMock('/api/chyme/join', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {} }, () => ({ success: true, room: mockState.room }));
}

export async function deleteChymeProfile(token?: string) {
  return fetchOrMock('/api/account/chyme-profile', { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }, () => ({ success: true }));
}

export async function deleteFullAccount(token?: string) {
  return fetchOrMock('/api/account/full-account', { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }, () => ({ success: true }));
}
