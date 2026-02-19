export interface RealtimeStatus {
  connected: boolean;
  latencyMs?: number;
}

export const getRealtimeStatus = (connected: boolean, latencyMs?: number): RealtimeStatus => {
  return {
    connected,
    latencyMs,
  };
};
