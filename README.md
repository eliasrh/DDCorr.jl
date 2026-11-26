# DDCorr.jl

DDCorr compares P or S waveforms from pairs of earthquakes recorded at the same station. It uses their measured lag, phase-marker times and origin times to write differential travel times for relocation.

**Using your own recordings?** The [DDCorr manual and complete TOML reference](docs/INPUTS_OUTPUTS.md) covers installation, preparing SAC files, choosing phase markers, every run setting, interpreting results and exporting differential times.

**Preparing a workshop laptop?** Follow the [Windows, macOS or Linux setup and installation check](docs/START_HERE.md#before-class). The check installs the Julia packages, runs a small dataset with known travel times and gives you a report to open.

**[Start here for the Friday lab](docs/START_HERE.md)**. In a downloaded copy, double-click `docs/START_HERE.html` to read the same guide in your browser. Run DDCorr on the synthetic SAC files, then on the supplied recordings of 100 Icelandic earthquakes. At 14:05 the class reads the real Iceland report together, follows individual P and S measurements into the output tables, and reviews how DDCorr processed those waveforms. From 16:00 to 18:00, participants can run their own SAC files or explore other Iceland station and event pairs.

- [Editable workshop PowerPoint](teaching/DDCorr_minicourse.pptx)
- [Report walkthrough](teaching/SOLUTIONS.txt)
- [Inputs, settings and output formats](docs/INPUTS_OUTPUTS.md)

Extract the instructor’s `Iceland100.zip` alongside `DDCorr.jl`. For your own SAC files, use one directory per event. A completed run includes its HTML report, `correlations.csv`, `dt.cc`, `catalog.txt`, `stations.txt` and `event_id_map.csv`.

## Saturday · DDSync and GraphSplit

The [Saturday lab](https://github.com/eliasrh/DDCorr.jl/blob/main/teaching/saturday/START_HERE.md) starts with ready-to-use measurements from the same 100 Iceland earthquakes. A full GitHub download includes it in `teaching/saturday`. If you are using the separate Saturday ZIP, extract it and double-click `START_HERE.html`. The folder also contains the editable PowerPoint, both Julia programs and the offline catalogue viewer.
