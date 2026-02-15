/**
 * Mood routes
 */

import express, { type Express } from "express";
import { storage } from "../storage";
import { isAuthenticated, isAdmin, isAdminWithCsrf } from "../auth";
import { publicItemLimiter } from "../rateLimiter";
import { asyncHandler } from "../errorHandler";
import { validateWithZod } from "../validationErrorFormatter";
import { withDatabaseErrorHandling } from "../databaseErrorHandler";
import { ValidationError } from "../errors";
import { logInfo } from "../errorLogger";
import { z } from "zod";
import {
  insertMoodCheckSchema,
  insertMoodAnnouncementSchema,
  type MoodCheck,
} from "@shared/schema";

export function registerMoodRoutes(app: Express) {
  // MOOD ROUTES

  // Helper to strip IP and metadata from request for privacy
  const stripIPAndMetadata = (req: any) => {
    // Remove IP, user-agent, and other identifying headers before storage
    delete req.ip;
    delete req.connection?.remoteAddress;
    delete req.socket?.remoteAddress;
    delete req.headers["x-forwarded-for"];
    delete req.headers["x-real-ip"];
  };

  // Mood Check routes (public, anonymous)
  app.post('/api/mood/checks', publicItemLimiter, asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    
    const validatedData = validateWithZod(insertMoodCheckSchema, {
      ...req.body,
      date: new Date().toISOString().split('T')[0], // Today's date
    }, 'Invalid mood check data');
    
    const moodCheck = await withDatabaseErrorHandling(
      () => storage.createMoodCheck(validatedData),
      'createMoodCheck'
    );
    
    // Check for suicide prevention trigger (3+ extremely negative moods in 7 days)
    const recentMoods = await withDatabaseErrorHandling(
      () => storage.getMoodChecksByClientId(validatedData.clientId, 7),
      'getMoodChecksByClientId'
    );
    const moodsArray = Array.isArray(recentMoods) ? recentMoods : [];
    const extremelyNegative = moodsArray.filter((m: any) => m.moodValue === 1).length;
    
    logInfo(`Mood check submitted: client ${validatedData.clientId}, mood ${validatedData.moodValue}`, req);
    
    res.json({
      ...(moodCheck as any),
      showSafetyMessage: extremelyNegative >= 3,
    });
  }));

  // Check if mood check should be shown (once every 7 days)
  app.get('/api/mood/checks/eligible', asyncHandler(async (req, res) => {
    const clientId = req.query.clientId as string;
    if (!clientId) {
      return res.json({ eligible: false });
    }

    const recentMoods = await withDatabaseErrorHandling(
      () => storage.getMoodChecksByClientId(clientId, 7),
      'getMoodChecksByClientId'
    ) as MoodCheck[];
    const lastMood = recentMoods[0];
    
    if (!lastMood) {
      return res.json({ eligible: true });
    }

    const daysSinceLastMood = (Date.now() - new Date(lastMood.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    res.json({ eligible: daysSinceLastMood >= 7 });
  }));

  // Mood Announcement routes (public)
  app.get('/api/mood/announcements', asyncHandler(async (_req, res) => {
    const announcements = await withDatabaseErrorHandling(
      () => storage.getActiveMoodAnnouncements(),
      'getActiveMoodAnnouncements'
    );
    res.json(announcements);
  }));

  // Admin routes for announcements
  app.post('/api/mood/announcements', isAdminWithCsrf, asyncHandler(async (req, res) => {
    const validatedData = validateWithZod(insertMoodAnnouncementSchema, req.body, 'Invalid announcement data');
    const announcement = await withDatabaseErrorHandling(
      () => storage.createMoodAnnouncement(validatedData),
      'createMoodAnnouncement'
    );
    logInfo(`Created mood announcement: ${validatedData.title}`, req);
    res.json(announcement);
  }));

  app.get('/api/mood/announcements/all', isAuthenticated, isAdmin, asyncHandler(async (_req, res) => {
    const announcements = await withDatabaseErrorHandling(
      () => storage.getAllMoodAnnouncements(),
      'getAllMoodAnnouncements'
    );
    res.json(announcements);
  }));

  app.patch('/api/mood/announcements/:id', isAdminWithCsrf, asyncHandler(async (req, res) => {
    const validatedData = validateWithZod(
      insertMoodAnnouncementSchema.partial(),
      req.body,
      'Invalid announcement data'
    );
    const announcement = await withDatabaseErrorHandling(
      () => storage.updateMoodAnnouncement(req.params.id, validatedData),
      'updateMoodAnnouncement'
    );
    logInfo(`Updated mood announcement: ${req.params.id}`, req);
    res.json(announcement);
  }));

  app.delete('/api/mood/announcements/:id', isAdminWithCsrf, asyncHandler(async (req, res) => {
    const announcement = await withDatabaseErrorHandling(
      () => storage.deactivateMoodAnnouncement(req.params.id),
      'deactivateMoodAnnouncement'
    );
    logInfo(`Deactivated mood announcement: ${req.params.id}`, req);
    res.json(announcement);
  }));
}
