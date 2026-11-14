(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const section=$('#instalacion');
  const tabs=$('.dl-guide-tabs');
  const titles={gluplandia:'Gluplandia Launcher',official:'Java oficial',bedrock:'Minecraft Bedrock'};
  let panelAnimations=[];

  function activeGuide(){return $('[data-guide][aria-selected=true]')?.dataset.guide||'gluplandia';}
  function positionIndicator(){
    const active=$('[data-guide][aria-selected=true]');
    if(!active||!tabs)return;
    const parent=tabs.getBoundingClientRect(),button=active.getBoundingClientRect();
    tabs.style.setProperty('--tab-left',`${button.left-parent.left}px`);
    tabs.style.setProperty('--tab-width',`${button.width}px`);
  }
  function updateProgress(detail){
    const guide=detail?.guide||activeGuide();
    const checks=$$(`#guide-${guide} input[type=checkbox]`);
    const done=detail?.done??checks.filter(input=>input.checked).length;
    const total=detail?.total??checks.length;
    const percentage=total?Math.round(done/total*100):0;
    $('#dl-progress-percent').replaceChildren(document.createTextNode(String(percentage)));
    const symbol=document.createElement('span');symbol.textContent='%';$('#dl-progress-percent').append(symbol);
    $('#dl-progress-circle').style.strokeDashoffset=String(320.442*(1-percentage/100));
    $('#dl-progress-note').textContent=percentage===100?'Tu lista está completa. Prepara tu entrada al mundo.':'Cada paso te acerca al siguiente capítulo.';
    section.classList.toggle('dl-preparation-complete',percentage===100);
  }
  function syncGuide(detail={}){
    const key=detail.guide||activeGuide();
    section.dataset.guide=key;
    $('#dl-current-guide').textContent=titles[key];
    positionIndicator();
    if(!detail.changed||reduced.matches)return;
    panelAnimations.forEach(animation=>animation.cancel());
    const panel=$(`#guide-${key}`);
    panelAnimations=[panel.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.2,.8,.2,1)'})];
    [...panel.querySelectorAll('.gl-install-step')].forEach((step,index)=>{
      panelAnimations.push(step.animate([{opacity:.15,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:330,delay:45+index*40,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}));
    });
  }
  addEventListener('glup:setup-progress',event=>updateProgress(event.detail));
  addEventListener('glup:guidechange',event=>syncGuide(event.detail));
  addEventListener('resize',positionIndicator,{passive:true});
  if('ResizeObserver' in window)new ResizeObserver(positionIndicator).observe(tabs);
  syncGuide();updateProgress();

  const portrait=$('.dl-hero-portrait');
  let frame;
  portrait?.addEventListener('pointermove',event=>{
    if(reduced.matches||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    cancelAnimationFrame(frame);
    const x=event.clientX,y=event.clientY;
    frame=requestAnimationFrame(()=>{
      const rect=portrait.getBoundingClientRect();
      portrait.style.setProperty('--portrait-y',`${((x-rect.left)/rect.width-.5)*7}deg`);
      portrait.style.setProperty('--portrait-x',`${(.5-(y-rect.top)/rect.height)*5}deg`);
    });
  });
  portrait?.addEventListener('pointerleave',()=>{
    cancelAnimationFrame(frame);portrait.style.setProperty('--portrait-x','0deg');portrait.style.setProperty('--portrait-y','0deg');
  });
  const embers=$('.dl-embers');
  if(embers&&!reduced.matches){
    for(let index=0;index<14;index++){
      const spark=document.createElement('i');spark.style.left=`${12+index*6.2}%`;spark.style.animationDelay=`${-index*1.27}s`;spark.style.animationDuration=`${11+index%5}s`;embers.append(spark);
    }
  }

  $$('.gl-download-faq details').forEach(detail=>{
    const summary=detail.querySelector('summary');
    let expanded=detail.open,animation,version=0;
    summary.addEventListener('click',event=>{
      if(reduced.matches){expanded=!detail.open;return;}
      event.preventDefault();
      expanded=!expanded;
      const thisVersion=++version;
      const start=detail.getBoundingClientRect().height;
      animation?.cancel();
      detail.open=true;
      const end=expanded?detail.scrollHeight+2:summary.getBoundingClientRect().height+2;
      detail.style.overflow='hidden';
      animation=detail.animate([{height:`${start}px`},{height:`${end}px`}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
      animation.finished.then(()=>{
        if(thisVersion!==version)return;
        detail.open=expanded;detail.style.overflow='';animation=null;
      }).catch(()=>{});
    });
  });
})();
