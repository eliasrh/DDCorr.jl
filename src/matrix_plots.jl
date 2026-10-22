"Bounded PNG views of accepted edges; grey is missing, including the diagonal."
function matrix_figures(out,events,rows,cfg)
    settings=cfg["matrices"]; n=length(events)
    keys=sort(unique((r.station,r.phase) for r in rows)); names=String[]
    open(joinpath(out,"matrices","matrix_plots.csv"),"w") do io
        csvrow(io,"station","phase","status","png")
        for (number,key) in enumerate(keys)
            if n>settings["max_plot_events"] || number>settings["max_plot_groups"]
                csvrow(io,key...,"skipped: max_plot_events or max_plot_groups","");continue
            end
            cc=fill(NaN,n,n);dt=fill(NaN,n,n);lag=fill(NaN,n,n)
            for r in rows
                (r.station,r.phase)==key || continue
                cc[r.i,r.j]=cc[r.j,r.i]=r.cc
                dt[r.i,r.j]=r.dt;dt[r.j,r.i]=-r.dt
                lag[r.i,r.j]=r.lag;lag[r.j,r.i]=-r.lag
            end
            fig=Figure(size=(1500,560),fontsize=19)
            Label(fig[0,:],"$(key[1]) $(key[2]) · accepted observations · grey = missing",fontsize=26)
            ticks=unique(round.(Int,range(1,n;length=min(n,8))))
            for (k,(data,title,unit)) in enumerate(((cc,"Signed coefficient r","r"),(dt,"dt(i − j)","seconds"),(lag,"Lag: j later than i","seconds")))
                vals=filter(isfinite,vec(data));limit=k==1 ? 1.0 : max(maximum(abs,vals;init=0.0),1e-6)
                ax=Axis(fig[1,2k-1],title=title,xlabel="event_id j",ylabel="event_id i",yreversed=true,aspect=DataAspect(),xticks=ticks,yticks=ticks)
                # Makie stores x on the first dimension; transpose so rows are i.
                hm=heatmap!(ax,1:n,1:n,permutedims(data);colormap=:vik,colorrange=(-limit,limit),nan_color="#D9DEE3")
                Colorbar(fig[1,2k],hm;label=unit)
            end
            name=@sprintf("matrices/group_%04d.png",number)
            save(joinpath(out,name),fig;px_per_unit=1.5)
            push!(names,name);csvrow(io,key...,"rendered",name)
        end
    end
    names
end
