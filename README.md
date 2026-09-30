# Engineering Calculator

An illustrative field instrument for a simply supported beam check: choose a
load case, set span and load, run, and read the maximum bending moment and end
shear with units, formula and assumptions in view. Educational only; not a
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
