# DDCorr.jl minicourse

Open [DDCorr_minicourse.pptx](DDCorr_minicourse.pptx). This edition contains 100 slides. The introduction uses editable scientific diagrams, a numerical example and a workflow diagram. Commands identify the required executable and current configuration explicitly.

| Slides | Section |
|---|---|
| 1–5 | Single-event location, shared paths, double differences and the course workflow |
| 6–27 | Correlation concepts, synthetic run, output files and parameter experiments |
| 28–51 | Data discovery, Python setup, a five-event/three-station download and SAC headers |
| 52–62 | Real-data processing, larger reference results and matrix export |
| 63–95 | Signal processing, cross-correlation mathematics, implementation and quality checks |
| 96–100 | Independent exercise and assessment |

Students can follow the commands without access to the instructor’s chat history. Text, commands, tables and introductory diagrams are editable PowerPoint objects. Scientific plots, equations and exact code excerpts are PNG images with the generation source included. Windows PowerShell commands are in [docs/WINDOWS.md](../docs/WINDOWS.md).

The small real-data request was tested with five events and three selected stations, producing 45 SAC traces. Counts from the separate 100-event reference run are not targets for that small test. The source catalogue has no observed phase-pick table, so the demonstration explicitly uses predicted window centres.

## Student materials

- [Start here](../docs/START_HERE.md): ZIP/Git, Julia and Python versions, expected console messages, named output folders, exact pair/matrix settings.
- [Data discovery](../docs/DATA_DISCOVERY.md): where tables come from; event-service and regional-catalogue routes; station codes; observed versus predicted phase times.
- [Exercise](../docs/EXERCISES.md): find information, build SAC, run and assess evidence, without a solved command sequence.
- [Lecture notes](LECTURE_NOTES.md): searchable slide text, explanations, source excerpts and citations.

The worked [instructor solution guide](instructor/INSTRUCTOR_SOLUTIONS.md) is separate and should be distributed after the exercise. The student ZIP excludes that directory.

Instructors can rebuild the handout from a Git checkout with `python3 scripts/package_students.py --output ../DDCorr_student_package.zip`. It includes the code, slides, student guides and figure sources, but excludes local runs, environments, downloaded waveforms and the instructor directory. A checksum list records the packaged files.

## Examples and source traceability

The synthetic case retains 80 accepted observations and an isolated noise control. Maximum timing error after the four-decimal export is 0.6 ms against known truth. The larger cached-archive example selected 100 events and 12 stations, obtained 3,300 SAC files from 11 available stations and accepted 7,037 observations. Predictions are labelled; no claim of observed Cambridge picks is made. Its 22 near-identity flags include catalogue entries only 0.06 s apart, explicitly shown as a QC warning.

`source/code_index.json` maps screenshots to exact source lines. `source/PROVENANCE.json` records source/asset hashes. `source/content.mjs` holds slide text and notes. `source/make_figures.py` produces scientific PNGs; `export_trace.jl` and `export_examples.jl` export exact computed arrays. `assets/equations.json` contains the LaTeX used to render each equation. Figure input arrays are retained in `source/figure_data`, so the supplied figures can be rebuilt without raw waveform downloads.

## Optional rebuild

Editing the PPTX requires none of these authoring tools. Rebuilding it uses Node.js, `@oai/artifact-tool`, `@napi-rs/canvas`, and the presentation skill utilities in the authoring environment. Set `PRESENTATION_SKILL_DIR`, `RUNTIME_NODE_MODULES` and `PYTHON_EXECUTABLE` to the corresponding installed tools. `node teaching/source/build.mjs` writes a draft and renders under `work/slides-build`. Add `--final` to validate a separate final file. Use fresh `DDCORR_SLIDES_BUILD` and `DDCORR_SLIDES_OUTPUT` paths for each finalized edition; the finalizer does not overwrite a previous final artifact.

To regenerate PNGs with the optional ObsPy environment (which includes the plotting dependencies), run `python teaching/source/make_figures.py teaching/source/figure_data` from the repository root. Code excerpts regenerate during the deck build. Keep source hashes and screenshots together when code changes.
