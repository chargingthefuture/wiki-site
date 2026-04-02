export type ShellSection = 'chat' | 'apps';

export type PluginSortMode = 'recent' | 'alpha' | 'most-used';

export type ShellStats = {
  memberCount: number | null;
  gdpValueUsd: number | null;
};

export type ChatMessage = {
  id: number;
  from: 'hub' | 'user';
  text: string;
  time: string;
  actionLabel?: string;
  actionSlug?: string;
};
