export interface StreamClientOptions {
  apiKey: string;
  userId: string;
  token: string;
}

export interface StreamUsageBudget {
  monthlyChatMauLimit: number;
  monthlyFeedCallLimit: number;
  monthlyVideoMinutesLimit: number;
  monthlyAiModerationCreditsLimitUsd: number;
}

export const defaultMakerTierBudget: StreamUsageBudget = {
  monthlyChatMauLimit: 2000,
  monthlyFeedCallLimit: 125000,
  monthlyVideoMinutesLimit: 333000,
  monthlyAiModerationCreditsLimitUsd: 100,
};

export const createStreamClient = (options: StreamClientOptions) => {
  return {
    options,
    budget: defaultMakerTierBudget,
  };
};
