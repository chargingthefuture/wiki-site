import React from "react";
import type { TrustUserExtension } from "../../lib/trust/types";

export interface TrustStatusBadgeProps {
  trustStatus: TrustUserExtension["trustStatus"];
}

export const TrustStatusBadge: React.FC<TrustStatusBadgeProps> = ({ trustStatus }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (trustStatus === "verified") colorClass = "bg-green-100 text-green-800";
  else if (trustStatus === "flagged") colorClass = "bg-red-100 text-red-800";

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
      {trustStatus.charAt(0).toUpperCase() + trustStatus.slice(1)}
    </span>
  );
};
