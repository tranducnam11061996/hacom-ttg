# Đồng bộ chiều cao và scrollbar menu

Ngày kiểm tra: 2026-10-07. Nguồn đối chiếu: https://ttgshop.vn/. Kiểm tra bằng Chrome DevTools với profile riêng, bản local chạy tại http://127.0.0.1:4173/.

## Thay đổi

- Desktop: danh sách dùng overflow visible, không max-height. Hàng liên kết 40 px, tăng 44 px từ 1.620 px; giữ viền phân cách.
- Panel desktop dùng height max-content, min-height 100%, max-height none và overflow auto theo nguồn. Chiều cao tự mở rộng, không giấu thanh cuộn bằng scrollbar-width hay overflow hidden.
- Dưới 1.280 px: giữ cuộn danh sách và giới hạn chiều cao khả dụng; hàng 39 px. Panel accordion không có vùng cuộn nội bộ.
- JavaScript chỉ đặt --menu-height cho accordion và xóa khi chuyển sang desktop. Giữ nguyên DOM, dữ liệu và luồng hover.

## Trước và sau

| Đo lường | Trước | Sau |
|---|---|---|
| Hàng desktop thông thường/lớn | 39/43 px | 40/44 px |
| Chiều cao tự nhiên của 16 mục | 639/703 px | 655/719 px |
| Danh sách desktop, viewport cao 600 px | Max-height 412 px, scrollHeight 639 px | ClientHeight = scrollHeight = 655 px; overflow visible |
| Panel desktop | Min/max-height bị giới hạn theo viewport | Min-height 100%, max-height none; chiều cao tự nhiên |
| Accordion mobile | Cuộn theo chiều cao khả dụng | Giữ cuộn, không tràn ngang |

## Kiểm chứng trình duyệt

Đã dùng hover thật của Chrome DevTools trên nút và danh mục; không mở menu bằng cách sửa hidden thủ công.

- Tại 1.280 và 1.440 px: danh sách rộng 240 px, cao 655 px; panel PC GAMING rộng 960 px, cao 655 px. Đúng ở cả header đầy đủ và thu gọn.
- Tại 1.620 và 1.920 px: danh sách rộng 300 px, cao 719 px, hàng 44 px. Đúng ở cả hai trạng thái header.
- Bảy panel 0/1/4/6/7/8/14 đều có clientHeight = scrollHeight = 719 px ở viewport 1.920 px; max-height none. Không xuất hiện scrollbar dọc nội bộ.
- Ở viewport 1.440 × 600 px: danh sách vẫn cao 655 px và kết thúc tại y=831, vượt viewport theo hành vi đã chốt; không bị CSS cắt hoặc chuyển thành vùng cuộn.
- Tại 360/390/768 px mô phỏng touch và 1.279 px dùng chuột: menu mở, truy cập được LAPTOP và Phần mềm, hàng 39 px, panel overflow visible, không tràn ngang.
- Các tests hồi quy kiểm tra hover, bàn phím, Escape, focus, click ngoài, resize, nhóm con và chuyển breakpoint vẫn pass.
- Console không ghi lỗi hoặc cảnh báo trong phiên kiểm tra.

### Chiều rộng tại đúng breakpoint 1.620 px

Giữ phép tính chiều rộng responsive hiện có. Khi scrollbar trang chiếm 15 px, clientWidth chỉ còn 1.605 px nên panel local rộng 1.285 px thay vì ép 1.300 px. Tại 1.920 px panel đạt 1.300 px. Trang nguồn ở 1.620 px vẫn ép 1.300 px và có scrollWidth 1.612 px > clientWidth 1.605 px; bản local không lặp lại phần tràn ngang này. Đây là giới hạn đối chiếu chiều rộng tại breakpoint, không phải thay đổi cấu trúc trong lần sửa chiều cao.

## Build và tài nguyên

- Build thành công; 14/14 tests pass.
- Kiểm tra local không có lỗi tham chiếu hoặc ID trùng.
- 153 tài nguyên HTTP được kiểm tra: tất cả 200 và khớp file local.
- Giữ 171 vị trí sản phẩm, bảy section, chín slide chính, ba banner phụ và 82 tập YouTube đã lưu.
- CSS: 40.142 byte (gzip 8.640 byte). ui.js: 18.180 byte (gzip 5.074 byte). Đạt ngân sách.

## Ảnh và số đo

- [Menu local desktop thu gọn, 1.920 px](screenshots/menu-height-desktop-1920.jpg)
- [Menu local trên viewport cao 600 px](screenshots/menu-height-desktop-600.jpg)
- [Menu nguồn, 1.620 px](screenshots/menu-height-source-1620.jpg)
- [Số đo computed style](menu-height-validation.json)

Số liệu trước sửa lấy từ audit trước triển khai; không có ảnh desktop thấp trước sửa trong phiên này. Báo cáo hover trước đây mô tả trạng thái lịch sử trước thay đổi chiều cao hiện tại. Cảm ứng được mô phỏng bằng DevTools; chưa kiểm tra phần cứng điện thoại thực.
