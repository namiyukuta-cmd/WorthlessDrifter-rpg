const PROFILE_STAGE1_IMAGE='assets/avatar/base/base_stage1.svg';
function renderProfileStage1(){
  const section=$('profile');
  if(!section)return;
  const name=$('profileName');
  if(name)name.textContent=state.characterName||'旅人';
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
      .profile-stage1-avatar{width:min(256px,78vw);aspect-ratio:1;margin:8px auto 0;border:1px solid #cfbeaa;border-radius:12px;background:linear-gradient(#f6eddf,#eee1d0);overflow:hidden}
      .profile-stage1-avatar img{display:block;width:100%;height:100%;object-fit:contain}
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
    section.innerHTML='<div class="profile-stage1-shell"><div class="profile-stage1-card"><h2 id="profileName">旅人</h2><div class="profile-stage1-sub">アバター</div><div class="profile-stage1-avatar"><img id="profileBaseImage" src="'+PROFILE_STAGE1_IMAGE+'?v='+GAME_ASSET_VERSION+'" alt="共通素体"></div></div></div>';
    app.appendChild(section);
  }
  renderProfileStage1();
}
const profileStage1BaseRender=render;
render=function(){profileStage1BaseRender();renderProfileStage1()};
installProfileStage1();
