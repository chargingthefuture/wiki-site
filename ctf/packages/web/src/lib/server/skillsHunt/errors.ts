import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export class SkillsHuntApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  public constructor(input: {
    code: string;
    message: string;
    status: number;
    details?: Record<string, unknown>;
  }) {
    super(input.message);
    this.name = "SkillsHuntApiError";
    this.code = input.code;
    this.status = input.status;
    this.details = input.details;
  }
}

export const jsonApiError = (
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>,
) => {
  const body: ApiErrorBody = {
    error: {
      code,
      message,
      details,
    },
  };

  return NextResponse.json(body, { status });
};

export const mapSkillsHuntErrorToResponse = (error: unknown) => {
  if (error instanceof SkillsHuntApiError) {
    return jsonApiError(error.code, error.message, error.status, error.details);
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  return jsonApiError("INTERNAL_ERROR", message, 500);
};
