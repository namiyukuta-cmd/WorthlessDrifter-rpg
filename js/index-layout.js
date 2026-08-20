let indexLayoutBusy=false,indexLayoutQueued=false;
function installIndexLayoutStyles(){
  if(document.getElementById('indexLayoutStyles'))return;
  let s=document.createElement('style');s.id='indexLayoutStyles';s.textContent=`
  #index.index-layout{padding:6px!important}
  .index-game-grid{display:grid;grid-template-columns:64px minmax(0,1fr) 84px;gap:6px;align-items:stretch;width:100%}
  .index-params,.index-actions,.index-main-view,.index-bottom{background:#fffaf3;border:1px solid #ad9985;border-radius:10px;box-shadow:0 2px 0 #d4c6b5}
  .index-params{padding:5px 4px;display:flex;flex-direction:column;gap:5px;min-width:0}
  .index-param-title{font-size:8px;font-weight:900;text-align:center;line-height:1.15;padding:4px 1px;border-bottom:1px solid #d8c9b9;overflow-wrap:anywhere}
  .index-param-title h2{margin:0;font:inherit;line-height:inherit;overflow-wrap:anywhere}
  .index-params .stat{padding:5px 2px!important;border-radius:7px!important;text-align:center;min-width:0;background:#fffdf9}
  .index-params .stat small{font-size:7px;line-height:1.1;margin-bottom:2px}
  .index-params .stat small span{display:none}
  .index-params .stat strong{display:block;font-size:10px!important;line-height:1.15;overflow-wrap:anywhere;word-break:break-word}
  .index-pet-mini{padding:5px 2px;border:1px solid #d2c2b0;border-radius:7px;background:#fffdf9;text-align:center;cursor:pointer}
  .index-pet-mini .pet-mini-name{font-size:7px;line-height:1.1;overflow-wrap:anywhere}
  .index-pet-mini .pet-mini-hp{font-size:10px;font-weight:900;line-height:1.15;margin-top:2px}
  .index-main-view{min-width:0;aspect-ratio:1/1.05;overflow:hidden;display:flex;flex-direction:column}
  .index-location-bar{flex:0 0 auto;padding:5px 7px;border-bottom:1px solid #d8c9b9;background:#f5ebdf;min-width:0}
  .index-location-bar .stat{border:0!important;background:transparent!important;padding:0!important;display:flex;align-items:center;gap:5px;min-width:0}
  .index-location-bar .stat small{font-size:7px;flex:0 0 auto}.index-location-bar .stat strong{font-size:10px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
  .index-center-slot{flex:1;min-height:0;overflow:auto;padding:6px;display:flex;flex-direction:column;gap:5px}
  .index-center-placeholder{margin:auto;text-align:center;font-size:10px;color:#8b7b6d}
  .index-actions{padding:5px 4px;min-width:0;overflow:auto}
  .index-actions-title{font-size:8px;font-weight:900;text-align:center;padding:4px 1px 6px;border-bottom:1px solid #d8c9b9;margin-bottom:5px}
  .index-action-slot{min-width:0}
  .index-action-slot .travel-actions{display:flex!important;flex-direction:column;gap:5px!important;margin:0!important}
  .index-action-slot .travel-modes,.index-action-slot .travel-night{display:flex!important;flex-direction:column;gap:5px!important;margin:0!important}
  .index-action-slot button{width:100%;padding:7px 3px!important;font-size:9px!important;line-height:1.15;text-align:center!important;overflow-wrap:anywhere}
  .index-action-slot button small{font-size:7px;line-height:1.1}
  .index-action-slot .travel-route-meta{font-size:7px;line-height:1.25;margin-top:4px}
  .index-bottom{margin-top:6px;padding:8px;min-height:54px}
  .index-bottom-title{font-size:8px;font-weight:900;color:#806f60;margin-bottom:4px}
  .index-text-slot{font-size:10px;line-height:1.45;color:#4e4239}
  .index-text-slot .travel-summary{margin:0!important;padding:0!important;background:transparent!important;font-size:10px!important;line-height:1.45!important}
  .index-center-slot .travel-head{margin:0;gap:4px}.index-center-slot .travel-head h2{font-size:12px}.index-center-slot .travel-head .note{font-size:8px!important;line-height:1.2}
  .index-center-slot .travel-weather{font-size:7px;padding:3px 5px}
  .index-center-slot .travel-map{width:100%!important;height:auto!important;aspect-ratio:1.28/1;margin:0!important;border-radius:7px!important;flex:0 0 auto}
  .index-center-slot .travel-route-meta{font-size:8px!important;line-height:1.3!important;margin-top:2px!important}
  .index-center-slot>div:not(.travel-head):not(.travel-route-meta){font-size:9px;line-height:1.3}
  #petIndexPanel,#travelPanel{display:none!important}
  @media(min-width:700px){.index-game-grid{grid-template-columns:86px minmax(0,1fr) 120px;gap:9px}.index-params{padding:7px}.index-params .stat strong,.index-pet-mini .pet-mini-hp{font-size:13px!important}.index-actions{padding:7px}.index-action-slot button{font-size:11px!important}.index-main-view{aspect-ratio:1.15/1}.index-center-slot{padding:9px}.index-center-slot .travel-map{max-height:420px}.index-text-slot,.index-text-slot .travel-summary{font-size:12px!important}}
  @media(max-width:350px){.index-game-grid{grid-template-columns:54px minmax(0,1fr) 72px;gap:4px}.index-params,.index-actions{padding:4px 2px}.index-params .stat{padding:4px 1px!important}.index-params .stat strong{font-size:9px!important}.index-action-slot button{font-size:8px!important;padding:6px 2px!important}.index-center-slot{padding:4px}}
  `;document.head.appendChild(s)
}
function makeIndexShell(){
  let index=document.getElementById('index');if(!index)return false;
  installIndexLayoutStyles();index.classList.add('index-layout');
  if(document.getElementById('indexGameGrid'))return true;
  let oldPanel=[...index.children].find(x=>x.classList?.contains('panel')&&x.id!=='petIndexPanel'&&x.id!=='travelPanel');
  let char=document.getElementById('charIndexName'),day=document.getElementById('dayValue')?.closest('.stat'),location=document.getElementById('locationValue')?.closest('.stat'),health=document.getElementById('healthStat'),money=document.getElementById('moneyValue')?.closest('.stat'),weight=document.getElementById('indexWeight')?.closest('.stat');
  let grid=document.createElement('div');grid.id='indexGameGrid';grid.className='index-game-grid';
  grid.innerHTML='<aside id="indexParams" class="index-params"><div id="indexNameSlot" class="index-param-title"></div><div id="indexPetMini" class="index-pet-mini" style="display:none"></div></aside><main id="indexMainView" class="index-main-view"><div id="indexLocationBar" class="index-location-bar"></div><div id="indexCenterSlot" class="index-center-slot"><div class="index-center-placeholder">地図を読み込み中…</div></div></main><aside id="indexActions" class="index-actions"><div class="index-actions-title">できること</div><div id="indexActionSlot" class="index-action-slot"></div></aside>';
  let bottom=document.createElement('div');bottom.id='indexBottom';bottom.className='index-bottom';bottom.innerHTML='<div class="index-bottom-title">TEXT</div><div id="indexTextSlot" class="index-text-slot">—</div>';
  index.insertBefore(grid,index.firstChild);index.insertBefore(bottom,grid.nextSibling);
  let params=document.getElementById('indexParams'),nameSlot=document.getElementById('indexNameSlot'),locSlot=document.getElementById('indexLocationBar'),petMini=document.getElementById('indexPetMini');
  if(char)nameSlot.appendChild(char);for(let n of [day,health,money,weight])if(n)params.insertBefore(n,petMini);if(location)locSlot.appendChild(location);
  if(oldPanel)oldPanel.remove();
  let petPanel=document.getElementById('petIndexPanel');if(petPanel)index.appendChild(petPanel);
  return true
}
function updateIndexPetMini(){
  let mini=document.getElementById('indexPetMini');if(!mini)return;
  let comp=null;if(typeof currentCompanion==='function'){try{comp=currentCompanion()}catch(e){}}else comp=state?.companion||null;
  if(!comp){mini.style.display='none';mini.innerHTML='';mini.onclick=null;return}
  let cur=comp.health??comp.maxHealth??0,max=comp.maxHealth??cur;mini.style.display='block';mini.innerHTML='<div class="pet-mini-name">'+(comp.icon||'🐾')+' '+(comp.name||comp.label||'ペット')+'</div><div class="pet-mini-hp">'+cur+'/'+max+'</div>';mini.onclick=()=>{if(typeof openCompanionRecovery==='function')openCompanionRecovery();else go('pet')}
}
function arrangeTravelIntoIndex(){
  if(indexLayoutBusy)return;let panel=document.getElementById('travelPanel');if(!panel||!panel.children.length)return;
  let center=document.getElementById('indexCenterSlot'),actions=document.getElementById('indexActionSlot'),text=document.getElementById('indexTextSlot');if(!center||!actions||!text)return;
  indexLayoutBusy=true;
  try{
    center.innerHTML='';actions.innerHTML='';text.innerHTML='';
    let children=[...panel.children],summary=children.find(x=>x.classList?.contains('travel-summary')),action=children.find(x=>x.id==='travelActionArea');
    for(let node of children){if(node===summary||node===action)continue;center.appendChild(node)}
    if(action)actions.appendChild(action);else actions.innerHTML='<div style="font-size:8px;text-align:center;color:#8b7b6d">—</div>';
    if(summary)text.appendChild(summary);else text.textContent='—';
    panel.style.display='none';updateIndexPetMini()
  }finally{indexLayoutBusy=false}
}
function scheduleIndexLayout(){
  if(indexLayoutQueued)return;indexLayoutQueued=true;queueMicrotask(()=>{indexLayoutQueued=false;if(!makeIndexShell())return;updateIndexPetMini();arrangeTravelIntoIndex()})
}
function installIndexLayoutObserver(){
  if(!makeIndexShell())return;
  let index=document.getElementById('index');if(index&&!index.__indexLayoutObserver){let o=new MutationObserver(()=>scheduleIndexLayout());o.observe(index,{childList:true,subtree:true});index.__indexLayoutObserver=o}
  scheduleIndexLayout()
}
installIndexLayoutObserver();
