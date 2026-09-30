# Upgrade plan

## Current state

Score: 7/10 (was 5/10) — beam math is tested and validated, results flag staleness, shear added; CI in place.

## Backlog

- P1: Deflection check (needs E and I inputs, clearly labelled illustrative).
- P1: Unit toggle (kN/m ↔ kgf/m) with tested conversions.
- P2: Draw the load/shear/moment diagrams from the solved values instead of the static beam visual.
- P2: Playwright smoke test for case switch → run → reset.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- Beam math moved to `lib/beam.ts` (tested): moment + end shear for uniform/service (wL²/8, wL/2) and point (PL/4, P/2) cases, input validation.
- Fixed silent bad input: an empty field used to compute with 0 and out-of-range values were accepted; errors now show in an alert list with `aria-invalid` fields.
- Results are marked STALE when inputs change after a run; case buttons expose `aria-pressed`; added README and ignored `*.tsbuildinfo`.
