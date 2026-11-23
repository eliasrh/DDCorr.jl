#!/usr/bin/env python3
"""Make inspectable event/pick/station tables from documented source formats.

The s1 command extracts origins and magnitudes from Ágústsdóttir et al. (2019),
Data Set S1. It writes events.csv for download_sac.py. That catalogue contains
no station arrivals, so its picks.csv contains column names only. For another
dataset, use the quakeml command to read a QuakeML event and arrival catalogue.

From DDCorr.jl, run .venv/bin/python scripts/prepare_tables.py MODE --help.
For PowerShell, use .\\.venv\\Scripts\\python.exe. Results and source receipts go to --output.
"""
import argparse, csv, datetime as dt, json, math, re, sys
from pathlib import Path
from download_sac import RequestCache, sha256, atomic_json, NoData

EVENT_FIELDS = ['event_id','origin_utc','latitude','longitude','depth_km','magnitude','source']
PICK_FIELDS = ['event_id','network','station','location','phase','arrival_utc','provenance']

def write_csv(path, fields, rows):
    with path.open('w', newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore'); w.writeheader(); w.writerows(rows)

def select_events(rows, start, end, limit):
    from obspy import UTCDateTime
    selected=sorted((r for r in rows if UTCDateTime(start)<=UTCDateTime(r['origin_utc'])<UTCDateTime(end)),key=lambda r:r['origin_utc'])
    return selected[:limit]

def s1_rows(path):
    """S1 is headerless: day-of-year date time lat lon depth col7 magnitude."""
    from decimal import Decimal
    rows=[]
    for i,line in enumerate(path.read_text().splitlines(),1):
        if not line.strip(): continue
        f=line.split()
        if len(f)!=8: raise ValueError(f'Expected 8 S1 columns at line {i}')
        date=dt.datetime.strptime(f[1],'%Y-%m-%d').replace(tzinfo=dt.timezone.utc)
        if date.timetuple().tm_yday != int(f[0].lstrip('#')): raise ValueError('S1 day-of-year mismatch')
        h,m,s=f[2].split(':'); seconds=Decimal(s)
        if not 0<=seconds<=60: raise ValueError('Invalid S1 seconds')
        origin=date+dt.timedelta(hours=int(h),minutes=int(m),microseconds=int(seconds*1000000))
        rows.append(dict(zip(EVENT_FIELDS,[f'S1_{i:06d}',origin.isoformat().replace('+00:00','Z'),float(f[3]),float(f[4]),float(f[5]),float(f[7]),'doi:10.1029/2018JB016010; Data Set S1; source line '+str(i)])))
    return rows

def quakeml_rows(path):
    from obspy import read_events
    rows=[]; picks=[]
    for i,event in enumerate(read_events(str(path)),1):
        origin=event.preferred_origin() or (event.origins[0] if event.origins else None)
        if origin is None or any(getattr(origin,k) is None for k in ('time','latitude','longitude','depth')): continue
        # Preserve original URI in source, give filesystem-safe labels to folders.
        label=f'event_{i:06d}'; source=str(event.resource_id)
        mag=event.preferred_magnitude() or (event.magnitudes[0] if event.magnitudes else None)
        rows.append(dict(zip(EVENT_FIELDS,[label,str(origin.time),origin.latitude,origin.longitude,origin.depth/1000,mag.mag if mag else '',source])))
        pick_by_id={str(p.resource_id):p for p in event.picks}
        seen=set()
        for arrival in origin.arrivals:
            phase=(arrival.phase or '').upper(); pick=pick_by_id.get(str(arrival.pick_id))
            if phase not in ('P','S') or pick is None or pick.waveform_id is None: continue
            w=pick.waveform_id; key=(w.network_code,w.station_code,w.location_code or '',phase)
            if not w.network_code or not w.station_code: continue
            if key in seen: raise ValueError(f'Multiple {phase} arrivals at {key} for {label}; resolve them explicitly')
            seen.add(key)
            provenance=f'QuakeML {pick.resource_id}; evaluation_mode={pick.evaluation_mode or "unspecified"}; preferred/first origin arrival'
            picks.append(dict(zip(PICK_FIELDS,[label,*key[:3],phase,str(pick.time),provenance])))
    return rows,picks

def station_rows(path,start,end,network,channel,near_lat,near_lon):
    from obspy import read_inventory, UTCDateTime
    from obspy.geodetics import gps2dist_azimuth
    first,last=UTCDateTime(start),UTCDateTime(end); rows=[]
    for net in read_inventory(str(path)).select(network=network,channel=channel):
        for sta in net:
            channels=[c for c in sta if (c.start_date is None or c.start_date<=first) and (c.end_date is None or c.end_date>=last)]
            if not channels: continue
            distance=gps2dist_azimuth(near_lat,near_lon,sta.latitude,sta.longitude)[0]/1000
            for c in channels:
                rows.append(dict(network=net.code,station=sta.code,location=c.location_code or '--',channel=c.code,
                    latitude=c.latitude,longitude=c.longitude,elevation_m=c.elevation,sample_rate_hz=c.sample_rate,
                    azimuth_deg=c.azimuth,dip_deg=c.dip,distance_to_selection_point_km=round(distance,3)))
    return rows

def main(argv=None):
    p=argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); sub=p.add_subparsers(dest='mode',required=True)
    modes = {
        's1': 'Read the Bárðarbunga dike catalogue, Data Set S1, into events.csv.',
        'quakeml': 'Read a local QuakeML file into events.csv and picks.csv.',
        'events': 'Select earthquake origins in a time interval and geographic box.',
        'stations': 'Select stations with active channels nearest to the given point.',
    }
    for name, purpose in modes.items():
        a = sub.add_parser(name, help=purpose, description=purpose)
        a.add_argument('--output', type=Path, required=True, help='Folder for the selected CSV tables and source receipt.')
        a.add_argument('--start', required=True, help='Start of selection in UTC, inclusive for event origins.')
        a.add_argument('--end', required=True, help='End of selection in UTC, exclusive for event origins.')
        a.add_argument('--limit', type=int, default=100 if name != 'stations' else 12,
                       help='Maximum number of events in chronological order or stations in order of distance.')
        if name in ('s1','quakeml'):
            a.add_argument('--input', type=Path, required=True, help='Local S1 text file or QuakeML file, according to mode.')
        else:
            a.add_argument('--input',type=Path,help='Read saved metadata instead of downloading')
            a.add_argument('--service',default='https://earthquake.usgs.gov' if name=='events' else 'https://service.earthscope.org')
            a.add_argument('--cache-dir',type=Path,default=Path('work/table_cache'))
        if name=='events':
            for flag in ('min-lat','max-lat','min-lon','max-lon'): a.add_argument('--'+flag,type=float,required=True)
        if name=='stations':
            a.add_argument('--network',required=True);a.add_argument('--channels',default='HH?')
            a.add_argument('--near-lat',type=float,required=True);a.add_argument('--near-lon',type=float,required=True)
            a.add_argument('--require-components',default='Z,N,E',help='Suffixes required at a common location, or empty for any')
    args=p.parse_args(argv)
    try:
        from obspy import UTCDateTime
    except ImportError:
        raise RuntimeError("ObsPy is missing from the Python you used. From the DDCorr.jl folder, run:\n"
            "  python3 -m venv .venv\n"
            "  .venv/bin/python -m pip install -r requirements-download.txt\n"
            "Then repeat this command with .venv/bin/python instead of python3.\n"
            "Windows PowerShell: use .\\.venv\\Scripts\\python.exe instead of .venv/bin/python.") from None
    if args.limit<1 or UTCDateTime(args.end)<=UTCDateTime(args.start): raise ValueError('Positive limit and end after start required')
    args.output.mkdir(parents=True,exist_ok=True)
    receipt={'parameters':{k:str(v) if isinstance(v,Path) else v for k,v in vars(args).items()},'selection':'events: chronological first N; stations: nearest eligible N, no waveform/CC criterion'}
    path=args.input
    if args.mode in ('events','stations') and path is None:
        from urllib.parse import urlencode
        service='event' if args.mode=='events' else 'station'
        query=dict(starttime=args.start,endtime=args.end,format='xml',nodata=204)
        if service=='event': query.update(minlatitude=args.min_lat,maxlatitude=args.max_lat,minlongitude=args.min_lon,maxlongitude=args.max_lon,orderby='time-asc',limit=args.limit)
        else: query.update(network=args.network,channel=args.channels,level='channel')
        url=args.service.rstrip('/')+f'/fdsnws/{service}/1/query?'+urlencode(query)
        cache=RequestCache(args.cache_dir,50*1024**2,per_file_bytes=50*1024**2);path=cache.get(url,'.xml');receipt['request_url']=url
    receipt.update(source_file=str(path),source_sha256=sha256(path))
    picks=[]
    if args.mode=='stations':
        rows=station_rows(path,args.start,args.end,args.network,args.channels,args.near_lat,args.near_lon)
        groups={}
        for r in rows: groups.setdefault((r['network'],r['station'],r['location']),[]).append(r)
        needed=set(filter(None,args.require_components.split(',')))
        eligible=[g for g in groups.values() if needed <= {r['channel'][-1] for r in g}]
        eligible.sort(key=lambda g:(g[0]['distance_to_selection_point_km'],g[0]['station'],g[0]['location']))
        selected=[];stations=set()
        for group in eligible:
            if group[0]['station'] in stations: continue
            if len(stations)>=args.limit: break
            stations.add(group[0]['station']);selected.extend(group)
        if not selected: raise ValueError('No stations satisfy epochs/components')
        write_csv(args.output/'stations.csv',list(selected[0]),selected);receipt['selected_stations']=sorted(stations)
        receipt['channel_count']=len(selected)
    else:
        if args.mode=='s1':
            rows=s1_rows(path);receipt['format_notes']='Headerless S1 interpreted as UTC; column 7 not used; row numbers are generated identifiers; xx:xx:60 carries to next minute.'
        else: rows,picks=quakeml_rows(path)
        selected=select_events(rows,args.start,args.end,args.limit);labels={r['event_id'] for r in selected}
        if not selected: raise ValueError('No events in interval')
        write_csv(args.output/'events.csv',EVENT_FIELDS,selected)
        picks=[r for r in picks if r['event_id'] in labels];write_csv(args.output/'picks.csv',PICK_FIELDS,picks)
        receipt.update(event_count=len(selected),pick_count=len(picks))
        if not picks: print('The selected catalogue supplies origins but no station arrivals. An empty picks.csv is expected.')
    atomic_json(args.output/('stations_receipt.json' if args.mode=='stations' else 'events_receipt.json'),receipt)
    if args.mode == 'stations':
        print(f"Wrote {len(selected)} channels from {len(stations)} stations to {args.output / 'stations.csv'}.")
    else:
        print(f"Wrote {len(selected)} events and {len(picks)} observed picks to {args.output}.")

if __name__=='__main__':
    try: main()
    except NoData: raise SystemExit("No data matched this service selection; check the dates, region, network and service URL.")
    except (ValueError,RuntimeError) as e: raise SystemExit(str(e))
