# DDCorr.jl

DDCorr compares P or S waveforms from pairs of earthquakes recorded at the same station. It uses their measured lag, phase-marker times and origin times to write differential travel times for relocation.

**[Start here for the Friday lab](docs/START_HERE.md)**. Run DDCorr on the synthetic SAC files, then on the supplied recordings of 100 Icelandic earthquakes. At 14:05 the class reads the real Iceland report together, follows individual P and S measurements into the output tables, and reviews how DDCorr processed those waveforms. From 16:00 to 18:00, participants can run their own SAC files or explore other Iceland station and event pairs.

- [Editable workshop PowerPoint](teaching/DDCorr_minicourse.pptx)
- [Report walkthrough](teaching/SOLUTIONS.txt)
- [Inputs, settings and output formats](docs/INPUTS_OUTPUTS.md)

Extract the instructor’s `Iceland100.zip` alongside `DDCorr.jl`. For your own SAC files, use one directory per event. A completed run includes its HTML report, `correlations.csv`, `dt.cc`, `catalog.txt`, `stations.txt` and `event_id_map.csv`.
