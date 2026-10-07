import { carouselEase } from "./motion.js";
const initialized = new WeakSet();
export function initHero(document = globalThis.document) {
  document.querySelectorAll('[data-hero]').forEach(hero=>{
    if (initialized.has(hero)) return;
    initialized.add(hero);
    const track=hero.querySelector('[data-hero-track]');
    const slides=[...track.children],pause=hero.querySelector('[data-hero-pause]');
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    let timer=0,frame=0,settle=0,step=0,index=0,visible=false,hovered=false,focused=false,paused=false;
    let drag=null,suppressClick=false,programmaticUntil=0;
    function stop(){clearTimeout(timer);timer=0;}
    function cancel(){stop();cancelAnimationFrame(frame);frame=0;track.style.removeProperty('scroll-snap-type');}
    function prepare(next){const img=slides[next]?.querySelector('img');if(img)img.loading='eager';}
    function selected(next){
      index=next;slides.forEach((slide,i)=>{slide.tabIndex=i===index?0:-1;slide.setAttribute('aria-current',i===index?'true':'false');});
      prepare((index+1)%slides.length);
    }
    function schedule(){
      stop();
      if(visible&&!hovered&&!focused&&!paused&&!drag&&!document.hidden&&!motion.matches&&!frame&&slides.length>1)
        timer=setTimeout(()=>move(index+1),3500);
    }
    function move(next){
      cancel();clearTimeout(settle);next=(next+slides.length)%slides.length;prepare(next);
      const from=track.scrollLeft,target=next*step;selected(next);
      if(motion.matches||Math.abs(target-from)<1){track.scrollLeft=target;programmaticUntil=performance.now()+80;schedule();return;}
      track.style.scrollSnapType='none';const started=performance.now();
      function tick(now){const p=Math.min(1,(now-started)/1000);track.scrollLeft=from+(target-from)*carouselEase(p);
        if(p<1)frame=requestAnimationFrame(tick);
        else{frame=0;track.scrollLeft=target;track.style.removeProperty('scroll-snap-type');programmaticUntil=now+80;schedule();}
      }
      frame=requestAnimationFrame(tick);
    }
    function measure(){cancel();clearTimeout(settle);step=track.clientWidth+10;selected(index);programmaticUntil=performance.now()+80;track.scrollLeft=index*step;schedule();}
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else cancel();},{threshold:.01});observer.observe(hero);
    new ResizeObserver(measure).observe(track);
    hero.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovered=true;stop();}});
    hero.addEventListener('pointerleave',()=>{hovered=false;schedule();});
    hero.addEventListener('focusin',()=>{focused=true;stop();});
    hero.addEventListener('focusout',e=>{focused=hero.contains(e.relatedTarget);schedule();});
    pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Tiếp tục trình chiếu':'Dừng trình chiếu';schedule();});
    hero.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(index+(e.key==='ArrowRight'?1:-1));}
    });
    track.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;cancel();clearTimeout(settle);drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:track.scrollLeft,moved:false};
    });
    track.addEventListener('pointermove',e=>{
      if(!drag||drag.id!==e.pointerId)return;
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(!drag.moved&&Math.abs(dx)>6&&Math.abs(dx)>Math.abs(dy)){drag.moved=true;track.setPointerCapture(e.pointerId);track.style.scrollSnapType='none';}
      if(drag.moved){e.preventDefault();track.scrollLeft=drag.left-dx;}
    });
    function release(e){if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;
      if(moved){suppressClick=true;setTimeout(()=>suppressClick=false,100);move(Math.round(track.scrollLeft/step));}else schedule();
    }
    window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
    track.addEventListener('dragstart',e=>e.preventDefault());
    hero.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation();suppressClick=false;}},true);
    track.addEventListener('scroll',()=>{
      if(frame||drag||performance.now()<=programmaticUntil)return;
      stop();clearTimeout(settle);settle=setTimeout(()=>{selected(Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/step))));schedule();},200);
    },{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();else schedule();});
    motion.addEventListener('change',()=>{cancel();move(index);});
    measure();
  });
}
