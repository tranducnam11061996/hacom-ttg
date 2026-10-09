const initialized=new WeakSet();
export function initComponentPicker(document=globalThis.document) {
 const dialog=document.querySelector('#component-picker');
 if(!dialog||initialized.has(dialog))return;
 initialized.add(dialog);
 const panels=[...dialog.querySelectorAll('[data-picker-group]')], toggle=dialog.querySelector('.bp-filter-toggle');
 let trigger, overflow, active=false;
 function restore(){
  if(dialog.open||!active)return;
  active=false;document.body.style.overflow=overflow;
  dialog.classList.remove('bp-filters-open');toggle.setAttribute('aria-expanded','false');trigger?.focus({preventScroll:true});
 }
 function close(){dialog.close();restore();}
 dialog.addEventListener('close',restore);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-picker-open]');
  if(!button)return;
  const panel=panels.find(p=>p.dataset.pickerGroup===button.dataset.pickerOpen);
  if(!panel)return;
  trigger=button;
  if(!active){overflow=document.body.style.overflow;active=true;}
  panels.forEach(p=>{p.hidden=p!==panel;p.reset();});
  dialog.querySelector('.bp-search').reset();
  dialog.querySelector('[data-demo-status]').hidden=true;
  dialog.classList.remove('bp-filters-open');toggle.setAttribute('aria-expanded','false');
  dialog.showModal();document.body.style.overflow='hidden';
  panel.querySelector('.bp-picker-list').scrollTop=0;panel.querySelector('.bp-filter-scroll').scrollTop=0;
  dialog.querySelector('input[type="search"]').focus({preventScroll:true});
 });
 dialog.querySelector('[data-picker-close]').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 toggle.addEventListener('click',()=>{const open=dialog.classList.toggle('bp-filters-open');toggle.setAttribute('aria-expanded',String(open));});
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const nodes=[...dialog.querySelectorAll('a[href],button,input,select')].filter(n=>!n.disabled&&n.checkVisibility({visibilityProperty:true}));
  const first=nodes[0],last=nodes.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 dialog.addEventListener('change',event=>{if(event.target.matches('input[type="checkbox"],select'))event.target.closest('form').querySelector('.bp-clear').click();});
}
