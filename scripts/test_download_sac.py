"""Offline acquisition tests: run with the optional ObsPy environment."""
import contextlib
import csv
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
from obspy import Stream, Trace, UTCDateTime, read
from obspy.core.inventory import Channel, Inventory, Network, Site, Station
from obspy.io.sac import SACTrace

import download_sac as download
import make_synthetic


class Response(io.BytesIO):
    def __init__(self, data=b"", status=200):
        super().__init__(data); self.status = status


class CacheTests(unittest.TestCase):
    def test_verified_cache_avoids_network(self):
        with tempfile.TemporaryDirectory() as directory:
            calls=[]
            def opener(req, **kwargs):
                calls.append(req.full_url); return Response(b"waveform")
            first = download.RequestCache(directory, 100, opener=opener)
            path = first.get("https://example.org/a", ".bin")
            second = download.RequestCache(directory, 100, opener=lambda *a, **k: self.fail("redownload"))
            self.assertEqual(second.get("https://example.org/a", ".bin"), path)
            self.assertEqual(calls, ["https://example.org/a"])
            self.assertEqual(second.new, 0)

    def test_corruption_is_not_silently_repaired(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = download.RequestCache(directory, 100, opener=lambda *a, **k: Response(b"abc"))
            path = cache.get("https://example.org/a", ".bin"); path.write_bytes(b"corrupt")
            with self.assertRaisesRegex(ValueError, "missing or changed"):
                cache.get("https://example.org/a", ".bin")

    def test_no_data_is_recorded_and_reused(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = download.RequestCache(directory, 100, opener=lambda *a, **k: Response(status=204))
            with self.assertRaises(download.NoData): cache.get("https://example.org/a", ".bin")
            cache.opener = lambda *a, **k: self.fail("no-data redownload")
            with self.assertRaises(download.NoData): cache.get("https://example.org/a", ".bin")

    def test_limit_removes_partial_file(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = download.RequestCache(directory, 2, opener=lambda *a, **k: Response(b"too much"))
            with self.assertRaisesRegex(ValueError, "byte limit"):
                cache.get("https://example.org/a", ".bin")
            self.assertFalse(list(Path(directory).iterdir()))

    def test_blank_location_argument(self):
        args = download.make_parser().parse_args(["--events", "a.csv", "--network", "XX", "--stations", "A", "--location=--", "--pick-mode", "predicted", "--output", "out"])
        self.assertEqual(args.location, "--")


def trace(start=0, n=101, data=None):
    return Trace(np.asarray(data if data is not None else np.arange(n), dtype=np.float32),
                 {"network": "XX", "station": "A", "location": "", "channel": "HHZ",
                  "sampling_rate": 10, "starttime": UTCDateTime(2020, 1, 1)+start})


class TraceTests(unittest.TestCase):
    def test_adjacent_records_equal_unsplit(self):
        whole = trace(n=201)
        split = Stream([trace(n=100), trace(start=10, data=np.arange(100, 201))])
        got = download.coherent_trace(split, whole.id, whole.stats.starttime, whole.stats.endtime, np)
        np.testing.assert_array_equal(got.data, whole.data)

    def test_gap_is_not_filled(self):
        stream = Stream([trace(n=100), trace(start=11, n=101)])
        with self.assertRaisesRegex(ValueError, "Gap"):
            download.coherent_trace(stream, stream[0].id, stream[0].stats.starttime, stream[-1].stats.endtime, np)

    def test_conflicting_overlap_rejected(self):
        stream = Stream([trace(n=101), trace(start=9, n=101)])
        with self.assertRaisesRegex(ValueError, "overlap"):
            download.coherent_trace(stream, stream[0].id, stream[0].stats.starttime, stream[-1].stats.endtime, np)

    def test_incomplete_request_rejected(self):
        tr = trace()
        with self.assertRaisesRegex(ValueError, "Incomplete"):
            download.coherent_trace(Stream([tr]), tr.id, tr.stats.starttime-1, tr.stats.endtime, np)

    def test_nonfinite_rejected(self):
        tr=trace(); tr.data[50]=np.nan
        with self.assertRaisesRegex(ValueError, "Nonfinite"):
            download.coherent_trace(Stream([tr]), tr.id, tr.stats.starttime, tr.stats.endtime, np)

    def test_metadata_epoch_must_cover_whole_snippet(self):
        channel = Channel(code="HHZ", location_code="", latitude=1, longitude=2,
                          elevation=3, depth=0, azimuth=0, dip=-90, sample_rate=10,
                          start_date=UTCDateTime(2020, 1, 1), end_date=UTCDateTime(2020, 1, 2))
        inv=Inventory([Network("XX", stations=[Station("A", 1, 2, 3, channels=[channel], site=Site("A"))])], "test")
        self.assertIs(download.exact_channel(inv, "XX", "A", "", "HHZ", UTCDateTime(2020,1,1), UTCDateTime(2020,1,1,1)), channel)
        with self.assertRaisesRegex(ValueError, "epoch"):
            download.exact_channel(inv, "XX", "A", "", "HHZ", UTCDateTime(2020,1,1), UTCDateTime(2020,1,3))


class SyntheticTests(unittest.TestCase):
    def test_readable_truth_and_replay(self):
        with tempfile.TemporaryDirectory() as directory:
            output=Path(directory)/"example"
            make_synthetic.make_example(output)
            files=list((output/"sac").glob("*/*.sac"))
            self.assertEqual(len(files), 72)
            tr=read(str(output/"sac/17/XX.S01..HHZ.sac"))[0]
            self.assertEqual(tr.stats.npts, 4501)
            self.assertEqual(tr.stats.sac.ka, "P_synth")
            self.assertEqual(tr.stats.sac.cmpinc, 0)
            self.assertAlmostEqual(tr.stats.sac.evdp, 6.0)
            before=download.sha256(output/"manifest.json")
            make_synthetic.make_example(output)
            self.assertEqual(before, download.sha256(output/"manifest.json"))
            with (output/"truth_pairs.csv").open() as handle:
                pairs=list(csv.DictReader(handle))
            self.assertEqual(len(pairs), 120)
            self.assertEqual(sum(row["both_have_signal"] == "True" for row in pairs), 80)

    def test_origin_reference_fraction(self):
        import datetime as dt
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/"tiny.sac"
            origin=dt.datetime(2020,1,1,0,0,1,123456,tzinfo=dt.timezone.utc)
            make_synthetic.write_sac(path, [0,1,0], origin=origin, begin=-1, rate=10, event_id="9", station="A", channel="HHZ", p=2, s=3, latitude=1, longitude=2, depth=3, station_lat=4, station_lon=5, azimuth=0, inclination=0)
            sac=SACTrace.read(str(path))
            self.assertAlmostEqual(float(sac.reftime+sac.o-UTCDateTime(origin)), 0, places=6)
            self.assertAlmostEqual(float(sac.reftime+sac.b-(UTCDateTime(origin)-1)), 0, places=6)


if __name__ == "__main__":
    unittest.main()
