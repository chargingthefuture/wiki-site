-- Skills Hunt Service Credits Transactions Table
CREATE TABLE IF NOT EXISTS skills_hunt_service_credits_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id VARCHAR NOT NULL REFERENCES users(id),
    to_user_id VARCHAR NOT NULL REFERENCES users(id),
    amount INTEGER NOT NULL CHECK (amount > 0),
    reason TEXT,
    submission_id UUID REFERENCES skills_hunt_submissions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_hunt_service_credits_from_user ON skills_hunt_service_credits_transactions (from_user_id);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_service_credits_to_user ON skills_hunt_service_credits_transactions (to_user_id);
CREATE INDEX IF NOT EXISTS idx_skills_hunt_service_credits_submission_id ON skills_hunt_service_credits_transactions (submission_id);