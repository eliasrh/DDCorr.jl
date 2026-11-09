"""
Export accepted station–phase observations without inventing unmeasured edges.

Sparse upper-triangle CSV is the default. Optional dense CSV keeps missing values
and the uncomputed diagonal as NA. Peak correlation is symmetric, whereas the
signed differential time and pick correction change sign when event order flips.
These lag-maximized similarities are not guaranteed positive semidefinite.
"""
function write_matrices(out, events, rows, cfg)
    mc = cfg["matrices"]
    mc["enabled"] || return nothing
    ids = sort([e.id for e in events])
    ids == collect(1:length(events)) || error("Matrix export requires sequential event IDs 1:N")
    n = length(ids)
    precision = get(cfg["output"],"dt_decimals",4)
    groups = Dict{Tuple{String,String},Vector{Observation}}()
    seen = Set{Tuple{String,String,Int,Int}}()
    for row in rows
        1 <= row.i < row.j <= n || error("Matrix edge must have 1 <= i < j <= N")
        isfinite(row.cc) && abs(row.cc) <= 1 && isfinite(row.dt) && isfinite(row.lag) ||
            error("Matrix edge contains nonfinite/out-of-range measurements")
        key = (row.station, row.phase, row.i, row.j)
        key in seen && error("Duplicate station-phase matrix edge: $key")
        push!(seen, key)
        push!(get!(groups, (row.station,row.phase), Observation[]), row)
    end
    # Three optional matrices per group: r, dt and lag. This guards disk output
    # and work as well as memory. Dense matrices are streamed one row at a time.
    dense_cells = big(3) * n * n * length(groups)
    if mc["dense"]
        n <= mc["max_dense_events"] || error("Dense matrices need $n events; raise matrices.max_dense_events intentionally or set dense=false")
        dense_cells <= mc["max_dense_cells"] || error("Dense matrices need $dense_cells cells; raise matrices.max_dense_cells intentionally or set dense=false")
    end
    target = joinpath(out,"matrices")
    ispath(target) && error("Matrix output exists: $target")
    mkpath(target)
    open(joinpath(target,"event_order.csv"),"w") do io
        csvrow(io,"matrix_index","event_id","original_event_id")
        for e in sort(events;by=e->e.id); csvrow(io,e.id,e.id,e.name); end
    end
    open(joinpath(target,"index.csv"),"w") do index
        csvrow(index,"group","station","phase","accepted_edges","events_in_catalog","sparse_file","cc_dense_file","dt_dense_file","lag_dense_file")
        for (number, key) in enumerate(sort(collect(keys(groups))))
            edges = sort(groups[key];by=r->(r.i,r.j))
            stem = @sprintf("group_%04d",number)
            sparse = stem*"_edges.csv"
            open(joinpath(target,sparse),"w") do io
                csvrow(io,"event_i","event_j","cc_signed","dt_i_minus_j_s","lag_j_later_s","weight")
                for r in edges
                    weight = cfg["output"]["weight"] == "cc_squared" ? r.cc^2 : abs(r.cc)
                    csvrow(io,r.i,r.j,r.cc,round(r.dt;digits=precision),round(r.lag;digits=precision),weight)
                end
            end
            dense_names = ["", "", ""]
            if mc["dense"]
                lookup = Dict((r.i,r.j)=>r for r in edges)
                for (k, quantity) in enumerate((:cc,:dt,:lag))
                    name = stem*"_"*string(quantity)*".csv"
                    dense_names[k] = name
                    open(joinpath(target,name),"w") do io
                        csvrow(io,"event_id",ids...)
                        for i in ids
                            values = ["NA" for _ in ids]
                            for j in ids
                                i == j && continue
                                row = get(lookup,minmax(i,j),nothing)
                                row === nothing && continue
                                value = getproperty(row,quantity)
                                quantity != :cc && i > j && (value = -value)
                                values[j] = string(quantity == :cc ? value : round(value;digits=precision))
                            end
                            csvrow(io,i,values...)
                        end
                    end
                end
            end
            csvrow(index,number,key[1],key[2],length(edges),n,sparse,dense_names...)
        end
    end
    open(joinpath(target,"conventions.toml"),"w") do io
        TOML.print(io,Dict("scope"=>"accepted station-phase observations only",
            "event_count"=>n,"group_count"=>length(groups),"edge_count"=>length(rows),
            "dense"=>mc["dense"],"missing_value"=>"NA",
            "diagonal"=>"NA: self-correlations were not computed",
            "cc_symmetry"=>"symmetric", "dt_and_lag_symmetry"=>"antisymmetric",
            "dt_definition"=>"travel_time(i) - travel_time(j), seconds",
            "lag_definition"=>"residual after centring each waveform on its own pick; positive lag means shift j left to align with i, seconds",
            "weight"=>cfg["output"]["weight"],
            "positive_semidefinite_guaranteed"=>false);sorted=true)
    end
    write(joinpath(target,"README.md"),"""
    # Correlation matrices

    `index.csv` identifies each station/phase and its files. `event_order.csv`
    maps matrix indices to the sequential and original event IDs.

    The sparse edge files contain **accepted observations only**, one row for
    each i < j. An absent pair is missing, not a zero coefficient. Rejected pairs
    and pairs that could not be measured do not enter these matrices. Consult the
    run's decision and preprocessing ledgers to understand those omissions.

    Optional dense CSVs have an event-ID header row and first column. `NA` means
    missing, including the diagonal: no self-correlations were calculated.
    Correlation coefficients are symmetric. Differential times and lags are
    antisymmetric, so swapping i and j reverses their sign. Seconds are used.

    The coefficients are peaks of lag-search curves, not correlations evaluated
    at a single common alignment. Such a matrix need not be positive semidefinite.
    Do not silently fill missing entries with zero or treat exported weights as
    independently calibrated timing precision. No station/phase averaging or
    clustering has been performed here.
    """)
    println("Matrix export: $(length(groups)) station-phase groups, $(length(rows)) accepted edges; dense=$(mc["dense"])")
    return target
end
