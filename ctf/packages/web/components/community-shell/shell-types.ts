export type ShellSection = 'chat' | 'apps';

export type PluginSortMode = 'recent' | 'alpha' | 'most-used';

export type ShellStats = {
  memberCount: number | null;
  gdpValueUsd: number | null;
};

export type ShellCurrentUser = {
  userId: string;
  username: string | null;
  displayName: string;
  initial: string;
};

export type ChatMessage = {
  id: string;
  from: 'hub' | 'user';
  text: string;
  time: string;
  senderLabel?: string;
  actionLabel?: string;
  actionSlug?: string;
};
