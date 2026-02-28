/**
 * WorkforceRecruiter routes
 */

import express, { type Express } from "express";
import { storage } from "../storage";
import { isAuthenticated, isAdmin, isAdminWithCsrf, getUserId } from "../auth";
import { validateCsrfToken } from "../csrf";
import { publicListingLimiter, publicItemLimiter } from "../rateLimiter";
import { asyncHandler } from "../errorHandler";
import { validateWithZod } from "../validationErrorFormatter";
import { withDatabaseErrorHandling } from "../databaseErrorHandler";
import { NotFoundError } from "../errors";
import { logAdminAction } from "./shared";
import { z } from "zod";
import {
  insertWorkforceRecruiterProfileSchema,
    insertWorkforceRecruiterConfigSchema,
    insertWorkforceRecruiterOccupationSchema,
    insertWorkforceRecruiterAnnouncementSchema,
    type WorkforceRecruiterProfile,
    type WorkforceRecruiterOccupation,
    type WorkforceRecruiterAnnouncement,
    type User,
} from "@shared/schema";

export function registerWorkforceRecruiterRoutes(app: Express) {
  // WORKFORCE RECRUITER TRACKER ROUTES

  // Workforce Recruiter Tracker Announcement routes (public)
  app.get('/api/workforce-recruiter/announcements', isAuthenticated, asyncHandler(async (req, res) => {
    const announcements = await withDatabaseErrorHandling(
      () => storage.getActiveWorkforceRecruiterAnnouncements(),
      'getActiveWorkforceRecruiterAnnouncements'
    );
    res.json(announcements);
  }));

  // Workforce Recruiter Tracker Profile routes
  app.get('/api/workforce-recruiter/profile', isAuthenticated, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const profile = await withDatabaseErrorHandling(
      () => storage.getWorkforceRecruiterProfile(userId),
      'getWorkforceRecruiterProfile'
    );
    if (!profile) {
      return res.json(null);
    }
    // Get user data to return firstName
    const user = await withDatabaseErrorHandling(
      () => storage.getUser(userId),
      'getUserVerificationForWorkforceRecruiterProfile'
    ) as User | undefined;
    const userIsVerified = user?.isVerified || false;
    const userFirstName = user?.firstName || null;
    res.json({ ...profile, userIsVerified, firstName: userFirstName });
  }));

  app.post('/api/workforce-recruiter/profile', isAuthenticated, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const validatedData = validateWithZod(insertWorkforceRecruiterProfileSchema, req.body, 'Invalid profile data');
    
    const profile = await withDatabaseErrorHandling(
      () => storage.createWorkforceRecruiterProfile({
        ...validatedData,
        userId,
      }),
      'createWorkforceRecruiterProfile'
    );
    res.json(profile);
  }));

  app.put('/api/workforce-recruiter/profile', isAuthenticated, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const profile = await withDatabaseErrorHandling(
      () => storage.updateWorkforceRecruiterProfile(userId, req.body),
      'updateWorkforceRecruiterProfile'
    );
    res.json(profile);
  }));

  app.delete('/api/workforce-recruiter/profile', isAuthenticated, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const { reason } = req.body;
    await withDatabaseErrorHandling(
      () => storage.deleteWorkforceRecruiterProfile(userId, reason),
      'deleteWorkforceRecruiterProfile'
    );
    res.json({ message: "Workforce Recruiter Tracker profile deleted successfully" });
  }));

  // Workforce Recruiter Tracker Config routes
  app.get('/api/workforce-recruiter/config', isAuthenticated, asyncHandler(async (req, res) => {
    const config = await withDatabaseErrorHandling(
      () => storage.getWorkforceRecruiterConfig(),
      'getWorkforceRecruiterConfig'
    );
    res.json(config);
  }));

  app.put('/api/workforce-recruiter/config', isAuthenticated, isAdmin, asyncHandler(async (req: any, res) => {
    const validatedData = validateWithZod(insertWorkforceRecruiterConfigSchema.partial(), req.body, 'Invalid config data');
    const config = await withDatabaseErrorHandling(
      () => storage.updateWorkforceRecruiterConfig(validatedData),
      'updateWorkforceRecruiterConfig'
    );
    res.json(config);
  }));

  // Workforce Recruiter Tracker Occupation routes
  app.get('/api/workforce-recruiter/occupations', isAuthenticated, asyncHandler(async (req: any, res) => {
    const sector = req.query.sector as string | undefined;
    const skillLevel = req.query.skillLevel as 'Foundational' | 'Intermediate' | 'Advanced' | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

    const filters: any = {};
    if (sector) filters.sector = sector;
    if (skillLevel) filters.skillLevel = skillLevel;
    filters.limit = limit;
    filters.offset = offset;

    const result = await withDatabaseErrorHandling(
      () => storage.getAllWorkforceRecruiterOccupations(filters),
      'getAllWorkforceRecruiterOccupations'
    );
    res.json(result);
  }));

  app.get('/api/workforce-recruiter/occupations/:id', isAuthenticated, asyncHandler(async (req: any, res) => {
    const occupation = await withDatabaseErrorHandling(
      () => storage.getWorkforceRecruiterOccupation(req.params.id),
      'getWorkforceRecruiterOccupation'
    );
    if (!occupation) {
      throw new NotFoundError("Occupation not found");
    }
    res.json(occupation);
  }));

  app.post('/api/workforce-recruiter/occupations', isAuthenticated, isAdmin, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const validatedData = validateWithZod(insertWorkforceRecruiterOccupationSchema, req.body, 'Invalid occupation data');
    const occupation = await withDatabaseErrorHandling(
      () => storage.createWorkforceRecruiterOccupation(validatedData),
      'createWorkforceRecruiterOccupation'
    ) as WorkforceRecruiterOccupation;
    
    await logAdminAction(
      userId,
      "create_workforce_recruiter_occupation",
      "occupation",
      occupation.id,
      { title: occupation.occupationTitle, sector: occupation.sector }
    );

    res.json(occupation);
  }));

  app.put('/api/workforce-recruiter/occupations/:id', isAuthenticated, isAdmin, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const validatedData = validateWithZod(insertWorkforceRecruiterOccupationSchema.partial(), req.body, 'Invalid occupation data');
    const occupation = await withDatabaseErrorHandling(
      () => storage.updateWorkforceRecruiterOccupation(req.params.id, validatedData),
      'updateWorkforceRecruiterOccupation'
    ) as WorkforceRecruiterOccupation;
    
    await logAdminAction(
      userId,
      "update_workforce_recruiter_occupation",
      "occupation",
      occupation.id,
      { title: occupation.occupationTitle }
    );

    res.json(occupation);
  }));

  app.delete('/api/workforce-recruiter/occupations/:id', isAuthenticated, isAdmin, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    await withDatabaseErrorHandling(
      () => storage.deleteWorkforceRecruiterOccupation(req.params.id),
      'deleteWorkforceRecruiterOccupation'
    );
    
    await logAdminAction(
      userId,
      "delete_workforce_recruiter_occupation",
      "occupation",
      req.params.id,
      {}
    );

    res.json({ message: "Occupation deleted successfully" });
  }));

  // Workforce Recruiter Tracker Reports routes
  app.get('/api/workforce-recruiter/reports/summary', isAuthenticated, asyncHandler(async (req, res) => {
    const report = await withDatabaseErrorHandling(
      () => storage.getWorkforceRecruiterSummaryReport(),
      'getWorkforceRecruiterSummaryReport'
    );
    res.json(report);
  }));

  app.get('/api/workforce-recruiter/reports/skill-level/:skillLevel', isAuthenticated, asyncHandler(async (req, res) => {
    const { skillLevel } = req.params;
    const detail = await withDatabaseErrorHandling(
      () => storage.getWorkforceRecruiterSkillLevelDetail(skillLevel),
      'getWorkforceRecruiterSkillLevelDetail'
    );
    res.json(detail);
  }));

  // Workforce Recruiter Tracker Export route
  app.get('/api/workforce-recruiter/export', isAuthenticated, asyncHandler(async (req: any, res) => {
    const format = (req.query.format as string) || 'csv';
    
    const [report, occupationsResult] = await Promise.all([
      withDatabaseErrorHandling(
        () => storage.getWorkforceRecruiterSummaryReport(),
        'getWorkforceRecruiterSummaryReport'
      ),
      withDatabaseErrorHandling(
        () => storage.getAllWorkforceRecruiterOccupations({ limit: 10000, offset: 0 }),
        'getAllWorkforceRecruiterOccupations'
      ),
    ]) as [any, { occupations: WorkforceRecruiterOccupation[]; total: number }];

    const occupations = occupationsResult.occupations;

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="workforce-recruiter-export-${new Date().toISOString().split('T')[0]}.json"`);
      res.json({
        summary: report,
        occupations,
        exportedAt: new Date().toISOString(),
      });
    } else {
      // CSV export
      const csvRows: string[] = [];
      
      // Summary section
      csvRows.push('Summary');
      csvRows.push(`Total Workforce Target,${report.totalWorkforceTarget}`);
      csvRows.push(`Total Current Recruited,${report.totalCurrentRecruited}`);
      csvRows.push(`Percent Recruited,${report.percentRecruited.toFixed(2)}%`);
      csvRows.push('');
      
      // Sector breakdown
      csvRows.push('Sector Breakdown');
      csvRows.push('Sector,Target,Recruited,Percent');
      report.sectorBreakdown.forEach((sector: { sector: string; target: number; recruited: number; percent: number }) => {
        csvRows.push(`${sector.sector},${sector.target},${sector.recruited},${sector.percent.toFixed(2)}%`);
      });
      csvRows.push('');
      
      // Skill level breakdown
      csvRows.push('Skill Level Breakdown');
      csvRows.push('Skill Level,Target,Recruited,Percent');
      report.skillLevelBreakdown.forEach((skill: { skillLevel: string; target: number; recruited: number; percent: number }) => {
        csvRows.push(`${skill.skillLevel},${skill.target},${skill.recruited},${skill.percent.toFixed(2)}%`);
      });
      csvRows.push('');
      
      // Occupations
      csvRows.push('Occupations');
      csvRows.push('Sector,Occupation Title,Headcount Target,Skill Level,Annual Training Target,Notes');
      occupations.forEach(occ => {
        const notes = (occ.notes || '').replace(/,/g, ';').replace(/\n/g, ' ');
        csvRows.push(`${occ.sector},${occ.occupationTitle},${occ.headcountTarget},${occ.skillLevel},${occ.annualTrainingTarget},"${notes}"`);
      });
      
      const csv = csvRows.join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="workforce-recruiter-export-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    }
  }));

  // Workforce Recruiter Tracker Admin Announcement routes
  app.get('/api/workforce-recruiter/admin/announcements', isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const announcements = await withDatabaseErrorHandling(
      () => storage.getAllWorkforceRecruiterAnnouncements(),
      'getAllWorkforceRecruiterAnnouncements'
    );
    res.json(announcements);
  }));

  app.post('/api/workforce-recruiter/admin/announcements', isAuthenticated, ...isAdminWithCsrf, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const validatedData = validateWithZod(insertWorkforceRecruiterAnnouncementSchema, req.body, 'Invalid announcement data');

    const announcement = await withDatabaseErrorHandling(
      () => storage.createWorkforceRecruiterAnnouncement(validatedData),
      'createWorkforceRecruiterAnnouncement'
    ) as WorkforceRecruiterAnnouncement;
    
    await logAdminAction(
      userId,
      "create_workforce_recruiter_announcement",
      "announcement",
      announcement.id,
      { title: announcement.title, type: announcement.type }
    );

    res.json(announcement);
  }));

  app.put('/api/workforce-recruiter/admin/announcements/:id', isAuthenticated, ...isAdminWithCsrf, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const validatedData = validateWithZod(insertWorkforceRecruiterAnnouncementSchema.partial(), req.body, 'Invalid announcement data');
    const announcement = await withDatabaseErrorHandling(
      () => storage.updateWorkforceRecruiterAnnouncement(req.params.id, validatedData),
      'updateWorkforceRecruiterAnnouncement'
    ) as WorkforceRecruiterAnnouncement;
    
    await logAdminAction(
      userId,
      "update_workforce_recruiter_announcement",
      "announcement",
      announcement.id,
      { title: announcement.title }
    );

    res.json(announcement);
  }));

  app.delete('/api/workforce-recruiter/admin/announcements/:id', isAuthenticated, ...isAdminWithCsrf, asyncHandler(async (req: any, res) => {
    const userId = getUserId(req);
    const announcement = await withDatabaseErrorHandling(
      () => storage.deactivateWorkforceRecruiterAnnouncement(req.params.id),
      'deactivateWorkforceRecruiterAnnouncement'
    ) as WorkforceRecruiterAnnouncement;
    
    await logAdminAction(
      userId,
      "deactivate_workforce_recruiter_announcement",
      "announcement",
      announcement.id,
      { title: announcement.title }
    );

    res.json(announcement);
  }));

  // Add this route after the existing workforce-recruiter routes (around line 2800+)

  // Get sector details with skills and job titles breakdown
  app.get(
    "/api/workforce-recruiter/sector/:sector",
    isAuthenticated,
    asyncHandler(async (req: any, res) => {
      const sector = decodeURIComponent(req.params.sector);

      const details = await withDatabaseErrorHandling(
        () => storage.getWorkforceRecruiterSectorDetail(sector),
        'getWorkforceRecruiterSectorDetail'
      );

      res.json(details);
    })
  );


}
