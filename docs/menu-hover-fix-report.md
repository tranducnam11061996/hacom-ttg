# Sửa hover DANH MỤC SẢN PHẨM

Ngày kiểm tra: 2026-10-07. Bản local phục vụ qua http://127.0.0.1:4173/; trình duyệt Chrome DevTools sử dụng profile riêng. Không điều khiển Chrome cá nhân.

## Nguyên nhân và thay đổi

Controller cũ chỉ cho phép hover khi `(min-width:1280px)` khớp. Audit trước sửa xác nhận ở 1.279 CSS px, máy có chuột nhưng danh sách không mở; TTG Shop mở được trong cùng điều kiện. Ở 1.280 và 1.440 px, bản cũ mở được danh sách.

Controller mới giữ breakpoint cho bố cục và dùng `(any-hover: hover) and (any-pointer: fine)` cùng loại pointer mouse/pen để xử lý hover. Touch không mở bởi pointerenter. Click chuột giữ mở; click cảm ứng hoặc Enter/Space bật/tắt. Ngăn focus do thao tác cảm ứng tự mở trước click.

Hover nút chỉ mở danh sách. Hover hoặc focus bằng bàn phím vào danh mục mở đúng panel; mục không có submenu đóng panel trước đó. Desktop giữ mega menu bên phải; cửa sổ nhỏ giữ accordion trong danh sách. Escape đóng và trả focus về nút, click ngoài và đổi kích thước/trạng thái header đóng menu.

Chỉ cập nhật aria-expanded của liên kết danh mục và nút accordion, không ghi đè trạng thái nhóm con. Khôi phục vùng nối pseudo-element trên bố cục nhỏ. Tại 1.279 px, khe 10 px giữa nút và danh sách nằm trong vùng hit-test của menu.

## Kết quả trình duyệt

| Điều kiện | Trước sửa | Sau sửa |
|---|---|---|
| 1.279 px, chuột, header đầy đủ | Không mở | Mở danh sách; PC GAMING mở đúng panel |
| 1.279 px, chuột, header thu gọn | Không mở | Mở được |
| 1.280 / 1.440 px, chuột | Mở được | Giữ luồng hai bước |
| 768 / 1.024 px, chuột | Bị điều kiện width chặn | Mở danh sách và accordion bằng hover |
| 1.620 / 1.920 px, chuột | Không đo lại trước sửa | Mở danh sách và panel; không tràn ngang |
| 360 / 390 / 768 px, mô phỏng touch | Không đo lại trước sửa | Bấm mở/đóng và accordion hoạt động |

Đã dùng công cụ hover/click thực của Chrome DevTools, không thay đổi hidden thủ công để chứng minh menu mở. Tại bảy kích thước dùng chuột 768, 1.024, 1.279, 1.280, 1.440, 1.620, 1.920 px: hover nút mở danh sách và chưa mở panel; hover PC GAMING mở panel, hit-test vào liên kết con đúng và không tràn ngang.

Tại 1.440 px header thu gọn, đã kiểm tra cả bảy panel 0/1/4/6/7/8/14 bằng hover: nội dung hiển thị và nhận hit-test. Hover Phần mềm đóng panel. Escape trả focus đúng; Enter/Tab truy cập PC GAMING rồi PC GAMING GIÁ RẺ, Shift+Tab hoạt động. Tại 1.279 px, Space/Tab mở danh sách và panel PC GAMING. Header thu gọn ở scrollY=600 mở được tại 1.279 và 1.440 px.

Console bản local không ghi lỗi/cảnh báo; không có request XHR/fetch. Luồng thương mại tiếp tục là demo.

Ở viewport 1.440 × 600 px, cuộn danh sách tới LAPTOP vẫn mở panel 14. Danh sách cuộn 227 px, panel nằm tại y=176 và kết thúc tại y=588, trong vùng khả dụng của viewport.

## Tests và build

- Thêm 4 tests controller menu, tổng 13/13 tests pass sau build.
- Tests bao gồm breakpoint, cả bảy panel, mục không có panel, touch/chuột trên thiết bị lai, keyboard, Escape, giữ focus, click ngoài, resize, thay đổi khả năng hover, header thu gọn và trạng thái nhóm con.
- `npm run build` thành công; giữ 171 vị trí sản phẩm và 82 tập YouTube đã lưu.
- `npm run check`: không lỗi đường dẫn local hoặc ID trùng.
- `node scripts/check-http.mjs`: 153 tài nguyên HTTP, tất cả 200 và khớp file local.
- CSS: 40.131 byte, gzip 8.642 byte. ui.js: 18.104 byte, gzip 5.060 byte. Đạt ngân sách đã chốt.

## Ảnh đối chiếu và giới hạn

- [Local sau sửa, 1.279 px](screenshots/menu-hover-fixed-1279.jpg)
- [TTG Shop, 1.279 px](screenshots/menu-hover-reference-1279.jpg)
- [Local header thu gọn, 1.440 px](screenshots/menu-hover-compact-1440.jpg)

Ảnh local ở 1.279 px chủ động giữ bố cục accordion theo spec; trang nguồn giữ menu ngang. Không có ảnh trước sửa trong phiên audit, bảng trước/sau sử dụng kết quả đo đã ghi nhận, không dựng lại ảnh trước sửa.

Cảm ứng được kiểm tra bằng mô phỏng DevTools; thiết bị lai và pen được kiểm tra ở tầng controller, chưa kiểm tra trên phần cứng thực. Tại phiên đối chiếu nguồn ở 1.279 px và scrollY=600, header nguồn chưa có class header-fixed; vì vậy không khẳng định đã đối chiếu trạng thái thu gọn của nguồn tại viewport này.
