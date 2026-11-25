using Markdown
source = read(joinpath(@__DIR__, "../saturday/START_HERE.md"),String)
body = sprint(show,MIME"text/html"(),Markdown.parse(source))
body = replace(body, "href=\"Catalogues.html\"" => "href=\"Catalogues.html\" target=\"_blank\" rel=\"noopener\"")
anchors = ["Open the workshop folder"=>"folder","Open a terminal here"=>"terminal","Before lunch · Fit the times with DDSync"=>"sync","After lunch · Relocate with GraphSplit"=>"relocate","Open your results on the map"=>"map","Open clinic · 16:00–18:00"=>"clinic"]
for (title,id) in anchors
    global body = replace(body,"<h2>$title</h2>"=>"<h2 id=\"$id\">$title</h2>")
end
nav = join(["<a href=\"#$id\">$title</a>" for (title,id) in ["Folder"=>"folder","Terminal"=>"terminal","DDSync"=>"sync","GraphSplit"=>"relocate","Your map"=>"map","Clinic"=>"clinic"]]," · ")
html = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Saturday · DDSync and GraphSplit lab</title><style>
:root{color-scheme:light;font:18px/1.6 system-ui,sans-serif;color:#203b34;background:#f9f8f1}body{max-width:54rem;margin:0 auto;padding:2rem clamp(1rem,4vw,3rem) 5rem}a{color:#075f59;text-underline-offset:.15em}nav{font-size:.9rem;padding-bottom:1rem;border-bottom:1px solid #bbcbbf}nav a{white-space:nowrap}h1,h2{font-family:Georgia,serif;font-weight:500;line-height:1.18;color:#183c33}h1{font-size:clamp(2rem,4vw,2.8rem)}h2{font-size:1.75rem;margin-top:2.5rem;scroll-margin-top:1rem}p,li{max-width:80ch}li{margin-bottom:.35rem}pre{padding:1rem;background:#193d36;border-radius:.25rem;overflow-x:auto;color:#fffcf4}code{font: .9em ui-monospace,SFMono-Regular,Consolas,monospace}p code,td code{overflow-wrap:anywhere}table{border-collapse:collapse;max-width:100%;display:block;overflow-x:auto}td,th{padding:.6rem .8rem;border-bottom:1px solid #c6d5ca;text-align:left;vertical-align:top}th{background:#dfeae1}a:focus-visible{outline:3px solid #a66c05;outline-offset:2px}
@media print{body{font-size:11pt;max-width:none;padding:0}nav{display:none}pre{white-space:pre-wrap;color:black;background:#eee}}
</style></head><body><nav aria-label="Contents">$nav</nav>$body</body></html>"""
write(joinpath(@__DIR__,"../saturday/START_HERE.html"),html)
