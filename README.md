# TTG — HTML + Tailwind CSS

Website tĩnh giữ nội dung cửa hàng từ bản HTML đã lưu, gồm **171 vị trí thẻ sản phẩm**, 7 nhóm sản phẩm và 6 nhóm khuyến mãi. Cửa hàng là demo. YouTube hoạt động thật với 4 playlist và 82 tập công khai đã lấy ngày 07/10/2026.

## Chạy bản đã build

```powershell
npm ci
npm run serve
```

Mở http://127.0.0.1:4173. Server preview chỉ phục vụ file public, có gzip cho HTML/CSS/JS. Có thể dùng Laragon, Apache hoặc hosting tĩnh; không cần PHP, MySQL, API key. Chạy qua HTTP để module JavaScript và YouTube nhận đúng origin/referrer. Không mở bằng file://.

## Chỉnh sửa và build

```powershell
npm run build
npm run dev:css
npm run build:videos
npm run check
npm test
```

- Nội dung cửa hàng: `data/store.snapshot.json`; điều phối build: `scripts/build-store.mjs`; template trang chủ: `scripts/templates/pages/home/`.
- Layout cửa hàng: `scripts/templates/layouts/store.mjs`; các component dùng chung (header, menu, footer, thẻ sản phẩm, dịch vụ, cam kết, playlist): `scripts/templates/components/`. Snapshot header giữ 16 danh mục, 7 panel, banner, thương hiệu và nội dung hỗ trợ trong `data/header.snapshot.json`.
- Dữ liệu playlist: `data/youtube.snapshot.json`; template: `scripts/build-videos.mjs`.
- CSS entry: `css/tailwind.input.css`; nguồn chia thành base, font, header, menu, footer, product-card, carousel, support và home. CSS chạy thật vẫn là một file `css/site.min.css`.
- Tương tác chung: `js/ui.js`, các bộ khởi tạo trong `js/modules/`; trang chủ: `js/home.js`; player giữ nguyên trong `js/video.js`, `js/video-state.js`. Khi phát hành phải tải toàn bộ thư mục `js/`, bao gồm `js/modules/`.
- `npm run build` xuất lại HTML từ snapshot rồi build CSS. Sửa trực tiếp HTML sẽ bị ghi đè bởi lệnh build đầy đủ; nếu sửa HTML trực tiếp, dùng `npm run build:css`.
- Tailwind CLI 4.3.0 khóa trong lockfile; override watcher 2.6.0 loại dependency braces có cảnh báo bảo mật. Không dùng Tailwind CDN runtime.

Build không thu thập lại YouTube, không gọi mạng và không chạy `prepare-assets.mjs`. Script đó chỉ dành cho lần di chuyển ban đầu khi còn bản HTML gốc và include. Snapshot phải được cập nhật thủ công từ đúng playlist công khai nếu muốn thay dữ liệu.

`node scripts/collect-header.mjs` là công cụ thu thập header **chạy riêng khi muốn cập nhật nguồn**. Nó cần Internet, đọc trang TTG và bảy endpoint thương hiệu công khai, lưu ảnh local theo hash và cập nhật snapshot/assets-map. Lệnh build thông thường hoàn toàn không gọi công cụ này. Khi cập nhật snapshot, chạy lại `npm run build` và kiểm tra giao diện.

Header desktop thu gọn sau 500 px, giữ placeholder đo từ header đầy đủ. Menu mở bằng hover/focus, Escape trả focus về nút; mobile dùng accordion. Hero giữ 9 banner chính và 3 banner phụ, không có mũi tên/chấm, chuyển sau 3,5 giây trong 1 giây. Có thể kéo/vuốt hoặc dùng phím trái/phải; nút dừng xuất hiện khi focus bằng bàn phím. Autoplay dừng khi tương tác, ngoài viewport, tab ẩn hoặc giảm chuyển động.

Xem `docs/header-implementation-report.md`, các bảng đo JSON và ảnh trong `docs/screenshots/` cho phần header/mega menu/hero.

## Phát hành

Chỉ tải `index.html`, `videos/`, `image/`, `fonts/`, `js/` và `css/site.min.css` lên hosting. Bảo toàn cấu trúc đường dẫn. Không phát hành node_modules, .cache, scripts, tests, snapshot hoặc bản backup. Hosting phải gửi MIME đúng cho `.js`, `.css`, `.woff2`, `.webp`; nên bật gzip/Brotli và giữ referrer cho YouTube. Không áp dụng Referrer-Policy: no-referrer.

Ảnh YouTube và trình phát cần Internet. Homepage không tạo iframe hay tải IFrame API. Player chỉ được tạo khi bấm Phát video; luôn có liên kết xem trên YouTube khi nhúng bị chặn. ID trong URL chỉ chọn được tập thuộc snapshot hiện tại. Tập ngoài snapshot được chọn từ player đầy đủ hiển thị nhãn chung, không gán sai tiêu đề.

## Hạn chế và phục hồi

- Vlog: playlist ghi 23 video, DOM công khai chỉ cung cấp 20 khi đã cuộn cuối trang; không bổ sung tập giả.
- Daily Moment: chi tiết playlist ghi 2.443; trang danh sách kênh ghi 2.444. Dùng số trang chi tiết và lấy 30 tập đầu.
- Đã kiểm tra responsive và tương tác bằng Browser trong Codex. Chưa đo Lighthouse/Core Web Vitals; không coi ngưỡng Performance/CLS trong spec là kết quả đã đạt.
- Liên kết cửa hàng, tài khoản, mua hàng và tìm kiếm chỉ thông báo demo; không gửi request hoặc cập nhật giỏ.
- Backup nguyên trạng: `D:\hacom-ttg-original-2026-10-07.zip`, nằm ngoài thư mục phát hành.
- Thư mục include cũ được chuyển nguyên trạng sang `D:\hacom-ttg-original-assets-2026-10-07`; không còn nằm trong website. Kiểm soát tự động chặn xóa đệ quy nên giữ thư mục ngoài root để phục hồi.

Xem `docs/implementation-report.md`, `docs/assets-report.md`, `docs/validation.json` và `data/assets-map.json` để đối chiếu.

## Section danh mục

Bảy section danh mục dùng template `scripts/templates/pages/home/categories.mjs` và component `scripts/templates/components/product-card.mjs`; CSS nằm trong `css/home.input.css`, `css/product-card.input.css`, `css/carousel.input.css`; bộ điều khiển trong `js/modules/carousel.js`. Dữ liệu sản phẩm giữ từ snapshot; PC GAMING có năm danh mục con. Carousel chuyển từng thẻ, tự chạy sau 3,5 giây, chuyển động 1 giây; dừng khi hover, focus, thao tác cuộn, ngoài viewport hoặc tab bị ẩn. Chế độ giảm chuyển động tắt autoplay. Bố cục hiển thị 2/3/5/6 thẻ theo breakpoint 768/1280/1620 px.

Chạy `npm run build`, `npm run check`, `npm test` để dựng và kiểm tra lại. Báo cáo đối chiếu: `docs/category-report.md`; ảnh kiểm tra: `docs/screenshots/`.

## Tái sử dụng giao diện cho các màn mới

Xem `docs/shared-ui-guide.md` để gọi layout/component, xử lý đường dẫn trang con và đăng ký trang đầu ra. `npm run build:store` nay xuất trang chủ đầy đủ cả playlist; `npm run build:videos` chỉ xuất video và không sửa trang chủ. `npm run check:http` kiểm tra file public, MIME, gzip và chặn file nguồn khi preview đang chạy.

Báo cáo đợt tách nguồn: `docs/shared-ui-report.md`; kế hoạch đã chốt: `docs/superpowers/plans/2026-10-07-shared-ui.md`. Các màn sản phẩm/tin tức chưa được dựng trong đợt này; cửa hàng vẫn là giao diện demo, video giữ chức năng hiện có.
