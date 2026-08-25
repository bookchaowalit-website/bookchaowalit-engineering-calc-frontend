# Engineering Calculator — Design Contract

## World

A field instrument laid on a cool slate workbench: orange control marks, a yellow beam trace, and a dark readout fascia. It treats assumptions as part of the instrument rather than hiding them in a separate help view.

## System

- Palette: deep slate `#314752`, ink `#152632`, mist `#e9eeeb`, orange `#e36f35`, yellow `#f0c765`, blue for symbols.
- Typography: Georgia carries the large readout and measured headline; Avenir/Helvetica-style sans carries operator copy; Courier New is reserved for labels, units, and formulas.
- Composition: input scenario, live readout, and audit notes share one instrument grid. No decorative metric-card dashboard.
- Interaction: switching load cases changes the relevant input and formula; numeric inputs remain labeled; run updates the result and checksum state; clear returns the baseline scenario.
- Responsive: instrument columns stack in operating order—inputs, readout, audit—so the result follows the action on phones.

## Motion

There is no ambient animation. State is communicated through result text, status labels, and the beam diagram; this keeps a calculation surface calm and inspectable.
