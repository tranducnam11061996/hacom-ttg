# Build PC TTG — bàn giao giao diện demo

Trang local: http://127.0.0.1:4173/buildpc. Hỗ trợ cả `/buildpc/` và `/buildpc/index.html`.

Đã triển khai cấu hình mẫu 9 linh kiện, mỗi linh kiện số lượng 1; hai vị trí tổng tiền đều **46.660.000 đ**. SSD Crucial giữ trạng thái **Hết hàng**; bảo hành và trường thiếu được giữ theo snapshot nguồn. Popup có 20 sản phẩm đầu của mỗi nhóm (180 dòng), bộ lọc, số lượng và phân trang nguồn. Chín sản phẩm có giá nguồn “Liên hệ” vẫn hiển thị đúng nhãn này.

## Cấu trúc và phạm vi

- `data/buildpc.snapshot.json`: dữ liệu chuẩn hóa và map ảnh local; build không truy cập mạng.
- `scripts/templates/components/buildpc/configuration.mjs`: buildConfiguration, buildComponentGroup, buildSelectedItem, buildActions. Nhóm chưa chọn được hỗ trợ khi truyền items rỗng; bản public mặc định luôn đủ 9 nhóm.
- `scripts/templates/components/buildpc/picker.mjs`: componentPicker, pickerFilters, pickerToolbar, pickerProductRow; dùng phân trang chung.
- `scripts/templates/pages/buildpc/index.mjs`: ghép layout với dịch vụ, cam kết và liên hệ nổi dùng chung.
- `scripts/templates/utils/money.mjs`: định dạng tiền dùng chung với giỏ hàng.
- `js/modules/component-picker.js`: chỉ quản lý trình bày popup, focus, Escape, nền phủ, khóa cuộn và bộ lọc mobile.
- `css/buildpc.input.css`: CSS giới hạn trong các class Build PC.

Header dẫn “Xây dựng Cấu hình PC” tới trang local theo depth; “TƯ VẤN BUILD PC” giữ demo. Badge giỏ trên Build PC giữ mặc định ẩn. Các hành động tìm kiếm, lọc, sắp xếp, phân trang, thêm/xóa/sửa số lượng, làm mới, xuất file, in và thêm giỏ chỉ thông báo demo. Nút sửa/chọn thêm mở popup đúng nhóm nhưng không thay cấu hình. Không lưu storage hoặc gọi API nghiệp vụ.

## Kiểm chứng

- Build toàn bộ, 44 tests, kiểm tra tài nguyên và HTTP đều đạt. HTTP kiểm tra 437 file public và ba dạng URL Build PC.
- Tests kiểm tra dữ liệu, trường thiếu, tổng tiền, đường dẫn ở depth 0/1/2 và hồi quy lỗi đóng/mở nhanh làm kẹt khóa cuộn.
- Chrome DevTools MCP trong profile chuyên dụng đã kiểm tra đủ 9 popup: đúng nhóm, 20 dòng, reset khi mở lại, focus trả về nút mở, danh sách/cấu hình/tổng không thay đổi.
- Tab/Shift+Tab giữ focus trong popup; Escape, X và nền phủ đóng được. Bộ lọc mobile loại nội dung bị che khỏi vòng focus. Thử 30 lần mở/đóng nhanh không kẹt cuộn nền.
- Không có request fetch/XHR/WebSocket/ping hoặc lỗi/warning console trong kiểm tra Build PC. Storage giữ nguyên sau các hành động demo.
- Hồi quy browser cho trang chủ, danh mục, giỏ và chi tiết sản phẩm: mỗi màn một header/footer; liên kết Build PC đúng depth, badge giỏ đúng trạng thái, không có lỗi/warning console.
- Responsive 390/768/1024px: scrollWidth bằng clientWidth, không cuộn ngang toàn trang. Popup vừa viewport; bộ lọc thu gọn dưới 768px.

Chi tiết: [browser validation](buildpc-browser-validation.json), [regression](buildpc-regression.json), [measurements](buildpc-measurements.json), [pixel comparison](buildpc-pixel-comparison.json), [HTTP](http-validation.json).

## Đối chiếu hình ảnh

Ảnh được chụp bằng Chrome DevTools, DPR 1, desktop cao 1000px. Khung trắng và cả 9 hàng có cùng vị trí/kích thước với nguồn tại 1280, 1440, 1620 và 1920px. Bản mobile là bố cục responsive đã chốt, không sao chép phần tràn ngang của nguồn.

| Viewport | Pixel khác >24/255, toàn trang | Khối cấu hình | Popup CPU |
|---|---:|---:|---:|
| 1280 | 0,782% | 1,323% | 1,092% |
| 1440 | 0,683% | 1,301% | 0,970% |
| 1620 | 0,941% | 1,452% | 1,025% |
| 1920 | 0,744% | 1,385% | 0,865% |

Đây là tỷ lệ pixel vượt ngưỡng sai khác, **không phải điểm “giống 100%”**. Vẫn còn khác biệt ở nét icon sửa/xóa/làm mới/xuất file, dấu cộng và mũi tên; căn chữ nhỏ trong nhóm giá/số lượng; một số viền/nét do ảnh chuyển WebP. Header nguồn có badge giỏ theo session, còn Build PC local giữ badge mặc định theo kế hoạch. Footer local tái sử dụng ảnh BCT hợp lệ, trong khi ảnh nguồn có trạng thái lỗi ở lần khảo sát.

Ảnh chính:

- [Nguồn 1440](screenshots/buildpc-source-1440.png), [local 1440](screenshots/buildpc-local-1440.png), [sai khác toàn trang](screenshots/buildpc-diff-1440-whole.png).
- [Cấu hình nguồn](screenshots/buildpc-source-configuration-1440.png), [cấu hình local](screenshots/buildpc-local-configuration-1440.png), [sai khác cấu hình](screenshots/buildpc-diff-1440-configuration.png).
- [Popup nguồn](screenshots/buildpc-source-popup-1440.png), [popup local](screenshots/buildpc-local-popup-1440.png), [sai khác popup](screenshots/buildpc-diff-1440-popup.png).
- [Mobile 390](screenshots/buildpc-local-390.png), [popup mobile](screenshots/buildpc-local-popup-390.png), [bộ lọc mobile](screenshots/buildpc-local-filters-390.png), [tablet 768](screenshots/buildpc-local-768.png), [tablet 1024](screenshots/buildpc-local-1024.png).

Các bộ 1280/1620/1920 nằm cùng thư mục `screenshots`, theo mẫu tên `buildpc-{source|local}-{width}.png`, `buildpc-{source|local}-popup-{width}.png` và `buildpc-diff-{width}-{whole|configuration|popup}.png`.

Chạy `node scripts/compare-buildpc.mjs` để tính lại sai khác từ ảnh đã lưu. Chạy `npm run build:buildpc` để dựng lại HTML offline. CSS chung hiện bao phủ 10 màn; giới hạn raw tăng từ 80 lên 85 KiB để chứa bố cục và popup mới, giới hạn gzip vẫn giữ 18 KiB.
