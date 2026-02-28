-- Migration: Create waitlist table for landing page signups
-- All fields required except state and city

CREATE TABLE waitlist_signups (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    skills TEXT NOT NULL CHECK (char_length(skills) <= 240),
    country TEXT NOT NULL,
    state TEXT,
    city TEXT,
    quora_profile_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Index for fast email lookup (enforce uniqueness if desired)
CREATE INDEX idx_waitlist_signups_email ON waitlist_signups(email);
