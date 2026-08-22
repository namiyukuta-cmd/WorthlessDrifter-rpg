const PROFILE_STAGE1_IMAGE='assets/avatar/base/base_01.png';
const PROFILE_STAGE1_EYES_DIR='assets/avatar/eyes';
function profileStage1EyesPath(){
  const id=state.avatar&&state.avatar.eyes?String(state.avatar.eyes):'none';
  return id==='none'?'':PROFILE_STAGE1_EYES_DIR+'/eyes_'+id+'.png';
}
function setProfileStage1Eyes(id){
  if(!state.avatar)state.avatar={base:'01',eyes:'none',hair:'none',clothes:'none'};
  state.avatar.eyes=id;
  dirty=true;
  renderProfileStage1();
}
function renderProfileStage1(){
  const section=$('profile');
  if(!section)return;
  const name=$('profileName');
  if(name)name.textContent=state.characterName||'旅人';
  const eyes=$('profileEyesImage');
  if(eyes){
    const path=profileStage1EyesPath();
    if(path){
      const src=path+'?v='+GAME_ASSET_VERSION;
      if(eyes.getAttribute('src')!==src)eyes.setAttribute('src',src);
      eyes.hidden=false;
    }else{
      eyes.hidden=true;
      eyes.removeAttribute('src');
    }
  }
  const selected=state.avatar&&state.avatar.eyes?String(state.avatar.eyes):'none';
  section.querySelectorAll('[data-profile-eye]').forEach(button=>button.classList.toggle('active',button.dataset.profileEye===selected));
}
function installProfileStage1(){
  if(!document.getElementById('profileStage1Styles')){
    const style=document.createElement('style');
    style.id='profileStage1Styles';
    style.textContent=`
      .app>nav{grid-template-columns:repeat(4,minmax(0,1fr))!important}
      #profile{padding:9px}
      .profile-stage1-shell{max-width:760px;margin:0 auto}
      .profile-stage1-card{background:#fffaf3;border:1px solid #ad9985;border-radius:12px;padding:11px;box-shadow:0 2px 0 #d4c6b5}
      .profile-stage1-card h2{font-size:16px;margin:0}
      .profile-stage1-sub{font-size:10px;color:#766b61;margin-top:2px}
      .profile-stage1-avatar{position:relative;width:min(256px,78vw);aspect-ratio:1;margin:8px auto 0;border:1px solid #cfbeaa;border-radius:12px;background:linear-gradient(#f6eddf,#eee1d0);overflow:hidden}
      .profile-stage1-avatar img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
      .profile-avatar-base{z-index:0}
      .profile-stage1-avatar .profile-avatar-eyes{z-index:10;inset:auto;left:calc(15.36% - 2px);top:6.05%;width:calc(70.833% + 1px);height:calc(70.833% + 1px)}
      .profile-stage1-eyes{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:9px}
      .profile-stage1-eyes span{font-size:11px;color:#766b61;margin-right:2px}
      .profile-stage1-eyes button{min-width:54px;padding:6px 10px;border:1px solid #ad9985;border-radius:8px;background:#fffaf3;color:#4d433b;font:inherit}
      .profile-stage1-eyes button.active{box-shadow:inset 0 0 0 2px #ad9985;font-weight:700}
    `;
    document.head.appendChild(style);
  }
  const nav=document.querySelector('.app>nav');
  if(nav&&!nav.querySelector('[data-screen="profile"]')){
    const button=document.createElement('button');
    button.type='button';
    button.dataset.screen='profile';
    button.textContent='プロフィール';
    button.addEventListener('click',()=>go('profile'));
    nav.appendChild(button);
  }
  const app=document.querySelector('.app');
  if(app&&!$('profile')){
    const section=document.createElement('section');
    section.id='profile';
    section.className='screen';
    section.innerHTML='<div class="profile-stage1-shell"><div class="profile-stage1-card"><h2 id="profileName">旅人</h2><div class="profile-stage1-sub">アバター</div><div class="profile-stage1-avatar"><img id="profileBaseImage" class="profile-avatar-base" src="'+PROFILE_STAGE1_IMAGE+'?v='+GAME_ASSET_VERSION+'" alt="共通素体"><img id="profileEyesImage" class="profile-avatar-eyes" alt="" hidden></div><div class="profile-stage1-eyes"><span>目</span><button type="button" data-profile-eye="none">なし</button><button type="button" data-profile-eye="01">01</button><button type="button" data-profile-eye="02">02</button><button type="button" data-profile-eye="03">03</button><button type="button" data-profile-eye="04">04</button></div></div></div>';
    section.querySelectorAll('[data-profile-eye]').forEach(button=>button.addEventListener('click',()=>setProfileStage1Eyes(button.dataset.profileEye)));
    app.appendChild(section);
  }
  renderProfileStage1();
}
const profileStage1BaseRender=render;
render=function(){profileStage1BaseRender();renderProfileStage1()};
installProfileStage1();