# Upgrade plan

## Current state

Score: 8/10 (was 7/10) — beam math is tested and validated, results flag staleness, shear added; CI in place.

## Backlog

- P1: Deflection check (needs E and I inputs, clearly labelled illustrative).
- P2: Draw the load/shear/moment diagrams from the solved values instead of the static beam visual.
- P2: Playwright smoke test for case switch → run → reset.

## Done in this pass

- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, vitest, `next build` on every push and PR.
- Beam math moved to `lib/beam.ts` (tested): moment + end shear for uniform/service (wL²/8, wL/2) and point (PL/4, P/2) cases, input validation.
- Fixed silent bad input: an empty field used to compute with 0 and out-of-range values were accepted; errors now show in an alert list with `aria-invalid` fields.
- Results are marked STALE when inputs change after a run; case buttons expose `aria-pressed`; added README and ignored `*.tsbuildinfo`.

## Done in this pass (pass 2)

- Added config-driven canonical host (the app had no sitemap or robots at all): `lib/site.ts` resolves `NEXT_PUBLIC_SITE_URL` (validated; clear error on a non-http(s) value, default is the Vercel project URL) and feeds `metadataBase` plus generated `app/sitemap.ts` / `app/robots.ts` (`/api/` disallowed), matching the portfolio-wide pattern. Tested in `lib/site.test.ts`.
- kN ↔ kgf unit toggle (standard gravity, 1 kN ≈ 101.97 kgf): load input, validation range and messages, moment/shear readout and audit note follow the chosen unit; switching converts the current load. Conversions and unit-aware validation tested in `lib/beam.test.ts`.

## Done in this pass (pass 3)
- Edge-case pass on `lib/beam.ts` (regression tests in `lib/beam.test.ts`):
  - kgf validation compared the input with bounds *rounded to nearest*
    (10..5099 kgf), so 10 kgf (0.098 kN) and 5099 kgf (50.003 kN) passed and
    were solved outside the 0.1-50 kN range. Validation now checks the kN value
    and the advertised/input `min`/`max` are rounded inwards (11..5098 kgf).
  - Switching units at the limit produced an invalid value (0.1 kN -> 10 kgf);
    `convertLoad` keeps an in-range load in range.
- Security deps: `next` 16.1.6 -> 16.3.8 (and `eslint-config-next`) clears critical GHSA-2xp9-vwfh-vxw4 (Image Optimization RCE) plus bundled postcss/sharp highs; lockfile regenerated with same-major `npm audit fix`. `npm audit --omit=dev`: C1/H2/M0/L0 [next:c,postcss:h,sharp:h] -> C0/H0/M0/L0.
