# DDCorr.jl minicourse

Open [DDCorr_minicourse.pptx](DDCorr_minicourse.pptx) in PowerPoint. The 60 slides start with installation and a complete first run, then explain the signal processing, differential-time convention, quality checks, and graph-method handoff. Speaker notes contain fuller explanations, exercise answers, citations, and exact source excerpts.

Text, mathematical expressions, tables, and four illustrative charts are editable PowerPoint objects. Expressions use editable Unicode text rather than raster equations. The line-numbered code excerpts and actual diagnostic plot are images. Their original source, line ranges, and full explanations are preserved in the notes and accompanying files. Fonts are Helvetica Neue and Menlo; inspect wrapping if your computer substitutes other fonts.

## Teaching route

| Slides | Topic | Suggested use |
| --- | --- | --- |
| 1–8 | Installation, synthetic example, configuration, outputs | Run the first exercise together. |
| 9–18 | SAC headers, time references, archive download and picks | Inspect one file before starting correlation. |
| 19–33 | Code structure, sampling, filtering, resampling, windows and SNR | Explain each processing choice with its implementation. |
| 34–44 | Normalized correlation, lag sign, interpolation, horizontal components and rejection rules | Calculate a small example and follow one measured pair. |
| 45–53 | Diagnostics, matrices, graph methods, resources and actual synthetic results | Compare an output with its truth table. |
| 54–60 | Exercises, troubleshooting and scientific handoff | Work through one controlled change at a time. |

Allow roughly two hours for the explanations plus practical time. For a shorter session, run slides 1–18 first and use the later sections as reference. The deck assumes basic knowledge of seismic waveforms and P/S phases, but no prior digital-filtering or correlation course.

Students should begin with the repository [README](../README.md), then use the [exercises](../docs/EXERCISES.md). The [data and SAC guide](../docs/DATA_AND_SAC.md) gives the complete input contract. The [handoff guide](../docs/OUTPUTS_AND_HANDOFF.md) explains DDSync and GraphSplit inputs and the limits of the small teaching test.

## What the checked examples demonstrate

The default synthetic run contains six events and 72 SAC files. It produced 80 accepted station-phase observations: 40 P and 40 S. The noise-only control remained in the catalogue with no accepted observations. Maximum absolute differential-time error against the synthetic truth was 0.567 ms. This is a controlled timing check, not a claim about real-catalogue accuracy.

The real-data lesson uses six events selected as three close catalogue pairs before inspecting their correlations. Three stations yielded 54 SAC files and 12 accepted observations with the default settings. Its P and S headers contain simple predicted times, clearly identified in the acquisition manifest; they are not observed Cambridge picks. The separate four-event format example produced no accepted observations. Both outcomes are useful for learning to inspect phase windows and quality exclusions.

## Files and source traceability

- [LECTURE_NOTES.md](LECTURE_NOTES.md) contains the slide explanations, answers, source excerpts and external references in searchable text.
- [source/code_index.json](source/code_index.json) maps each code screenshot to repository files and one-based line ranges.
- [source/PROVENANCE.json](source/PROVENANCE.json) records the source and asset SHA256 values used for this edition. Rebuild the excerpts if these implementation files change.
- [source/content.mjs](source/content.mjs) contains all slide content and the constructed chart data.
- [assets/synthetic_alignment.png](assets/synthetic_alignment.png) is the complete actual DDCorr diagnostic image used on slide 52. The other PNGs are exact line-numbered source excerpts.

The complete deck was rendered and visually inspected. Package structure, slide geometry, source references, and native table/chart objects were checked. It has not been opened in the native PowerPoint application, so check font substitution and presenter-note display on the teaching computer before the course.

## Rebuilding the deck

Editing the PowerPoint requires no authoring tools. Rebuilding from JavaScript is optional and requires Node.js, `@oai/artifact-tool`, `@napi-rs/canvas`, and the presentation skill utilities used by the Codex workspace. These authoring dependencies are separate from Julia and are not needed by students running DDCorr.

With those modules available to Node, set `PRESENTATION_SKILL_DIR` to the installed presentations skill directory and `PYTHON_EXECUTABLE` to the Python interpreter used for its validation utilities. Run:

```sh
node teaching/source/build.mjs
```

This writes a draft, slide renders and source-excerpt images under `work/slides-build/`. It also regenerates `LECTURE_NOTES.md`. To validate and write a separate final file, use:

```sh
node teaching/source/build.mjs --final
```

The default rebuilt filename is `teaching/DDCorr_minicourse_rebuilt.pptx`. The finalizer refuses to overwrite an existing final file or validation receipt. For another edition, choose a fresh `DDCORR_SLIDES_BUILD` directory and `DDCORR_SLIDES_OUTPUT` filename. `RUNTIME_NODE_MODULES` may also be required by the validation helper to locate the same installed artifact-tool runtime.
