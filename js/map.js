let leafletMap;
let markerLayer;
let mapSnapshot;
let activeMapDay;
let focusStop;
let basemapTimer;
const markerStatus = (a,s) => state.done[a.id]?'done':s.current===a||s.next===a?'active':'';
function disposeMap(){
 clearTimeout(basemapTimer);
 if(leafletMap)leafletMap.remove();
 leafletMap=markerLayer=mapSnapshot=activeMapDay=focusStop=undefined;
}
function mapRows(day){
 return day.items.map(a=>'<div><span><strong>'+String(a.index+1).padStart(2,'0')+' · '+a.title+(state.done[a.id]?' ✓':'')+'</strong><br><small>'+timeLabel(a)+' · '+selected(a).name+'</small></span><span class="actions">'+external('Directions',directions(a))+(leafletMap?'<button class="btn" data-map-stop="'+a.id+'">Show pin</button>':'')+'<button class="btn" data-complete="'+a.id+'" aria-pressed="'+!!state.done[a.id]+'">'+(state.done[a.id]?'Undo':'Complete')+'</button></span></div>').join('');
}
function mapStatus(){
 const s=schedule();
 return [s.current?.id,s.next?.id].join('/');
}
function renderMap(day){
 activeMapDay=day;
 main.innerHTML='<div class="eyebrow">'+icon('map')+' Explore Edinburgh</div><h1 class="page-title">Our route</h1><section class="panel next"><div class="eyebrow">'+icon('pin')+' Where next?</div><div data-live="next">'+nextPanel(day)+'</div></section><div class="actions" aria-label="Choose a map">'+days.map(d=>'<a class="btn '+(d===day?'primary':'')+'" '+(d===day?'aria-current="true"':'')+' href="#map/'+d.name.toLowerCase()+'">'+d.name+' map</a>').join('')+'</div><div class="map-wrap"><p class="map-fallback" id="map-fallback" hidden>Map tiles are unavailable. Use the numbered stops and Google Maps directions below.</p><div class="map-canvas" id="leaflet" role="region" aria-label="'+day.name+' interactive map"></div></div><div class="legend"><span><b style="background:#e3b55e"></b>Current / next</span><span><b style="background:#246247"></b>Completed</span><span><b style="background:#782f3c"></b>Food / music</span><span><b style="background:#285779"></b>Transport</span><span><b style="background:#5a625d"></b>Other stops</span></div><p class="muted">Dashed lines show approximate connections. Blue lines show tram transfers. Use Google Maps for actual walking or transit directions.</p><div data-map-progress>'+dayProgress(day)+'</div><section class="section"><h2>'+day.name+' stops</h2><div class="map-list" data-map-list></div></section>';
 const fallback=document.querySelector('#map-fallback');
 if(!window.L){
  fallback.hidden=false;
  document.querySelector('#leaflet').hidden=true;
  main.querySelector('[data-map-list]').innerHTML=mapRows(day);
  return;
 }
 leafletMap=L.map('leaflet',{scrollWheelZoom:false,fadeAnimation:false});
 markerLayer=L.layerGroup().addTo(leafletMap);
 const bounds=day.items.flatMap(a=>a.spots.map(p=>p.point));
 leafletMap.fitBounds(bounds,{padding:[24,28],maxZoom:14});
 addBasemap(fallback);
 const city=bounds.filter(p=>p[1]>-3.3);
 const zoomButton=L.control({position:'bottomleft'});
 zoomButton.onAdd=()=>{
  const container=L.DomUtil.create('div','leaflet-bar map-tools');
  const btn=(label,points)=>{
   const el=L.DomUtil.create('button','',container);el.type='button';el.textContent=label;
   L.DomEvent.disableClickPropagation(el);
   el.addEventListener('click',()=>leafletMap.fitBounds(points,{padding:[25,35],maxZoom:16}));
  };
  btn('City stops',city);btn('Full day',bounds);
  return container;
 };
 zoomButton.addTo(leafletMap);
 drawMarkers();
 main.querySelector('[data-map-list]').innerHTML=mapRows(day);
}
function addBasemap(fallback){
 const attribution='<a href="https://openfreemap.org/">OpenFreeMap</a> · © <a href="https://openmaptiles.org/">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
 try {
  const layer=L.maplibreGL({
   style:'https://tiles.openfreemap.org/styles/liberty',
   attribution
  }).addTo(leafletMap);
  const basemap=layer.getMaplibreMap();
  basemapTimer=setTimeout(()=>{fallback.hidden=false;},10000);
  basemap.on('idle',()=>{
   if(!basemap.isStyleLoaded() || !basemap.areTilesLoaded())return;
   const features=basemap.queryRenderedFeatures();
   const hasStreetData=features.some(feature=>feature.source==='openmaptiles');
   if(hasStreetData)clearTimeout(basemapTimer);
   fallback.hidden=hasStreetData;
  });
 } catch(error){
  fallback.hidden=false;
 }
}
function drawMarkers(reopen){
 if(!markerLayer)return;
 markerLayer.clearLayers();
 const s=schedule();
 mapSnapshot=mapStatus();
 activeMapDay.items.forEach(a=>{
  const origin=previous(a);
  const points=routeSpots(a);
  const segment=origin?[origin,...points]:points;
  if(segment.length>1)L.polyline(segment.map(p=>p.point),{interactive:false,color:a.mode==='transit'?'#285779':'#782f3c',dashArray:a.mode==='transit'?'':'5 7',weight:3,opacity:.82}).addTo(markerLayer);
  a.spots.forEach((p,i)=>{
   const n=a.index+1;
   const suffix=a.spots.length>1?String.fromCharCode(97+i):'';
   const marker=L.marker(p.point,{
    title:n+suffix+' '+p.name,
    opacity:a.choices && p!==selected(a) ? .68 : 1,
    alt:n+suffix+' '+p.name,
    zIndexOffset:markerStatus(a,s)==='active'?300:a.id==='river'?-100:0,
    icon:L.divIcon({className:'',iconSize:[43,29],iconAnchor:[21+(a.id==='river'?23:0),15+(a.id==='river'?16:0)],popupAnchor:[0,-12],html:'<span class="map-pin '+p.type+' '+markerStatus(a,s)+'">'+n+suffix+icon(p.type)+'</span>'})
   }).addTo(markerLayer);
   const alternate=a.choices && p!==selected(a)?' · Alternate':'';
   const status=s.current===a?' · Current':s.next===a?' · Next':'';
   marker.bindPopup('<strong>'+p.name+'</strong><br>'+timeLabel(a)+status+alternate+'<br>'+p.address+'<br><small>'+a.title+' · '+a.journey+'</small><p>'+a.copy.split('. ')[0]+'.</p><div class="actions">'+external('Get directions',directions(a,p))+'<button class="btn" data-complete="'+a.id+'" aria-pressed="'+!!state.done[a.id]+'">'+(state.done[a.id]?'Undo completion':'Mark as complete')+'</button></div>');
   marker.on('popupopen',()=>{focusStop={a,p};});
   marker.on('popupclose',()=>{if(focusStop?.a===a && focusStop.p===p)focusStop=undefined;});
   marker.activity=a;
   marker.place=p;
   if(reopen?.a===a && reopen.p===p)marker.openPopup();
  });
 });
}
function refreshMap(a){
 const inPopup=!!focusStop;
 const next=main.querySelector('[data-live="next"]');
 next.innerHTML=nextPanel(activeMapDay);
 main.querySelector('[data-map-progress]').innerHTML=dayProgress(activeMapDay)+(counter(activeMapDay.items)===activeMapDay.items.length?'<p class="notice">'+activeMapDay.name+' complete!</p>':'');
 main.querySelector('[data-map-list]').innerHTML=mapRows(activeMapDay);
 drawMarkers(focusStop);
 const selector='[data-complete="'+a.id+'"]';
 main.querySelector((inPopup?'.leaflet-popup ':'[data-map-list] ')+selector)?.focus({preventScroll:true});
}
function updateMapClock(){
 if(leafletMap && mapSnapshot!==mapStatus())drawMarkers(focusStop);
}
main.addEventListener('click',event=>{
 const button=event.target.closest('[data-map-stop]');
 if(!button||!markerLayer)return;
 const a=activeMapDay.items.find(item=>item.id===button.dataset.mapStop);
 const marker=markerLayer.getLayers().find(layer=>layer.activity===a&&layer.place===selected(a));
 if(marker){
  leafletMap.setView(marker.getLatLng(),16);
  marker.openPopup();
  leafletMap.getContainer().scrollIntoView({block:'center'});
  marker.getElement().focus({preventScroll:true});
 }
});

