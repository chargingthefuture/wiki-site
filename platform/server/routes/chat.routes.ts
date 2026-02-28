import { Express } from 'express';
import { asyncHandler } from '../errorHandler';
import { isAuthenticated, getUserId } from '../auth';
import { storage } from '../storage';
import { insertChatMessageSchema } from '@shared/schema';
import type { User } from '@shared/schema';
import * as Sentry from '@sentry/node';
import { withDatabaseErrorHandling } from '../databaseErrorHandler';

export function registerChatRoutes(app: Express) {
  /**
   * POST /api/chat/messages
   * Add a new message to the community support channel
   * Requires: authenticated user
   */
  app.post('/api/chat/messages', isAuthenticated, asyncHandler(async (req, res) => {
    try {
      const { text } = req.body;

      // Get user ID from auth
      const userId = getUserId(req);

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Message text is required' });
      }

      // Fetch full user data from database to get firstName and lastName
      const user = await withDatabaseErrorHandling(
        () => storage.getUser(userId),
        'getUserForChat'
      ) as User | undefined;

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const messageData = {
        channelId: 'community-support',
        userId,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        userImage: user.profileImageUrl || undefined,
        text: text.trim(),
      };

      // Validate with schema
      const validated = insertChatMessageSchema.parse(messageData);
      const message = await storage.createChatMessage(validated);

      res.status(201).json(message);
    } catch (error: any) {
      Sentry.captureException(error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  }));

  /**
   * GET /api/chat/messages
   * Get recent messages from the community support channel
   * Query params: limit (default 50)
   */
  app.get('/api/chat/messages', isAuthenticated, asyncHandler(async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const messages = await storage.getCommunityMessages(limit);
      
      // Return newest first (MessageList will reverse or sort as needed)
      res.json(messages.reverse());
    } catch (error: any) {
      Sentry.captureException(error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }));
}
