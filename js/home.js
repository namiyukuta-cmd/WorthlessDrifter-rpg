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
  .newgame-field{margin-top:13px;text-align:left}.newgame-field label{display:block;font-size:12px;font-weight:800;margin-bottom:5px}
  .newgame-field input,.newgame-field textarea{width:100%;border:1px solid #a8947f;border-radius:8px;background:#fffdf9;padding:10px;font:inherit;color:inherit}
  .newgame-field textarea{min-height:66px;resize:vertical}
  .newgame-start{width:100%;margin-top:16px;border:1px solid #806c59;border-radius:9px;background:#dcc2a1;padding:13px;font-weight:900;font-size:16px}
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
    layer.innerHTML='<div class="newgame-box"><div class="newgame-head"><h2>NEW GAME</h2><button id="closeNewGame">閉じる</button></div><p class="note">旅立つキャラクターを作ります。設定は後でゲーム中に使えるようセーブデータへ残します。</p><div class="newgame-field"><label for="ng_name">名前</label><input id="ng_name" maxlength="40" value="旅人"></div>'+fields+'<button id="startNewGame" class="newgame-start">このキャラクターで始める</button></div>';
    document.body.appendChild(layer)
  }
  $('homeLoad').onclick=()=>openLoad();
  $('homeData').onclick=()=>openSave(true,'data');
  $('homeNew').onclick=openNewGame;
  $('closeNewGame').onclick=closeNewGame;
  $('newGameLayer').onclick=e=>{if(e.target===$('newGameLayer'))closeNewGame()};
  $('startNewGame').onclick=startNewGame
}
function showHome(){
  installHomeDom();
  document.querySelector('.app').style.display='none';
  $('homeLayer').style.display='flex';
  closeStorage();
  closeHealth?.();
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
  $('newGameLayer').classList.add('open');
  setTimeout(()=>$('ng_name').focus(),0)
}
function closeNewGame(){$('newGameLayer')?.classList.remove('open')}
async function startNewGame(){
  if(activeId&&dirty&&!confirm('保存していない変更があります。保存せずにNEW GAMEを始めますか？'))return;
  let form={name:$('ng_name').value};
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
window.showHome=showHome;
window.enterGame=enterGame;
installHomeDom();
showHome();
