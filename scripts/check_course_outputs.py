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
report=(run/'report.html').read_text()
assert '.pdf' not in report
# This test fixture uses the acceptance cutoff as its near-identity threshold.
# Each flagged example must show every accepted station/phase for that pair.
audit=list(csv.DictReader((run/'correlations.csv').open()))
for example in rows:
    pair=example['event_i'],example['event_j']
    figure=Path(example['figure']).stem
    expected={(r['station'],r['phase']) for r in audit if (r['event_i'],r['event_j'])==pair}
    summary=f"<summary>{figure} · events {pair[0]} and {pair[1]} · near-identity flag</summary>"
    assert summary in report,figure
    details=report.split(summary,1)[1].split('</details>',1)[0]
    if example['phase']=='S':
        components_caption='<caption>S correlation on each shared horizontal</caption>'
        assert components_caption in details,figure
        components=details.split(components_caption,1)[1].split('</table>',1)[0]
        assert '<th>r at joint fitted lag</th>' in components,figure
        obs=next(r for r in audit if (r['event_i'],r['event_j'])==pair
                 and r['station']==example['station'] and r['phase']=='S')
        channels={c.rsplit('.',1)[-1] for c in obs['components'].split(';')}
        measurements=[re.findall(r'<td>([^<]+)</td>',row)
                      for row in re.findall(r'<tr>(<td>.*?)</tr>',components)]
        assert {m[0] for m in measurements}==channels,figure
        mean_fitted=sum(float(m[4]) for m in measurements)/len(measurements)
        assert abs(mean_fitted-float(obs['cc_signed']))<1e-6,figure
    caption=f'<caption>All accepted measurements for events {pair[0]} and {pair[1]}</caption>'
    assert caption in details,figure
    table=details.split(caption,1)[1].split('</table>',1)[0]
    assert set(re.findall(r'<tr><td>([^<]+)</td><td>([PS])</td>',table))==expected,figure
    for obs in audit:
        if (obs['event_i'],obs['event_j'])==pair:
            cells=(obs['station'],obs['phase'],f"{float(obs['cc_signed']):.4f}",
                   f"{float(obs['dt_s']):.4f}",f"{float(obs['weight']):.6f}")
            assert ''.join(f'<td>{cell}</td>' for cell in cells) in table,figure

for line in (run/'dt.cc').read_text().splitlines():
    if line and not line.startswith('#'):assert re.fullmatch(r'-?\d+\.\d{4}',line.split()[1]),line
print('Course interface verified: 16 requested figures, 8 PNG matrices, dense CSVs, four-decimal dt, named complete run.')
