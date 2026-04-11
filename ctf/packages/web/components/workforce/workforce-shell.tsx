

'use client';
// Placeholder for real Workforce implementation

type WorkforceShellProps = {
  isAdmin: boolean;
};



// ...existing code...

const CHARTS = [
  { label: 'Employed', value: 1830000, pct: 37, color: '#22C55E' },
  { label: 'In Training', value: 1220000, pct: 25, color: '#6366F1' },
  { label: 'Seeking Work', value: 980000, pct: 20, color: '#F59E0B' },
  { label: 'Exploring', value: 890000, pct: 18, color: '#6B7280' },
];

const SKILL_GAPS = [
  { skill: 'Trauma-Informed Therapy', supply: 3200, demand: 12800, gap: 9600, trend: '+12%' },
  { skill: 'Housing Navigation', supply: 5100, demand: 18300, gap: 13200, trend: '+8%' },
  { skill: 'Legal Advocacy', supply: 2800, demand: 9100, gap: 6300, trend: '+15%' },
  { skill: 'Software Development', supply: 7400, demand: 22000, gap: 14600, trend: '+31%' },
  { skill: 'Financial Counseling', supply: 4200, demand: 11700, gap: 7500, trend: '+6%' },
  { skill: 'Peer Mentorship', supply: 9800, demand: 21400, gap: 11600, trend: '+4%' },
];





import { AuthProvider, useAuth } from '../../lib/auth/client-context';
import React, { useEffect, useState } from 'react';


type Profile = {
  name: string;
  role: string;
  skills: string[];
  region: string;
  status: string;
};


function WorkforceShellInner(props: WorkforceShellProps) {
  const auth = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with real API call
    setTimeout(() => {
      setProfile(null);
      setLoading(false);
    }, 1000);
  }, []);

  if (!auth.isAuthenticated) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#0F1117', color: '#E8EAF0', fontFamily: 'Inter, system-ui, sans-serif', padding: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Sign in required</h1>
        <div style={{ fontSize: 18, color: '#9CA3AF', marginTop: 24 }}>Please sign in to view your Workforce profile.</div>
        <button style={{ marginTop: 24, padding: '10px 24px', fontSize: 16, background: '#6366F1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }} onClick={auth.signIn}>Sign In</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#0F1117', color: '#E8EAF0', fontFamily: 'Inter, system-ui, sans-serif', padding: 32 }}>
        <div style={{ fontSize: 22, color: '#6366F1', marginTop: 40 }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#0F1117', color: '#E8EAF0', fontFamily: 'Inter, system-ui, sans-serif', padding: 32 }}>
        <div style={{ fontSize: 22, color: '#EF4444', marginTop: 40 }}>{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#0F1117', color: '#E8EAF0', fontFamily: 'Inter, system-ui, sans-serif', padding: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>My Workforce Profile</h1>
        <div style={{ fontSize: 18, color: '#9CA3AF', marginTop: 24 }}>No profile data found. Complete your profile to get started.</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#0F1117', color: '#E8EAF0', fontFamily: 'Inter, system-ui, sans-serif', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>My Workforce Profile</h1>
      <section style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 18, color: '#6366F1', fontWeight: 700, marginBottom: 10 }}>Name:</div>
        <div style={{ fontSize: 18, marginBottom: 16 }}>{profile.name}</div>
        <div style={{ fontSize: 18, color: '#6366F1', fontWeight: 700, marginBottom: 10 }}>Role:</div>
        <div style={{ fontSize: 18, marginBottom: 16 }}>{profile.role}</div>
        <div style={{ fontSize: 18, color: '#6366F1', fontWeight: 700, marginBottom: 10 }}>Skills:</div>
        <div style={{ fontSize: 18, marginBottom: 16 }}>{profile.skills.join(', ')}</div>
        <div style={{ fontSize: 18, color: '#6366F1', fontWeight: 700, marginBottom: 10 }}>Region:</div>
        <div style={{ fontSize: 18, marginBottom: 16 }}>{profile.region}</div>
        <div style={{ fontSize: 18, color: '#6366F1', fontWeight: 700, marginBottom: 10 }}>Status:</div>
        <div style={{ fontSize: 18, marginBottom: 16 }}>{profile.status}</div>
      </section>
    </div>
  );
}

export function WorkforceShell(props: WorkforceShellProps) {
  return (
    <AuthProvider>
      <WorkforceShellInner {...props} />
    </AuthProvider>
  );
}
