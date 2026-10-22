# Response to the October slide/code review

The deck has been reorganized into 84 slides. Numbers below in the first column refer to the **old** deck; the last column points to the revised material. Code changes are in version 0.2.0.

| Original comment | Change | Revised location |
|---|---|---|
| 2: lag missing | Coefficient and lag introduced together; fixed A / shifted B figure | 2–3 |
| 4: ZIP, versions, OS, environments, Project/Manifest | Instructor ZIP route, tested versions/platform limits, both Julia files explained | 6–7; START_HERE.md |
| 5: generator/options/inspect result | Explain constructed data, expected 72 files, successful 6-event inspection, no correlation by design | 8–11 |
| 6: TOML, sections, lag, min_cc | TOML introduced as experiment settings; exact P block and coefficient r naming | 12–13 |
| 7: cryptic folders | New inspect_/correlate_ date prefixes, run_info.toml, per-run README.txt | 10; src/interface.jl |
| 8: nonnumeric IDs, other files, keeping directory | Exact map columns, lexical folder labels, complete generated run guide and handoff explanation | 14–17; START_HERE.md |
| 9/10/12: expose SAC header and trace | New bin/sac_info.jl terminal inspector with optional PNG | 34–36 |
| 13: unnamed archive/services/script | Explicit EarthScope/IRIS context; event/station/dataselect distinctions and script path | 19–21 |
| 14: Python/venv/pip across OS | Isolated environment, direct interpreter paths, packages explained, PowerShell alternative | 22–23 |
| 15: unexplained CSV, too-small case | New table import/discovery commands; chronological 100-event / 12-station selection with receipts | 24–33; DATA_DISCOVERY.md |
| 16: event/pick table sources and provenance | Regional/FDSN/QuakeML routes, analyst/picker sources, missing-pick handling and prediction limitations | 24–28 |
| 17: which manifest? | Exact work/iceland100/manifest.json and difference from Julia Manifest.toml | 32 |
| 21/23: demonstrate operations/follow one waveform | Actual computed waveform-stage figure plus code; taper zoom; real noisy examples | 40–41, 48–52 |
| 27: bandpass, phase, corners, squaring | Actual response plot, properly rendered equations and definitions | 53–57 |
| 28: premature acceptance/ambiguity terms | Quality checks introduced after correlation, peaks and component SNR | 73–76 |
| 29: aliasing/filter definition | 12 Hz → 8 Hz alias example; FIR/low-pass role before decimation | 58–60 |
| 30–32: purpose of windows/noise/padding | Core/search/noise timeline and finite-window comparison diagram | 61–64 |
| 34: proper math, correlation too late | Correlation concept at slide 2; typeset normalized formula | 2–3, 63 |
| 36–38: symmetry only matters for core versus wider trace | Distinct fixed cores and opposite moving windows shown; correct scope of symmetry claim | 64–66 |
| 39: events years apart, fixed/moving sign, origin errors | Explicit convention and reduced-time formula; origin errors remain for relocation | 3, 69–70 |
| 40: half-sample clamp redundant | Removed redundant clamp; explain fractional vertex versus total lag | 71; src/signal.jl |
| 41: one horizontal lacks S energy | Per-component SNR exclusions; public S.min_components=1 course default; mining preset retains 2; regression test | 73–74 |
| 44: exact configuration keys | Exact advanced TOML keys plus public override mechanism | 75–76 |
| 45: nonexistent output-id column, unnamed report | Use event_id and original_event_id; name report.html throughout | 14–17, 45 |
| 46: missing matrices/PNG/exact syntax/no vectors | PNG station/phase heatmaps, index and status CSV, exact dense=true block; removed PDF output/links | 43–44; src/matrix_plots.jl |
| 47: excessive timing precision | Four-decimal default, advanced output.dt_decimals, internal Float64 unchanged | 72; src/defaults.toml |
| 52: show noise | Actual marginal/noisy real correlation and flagged near-identical pair | 40–41 |
| 54–56: practical investigation and separate solutions | Discovery→SAC→assessment exercise; separate instructor guide excluded from student ZIP | 80–84; docs/EXERCISES.md; teaching/instructor |
| Jarring transitions | Five named sections and section footers | Full deck |
| Manual pairs do not show only requested IDs | Both ID types shown; original-name alternative; filters by station/phase; explicit pairs bypass auto cap; selection ledger | 15–16; 16-figure integration check |

The 100-event test uses labelled homogeneous predicted centres, not observed picks. Twelve selected stations produced 11 usable stations in the existing archive; STJA's missing data remain documented. Counts and near-identity warnings are evidence to inspect, not claims of catalogue completeness or independently validated phases.
