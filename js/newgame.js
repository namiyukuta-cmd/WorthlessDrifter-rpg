const NEW_GAME_DATA={
  questions:[
    {id:'departureReason',label:'なぜ旅に出ることになった？',placeholder:'自由に書く（空欄でも可）'},
    {id:'lastPerson',label:'旅立つ前、最後に話した相手は？',placeholder:'自由に書く（空欄でも可）'},
    {id:'homeReaction',label:'故郷の人たちは旅立ちをどう受け止めた？',placeholder:'自由に書く（空欄でも可）'}
  ],
  companions:COMPANION_DATA
};
function buildNewGameState(data){
  let next=fresh((data.name||'').trim()||'旅人');
  next.journey={
    departureReason:(data.departureReason||'').trim(),
    lastPerson:(data.lastPerson||'').trim(),
    homeReaction:(data.homeReaction||'').trim()
  };
  let def=companionDefinition(data.companionId);
  if(!def||def.id==='none'){
    next.companion=null;
    next.petMax=0;
    next.items=next.items.filter(x=>x.parent!=='pet')
  }else{
    next.companion={
      type:def.id,
      label:def.label,
      icon:def.icon,
      name:(data.companionName||'').trim(),
      health:def.health,
      maxHealth:def.health,
      dailyFood:def.dailyFood
    }
  }
  return next
}
