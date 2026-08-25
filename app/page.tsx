"use client";

import { useMemo, useState } from "react";

type LoadCase = { id: string; label: string; note: string; symbol: string; baseLoad: number };
const loadCases: LoadCase[] = [
  { id: "uniform", label: "Uniform load", note: "Load distributed across the span", symbol: "w", baseLoad: 4 },
  { id: "point", label: "Mid-span point", note: "Single illustrative load at centre", symbol: "P", baseLoad: 7 },
  { id: "service", label: "Service check", note: "Lower illustrative working load", symbol: "q", baseLoad: 2.5 },
];

export default function Home() {
  const [caseId, setCaseId] = useState("uniform");
  const [span, setSpan] = useState(4.2);
  const [load, setLoad] = useState(4);
  const [result, setResult] = useState(0);
  const [runNumber, setRunNumber] = useState(1);
  const selected = loadCases.find((item) => item.id === caseId) ?? loadCases[0];
  const formula = selected.id === "point" ? "M = P · L / 4" : "M = w · L² / 8";
  const unit = selected.id === "point" ? "kN·m" : "kN·m";
  const displayResult = useMemo(() => result.toFixed(2), [result]);
  const chooseCase = (nextId: string) => { const next = loadCases.find((item) => item.id === nextId) ?? loadCases[0]; setCaseId(next.id); setLoad(next.baseLoad); setResult(0); };
  const calculate = () => { const nextResult = selected.id === "point" ? load * span / 4 : load * span * span / 8; setResult(nextResult); setRunNumber((value) => value + 1); };
  const reset = () => { setCaseId("uniform"); setSpan(4.2); setLoad(4); setResult(0); setRunNumber(1); };

  return (
    <main className="calc-page">
      <div className="calc-shell">
        <header className="calc-header"><a className="calc-brand" href="#instrument" aria-label="Engineering Calculator home"><span className="calc-mark">EC</span><span>ENGINEERING CALC</span></a><div className="calc-header-meta"><span>FIELD INSTRUMENT / BEAM 01</span><span className="calc-online"><i /> READY</span></div><span className="calc-serial">CASE {String(runNumber).padStart(3, "0")}</span></header>

        <section className="calc-hero"><div><h1>A small instrument<br /><em>for clear checks.</em></h1><p>Set the scenario. Keep the units next to the numbers. Run one illustrative simply-supported beam check and leave the assumptions in view.</p></div><div className="calc-warning"><span>USE BOUNDARY</span><strong>ILLUSTRATIVE<br />ONLY</strong><small>Not a stamped design, safety check, or engineering approval.</small></div></section>

        <section className="instrument-grid" id="instrument">
          <aside className="input-panel"><div className="calc-section-label"><span>01 / INPUT SCENARIO</span><span>SELECT ONE</span></div><div className="case-list">{loadCases.map((item) => <button key={item.id} type="button" className={item.id === selected.id ? "case-row is-active" : "case-row"} onClick={() => chooseCase(item.id)}><span className="case-symbol">{item.symbol}</span><span><strong>{item.label}</strong><small>{item.note}</small></span><b aria-hidden="true">{item.id === selected.id ? "ON" : ""}</b></button>)}</div><div className="input-fields"><label htmlFor="span">Span length <span>m</span><input id="span" type="number" min="1" max="12" step="0.1" value={span} onChange={(event) => setSpan(Number(event.target.value))} /></label><label htmlFor="load">{selected.id === "point" ? "Point load" : "Distributed load"} <span>{selected.id === "point" ? "kN" : "kN/m"}</span><input id="load" type="number" min="0.1" max="50" step="0.1" value={load} onChange={(event) => setLoad(Number(event.target.value))} /></label></div><button type="button" className="calc-run" onClick={calculate}>Run calculation <span aria-hidden="true">↗</span></button><button type="button" className="calc-reset" onClick={reset}>Clear instrument</button></aside>

          <section className="readout-panel" aria-labelledby="result-title"><div className="calc-section-label"><span>02 / LIVE READOUT</span><span>SI UNITS</span></div><div className="beam-visual" aria-hidden="true"><span className="beam-support left" /><span className="beam-support right" /><span className="beam-line" /><span className="beam-load load-one" /><span className="beam-load load-two" /><span className="beam-load load-three" /></div><div className="result-head"><span>MAXIMUM BENDING MOMENT</span><span>RESULT / {runNumber > 1 ? "UPDATED" : "STANDBY"}</span></div><div className="result-number" id="result-title" aria-live="polite"><strong>{displayResult}</strong><span>{unit}</span></div><div className="formula-line"><span>FORMULA</span><strong>{formula}</strong></div><div className="readout-strip"><span><b>{span.toFixed(1)}</b> m span</span><span><b>{load}</b> {selected.id === "point" ? "kN" : "kN/m"} {selected.label.toLowerCase()}</span></div></section>

          <aside className="audit-panel"><div className="calc-section-label"><span>03 / AUDIT NOTES</span><span>VISIBLE</span></div><ol className="audit-list"><li><span>01</span><p><strong>Model</strong>Simply supported beam</p></li><li><span>02</span><p><strong>Scenario</strong>{selected.note}</p></li><li><span>03</span><p><strong>Units</strong>Length in metres, force in kN</p></li><li><span>04</span><p><strong>Material</strong>Not specified in this illustrative check</p></li></ol><div className="audit-tape"><span>CHECKSUM</span><strong>{result ? "RECORDED" : "WAITING"}</strong><small>Change an input and run again to update the readout.</small></div></aside>
        </section>
        <footer className="calc-footer"><span>ENGINEERING CALC / FIELD INSTRUMENT</span><span>EDUCATIONAL DEMO · VERIFY WITH A QUALIFIED ENGINEER</span></footer>
      </div>
    </main>
  );
}
