import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {createCanvas} from '@napi-rs/canvas';
import {slides} from './content.mjs';

const SOURCE_DIR=path.dirname(fileURLToPath(import.meta.url));
const REPO=path.resolve(SOURCE_DIR,'../..');
const WORKSPACE=REPO;
const HERE=path.resolve(process.env.DDCORR_SLIDES_BUILD||path.join(REPO,'work/slides-build'));
const SKILL=process.env.PRESENTATION_SKILL_DIR;
if(!SKILL) throw Error('Set PRESENTATION_SKILL_DIR to the presentations skill directory; see teaching/README.md.');
const RUNTIME_PYTHON=process.env.PYTHON_EXECUTABLE||'python3';
const {resolvePresentationFont,applyPresentationChartFont,finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')));
const FONT=resolvePresentationFont(),MONO='Menlo';
const C={ink:'#152A39',muted:'#4D606A',teal:'#007C83',orange:'#BC602A',bg:'#FCFCF9',line:'#CED8DA',light:'#EDF4F3'};
const presentation=Presentation.create({slideSize:{width:1280,height:720}});
const assets=path.join(HERE,'assets');await fs.mkdir(assets,{recursive:true});
await fs.mkdir(path.join(HERE,'renders'),{recursive:true});
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const noteRows=[];const sourceIndex=[];const charts=[],tables=[];
const measureContext=createCanvas(16,16).getContext('2d');
function wrapText(value,width,size,font=FONT){
 measureContext.font=`${size}px "${font}"`;
 return value.split('\n').flatMap(p=>{const result=[];let current='';for(const word of p.split(' ')){const next=current?current+' '+word:word;if(current&&measureContext.measureText(next).width>width-70){result.push(current);current=word;}else current=next;}result.push(current);return result;});
}

function text(slide,name,txt,x,y,w,h,size=29,color=C.ink,bold=false,font=FONT){
 const s=slide.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 s.text=txt;s.text.style={fontSize:size,typeface:font,color,bold,insets:0,autoFit:'none',wrap:'square',verticalAlignment:'top'};return s;
}
function paragraphs(slide,items,x=64,y=160,w=1150,size=29,gap=23){
 let cy=y;for(const p of items){const lines=wrapText(p,w,size);const h=lines.length*size*1.30+6;text(slide,`body-${cy}`,lines.join('\n'),x,cy,w,h,size);cy+=h+gap;if(cy-gap>654)throw Error(`Body overflow on slide ${presentation.slides.items.length}: ${cy-gap}`);}return cy;
}
function command(slide,code,x,y,w,h,size=26){
 const box=slide.shapes.add({geometry:'rect',position:{left:x-15,top:y-14,width:w+30,height:h+24},fill:C.light,line:{fill:'none',width:0}});
 return text(slide,'command',code,x,y,w,h,size,C.ink,false,MONO);
}
function table(slide,data,widths,y=170,height=360){
 tables.push(presentation.slides.items.length);
 const t=slide.tables.add({rows:data.length,columns:data[0].length,left:64,top:y,width:1152,height,columnWidths:widths,values:data});
 t.cells.block({row:0,column:0,rowCount:data.length,columnCount:data[0].length}).assign({textStyle:{fontSize:24,typeface:FONT,color:C.ink},fill:C.bg,margins:{left:14,right:14,top:5,bottom:5},anchor:'center'});
 t.cells.block({row:0,column:0,rowCount:1,columnCount:data[0].length}).assign({fill:C.ink,textStyle:{fontSize:24,typeface:FONT,bold:true,color:'#FFFFFF'}});
 t.borders.assign({fill:C.line,width:1,style:'solid'});return t;
}
async function excerpt(spec,id){
 const full=await fs.readFile(path.join(REPO,spec.file),'utf8');const lines=full.split('\n');
 const selections=spec.ranges?spec.ranges:spec.anchors.map(a=>{let start=lines.findIndex(l=>l.includes(a[0]));if(start<0)throw Error('Missing source anchor '+a[0]+' in '+spec.file);return[start+1,start+(a[1]||5)];});
 const rendered=[];for(let j=0;j<selections.length;j++){if(j)rendered.push(['','…']);for(let k=selections[j][0];k<=selections[j][1];k++)rendered.push([k,lines[k-1]??'']);}
 const label=spec.file+':'+selections.map(r=>r.join('–')).join(', ');
 const html=`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#eff3f4;color:#152a39;font:22px/1.45 'Courier New',monospace;}main{padding:16px 18px;}header{font:18px Arial;color:#4d606a;margin-bottom:12px}.line{display:flex}.num{width:58px;flex:none;color:#7e9097;text-align:right;padding-right:18px}.code{white-space:pre-wrap;overflow-wrap:anywhere}</style><main><header>${esc(label)}</header>${rendered.map(([n,c])=>`<div class="line"><span class="num">${n}</span><span class="code">${esc(c)}</span></div>`).join('')}</main>`;
 const indent=Math.min(...rendered.filter(([n,c])=>n&&c.trim()).map(([n,c])=>c.match(/^\s*/)[0].length));
 const rows=[];for(const [n,c] of rendered){let rest=n?c.slice(indent):c;let first=true;while(rest.length>70){const prefix=rest.slice(0,70);let split=Math.max(prefix.lastIndexOf(' '),prefix.lastIndexOf(','),prefix.lastIndexOf('+'));if(split<30)split=70;else split+=1;rows.push([first?n:'',rest.slice(0,split)]);rest='  '+rest.slice(split).trimStart();first=false;}rows.push([first?n:'',rest]);}
 const h=56+rows.length*31;const canvas=createCanvas(2280,h*2);const ctx=canvas.getContext('2d');ctx.scale(2,2);ctx.fillStyle='#eff3f4';ctx.fillRect(0,0,1140,h);ctx.font='18px Arial';ctx.fillStyle=C.muted;ctx.fillText(label,18,26);ctx.font='24px Menlo';for(let j=0;j<rows.length;j++){ctx.fillStyle='#7e9097';ctx.fillText(String(rows[j][0]).padStart(4),18,55+j*31);ctx.fillStyle=C.ink;ctx.fillText(rows[j][1],95,55+j*31);}
 const img=path.join(assets,`code-${id}.png`);await fs.writeFile(img,canvas.toBuffer('image/png'));
 await fs.writeFile(path.join(assets,`code-${id}.html`),html);
 const source=rendered.map(([n,c])=>`${n}: ${c}`).join('\n');sourceIndex.push({slide:id,file:spec.file,ranges:selections,label});return{img,width:1140,height:h,label,source};
}
function nativeChart(slide,spec){
 charts.push(presentation.slides.items.length);
 const chart=slide.charts.add(spec.type||'scatter',{
 position:{left:64,top:spec.top||180,width:spec.width||1152,height:spec.height||330},
 categories:spec.categories,
 series:spec.series.map((s,i)=>({...s,line:s.line||{style:'solid',width:2.5,fill:[C.teal,C.orange,'#6C60A4','#7B8D94'][i]},marker:s.marker||{symbol:'none'},fill:[C.teal,C.orange,'#6C60A4','#7B8D94'][i]})),
 scatterOptions:{style:spec.style||'lineWithMarkers'},lineOptions:{smooth:false},
 hasLegend:spec.series.length>1,legend:{position:'bottom',overlay:false,textStyle:{fontSize:21,fill:C.muted}},
 xAxis:{title:{text:spec.xTitle,textStyle:{fontSize:23,fill:C.ink}},min:spec.xmin,max:spec.xmax,majorUnit:spec.xstep,numberFormatCode:spec.xFormat||'0.0',textStyle:{fontSize:21,fill:C.muted},majorGridlines:null,position:'bottom',tickLabelPosition:'low',crossesAt:spec.xmin||0},
 yAxis:{title:{text:spec.yTitle,textStyle:{fontSize:23,fill:C.ink}},min:spec.ymin,max:spec.ymax,majorUnit:spec.ystep||.5,numberFormatCode:spec.yFormat||'0.0',textStyle:{fontSize:21,fill:C.muted},majorGridlines:{style:'solid',width:1,fill:C.line},position:'left',tickLabelPosition:'low',crossesAt:spec.ymin||0},
 chartFill:C.bg,plotAreaFill:C.bg,chartLine:{width:0,fill:'none'},plotAreaLine:{width:0,fill:'none'},
 });applyPresentationChartFont(chart,{fontFamily:FONT});return chart;
}

for(let i=0;i<slides.length;i++){
 const d=slides[i],n=i+1;const slide=presentation.slides.add();slide.background.fill=C.bg;
 text(slide,'title',d.title,64,50,1152,90,d.cover?54:41,C.ink,true);
 text(slide,'slide-number',String(n).padStart(2,'0'),1155,668,60,26,18,C.muted);
 text(slide,'section-label','DDCorr · '+(n<18?'QUICK START':n<37?'DATA AND SAC':n<47?'REAL CORRELATIONS':n<80?'METHODS':'PRACTICE'),64,673,1000,23,16,C.muted);
 let notes=d.notes||'';
 if(d.cover){paragraphs(slide,d.body,64,230,1050,34,28);text(slide,'course',d.subtitle||'DDCorr.jl teaching package',64,600,1100,40,24,C.teal,true);}
 else if(d.code){
   paragraphs(slide,d.body,64,154,1152,d.size||28,14);
   const e=await excerpt(d.code,n),maxH=d.codeHeight||300,scale=Math.min(1,(1152/e.width),(maxH/e.height));
   const w=e.width*scale,h=e.height*scale;const top=d.codeTop||325;
   slide.images.add({blob:new Uint8Array(await fs.readFile(e.img)).buffer,contentType:'image/png',alt:`Exact source excerpt ${e.label}`,position:{left:64,top,width:w,height:h},fit:'contain'});
   notes+=`\n\nImplementation: ${e.label}\n\nExact source excerpt:\n${e.source}`;
   if(d.footer)text(slide,'code-caption',d.footer,64,637,1080,30,21,C.muted);
 }
 else if(d.actualPlot){
  const buffer=new Uint8Array(await fs.readFile(path.join(REPO,d.actualPlot))).buffer;
  slide.images.add({blob:buffer,contentType:'image/png',alt:'Actual DDCorr synthetic waveform alignment before and after the measured shift',position:{left:48,top:155,width:680,height:495},fit:'contain',crop:{left:.24,right:.23,top:.065,bottom:.365}});
  slide.images.add({blob:buffer,contentType:'image/png',alt:'Actual DDCorr correlation curve for the same synthetic event pair',position:{left:748,top:155,width:490,height:230},fit:'contain',crop:{left:.24,right:.23,top:.65,bottom:.065}});
  paragraphs(slide,d.body,758,400,460,25,14);
 }
 else if(d.image){
  const imagePath=path.join(REPO,d.image);const buffer=await fs.readFile(imagePath);slide.images.add({blob:new Uint8Array(buffer).buffer,contentType:'image/png',alt:d.alt||d.title,position:d.position||{left:64,top:145,width:1152,height:430},fit:'contain'});if(d.body)paragraphs(slide,d.body,64,d.bodyY||590,1120,d.size||26,14);
 }
 else if(d.table){table(slide,d.table,d.widths,d.tableTop||170,d.tableHeight||360);if(d.body)paragraphs(slide,d.body,64,d.bodyY||555,1120,d.size||27,16);}
 else if(d.chart){nativeChart(slide,d.chart);paragraphs(slide,d.body,64,d.bodyY||535,1120,d.size||28,16);}
 else if(d.command){
   const y=d.commandTop||160;command(slide,d.command,80,y,1118,d.commandHeight||240,d.codeSize||25);
   if(d.body)paragraphs(slide,d.body,64,d.bodyY||445,1152,d.size||28,20);
 }
 else if(d.equation){
   if(d.intro)paragraphs(slide,[d.intro],64,150,1152,28,10);
   text(slide,'equation',d.equation,64,d.eqY||240,1150,d.eqH||140,d.eqSize||36,C.teal,true);
   paragraphs(slide,d.body,64,d.bodyY||400,1152,d.size||28,20);
 }
 else if(d.columns){paragraphs(slide,d.columns[0],64,160,550,d.size||28,24);paragraphs(slide,d.columns[1],666,160,550,d.size||28,24);}
 else paragraphs(slide,d.body,64,160,1152,d.size||30,d.gap||30);
 if(d.sources)notes+='\n\nSources:\n'+d.sources.join('\n');
 slide.speakerNotes.text=notes;
 noteRows.push(`# ${n}. ${d.title}\n\n${(d.body||[]).join('\n\n')}\n\n${d.command?'```sh\n'+d.command+'\n```\n\n':''}${d.equation?'Equation: '+d.equation+'\n\n':''}${notes}\n`);
}
await fs.writeFile(path.join(HERE,'code_index.json'),JSON.stringify(sourceIndex,null,2));
await fs.writeFile(path.join(REPO,'teaching/LECTURE_NOTES.md'),'# DDCorr.jl lecture notes\n\nThe PowerPoint contains editable text, commands and tables; equations, scientific figures and source excerpts are PNG images with source included. Code excerpts are images of the exact source listed below.\n\n'+noteRows.join('\n---\n\n'));
await fs.writeFile(path.join(HERE,'presentation.json'),JSON.stringify(presentation.toProto()));
const draft=path.join(HERE,'candidate.pptx');await(await PresentationFile.exportPptx(presentation)).save(draft);
for(let i=0;i<presentation.slides.items.length;i++){
 const slide=presentation.slides.items[i];const blob=await presentation.export({slide,format:'png',scale:1});
 await fs.writeFile(path.join(HERE,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 const layout=await slide.export({format:'layout'});await fs.writeFile(path.join(HERE,'renders',`slide-${String(i+1).padStart(2,'0')}.json`),await layout.text());
 console.log(`Rendered ${i+1}/${presentation.slides.items.length}`);
}
const montage=await presentation.export({format:'webp',montage:true,scale:.25});await fs.writeFile(path.join(HERE,'montage.webp'),new Uint8Array(await montage.arrayBuffer()));
if(process.argv.includes('--final')){
 const finalPath=path.resolve(process.env.DDCORR_SLIDES_OUTPUT||path.join(REPO,'teaching/DDCorr_minicourse_rebuilt.pptx'));
 const result=await finalizePresentation({workspaceDir:WORKSPACE,candidatePath:draft,finalPath,pythonExecutable:RUNTIME_PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit',...tables.flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'design',families:[FONT,MONO]},requiredNativeTableOwnerSlides:tables,requiredNativeChartOwnerSlides:charts,materializeLiteralChartWorkbooks:true,nativeChartTargetApplication:'powerpoint',verifyArtifactToolImport:true,receiptPath:path.join(HERE,'validation_verified.json')});console.log(result);
}else console.log({draft,slides:slides.length,font:FONT,charts,tables});
