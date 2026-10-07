# Header, mega menu và hero — bàn giao 07/10/2026

Đã cập nhật `index.html` thông qua nguồn sinh trang. Nguồn đối chiếu: https://ttgshop.vn/ và CSS công khai của trang. Không thay dữ liệu sản phẩm hoặc playlist YouTube.

## Mã nguồn và dữ liệu

- `scripts/header.mjs`: template HTML cho header, menu và hero, được gọi từ `scripts/build-store.mjs`.
- `data/header.snapshot.json`: thời điểm thu thập, 16 danh mục, 7 panel, đầy đủ nhóm và mục con, nội dung showroom/bán hàng, 6 shortcut, 4 banner và thương hiệu.
- `scripts/collect-header.mjs`: thu thập một lần theo yêu cầu cập nhật; không thuộc quá trình build hoặc runtime.
- `css/tailwind.input.css`: style thuộc layer Tailwind, responsive và gradient giới hạn trong ba pill.
- `js/ui.js`: một bộ handler header/menu, controller hero, hàm easing dùng chung với carousel danh mục.
- `data/assets-map.json`: bổ sung ánh xạ nguồn header → file local và hash. Banner gốc được giữ ngoài root tại `D:/hacom-ttg-original-assets-2026-10-07/header`.

Menu PC GAMING có sáu nhóm gồm PC ĐẸP; section sản phẩm vẫn có đúng năm chip. Các thương hiệu dùng ảnh tải một lần, không gọi AJAX khi hover. Bốn banner menu WebP dùng chiều rộng 346 px, đủ cho vùng hiển thị 156/173 px ở mật độ 2×. Tổng dung lượng giảm từ 1.029.824 xuống 309.188 byte. Chín banner hero và ba banner phụ vẫn dùng tài nguyên local hiện có.

## Đối chiếu

`header-comparison.json` ghi computed font và bounding rectangle của header, logo, input, nhóm chức năng, nút danh mục và hero trên nguồn/local tại 1280, 1440, 1620 và 1920 px. Dùng cùng Browser, zoom và viewport. Chiều cao header 177,1 / 195,5 px; logo 169 / 200 px; input 455×38 / 720×44 px. Các bounding box chính khớp; chênh lệch lớn nhất đã đo là 0,125 px chiều cao hero do tỷ lệ ảnh/làm tròn. Đây là đối chiếu khung chính, không phải cam kết mọi pixel của icon, nén ảnh hay toàn bộ panel đều giống tuyệt đối.

Tại 1620 px, thanh cuộn trình duyệt làm vùng nội dung khả dụng nhỏ hơn 1600 px. Panel co theo chiều rộng container đo được để không tràn trang; ở 1920 px panel rộng đúng 1300 px và danh sách trái 300 px. Màn hình thường dùng 960/240 px. Hai vùng cuộn độc lập trong chiều cao khả dụng; đã kiểm tra viewport cao 650 px.

`menu-validation.json` xác nhận đủ bảy panel mở được, Tab đi vào nhóm con tương ứng, không tràn ngang. Ảnh `menu-*-1920.jpg` lưu từng panel. Header/menu mobile tại 360, 390 và 768 px có trong `header-mobile-validation.json` và ảnh tương ứng. Toàn trang không tràn ngang ở các viewport đã đo. Thanh hỗ trợ và shortcut cuộn ngang trên mobile; toàn bộ menu vẫn có sẵn.

Header khi cuộn giữ placeholder 177,100006 px; vị trí tuyệt đối của main trước/sau là 177,100006 / 177,100098 px. Header compact cao 68 px ở desktop thường; trở về đầu phục hồi header đầy đủ. Ảnh trạng thái được lưu trong thư mục screenshots.

## Tương tác và kiểm tra

- Đã kiểm tra browser: click mở menu, Tab vào submenu gồm cả laptop, Escape/return focus, accordion mobile, thay đổi breakpoint khi menu mở, header thu gọn/phục hồi, tìm kiếm demo, phím hero, nút pause và kéo chuột chuyển slide không gây click demo. Sửa xung đột giữa hover do cuộn trang và focus bàn phím.
- Controller hero được kiểm tra bằng đồng hồ giả chạy mã UI thật: delay 3500 ms, duration 1000 ms, pause/resume hover/focus/viewport/tab, rewind, resize, giảm chuyển động, kéo và chặn click vô tình sau kéo. Các test carousel danh mục và YouTube tiếp tục chạy.
- Mọi liên kết header/menu/banner đều `#`, form submit bị chặn và hiển thị demo. Không có endpoint thương mại hoặc AJAX thương hiệu trong mã runtime. Các liên kết YouTube giữ luồng đã triển khai.
- `npm run build`, `npm test`, `npm run check`, `node scripts/check-http.mjs` là quy trình nghiệm thu. Số liệu cuối trong `validation.json` và `http-validation.json`.
- Kết quả cuối: 9/9 tests đạt, 153 file public qua HTTP không lỗi, không thiếu đường dẫn hoặc ID trùng. CSS 40.169 byte; UI JavaScript 17.329 byte, 4.841 byte gzip. Accordion mobile hỗ trợ cả danh mục cha và nhóm CPU/Mainboard/VGA…; Space/Enter thu gọn/mở được, chuyển về desktop phục hồi toàn bộ mục con.
- Console trang local không ghi lỗi/cảnh báo trong phiên kiểm tra. 171 vị trí sản phẩm, bảy section danh mục và bốn playlist được giữ nguyên; snapshot YouTube vẫn gồm 82 tập.

## Giới hạn

Icon chức năng là SVG nhẹ dựng theo hình dáng mẫu; không sử dụng sprite cũ. Ảnh WebP có thể khác nhẹ do nén. Chưa chạy pixel-diff toàn trang hoặc Lighthouse; không khẳng định đã đạt điểm Performance/CLS. Giảm chuyển động được kiểm tra trong harness; thao tác vuốt trên thiết bị cảm ứng thực chưa được kiểm chứng. Snapshot là dữ liệu tại thời điểm thu thập, không tự đồng bộ nguồn.
