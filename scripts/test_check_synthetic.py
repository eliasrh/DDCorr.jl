"""Independent truth checks; standard library only, no Julia or ObsPy imports."""
import csv
from pathlib import Path
import tempfile
import unittest

from check_synthetic import check


def write(path, header, values):
    with path.open("w", newline="") as handle:
        writer=csv.writer(handle); writer.writerow(header); writer.writerows(values)


class TruthCheckTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(); self.root=Path(self.temp.name)
        self.truth=self.root/"truth"; self.truth.mkdir()
        self.run=self.root/"run"; self.run.mkdir()
        write(self.truth/"truth_pairs.csv", ["event_i_original_id","event_j_original_id","station","phase","dt_i_minus_j_s","both_have_signal"],
              [["80","2","XX.A","P",.12,True], ["80","905","XX.A","P",.05,False]])
        write(self.truth/"truth_picks.csv", ["original_id","signal_present"], [["80",True],["2",True],["905",False]])
        write(self.run/"event_id_map.csv", ["event_id","original_event_id"], [[1,"2"],[2,"80"],[3,"905"]])
        self.observations([[1,2,"XX.A","P",-.119]])

    def tearDown(self):
        self.temp.cleanup()

    def observations(self, values):
        write(self.run/"correlations.csv", ["event_i","event_j","station","phase","dt_s"], values)

    def test_relabels_and_reverses_truth_sign(self):
        report=check(self.truth,self.run,.002,True)
        self.assertTrue(report["passed"])
        self.assertAlmostEqual(report["by_phase"]["P"]["maximum_absolute_error_s"],.001)

    def test_wrong_dt_sign_fails(self):
        self.observations([[1,2,"XX.A","P",.12]])
        self.assertFalse(check(self.truth,self.run,.01)["passed"])

    def test_noise_edge_fails_even_if_its_time_matches(self):
        self.observations([[1,2,"XX.A","P",-.12], [2,3,"XX.A","P",.05]])
        report=check(self.truth,self.run,.001,True)
        self.assertFalse(report["passed"])
        self.assertEqual(len(report["noise_control_accepted_observations"]),1)

    def test_deleted_control_does_not_pass_isolation(self):
        write(self.run/"event_id_map.csv", ["event_id","original_event_id"], [[1,"2"],[2,"80"]])
        self.assertFalse(check(self.truth,self.run,.01,True)["passed"])

    def test_duplicate_edges_rejected(self):
        self.observations([[1,2,"XX.A","P",-.12],[2,1,"XX.A","P",.12]])
        with self.assertRaisesRegex(ValueError,"Duplicate"):
            check(self.truth,self.run)

    def test_no_data_cannot_pass(self):
        self.observations([])
        with self.assertRaisesRegex(ValueError,"No accepted"):
            check(self.truth,self.run)


if __name__ == "__main__":
    unittest.main()
