const initialized = new WeakSet();
export function initSaleTabs(document = globalThis.document, categoryControllers = new Map()) {
  document.querySelectorAll('[data-sale] [role="tablist"]').forEach(list=>{
    if (initialized.has(list)) return;
    initialized.add(list);
    const tabs=[...list.querySelectorAll('[role="tab"]')];
    const sale=list.closest('[data-sale]'), toggle=sale?.querySelector('[data-sale-toggle]');
    function picker(value,focus=false){list.hidden=!value;toggle?.setAttribute('aria-expanded',String(value));if(focus)(value?tabs.find(t=>t.getAttribute('aria-selected')==='true'):toggle)?.focus();}
    function activate(tab,commit=false){
      tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;
        const panel=document.getElementById(t.getAttribute('aria-controls'));panel.hidden=!selected;
        const rail=panel.querySelector('[data-category-carousel]');if(rail){const controller=categoryControllers.get(rail);if(selected)controller?.reset();else controller?.stop();}
      });
      if(toggle)toggle.setAttribute('aria-label','Chọn nhóm: '+tab.textContent.trim());
      if(commit&&sale)picker(false,true);
    }
    toggle?.addEventListener('click',()=>picker(list.hidden,true));
    sale?.addEventListener('keydown',e=>{if(e.key==='Escape'&&!list.hidden){e.preventDefault();picker(false,true);}});
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>activate(tab,true));
      tab.addEventListener('keydown',e=>{
        const delta=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
        const next=delta?tabs[(i+delta+tabs.length)%tabs.length]:e.key==='Home'?tabs[0]:e.key==='End'?tabs.at(-1):null;
        if(next){e.preventDefault();activate(next);next.focus();}
      });
    });
  });
}
