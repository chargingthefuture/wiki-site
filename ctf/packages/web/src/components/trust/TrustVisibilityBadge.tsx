import React from "react";
import type { TrustUserExtension } from "../../lib/trust/types";

export interface TrustVisibilityBadgeProps {
  trustVisibility: TrustUserExtension["trustVisibility"];
}

export const TrustVisibilityBadge: React.FC<TrustVisibilityBadgeProps> = ({ trustVisibility }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (trustVisibility === "public") colorClass = "bg-blue-100 text-blue-800";
  else if (trustVisibility === "private") colorClass = "bg-yellow-100 text-yellow-800";
  else if (trustVisibility === "restricted") colorClass = "bg-purple-100 text-purple-800";

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
      {trustVisibility.charAt(0).toUpperCase() + trustVisibility.slice(1)}
    </span>
  );
};
