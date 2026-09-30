import { describe, expect, it } from "vitest";
import { formulaFor, loadUnit, solve, validate } from "./beam";

describe("solve", () => {
  it("uses wL²/8 and wL/2 for distributed loads", () => {
    const result = solve("uniform", 4, 10);
    expect(result.moment).toBeCloseTo(20);
    expect(result.shear).toBeCloseTo(20);
    expect(solve("service", 6, 2).moment).toBeCloseTo(9);
  });

  it("uses PL/4 and P/2 for a mid-span point load", () => {
    const result = solve("point", 4.2, 7);
    expect(result.moment).toBeCloseTo(7.35);
    expect(result.shear).toBeCloseTo(3.5);
  });
});

describe("validate", () => {
  it("accepts in-range values", () => {
    expect(validate(4.2, 4)).toEqual({ ok: true });
  });

  it("rejects empty, NaN and out-of-range input", () => {
    expect(validate(0, 4)).toMatchObject({ ok: false });
    expect(validate(Number.NaN, 4)).toMatchObject({ ok: false });
    const both = validate(20, 0);
    expect(both.ok ? [] : both.errors).toHaveLength(2);
  });
});

describe("labels", () => {
  it("matches formula and unit to the load case", () => {
    expect(formulaFor("point").moment).toBe("M = P · L / 4");
    expect(formulaFor("uniform").moment).toBe("M = w · L² / 8");
    expect(loadUnit("point")).toBe("kN");
    expect(loadUnit("service")).toBe("kN/m");
  });
});
