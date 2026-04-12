export interface FeedbackItem {
    id: string;
    user_id: string;
    type: 'bug_report' | 'feature_request' | 'general' | 'satisfaction';
    title: string;
    body?: string;
    category?: string;
    priority?: 'critical' | 'high' | 'medium' | 'low';
    status: 'new' | 'triaged' | 'matched_to_inventory' | 'approval_pending' | 'approved' | 'linked_to_task' | 'resolved' | 'dismissed';
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    vote_count?: number;
}
export interface InventoryMatch {
    id: string;
    feedback_id: string;
    inventory_file_path: string;
    match_confidence: number;
    suggested_updates: Record<string, any>;
    matcher_reasoning?: string;
    created_at: string;
}
export interface ApprovalQueueItem {
    id: string;
    feedback_id: string;
    matcher_id: string;
    status: 'pending' | 'approved' | 'rejected' | 'modified';
    approver_id?: string;
    approver_feedback?: string;
    approved_artifact_changes?: Record<string, any>;
    created_at: string;
    approved_at?: string;
}
export interface ImplementationQueueItem {
    id: string;
    approval_id: string;
    feedback_id: string;
    inventory_file_path: string;
    artifact_changes: Record<string, any>;
    implementation_status: 'pending' | 'in_progress' | 'completed' | 'failed';
    implementation_agent_id?: string;
    implementation_log?: string;
    created_at: string;
    completed_at?: string;
}
export interface InventoryFile {
    path: string;
    name: string;
    content: string;
    parsed_features: Record<string, any>;
    artifact_schemas?: Record<string, any>;
    artifact_apis?: Record<string, any>;
}
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: Record<string, any>;
}
//# sourceMappingURL=types.d.ts.map