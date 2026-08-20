function activeWorld(){let id=state.worldId||state.travel?.worldId;return WORLD_DATA[id]||null}
function travelNode(id){return activeWorld()?.nodes?.[id]||null}
function travelRoute(id){return activeWorld()?.routes?.[id]||null}
function ensureTravelState(){
  if(!activeId)return null;
  let world=activeWorld()||WORLD_DATA[WORLD_CATALOG[0]?.id];
  if(!world)return null;
  state.worldId=world.id;
  if(!state.travel){
    state.travel={worldId:world.id,currentNodeId:world.startNode,routeId:null,routeFrom:null,routeTo:null,routeProgressKm:0,knownNodes:[...(world.startingKnownNodes||[world.startNode])],knownRoutes:[...(world.startingKnownRoutes||[])],permits:[],phase:'ready',weather:null,weatherDay:null,lastSummary:'旅立ちの朝。まず行き先を決めよう。'};
    state.location=world.nodes[world.startNode]?.name||state.location
  }
  state.travel.knownNodes=state.travel.knownNodes||[world.startNode];
  state.travel.knownRoutes=state.travel.knownRoutes||[];
  state.travel.permits=state.travel.permits||[];
  return state.travel
}
function weightedPick(list){
  let total=list.reduce((a,x)=>a+(x.weight||1),0),r=Math.random()*total;
  for(let x of list){r-=x.weight||1;if(r<=0)return x}
  return list[list.length-1]
}
function currentWeather(){
  let t=ensureTravelState(),world=activeWorld();if(!t||!world)return null;
  if(t.weatherDay!==state.day||!t.weather){let w=weightedPick(world.weather||[{id:'clear',label:'晴れ',weight:1,factor:1,eventFactor:1}]);t.weather={...w};t.weatherDay=state.day;t.dayVariance=.9+Math.random()*.2}
  return t.weather
}
function humanTravelWeight(){return topWeight('main')}
function footwearFactor(){let v=.86;for(let it of state.items||[])if(it.travel?.footwearFactor)v=Math.max(v,it.travel.footwearFactor);return v}
function companionTravelFactor(){let type=state.companion?.type;if(type==='horse')return 1.15;if(type==='ox')return .9;if(type==='dog')return .98;return 1}
function terrainFactor(route){return({desert:.8,dry_plain:.95,scrub:.88,forest:.72,hills:.72,mountain:.58}[route?.terrain]||.9)}
function roadFactor(route){return({good:1,fair:.9,poor:.78}[route?.quality]||.88)}
function weightFactor(){let max=Number(state.humanMax||18),r=max?humanTravelWeight()/max:1;if(r>.85)return .65;if(r>.65)return .78;if(r>.35)return .9;return 1}
function healthFactor(){let max=Number(state.maxHealth||10),r=max?Math.max(0,Math.min(1,Number(state.health||0)/max)):1;return .55+.45*r}
function travelModeFactor(mode){return mode==='careful'?.78:mode==='hurry'?1.2:1}
function travelModeLabel(mode){return mode==='careful'?'慎重に進む':mode==='hurry'?'急いで進む':'普通に進む'}
function travelEstimate(mode='normal'){
  let t=ensureTravelState(),route=travelRoute(t?.routeId),weather=currentWeather();if(!t||!route||!weather)return null;
  let factors={health:healthFactor(),weight:weightFactor(),footwear:footwearFactor(),companion:companionTravelFactor(),terrain:terrainFactor(route),road:roadFactor(route),weather:weather.factor||1,mode:travelModeFactor(mode),variance:t.dayVariance||1};
  let distance=27;for(let k in factors)distance*=factors[k];
  return{distance:Math.max(4,Math.round(distance*10)/10),factors,weather,route}
}
function routeFromNode(route,nodeId){if(route.a===nodeId)return route.b;if(route.b===nodeId)return route.a;return null}
function availableRoutes(nodeId){
  let t=ensureTravelState(),world=activeWorld();if(!t||!world||!nodeId)return[];
  return Object.values(world.routes).filter(r=>(r.a===nodeId||r.b===nodeId)&&t.knownRoutes.includes(r.id)).map(r=>({route:r,to:routeFromNode(r,nodeId)}))
}
function revealFromNode(nodeId){
  let t=ensureTravelState(),world=activeWorld();if(!t||!world)return;
  for(let r of Object.values(world.routes))if(r.a===nodeId||r.b===nodeId){if(!t.knownRoutes.includes(r.id))t.knownRoutes.push(r.id);let other=routeFromNode(r,nodeId);if(other&&!t.knownNodes.includes(other))t.knownNodes.push(other)}
}
function looseTravelLossIds(){
  let loss=new Set((state.items||[]).filter(it=>it.parent==='loose').map(it=>it.id)),changed=true;
  while(changed){changed=false;for(let it of state.items||[]){if(!it.parent?.startsWith('container:'))continue;let parentId=it.parent.slice(10);if(loss.has(parentId)&&!loss.has(it.id)){loss.add(it.id);changed=true}}}
  return loss
}
function discardLooseForTravel(){let loss=looseTravelLossIds();if(loss.size)state.items=state.items.filter(it=>!loss.has(it.id));return loss.size}
function beginRouteNow(toId){
  let t=ensureTravelState();if(!t||!t.currentNodeId||t.phase==='dusk')return;
  let found=availableRoutes(t.currentNodeId).find(x=>x.to===toId);if(!found)return toast('その道はまだ分かりません');
  let r=found.route;if(r.permit&&!t.permits.includes(r.permit))return toast('この先へ進む通行許可証がありません');
  t.routeId=r.id;t.routeFrom=t.currentNodeId;t.routeTo=toId;t.routeProgressKm=0;t.currentNodeId=null;t.phase='ready';t.seenEventPoints=[];
  state.location=(travelNode(t.routeFrom)?.name||'出発地')+' → '+(travelNode(toId)?.name||'目的地');
  t.lastSummary=(travelNode(toId)?.name||'目的地')+'へ向かう道に入った。';markDirty();render()
}
function beginRoute(toId){
  let t=ensureTravelState();if(!t||!t.currentNodeId||t.phase==='dusk')return;
  let found=availableRoutes(t.currentNodeId).find(x=>x.to===toId);if(!found)return toast('その道はまだ分かりません');
  let r=found.route;if(r.permit&&!t.permits.includes(r.permit))return toast('この先へ進む通行許可証がありません');
  let destination=travelNode(toId)?.name||'この場所';
  if(!confirm(destination+'へ進みますか？'))return;
  let loose=looseTravelLossIds();
  if(loose.size){
    if(!confirm('未収納物が残っています。移動すると未収納物が消えますがよろしいですか？')){go('inventory');return}
    discardLooseForTravel()
  }
  beginRouteNow(toId)
}
function crossedPoint(route,point,oldP,newP,from){let a0=from===route.a?oldP:route.distance-oldP,a1=from===route.a?newP:route.distance-newP;return Math.min(a0,a1)<point.km&&Math.max(a0,a1)>=point.km}
function travelEvent(route,oldP,newP,mode,night=false){
  let t=ensureTravelState(),weather=currentWeather(),seen=t.seenEventPoints||(t.seenEventPoints=[]);
  for(let p of route.eventPoints||[]){let key=route.id+':'+p.km;if(!seen.includes(key)&&crossedPoint(route,p,oldP,newP,t.routeFrom)){seen.push(key);if(Math.random()<(p.chance||.5))return'イベント地点「'+p.label+'」を通過した。何か起こりそうだ。'}}
  let modeFactor=mode==='careful'?.6:mode==='hurry'?1.3:1,chance=(route.danger||.03)*(weather?.eventFactor||1)*modeFactor*(night?2.2:1);
  if(Math.random()>=Math.min(.65,chance))return'';
  let pool=route.terrain==='desert'?['砂の向こうに別の旅人の姿が見える。','道端に新しい足跡が残っている。','遠くにこちらを窺う人影がある。','街道脇に落とし物らしい包みが見える。']:['旅人とすれ違う。','道脇に何か落ちている。','近くで動物の気配がする。','前方に警戒するべき人影がある。'];
  return pool[Math.floor(Math.random()*pool.length)]
}
function finishArrival(){
  let t=ensureTravelState(),node=travelNode(t.routeTo);if(!t||!node)return;
  t.currentNodeId=t.routeTo;t.routeId=null;t.routeFrom=null;t.routeTo=null;t.routeProgressKm=0;t.phase='settlement';t.weather=null;t.weatherDay=null;t.dayVariance=null;state.location=node.name;revealFromNode(node.id)
}
function advanceRoute(distance,mode,night=false){
  let t=ensureTravelState(),route=travelRoute(t?.routeId);if(!t||!route)return{moved:0,event:'',arrived:false};
  let old=t.routeProgressKm||0,moved=Math.min(distance,route.distance-old),next=old+moved,event=travelEvent(route,old,next,mode,night);t.routeProgressKm=next;
  let arrived=next>=route.distance-.001;
  if(arrived)finishArrival();else state.location=(travelNode(t.routeFrom)?.name||'出発地')+' → '+(travelNode(t.routeTo)?.name||'目的地')+' '+next.toFixed(1)+' / '+route.distance+'km';
  return{moved,event,arrived}
}
function travelHealthCost(mode,planned,moved){
  let base=mode==='careful'?1:mode==='hurry'?3:2,ratio=planned>0?moved/planned:1;
  return Math.max(1,Math.ceil(base*Math.min(1,Math.max(.35,ratio))))
}
function rootParentForTravel(it){
  let p=it?.parent,seen=new Set();
  while(p?.startsWith('container:')){let id=p.slice(10);if(seen.has(id))return'';seen.add(id);p=item(id)?.parent}
  return p||''
}
function dailyTravelFood(){return(state.items||[]).find(it=>it.kind==='food'&&!it.companionFeed&&rootParentForTravel(it)!=='pet')||null}
function consumeDailyTravelFood(){
  let food=dailyTravelFood();if(!food)return{ate:false,text:'食料を持っていない。'};
  let name=food.name||'食料';
  if(Number.isFinite(food.rations)){food.rations=Math.max(0,food.rations-1);if(food.rations<=0)state.items=state.items.filter(x=>x.id!==food.id)}
  else if(Number.isFinite(food.consume?.uses)){food.consume.uses=Math.max(0,food.consume.uses-1);if(food.consume.uses<=0)state.items=state.items.filter(x=>x.id!==food.id)}
  else state.items=state.items.filter(x=>x.id!==food.id);
  return{ate:true,text:'食料：'+name+'を消費した。'}
}
function passTravelDay(){let food=consumeDailyTravelFood();state.day=(state.day??1)+1;return food}
function travelDay(mode='normal'){
  let t=ensureTravelState();if(!t||!t.routeId)return toast('先に行き先を決めてください');if(t.phase!=='ready')return;if((state.health??0)<=0)return toast('体力がなく移動できません');
  let calc=travelEstimate(mode),result=advanceRoute(calc.distance,mode,false),cost=travelHealthCost(mode,calc.distance,result.moved);state.health=Math.max(0,(state.health??0)-cost);
  t=ensureTravelState();let text=travelModeLabel(mode)+'：'+result.moved.toFixed(1)+'km進んだ。体力 -'+cost+'。';if(result.event)text+=' '+result.event;if(result.arrived)text+=' '+state.location+'に到着した。';else t.phase='dusk';t.lastMode=mode;t.lastDayDistance=calc.distance;t.lastSummary=text;markDirty();render()
}
function campNight(){
  let t=ensureTravelState();if(!t||t.phase!=='dusk')return;
  let before=state.health??0;state.health=Math.min(state.maxHealth??10,before+2);let gain=state.health-before,food=passTravelDay();t.phase='ready';t.weather=null;t.weatherDay=null;t.dayVariance=null;t.lastSummary='野営して夜を越した。'+(gain?'体力 +'+gain+'。':'')+' '+food.text;markDirty();render()
}
function nightTravel(){
  let t=ensureTravelState();if(!t||t.phase!=='dusk'||!t.routeId)return;if((state.health??0)<=1)return toast('夜行できる体力がありません');
  let base=t.lastDayDistance||travelEstimate(t.lastMode||'normal')?.distance||12,extra=Math.max(3,Math.round(base*.28*10)/10),result=advanceRoute(extra,t.lastMode||'normal',true);state.health=Math.max(0,(state.health??0)-2);let food=passTravelDay();
  t=ensureTravelState();if(t.phase!=='settlement')t.phase='ready';t.weather=null;t.weatherDay=null;t.dayVariance=null;t.lastSummary='夜行してさらに '+result.moved.toFixed(1)+'km進んだ。体力 -2。 '+food.text+(result.event?' '+result.event:'')+(result.arrived?' '+state.location+'に到着した。':'');markDirty();render()
}
function settlementNextDay(){let t=ensureTravelState();if(!t||!t.currentNodeId)return;let before=state.health??0;state.health=Math.min(state.maxHealth??10,before+3);let gain=state.health-before,food=passTravelDay();t.phase='ready';t.weather=null;t.weatherDay=null;t.dayVariance=null;t.lastSummary=state.location+'で一晩過ごした。'+(gain?'体力 +'+gain+'。':'')+' '+food.text;markDirty();render()}
function installTravelStyles(){
  if(document.getElementById('travelStyles'))return;let s=document.createElement('style');s.id='travelStyles';s.textContent=`
  .travel-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.travel-head h2{margin:0}.travel-weather{font-size:11px;padding:4px 7px;border:1px solid #c7b6a4;border-radius:999px;background:#f4eadf}.travel-map{width:100%;height:190px;margin-top:10px;border:1px solid #c7b6a4;border-radius:10px;background:#f4eadf}.travel-map line{stroke:#9d8974;stroke-width:2}.travel-map line.unknown{stroke-dasharray:5 5;opacity:.35}.travel-map circle{fill:#fffaf3;stroke:#6f5c4a;stroke-width:2}.travel-map circle.here{fill:#dcc2a1;stroke-width:4}.travel-map text{font-size:8px;fill:#44372e;text-anchor:middle}.travel-summary{margin:9px 0;padding:8px;border-radius:8px;background:#f6ecdf;font-size:12px;line-height:1.45}.travel-actions{display:grid;gap:7px;margin-top:8px}.travel-actions button{border:1px solid #927c67;border-radius:9px;background:#f0dfca;padding:10px;text-align:left;font-weight:800}.travel-actions button:disabled{opacity:.45}.travel-route-meta{font-size:11px;line-height:1.5;color:#6f6258;margin-top:7px}.travel-modes{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:9px}.travel-modes button{text-align:center;padding:9px 4px;font-size:11px}.travel-night{display:grid;grid-template-columns:1fr 1fr;gap:7px}.travel-km{font-size:19px;font-weight:900}
  `;document.head.appendChild(s)
}
function installTravelDom(){installTravelStyles();let index=$('index');if(index&&!$('travelPanel')){let p=document.createElement('div');p.id='travelPanel';p.className='panel';index.appendChild(p)}}
function mapSvg(world,t){
  let nodes=t.knownNodes||[],routes=t.knownRoutes||[],lines=[],dots=[];
  for(let id of routes){let r=world.routes[id],a=world.nodes[r?.a],b=world.nodes[r?.b];if(a&&b&&nodes.includes(a.id)&&nodes.includes(b.id))lines.push('<line x1="'+a.x+'%" y1="'+a.y+'%" x2="'+b.x+'%" y2="'+b.y+'%"></line>')}
  for(let id of nodes){let n=world.nodes[id];if(!n)continue;let here=t.currentNodeId===id;dots.push('<circle class="'+(here?'here':'')+'" cx="'+n.x+'%" cy="'+n.y+'%" r="6"></circle><text x="'+n.x+'%" y="'+(n.y+9)+'%">'+n.name+'</text>')}
  return'<svg class="travel-map" viewBox="0 0 100 100" preserveAspectRatio="none">'+lines.join('')+dots.join('')+'</svg>'
}
function renderTravelUi(){
  installTravelDom();let panel=$('travelPanel'),t=ensureTravelState(),world=activeWorld();if(!panel)return;if(!t||!world){panel.style.display='none';return}panel.style.display='block';let weather=currentWeather();
  let html='<div class="travel-head"><div><h2>旅</h2><div class="note" style="margin:2px 0 0">'+world.name+'</div></div><span class="travel-weather">'+(weather?.label||'—')+'</span></div>'+mapSvg(world,t)+'<div class="travel-summary">'+(t.lastSummary||'')+'</div>';
  if(t.routeId){let r=travelRoute(t.routeId),from=travelNode(t.routeFrom),to=travelNode(t.routeTo),remain=Math.max(0,r.distance-(t.routeProgressKm||0));html+='<div><strong>'+from.name+' → '+to.name+'</strong><div class="travel-route-meta">'+r.terrainLabel+' ／ '+r.roadLabel+' ／ 全'+r.distance+'km<br>現在 '+(t.routeProgressKm||0).toFixed(1)+'km ・ 残り '+remain.toFixed(1)+'km</div></div>'}
  if(t.currentNodeId){let n=travelNode(t.currentNodeId);html+='<div class="travel-route-meta">現在地：<strong>'+n.name+'</strong>（'+n.type+'）</div>'}
  html+='<div id="travelActionArea" class="travel-actions">';
  if(t.phase==='dusk'&&t.routeId){html+='<div class="travel-night"><button id="campTravel">ここで野営する<br><small>翌日・体力 +2・食料1</small></button><button id="nightTravel">夜も進む<br><small>距離追加・体力 -2・食料1・危険増</small></button></div>'}
  else if(t.routeId){let normal=travelEstimate('normal'),careful=travelEstimate('careful'),hurry=travelEstimate('hurry');html+='<div class="travel-modes"><button data-travel-mode="careful">慎重<br><small>'+careful.distance.toFixed(1)+'km・体力 -1</small></button><button data-travel-mode="normal">普通<br><small>'+normal.distance.toFixed(1)+'km・体力 -2</small></button><button data-travel-mode="hurry">急ぐ<br><small>'+hurry.distance.toFixed(1)+'km・体力 -3</small></button></div><div class="travel-route-meta">今日の距離は、体力・荷物・靴・同行動物・地形・道・天候から計算。</div>'}
  else if(t.currentNodeId){if(t.phase==='settlement')html+='<button id="settlementNextDay">この土地で一晩過ごす　→ 翌日<br><small>体力 +3・食料1</small></button><div class="travel-route-meta">町・村での買い物や仕事などは次の段階で追加します。</div>';else{let choices=availableRoutes(t.currentNodeId);for(let x of choices){let n=travelNode(x.to),blocked=x.route.permit&&!t.permits.includes(x.route.permit);html+='<button data-destination="'+x.to+'" '+(blocked?'disabled':'')+'>'+n.name+'へ向かう　'+x.route.distance+'km<br><small>'+x.route.terrainLabel+'・'+x.route.roadLabel+(blocked?'・通行許可証が必要':'')+'</small></button>'}}}
  html+='</div>';panel.innerHTML=html;
  panel.querySelectorAll('[data-destination]').forEach(b=>b.onclick=()=>beginRoute(b.dataset.destination));panel.querySelectorAll('[data-travel-mode]').forEach(b=>b.onclick=()=>travelDay(b.dataset.travelMode));if($('campTravel'))$('campTravel').onclick=campNight;if($('nightTravel'))$('nightTravel').onclick=nightTravel;if($('settlementNextDay'))$('settlementNextDay').onclick=settlementNextDay
}
const renderBeforeTravel=render;render=function(){renderBeforeTravel();renderTravelUi()};
installTravelDom();
renderTravelUi();
