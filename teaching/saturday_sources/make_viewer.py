"""Embed three reference catalogues in a self-contained, open-licensed browser viewer."""
import json, sys
from pathlib import Path
here=Path(__file__).parent
root=Path(sys.argv[1]); output=Path(sys.argv[2])
paths=[root/'inputs/catalog.txt',root/'reference/graphsplit_output/catalog_preloc_filt.txt',root/'reference/graphsplit_output/catalog_dd_filt.txt']
strings=[p.read_text(encoding='utf8') for p in paths]
html=(here/'catalogue_template.html').read_text().replace('__INITIAL_CATALOGUES__',json.dumps(strings).replace('<','\\u003c'))
output.write_text(html,encoding='utf8')
