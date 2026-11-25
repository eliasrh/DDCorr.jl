# Saturday teaching sources

The student package is in `../saturday`. Its two commands, ready timing files, native catalogue viewer and reference outputs work with the distributed files. These sources are for updating the teaching material.

- `content.mjs` contains the slide text, presenter notes and citations. The scientific illustrations are in `assets/`. The figures from the GraphSplit preprint are credited on their slides and in `figure_sources.json`.
- From the repository root, `node teaching/saturday_sources/build.mjs --final --render` rebuilds the deck in `teaching/saturday` with the same authoring environment as the Friday deck. See [Friday build instructions](../source/BUILD.txt) for its libraries and environment variables.
- `julia teaching/saturday_sources/render_guide.jl` rebuilds the local browser guide from its Markdown source.
- From this source directory run `python3 make_viewer.py ../saturday ../saturday/Catalogues.html` to embed the supplied native input and supported catalogues in the offline viewer. Its MIT licence covers the viewer code. The two bundled scientific programs retain their own licences.
- `python3 run_figures.py ../saturday assets` draws the station counts, matched catalogues, shifts and iteration history from the reference files. `python3 sensitivity_figure.py sensitivity_common.csv assets/field_sensitivity.png` redraws the independent neighbour-rule comparison.
- For the theory figures, first run the baseline as in Start Here. From this directory use `python3 theory_figures.py ../saturday/runs/baseline ../saturday/runs/baseline ../saturday/runs/baseline/graphsplit_output assets`. The Python plotting environment needs NumPy and Matplotlib. `teaching_edges.csv` is the geometry and observation support used for the graph panel. Its Julia exporter uses a GraphSplit environment at the pinned revision.
- The image of the overlapping RODG event cuts is from the Friday classroom archive. The Holuhraun Landsat photograph is from NASA Earth Observatory, Jesse Allen, 6 September 2014.
