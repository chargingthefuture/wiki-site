/**
 * Chat Storage Interface
 * 
 * Defines the contract for chat messaging operations.
 */

import type { InsertChatMessage, ChatMessage } from '@shared/schema';

export interface IChatStorage {
  /**
   * Create a new message in a channel
   */
  createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage>;

  /**
   * Get recent messages from a specific channel
   */
  getChannelMessages(channelId: string, limit?: number): Promise<ChatMessage[]>;

  /**
   * Get recent messages from the community support channel
   */
  getCommunityMessages(limit?: number): Promise<ChatMessage[]>;
}
