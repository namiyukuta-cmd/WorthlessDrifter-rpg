(()=>{
  if(document.getElementById('mobileWidthFixStyles'))return;
  const s=document.createElement('style');
  s.id='mobileWidthFixStyles';
  s.textContent=`
  html,body{width:100%;max-width:100%;overflow-x:hidden!important}
  body{position:relative}
  .app{width:100%!important;max-width:100vw!important;min-width:0!important;overflow-x:hidden!important;margin:0 auto!important}
  .app>header{width:100%!important;max-width:100%!important;min-width:0!important;padding:6px 4px!important;gap:3px!important;overflow:hidden!important}
  .app>header>div:first-child{min-width:0!important;flex:1 1 0!important;overflow:hidden!important}
  .app>header .title{font-size:8px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important}
  .app>header .charline{font-size:7px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .app>header .header-actions{display:flex!important;flex:0 0 auto!important;min-width:0!important;gap:2px!important}
  .app>header .header-actions button{padding:5px 3px!important;font-size:7px!important;line-height:1!important;border-radius:5px!important;min-width:0!important}
  .app>header .save-state{font-size:6px!important;min-width:0!important;max-width:48px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  .app>nav{width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;overflow:hidden!important}
  .app>nav button{min-width:0!important;padding:8px 2px!important;font-size:11px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
  #index.index-layout{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;padding:4px!important}
  .index-game-grid{width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:52px minmax(0,1fr) 72px!important;gap:4px!important}
  .index-game-grid>*{min-width:0!important;max-width:100%!important}
  .index-params,.index-actions{padding:4px 2px!important}
  .index-main-view{min-width:0!important;width:100%!important;max-width:100%!important}
  .index-center-slot{min-width:0!important;padding:4px!important}
  .index-center-slot .travel-map{display:block!important;width:100%!important;max-width:100%!important}
  .index-action-slot,.index-action-slot .travel-actions,.index-action-slot .travel-modes,.index-action-slot .travel-night{min-width:0!important;max-width:100%!important}
  .index-action-slot button{min-width:0!important;max-width:100%!important;font-size:8px!important;padding:6px 2px!important}
  .index-bottom{width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important;margin-top:4px!important}
  @media(max-width:380px){
    .index-game-grid{grid-template-columns:48px minmax(0,1fr) 64px!important;gap:3px!important}
    .app>header .header-actions button{font-size:6.5px!important;padding:5px 2px!important}
    .app>header .save-state{max-width:40px!important}
  }
  `;
  document.head.appendChild(s);
  requestAnimationFrame(()=>window.scrollTo({left:0,top:window.scrollY,behavior:'auto'}));
})();
