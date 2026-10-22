# DDCorr.jl minicourse

Open [DDCorr_minicourse.pptx](DDCorr_minicourse.pptx). The revised 84-slide deck has five clearly marked sections and introduces coefficient and lag before the first run.

| Slides | Section |
|---|---|
| 1–17 | Orientation and synthetic quick start: setup, TOML, directories, IDs, pair selection |
| 18–36 | Finding real event/station/waveform data, Python isolation, phase provenance and SAC headers |
| 37–46 | Running the 100-event example and assessing PNG reports, matrices and output files |
| 47–79 | Following one waveform: filters, aliasing, windows, correlation, lag, SNR and graph checks |
| 80–84 | Independent discovery/preparation/assessment exercise |

For a short session, use the first three sections and choose method slides as needed. A full treatment plus data preparation needs a longer practical session. Students need basic P/S and waveform familiarity, but no prior correlation/filtering course.

Text, commands and tables remain editable in PowerPoint. Scientific figures, properly typeset equations and exact code excerpts are **PNG images**, with generation/equation source included. There are no vector chart/PDF/SVG figure assets in this edition. Fonts are Helvetica Neue and Menlo; check substitution on the teaching computer. The deck was rendered and layout-checked, but has not been opened in the native PowerPoint application.

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
