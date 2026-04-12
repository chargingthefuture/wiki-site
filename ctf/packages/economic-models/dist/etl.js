// --- ETL Pipeline: Extract, Transform, Anonymize, Aggregate ---
/**
 * Extracts and anonymizes transaction data from the DB/plugins.
 * @param rawRecords Raw DB/plugin records (with PII)
 * @returns Array of anonymized, aggregated TransactionRecords
 */
export function extractAnonymizedTransactions(rawRecords) {
    // Example: hash user IDs, bucket timestamps, aggregate by (source, target, community, time)
    // This is a stub; real implementation will depend on DB/plugin schema
    return rawRecords.map(r => ({
        source_id: anonymizeId(r.user_id),
        target_id: anonymizeId(r.counterparty_id),
        weight: r.amount || 1,
        community_id: anonymizeId(r.community_id),
        timestamp: bucketTimestamp(r.timestamp),
    }));
}
/**
 * Extracts and anonymizes regional flow data.
 */
export function extractAnonymizedRegionalFlows(rawRecords) {
    return rawRecords.map(r => ({
        from_region: anonymizeId(r.from_region),
        to_region: anonymizeId(r.to_region),
        value: r.value,
        type: r.type,
        timestamp: bucketTimestamp(r.timestamp),
    }));
}
/**
 * Extracts and anonymizes input-output data.
 */
export function extractAnonymizedInputOutput(rawRecords) {
    return rawRecords.map(r => ({
        from_sector: anonymizeId(r.from_sector),
        to_sector: anonymizeId(r.to_sector),
        value: r.value,
        type: r.type,
        timestamp: bucketTimestamp(r.timestamp),
    }));
}
// --- Utility Functions ---
function anonymizeId(id) {
    // Replace with a secure hash in production
    return typeof id === 'string' ? `anon_${id}` : `anon_${id.toString()}`;
}
function bucketTimestamp(ts) {
    // Example: bucket to day or week
    return ts.split('T')[0];
}
