import {esc} from '../../../html.mjs';
import {createImage} from '../../utils/assets.mjs';
import {formatMoney} from '../../utils/money.mjs';
import {cartIcon} from '../cart/icons.mjs';
export function buildSelectedItem(item,{assets,context={},groupId}) {
 const image=createImage(assets,context);
 return `<article class="bp-item" data-build-item="${esc(item.id)}"><a href="#" class="bp-image">${image(item.image,item.name,'',true)}</a><div class="bp-item-text"><div class="bp-item-left"><a href="#" class="bp-item-name">${esc(item.name)}</a><p>- Kho hàng: <b class="${item.stock==='Hết hàng'?'bp-empty':'bp-stock'}">${esc(item.stock)}</b></p>${item.warranty?`<p>- Bảo hành: <b class="bp-warranty">${esc(item.warranty)}</b></p>`:''}</div><div class="bp-item-right"><div class="bp-equation"><b>${formatMoney(item.price)} VNĐ</b><span class="bp-multiply">x</span><span class="bp-quantity"><button type="button" data-demo aria-label="Giảm số lượng ${esc(item.name)}">−</button><input value="${item.quantity}" readonly aria-label="Số lượng ${esc(item.name)}"><button type="button" data-demo aria-label="Tăng số lượng ${esc(item.name)}">+</button></span><span class="bp-equals">=</span><b class="bp-price">${formatMoney(item.price*item.quantity)} VNĐ</b></div><div class="bp-item-actions"><button type="button" data-picker-open="${esc(groupId)}" aria-haspopup="dialog" aria-controls="component-picker" aria-label="Thay đổi ${esc(item.name)}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m17 2 5 5-12 12-6 1 1-6zm-1 4L7 15l-1 3 3-1 9-9z"/></svg></button><button type="button" data-demo aria-label="Xóa ${esc(item.name)}">${cartIcon('trash')}</button></div></div></div></article>`;
}
export function buildComponentGroup(group,{assets,context={},index=0}) {
 return `<section class="bp-group" data-build-group="${esc(group.id)}"><h2>${index+1}. ${esc(group.name)}</h2><div class="bp-group-content">${group.items.map(item=>buildSelectedItem(item,{assets,context,groupId:group.id})).join('')}${!group.items.length||group.multiple?`<div class="bp-choose-row"><button type="button" data-picker-open="${esc(group.id)}" aria-haspopup="dialog" aria-controls="component-picker">+ ${group.items.length?'Chọn Thêm':'Chọn '+esc(group.name)}</button></div>`:''}</div></section>`;
}
export function buildActions() {
 return `<div class="bp-actions">${[['Tải ảnh cấu hình','▧'],['Tải file Excel cấu hình','excel'],['Xem & In','print'],['Thêm vào giỏ hàng','+']].map(([label,icon],i)=>`<button type="button" data-demo class="${i===3?'bp-red':''}">${esc(label)} ${['excel','print'].includes(icon)?cartIcon(icon):`<span aria-hidden="true">${icon}</span>`}</button>`).join('')}</div>`;
}
export function buildConfiguration({groups,assets,context={}}) {
 const total=groups.reduce((n,g)=>n+g.items.reduce((v,p)=>v+p.price*p.quantity,0),0);
 const summary=`<p class="bp-summary"><span class="bp-summary-label">Chi phí dự tính:</span> <span data-build-total>${formatMoney(total)} đ</span></p>`;
 return `<div class="bp-panel"><h1>Chọn linh kiện xây dựng cấu hình</h1><div class="bp-top-actions"><button type="button" data-demo class="bp-reset">Làm mới <span aria-hidden="true">↶</span></button>${summary}</div><div class="bp-groups">${groups.map((g,index)=>buildComponentGroup(g,{assets,context,index})).join('')}</div>${summary}${buildActions()}</div>`;
}
