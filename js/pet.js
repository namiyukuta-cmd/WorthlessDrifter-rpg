const PET_RECOVERY_RULES={petfood:{amount:3,remove:true}};
function partyItem(it){let p=it?.parent,seen=new Set();while(p){if(p==='main'||p==='loose'||p==='pet')return true;if(!p.startsWith('container:'))return false;let id=p.slice(10);if(seen.has(id))return false;seen.add(id);p=item(id)?.parent}return false}
function petFeedItems(){return state.items.filter(it=>partyItem(it)&&PET_RECOVERY_RULES[it.id])}
function liveCompanion(){let comp=currentCompanion?.();if(comp&&state.companion===undefined){state.companion=clone(comp);comp=state.companion}return comp}
function recoverPetHealth(amount){let comp=liveCompanion();if(!comp)return 0;let max=comp.maxHealth??comp.health??0,old=comp.health??max;comp.health=Math.min(max,old+amount);return comp.health-old}
function usePetFeed(id){let comp=liveCompanion(),it=item(id),rule=PET_RECOVERY_RULES[id];if(!comp||!it||!rule||!partyItem(it))return;let max=comp.maxHealth??comp.health??0;if((comp.health??max)>=max)return toast((comp.name||comp.label||'同行動物')+'の体力は満タンです');let gain=recoverPetHealth(rule.amount||3),name=it.name;if(rule.remove)state.items=state.items.filter(x=>x.id!==id);markDirty();render();renderPetRecoveryMenu();toast((comp.name||comp.label||'同行動物')+'に'+name+'を与えて体力 +'+gain)}
function installPetRecoveryUi(){
  if(!document.getElementById('petRecoveryStyles')){
    let style=document.createElement('style');style.id='petRecoveryStyles';style.textContent=`
    .pet-health-stat{cursor:pointer;position:relative}.pet-health-stat:active{transform:translateY(1px)}
    .pet-health-stat small span{font-size:9px;margin-left:4px;color:#9a8068}
    .pet-recovery-layer{position:fixed;inset:0;z-index:185;display:none;background:#0006;padding:12px;align-items:center;justify-content:center}
    .pet-recovery-layer.open{display:flex}.pet-recovery-box{width:min(430px,100%);max-height:80dvh;overflow:auto;background:#fff9f0;border:2px solid #6c5b4d;border-radius:14px;padding:12px;box-shadow:0 14px 45px #0007}
    .pet-recovery-head{display:flex;align-items:center;gap:8px}.pet-recovery-head h2{margin:0}.pet-recovery-head button{margin-left:auto;border:1px solid #a5917c;border-radius:7px;background:#eee0d0;padding:7px 10px}
    .pet-recovery-actions{display:grid;gap:8px;margin-top:10px}.pet-recovery-actions button{border:1px solid #927c67;border-radius:9px;background:#f0dfca;padding:11px;text-align:left;font-weight:800}.pet-recovery-actions button:disabled{opacity:.45}
    `;document.head.appendChild(style)
  }
  if(!document.getElementById('petRecoveryLayer')){
    let layer=document.createElement('div');layer.id='petRecoveryLayer';layer.className='pet-recovery-layer';layer.innerHTML='<div class="pet-recovery-box"><div class="pet-recovery-head"><h2 id="petRecoveryTitle">餌を与える</h2><button id="closePetRecovery">閉じる</button></div><div id="petRecoveryMeta" class="note"></div><div id="petRecoveryActions" class="pet-recovery-actions"></div></div>';document.body.appendChild(layer);
    $('closePetRecovery').onclick=closePetRecovery;$('petRecoveryLayer').onclick=e=>{if(e.target===$('petRecoveryLayer'))closePetRecovery()}
  }
  let indexHealth=$('petIndexHealth')?.closest('.stat');
  if(indexHealth){indexHealth.classList.add('pet-health-stat');let small=indexHealth.querySelector('small');if(small&&!small.querySelector('span'))small.insertAdjacentHTML('beforeend',' <span>タップで餌</span>');indexHealth.onclick=openPetRecovery}
  let petPanel=document.querySelector('#pet .panel:first-child');
  if(petPanel&&!$('petScreenHealthStat')){
    let weight=$('petWeight')?.closest('.stat'),health=document.createElement('div');health.id='petScreenHealthStat';health.className='stat pet-health-stat';health.innerHTML='<small>体力 <span>タップで餌</span></small><strong id="petScreenHealthValue">—</strong>';health.onclick=openPetRecovery;if(weight)petPanel.insertBefore(health,weight);else petPanel.appendChild(health)
  }
}
function renderPetRecoveryMenu(){installPetRecoveryUi();let comp=liveCompanion();if(!comp)return closePetRecovery();let max=comp.maxHealth??comp.health??0,cur=comp.health??max,full=cur>=max,items=petFeedItems();$('petRecoveryTitle').textContent=(comp.name||comp.label||'同行動物')+'に餌を与える';$('petRecoveryMeta').textContent='体力 '+cur+' / '+max+(full?' ・ 満タン':'');let a=$('petRecoveryActions');a.innerHTML='';for(let it of items){let rule=PET_RECOVERY_RULES[it.id],b=document.createElement('button');b.textContent=it.icon+' '+it.name+'を与える　体力 +'+(rule.amount||3);b.disabled=full;b.onclick=()=>usePetFeed(it.id);a.appendChild(b)}if(!items.length){let n=document.createElement('div');n.className='note';n.textContent='与えられる餌は所持していません。';a.appendChild(n)}}
function openPetRecovery(){if(!activeId)return toast('先にセーブデータを作ってください');if(!liveCompanion())return toast('同行動物はいません');renderPetRecoveryMenu();$('petRecoveryLayer').classList.add('open')}
function closePetRecovery(){$('petRecoveryLayer')?.classList.remove('open')}
function applyPetHealthUi(){installPetRecoveryUi();let comp=liveCompanion();if(!comp){closePetRecovery();return}let max=comp.maxHealth??comp.health??0,cur=comp.health??max;if($('petScreenHealthValue'))$('petScreenHealthValue').textContent=cur+' / '+max}
const originalRenderForPetRecovery=render;
render=function(){originalRenderForPetRecovery();applyPetHealthUi()};
installPetRecoveryUi();
