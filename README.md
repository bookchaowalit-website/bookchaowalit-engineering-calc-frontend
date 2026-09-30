# Engineering Calculator

An illustrative field instrument for a simply supported beam check: choose a
load case, set span and load, run, and read the maximum bending moment and end
shear with units (kN or kgf), formula and assumptions in view. Educational only; not a
stamped design or safety check.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks on every push (`.github/workflows/ci.yml`).

## Configuration

- `NEXT_PUBLIC_SITE_URL` (optional): canonical origin used for metadata, `/sitemap.xml` and `/robots.txt`. Defaults to `https://bookchaowalit-engineering-calc-frontend.vercel.app`; must be an absolute http(s) URL.
