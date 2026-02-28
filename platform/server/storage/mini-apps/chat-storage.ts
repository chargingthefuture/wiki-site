/**
 * Chat Messages Storage Module
 * 
 * Handles all chat messaging operations for the community support channel.
 */

import { chatMessages } from "@shared/schema";
import { db } from "../../db";
import { desc, eq } from "drizzle-orm";
import type { InsertChatMessage, ChatMessage } from "@shared/schema";

export class ChatStorage {
  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }

  async getChannelMessages(channelId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.channelId, channelId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async getCommunityMessages(limit: number = 50): Promise<ChatMessage[]> {
    return await this.getChannelMessages('community-support', limit);
  }
}
