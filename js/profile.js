function ensureAvatarState(){
  let d=AVATAR_DATA.defaults||{base:'01',eyes:'none',hair:'none',clothes:'none'};
  if(!state.avatar||typeof state.avatar!=='object')state.avatar={};
  for(let k of ['base','eyes','hair','clothes'])if(!state.avatar[k])state.avatar[k]=d[k];
  if(!AVATAR_DATA.eyes.some(x=>x.id===state.avatar.eyes))state.avatar.eyes=d.eyes;
  if(!AVATAR_DATA.hair.some(x=>x.id===state.avatar.hair))state.avatar.hair=d.hair;
  if(!AVATAR_DATA.clothes.some(x=>x.id===state.avatar.clothes))state.avatar.clothes=d.clothes;
}
function avatarChoice(kind){ensureAvatarState();let list=AVATAR_DATA[kind]||[];return list.find(x=>x.id===state.avatar[kind])||list[0]||null}
function avatarLayer(id,src){let e=$(id);if(!e)return;if(src){if(e.getAttribute('src')!==src)e.src=src;e.style.display='block'}else{e.removeAttribute('src');e.style.display='none'}}
function avatarCycle(kind,dir){if(!activeId)return toast('先にキャラクターを作ってください');ensureAvatarState();let list=AVATAR_DATA[kind]||[];if(list.length<2)return;let i=Math.max(0,list.findIndex(x=>x.id===state.avatar[kind]));i=(i+dir+list.length)%list.length;state.avatar[kind]=list[i].id;markDirty();renderProfile()}
function renderAvatarSelector(kind,label){let list=AVATAR_DATA[kind]||[],current=avatarChoice(kind),box=document.querySelector('[data-avatar-selector="'+kind+'"]');if(!box)return;box.querySelector('.profile-choice-name').textContent=current?.label||'未登録';box.querySelectorAll('button').forEach(b=>b.disabled=list.length<2);let count=box.querySelector('.profile-choice-count');if(count){let i=current?list.findIndex(x=>x.id===current.id):-1;count.textContent=list.length?((Math.max(i,0)+1)+' / '+list.length):'0 / 0'}}
function renderProfile(){
  let section=$('profile');if(!section)return;ensureAvatarState();
  let name=$('profileName');if(name)name.textContent=state.characterName||'旅人';
  avatarLayer('avatarHairBack',avatarChoice('hair')?.back||null);
  avatarLayer('avatarBase',AVATAR_DATA.base?.image||null);
  avatarLayer('avatarClothes',avatarChoice('clothes')?.image||null);
  avatarLayer('avatarEyes',avatarChoice('eyes')?.image||null);
  avatarLayer('avatarHairFront',avatarChoice('hair')?.front||null);
  renderAvatarSelector('eyes','目');renderAvatarSelector('hair','髪');renderAvatarSelector('clothes','服')
}
function installProfileStyles(){
  if(document.getElementById('profileStyles'))return;let s=document.createElement('style');s.id='profileStyles';s.textContent=`
  .app>nav{grid-template-columns:repeat(4,minmax(0,1fr))!important}
  #profile{padding:9px}.profile-shell{display:grid;grid-template-columns:1fr;gap:9px;max-width:760px;margin:0 auto}.profile-card{background:#fffaf3;border:1px solid #ad9985;border-radius:12px;padding:11px;box-shadow:0 2px 0 #d4c6b5}.profile-card h2{font-size:16px;margin:0}.profile-sub{font-size:10px;color:#766b61;margin-top:2px}.profile-avatar-stage{position:relative;width:min(256px,78vw);aspect-ratio:1;margin:8px auto 0;border:1px solid #cfbeaa;border-radius:12px;background:linear-gradient(#f6eddf,#eee1d0);overflow:hidden}.profile-avatar-stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none}.profile-parts{display:grid;gap:8px}.profile-part-title{font-size:11px;font-weight:900;margin-bottom:4px}.profile-selector{display:grid;grid-template-columns:40px minmax(0,1fr) 40px;gap:6px;align-items:center}.profile-selector button{border:1px solid #927c67;border-radius:8px;background:#f0dfca;padding:9px 4px;font-weight:900}.profile-selector button:disabled{opacity:.35}.profile-choice{min-width:0;border:1px solid #d2c2b0;border-radius:8px;background:#fffdf9;padding:7px;text-align:center}.profile-choice-name{font-size:12px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.profile-choice-count{font-size:8px;color:#887667;margin-top:2px}.profile-note{font-size:9px;color:#806f60;line-height:1.45;margin-top:8px}@media(min-width:700px){.profile-shell{grid-template-columns:minmax(300px,360px) minmax(0,1fr);align-items:start}.profile-avatar-stage{width:100%;max-width:320px}}
  `;document.head.appendChild(s)
}
function installProfileDom(){
  installProfileStyles();let nav=document.querySelector('.app>nav');if(nav&&!nav.querySelector('[data-screen="profile"]')){let b=document.createElement('button');b.type='button';b.dataset.screen='profile';b.textContent='プロフィール';nav.appendChild(b);b.addEventListener('click',()=>go('profile'))}
  let app=document.querySelector('.app');if(app&&!$('profile')){let s=document.createElement('section');s.id='profile';s.className='screen';s.innerHTML='<div class="profile-shell"><div class="profile-card"><h2 id="profileName">旅人</h2><div class="profile-sub">アバター</div><div class="profile-avatar-stage" aria-label="アバタープレビュー"><img id="avatarHairBack" alt=""><img id="avatarBase" alt="共通素体"><img id="avatarClothes" alt=""><img id="avatarEyes" alt=""><img id="avatarHairFront" alt=""></div></div><div class="profile-card"><h2>見た目</h2><div class="profile-sub">パーツを選択</div><div class="profile-parts"><div data-avatar-selector="eyes"><div class="profile-part-title">目</div><div class="profile-selector"><button type="button" data-avatar-kind="eyes" data-avatar-dir="-1">◀</button><div class="profile-choice"><div class="profile-choice-name">なし</div><div class="profile-choice-count">1 / 1</div></div><button type="button" data-avatar-kind="eyes" data-avatar-dir="1">▶</button></div></div><div data-avatar-selector="hair"><div class="profile-part-title">髪</div><div class="profile-selector"><button type="button" data-avatar-kind="hair" data-avatar-dir="-1">◀</button><div class="profile-choice"><div class="profile-choice-name">なし</div><div class="profile-choice-count">1 / 1</div></div><button type="button" data-avatar-kind="hair" data-avatar-dir="1">▶</button></div></div><div data-avatar-selector="clothes"><div class="profile-part-title">服</div><div class="profile-selector"><button type="button" data-avatar-kind="clothes" data-avatar-dir="-1">◀</button><div class="profile-choice"><div class="profile-choice-name">なし</div><div class="profile-choice-count">1 / 1</div></div><button type="button" data-avatar-kind="clothes" data-avatar-dir="1">▶</button></div></div></div><div class="profile-note">パーツ画像を追加すると、この画面の選択肢も増えます。</div></div></div>';app.appendChild(s);s.querySelectorAll('[data-avatar-kind]').forEach(b=>b.onclick=()=>avatarCycle(b.dataset.avatarKind,Number(b.dataset.avatarDir)||1))}
  renderProfile()
}
const profileBaseRender=render;render=function(){profileBaseRender();renderProfile()};
installProfileDom();
