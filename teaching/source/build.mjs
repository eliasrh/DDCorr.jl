import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {createCanvas} from '@napi-rs/canvas';
import sharp from 'sharp';
import {slides} from './content.mjs';

const here=path.dirname(fileURLToPath(import.meta.url)), repo=path.resolve(here,'../..');
const assets=path.join(repo,'teaching/assets'), build=path.resolve(process.env.DDCORR_SLIDES_BUILD || path.join(repo,'work/slides-build'));
const out=path.resolve(process.env.DDCORR_SLIDES_OUTPUT || path.join(repo,'teaching/DDCorr_minicourse.pptx'));
const skill=process.env.PRESENTATION_SKILL_DIR, py=process.env.PYTHON_EXECUTABLE||'python3';
const deck=Presentation.create({slideSize:{width:1280,height:720}}), ctx=createCanvas(10,10).getContext('2d');
const p={ink:'#172E2C',green:'#254B44',paper:'#FAF8F1',white:'#FFFFFF',sep:'#CED3C7',rust:'#A23D28',gold:'#F8B17B',mint:'#A4D7C1',light:'#486258',dark:'#142E2C',chalk:'#EFF5ED',sand:'#EFDFBF'};
const serif='Georgia', sans='Arial', mono='Menlo', tables=[], audit=[];
let s,folio,section,pageBottom;
const num=i=>String(i).padStart(2,'0');
function box(name,x,y,w,h,fill){return s.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0}});}
function text(name,txt,x,y,w,h,size,opt={}){
 const sh=s.shapes.add({name,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=String(txt);sh.text.style={typeface:opt.font||sans,fontSize:size,color:opt.color||p.ink,bold:opt.bold||false,italic:opt.italic||false,verticalAlignment:'top',insets:0,autoFit:'none',wrap:'none',alignment:opt.align||'left'};
 if(opt.href)sh.hyperlink={uri:opt.href,isExternal:true};return sh;
}
function width(t,size,font,bold){ctx.font=(bold?'bold ':'')+size+'px "'+font+'"';return ctx.measureText(t).width;}
function wrap(t,w,sz,f=sans,b=false){return String(t).split('\n').flatMap(a=>{let line='';const v=[];for(const word of a.trim().split(/\s+/)){const next=line?line+' '+word:word;if(line&&width(next,sz,f,b)>w*.97){v.push(line);line=word;}else line=next;}v.push(line);return v;});}
function flow(name,pars,x,y,w,h,opt={}){
 const f=opt.font||sans,b=opt.bold||false,gap=opt.gap??14,leading=opt.leading||1.24;
 let fs=opt.size||27, parts,used;
 do{parts=pars.filter(v=>v!==null&&v!==undefined&&String(v).trim()).map(v=>wrap(v,w,fs,f,b));used=parts.reduce((a,v)=>a+v.length*fs*leading,0)+Math.max(0,parts.length-1)*gap;
 if(used<=h||fs<=(opt.min||16))break;fs-=.5;}while(true);
 if(used>h+3)audit.push({slide:folio,name,overflow:used-h});
 const first=y;let k=0;for(const lines of parts){for(const line of lines){text(name+'-'+(++k),line,x,y,w,fs*1.48,fs,{...opt,font:f,bold:b});y+=fs*leading;}y+=gap;}return Math.max(0,y-gap-first);
}
function title(d,inverse=false){text('section',section.toUpperCase(),54,30,1160,28,15,{color:inverse?p.mint:p.rust,bold:true});
 const n=flow('heading',[d.title],52,66,1170,112,{font:serif,size:46,min:36,leading:1.10,color:inverse?p.chalk:p.ink});return Math.max(145,68+n+12);}
function citations(d){
 const raw=d.citation||[];
 return (Array.isArray(raw)?raw:[raw]).map(c=>typeof c==='string'?{text:c}:c);
}
function creditLines(d){return citations(d).reduce((n,c)=>n+wrap(c.text,1148,17,sans).length,0);}
function footer(d){
 text('page',String(folio),1161,672,65,28,17,{align:'right',color:p.light});
 const cs=citations(d);if(!cs.length)return;
 let y=pageBottom+12;for(const c of cs){y+=flow('citation',[c.text],56,y,1148,81,{size:17,min:17,color:p.light,href:c.url,leading:1.08,gap:0})+3;}
}
function stroke(name,points,color,thick=3){
 const xx=points.map(t=>t[0]),yy=points.map(t=>t[1]),x=Math.min(...xx),y=Math.min(...yy),w=Math.max(...xx)-x||1,h=Math.max(...yy)-y||1;
 return s.shapes.add({name,geometry:'custom',position:{left:x,top:y,width:w,height:h},line:{fill:color,width:thick,style:'solid'},fill:'none',customPaths:[{width:w,height:h,commands:points.map(([px,py],i)=>i?{lineTo:{x:px-x,y:py-y}}:{moveTo:{x:px-x,y:py-y}})}]});
}
function framingWave(){
 box('waveform-panel',55,194,531,427,p.dark);text('recording','Two P waves at one station',77,218,488,55,29,{font:serif,color:p.chalk});
 const draw=(base,shift,col,name)=>{text('event-label',name,83,base-60,205,30,19,{color:col,bold:true});stroke('baseline',[[84,base],[554,base]],'#5E7970',1);
 const pts=Array.from({length:222},(_,i)=>{let a=i-109-shift;return[84+i*2.12,base-46*(Math.sin(a*.25)*Math.exp(-a*a/560)+.4*Math.sin(a*.50+.6)*Math.exp(-a*a/240)+.19*Math.sin(a*.16)*Math.exp(-((a-35)**2)/750))];});stroke('pulse',pts,col,2.7);};
 draw(349,0,p.mint,'Earthquake i');draw(479,13,p.gold,'Earthquake j');
 stroke('guide-i',[[327,378],[327,406]],p.mint,1.8);stroke('guide-j',[[355,406],[355,434]],p.gold,1.8);
 stroke('shift',[[327,405],[355,405]],p.chalk,2);text('lag','lag',374,386,95,39,23,{color:p.chalk,font:serif});
 text('schematic','Time after the phase marker increases to the right',79,565,485,42,16,{color:p.mint});}

async function photo(rel,x,y,w,h,crop=false){const loc=path.join(assets,path.basename(rel)), bytes=await fs.readFile(loc),meta=await sharp(bytes).metadata();
 let data=bytes,typ=meta.format==='jpeg'?'image/jpeg':'image/png';
 if(crop){data=await sharp(bytes).resize(Math.round(w*1.5),Math.round(h*1.5),{fit:'cover',position:'centre'}).jpeg({quality:91}).toBuffer();typ='image/jpeg';}
 else {const sc=Math.min(w/meta.width,h/meta.height),nw=meta.width*sc,nh=meta.height*sc;x+=(w-nw)/2;y+=(h-nh)/2;w=nw;h=nh;}
 return s.images.add({name:'figure',blob:new Uint8Array(data).buffer,contentType:typ,alt:rel,position:{left:x,top:y,width:w,height:h},fit:'contain'});}
function noteList(d){return (d.body||[]).filter(Boolean);}
function paragraphs(d){return [d.lead,...noteList(d)].filter(Boolean);}
function caption(d){return d.caption||'';}
function sectionBreak(d){
 s.background.fill=p.dark;text('section',d.section.toUpperCase(),64,53,700,36,19,{bold:true,color:p.mint});
 const yy=152, hh=flow('heading',[d.title],61,yy,1130,196,{font:serif,size:63,min:48,color:p.chalk,leading:1.12});
 flow('lead',[d.lead],66,yy+hh+35,1080,166,{size:32,min:28,color:p.chalk});
 flow('activity',noteList(d),66,522,1100,113,{size:24,min:20,color:p.gold,gap:8});footer(d,true);
}
function agenda(d){
 title(d);
 for(const [i,part] of d.parts.entries()){const x=55+i*606;
 text('half',part.name,x,154,405,45,31,{font:serif,color:p.green});text('page-legend','Slides',x+471,171,82,23,15,{color:p.light,align:'right'});
 let y=214;
 for(const slot of part.slots){
  box('row-rule',x,y-6,556,1,p.sep);
  text('time',slot.time,x,y+2,135,32,19,{bold:true,color:p.green});
  flow('topic',[slot.topic],x+134,y,340,52,{size:20,min:18,leading:1.12});
  if(slot.range)text('slide-range',slot.range,x+467,y+2,86,27,16,{color:p.light,align:'right'});
  y+=63;
 }}
 footer(d);
}
function nativeTable(d,y){
 const ps=paragraphs(d);let top=y;if(d.lead){top+=flow('lead',[d.lead],56,y,1165,90,{size:25,min:20})+15;}
 const data=d.rows.map(row=>row.map(String)),nc=data[0].length, nr=data.length, avail=(pageBottom+0)-top, bottom=noteList(d).length?Math.min(avail*.38,113):0;
 const maxcol=Array.from({length:nc},(_,j)=>Math.max(...data.map(r=>Math.sqrt(2+r[j].length))));const sum=maxcol.reduce((a,b)=>a+b,0);
 const widths=maxcol.map(x=>Math.round(x/sum*1164));
 const table=s.tables.add({rows:nr,columns:nc,left:56,top,width:1164,height:Math.min(avail-bottom-10,(nr*64)+26),columnWidths:widths,values:data});
 const fs=nr>7||nc>=5?20:23;table.cells.block({row:0,column:0,rowCount:nr,columnCount:nc}).assign({fill:p.white,textStyle:{fontSize:fs,typeface:sans,color:p.ink},margins:{left:10,right:8,top:4,bottom:3},anchor:'center'});
 table.cells.block({row:0,column:0,rowCount:1,columnCount:nc}).assign({fill:p.green,textStyle:{fontSize:fs,typeface:sans,color:p.chalk,bold:true}});
 table.borders.assign({fill:p.sep,width:1,style:'solid'});tables.push(folio);
 if(bottom)flow('interpretation',noteList(d),58,(pageBottom+0)-bottom,1160,bottom,{size:24,min:19,gap:8});
}
function codeBlock(label,cmd,x,y,w,h){
 let lines=String(cmd).split('\n'),size=28;while(size>12.5&&(Math.max(...lines.map(l=>width(l,size,mono,false)))>w-50||lines.length*size*1.27>h-53))size-=.5;
 box('terminal',x,y,w,h,p.dark);text('command-label',label,x+20,y+11,w-40,24,15,{color:p.mint,bold:true});
 lines.forEach((line,i)=>text('command-'+i,line,x+20,y+43+i*size*1.25,w-32,size*1.55,size,{color:p.chalk,font:mono}));
 return size;
}
function cmdSlide(d,y){
 const cmds=[d.command,d.commandWindows].filter(Boolean),body=noteList(d);let cy=y;
 if(d.lead){cy+=flow('purpose',[d.lead],54,cy,1170,80,{size:25,min:20})+12;}
 const reserve=body.length?Math.min(169,Math.max(88,body.join(' ').length*.27)):0, space=(pageBottom+2)-reserve-cy-12;
 const lens=cmds.map(c=>c.split('\n').length);const usable=space-12*(cmds.length-1), extra=usable-cmds.length*49,sum=lens.reduce((a,b)=>a+b,0);
 cmds.forEach((c,i)=>{const h=Math.max(70,Math.min(usable,49+extra*lens[i]/sum,72+lens[i]*41));const label=cmds.length>1?(i?'WINDOWS POWERSHELL':'macOS / LINUX'):d.codeLabel||'COMMAND / SETTING';const actual=codeBlock(label,c,55,cy,1170,h);if(actual<=14)audit.push({slide:folio,smallCode:actual});cy+=h+12;});
 if(body.length){const checkpointY=Math.min(cy+19,(pageBottom+2)-reserve);box('check-rule',57,checkpointY,50,3,p.rust);flow('checkpoint',body,59,checkpointY+20,1155,(pageBottom-11)-checkpointY,{size:27,min:19,gap:13});}
}
async function figSlide(d,y){
 const desc=paragraphs(d), full=path.join(assets,path.basename(d.image)),m=await sharp(full).metadata();
 const ratio=m.width/m.height,words=desc.join(' ').length;const rightText=ratio<2.05&&words>=38;
 if(rightText){
  const w=ratio<1.4?633:766, gap=31,start=55;
  box('figure-paper',start,y,w,(pageBottom-2)-y,p.white);await photo(d.image,start+9,y+9,w-18,(pageBottom-2)-y-18);
  box('annotation-rule',start+w+gap,y+8,51,4,p.rust);
  const rx=start+w+gap;let cy=y+34;
  if(d.lead)cy+=flow('interpretation',[d.lead],rx,cy,1225-rx,Math.min(176,((pageBottom-5)-cy)*.52),{font:serif,size:28,min:20,color:p.green,leading:1.15})+17;
  flow('read-figure',noteList(d),rx,cy,1225-rx,(pageBottom-2)-cy,{size:23,min:17,gap:12});
 }else{
  const h=words?Math.min(150,Math.max(73,words*.27+31)):0;
  const fh=(pageBottom-4)-y-h;box('figure-paper',56,y,1168,fh,p.white);await photo(d.image,65,y+4,1150,fh-8);
  if(words){box('caption-mark',56,(pageBottom+4)-h,5,h-13,p.rust);flow('read-figure',desc,77,(pageBottom+0)-h,1137,h-1,{size:24,min:18,gap:5,leading:1.12});}
 }
}
function story(d,y){
 const body=noteList(d), lead=d.lead||body.shift()||'';
 if(!body.length){box('lead-mark',57,y+26,6,155,p.rust);flow('central-question',[lead],86,y+25,1085,366,{font:serif,size:45,min:30,color:p.green});}
 else {const long=body.join(' ').length>550,lw=long?390:466,rx=lw+100;
 box('lead-rule',55,y+16,62,4,p.rust);flow('premise',[lead],55,y+55,lw,(pageBottom-56)-y,{font:serif,size:36,min:24,color:p.green,leading:1.18});
 box('divider',rx-28,y+12,1,(pageBottom-26)-y,p.sep);flow('explanation',body,rx,y+27,1210-rx,(pageBottom-41)-y,{size:28,min:19,gap:27});}
}
function equations(d,y){
 let cy=y+7;
 if(d.lead)cy+=flow('description',[d.lead],55,cy,1160,95,{size:28,min:22,color:p.ink})+20;
 const f=d.fraction;
 if(f){
  const lhs=f.lhs||'r(k) =', lhsW=155;
  const w=Math.min(860,Math.max(width(f.numerator,40,serif),width(f.denominator,39,serif))+48);
  const left=(1280-w-lhsW)/2, x=left+lhsW;
  text('coefficient',lhs,left,cy+35,lhsW,75,45,{font:serif,color:p.ink});
  flow('numerator',[f.numerator],x,cy+2,w,66,{font:serif,color:p.ink,size:40,min:26,align:'center'});
  box('fraction-bar',x,cy+62,w,2,p.ink);
  flow('denominator',[f.denominator],x,cy+74,w,75,{font:serif,color:p.ink,size:39,min:26,align:'center'});
  cy+=173;
 }else{
  const eq=Array.isArray(d.equation)?d.equation:[d.equation];
  cy+=flow('equation',eq,57,cy,1161,144,{font:serif,color:p.green,size:42,min:32,leading:1.16,gap:7})+22;
 }
 flow('terms',noteList(d),58,cy,1154,pageBottom-cy,{size:26,min:19,color:p.ink,gap:12});
}
function bibliography(d,y){
 let cy=y+8;
 for(const ref of d.entries){
  box('reference-rule',56,cy,1164,1,p.sep);cy+=11;
  cy+=flow('author-date',[ref.authors],56,cy,1160,72,{size:22,min:19,bold:true,gap:0,leading:1.10})+4;
  cy+=flow('title-publication',[ref.detail],56,cy,1160,74,{size:21,min:19,gap:0,leading:1.13})+4;
  const info=ref.doi||ref.url;cy+=flow('doi',[info],56,cy,1160,48,{size:18,min:18,color:p.rust,href:ref.url,gap:0})+13;
 }
 if(d.software?.length){cy+=13;for(const v of d.software)cy+=flow('software-repository',[v.text],57,cy,1160,47,{size:20,min:20,color:p.rust,href:v.url})+5;}
 if(cy>pageBottom+5)audit.push({slide:folio,name:'bibliography',overflow:cy-pageBottom});
}
function handoff(d){
 const y=title(d);let cy=y+27;
 cy+=flow('guide-purpose',[d.lead],57,cy,1135,100,{font:serif,size:35,min:29,color:p.green})+23;
 if(d.link){text('guide-location',d.link.text,58,cy,1152,45,28,{bold:true,color:p.rust,href:d.link.url});cy+=61;}
 flow('lab-parts',noteList(d),58,cy,1137,pageBottom-cy,{size:26,min:21,gap:17});footer(d);
}
for(const [i,d] of slides.entries()){
 s=deck.slides.add();s.background.fill=p.paper;folio=i+1;section=d.section||'Friday workshop';pageBottom=650-creditLines(d)*20-(creditLines(d)?9:0);
 if(d.kind==='cover'){
  s.background.fill=p.dark;await photo('holuhraun_landsat.jpg',663,0,617,720,true);
  text('section','FRIDAY   /   10:00–18:00',54,56,540,31,18,{color:p.mint,bold:true});
  flow('heading',['Measuring earthquake','travel-time differences'],51,137,603,220,{font:serif,size:55,min:45,leading:1.15,color:p.chalk,gap:0});
  box('accent',57,365,69,4,p.gold);flow('subtitle',['A hands-on workshop in waveform cross-correlation with DDCorr.jl'],56,395,548,145,{size:30,min:27,color:p.chalk,leading:1.2});
  text('photo-credit','Holuhraun, Iceland  /  Landsat 8  /  6 September 2014',681,669,579,32,16,{color:p.white,bold:true});
  text('author','Elías Rafn Heimisson',57,648,550,40,22,{color:p.mint});
 }else if(d.kind==='framing'){
  s.background.fill=p.paper;
  flow('heading',[d.title],54,81,1165,107,{font:serif,size:48,min:40});framingWave();
  let yy=201;for(const [label,txt] of d.rows){box('rule',623,yy-6,594,1,p.sep);text('concept',label,624,yy+7,589,50,31,{font:serif,color:p.rust});flow('explanation',[txt],625,yy+52,586,80,{size:23,min:20});yy+=142;}footer(d);
 }else if(d.kind==='bibliography'){const y=title(d);bibliography(d,y);footer(d);
 }else if(d.kind==='handoff'){handoff(d);
 }else if(d.kind==='agenda')agenda(d);
 else if(d.kind==='break')sectionBreak(d);
 else {const y=title(d);
  if(d.image)await figSlide(d,y);else if(d.command||d.commandWindows)cmdSlide(d,y);else if(d.rows?.length)nativeTable(d,y);else if(d.equation)equations(d,y);else story(d,y);footer(d);}
 let notes=d.notes||'';if(d.sources?.length)notes+='\n\nSources and links\n'+d.sources.join('\n');s.speakerNotes.text=notes;
}
await fs.mkdir(build,{recursive:true});await fs.mkdir(out.slice(0,out.lastIndexOf('/')),{recursive:true});
const candidate=path.join(build,'candidate.pptx');
await(await PresentationFile.exportPptx(deck)).save(candidate);
await fs.writeFile(path.join(build,'fit-audit.json'),JSON.stringify(audit,null,2));
console.log('Exported '+slides.length+' slides. Fit audit '+JSON.stringify(audit));
if(process.argv.includes('--final')){
 const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
 const releaseDir=await fs.mkdtemp(path.join(build,'validated-'));const verified=path.join(releaseDir,'DDCorr_minicourse.pptx');const receipt=path.join(build,path.basename(releaseDir)+'-receipt.json');
 await finalizePresentation({workspaceDir:path.resolve(process.env.DDCORR_SLIDES_WORKSPACE||repo),candidatePath:candidate,finalPath:verified,pythonExecutable:py,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000',...tables.flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'design',families:[serif,sans,mono]},requiredNativeTableOwnerSlides:tables,verifyArtifactToolImport:true,receiptPath:receipt});
 await fs.copyFile(receipt,path.join(build,'validation_verified.json'));
 const stage=out+'.'+process.pid+'.part';await fs.copyFile(verified,stage);await fs.rename(stage,out);
}
if(process.argv.includes('--render')){const rend=path.join(build,'renders');await fs.mkdir(rend,{recursive:true});for(const [i,sl] of deck.slides.items.entries()){const blob=await deck.export({slide:sl,format:'png',scale:.8});await fs.writeFile(path.join(rend,'slide-'+num(i+1)+'.png'),new Uint8Array(await blob.arrayBuffer()));}}
