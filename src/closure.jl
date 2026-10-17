using Random

"Deterministic bounded-memory triangle audit; no measurements are changed."
function closure_diagnostics(out,groups;maximum_samples=100_000)
    phase_values=Dict("P"=>Float64[],"S"=>Float64[])
    open(joinpath(out,"triangle_closure_summary.csv"),"w") do io
        csvrow(io,"station","phase","triangles_total","triangles_sampled","median_abs_s","p90_abs_s","fraction_over_0p1s")
        for group in groups
            edges=Dict((r.i,r.j)=>r.dt for r in group.rows)
            ids=sort(unique(vcat([r.i for r in group.rows],[r.j for r in group.rows])))
            forward=Dict(id=>Set{Int}() for id in ids)
            for (i,j) in keys(edges);push!(forward[i],j);end
            values=Float64[];seen=0;rng=MersenneTwister(1209)
            for (i,j) in sort(collect(keys(edges)))
                for k in sort(collect(intersect(forward[i],forward[j])))
                    value=edges[(i,j)]+edges[(j,k)]-edges[(i,k)];seen+=1
                    if length(values)<maximum_samples
                        push!(values,value)
                    else
                        index=rand(rng,1:seen)
                        index<=maximum_samples && (values[index]=value)
                    end
                end
            end
            append!(phase_values[group.phase],values);av=abs.(values)
            csvrow(io,group.station,group.phase,seen,length(av),isempty(av) ? NaN : median(av),
                   isempty(av) ? NaN : quantile(av,0.9),isempty(av) ? NaN : mean(av.>0.1))
        end
    end
    fig=Figure(size=(1150,500),fontsize=16)
    Label(fig[0,:],"Triangle closure · internal consistency before DDSync",fontsize=24,font=:bold)
    for (j,ph) in enumerate(("P","S"))
        values=phase_values[ph];within=filter(x->abs(x)<=0.5,values)
        ax=Axis(fig[1,j],title="$ph: $(length(values)) sampled; $(length(values)-length(within)) outside plot",
                xlabel="dt(i,j) + dt(j,k) − dt(i,k), seconds",ylabel="Triangles")
        isempty(within)||hist!(ax,within;bins=range(-0.5,0.5;length=101),color=REPORT_COLORS[ph])
    end
    Label(fig[2,:],"At most $maximum_samples triangles sampled per station-phase; see CSV for total and sampled counts.",fontsize=12)
    savefigure(out,"triangle_closure",fig)
    return nothing
end
