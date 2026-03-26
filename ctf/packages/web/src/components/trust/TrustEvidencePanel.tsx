"use client";
import React, { useState } from "react";
import type { TrustUserExtension, TrustEvidenceItem } from "../../lib/trust/types";

export interface TrustEvidencePanelProps {
  trust: TrustUserExtension;
  compact?: boolean;
}

export const TrustEvidencePanel: React.FC<TrustEvidencePanelProps> = ({ trust, compact }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const requestVerification = async () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/trust/admin/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: trust.userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data?.message || "Request submitted. An admin will review.");
      } else {
        setMessage(data?.message || "Request failed. Please try again later.");
      }
    } catch (e) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded border bg-background p-4 mb-2">
      <header className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg">Trust &amp; Verification</span>
        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
          trust.trustStatus === "verified"
            ? "bg-green-100 text-green-800"
            : trust.trustStatus === "flagged"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {trust.trustStatus.charAt(0).toUpperCase() + trust.trustStatus.slice(1)}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          Visibility: {trust.trustVisibility.charAt(0).toUpperCase() + trust.trustVisibility.slice(1)}
        </span>
      </header>
      <ul className="space-y-2">
        {trust.trustEvidence.length === 0 ? (
          <li>
            {compact ? (
              <div className="flex flex-col items-center text-center py-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M12 2L20 5V11C20 16.55 16.42 21.74 12 23C7.58 21.74 4 16.55 4 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11L11 13L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="text-sm font-semibold text-gray-200">No trust signals yet</div>
                <div className="text-xs text-muted-foreground mt-1">Signals appear as you participate in the community.</div>
                <button onClick={requestVerification} disabled={loading} className={`mt-2 px-3 py-1 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'} bg-blue-600 text-white rounded text-xs`}>
                  {loading ? 'Requesting...' : 'Request Verification'}
                </button>
                {message && <div className="mt-1 text-xs text-muted-foreground">{message}</div>}
                <div className="mt-1 text-xs text-muted-foreground">Visible to: {trust.trustVisibility.charAt(0).toUpperCase() + trust.trustVisibility.slice(1)}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300 mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M12 2L20 5V11C20 16.55 16.42 21.74 12 23C7.58 21.74 4 16.55 4 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11L11 13L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-gray-200 mb-1">No trust signals yet</h4>
                <p className="text-xs text-muted-foreground mb-3">Trust signals appear as you participate in the community.</p>
                <ol className="text-sm text-left space-y-2 w-full max-w-[320px] list-inside">
                  <li className="flex items-start gap-2"><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-xs text-gray-700">1</span> Complete your profile</li>
                  <li className="flex items-start gap-2"><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-xs text-gray-700">2</span> Make your first transaction</li>
                  <li className="flex items-start gap-2"><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-xs text-gray-700">3</span> Use at least one plugin</li>
                </ol>
                <button onClick={requestVerification} disabled={loading} className={`mt-3 w-full max-w-[320px] ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'} bg-blue-600 text-white rounded px-3 py-2`}>
                  {loading ? 'Requesting...' : 'Request Verification'}
                </button>
                {message && <div className="mt-2 text-xs text-muted-foreground">{message}</div>}
                <div className="mt-2 text-xs text-muted-foreground">Visible to: {trust.trustVisibility.charAt(0).toUpperCase() + trust.trustVisibility.slice(1)}</div>
              </div>
            )}
          </li>
        ) : (
          trust.trustEvidence.map((item: TrustEvidenceItem, idx: number) => (
            <li key={idx} className="border rounded p-2 bg-muted">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{item.type}</span>
                <span className="text-xs text-muted-foreground ml-auto">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-sm">{item.summary}</div>
              {item.details && <div className="text-xs text-muted-foreground mt-1">{item.details}</div>}
            </li>
          ))
        )}
      </ul>
    </section>
  );
};
