#!/usr/bin/env python3
"""Integration check for the requested teaching interface, after a full run.
Run with event_pairs=[[1,2],[2,3]], all stations/phases, max_examples=1,
and matrices.dense=true on the six-event synthetic data.
"""
import csv
from pathlib import Path
import re
import sys
import tomllib
run=Path(sys.argv[1])
assert run.name.startswith('correlate_'),run
info=tomllib.loads((run/'run_info.toml').read_text())
assert info['mode']=='correlate' and info['status']=='complete'
rows=list(csv.DictReader((run/'example_selection.csv').open()))
assert len(rows)==16,(len(rows),'manual selection was truncated')
assert {(r['event_i'],r['event_j']) for r in rows}=={('1','2'),('2','3')}
assert {r['original_event_i'] for r in rows}=={'1201','17'}
assert all((run/r['figure']).exists() for r in rows)
assert len(list((run/'matrices').glob('*.png')))==8
assert len(list((run/'matrices').glob('*_cc.csv')))==8
assert not list(run.rglob('*.pdf')) and not list(run.rglob('*.svg'))
assert '.pdf' not in (run/'report.html').read_text()
for line in (run/'dt.cc').read_text().splitlines():
    if line and not line.startswith('#'):assert re.fullmatch(r'-?\d+\.\d{4}',line.split()[1]),line
print('Course interface verified: 16 requested figures, 8 PNG matrices, dense CSVs, four-decimal dt, named complete run.')
