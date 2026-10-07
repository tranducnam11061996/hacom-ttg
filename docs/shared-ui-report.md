# Báo cáo tách nền giao diện TTG — 07/10/2026

Đã tách nguồn dùng chung để các màn sản phẩm và tin tức sau này gọi layout/component ở bước build. Giữ HTML tĩnh, Tailwind CSS và JavaScript thuần, dữ liệu demo và giao diện hiện có. Chưa tạo bốn màn mới hoặc chức năng nghiệp vụ.

## Thay đổi

- Layout cửa hàng tại `scripts/templates/layouts/store.mjs`, sở hữu một main và một thông báo demo.
- Component header, menu, footer, product-card, service-benefits, commitment và playlist-cards nhận dữ liệu qua tham số. Không component nào tự đọc snapshot hoặc ghi file.
- Hero, sale, section danh mục và phần ghép trang chủ ở `scripts/templates/pages/home/`.
- Helper xử lý đường dẫn theo depth dùng cho ảnh, srcset, stylesheet, script và link local; giữ URL ngoài/anchor/query. Test depth 0/1/2 đã phát hiện và sửa một srcset hero chưa có tiền tố trang con.
- CSS chia theo trách nhiệm và vẫn xuất một `css/site.min.css`; giữ breakpoint, theme, font và hai loại container.
- JS chia module với initializer độc lập/idempotent; component vắng mặt không tạo observer/timer/listener. Entry chung `ui.js`, entry trang chủ `home.js`; timing carousel dùng chung qua motion.
- Demo chỉ chặn anchor `#`, `[data-demo]` và `form[data-demo-form]`.
- Trang chủ render playlist trực tiếp; video build không đọc/sửa `index.html` nữa. Các trang video giữ header riêng và player nguồn hiện có.
- Registry public dùng chung cho trang đầu ra, preview, check và HTTP; đo tổng JavaScript theo đồ thị import của từng trang. Preview chỉ phục vụ file public và module JS, chặn nguồn/snapshot/docs/tests/cache.

## Kết quả kiểm tra

| Hạng mục | Kết quả |
|---|---|
| Build tổng | Đạt |
| Node tests | 28/28 đạt; gọi lặp initializer trong các event harness |
| Nội dung cửa hàng | 171 vị trí sản phẩm, 7 nhóm danh mục, 6 nhóm sale |
| Trang xuất | 6 trang hiện có |
| Tài nguyên local/ID/dữ liệu | 0 lỗi |
| HTTP | 165 file public đạt status, nội dung, MIME và gzip phù hợp |
| File nguồn/private | 6 URL được kiểm tra đều trả 404 |
| Layout depth 0/1/2 | Header/menu/footer/main/status và mọi đường dẫn ảnh/srcset/CSS/JS đúng |
| Build lặp | SHA-256 của HTML/CSS không đổi |
| Build video độc lập | Homepage không đổi |
| Build store độc lập | Homepage giữ đủ playlist, giống build tổng |
| CSS | 45.651 byte raw, 9.774 byte gzip; dưới 70 KiB |
| Tổng own JS trang chủ | 8.420 byte gzip (8,22 KiB), tính từng module import một lần; dưới 20 KiB |

Tests tương tác hiện gọi API xuất của ES module đầy đủ qua Node VM Modules, không cắt source bằng marker. Lệnh test bật cờ experimental; cảnh báo Node về VM Modules không phải lỗi runtime.

## Browser

Dùng Chrome DevTools với profile riêng, preview cổng 4174 để không can thiệp phiên preview 4173 đang có.

- Đối chiếu DOM/CSS gốc còn được tải trong browser với bản refactor ở 360, 390, 768, 1280, 1440 và 1920 px. Mỗi kích thước so sánh 190 phần tử về vị trí/kích thước, font, line-height, padding, margin và display sau khi font tải và layout ổn định. Không có sai lệch lớn hơn 1 px; không overflow toàn trang.
- Đối chiếu menu mở/mega panel và header compact ở 390, 1280 và 1920 px: số đo giống nhau, không overflow.
- Kiểm tra trực tiếp mouse hover, Escape trả focus, touch mở menu và danh mục con, submit tìm kiếm chỉ hiện thông báo demo, header thu gọn khi cuộn.
- Homepage không có iframe. Trang video index giữ 4 thẻ và header riêng. Chọn tập thứ hai cập nhật tiêu đề/URL, chưa tạo iframe trước khi phát; bấm phát tải API, tạo iframe và báo “Trình phát đã sẵn sàng.” Link YouTube dự phòng giữ đúng video/playlist. Sau kiểm tra đã gửi lệnh dừng player.
- Console trang chủ, video index và playlist được kiểm tra không có error/warn.

Số đo: `shared-ui-responsive.json`, `shared-ui-menu-compact.json`. Hash build: `shared-ui-build-validation.json`. HTTP: `http-validation.json`. Metrics: `validation.json`. Ảnh: `screenshots/shared-ui/desktop-1920.jpg`, `mobile-390.jpg`, `footer-390.jpg`.

## Bàn giao và giới hạn

Hướng dẫn API và thêm màn: `shared-ui-guide.md`. Kế hoạch đã thực hiện: `superpowers/plans/2026-10-07-shared-ui.md`. Upload toàn bộ thư mục JS, bao gồm `js/modules/`, cùng các file public như README mô tả. Khởi động lại preview sau khi thêm trang/file public vì whitelist được đọc khi server khởi động.

Không thay snapshot hoặc thu thập lại nguồn trực tuyến. Không thêm framework, dependency, bộ lọc, phân trang, gallery, giỏ hàng hoặc API. Không đo lại Lighthouse/Core Web Vitals trong đợt refactor này; đối chiếu số đo không thay thế pixel-diff của mọi trạng thái animation.
