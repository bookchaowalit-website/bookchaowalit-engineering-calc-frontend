import { describe, expect, it } from "vitest";
import { formulaFor, fromKn, KGF_PER_KN, loadUnit, momentUnit, roundForUnit, solve, toKn, validate } from "./beam";

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

describe("unit conversion", () => {
  it("uses standard gravity: 1 kN ≈ 101.97 kgf", () => {
    expect(KGF_PER_KN).toBeCloseTo(101.9716, 4);
    expect(fromKn(1, "kgf")).toBeCloseTo(101.9716, 4);
    expect(toKn(1000, "kgf")).toBeCloseTo(9.80665, 5);
    expect(toKn(fromKn(4.2, "kgf"), "kgf")).toBeCloseTo(4.2, 10);
    expect(fromKn(3, "kN")).toBe(3);
  });

  it("labels loads and moments in the chosen unit", () => {
    expect(loadUnit("uniform", "kgf")).toBe("kgf/m");
    expect(loadUnit("point", "kgf")).toBe("kgf");
    expect(momentUnit("kgf")).toBe("kgf·m");
    expect(momentUnit()).toBe("kN·m");
  });

  it("validates kgf input against the same physical range", () => {
    expect(validate(4, 400, "kgf")).toEqual({ ok: true });
    expect(validate(4, 5, "kgf")).toEqual({ ok: false, errors: ["Load must be between 10 and 5099 kgf."] });
    expect(roundForUnit(fromKn(LOAD_MAX_KN, "kgf"), "kgf")).toBe(5099);
  });

  it("gives the same physical moment whichever unit the load was entered in", () => {
    const kn = solve("uniform", 5, 4).moment;
    const viaKgf = fromKn(solve("uniform", 5, toKn(fromKn(4, "kgf"), "kgf")).moment, "kgf");
    expect(viaKgf).toBeCloseTo(kn * KGF_PER_KN, 8);
  });
});

const LOAD_MAX_KN = 50;
