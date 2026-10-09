# Danh mục PC GAMING local

Nguồn: https://ttgshop.vn/pc. Snapshot thu ngày 08/10/2026 (Asia/Bangkok); 60 sản phẩm trang đầu, tổng hiển thị 446 sản phẩm, 7 trang. Nội dung cố định theo snapshot, không đồng bộ runtime.

## Triển khai

- Dựng `pc/index.html` qua `storeLayout`, dùng chung header/footer, dịch vụ và cam kết. Đăng ký build/public/preview; hỗ trợ `/pc`, `/pc/`, `/pc/index.html`.
- Sidebar và pagination nhận dữ liệu/tham số riêng, không đọc snapshot hoặc gọi mạng. Product card có biến thể `listing`, mặc định trang chủ giữ nguyên.
- Giới thiệu mở/thu, tooltip sản phẩm, panel lọc mobile hỗ trợ focus/Tab/Escape. Checkbox/select chỉ đổi trạng thái UI và thông báo demo; sản phẩm, tổng số, trang hiện tại không thay đổi. Giỏ hàng và liên hệ demo.
- Snapshot chứa đủ thứ tự, giá, tình trạng, mô tả tooltip, nhóm lọc và lựa chọn sắp xếp. Ảnh sản phẩm, emoji, overlay, Messenger/Zalo được lưu local; asset có bytes giống nguồn được tái sử dụng. Build không gọi mạng.
- Desktop 4 cột, từ 1620 px 5 cột; tablet 3 cột; mobile 2 cột và panel lọc. CSS mới giới hạn theo màn/biến thể.

## Xác minh

Build, 30 tests, static check và HTTP check qua 219 file public đều đạt. Không thiếu asset, không trùng ID hoặc thêm legacy/tracking runtime. Console local không có lỗi/cảnh báo trong lần kiểm tra.

`category-listing-measurements.json` ghi số đo 9 khối chính (giới thiệu, sidebar, panel sản phẩm, grid, thẻ đầu, phân trang, dịch vụ, cam kết, showroom). Ở 1280/1440/1620/1920 px, x/y/width/height trùng nguồn trong lần đo cuối, sai số 0 px. Ở 360/390/768/1024 px không cuộn ngang, giá không tràn. Đã kiểm tra mở/thu giới thiệu, panel lọc, vòng focus, Escape, checkbox demo và tooltip bằng bàn phím.

Screenshot nguồn/local, overlay và diff nằm trong `docs/screenshots/category-*`. `node scripts/compare-category.mjs` tạo lại ảnh diff/overlay từ bộ ảnh toàn trang. Bộ ảnh toàn trang được chụp trước tinh chỉnh cuối toolbar/icon thẻ; có lỗi paint phần ngoài viewport (ví dụ tiêu đề showroom local bị bỏ trong ảnh toàn trang nhưng xuất hiện đầy đủ khi cuộn đến footer). Tỷ lệ pixel chênh ngưỡng 30 trong bộ ảnh này khoảng 3.5–4.7%; không dùng con số đó để khẳng định giao diện khớp 100% từng pixel. Các số đo layout và kiểm tra trực tiếp viewport là bằng chứng đáng tin hơn cho vị trí/kích thước.

## Giới hạn đối chiếu

Ảnh viewport cuối `category-reference-1440-top-final.jpg` và `category-local-1440-top-final.jpg` được chụp ở cùng kích thước, cùng chất lượng JPEG. Vùng nội dung x=112..1311, y=223..899 có 352/812400 pixel chênh quá 30 mức màu (0.0433%). Đây là kết quả cho vùng đầu trang đã chụp, không đại diện cho 100% toàn trang. Dữ liệu phép đo nằm trong `category-listing-viewport-comparison.json`. Ảnh mobile cuối lưu tại `category-mobile-390.jpg`.

Mobile chủ động responsive theo lựa chọn của người dùng, khác hành vi cuộn ngang của trang gốc. Tooltip được giới hạn viewport và hỗ trợ bàn phím; vị trí hiển thị phụ thuộc vùng còn trống. Các liên kết nghiệp vụ giữ demo. Header/footer dùng component đã có, không viết lại toàn bộ. Icon liên hệ local giữ trạng thái tĩnh thay vì pulse theo thời gian, giúp thao tác và đối chiếu ổn định. Rasterization chữ và trạng thái animation khiến ảnh từng pixel có thể khác dù số đo bằng nhau.

Không tuyên bố đã đạt 100% từng pixel: đã khớp số đo các khối chính và nội dung snapshot, nhưng ảnh toàn trang còn sai khác/render artifacts được ghi rõ ở trên.
