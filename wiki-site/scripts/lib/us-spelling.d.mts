// Types for the shared word list, so the TypeScript importers of this module
// (the Quora export importer) typecheck against it rather than falling back to
// `any`. The list itself stays in the .mjs, which the plain-node gates run.

export interface SpellingRule {
  british: string;
  us: string;
  requireSuffix?: string;
  wholeWord?: boolean;
}

export declare const RULES: SpellingRule[];
export declare const PATTERNS: Array<{ rule: SpellingRule; pattern: RegExp }>;
export declare function toUsEnglish(text: string): string;
export declare function differsOnlyInDialect(before: string, after: string): boolean;
