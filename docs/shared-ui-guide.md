# Nền giao diện dùng chung

Nguồn component được gọi bằng JavaScript tại bước build. HTML xuất ra đã chứa đầy đủ header, menu, nội dung và footer; trình duyệt không tải partial bằng fetch. Chỉnh template rồi build lại để cập nhật mọi màn sử dụng nó. Không sửa HTML đã xuất nếu muốn giữ thay đổi qua lần build sau.

## Cấu trúc nguồn

| Nhóm | Trách nhiệm |
|---|---|
| `scripts/html.mjs` | Document HTML, metadata demo, escape, SVG icon |
| `scripts/templates/utils/paths.mjs` | Đường dẫn public theo độ sâu trang |
| `scripts/templates/utils/assets.mjs` | Ảnh local có kích thước/srcset, làm sạch HTML snapshot |
| `scripts/templates/layouts/store.mjs` | Header → một main → footer → một thông báo demo |
| `scripts/templates/components/` | Header, menu, footer, product-card, service-benefits, commitment, playlist-cards, header-icons |
| `scripts/templates/pages/home/` | Hero, sale, section danh mục, playlist và ghép nội dung trang chủ |
| `scripts/public.mjs` | Đăng ký các trang đầu ra; danh sách public cho preview/HTTP/check; đồ thị import JS |
| `js/ui.js` | Khởi tạo demo, header/menu, carousel và commitment khi chúng hiện diện |
| `js/home.js` | Thêm hero và sale-tabs cho trang chủ |
| `js/modules/` | Bộ khởi tạo tương tác độc lập, gọi lặp không gắn thêm listener |

Component nhận dữ liệu từ tham số, không tự đọc snapshot, gọi mạng hoặc ghi file. `storeData` và `headerData` được truyền cho layout bởi script build. Mọi trang dùng layout này phải cung cấp H1 trong `content`; layout sở hữu `<main id="main">`, không truyền thêm main.

## Các interface

```js
storeLayout({
  title, description, content, storeData, headerData,
  context: { depth: 0 },
  mainClass: 'site-container py-6', // mặc định
  pageScript: 'ui',                // mặc định; trang chủ dùng 'home'
});
header({ headerData, searchCategories, logo, context }); // logo là markup ảnh từ createImage
menu({ categories, shortcuts, context });
footer({ footerHtml, assets, context });
productCard(product, { assets, overlays, context });
serviceBenefits(features);
commitment(questions);
playlistCards(playlists, { context });
```

`storeData` dùng snapshot cửa hàng hiện tại, cung cấp `assets`, `searchCategories` và `footer`; `headerData` dùng snapshot header hiện tại. Không chuyển đổi hoặc nhân bản dữ liệu snapshot trong từng màn.

`context.depth` là số thư mục tính từ root hosting đến file HTML: root = 0, `products/index.html` = 1, `products/detail/example.html` = 2. `assetUrl('image/...', context)` thêm tiền tố tương ứng. URL ngoài, URL dạng `//`, anchor và query được giữ nguyên. Không dùng đường dẫn bắt đầu `/` trong template để website vẫn chạy được dưới thư mục con của hosting.

## Thêm màn sản phẩm hoặc tin tức sau này

1. Tạo template nội dung riêng trong `scripts/templates/pages/`. Gọi component chung trực tiếp; không sao chép header/menu/footer. Dịch vụ và cam kết chỉ gọi khi thiết kế màn đó yêu cầu.
2. Script build đọc các snapshot cần dùng, render nội dung, gọi layout và ghi file đầu ra. Ví dụ sau chỉ minh họa cách gọi, chưa tạo trang sản phẩm trong đợt refactor này:

```js
import fs from 'node:fs/promises';
import { storeLayout } from './templates/layouts/store.mjs';
import { productCard } from './templates/components/product-card.mjs';

const storeData = JSON.parse(await fs.readFile('data/store.snapshot.json', 'utf8'));
const headerData = JSON.parse(await fs.readFile('data/header.snapshot.json', 'utf8'));
const context = { depth: 1 };
const cards = storeData.categories[0].products.map(product =>
  productCard(product, { assets: storeData.assets, overlays: storeData.overlays, context })
).join('');
const html = storeLayout({
  title: 'Danh mục sản phẩm — Demo', description: 'Giao diện danh mục demo.',
  content: `<h1>Danh mục sản phẩm</h1><div class="grid grid-cols-2 gap-4">${cards}</div>`,
  storeData, headerData, context,
});
await fs.mkdir('products', { recursive: true });
await fs.writeFile('products/index.html', html);
```

3. Đăng ký `{ file: 'products/index.html', depth: 1 }` trong `storePages` của `scripts/public.mjs`; thêm script build màn đó vào pipeline trước `build:css`. Registry được dùng chung bởi check, HTTP và preview. Khởi động lại preview sau khi thêm trang hoặc file public mới.
4. Viết class Tailwind đầy đủ dưới dạng literal trong template; entry CSS đã quét `scripts/templates/**/*.mjs` và `js/**/*.js`. Nếu giữ markup ngoài các vị trí này, thêm `@source` tương ứng. CSS nguồn theo component được import vào `css/tailwind.input.css`, vẫn chỉ phát hành `css/site.min.css`.
5. Chạy build, test, check và HTTP; kiểm tra desktop/mobile, ID/ARIA, link local và console. Mọi button nghiệp vụ đánh dấu `data-demo`; form demo dùng `data-demo-form`. Form không được đánh dấu không bị bộ demo chặn.

Không thêm lọc/sắp xếp/tìm kiếm thật, giỏ hàng, tài khoản, mua hàng, API hoặc storage trong giai đoạn demo. Các đường dẫn cửa hàng hiện tại tiếp tục `href="#"`; chỉ thêm liên kết đến màn demo sau khi màn đó thực sự tồn tại.

## Build và kiểm tra

`npm run build:store` xuất trang chủ hoàn chỉnh, bao gồm playlist. `npm run build:videos` chỉ xuất video, không đọc/sửa trang chủ. `npm run build` chạy cả hai rồi build CSS. Player video được giữ nguyên.

```powershell
npm run build
npm test
npm run check
npm run serve
# Trong terminal khác:
npm run check:http
```

Preview mặc định cổng 4173; có thể đặt `$env:PORT='4174'` để chạy phiên riêng. HTTP checker dùng `$env:PREVIEW_URL='http://127.0.0.1:4174'` nếu đổi cổng. Preview chỉ phục vụ danh sách public, chặn snapshot, template, tests, docs, cache và CSS nguồn.

Test tương tác dùng ES module đầy đủ với Node VM Modules; `npm test` bật `--experimental-vm-modules`. Node có thể in ExperimentalWarning; đây là cơ chế của test, không phải lỗi browser/runtime. Không cần thư viện trình duyệt mới.

Khi upload hosting, tải `index.html`, `videos/`, `image/`, `fonts/`, toàn bộ `js/` (kể cả `modules/`) và `css/site.min.css`. Giữ cấu trúc thư mục; không upload nguồn build hoặc snapshot.

## Chi tiết và sản phẩm tương tự

Màn chi tiết mới là ví dụ đầy đủ tại `scripts/build-product.mjs` và `scripts/templates/pages/product/index.mjs`. Các component trong `components/product/` nhận snapshot và context, không đọc file hay gọi mạng. Section tương tự dùng thẻ mặc định hiện có:

```js
import { similarProducts } from './components/similar-products.mjs';
const related = similarProducts({
  products: productData.similarProducts,
  assets: productData.assets, overlays: productData.overlays, context,
  id: 'related-products-title', title: 'SẢN PHẨM TƯƠNG TỰ',
  allHref: assetUrl('pc/index.html', context),
});
```

Mỗi instance cấp id riêng. Rail hiện là demo tĩnh có native overflow; không gắn `data-category-carousel` nếu chưa được yêu cầu tương tác. `productCard` hỗ trợ `href` tùy chọn; mặc định gọi `productHref` để chỉ liên kết đến sản phẩm đã có màn local. `fragment.mjs` chuyển ảnh đã làm sạch sang đường dẫn local theo depth; không đưa HTML nghiệp vụ chưa làm sạch vào component.

Pipeline hiện gồm store/category/product/videos/CSS. Khi phát hành thêm `pc/` và `pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc/`. Browser verification bắt buộc theo rule toàn cục: Chrome DevTools MCP qua launcher quản lý profile riêng.

## Giỏ hàng và liên hệ nổi

Pipeline đã có bước cart trước videos/CSS; phát hành thêm `cart/`. `cartContent({cartData,storeData,contactData,context})` ghép component trong `components/cart/`: cartItemRow, cartItems, buyerInformation, cartSummary, cartActions. Component nhận dữ liệu qua tham số; tổng tính tại build. `storeLayout` và `header` nhận `cartCount` tùy chọn; bỏ qua thì badge ẩn. Liên kết cart/index.html dùng context.depth.

`floatingContact({contacts,assets,context})` dùng chung với chi tiết sản phẩm; hai nút dùng data-demo. Form giỏ dùng data-demo-form và novalidate để submit luôn hiện toast. Không thêm name hoặc endpoint gửi đơn vào form demo.

## Build PC

Pipeline có `build:buildpc` trước videos/CSS, xuất `buildpc/index.html`. `buildpcContent({buildData,storeData,contactData,context})` ghép component cấu hình và picker trong `components/buildpc/`. Các component nhận dữ liệu; `buildComponentGroup` hỗ trợ items rỗng. `formatMoney` trong `utils/money.mjs` dùng chung với cart.

Entry `js/buildpc.js` nạp UI chung và quản lý popup trình bày. Dùng native dialog, reset form mỗi lần mở, giữ focus trong popup và trả focus khi đóng. Nội dung demo trong dialog dùng `[data-demo-status]` để toast xuất hiện trong lớp modal; các màn khác tiếp tục dùng `#demo-status`. Header Build PC dùng context.depth và giữ badge mặc định nếu không truyền cartCount.
