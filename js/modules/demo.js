const initialized = new WeakSet();
export function initDemo(document = globalThis.document) {
  if (initialized.has(document)) return;
  const status = document.querySelector('#demo-status');
  if (!status) return;
  initialized.add(document);
  let toast;
  function demo(event) {
    event.preventDefault();
    const target = document.querySelector('dialog[open] [data-demo-status]') || status;
    target.textContent = 'Đây là giao diện demo. Chức năng mua hàng chưa được kết nối.';
    target.hidden = false;
    clearTimeout(toast);
    toast = setTimeout(() => { target.hidden = true; }, 4000);
  }
  document.addEventListener('click', event => {
    if (event.target.closest('a[href="#"], [data-demo]')) demo(event);
  });
  document.addEventListener('submit', event => {
    if (event.target.matches('form[data-demo-form]')) demo(event);
  });
}
