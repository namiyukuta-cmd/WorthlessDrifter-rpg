const PROFILE_STAGE1_IMAGE='assets/avatar/base/base_01.png';
const PROFILE_STAGE1_EYES_DIR='assets/avatar/fitted';
const PROFILE_STAGE1_CLOTHES_DIR='assets/avatar/fitted';

/* 素体と位置を合わせた assets/avatar/fitted 内のパーツ数 */
const PROFILE_STAGE1_EYES_COUNT=4;
const PROFILE_STAGE1_CLOTHES_COUNT=2;

function profileStage1PartId(value,count){
  const text=String(value??'none');
  if(!/^\d{1,2}$/.test(text))return 'none';
  const number=Number(text);
  return number>=1&&number<=count?String(number).padStart(2,'0'):'none';
}

function profileStage1EyesPath(){
  const id=profileStage1PartId(state.avatar?.eyes,PROFILE_STAGE1_EYES_COUNT);
  return id==='none'?'':PROFILE_STAGE1_EYES_DIR+'/eyes_'+id+'.png';
}

function profileStage1ClothesPath(){
  const id=profileStage1PartId(state.avatar?.clothes,PROFILE_STAGE1_CLOTHES_COUNT);
  return id==='none'?'':PROFILE_STAGE1_CLOTHES_DIR+'/clothes_'+id+'.png';
}

/* 目ボタンを自動生成 */
function profileStage1EyesButtonsHtml(){
  let html='<button type="button" data-profile-eye="none">なし</button>';

  for(let i=1;i<=PROFILE_STAGE1_EYES_COUNT;i++){
    const id=String(i).padStart(2,'0');
    html+='<button type="button" data-profile-eye="'+id+'">'+id+'</button>';
  }

  return html;
}

/* 服ボタンを自動生成 */
function profileStage1ClothesButtonsHtml(){
  let html='<button type="button" data-profile-clothes="none">なし</button>';

  for(let i=1;i<=PROFILE_STAGE1_CLOTHES_COUNT;i++){
    const id=String(i).padStart(2,'0');
    html+='<button type="button" data-profile-clothes="'+id+'">'+id+'</button>';
  }

  return html;
}

function setProfileStage1Eyes(id){
  if(!state.avatar)state.avatar={base:'01',eyes:'none',hair:'none',clothes:'none'};
  state.avatar.eyes=profileStage1PartId(id,PROFILE_STAGE1_EYES_COUNT);
  dirty=true;
  updateSaveState();
  renderProfileStage1();
}

function setProfileStage1Clothes(id){
  if(!state.avatar)state.avatar={base:'01',eyes:'none',hair:'none',clothes:'none'};
  state.avatar.clothes=profileStage1PartId(id,PROFILE_STAGE1_CLOTHES_COUNT);
  dirty=true;
  updateSaveState();
  renderProfileStage1();
}

function profileStage1ImageStatus(){
  const status=$('profileImageStatus');
  if(!status)return;
  const failed=[$('profileBaseImage'),$('profileClothesImage'),$('profileEyesImage')]
    .filter(image=>image?.dataset.loadError);
  status.textContent=failed.map(image=>image.dataset.loadError).join(' / ');
  status.hidden=failed.length===0;
}

function profileStage1ImageSource(image,path){
  const src=path?path+'?v='+GAME_ASSET_VERSION:'';
  if(image.getAttribute('src')===src)return;
  image.hidden=true;
  delete image.dataset.loadError;
  if(src)image.setAttribute('src',src);
  else image.removeAttribute('src');
  profileStage1ImageStatus();
}

function renderProfileStage1(){
  const section=$('profile');
  if(!section)return;

  const name=$('profileName');
  if(name)name.textContent=state.characterName||'旅人';

  const clothes=$('profileClothesImage');
  if(clothes){
    const path=profileStage1ClothesPath();
    profileStage1ImageSource(clothes,path);
  }

  const eyes=$('profileEyesImage');
  if(eyes){
    const path=profileStage1EyesPath();
    profileStage1ImageSource(eyes,path);
  }

  const selectedEyes=profileStage1PartId(state.avatar?.eyes,PROFILE_STAGE1_EYES_COUNT);
  section.querySelectorAll('[data-profile-eye]').forEach(
    button=>{
      const selected=button.dataset.profileEye===selectedEyes;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-pressed',String(selected));
    }
  );

  const selectedClothes=profileStage1PartId(state.avatar?.clothes,PROFILE_STAGE1_CLOTHES_COUNT);
  section.querySelectorAll('[data-profile-clothes]').forEach(
    button=>{
      const selected=button.dataset.profileClothes===selectedClothes;
      button.classList.toggle('active',selected);
      button.setAttribute('aria-pressed',String(selected));
    }
  );
}

function installProfileStage1(){
  if(!document.getElementById('profileStage1Styles')){
    const style=document.createElement('link');
    style.id='profileStage1Styles';
    style.rel='stylesheet';
    style.href='css/profile-stage1.css?v='+GAME_ASSET_VERSION;
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

    section.innerHTML=
      '<div class="profile-stage1-shell">'+
        '<div class="profile-stage1-card">'+
          '<h2 id="profileName">旅人</h2>'+
          '<div class="profile-stage1-sub">アバター</div>'+

          '<div class="profile-stage1-avatar">'+
            '<img id="profileBaseImage" class="profile-avatar-base" alt="共通素体" hidden>'+
            '<img id="profileClothesImage" class="profile-avatar-clothes" alt="" hidden>'+
            '<img id="profileEyesImage" class="profile-avatar-eyes" alt="" hidden>'+
          '</div>'+
          '<div id="profileImageStatus" class="profile-stage1-status" role="status" hidden></div>'+

          '<div class="profile-stage1-eyes">'+
            '<span>目</span>'+
            profileStage1EyesButtonsHtml()+
          '</div>'+

          '<div class="profile-stage1-clothes">'+
            '<span>服</span>'+
            profileStage1ClothesButtonsHtml()+
          '</div>'+

        '</div>'+
      '</div>';

    section.querySelectorAll('[data-profile-eye]').forEach(
      button=>button.addEventListener('click',()=>setProfileStage1Eyes(button.dataset.profileEye))
    );

    section.querySelectorAll('[data-profile-clothes]').forEach(
      button=>button.addEventListener('click',()=>setProfileStage1Clothes(button.dataset.profileClothes))
    );

    app.appendChild(section);
    for(const [id,label] of [['profileBaseImage','素体'],['profileClothesImage','服'],['profileEyesImage','目']]){
      const image=$(id);
      image.addEventListener('load',()=>{
        if(!image.getAttribute('src'))return;
        if(image.naturalWidth!==128||image.naturalHeight!==128){
          image.hidden=true;
          image.dataset.loadError=label+'の画像サイズが一致しません';
        }else{
          image.hidden=false;
          delete image.dataset.loadError;
        }
        profileStage1ImageStatus();
      });
      image.addEventListener('error',()=>{
        if(!image.getAttribute('src'))return;
        image.hidden=true;
        image.dataset.loadError=label+'の画像を読み込めませんでした';
        profileStage1ImageStatus();
      });
    }
    profileStage1ImageSource($('profileBaseImage'),PROFILE_STAGE1_IMAGE);
  }

  renderProfileStage1();
}

const profileStage1BaseRender=render;

render=function(){
  profileStage1BaseRender();
  renderProfileStage1();
};

installProfileStage1();
