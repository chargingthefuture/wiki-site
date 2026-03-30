import React from "react";
import { TrustEvidencePanel } from "./TrustEvidencePanel";
import type { TrustUserExtension } from "../../lib/trust/types";

export interface TrustDirectoryProfilePanelProps {
  trust: TrustUserExtension;
}

export const TrustDirectoryProfilePanel: React.FC<TrustDirectoryProfilePanelProps> = ({ trust }) => {
  return (
    <div className="my-4">
      <TrustEvidencePanel trust={trust} />
    </div>
  );
};
