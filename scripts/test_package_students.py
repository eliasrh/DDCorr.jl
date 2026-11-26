import re
import unittest
from pathlib import Path
from urllib.parse import urlsplit

from package_students import course_files


class FridayHandoutTests(unittest.TestCase):
    def test_offline_guide_opens_the_matching_report_with_its_assets(self):
        root = Path(__file__).resolve().parents[1]
        files = set(course_files(root))
        iceland = root / "examples/download/iceland100"
        report = iceland / "reference/report.html"
        self.assertIn(report, files)
        guide = (root / "docs/START_HERE.html").read_text(encoding="utf-8")
        self.assertIn('href="../examples/download/iceland100/reference/report.html"', guide)
        for target in re.findall(r'(?:href|src)="([^"]+)"', report.read_text(encoding="utf-8")):
            url = urlsplit(target)
            if not url.scheme and not url.netloc and url.path:
                self.assertIn((report.parent / url.path).resolve(), files)
        self.assertIn(iceland / "DDCorr.toml", files)
        self.assertIn(iceland / "solutions/s_horizontal_components.csv", files)
        self.assertIn(root / "teaching/assets/method_stam_s_peak.png", files)
