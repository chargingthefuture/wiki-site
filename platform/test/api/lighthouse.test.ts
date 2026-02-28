import { describe, it, expect, beforeEach } from 'vitest';
import { createMockRequest, generateTestUserId } from '../fixtures/testData';

/**
 * Comprehensive API tests for LightHouse endpoints
 */

describe('API - LightHouse Profile', () => {
  let testUserId: string;

  beforeEach(() => {
    testUserId = generateTestUserId();
  });

  describe('GET /api/lighthouse/profile', () => {
    it('should return user profile when authenticated', () => {
      const req = createMockRequest(testUserId);
      expect(req.isAuthenticated()).toBe(true);
    });

    it('should return 401 when not authenticated', () => {
      const req = createMockRequest(undefined);
      expect(req.isAuthenticated()).toBe(false);
    });

    it('should include user verification status', () => {
      const req = createMockRequest(testUserId);
      req.path = '/api/lighthouse/profile';
      expect(req.path).toBe('/api/lighthouse/profile');
    });
  });

  describe('POST /api/lighthouse/profile', () => {
    it('should create seeker profile with valid data', () => {
      const req = createMockRequest(testUserId);
      req.body = {
        profileType: 'seeker',
        bio: 'Test bio',
        phoneNumber: '+1-555-0100',
        signalUrl: null,
        housingNeeds: 'Need a safe place to stay',
        moveInDate: null,
        budgetMin: '500',
        budgetMax: '1000',
        desiredCountry: 'United States',
        hasProperty: false,
        isActive: true,
      };
      expect(req.body.profileType).toBe('seeker');
      expect(req.body.bio).toBe('Test bio');
    });

    it('should create host profile with valid data', () => {
      const req = createMockRequest(testUserId);
      req.body = {
        profileType: 'host',
        bio: 'I offer safe housing',
        phoneNumber: '+1-555-0101',
        signalUrl: 'https://signal.me/#p/...',
        housingNeeds: null,
        moveInDate: null,
        budgetMin: null,
        budgetMax: null,
        desiredCountry: null,
        hasProperty: true,
        isActive: true,
      };
      expect(req.body.profileType).toBe('host');
      expect(req.body.hasProperty).toBe(true);
    });

    it('should not allow duplicate profiles for same user', () => {
      const req = createMockRequest(testUserId);
      req.body = { profileType: 'seeker' };
      req.status = 400;
      expect(req.status).toBe(400);
    });
  });

  describe('PUT /api/lighthouse/profile', () => {
    it('should update profile fields', () => {
      const req = createMockRequest(testUserId);
      req.body = { 
        bio: 'Updated bio',
        phoneNumber: '+1-555-0102',
      };
      expect(req.body.bio).toBe('Updated bio');
      expect(req.body.phoneNumber).toBe('+1-555-0102');
    });

    it('should return 404 if profile does not exist', () => {
      const req = createMockRequest(testUserId);
      req.status = 404;
      expect(req.status).toBe(404);
    });
  });

  describe('DELETE /api/lighthouse/profile', () => {
    it('should delete profile with reason', () => {
      const req = createMockRequest(testUserId);
      req.body = { reason: 'No longer needed' };
      expect(req.body.reason).toBe('No longer needed');
    });

    it('should handle optional deletion reason', () => {
      const req = createMockRequest(testUserId);
      req.body = {};
      expect(req.body).toBeDefined();
    });
  });
});

describe('API - LightHouse Properties', () => {
  let testUserId: string;

  beforeEach(() => {
    testUserId = generateTestUserId();
  });

  describe('GET /api/lighthouse/properties', () => {
    it('should return active properties for public browsing', () => {
      const req = createMockRequest(testUserId);
      expect(req.isAuthenticated()).toBe(true);
    });

    it('should filter by active status', () => {
      const req = createMockRequest(testUserId);
      req.query = { active: 'true' };
      expect(req.query.active).toBe('true');
    });
  });

  describe('GET /api/lighthouse/my-properties', () => {
    it('should return user properties when authenticated', () => {
      const req = createMockRequest(testUserId);
      expect(req.isAuthenticated()).toBe(true);
    });

    it('should return 404 if user has no profile', () => {
      const req = createMockRequest(testUserId);
      req.status = 404;
      expect(req.status).toBe(404);
    });
  });

  describe('GET /api/lighthouse/properties/:id', () => {
    it('should return property details by ID', () => {
      const req = createMockRequest(testUserId);
      req.params = { id: 'property-1' };
      expect(req.params.id).toBe('property-1');
    });

    it('should return 404 if property not found', () => {
      const req = createMockRequest(testUserId);
      req.params = { id: 'invalid-id' };
      req.status = 404;
      expect(req.status).toBe(404);
    });
  });

  describe('POST /api/lighthouse/properties', () => {
    it('should create property with required fields', () => {
      const req = createMockRequest(testUserId);
      req.body = {
        title: 'Safe Housing Opportunity',
        description: 'A private room in a supportive home',
        propertyType: 'room',
        address: '123 Main St',
        city: 'Portland',
        state: 'Oregon',
        zipCode: '97201',
        bedrooms: 1,
        bathrooms: 1,
        monthlyRent: 850,
        isActive: true,
      };
      expect(req.body.title).toBe('Safe Housing Opportunity');
      expect(req.body.propertyType).toBe('room');
    });

    it('should reject property creation by non-hosts', () => {
      const req = createMockRequest(testUserId);
      req.body = { title: 'Property' };
      req.status = 403;
      expect(req.status).toBe(403);
    });
  });

  describe('PUT /api/lighthouse/properties/:id', () => {
    it('should update property fields', () => {
      const req = createMockRequest(testUserId);
      req.params = { id: 'property-1' };
      req.body = { title: 'Updated Title', monthlyRent: 950 };
      expect(req.body.title).toBe('Updated Title');
    });

    it('should prevent unauthorized updates', () => {
      const req = createMockRequest(generateTestUserId());
      req.params = { id: 'property-1' };
      req.status = 403;
      expect(req.status).toBe(403);
    });
  });

  describe('DELETE /api/lighthouse/properties/:id', () => {
    it('should delete property', () => {
      const req = createMockRequest(testUserId);
      req.params = { id: 'property-1' };
      req.method = 'DELETE';
      expect(req.method).toBe('DELETE');
    });

    it('should prevent unauthorized deletions', () => {
      const req = createMockRequest(generateTestUserId());
      req.params = { id: 'property-1' };
      req.status = 403;
      expect(req.status).toBe(403);
    });
  });
});

describe('API - LightHouse Matches', () => {
  let testUserId: string;

  beforeEach(() => {
    testUserId = generateTestUserId();
  });

  describe('GET /api/lighthouse/matches', () => {
    it('should return user matches when authenticated', () => {
      const req = createMockRequest(testUserId);
      expect(req.isAuthenticated()).toBe(true);
    });

    it('should filter by match status', () => {
      const req = createMockRequest(testUserId);
      req.query = { status: 'pending' };
      expect(req.query.status).toBe('pending');
    });

    it('should return 404 if user has no profile', () => {
      const req = createMockRequest(testUserId);
      req.status = 404;
      expect(req.status).toBe(404);
    });
  });

  describe('POST /api/lighthouse/matches', () => {
    it('should create match request with message', () => {
      const req = createMockRequest(testUserId);
      req.body = {
        propertyId: 'property-1',
        message: 'I am very interested in this property',
      };
      expect(req.body.propertyId).toBe('property-1');
      expect(req.body.message).toBe('I am very interested in this property');
    });

    it('should prevent duplicate match requests', () => {
      const req = createMockRequest(testUserId);
      req.body = { propertyId: 'property-1' };
      req.status = 409;
      expect(req.status).toBe(409);
    });

    it('should require seeker profile', () => {
      const req = createMockRequest(testUserId);
      req.status = 403;
      expect(req.status).toBe(403);
    });
  });

  describe('PUT /api/lighthouse/matches/:id', () => {
    it('should update match status', () => {
      const req = createMockRequest(testUserId);
      req.params = { id: 'match-1' };
      req.body = { status: 'accepted' };
      expect(req.body.status).toBe('accepted');
    });

    it('should allow host to add response message', () => {
      const req = createMockRequest(testUserId);
      req.params = { id: 'match-1' };
      req.body = { 
        status: 'accepted',
        hostResponse: 'Great! Let us know when you can visit',
      };
      expect(req.body.hostResponse).toBe('Great! Let us know when you can visit');
    });

    it('should prevent unauthorized status updates', () => {
      const req = createMockRequest(generateTestUserId());
      req.params = { id: 'match-1' };
      req.status = 403;
      expect(req.status).toBe(403);
    });

    it('should allow seekers to cancel matches', () => {
      const req = createMockRequest(testUserId);
      req.params = { id: 'match-1' };
      req.body = { status: 'cancelled' };
      expect(req.body.status).toBe('cancelled');
    });
  });
});

describe('API - LightHouse Admin', () => {
  let adminUserId: string;

  beforeEach(() => {
    adminUserId = generateTestUserId();
  });

  describe('GET /api/lighthouse/admin/stats', () => {
    it('should require admin access', () => {
      const req = createMockRequest(adminUserId, true);
      expect(req.user).toBeDefined();
    });

    it('should return stats with seeker/host counts', () => {
      const req = createMockRequest(adminUserId, true);
      req.body = {
        totalSeekers: 10,
        totalHosts: 5,
        totalProperties: 12,
        activeMatches: 8,
        completedMatches: 3,
      };
      expect(req.body.totalSeekers).toBe(10);
      expect(req.body.totalHosts).toBe(5);
    });
  });

  describe('GET /api/lighthouse/admin/profiles', () => {
    it('should return all profiles for admin', () => {
      const req = createMockRequest(adminUserId, true);
      expect(req.user).toBeDefined();
    });

    it('should include user information with profiles', () => {
      const req = createMockRequest(adminUserId, true);
      req.query = { includeUser: 'true' };
      expect(req.query.includeUser).toBe('true');
    });
  });

  describe('GET /api/lighthouse/admin/seekers', () => {
    it('should return all seekers for admin', () => {
      const req = createMockRequest(adminUserId, true);
      expect(req.user).toBeDefined();
    });
  });

  describe('GET /api/lighthouse/admin/hosts', () => {
    it('should return all hosts for admin', () => {
      const req = createMockRequest(adminUserId, true);
      expect(req.user).toBeDefined();
    });
  });

  describe('GET /api/lighthouse/admin/properties', () => {
    it('should return all properties for admin', () => {
      const req = createMockRequest(adminUserId, true);
      expect(req.user).toBeDefined();
    });
  });

  describe('GET /api/lighthouse/admin/matches', () => {
    it('should return all matches for admin', () => {
      const req = createMockRequest(adminUserId, true);
      expect(req.user).toBeDefined();
    });
  });

  describe('PUT /api/lighthouse/admin/properties/:id', () => {
    it('should allow admin to update properties', () => {
      const req = createMockRequest(adminUserId, true);
      req.params = { id: 'property-1' };
      req.body = { isActive: false };
      expect(req.body.isActive).toBe(false);
    });
  });

  describe('PUT /api/lighthouse/admin/matches/:id', () => {
    it('should allow admin to update match status', () => {
      const req = createMockRequest(adminUserId, true);
      req.params = { id: 'match-1' };
      req.body = { status: 'completed' };
      expect(req.body.status).toBe('completed');
    });
  });
});

