# Run with: julia teaching/source/render_start_here.jl
# The distributed guide renders in a browser without any software setup.
using Markdown

docs = normpath(@__DIR__, "..", "..", "docs")
source = read(joinpath(docs, "START_HERE.md"), String)
body = sprint(show, MIME"text/html"(), Markdown.parse(source))
anchors = [
    "Before class" => "before-class",
    "Synthetic data" => "synthetic-data",
    "Iceland data" => "iceland-data",
    "Reading the report" => "reading-the-report",
    "Your own SAC files" => "your-own-sac-files",
    "Optional archive download" => "optional-archive-download",
]
body = foldl(anchors; init=body) do html, (title, id)
    replace(html, "<h2>$title</h2>" => "<h2 id=\"$id\">$title</h2>")
end
# Point to the report shipped with this code even if the waveform archive is older.
link = "<p class=\"report\"><a href=\"../examples/download/iceland100/reference/report.html\">Open the completed Friday report in your browser</a></p>"
body = replace(body, "<h2 id=\"reading-the-report\">" => link * "<h2 id=\"reading-the-report\">")
navigation = join(("<a href=\"#$id\">$title</a>" for (title, id) in anchors), " · ")
function page(title, navigation, body)
    """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>$title</title>
<style>
:root{font:18px/1.65 system-ui,sans-serif;color:#1c302d;background:#f7f7f1}
body{margin:0 auto;padding:2rem 1.5rem 5rem;max-width:53rem}a{color:#075e5a;text-underline-offset:.14em}
nav{font-size:.9rem;margin-bottom:1.7rem;padding-bottom:1rem;border-bottom:1px solid #bbcdc6}
h1,h2{font-family:Georgia,serif;line-height:1.18;color:#173c35}h1{font-size:2.35rem}h2{font-size:1.72rem;margin-top:2.6rem}
pre{background:#183a34;color:#fafbf7;padding:1rem;border-radius:5px;overflow:auto}
code{font:0.92em ui-monospace,SFMono-Regular,Consolas,monospace}p code,li code,td code{overflow-wrap:anywhere}
table{width:100%;border-collapse:collapse;display:block;overflow-x:auto}th,td{border-bottom:1px solid #bdc9c0;padding:.5rem .75rem;text-align:left;vertical-align:top}
th{background:#e3eae3}li{padding-left:.15rem;margin:.35rem 0}.report{padding:1rem;border-left:4px solid #447d70;background:#e6eee4}
@media print{body{font-size:11pt;max-width:none;padding:0}nav{display:none}pre{white-space:pre-wrap;overflow-wrap:anywhere}}
</style></head><body><nav aria-label="Contents">$navigation</nav>$body</body></html>
"""
end
body = replace(body, "INPUTS_OUTPUTS.md" => "INPUTS_OUTPUTS.html")
write(joinpath(docs, "START_HERE.html"), page("Start here for the DDCorr lab",navigation,body))
manual = read(joinpath(docs, "INPUTS_OUTPUTS.md"), String)
manual_body = sprint(show,MIME"text/html"(),Markdown.parse(manual))
manual_body = replace(manual_body, "START_HERE.md" => "START_HERE.html")
# Use the headings emitted by Markdown, including escaped punctuation.
titles = collect(eachmatch(r"<h2>(.*?)</h2>",manual_body))
links = String[]
for (i, match) in enumerate(titles)
    id = "manual-section-$i"
    global manual_body = replace(manual_body, match.match => "<h2 id=\"$id\">$(match.captures[1])</h2>"; count=1)
    push!(links,"<a href=\"#$id\">$(match.captures[1])</a>")
end
write(joinpath(docs, "INPUTS_OUTPUTS.html"),page("DDCorr manual",join(links, " · "),manual_body))
