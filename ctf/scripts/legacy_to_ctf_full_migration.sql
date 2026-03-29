-- Migration SQL: Legacy Platform DB to CTF Schema
-- This script migrates all tables and data from the legacy platform database (platform/schema.sql)
-- to the new CTF schema (ctf/schema.sql). It assumes both databases are accessible from the same Postgres instance or via dblink.
--
-- USAGE:
-- 1. Review and adjust connection details and table mappings as needed.
-- 2. Run this script on the target CTF database (after schema.sql is applied).
-- 3. This script does NOT drop or overwrite existing data unless explicitly stated.
--
-- NOTE: This script is a template. For large tables, consider using pg_dump/pg_restore or ETL tools for efficiency.

-- Example: Enable dblink extension if using dblink for cross-db copy
-- CREATE EXTENSION IF NOT EXISTS dblink;

-- Example: Set up dblink connection (adjust connection string as needed)
-- SELECT dblink_connect('legacy', 'host=localhost dbname=platform_db user=postgres password=...');

-- === USERS TABLE ===
INSERT INTO users (id, email, first_name, last_name, profile_image_url, quora_profile_url, is_admin, is_verified, is_approved, pricing_tier, subscription_status, terms_accepted_at, created_at, updated_at)
SELECT id, email, first_name, last_name, profile_image_url, quora_profile_url, is_admin, is_verified, is_approved, pricing_tier, subscription_status, terms_accepted_at, created_at, updated_at
FROM dblink('legacy', 'SELECT id, email, first_name, last_name, profile_image_url, quora_profile_url, is_admin, is_verified, is_approved, pricing_tier, subscription_status, terms_accepted_at, created_at, updated_at FROM users')
AS t(id VARCHAR, email VARCHAR, first_name VARCHAR, last_name VARCHAR, profile_image_url VARCHAR, quora_profile_url VARCHAR, is_admin BOOLEAN, is_verified BOOLEAN, is_approved BOOLEAN, pricing_tier DECIMAL, subscription_status VARCHAR, terms_accepted_at TIMESTAMP, created_at TIMESTAMP, updated_at TIMESTAMP);

-- === SESSIONS TABLE ===
INSERT INTO sessions (sid, sess, expire)
SELECT sid, sess, expire
FROM dblink('legacy', 'SELECT sid, sess, expire FROM sessions')
AS t(sid VARCHAR, sess JSONB, expire TIMESTAMP);

-- === LOGIN_EVENTS TABLE ===
INSERT INTO login_events (id, user_id, source, created_at)
SELECT id, user_id, source, created_at
FROM dblink('legacy', 'SELECT id, user_id, source, created_at FROM login_events')
AS t(id VARCHAR, user_id VARCHAR, source VARCHAR, created_at TIMESTAMP);

-- === OTP_CODES TABLE ===
INSERT INTO otp_codes (id, user_id, code, expires_at, created_at)
SELECT id, user_id, code, expires_at, created_at
FROM dblink('legacy', 'SELECT id, user_id, code, expires_at, created_at FROM otp_codes')
AS t(id VARCHAR, user_id VARCHAR, code VARCHAR, expires_at TIMESTAMP, created_at TIMESTAMP);

-- === AUTH_TOKENS TABLE ===
INSERT INTO auth_tokens (id, token, user_id, expires_at, created_at)
SELECT id, token, user_id, expires_at, created_at
FROM dblink('legacy', 'SELECT id, token, user_id, expires_at, created_at FROM auth_tokens')
AS t(id VARCHAR, token VARCHAR, user_id VARCHAR, expires_at TIMESTAMP, created_at TIMESTAMP);

-- === PRICING_TIERS TABLE ===
INSERT INTO pricing_tiers (id, amount, effective_date, is_current_tier, created_at)
SELECT id, amount, effective_date, is_current_tier, created_at
FROM dblink('legacy', 'SELECT id, amount, effective_date, is_current_tier, created_at FROM pricing_tiers')
AS t(id VARCHAR, amount DECIMAL, effective_date TIMESTAMP, is_current_tier BOOLEAN, created_at TIMESTAMP);

-- === PAYMENTS TABLE ===
INSERT INTO payments (id, user_id, amount, payment_date, payment_method, billing_period, billing_month, yearly_start_month, yearly_end_month, notes, recorded_by, created_at)
SELECT id, user_id, amount, payment_date, payment_method, billing_period, billing_month, yearly_start_month, yearly_end_month, notes, recorded_by, created_at
FROM dblink('legacy', 'SELECT id, user_id, amount, payment_date, payment_method, billing_period, billing_month, yearly_start_month, yearly_end_month, notes, recorded_by, created_at FROM payments')
AS t(id VARCHAR, user_id VARCHAR, amount DECIMAL, payment_date TIMESTAMP, payment_method VARCHAR, billing_period VARCHAR, billing_month VARCHAR, yearly_start_month VARCHAR, yearly_end_month VARCHAR, notes TEXT, recorded_by VARCHAR, created_at TIMESTAMP);

-- === ADMIN_ACTION_LOGS TABLE ===
INSERT INTO admin_action_logs (id, admin_id, action, resource_type, resource_id, details, created_at)
SELECT id, admin_id, action, resource_type, resource_id, details, created_at
FROM dblink('legacy', 'SELECT id, admin_id, action, resource_type, resource_id, details, created_at FROM admin_action_logs')
AS t(id VARCHAR, admin_id VARCHAR, action VARCHAR, resource_type VARCHAR, resource_id VARCHAR, details JSONB, created_at TIMESTAMP);

-- === (Repeat for all other tables as needed, following the above pattern) ===

-- For tables with schema changes, add explicit column mapping or transformation logic as needed.
-- For large tables, consider using pg_dump/pg_restore with --data-only and --table options for efficiency.

-- Disconnect dblink session if used
-- SELECT dblink_disconnect('legacy');