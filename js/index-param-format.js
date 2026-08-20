function formatIndexParamText(){
  let health=document.getElementById('healthValue');
  if(health){
    let cur=state.health??10,max=state.maxHealth??10;
    let html='<span class="index-current">'+cur+'</span><span class="index-max"> / '+max+'</span>';
    if(health.innerHTML!==html)health.innerHTML=html
  }
  let currentWeight=document.getElementById('indexWeight'),weightStrong=currentWeight?.closest('strong');
  if(weightStrong){
    let cur=typeof topWeight==='function'?topWeight('main'):Number(currentWeight.textContent||0),max=Number(state.humanMax??18);
    let html='<span id="indexWeight" class="index-current">'+cur.toFixed(1)+'</span><span class="index-max"> / '+max.toFixed(1)+' kg</span>';
    if(weightStrong.innerHTML!==html)weightStrong.innerHTML=html
  }
}
(function installIndexParamFormat(){
  if(!document.getElementById('indexParamFormatStyles')){
    let s=document.createElement('style');s.id='indexParamFormatStyles';s.textContent=`
      .index-params .index-current{font-size:10px;font-weight:900;line-height:1.05}
      .index-params .index-max{font-size:7px;font-weight:700;line-height:1.05;color:#786c62;white-space:nowrap}
      @media(min-width:700px){.index-params .index-current{font-size:13px}.index-params .index-max{font-size:9px}}
      @media(max-width:350px){.index-params .index-current{font-size:9px}.index-params .index-max{font-size:6px}}
    `;document.head.appendChild(s)
  }
  const before=render;
  render=function(){before();formatIndexParamText()};
  formatIndexParamText()
})();
