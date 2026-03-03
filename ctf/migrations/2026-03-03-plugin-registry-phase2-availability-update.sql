BEGIN;

UPDATE ctf_plugin_registry
SET availability_state = 'implemented_shell', updated_at = NOW()
WHERE plugin_slug IN ('lighthouse', 'socketrelay', 'trusttransport');

COMMIT;
