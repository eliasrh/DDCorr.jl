DDCorr CORRELATE
Status: complete
Folder time is UTC.

This is a correlation run. Open report.html in a browser when figures are enabled.
Keep this directory's catalog, ID map and dt.cc together: they describe the same event IDs.

catalog.txt
  Origin and location, optional penultimate SAC magnitude, and final sequential event ID. See event_id_map.csv for magnitude availability.
coefficient_audit.csv
  Sampled and fitted lags and signed coefficients for each accepted observation, including the source of the export weight.
correlations.csv
  Accepted pairs with signed coefficient, lag, SNR and components.
dt.cc
  Accepted differential travel times for DDSync; no self-pairs.
effective_config.toml
  The settings used for this run, including defaults and overrides.
event_connectivity.csv
  Number of distinct linked events, including zero.
event_id_map.csv
  event_id is the new integer; original_event_id is the folder label.
example_01_Z7.DYSA_P.png
  Raster diagnostic figure, also linked from report.html.
example_02_Z7.FLUR_P.png
  Raster diagnostic figure, also linked from report.html.
example_03_Z7.HRIM_P.png
  Raster diagnostic figure, also linked from report.html.
example_04_Z7.KATT_P.png
  Raster diagnostic figure, also linked from report.html.
example_05_Z7.KVER_P.png
  Raster diagnostic figure, also linked from report.html.
example_06_Z7.MOFO_P.png
  Raster diagnostic figure, also linked from report.html.
example_07_Z7.MOFO_S.png
  Raster diagnostic figure, also linked from report.html.
example_08_Z7.NOHR_S.png
  Raster diagnostic figure, also linked from report.html.
example_09_Z7.RODG_S.png
  Raster diagnostic figure, also linked from report.html.
example_10_Z7.SOSU_S.png
  Raster diagnostic figure, also linked from report.html.
example_11_Z7.STAM_S.png
  Raster diagnostic figure, also linked from report.html.
example_12_Z7.TOHR_S.png
  Raster diagnostic figure, also linked from report.html.
example_selection.csv
  Exactly which pairs, stations and phases the report displays.
filter_audit.png
  Raster diagnostic figure, also linked from report.html.
filter_tone_audit.csv
  Diagnostic data associated with this run.
group_summary.csv
  Accepted/rejected pair counts for each station and phase.
input_issues.csv
  Header problems. An empty table means none were found.
inventory.csv
  Decoded SAC metadata, one row per file.
matrices
  Open index.csv for sparse/dense filenames and matrix_plots.csv for PNG status.
near_identity.csv
  High-similarity flags to review; no automatic deletion.
phase_readiness.csv
  Pick and window availability; ready does not yet test SNR.
preprocessing_issues.csv
  Traces excluded before pair correlation, including low SNR.
report.html
  OPEN THIS in a web browser to view the diagnostic PNG figures.
report_data.jls
  Internal Julia report data; not an input for students to edit.
run_info.toml
  Run type, completion status and input/configuration paths.
run_summary.toml
  Event/observation counts and timing conventions.
software_provenance.toml
  Julia version and source hashes.
station_epochs.csv
  Recorded station coordinates and any explicitly requested station-code splits, by source file. Group numbers identify locations, not chronological epochs.
station_exclusions.csv
  Stations omitted from all events and both phases because coordinates conflict; reasons, counts and coordinate ranges.
stations.txt
  Station coordinates; elevation in metres.
summary.png
  Raster diagnostic figure, also linked from report.html.
triangle_closure.png
  Raster diagnostic figure, also linked from report.html.
triangle_closure_summary.csv
  Diagnostic data associated with this run.
