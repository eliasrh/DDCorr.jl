import csv
from pathlib import Path
import tempfile
import unittest
from obspy import UTCDateTime, Catalog
from obspy.core.event import Event, Origin, Pick, Arrival, WaveformStreamID, ResourceIdentifier
import prepare_tables as tables

class TableTests(unittest.TestCase):
    def test_s1_rollover_and_source_line(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'S1.txt';p.write_text('#235 2014-08-23 12:00:60.000 64.8 -16.8 5.0 0 1.2\n')
            row=tables.s1_rows(p)[0]
            self.assertEqual(row['event_id'],'S1_000001')
            self.assertEqual(UTCDateTime(row['origin_utc']),UTCDateTime('2014-08-23T12:01:00'))
            self.assertIn('source line 1',row['source'])
    def test_interval_half_open_and_chronological_limit(self):
        rows=[{'origin_utc':'2020-01-01T00:00:02Z'},{'origin_utc':'2020-01-01T00:00:00Z'},{'origin_utc':'2020-01-01T00:00:01Z'}]
        selected=tables.select_events(rows,'2020-01-01T00:00:00Z','2020-01-01T00:00:02Z',1)
        self.assertEqual(selected,[rows[1]])
    def test_quakeml_preserves_observed_pick_provenance(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Pick(resource_id='smi:local/pick1',time=UTCDateTime('2020-01-01T00:00:05'),waveform_id=WaveformStreamID(network_code='XX',station_code='ABC',location_code=''),evaluation_mode='manual')
            o=Origin(resource_id='smi:local/origin1',time=UTCDateTime('2020-01-01'),latitude=64,longitude=-17,depth=5000,arrivals=[Arrival(pick_id=p.resource_id,phase='P')])
            e=Event(resource_id='smi:local/original',origins=[o],picks=[p],preferred_origin_id=o.resource_id)
            path=Path(tmp)/'events.xml';Catalog(events=[e]).write(str(path),format='QUAKEML')
            rows,picks=tables.quakeml_rows(path)
            self.assertEqual(rows[0]['depth_km'],5)
            self.assertEqual(rows[0]['source'],'smi:local/original')
            self.assertEqual(picks[0]['phase'],'P');self.assertIn('manual',picks[0]['provenance']);self.assertIn('pick1',picks[0]['provenance'])
            self.assertEqual(len(picks),1)
    def test_no_picks_stays_empty(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'events.xml'
            Catalog(events=[Event(origins=[Origin(time=UTCDateTime('2020-01-01'),latitude=64,longitude=-17,depth=5000)])]).write(str(path),format='QUAKEML')
            rows,picks=tables.quakeml_rows(path);self.assertEqual(len(rows),1);self.assertEqual(picks,[])

if __name__=='__main__':unittest.main()
