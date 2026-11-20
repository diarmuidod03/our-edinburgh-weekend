// Icon shapes adapted from Lucide (ISC license).
const iconPaths = {
 home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/>',
 map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
 list:'<path d="m3 6 2 2 3-4m2 3h11m-18 6 2 2 3-4m2 3h11m-18 6 2 2 3-4m2 3h11"/>',
 pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 chevron:'<path d="m6 9 6 6 6-6"/>',check:'<path d="m5 12 4 4L19 6"/>',
 tram:'<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M12 3v8m-5 7-2 3m12-3 2 3M8 15h.01M16 15h.01"/>',
 food:'<path d="M3 3v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3M6 3v18m14-18v18m0-18c-3 2-4 4-4 9h4"/>',
 sight:'<path d="m3 9 9-5 9 5M4 11h16M6 11v7m4-7v7m4-7v7m4-7v7M3 20h18"/>',
 stay:'<path d="M3 18V8m0 8h18v2m0-2v-4a2 2 0 0 0-2-2h-9v6"/><circle cx="6.5" cy="12.5" r="1.5"/>',
 music:'<path d="M9 18V5l11-2v13M9 9l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>',
 sparkle:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
 heart:'<path d="M20.8 8.6c0 4.6-8.8 11-8.8 11S3.2 13.2 3.2 8.6a4.5 4.5 0 0 1 8.8-1 4.5 4.5 0 0 1 8.8 1Z"/>'
};
const icon = name => '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+iconPaths[name]+'</svg>';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const main = document.querySelector('#main');
const storageKey = 'our-edinburgh-weekend-v1';
const empty = () => ({done:{}, checks:{}, notes:{}, picks:{}, memories:{}});
function loadState(){
 try {return {...empty(),...JSON.parse(localStorage.getItem(storageKey))};}
 catch {return empty();}
}
let state = loadState();
function save(){
 try {localStorage.setItem(storageKey,JSON.stringify(state));}
 catch {announce('Storage is unavailable. Changes are saved for this session only.');}
}
const announce = message => {document.querySelector('#announcement').textContent = message;};
const itinerary = days.flatMap((day,dayIndex)=>day.items.map((a,index)=>Object.assign(a,{day,dayIndex,index})));
const timestamp = (day,time) => Date.parse(day.date+'T'+time+':00+00:00');
const sunset = timestamp(days[1],'15:54');
const departure = timestamp(days[1],'20:40');
const nav = [['home','Home','home'],['saturday','Saturday','calendar'],['sunday','Sunday','sun'],['map','Map','map'],['checklist','Checklist','list']];
let page = 'home';
let mapDay = 0;
const startAt = a => timestamp(a.day,a.start);
const finishAt = a => timestamp(a.day,a.end || '23:59');
const selected = a => a.spots[state.picks[a.id] ?? 0] || a.spots[0];
const routeSpots = a => a.choices ? [selected(a)] : a.spots;
const previous = a => {
 const prior = a.day.items[a.index-1];
 return prior ? routeSpots(prior).at(-1) : null;
};
const timeLabel = a => a.start+(a.end?'–'+a.end:' onwards');
function schedule(now=Date.now()){
 return {
  current:itinerary.find(a=>!state.done[a.id] && startAt(a)<=now && now<finishAt(a)),
  next:itinerary.find(a=>!state.done[a.id] && startAt(a)>now)
 };
}
const gmaps = (destination,origin,mode='walking',waypoints=[]) => {
 const format = spot => spot.name+' '+spot.address;
 const query = new URLSearchParams({api:'1',destination:format(destination),travelmode:mode});
 if(origin)query.set('origin',format(origin));
 if(waypoints.length)query.set('waypoints',waypoints.map(format).join('|'));
 return 'https://www.google.com/maps/dir/?'+query;
};
function directions(a,spot){
 if(spot){
  const index = routeSpots(a).indexOf(spot);
  return gmaps(spot,index>0?routeSpots(a)[index-1]:previous(a),index>0 && a.id==='land'?'transit':a.mode||'walking');
 }
 if(a.id==='land')return gmaps(haymarket,airport,'transit');
 const points = routeSpots(a);
 const origin = previous(a);
 const last = points.at(-1);
 return gmaps(last,origin?.name===last.name ? null : origin,a.mode||'walking',points.slice(0,-1));
}
const external = (label,url,cls='',symbol='') => '<a class="btn '+cls+'" href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">'+(symbol?icon(symbol):'')+escapeHtml(label)+'</a>';
const internal = (label,hash,cls='',symbol='') => '<a class="btn '+cls+'" href="#'+hash+'">'+(symbol?icon(symbol):'')+label+'</a>';
const counter = items => items.filter(a=>state.done[a.id]).length;
function progress(items,label){
 const done=counter(items), pct=Math.round(100*done/items.length);
 return '<div class="progress-row"><span>'+done+' of '+items.length+' stops complete</span><span>'+pct+'%</span></div><progress class="progress" value="'+done+'" max="'+items.length+'" aria-label="'+label+'"></progress>';
}
function nextPanel(day){
 const {current,next} = schedule();
 const candidate = day ? (day.items.find(a=>!state.done[a.id] && startAt(a)>Date.now()) || (current?.day===day?current:null)) : next;
 const nowInDay = current && (!day||current.day===day);
 if(!candidate && current && !day)return '<h3>'+current.title+'</h3><p class="muted">Current stop · '+selected(current).address+'</p><div class="actions">'+external('Directions',directions(current),'primary','pin')+'</div>';
 if(!candidate)return (nowInDay?'<p class="muted">Current stop · '+current.title+'</p>':'')+'<h3>No upcoming stops</h3><p class="muted">You can still revisit the itinerary and mark stops complete.</p>';
 const spot = selected(candidate);
 return (nowInDay && current!==candidate?'<p class="muted">Current stop · '+current.title+'</p>':'')+
 '<h3>'+candidate.title+'</h3><p class="muted">'+candidate.day.name+' · '+candidate.start+' · '+spot.address+'</p><small>'+candidate.journey+'</small>'+
 (day?'<p>'+candidate.copy+'</p>':'')+'<div class="actions">'+external('Directions',directions(candidate),'primary','pin')+(!day?internal('View itinerary',candidate.day.name.toLowerCase()):'')+'</div>';
}
const countdown = ms => {
 const total=Math.max(1,Math.ceil(ms/60000)), d=Math.floor(total/1440), h=Math.floor(total%1440/60), m=total%60;
 return (d?d+'d ':'')+(h?h+'h ':'')+m+'m';
};
function tripStatus(){
 const now=Date.now(), first=startAt(itinerary[0]);
 return now<first?'Starts in '+countdown(first-now):now<departure?'Weekend in progress':'Weekend dates have passed';
}
const events = [['Mary King’s Close',startAt(itinerary.find(a=>a.id==='close'))],['Christmas Market visit',startAt(itinerary.find(a=>a.id==='market'))],['Scotch Whisky Experience',startAt(itinerary.find(a=>a.id==='whisky'))],['Calton Hill sunset',sunset],['Flight departure',departure]];
function eventTimes(){
 const future=events.filter(([,time])=>time>Date.now() && time-Date.now()<=4*86400000);
 return future.length?'<ul class="count-list">'+future.map(([label,time])=>'<li><span>'+label+'</span><strong>'+countdown(time-Date.now())+'</strong></li>').join('')+'</ul>':'<p class="muted">Countdowns appear in the days leading up to the trip.</p>';
}
function sunsetPanel(){
 const now=Date.now(), until=sunset-now;
 const status=until>0?(until<3*86400000?countdown(until)+' to sunset. ':''):'The scheduled sunset has passed. ';
 const caution=until>0 && until<=35*60000 && !state.done.hill?'If you haven’t left for Calton Hill, the time before sunset is tight. Allow 15–20 minutes to reach the hill and up to 15 more to climb.':'Aim to be at the viewpoint by 15:50. A late whisky tour can shorten the viewing window.';
 return '<strong>15:54 local time · Sunday 22 November</strong><p class="notice">'+status+'It gets dark early in Edinburgh in November. '+caution+'</p>';
}
const note = (label,group,id,limit=320) => '<label class="note">'+label+'<textarea maxlength="'+limit+'" data-store="'+group+'" data-key="'+id+'">'+escapeHtml(state[group][id])+'</textarea></label>';
const dayProgress = d => progress(d.items,d.name+' progress');
const memory = d => '<article class="panel"><h3>'+d.name+' memories</h3>'+note('Favourite moment','memories',d.date+'-favourite')+note('A short note','memories',d.date+'-note')+note('A memory to keep','memories',d.date+'-memory')+'</article>';
function homePage(){
 const quick = [['Google Maps','https://www.google.com/maps/search/?api=1&query=Edinburgh+Scotland'],['Edinburgh Trams',links.tram],['Edinburgh Airport',links.airport],['Christmas Market',links.market],['Mary King’s Close',links.close],['Scotch Whisky Experience',links.whisky],['Airbnb location',gmaps(home)]];
 return '<section class="hero"><div class="hero-copy"><div class="eyebrow">'+icon('calendar')+' 21–22 November 2026</div><h1>Our Edinburgh <em>Weekend</em></h1><p>A little Scottish adventure for two</p><div class="trip-status">'+icon('clock')+' <span data-live="trip">'+tripStatus()+'</span></div></div><div class="hero-photo" role="img" aria-label="Edinburgh skyline from Calton Hill"></div></section>'+
 '<div class="home-grid"><section class="panel next"><div class="eyebrow">'+icon('pin')+' Where are we going next?</div><div data-live="next">'+nextPanel()+'</div></section><section class="panel"><div class="eyebrow">'+icon('compass')+' Trip progress</div><h3>Our weekend so far</h3>'+progress(itinerary,'Weekend progress')+(counter(itinerary)===itinerary.length?'<p class="notice">Weekend complete! You did Edinburgh together.</p>':'')+'<div class="actions">'+external('Check Edinburgh forecast',links.weather,'','sun')+'</div></section></div>'+
 '<section class="section"><div class="section-heading"><h2>The itinerary</h2>'+internal('Open maps','map','','map')+'</div><div class="day-grid">'+days.map((d,i)=>'<article class="day-card"><a class="day-photo '+d.name.toLowerCase()+'" aria-label="Open '+d.name+' itinerary" href="#'+d.name.toLowerCase()+'"></a><div class="day-body"><div class="eyebrow">'+d.label+'</div><h3>'+d.name+'</h3><p>'+d.tag+'</p>'+dayProgress(d)+'<div class="actions">'+internal('View '+d.name,d.name.toLowerCase(),'primary')+'</div></div></article>').join('')+'</div></section>'+
 '<div class="home-grid"><section class="panel"><div class="eyebrow">'+icon('clock')+' Coming up</div><h3>Weekend countdowns</h3><div data-live="events">'+eventTimes()+'</div></section><section class="panel"><div class="eyebrow">'+icon('sun')+' Sunday highlight</div><h3>Sunset on Calton Hill</h3><div data-live="sunset">'+sunsetPanel()+'</div></section></div>'+
 '<section class="section"><h2>Quick links</h2><div class="actions">'+quick.map(([name,url])=>external(name,url)).join('')+'</div></section><section class="section"><h2>Our memories</h2><div class="memory-grid">'+days.map(memory).join('')+'</div></section>';
}
function card(a){
 const spot=selected(a), done=!!state.done[a.id];
 const style=a.feature==='festive'?'sparkle':a.feature==='sunset'?'sun':spot.type;
 const status=a.badge || (a.feature==='festive'?'Festive highlight':a.feature==='sunset'?'Sunset · 15:54':'Planned');
 const places = a.choices ? '<div class="choices" role="group" aria-label="'+a.title+' venues">'+a.spots.map((p,i)=>'<div class="choice '+(p===spot?'selected':'')+'"><label><input type="radio" name="'+a.id+'" data-pick="'+a.id+'" value="'+i+'" '+(p===spot?'checked':'')+'><span><strong>'+p.name+'</strong><br><small>'+p.address+' · '+a.choices[i]+'</small></span></label><div class="choice-meta actions">'+external('Directions',directions(a,p))+(p.site?external('Venue information',p.site):'')+'</div></div>').join('')+'</div>' : a.spots.length>1 ? '<ol>'+a.spots.map(p=>'<li>'+p.name+(p.site?' · <a href="'+p.site+'" target="_blank" rel="noopener noreferrer">Official information</a>':'')+'</li>').join('')+'</ol>' : '';
 return '<details class="activity '+(a.feature||'')+(done?' done':'')+'" id="'+a.id+'"><summary><span class="stop-icon">'+icon(done?'check':style)+'</span><span><span class="activity-time">'+timeLabel(a)+'</span><span class="activity-title">'+a.title+'</span><span class="badge">'+status+(done?' · Complete':'')+'</span></span>'+icon('chevron')+'</summary><div class="activity-detail"><p><strong>'+spot.address+'</strong><br><small>'+a.journey+'</small></p><p>'+a.copy+'</p>'+places+(a.id==='hill'?'<div data-live="sunset">'+sunsetPanel()+'</div>':'')+'<div class="actions">'+external(a.mode==='transit'?'Tram directions':'Walking directions',directions(a),'','pin')+(spot.site&&!a.choices?external('Official information',spot.site):'')+(a.refs||[]).map(([label,url])=>external(label,url)).join('')+'</div>'+note('Personal note','notes',a.id)+'<div class="actions"><button type="button" class="btn primary" data-complete="'+a.id+'" aria-pressed="'+done+'">'+icon('check')+(done?'Undo completion':'Mark as complete')+'</button></div></div></details>';
}
function dayPage(d){
 return '<section class="hero day-hero '+d.name.toLowerCase()+'"><div class="hero-copy"><div class="eyebrow">'+icon(d===days[0]?'calendar':'sun')+' '+d.label+' 2026</div><h1>'+d.name+'</h1><p>'+d.intro+'</p></div></section><section class="panel day-summary"><h3>'+d.tag+'</h3>'+dayProgress(d)+(counter(d.items)===d.items.length?'<p class="notice">'+d.name+' complete! A day to remember.</p>':'')+'<div class="actions">'+internal('Open '+d.name+' map','map/'+(d===days[0]?'saturday':'sunday'),'','map')+'</div></section><section class="section"><h2>Day plan</h2><p class="muted">All times are Edinburgh local time. Journey times and distances are estimates.</p><div class="timeline">'+d.items.map(card).join('')+'</div></section>'+memory(d);
}
function checklistPage(){
 const entries=Object.entries(checklist);
 const count=Object.keys(state.checks).filter(k=>state.checks[k]).length;
 return '<div class="eyebrow">'+icon('list')+' Weekend preparation</div><h1 class="page-title">Our checklist</h1><p class="muted">'+count+' of '+entries.flatMap(([,items])=>items).length+' checked off. Saved in this browser.</p><div class="check-grid">'+entries.map(([label,items],g)=>'<section class="panel"><h3>'+label+'</h3>'+items.map((item,i)=>'<label class="check-item"><input type="checkbox" data-check="'+g+'-'+i+'" '+(state.checks[g+'-'+i]?'checked':'')+'><span>'+item+'</span></label>').join('')+'</section>').join('')+'</div><section class="section"><h2>Reset weekend</h2><p class="muted">Clear saved activity progress, notes, venue choices, memories and checklist items on this device.</p><button type="button" class="btn" data-reset>Reset Weekend Progress</button></section>';
}
function draw(keep=false){
 const open=keep ? [...main.querySelectorAll('details[open]')].map(el=>el.id) : [];
 document.querySelector('#nav').innerHTML=nav.map(([id,label,symbol])=>'<a href="#'+id+'" '+(page===id?'aria-current="page"':'')+'>'+icon(symbol)+'<span>'+label+'</span></a>').join('');
 if(typeof disposeMap==='function')disposeMap();
 if(page==='home')main.innerHTML=homePage();
 if(page==='saturday'||page==='sunday')main.innerHTML=dayPage(days[page==='sunday'?1:0]);
 if(page==='checklist')main.innerHTML=checklistPage();
 if(page==='map')renderMap(days[mapDay]);
 open.forEach(id=>{const el=document.getElementById(id);if(el)el.open=true;});
}
function navigate(){
 if(location.hash==='#main'){main.focus();return;}
 const [view, day] = location.hash.slice(1).split('/');
 page=nav.some(([id])=>id===view)?view:'home';
 if(page==='map')mapDay=day?Number(day==='sunday'):schedule().next?.dayIndex ?? schedule().current?.dayIndex ?? (Date.now()>=timestamp(days[1],'00:00')?1:0);
 draw();
 window.scrollTo({top:0,behavior:'instant'});
 main.focus({preventScroll:true});
}
function burst(button){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const r=button.getBoundingClientRect();
 Array.from({length:8},(_,i)=>{
  const piece=document.createElement('span');
  piece.className='confetti';
  piece.textContent=i%2?'✦':'·';
  piece.setAttribute('aria-hidden','true');
  piece.style.left=(r.left+r.width/2)+'px';
  piece.style.top=r.top+'px';
  piece.style.setProperty('--x',(Math.cos(i*Math.PI/4)*64)+'px');
  piece.style.setProperty('--y',(Math.sin(i*Math.PI/4)*54)+'px');
  document.body.append(piece);
  setTimeout(()=>piece.remove(),750);
 });
}
function complete(id,button){
 const a=itinerary.find(item=>item.id===id);
 if(!a)return;
 const done=state.done[id]=!state.done[id];
 save();
 if(done)burst(button);
 if(page==='map')refreshMap(a);
 else{
  draw(true);
  main.querySelector('[data-complete="'+id+'"]')?.focus({preventScroll:true});
 }
 const all=counter(itinerary)===itinerary.length;
 const dayComplete=counter(a.day.items)===a.day.items.length;
 announce(all?'Weekend complete!':dayComplete?a.day.name+' complete!':a.title+(done?' marked complete.':' completion undone.'));
 if(all && done)document.querySelector('#celebration').showModal();
}
main.addEventListener('click',event=>{
 const btn=event.target.closest('button');
 if(!btn)return;
 if(btn.dataset.complete)complete(btn.dataset.complete,btn);
 if(btn.hasAttribute('data-reset') && confirm('Reset progress, checklist items, chosen venues and notes for this weekend on this device?')){
  state=empty();save();draw(true);announce('Weekend progress reset.');
  main.querySelector('[data-reset]').focus();
 }
});
main.addEventListener('change',event=>{
 const {check,pick}=event.target.dataset;
 if(check){
  state.checks[check]=event.target.checked;save();
  const checked=main.querySelectorAll('[data-check]:checked').length;
  main.querySelector('p.muted').textContent=checked+' of '+main.querySelectorAll('[data-check]').length+' checked off. Saved in this browser.';
 }
 if(pick){
  state.picks[pick]=Number(event.target.value);save();draw(true);
  main.querySelector('[data-pick="'+pick+'"]:checked')?.focus({preventScroll:true});
 }
});
main.addEventListener('input',event=>{
 const {store,key}=event.target.dataset;
 if(store){state[store][key]=event.target.value;save();}
});
function updateLive(){
 const values={trip:tripStatus, next:()=>nextPanel(page==='map'?days[mapDay]:undefined), sunset:sunsetPanel, events:eventTimes};
 document.querySelectorAll('[data-live]').forEach(el=>{
  const value=values[el.dataset.live]();
  if(!el.contains(document.activeElement) && el.innerHTML!==value)el.innerHTML=value;
 });
 if(page==='map')updateMapClock();
}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
window.addEventListener('hashchange',navigate);
document.addEventListener('DOMContentLoaded',()=>{navigate();setInterval(updateLive,15000);});
