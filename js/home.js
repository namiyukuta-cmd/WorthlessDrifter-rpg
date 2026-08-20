let selectedCompanionId=null;
function installHomeStyles(){
  if(document.getElementById('homeStyles'))return;
  let style=document.createElement('style');
  style.id='homeStyles';
  style.textContent=`
  .home-layer{position:fixed;inset:0;z-index:150;background:#e7ded0;display:flex;align-items:center;justify-content:center;padding:18px;color:#332b25}
  .home-card{width:min(430px,100%);background:#fbf6ed;border:2px solid #6c5b4d;border-radius:18px;padding:28px 18px;box-shadow:0 12px 35px #0002;text-align:center}
  .home-card h1{font-size:30px;line-height:1.05;margin:0 0 8px;letter-spacing:.04em}
  .home-sub{font-size:11px;color:#806f60;margin-bottom:28px}
  .home-actions{display:grid;gap:11px}
  .home-actions button{width:100%;padding:14px 12px;border:1px solid #806c59;border-radius:10px;background:#f0dfca;font-weight:900;font-size:16px}
  .home-actions button.primary{background:#dcc2a1;font-size:18px}
  .newgame-layer{position:fixed;inset:0;z-index:190;display:none;background:#0006;padding:12px;align-items:center;justify-content:center}
  .newgame-layer.open{display:flex}
  .newgame-box{width:min(520px,100%);max-height:88dvh;overflow:auto;background:#fff9f0;border:2px solid #6c5b4d;border-radius:14px;padding:14px;box-shadow:0 14px 45px #0007}
  .newgame-head{display:flex;align-items:center;gap:8px}.newgame-head h2{margin:0}.newgame-head button{margin-left:auto;border:1px solid #a5917c;border-radius:7px;background:#eee0d0;padding:7px 10px}
  .newgame-step{display:none}.newgame-step.active{display:block}
  .newgame-stepmark{font-size:10px;color:#8a7868;margin-top:4px}
  .newgame-field{margin-top:13px;text-align:left}.newgame-field label{display:block;font-size:12px;font-weight:800;margin-bottom:5px}
  .newgame-field input,.newgame-field textarea{width:100%;border:1px solid #a8947f;border-radius:8px;background:#fffdf9;padding:10px;font:inherit;color:inherit}
  .newgame-field textarea{min-height:66px;resize:vertical}
  .newgame-start,.newgame-next{width:100%;margin-top:16px;border:1px solid #806c59;border-radius:9px;background:#dcc2a1;padding:13px;font-weight:900;font-size:16px}
  .newgame-back{width:100%;margin-top:8px;border:1px solid #a5917c;border-radius:9px;background:#eee0d0;padding:10px;font-weight:800}
  .companion-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}
  .companion-card{border:1px solid #b7a38e;border-radius:11px;background:#fffdf9;padding:11px;text-align:left;min-height:116px}
  .companion-card.selected{outline:3px solid #9e7658;background:#f3e3cf}
  .companion-icon{font-size:30px}.companion-name{font-weight:900;font-size:15px;margin-top:3px}.companion-desc{font-size:10px;color:#7c6c5e;margin-top:2px}
  .companion-stats{font-size:10px;margin-top:8px;line-height:1.45}
  @media(max-width:390px){.companion-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style)
}
function installHomeDom(){
  installHomeStyles();
  if(!document.getElementById('homeLayer')){
    let home=document.createElement('div');
    home.id='homeLayer';home.className='home-layer';
    home.innerHTML='<div class="home-card"><h1>Worthless<br>Drifter</h1><div class="home-sub">WANDERING RPG</div><div class="home-actions"><button id="homeLoad">LOAD</button><button id="homeNew" class="primary">NEW GAME</button><button id="homeData">データ</button></div></div>';
    document.body.appendChild(home)
  }
  if(!document.getElementById('newGameLayer')){
    let layer=document.createElement('div');layer.id='newGameLayer';layer.className='newgame-layer';
    let fields=NEW_GAME_DATA.questions.map(q=>'<div class="newgame-field"><label for="ng_'+q.id+'">'+q.label+'</label><textarea id="ng_'+q.id+'" placeholder="'+q.placeholder+'"></textarea></div>').join('');
    let companions=NEW_GAME_DATA.companions.map(c=>'<button type="button" class="companion-card" data-companion="'+c.id+'"><div class="companion-icon">'+c.icon+'</div><div class="companion-name">'+c.label+'</div><div class="companion-desc">'+c.description+'</div><div class="companion-stats">'+(c.id==='none'?'体力・食料・水：なし':'体力 '+c.health+'<br>1日：食料 '+c.dailyFood+' ／ 水 '+c.dailyWater)+'</div></button>').join('');
    layer.innerHTML='<div class="newgame-box"><div class="newgame-head"><div><h2>NEW GAME</h2><div id="newGameStepMark" class="newgame-stepmark">1 / 2　旅立ち</div></div><button id="closeNewGame">閉じる</button></div><div id="newGameStep1" class="newgame-step active"><p class="note">旅立つキャラクターを作ります。設定はセーブデータへ残します。</p><div class="newgame-field"><label for="ng_name">名前</label><input id="ng_name" maxlength="40" value="旅人"></div>'+fields+'<button id="nextCompanion" class="newgame-next">次へ：同行動物</button></div><div id="newGameStep2" class="newgame-step"><p class="note">一緒に旅をする動物を選びます。同行なしでも始められます。</p><div class="companion-grid">'+companions+'</div><div id="companionNameField" class="newgame-field" style="display:none"><label for="ng_companion_name">同行動物の名前</label><input id="ng_companion_name" maxlength="40" placeholder="空欄でも可"></div><button id="startNewGame" class="newgame-start">このキャラクターで始める</button><button id="backNewGame" class="newgame-back">戻る</button></div></div>';
    document.body.appendChild(layer)
  }
  $('homeLoad').onclick=()=>openLoad();
  $('homeData').onclick=()=>openSave(true,'data');
  $('homeNew').onclick=openNewGame;
  if($('homeBtn'))$('homeBtn').onclick=showHome;
  $('closeNewGame').onclick=closeNewGame;
  $('newGameLayer').onclick=e=>{if(e.target===$('newGameLayer'))closeNewGame()};
  $('nextCompanion').onclick=()=>showNewGameStep(2);
  $('backNewGame').onclick=()=>showNewGameStep(1);
  $('startNewGame').onclick=startNewGame;
  document.querySelectorAll('[data-companion]').forEach(x=>x.onclick=()=>selectCompanion(x.dataset.companion))
}
function showNewGameStep(step){
  $('newGameStep1').classList.toggle('active',step===1);
  $('newGameStep2').classList.toggle('active',step===2);
  $('newGameStepMark').textContent=step===1?'1 / 2　旅立ち':'2 / 2　同行動物';
  if(step===1)setTimeout(()=>$('ng_name').focus(),0)
}
function selectCompanion(id){
  selectedCompanionId=id;
  document.querySelectorAll('[data-companion]').forEach(x=>x.classList.toggle('selected',x.dataset.companion===id));
  $('companionNameField').style.display=id==='none'?'none':'';
  if(id==='none')$('ng_companion_name').value=''
}
function showHome(){
  installHomeDom();
  document.querySelector('.app').style.display='none';
  $('homeLayer').style.display='flex';
  closeStorage();
  closeSave();
  closeHealth?.()
}
function enterGame(){
  installHomeDom();
  $('homeLayer').style.display='none';
  document.querySelector('.app').style.display='';
  go('index');
  render();
  updateSaveState()
}
function openNewGame(){
  installHomeDom();
  selectedCompanionId=null;
  document.querySelectorAll('[data-companion]').forEach(x=>x.classList.remove('selected'));
  $('companionNameField').style.display='none';
  $('ng_companion_name').value='';
  showNewGameStep(1);
  $('newGameLayer').classList.add('open')
}
function closeNewGame(){$('newGameLayer')?.classList.remove('open')}
async function startNewGame(){
  if(!selectedCompanionId)return toast('同行動物を選んでください');
  if(activeId&&dirty&&!confirm('保存していない変更があります。保存せずにNEW GAMEを始めますか？'))return;
  let form={name:$('ng_name').value,companionId:selectedCompanionId,companionName:$('ng_companion_name').value};
  for(let q of NEW_GAME_DATA.questions)form[q.id]=$('ng_'+q.id).value;
  activeId=uid();
  state=buildNewGameState(form);
  dirty=true;
  closeStorage();closeSave();closeNewGame();
  enterGame();
  toast('NEW GAMEを始めました');
  if(githubToken)await saveCurrent()
}
const originalLoadSlot=loadSlot;
loadSlot=function(id){
  originalLoadSlot(id);
  if(activeId===id&&!$('saveLayer').classList.contains('open'))enterGame()
};
const originalSetSaveMode=setSaveMode;
setSaveMode=function(mode){
  originalSetSaveMode(mode);
  $('newSave').style.display='none'
};
function currentCompanion(){
  if(state.companion===undefined)return{type:'dog',label:'犬',icon:'🐕',name:'ムギ',health:15,maxHealth:15,dailyFood:1,dailyWater:1};
  return state.companion
}
function applyCompanionUi(){
  let comp=currentCompanion();
  let petNav=document.querySelector('nav button[data-screen="pet"]');
  if(petNav)petNav.style.display=comp?'':'none';
  let indexPanel=$('petIndexPanel');
  if(indexPanel)indexPanel.style.display=comp?'':'none';
  if(!comp)return;
  let face=document.querySelector('#pet .pet-face');
  let name=document.querySelector('#pet .panel:first-child strong');
  let note=document.querySelector('#pet .panel:first-child .note');
  if(face)face.textContent=comp.icon||'🐾';
  if(name)name.textContent=comp.name||comp.label||'同行動物';
  if(note)note.textContent='体力 '+(comp.health??comp.maxHealth??0)+' / '+(comp.maxHealth??comp.health??0)+' ・ 1日 食料 '+(comp.dailyFood??0)+' ／ 水 '+(comp.dailyWater??0);
  if($('petIndexIcon'))$('petIndexIcon').textContent=comp.icon||'🐾';
  if($('petIndexName'))$('petIndexName').textContent=comp.name||comp.label||'同行動物';
  if($('petIndexHealth'))$('petIndexHealth').textContent=(comp.health??comp.maxHealth??0)+' / '+(comp.maxHealth??comp.health??0);
  if($('petIndexWeight'))$('petIndexWeight').textContent=topWeight('pet').toFixed(1)+' / '+Number(state.petMax??0).toFixed(1)+' kg';
  if($('petIndexFood'))$('petIndexFood').textContent=String(comp.dailyFood??0);
  if($('petIndexWater'))$('petIndexWater').textContent=String(comp.dailyWater??0)
}
const originalRenderForCompanion=render;
render=function(){originalRenderForCompanion();applyCompanionUi()};
window.showHome=showHome;
window.enterGame=enterGame;
installHomeDom();
showHome();
