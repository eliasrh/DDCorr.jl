# Saturday lab · From differential times to earthquake locations

Today you will use DDSync to fit the arrival-time differences for 100 Icelandic earthquakes. You will then run GraphSplit and open a map and depth section of the results. **If you missed Friday, start here.** The Saturday folder includes the four input files, both programs and a completed example. Julia is the only software you need to install.

## Open the workshop folder

1. Extract the Saturday ZIP into a folder where you can save your own files, such as Documents. On Windows, right-click the ZIP and choose **Extract All**. On a Mac, double-click the ZIP. If you downloaded the full DDCorr repository from GitHub, extract that ZIP and open **teaching → saturday**.
2. Open the folder containing **workshop.jl**, **START_HERE.html** and **Catalogues.html**. You should also see **inputs**, **config**, **software** and **reference**. If you see another Saturday folder instead, open it. Keep these files and folders together.
3. Double-click **START_HERE.html** to keep this guide open in your browser. On slide 26, leave the [PowerPoint](Saturday_DDSync_GraphSplit.pptx) open so you can return to it after the lab.

## Open a terminal here

A terminal is a window where you can type a command and press **Enter**. Both commands below run from the folder containing **workshop.jl**. Open the folder using your usual file browser, then use the directions for your computer.

- **Windows.** Click the address bar at the top of File Explorer. Type `powershell` and press **Enter**. A PowerShell window will open in that folder.
- **macOS.** Open the Terminal app using Spotlight. Type `cd` followed by a space. Drag the workshop folder from Finder into the Terminal window and press **Return**.
- **Linux.** Right-click the background of the workshop folder in your file manager and choose **Open in Terminal**. If that option is missing, open Terminal, type `cd` followed by a space, drag the folder into the window and press **Enter**.

Enter this line to display your Julia version. The workshop was run with Julia 1.12.3. If the command is unrecognised, install Julia and reopen the terminal. While it installs you can follow the class using the completed example in the viewer. [Julia downloads](https://julialang.org/downloads/) · [Open the Iceland example](Catalogues.html)

```sh
julia --version
```

## Before lunch · Fit the times with DDSync

The [inputs folder](inputs/) holds Friday’s Iceland measurements. In **dt.cc**, each event-pair heading is followed by its station, differential travel time in seconds, weight and phase. The matching **catalog.txt** gives the starting earthquakes, **stations.txt** the station locations, and **event_id_map.csv** the original names for the numbered events.

Copy this command into the terminal and press **Enter**.

```sh
julia --threads=2 workshop.jl sync
```

DDSync prints a line for each station and phase while it fits the timing differences. The first run may pause while Julia prepares the code. When the terminal displays **DDSync finished** and returns to the prompt, open **runs → baseline** in your file browser. The file **sync_metrics.txt** gives measurement counts. In **theta**, a file such as **theta_Z7.DYSA_P.txt** gives each event’s time relative to its reference earthquake at one station for one phase. **thetastd** holds the fitted timing uncertainties. Keep both folders together for the next command.

If the terminal says it cannot open **workshop.jl**, it is looking in a different folder. Repeat “Open a terminal here” in the folder containing that file. If you repeat a completed command, the program prints the location of the existing results.

## After lunch · Relocate with GraphSplit

Return to the same terminal and enter the next line.

```sh
julia --threads=2 workshop.jl relocate
```

GraphSplit builds a table of predicted travel times for the eleven stations using **vm.txt**. First it fits the timing differences between events and their references. Then it compares nearby events that share observations. When **GraphSplit finished** appears, open **runs → baseline → graphsplit_output**. The two filenames ending in **_filt.txt** contain the events that contributed to each stage.

## Open your results on the map

Open [Catalogues.html](Catalogues.html). The map initially shows the **reference run**. To display the files that your computer just produced, expand **Open files from a different run**. Use the file chooser beside each label.

| Viewer label | File to choose from your Saturday folder |
|---|---|
| Input catalogue | `runs/baseline/catalog.txt` |
| Preliminary catalogue | `runs/baseline/graphsplit_output/catalog_preloc_filt.txt` |
| DD catalogue | `runs/baseline/graphsplit_output/catalog_dd_filt.txt` |

Click **Display selected files**. The heading above the plots changes from **Reference run** to **Local files**. With **Events → With a DD location**, the map compares the same 57 Iceland earthquakes at all three stages. Under **Event ID**, choose an earthquake to see its coordinates at each stage. The **View → Near selected event** setting enlarges the area around it.

**Return to slide 27 at 14:05 with the viewer open.** If your run is still in progress, **Restore Iceland example** displays the completed run immediately. Its original [DDSync results](reference/) and [GraphSplit files](reference/graphsplit_output/) are included in the same folder. You can load your own outputs later.

## Open clinic · 16:00–18:00

**Use your own Friday measurements.** In your file browser, find the completed DDCorr result folder that contains all four input files listed above. Copy its full path. In the first command below, replace the text inside the quotation marks with that path. Run both lines from the Saturday folder. The name **friday** gives this experiment its own folder under **runs**.

```sh
julia --threads=2 workshop.jl sync --from "PATH TO YOUR DDCORR RESULT" --run friday
julia --threads=2 workshop.jl relocate --run friday
```

Open the same three filenames in the viewer, this time from **runs/friday**. If your data come from a different region, first make a copy of the [config folder](config/) for that region. Supply a local velocity model and suitable lookup-table bounds before relocation. For a run using both new inputs and new settings, add `--config "PATH TO YOUR CONFIG FOLDER"` to the **sync** command. The runner copies the four inputs and three configuration files into the named run. The [file-format guide](software/GraphSplit.jl/docs/FILE_FORMATS.md) gives the units and column order.

**Explore a different neighbour rule on the Iceland data.** Duplicate **config** in your file browser, keep the copy beside it, and name the copy **config-one-way**. Open **DD.toml** in the copy using a plain-text editor. In the existing **[graph]** section, change `mutual = true` to `mutual = false` and save. With this setting, two events become candidates for comparison when either selects the other as a neighbour. Start the separate run from the same Iceland inputs.

```sh
julia --threads=2 workshop.jl sync --run one-way --config config-one-way
julia --threads=2 workshop.jl relocate --run one-way
```

Use **runs/one-way** in the viewer. The **baseline** folder still holds the original results. To see which events contributed to the new DD solution, open **catalog_dd_graphmeta.csv** under **runs/one-way/graphsplit_output** and look at **relocation_used**. A value of **1** marks an event used in that solve.

The [sources and data notes](SOURCES.txt) credit the Iceland catalogue, recordings, velocity model, method papers and the exact program versions used here.
