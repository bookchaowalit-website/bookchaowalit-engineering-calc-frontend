export type LoadCaseId = "uniform" | "point" | "service";
export type LoadCase = { id: LoadCaseId; label: string; note: string; symbol: string; baseLoad: number };

export const LOAD_CASES: LoadCase[] = [
  { id: "uniform", label: "Uniform load", note: "Load distributed across the span", symbol: "w", baseLoad: 4 },
  { id: "point", label: "Mid-span point", note: "Single illustrative load at centre", symbol: "P", baseLoad: 7 },
  { id: "service", label: "Service check", note: "Lower illustrative working load", symbol: "q", baseLoad: 2.5 },
];

export const SPAN_RANGE = { min: 1, max: 12 } as const;
export const LOAD_RANGE = { min: 0.1, max: 50 } as const;

export function isPointLoad(caseId: LoadCaseId): boolean {
  return caseId === "point";
}

export function formulaFor(caseId: LoadCaseId): { moment: string; shear: string } {
  return isPointLoad(caseId) ? { moment: "M = P · L / 4", shear: "V = P / 2" } : { moment: "M = w · L² / 8", shear: "V = w · L / 2" };
}

export function loadUnit(caseId: LoadCaseId): string {
  return isPointLoad(caseId) ? "kN" : "kN/m";
}

export type Validation = { ok: true } | { ok: false; errors: string[] };

export function validate(span: number, load: number): Validation {
  const errors: string[] = [];
  if (!Number.isFinite(span) || span < SPAN_RANGE.min || span > SPAN_RANGE.max) errors.push(`Span must be between ${SPAN_RANGE.min} and ${SPAN_RANGE.max} m.`);
  if (!Number.isFinite(load) || load < LOAD_RANGE.min || load > LOAD_RANGE.max) errors.push(`Load must be between ${LOAD_RANGE.min} and ${LOAD_RANGE.max}.`);
  return errors.length ? { ok: false, errors } : { ok: true };
}

/**
 * Simply supported beam: maximum bending moment (kN·m) and maximum end shear (kN).
 * Uniform/service: M = wL²/8, V = wL/2. Mid-span point: M = PL/4, V = P/2.
 */
export function solve(caseId: LoadCaseId, span: number, load: number): { moment: number; shear: number } {
  if (isPointLoad(caseId)) return { moment: (load * span) / 4, shear: load / 2 };
  return { moment: (load * span * span) / 8, shear: (load * span) / 2 };
}
