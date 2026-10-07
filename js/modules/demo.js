const initialized = new WeakSet();
export function initDemo(document = globalThis.document) {
  if (initialized.has(document)) return;
  const status = document.querySelector('#demo-status');
  if (!status) return;
  initialized.add(document);
  let toast;
  function demo(event) {
    event.preventDefault();
    status.textContent = 'Đây là giao diện demo. Chức năng mua hàng chưa được kết nối.';
    status.hidden = false;
    clearTimeout(toast);
    toast = setTimeout(() => { status.hidden = true; }, 4000);
  }
  document.addEventListener('click', event => {
    if (event.target.closest('a[href="#"], [data-demo]')) demo(event);
  });
  document.addEventListener('submit', event => {
    if (event.target.matches('form[data-demo-form]')) demo(event);
  });
}
