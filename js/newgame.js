const NEW_GAME_DATA={
  questions:[
    {id:'departureReason',label:'なぜ旅に出ることになった？',placeholder:'自由に書く（空欄でも可）'},
    {id:'lastPerson',label:'旅立つ前、最後に話した相手は？',placeholder:'自由に書く（空欄でも可）'},
    {id:'homeReaction',label:'故郷の人たちは旅立ちをどう受け止めた？',placeholder:'自由に書く（空欄でも可）'}
  ],
  companions:COMPANION_DATA,
  starterItems:[
    {id:'bag',label:'小さな布袋',default:true},
    {id:'bottle',label:'水筒',default:true},
    {id:'blanket',label:'毛布',default:true},
    {id:'boots',label:'丈夫な旅靴',default:true},
    {id:'coins',label:'小銭入れ',default:true},
    {id:'thread',label:'針と糸',default:true},
    {id:'bread',label:'パン',default:true},
    {id:'soap',label:'石鹸',default:false},
    {id:'pot',label:'小鍋',default:false}
  ]
};
function defaultStarterIds(){return NEW_GAME_DATA.starterItems.filter(x=>x.default).map(x=>x.id)}
function buildNewGameState(data){
  let next=fresh((data.name||'').trim()||'旅人');
  next.journey={departureReason:(data.departureReason||'').trim(),lastPerson:(data.lastPerson||'').trim(),homeReaction:(data.homeReaction||'').trim()};
  let world=WORLD_DATA[data.worldId]||WORLD_DATA[WORLD_CATALOG[0]?.id];
  if(world){
    next.worldId=world.id;
    next.travel={worldId:world.id,currentNodeId:world.startNode,routeId:null,routeFrom:null,routeTo:null,routeProgressKm:0,knownNodes:[...(world.startingKnownNodes||[world.startNode])],knownRoutes:[...(world.startingKnownRoutes||[])],permits:[],phase:'ready',weather:null,weatherDay:null,lastSummary:'旅立ちの朝。まず行き先を決めよう。'};
    next.location=world.nodes[world.startNode]?.name||'出発地'
  }
  let def=companionDefinition(data.companionId);
  if(!def||def.id==='none'){next.companion=null;next.petMax=0}else next.companion={type:def.id,label:def.label,icon:def.icon,name:(data.companionName||'').trim(),health:def.health,maxHealth:def.health,dailyFood:def.dailyFood};
  let chosen=new Set(Array.isArray(data.starterIds)?data.starterIds:defaultStarterIds());
  next.items=next.items.filter(it=>it.id==='petfood'?!!next.companion:chosen.has(it.id));
  if(chosen.has('boots')&&!next.items.some(x=>x.id==='boots'))next.items.push({id:'boots',name:'丈夫な旅靴',icon:'🥾',kind:'cloth',w:2,h:1,weight:.7,parent:'main',x:6,y:0,travel:{footwearFactor:1.08}});
  for(let it of next.items)if(it.parent?.startsWith('container:')){let parentId=it.parent.slice(10);if(!next.items.some(x=>x.id===parentId)){it.parent='loose';delete it.x;delete it.y}}
  return next
}
