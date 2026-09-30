"use client";

import { useState } from "react";
import { formulaFor, LOAD_CASES as loadCases, LOAD_RANGE, loadUnit, solve, SPAN_RANGE, validate, type LoadCaseId } from "../lib/beam";

export default function Home() {
  const [caseId, setCaseId] = useState<LoadCaseId>("uniform");
  const [span, setSpan] = useState(4.2);
  const [load, setLoad] = useState(4);
  const [result, setResult] = useState<{ moment: number; shear: number } | null>(null);
  const [stale, setStale] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [runNumber, setRunNumber] = useState(1);
  const selected = loadCases.find((item) => item.id === caseId) ?? loadCases[0];
  const formula = formulaFor(selected.id);
  const unit = "kN·m";
  const displayResult = result ? result.moment.toFixed(2) : "0.00";
  const chooseCase = (nextId: LoadCaseId) => { const next = loadCases.find((item) => item.id === nextId) ?? loadCases[0]; setCaseId(next.id); setLoad(next.baseLoad); setResult(null); setStale(false); setErrors([]); };
  const edit = (setter: (value: number) => void, value: string) => { setter(value === "" ? Number.NaN : Number(value)); if (result) setStale(true); };
  const calculate = () => { const check = validate(span, load); if (!check.ok) { setErrors(check.errors); return; } setErrors([]); setResult(solve(selected.id, span, load)); setStale(false); setRunNumber((value) => value + 1); };
  const reset = () => { setCaseId("uniform"); setSpan(4.2); setLoad(4); setResult(null); setStale(false); setErrors([]); setRunNumber(1); };
  const status = !result ? "STANDBY" : stale ? "STALE — RUN AGAIN" : "UPDATED";

  return (
    <main className="calc-page">
      <div className="calc-shell">
        <header className="calc-header"><a className="calc-brand" href="#instrument" aria-label="Engineering Calculator home"><span className="calc-mark">EC</span><span>ENGINEERING CALC</span></a><div className="calc-header-meta"><span>FIELD INSTRUMENT / BEAM 01</span><span className="calc-online"><i /> READY</span></div><span className="calc-serial">CASE {String(runNumber).padStart(3, "0")}</span></header>

        <section className="calc-hero"><div><h1>A small instrument<br /><em>for clear checks.</em></h1><p>Set the scenario. Keep the units next to the numbers. Run one illustrative simply-supported beam check and leave the assumptions in view.</p></div><div className="calc-warning"><span>USE BOUNDARY</span><strong>ILLUSTRATIVE<br />ONLY</strong><small>Not a stamped design, safety check, or engineering approval.</small></div></section>

        <section className="instrument-grid" id="instrument">
          <aside className="input-panel"><div className="calc-section-label"><span>01 / INPUT SCENARIO</span><span>SELECT ONE</span></div><div className="case-list">{loadCases.map((item) => <button key={item.id} type="button" aria-pressed={item.id === selected.id} className={item.id === selected.id ? "case-row is-active" : "case-row"} onClick={() => chooseCase(item.id)}><span className="case-symbol">{item.symbol}</span><span><strong>{item.label}</strong><small>{item.note}</small></span><b aria-hidden="true">{item.id === selected.id ? "ON" : ""}</b></button>)}</div><div className="input-fields"><label htmlFor="span">Span length <span>m</span><input id="span" type="number" min={SPAN_RANGE.min} max={SPAN_RANGE.max} step="0.1" inputMode="decimal" value={Number.isNaN(span) ? "" : span} aria-invalid={errors.some((error) => error.startsWith("Span"))} onChange={(event) => edit(setSpan, event.target.value)} /></label><label htmlFor="load">{selected.id === "point" ? "Point load" : "Distributed load"} <span>{loadUnit(selected.id)}</span><input id="load" type="number" min={LOAD_RANGE.min} max={LOAD_RANGE.max} step="0.1" inputMode="decimal" value={Number.isNaN(load) ? "" : load} aria-invalid={errors.some((error) => error.startsWith("Load"))} onChange={(event) => edit(setLoad, event.target.value)} /></label></div>{errors.length ? <ul className="calc-errors" role="alert">{errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}<button type="button" className="calc-run" onClick={calculate}>Run calculation <span aria-hidden="true">↗</span></button><button type="button" className="calc-reset" onClick={reset}>Clear instrument</button></aside>

          <section className="readout-panel" aria-labelledby="result-title"><div className="calc-section-label"><span>02 / LIVE READOUT</span><span>SI UNITS</span></div><div className="beam-visual" aria-hidden="true"><span className="beam-support left" /><span className="beam-support right" /><span className="beam-line" /><span className="beam-load load-one" /><span className="beam-load load-two" /><span className="beam-load load-three" /></div><div className="result-head"><span>MAXIMUM BENDING MOMENT</span><span>RESULT / {status}</span></div><div className="result-number" id="result-title" aria-live="polite"><strong>{displayResult}</strong><span>{unit}</span></div><div className="formula-line"><span>FORMULA</span><strong>{formula.moment}</strong></div><div className="formula-line"><span>MAX SHEAR</span><strong>{result ? `${result.shear.toFixed(2)} kN` : "—"} · {formula.shear}</strong></div><div className="readout-strip"><span><b>{Number.isNaN(span) ? "—" : span.toFixed(1)}</b> m span</span><span><b>{Number.isNaN(load) ? "—" : load}</b> {loadUnit(selected.id)} {selected.label.toLowerCase()}</span></div></section>

          <aside className="audit-panel"><div className="calc-section-label"><span>03 / AUDIT NOTES</span><span>VISIBLE</span></div><ol className="audit-list"><li><span>01</span><p><strong>Model</strong>Simply supported beam</p></li><li><span>02</span><p><strong>Scenario</strong>{selected.note}</p></li><li><span>03</span><p><strong>Units</strong>Length in metres, force in kN</p></li><li><span>04</span><p><strong>Material</strong>Not specified in this illustrative check</p></li></ol><div className="audit-tape"><span>CHECKSUM</span><strong>{!result ? "WAITING" : stale ? "STALE" : "RECORDED"}</strong><small>Change an input and run again to update the readout.</small></div></aside>
        </section>
        <footer className="calc-footer"><span>ENGINEERING CALC / FIELD INSTRUMENT</span><span>EDUCATIONAL DEMO · VERIFY WITH A QUALIFIED ENGINEER</span></footer>
      </div>
    </main>
  );
}
