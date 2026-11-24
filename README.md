# DDCorr.jl

DDCorr measures the shift between P or S waveforms from two earthquakes recorded at the same station. It combines that shift with the phase markers and earthquake origin times to write differential travel times for relocation.

**[Start here](docs/START_HERE.md)** for the Friday workshop. Begin with six synthetic events whose travel times are known. Fetch a small set of real waveforms, then use the instructor’s `Iceland100.zip` to measure and review correlations among 100 Bárðarbunga events. Extract the `DDCorr.jl` and `Iceland100` folders side by side.

- [Editable workshop PowerPoint](teaching/DDCorr_minicourse.pptx)
- [Inputs, settings and outputs](docs/INPUTS_OUTPUTS.md)
- [Worked answers](teaching/SOLUTIONS.txt)

You can also start from your own event-cut SAC files. A completed run includes an HTML report, station–phase correlations, `dt.cc`, a catalogue, a station table and a map from the integer IDs back to your original event names.
