BEGIN;

UPDATE ctf_plugin_registry
SET availability_state = 'implemented_shell', updated_at = NOW()
WHERE plugin_slug IN (
  'peer-programming',
  'mood',
  'gentlepulse',
  'weekly-performance',
  'gdp',
  'service-credits'
);

COMMIT;
