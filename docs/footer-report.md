# Showroom và footer — 07/10/2026

Nguồn: https://ttgshop.vn/. Đối chiếu bằng Chrome DevTools profile riêng, viewport CSS, DPR 1, font và layout đã ổn định. Footer sinh từ snapshot local; không thêm chat hoặc liên kết hoạt động thật.

## Thay đổi

- Khôi phục icon sprite showroom/contact, gradient viền và nền tiêu đề, hai ảnh góc PNG đúng nguồn; thêm metadata tài nguyên.
- Container 1220/1620 px, padding ngang 10 px; showroom hai cột gap 16 px, bo trên 20 px, padding dọc 24 px.
- Logo 144 px, badge Bộ Công Thương 121/150 px, tỷ lệ tự nhiên; typography, spacing và copyright theo nguồn.
- CSS footer tách trong `css/footer.input.css`, được nhập vào stylesheet Tailwind chính; không thêm JavaScript/dependency.
- Loại 20 px padding cuối main; cam kết → showroom tổng 20/40 px. Chrome xác nhận desktop 40 px.

## Số đo trước/sau

Trước: showroom padding dọc 32 px; logo nằm trong vùng padding 24 px và margin dưới 20 px; badge rộng 128 px; copyright padding 16 px. Sau: showroom 24 px, hàng logo 14 px dọc, badge 121/150 px, copyright 10 px.

| Viewport | Showroom local / nguồn | Công ty local / nguồn | Copyright local / nguồn |
|---|---|---|---|
| 1280 | 271 / 271 px | 272,109 / 272,109 px | 92 / 92 px |
| 1440 | 271 / 271 px | 272,109 / 272,109 px | 92 / 92 px |
| 1620 | 300 / 300 px | 305,109 / 305,109 px | 98 / 98 px |
| 1920 | 300 / 300 px | 305,109 / 305,109 px | 98 / 98 px |

Khung tên showroom 41/44 px; logo 144 × 51,109 px; badge 121 × 45,766 / 150 × 56,75 px, trùng nguồn trong phép đo. Chiều cao không bị cố định toàn section.

## Kiểm tra

- 20/20 tests pass, gồm giữ nguyên nội dung hai showroom, bốn cột, copyright và link demo.
- Build/check đạt; HTTP kiểm tra 157 public files, 0 lỗi. CSS 45.375 byte; UI JS gzip 5.732 byte, không tăng trong thay đổi này.
- Viewport 360, 390, 640, 768, 1024, 1279 không tràn ngang. Mobile showroom xếp dọc; cột thông tin 1/2/4 theo breakpoint đã chốt.
- Link demo hiển thị thông báo và không thay đổi scroll/điều hướng. Icon aria-hidden; liên kết giữ focus ring hiện có.
- Giữ 171 vị trí sản phẩm, 84 vị trí sale, 82 video; nội dung pháp lý và Copyright ©2025 từ local.

Ảnh đã lưu đủ tám bản local/reference tại 1280,1440,1620,1920: `docs/screenshots/footer-{local,reference}-{width}.jpg`. Chụp ảnh ban đầu treo ở tab nền; đưa đúng tab của profile riêng lên trước đã giải quyết, không dùng Chrome cá nhân.

Giới hạn: số đo các hộp chính khớp; chưa chạy diff pixel tự động cho mọi icon và mọi trạng thái focus. Mobile được xây theo phương án responsive đã thống nhất, không theo min-width của nguồn.
