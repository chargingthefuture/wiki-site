import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse } from "yaml";

export enum MetricCheckStatus {
  FOUND = "FOUND",
  NOT_FOUND = "NOT_FOUND",
  AMBIGUOUS = "AMBIGUOUS"
}

export interface CanonicalMetricInput {
  name: string;
  type: string;
}

export interface CanonicalMetricThresholds {
  min?: number;
  max?: number;
  alert_rules?: string[];
}

export interface CanonicalMetricEntry {
  id: string;
  name: string;
  description: string;
  owner: string;
  data_type: string;
  unit: string;
  calculation: string;
  inputs: CanonicalMetricInput[];
  example_values: Array<string | number | boolean>;
  last_updated: string;
  allowed_thresholds?: CanonicalMetricThresholds;
  update_cadence?: string;
  retention?: string;
}

interface CanonicalMetricsDocument {
  canonical_metrics?: CanonicalMetricEntry[];
}

export interface MetricCheckAuditLog {
  timestamp: string;
  caller: string;
  metric_identifier: string;
  result: "found" | "not_found" | "ambiguous";
  canonical_id?: string;
}

export interface MetricDefinitionQuestionSet {
  questions: string[];
}

export interface BlockingMetricDefinitionRequest {
  status: MetricCheckStatus.NOT_FOUND | MetricCheckStatus.AMBIGUOUS;
  title: string;
  message: string;
  metric_identifier: string;
  matches?: Array<Pick<CanonicalMetricEntry, "id" | "name">>;
  suggested_questions: MetricDefinitionQuestionSet;
  links: {
    canonical_metrics: string;
    template: string;
  };
}

export interface MetricCheckFoundResult {
  status: MetricCheckStatus.FOUND;
  entry: CanonicalMetricEntry;
}

export interface MetricCheckFailureResult {
  status: MetricCheckStatus.NOT_FOUND | MetricCheckStatus.AMBIGUOUS;
  blocking_request: BlockingMetricDefinitionRequest;
}

export type MetricCheckResult = MetricCheckFoundResult | MetricCheckFailureResult;

export interface MetricCheckOptions {
  caller: string;
  registryPath?: string;
  templatePath?: string;
  auditFilePath?: string;
  auditEndpoint?: string;
}

const DEFAULT_TEMPLATE_PATH = "ctf/docs/templates/canonical-metric-template.md";

const EXACT_SUGGESTED_QUESTIONS = [
  "a. Confirm exact metric name and any aliases.",
  "b. Give a precise human-readable description.",
  "c. Specify data_type and unit.",
  "d. Provide calculation logic (SQL, formula, or pseudocode) and required inputs.",
  "e. Provide example inputs with expected output.",
  "f. Specify owner/contact and acceptable thresholds/alerts.",
  "g. Indicate update cadence and retention."
];

const normalize = (value: string): string => value.trim().toLowerCase();

const getCandidateRegistryPaths = (options?: MetricCheckOptions): string[] => {
  const candidates = [
    options?.registryPath,
    process.env.CANONICAL_METRICS_PATH,
    resolve(process.cwd(), "config/canonical_metrics.yaml"),
    resolve(process.cwd(), "ctf/config/canonical_metrics.yaml")
  ];

  return candidates.filter((candidate): candidate is string => Boolean(candidate));
};

const loadCanonicalMetrics = async (registryPath: string): Promise<CanonicalMetricEntry[]> => {
  const content = await readFile(registryPath, "utf8");
  const parsed = parse(content) as CanonicalMetricsDocument;
  const entries = parsed.canonical_metrics;

  if (!Array.isArray(entries)) {
    throw new Error(`Invalid canonical metrics registry format at ${registryPath}`);
  }

  return entries;
};

const resolveRegistryPathAndMetrics = async (
  options?: MetricCheckOptions
): Promise<{ registryPath: string; entries: CanonicalMetricEntry[] }> => {
  const candidatePaths = getCandidateRegistryPaths(options);
  const errors: string[] = [];

  for (const candidatePath of candidatePaths) {
    try {
      const entries = await loadCanonicalMetrics(candidatePath);
      return { registryPath: candidatePath, entries };
    } catch (error) {
      errors.push(`${candidatePath}: ${(error as Error).message}`);
    }
  }

  throw new Error(
    `Unable to load canonical metrics registry. Tried: ${candidatePaths.join(", ")}. Errors: ${errors.join(" | ")}`
  );
};

const buildBlockingRequest = (
  status: MetricCheckStatus.NOT_FOUND | MetricCheckStatus.AMBIGUOUS,
  metricIdentifier: string,
  registryPath: string,
  templatePath: string,
  matches?: CanonicalMetricEntry[]
): BlockingMetricDefinitionRequest => {
  const title =
    status === MetricCheckStatus.NOT_FOUND
      ? "Metric definition required before code generation"
      : "Ambiguous metric identifier requires clarification before code generation";

  const message =
    status === MetricCheckStatus.NOT_FOUND
      ? `MDC check blocked changes. Metric \"${metricIdentifier}\" is not defined in canonical_metrics.`
      : `MDC check blocked changes. Metric identifier \"${metricIdentifier}\" matches multiple canonical metrics and is ambiguous.`;

  return {
    status,
    title,
    message,
    metric_identifier: metricIdentifier,
    matches: matches?.map(({ id, name }) => ({ id, name })),
    suggested_questions: {
      questions: EXACT_SUGGESTED_QUESTIONS
    },
    links: {
      canonical_metrics: registryPath,
      template: templatePath
    }
  };
};

const emitAuditLog = async (
  log: MetricCheckAuditLog,
  options?: MetricCheckOptions
): Promise<void> => {
  const payload = JSON.stringify(log);

  const auditFilePath = options?.auditFilePath ?? process.env.MDC_AUDIT_LOG_PATH;
  if (auditFilePath) {
    await appendFile(auditFilePath, `${payload}\n`, "utf8");
  }

  const auditEndpoint = options?.auditEndpoint ?? process.env.MDC_AUDIT_ENDPOINT;
  if (auditEndpoint) {
    await fetch(auditEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload
    });
  }
};

export const checkMetricDefined = async (
  metricIdentifier: string,
  options: MetricCheckOptions
): Promise<MetricCheckResult> => {
  const { registryPath, entries } = await resolveRegistryPathAndMetrics(options);
  const templatePath = options.templatePath ?? resolve(process.cwd(), DEFAULT_TEMPLATE_PATH);

  const exactIdMatch = entries.find((entry) => entry.id === metricIdentifier);
  if (exactIdMatch) {
    await emitAuditLog(
      {
        timestamp: new Date().toISOString(),
        caller: options.caller,
        metric_identifier: metricIdentifier,
        result: "found",
        canonical_id: exactIdMatch.id
      },
      options
    );

    return {
      status: MetricCheckStatus.FOUND,
      entry: exactIdMatch
    };
  }

  const normalizedIdentifier = normalize(metricIdentifier);
  const nameMatches = entries.filter((entry) => normalize(entry.name) === normalizedIdentifier);

  if (nameMatches.length === 1) {
    await emitAuditLog(
      {
        timestamp: new Date().toISOString(),
        caller: options.caller,
        metric_identifier: metricIdentifier,
        result: "found",
        canonical_id: nameMatches[0].id
      },
      options
    );

    return {
      status: MetricCheckStatus.FOUND,
      entry: nameMatches[0]
    };
  }

  if (nameMatches.length > 1) {
    await emitAuditLog(
      {
        timestamp: new Date().toISOString(),
        caller: options.caller,
        metric_identifier: metricIdentifier,
        result: "ambiguous"
      },
      options
    );

    return {
      status: MetricCheckStatus.AMBIGUOUS,
      blocking_request: buildBlockingRequest(
        MetricCheckStatus.AMBIGUOUS,
        metricIdentifier,
        registryPath,
        templatePath,
        nameMatches
      )
    };
  }

  await emitAuditLog(
    {
      timestamp: new Date().toISOString(),
      caller: options.caller,
      metric_identifier: metricIdentifier,
      result: "not_found"
    },
    options
  );

  return {
    status: MetricCheckStatus.NOT_FOUND,
    blocking_request: buildBlockingRequest(
      MetricCheckStatus.NOT_FOUND,
      metricIdentifier,
      registryPath,
      templatePath
    )
  };
};

export const check_metric_defined = checkMetricDefined;
