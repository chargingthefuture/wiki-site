

import React, { useState } from 'react';
import { EOLEducation } from './education';
import { WillWizard } from './will-wizard';
import { saveWillToSupabase } from './save-to-supabase';

export const EOLPlugin: React.FC = () => {
  const [educationDone, setEducationDone] = useState(false);
  const [willComplete, setWillComplete] = useState(false);
  const [willData, setWillData] = useState<any>(null);

  if (!educationDone) {
    return <EOLEducation onDone={() => setEducationDone(true)} />;
  }

  if (!willComplete) {
    return (
      <div>
        <h2>Basic Will & Testament Builder</h2>
        <p>See <a href="./legal-disclaimers.md" target="_blank" rel="noopener noreferrer">Legal Disclaimers</a> before proceeding.</p>
        <WillWizard onComplete={(data) => { setWillData(data); setWillComplete(true); }} />
      </div>
    );
  }

  // Review, export/print, and save to Supabase
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    // TODO: Replace with real user ID from auth context/session
    const userId = 'anonymous-user';
    const { error } = await saveWillToSupabase(userId, willData);
    setSaving(false);
    if (error) setSaveStatus('Error saving to Supabase.');
    else setSaveStatus('Saved to Supabase!');
  };

  return (
    <div>
      <h2>Your Will Summary</h2>
      <pre>{JSON.stringify(willData, null, 2)}</pre>
      <p>
        <strong>To make this will legally binding:</strong>
        <ul>
          <li>Print this summary and sign it in the presence of required witnesses (see local laws).</li>
          <li>Consider having it notarized for extra validity.</li>
          <li>Store it in a safe place and inform your executor.</li>
        </ul>
      </p>
      <button onClick={() => window.print()}>Print</button>
      <button onClick={handleSave} disabled={saving} style={{ marginLeft: 8 }}>
        {saving ? 'Saving...' : 'Save to Supabase'}
      </button>
      {saveStatus && <div>{saveStatus}</div>}
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        (Supabase Free Plan: Max file size 50 MB. Only use for document storage.)
      </p>
    </div>
  );
};
