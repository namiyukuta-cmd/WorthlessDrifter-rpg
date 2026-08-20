function currentCompanion(){
  if(state.companion===undefined){
    state.companion={type:'dog',label:'犬',icon:'🐕',name:'ムギ',health:15,maxHealth:15,dailyFood:1};
    if(state.petMax==null)state.petMax=8
  }
  return state.companion
}
function ensureCompanionFeedItems(){
  for(let it of state.items||[]){
    if(it.id==='petfood'&&!it.companionFeed)it.companionFeed={remove:true}
  }
}
function companionCarried(it){
  let p=it?.parent,seen=new Set();
  while(p){
    if(p==='pet')return true;
    if(p==='main'||p==='loose')return false;
    if(!p.startsWith('container:'))return false;
    let id=p.slice(10);
    if(seen.has(id))return false;
    seen.add(id);
    p=item(id)?.parent
  }
  return false
}
function companionFeedItems(){
  ensureCompanionFeedItems();
  return (state.items||[]).filter(it=>companionCarried(it)&&it.companionFeed)
}
function installCompanionStyles(){
  if(document.getElementById('companionStyles'))return;
  let style=document.createElement('style');
  style.id='companionStyles';
  style.textContent=`
  .pet-index-panel{display:none}
  .pet-index-head{display:flex;align-items:center;gap:7px;margin-bottom:10px}.pet-index-head h2{margin:0}.pet-index-icon{font-size:22px}
  .companion-health-stat{cursor:pointer;position:relative}.companion-health-stat:active{transform:translateY(1px)}.companion-health-stat small span{font-size:9px;margin-left:4px;color:#9a8068}
  .companion-recovery-layer{position:fixed;inset:0;z-index:185;display:none;background:#0006;padding:12px;align-items:center;justify-content:center}.companion-recovery-layer.open{display:flex}
  .companion-recovery-box{width:min(430px,100%);max-height:80dvh;overflow:auto;background:#fff9f0;border:2px solid #6c5b4d;border-radius:14px;padding:12px;box-shadow:0 14px 45px #0007}
  .companion-recovery-head{display:flex;align-items:center;gap:8px}.companion-recovery-head h2{margin:0}.companion-recovery-head button{margin-left:auto;border:1px solid #a5917c;border-radius:7px;background:#eee0d0;padding:7px 10px}
  .companion-recovery-actions{display:grid;gap:8px;margin-top:10px}.companion-recovery-actions button{border:1px solid #927c67;border-radius:9px;background:#f0dfca;padding:11px;text-align:left;font-weight:800}.companion-recovery-actions button:disabled{opacity:.45}
  `;
  document.head.appendChild(style)
}
function installCompanionDom(){
  installCompanionStyles();
  let index=$('index');
  if(index&&!$('petIndexPanel')){
    let panel=document.createElement('div');
    panel.id='petIndexPanel';panel.className='panel pet-index-panel';
    index.appendChild(panel)
  }
  let petPanel=document.querySelector('#pet .panel:first-child');
  if(petPanel&&!$('petHealthStat')){
    let stat=document.createElement('div');
    stat.id='petHealthStat';stat.className='stat companion-health-stat';
    let weight=petPanel.querySelector('.stat');
    petPanel.insertBefore(stat,weight||null)
  }
  if(!$('companionRecoveryLayer')){
    let layer=document.createElement('div');
    layer.id='companionRecoveryLayer';layer.className='companion-recovery-layer';
    layer.innerHTML='<div class="companion-recovery-box"><div class="companion-recovery-head"><h2 id="companionRecoveryTitle">同行動物の体力</h2><button id="closeCompanionRecovery">閉じる</button></div><div id="companionRecoveryMeta" class="note"></div><div id="companionRecoveryActions" class="companion-recovery-actions"></div></div>';
    document.body.appendChild(layer);
    $('closeCompanionRecovery').onclick=closeCompanionRecovery;
    layer.onclick=e=>{if(e.target===layer)closeCompanionRecovery()}
  }
}
function renderCompanionUi(){
  installCompanionDom();
  ensureCompanionFeedItems();
  let comp=currentCompanion();
  let petNav=document.querySelector('nav button[data-screen="pet"]');
  if(petNav)petNav.style.display=comp?'':'none';
  let panel=$('petIndexPanel');
  if(panel)panel.style.display=comp?'block':'none';
  if(!comp){closeCompanionRecovery();return}
  let cur=comp.health??comp.maxHealth??0,max=comp.maxHealth??cur;
  if(panel){
    panel.innerHTML='<div class="pet-index-head"><span class="pet-index-icon">'+(comp.icon||'🐾')+'</span><h2>'+(comp.name||comp.label||'同行動物')+'</h2></div><div class="stats"><div id="petIndexHealthStat" class="stat companion-health-stat"><small>体力 <span>タップで餌</span></small><strong>'+cur+' / '+max+'</strong></div><div class="stat"><small>携行重量</small><strong>'+topWeight('pet').toFixed(1)+' / '+Number(state.petMax??0).toFixed(1)+' kg</strong></div><div class="stat"><small>1日の餌</small><strong>'+String(comp.dailyFood??0)+'</strong></div></div>';
    $('petIndexHealthStat').onclick=openCompanionRecovery
  }
  let face=document.querySelector('#pet .pet-face');
  let name=document.querySelector('#pet .panel:first-child strong');
  let note=document.querySelector('#pet .panel:first-child .note');
  if(face)face.textContent=comp.icon||'🐾';
  if(name)name.textContent=comp.name||comp.label||'同行動物';
  if(note)note.textContent='体力は餌を食べさせて回復します。';
  let petHealth=$('petHealthStat');
  if(petHealth){
    petHealth.innerHTML='<small>体力 <span>タップで餌</span></small><strong>'+cur+' / '+max+'</strong>';
    petHealth.onclick=openCompanionRecovery
  }
}
function renderCompanionRecovery(){
  installCompanionDom();
  let comp=currentCompanion();
  if(!comp)return closeCompanionRecovery();
  let cur=comp.health??comp.maxHealth??0,max=comp.maxHealth??cur,full=cur>=max;
  $('companionRecoveryTitle').textContent=(comp.name||comp.label||'同行動物')+'の体力';
  $('companionRecoveryMeta').textContent='体力 '+cur+' / '+max+(full?' ・ 満タン':'');
  let actions=$('companionRecoveryActions');actions.innerHTML='';
  let feeds=companionFeedItems();
  for(let it of feeds){
    let b=document.createElement('button');
    let amount=it.companionFeed.amount??COMPANION_RULES.feedRecovery;
    b.textContent=(it.icon||'')+' '+it.name+'を食べさせる　体力 +'+amount;
    b.disabled=full;
    b.onclick=()=>useCompanionFeed(it.id);
    actions.appendChild(b)
  }
  if(!feeds.length){
    let n=document.createElement('div');n.className='note';n.textContent='ペット側に餌を持っていません。';actions.appendChild(n)
  }
}
function openCompanionRecovery(){
  if(!activeId)return toast('先にセーブデータを作ってください');
  if(!currentCompanion())return toast('同行動物はいません');
  renderCompanionRecovery();
  $('companionRecoveryLayer').classList.add('open')
}
function closeCompanionRecovery(){$('companionRecoveryLayer')?.classList.remove('open')}
function useCompanionFeed(id){
  let comp=currentCompanion(),it=item(id);
  if(!comp||!it||!companionCarried(it)||!it.companionFeed)return;
  let max=comp.maxHealth??comp.health??0,old=comp.health??max;
  if(old>=max)return toast('体力は満タンです');
  let amount=it.companionFeed.amount??COMPANION_RULES.feedRecovery;
  comp.health=Math.min(max,old+amount);
  let gain=comp.health-old,name=it.name;
  if(it.companionFeed.remove!==false)state.items=state.items.filter(x=>x.id!==id);
  markDirty();render();renderCompanionRecovery();
  toast(name+'を食べさせて体力 +'+gain)
}
const originalRenderForCompanion=render;
render=function(){originalRenderForCompanion();renderCompanionUi()};
window.closeCompanionRecovery=closeCompanionRecovery;
installCompanionDom();
renderCompanionUi();
