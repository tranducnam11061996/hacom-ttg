# Đồng bộ dịch vụ và cam kết — 07/10/2026

Đối chiếu https://ttgshop.vn/ bằng Chrome DevTools với profile riêng. Nguồn sinh HTML, CSS Tailwind và controller JS đã được sửa; build lại giữ thay đổi.

## Giao diện

- Bốn icon sprite 40 × 40, đúng tọa độ; khung trắng có viền, bo 12 px và skew −3°/−10°, nội dung bù nghiêng.
- Tiêu đề hai dòng, TTG SHOP cam và Hài Lòng gradient; năm hàng có dấu cộng/trừ, typography và padding theo nguồn.
- Giữ nguyên nội dung bốn dịch vụ và năm câu trả lời local; toàn bộ link trả lời vẫn demo.
- Desktop dùng vùng 1.200/1.600 px; ở 1.620 px vùng khả dụng là 1.585 px do gutter scrollbar, khớp nguồn trong phiên đo.
- Tablet 768–1279 chia đều bốn cột, cho phép chữ xuống dòng; dưới 768 dùng hai cột. Đây là phần responsive thích nghi với local, không sao chép min-width 1220 của nguồn.

## Số đo và nghiệm thu

| Viewport | Danh sách cam kết local / nguồn | Chiều cao đóng local / nguồn |
|---|---|---|
| 1280 | 1200 / 1200 px | 340 / 340 px |
| 1440 | 1200 / 1200 px | 340 / 340 px |
| 1620 | 1585 / 1585 px | 340 / 340 px |
| 1920 | 1600 / 1600 px | 340 / 340 px |

Khung dịch vụ cao 165,5 px desktop nhỏ và 192,5 px desktop lớn; tiêu đề cam kết cao 78/96 px. Khoảng cách dịch vụ → tiêu đề là 32 px desktop, 20 px mobile. Khung nghiêng có bounding box rộng hơn layout box theo phép skew; không dùng bounding box đó làm chiều rộng container.

Viewport 360, 390, 640, 768, 1279 không tràn ngang trong kiểm tra. Ở 768, các mục có chiều cao khác nhau vì xuống dòng và căn đáy; không ép một dòng chữ gây tràn.

## Tương tác và kiểm thử

- Trượt 400 ms với easing swing, mỗi mục độc lập; bấm nhanh hủy frame cũ và tiếp tục từ chiều cao hiện tại. Resize đo lại đích; hoàn tất trả height về auto.
- Reduced motion mở tức thời. ARIA đồng bộ; panel đóng hidden/inert, panel đang đóng inert; nút giữ focus.
- Chrome xác nhận Enter/Space bật/tắt và mở đồng thời nhiều mục. Kiểm thử tự động bao phủ đảo chiều, resize, thay đổi reduced motion, ARIA, nội dung và link.
- 19/19 tests pass; build và check đạt; HTTP 155 public files, 0 lỗi. CSS khoảng 43 KB, UI JS gzip 5,7 KB, dưới ngưỡng.
- Giữ 171 vị trí sản phẩm, 84 vị trí sale và 82 video snapshot.

Ảnh đối chiếu: `docs/screenshots/support-reference-{1280,1440,1620,1920}.jpg` và `support-local-{1280,1440,1620,1920}.jpg`. Một số ảnh local còn focus ring sau kiểm tra bàn phím. Ảnh lưu trước bước cuối chỉnh màu chữ về #000. Lần chụp bổ sung sau bước này bị treo và đã dừng; số đo cuối 1280 vẫn xác nhận 340 px. Chưa thực hiện diff pixel tự động cho toàn bộ trạng thái mở và thiết bị cảm ứng thật.
