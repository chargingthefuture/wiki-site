/**
 * GentlePulse routes
 */

import express, { type Express } from "express";
import { storage } from "../storage";
import { isAuthenticated, isAdmin, isAdminWithCsrf, getUserId } from "../auth";
import { validateCsrfToken } from "../csrf";
import { publicListingLimiter, publicItemLimiter } from "../rateLimiter";
import { asyncHandler } from "../errorHandler";
import { validateWithZod } from "../validationErrorFormatter";
import { withDatabaseErrorHandling } from "../databaseErrorHandler";
import { NotFoundError, ValidationError } from "../errors";
import { logInfo } from "../errorLogger";
import { logAdminAction } from "./shared";
import { z } from "zod";
import {
  insertGentlepulseMeditationSchema,
  insertGentlepulseRatingSchema,
  insertGentlepulseFavoriteSchema,
  insertGentlepulseAnnouncementSchema,
  type GentlepulseRating,
  type GentlepulseFavorite,
} from "@shared/schema";

export function registerGentlePulseRoutes(app: Express) {
  // GENTLEPULSE ROUTES

  // Helper to strip IP and metadata from request for privacy
  const stripIPAndMetadata = (req: any) => {
    // Remove IP, user-agent, and other identifying headers before storage
    delete req.ip;
    delete req.connection?.remoteAddress;
    delete req.socket?.remoteAddress;
    delete req.headers["x-forwarded-for"];
    delete req.headers["x-real-ip"];
  };

  // GentlePulse Announcement routes (public)
  app.get('/api/gentlepulse/announcements', asyncHandler(async (_req, res) => {
    const announcements = await withDatabaseErrorHandling(
      () => storage.getActiveGentlepulseAnnouncements(),
      'getActiveGentlepulseAnnouncements'
    );
    res.json(announcements);
  }));

  // GentlePulse Meditation routes (public)
  app.get('/api/gentlepulse/meditations', publicListingLimiter, asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    
    const filters: any = {};
    if (req.query.tag) filters.tag = req.query.tag as string;
    if (req.query.sortBy) filters.sortBy = req.query.sortBy as string;
    filters.limit = parseInt(req.query.limit as string || "50");
    filters.offset = parseInt(req.query.offset as string || "0");
    
    const result = await withDatabaseErrorHandling(
      () => storage.getGentlepulseMeditations(filters),
      'getGentlepulseMeditations'
    );
    res.json(result);
  }));

  app.get('/api/gentlepulse/meditations/:id', asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    const meditation = await withDatabaseErrorHandling(
      () => storage.getGentlepulseMeditationById(req.params.id),
      'getGentlepulseMeditationById'
    );
    if (!meditation) {
      throw new NotFoundError('Meditation', req.params.id);
    }
    res.json(meditation);
  }));

  // Track meditation play (increment play count)
  app.post('/api/gentlepulse/meditations/:id/play', asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    await withDatabaseErrorHandling(
      () => storage.incrementGentlepulsePlayCount(req.params.id),
      'incrementGentlepulsePlayCount'
    );
    res.json({ message: "Play count updated" });
  }));

  // GentlePulse Rating routes (public, anonymous)
  app.post('/api/gentlepulse/ratings', publicItemLimiter, asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    
    const validatedData = validateWithZod(insertGentlepulseRatingSchema, req.body, 'Invalid rating data');
    const rating = await withDatabaseErrorHandling(
      () => storage.createOrUpdateGentlepulseRating(validatedData),
      'createOrUpdateGentlepulseRating'
    );
    
    logInfo(`GentlePulse rating submitted: meditation ${validatedData.meditationId}, rating ${validatedData.rating}`, req);
    
    res.json(rating);
  }));

  app.get('/api/gentlepulse/meditations/:id/ratings', asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    const ratings = await withDatabaseErrorHandling(
      () => storage.getGentlepulseRatingsByMeditationId(req.params.id),
      'getGentlepulseRatingsByMeditationId'
    );
    // Return only aggregated data, not individual ratings
    const ratingsArray = Array.isArray(ratings) ? ratings : [];
    const average = ratingsArray.length > 0 
      ? ratingsArray.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / ratingsArray.length 
      : 0;
    res.json({ average: Number(average.toFixed(2)), count: (ratings as GentlepulseRating[]).length });
  }));

  // GentlePulse Favorites routes (public, anonymous)
  app.post('/api/gentlepulse/favorites', asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    const validatedData = validateWithZod(insertGentlepulseFavoriteSchema, req.body, 'Invalid favorite data');
    const favorite = await withDatabaseErrorHandling(
      () => storage.createGentlepulseFavorite(validatedData),
      'createGentlepulseFavorite'
    );
    res.json(favorite);
  }));

  app.delete('/api/gentlepulse/favorites/:meditationId', asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    const clientId = req.query.clientId as string;
    if (!clientId) {
      throw new ValidationError("clientId required");
    }
    await withDatabaseErrorHandling(
      () => storage.deleteGentlepulseFavorite(clientId, req.params.meditationId),
      'deleteGentlepulseFavorite'
    );
    res.json({ message: "Favorite removed" });
  }));

  app.get('/api/gentlepulse/favorites', asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    const clientId = req.query.clientId as string;
    if (!clientId) {
      throw new ValidationError("clientId query parameter is required");
    }
    const favorites = await withDatabaseErrorHandling(
      () => storage.getGentlepulseFavoritesByClientId(clientId),
      'getGentlepulseFavoritesByClientId'
    ) as GentlepulseFavorite[];
    res.json((favorites as GentlepulseFavorite[]).map(f => f.meditationId));
  }));

  app.get('/api/gentlepulse/favorites/check', asyncHandler(async (req, res) => {
    stripIPAndMetadata(req);
    const clientId = req.query.clientId as string;
    const meditationId = req.query.meditationId as string;
    if (!clientId || !meditationId) {
      return res.json({ isFavorite: false });
    }
    const isFavorite = await withDatabaseErrorHandling(
      () => storage.isGentlepulseFavorite(clientId, meditationId),
      'isGentlepulseFavorite'
    );
    res.json({ isFavorite });
  }));


}
