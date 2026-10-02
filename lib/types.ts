export const AUDIENCES = [
  "Student",
  "Tenant",
  "Migrant / visa applicant",
  "Small business owner",
  "Benefits applicant",
  "Someone dealing with fines",
] as const;

export const MIN_INPUT_CHARS = 20;
export const MAX_INPUT_CHARS = 12000;

export type TranslationResult = {
  plain_english?: string;
  key_points?: string[];
  what_it_means_for_you?: string[];
  action_checklist?: string[];
  confidence_notes?: string[];
  preservation_warnings?: string[];
};
