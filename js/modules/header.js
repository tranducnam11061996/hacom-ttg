const initialized = new WeakSet();
export function initHeader(document = globalThis.document) {
  const header = document.querySelector('[data-header]');
  if (header && !initialized.has(header)) {
    initialized.add(header);
    const space = document.querySelector('[data-header-space]');
    const desktop = matchMedia('(min-width:1280px)');
    const hoverInput = matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const root = header.querySelector('[data-menu-root]');
    const toggle = root.querySelector('[data-menu-toggle]');
    const content = root.querySelector('[data-menu-content]');
    const items = [...root.querySelectorAll('[data-menu-item]')];
    const panels = [...root.querySelectorAll('[data-mega-panel]')];
    let closing = false, keyboardMenu = false, pointerPosition = null, pointerFocus = false;
    const canHover = event => hoverInput.matches && ['mouse','pen'].includes(event.pointerType);
    function select(index) {
      items.forEach(item => {
        const active = item.dataset.menuItem === String(index);
        item.classList.toggle('is-active',active);
        const expanded = active && panels.some(panel=>panel.dataset.megaPanel===String(index));
        [item.querySelector(':scope > a[aria-expanded]'),item.querySelector('[data-menu-accordion]')]
          .filter(Boolean).forEach(el=>el.setAttribute('aria-expanded',String(expanded)));
      });
      panels.forEach(panel=>panel.hidden=panel.dataset.megaPanel!==String(index));
    }
    function availableHeight() {
      if(desktop.matches){root.style.removeProperty('--menu-height');return;}
      const top=content.hidden ? toggle.getBoundingClientRect().bottom+12 : content.getBoundingClientRect().top;
      root.style.setProperty('--menu-height',`${Math.max(100,window.innerHeight-top-12)}px`);
    }
    function open() { if(closing)return;content.hidden=false;toggle.setAttribute('aria-expanded','true');availableHeight(); }
    function close(returnFocus=false) {
      closing=true;content.hidden=true;toggle.setAttribute('aria-expanded','false');select(-1);
      if(returnFocus)toggle.focus();closing=false;
    }
    toggle.addEventListener('click',event=>{
      if(event.detail!==0 && canHover(event))open();
      else if(content.hidden)open();else close();
    });
    root.addEventListener('pointerdown',()=>{pointerFocus=true;});
    document.addEventListener('keydown',()=>{pointerFocus=false;});
    root.addEventListener('pointerenter',event=>{
      pointerPosition=[event.clientX,event.clientY];
      if(canHover(event)){keyboardMenu=false;open();}
    });
    root.addEventListener('pointerleave',event=>{if(canHover(event)&&!root.contains(document.activeElement))close();});
    root.addEventListener('focusin',event=>{if(event.target===toggle&&desktop.matches&&!pointerFocus)open();});
    root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget))close();});
    root.addEventListener('keydown',()=>{keyboardMenu=true;});
    root.addEventListener('pointermove',event=>{
      if(canHover(event)&&pointerPosition&&(event.clientX!==pointerPosition[0]||event.clientY!==pointerPosition[1])){
        keyboardMenu=false;
        const item=event.target.closest('[data-menu-item]');
        if(!content.hidden&&item)select(item.dataset.menuItem);
      }
      pointerPosition=[event.clientX,event.clientY];
    });
    items.forEach(item=>{
      const index=item.dataset.menuItem;
      item.addEventListener('pointerenter',event=>{if(canHover(event)&&!content.hidden&&!keyboardMenu)select(index);});
      item.querySelector('a').addEventListener('focus',()=>{if(!pointerFocus){keyboardMenu=true;if(!content.hidden)select(index);}});
      item.querySelector('[data-menu-accordion]')?.addEventListener('click',()=>{
        const panel=panels.find(p=>p.dataset.megaPanel===index);
        select(panel.hidden?index:-1);
      });
    });
    desktop.addEventListener('change',()=>close());
    hoverInput.addEventListener('change',()=>close());
    root.querySelectorAll('[data-group-toggle]').forEach(button=>{
      const children=document.getElementById(button.getAttribute('aria-controls'));
      button.addEventListener('click',()=>{
        children.hidden=!children.hidden;
        button.setAttribute('aria-expanded',String(!children.hidden));
      });
      desktop.addEventListener('change',()=>{
        if(desktop.matches){children.hidden=false;button.setAttribute('aria-expanded','true');}
      });
    });
    const supports=[...header.querySelectorAll('[data-support]')];
    supports.forEach(group=>{
      const button=group.querySelector('button'),panel=group.querySelector('.ttg-support-panel');
      const state=value=>{panel.hidden=!value;button.setAttribute('aria-expanded',String(value));};
      button.addEventListener('click',()=>state(desktop.matches||panel.hidden));
      group.addEventListener('pointerenter',e=>{if(desktop.matches&&e.pointerType!=='touch')state(true);});
      group.addEventListener('pointerleave',()=>{if(!group.contains(document.activeElement))state(false);});
      group.addEventListener('focusin',()=>{if(desktop.matches&&!closing)state(true);});
      group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget))state(false);});
      group.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();closing=true;state(false);button.focus();closing=false;}});
    });
    document.addEventListener('click',e=>{
      if(!root.contains(e.target))close();
      supports.forEach(group=>{if(!group.contains(e.target)){group.querySelector('.ttg-support-panel').hidden=true;group.querySelector('button').setAttribute('aria-expanded','false');}});
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!content.hidden){e.preventDefault();close(true);}});
    function measureHeader() {
      const compact=header.classList.contains('is-compact');
      header.classList.remove('is-compact');
      const height=header.getBoundingClientRect().height;
      space.style.height=`${height}px`;
      root.style.setProperty('--header-content-width',`${header.querySelector('.ttg-header-inner').getBoundingClientRect().width-20}px`);
      header.classList.toggle('is-compact',compact);
      availableHeight();
    }
    function scrolled() {
      const compact=window.scrollY>500;
      if(compact!==header.classList.contains('is-compact')){header.classList.toggle('is-compact',compact);close();}
      if(!content.hidden)availableHeight();
    }
    window.addEventListener('scroll',scrolled,{passive:true});
    window.addEventListener('resize',()=>{measureHeader();close();});
    new ResizeObserver(measureHeader).observe(header);
    const pauseGradient=()=>header.classList.toggle('motion-paused',document.hidden);
    document.addEventListener('visibilitychange',pauseGradient);
    measureHeader();scrolled();pauseGradient();
  }
}
