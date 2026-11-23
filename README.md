# DDCorr.jl

DDCorr measures how much a P or S waveform from one earthquake must be shifted to line up with the same phase from another earthquake at the same station. It combines that shift with the catalogue origins and arrival picks to write differential travel times for relocation.

**[Start here](docs/START_HERE.md)** for installation and the first correlation. On Friday we measure differential times for 100 Icelandic earthquakes with DDCorr. On Saturday we use the same events and measurements for DDSync and GraphSplit. Unpack the instructor’s `Iceland100.zip` alongside this folder. You can also use event-cut SAC from your own network.

- [Workshop slides](teaching/DDCorr_minicourse.pptx) explain the measurement and guide the practical.
- [Inputs, settings and outputs](docs/INPUTS_OUTPUTS.md) describes the SAC fields, column units and quality checks.
- [Worked answers](teaching/SOLUTIONS.txt) accompany the optional exercises.

DDCorr accepts one folder per event. Each completed run has a browser report, `dt.cc`, an event catalogue, a station table and a map back to the original event names. The student package includes the code and teaching materials. The separate Iceland archive includes the event recordings and downstream exercise.
