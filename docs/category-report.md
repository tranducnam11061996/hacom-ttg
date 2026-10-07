# Đối chiếu section danh mục — 2026-10-07

Nguồn giao diện: https://ttgshop.vn/. Phạm vi: 7 danh mục local, giữ toàn bộ 171 vị trí sản phẩm trên trang, không cập nhật dữ liệu từ website trực tuyến. Chỉ PC GAMING có 5 danh mục con. Nội dung Hot Sale, header, hero, YouTube và footer giữ nguyên nguồn sinh HTML.

## Triển khai

- Thẻ và carousel danh mục có template riêng; build lại không làm mất thay đổi.
- Tailwind biên dịch tĩnh, Inter local, icon SVG; thêm ảnh đuôi tiêu đề PNG 1.824 byte từ nguồn chính thức.
- Typography và spacing danh mục được giới hạn trong wrapper riêng, không thay font-size gốc của toàn trang.
- Carousel native scroll-snap, điều khiển từng thẻ bằng JavaScript thuần, rewind; không thêm dependency runtime hay request lấy sản phẩm.
- Tự chạy sau 3.500 ms, chuyển động ease trong 1.000 ms. Dừng khi hover/focus/tương tác/ngoài viewport/tab ẩn; hỗ trợ giảm chuyển động và thay đổi kích thước.
- Nút mua, sản phẩm, danh mục con và Xem tất cả giữ hành vi demo.

## Kiểm tra thực tế

Browser trong Codex được dùng vì Chrome DevTools chuyên dụng không kết nối được. Không điều khiển Chrome đang mở của người dùng.

| Viewport CSS px | Thẻ hiển thị | Chiều rộng section | Header | Font tên sản phẩm | Tràn ngang toàn trang |
|---:|---:|---:|---:|---:|---|
| 360 | 2 | 320,8 px | 92 px | 14 px | Không |
| 390 | 2 | 351,2 px | 92 px | 14 px | Không |
| 768 | 3 | 728,8 px | 100 px | 14 px | Không |
| 1280 | 5 | 1200 px | 54 px | 14 px | Không |
| 1440 | 5 | 1200 px | 54 px | 14 px | Không |
| 1620 | 6 | 1584,8 px | 54 px | 16 px | Không |
| 1920 | 6 | 1600 px | 54 px | 16 px | Không |

Chiều rộng khả dụng có trừ scrollbar dọc của môi trường đo. Tại 1920 px, thẻ rộng 254,325 px; section PC GAMING cao 479,325 px. Tại 1280 px, thẻ rộng 227,2 px; section cao 439,2 px. Các số đo này khớp số đo tham chiếu trong sai số làm tròn subpixel. Gap thẻ 10 px, header 54 px, tiêu đề 22/24 px và giá 16/18 px đúng breakpoint.

- Chữ nút mua và vùng giá không tràn ngang ở bảy kích thước đã kiểm tra.
- Đã bấm nút next: chuyển một thẻ; End đến cuối rồi next quay về 0. Nút demo hiện thông báo, không đổi URL sang trang bán hàng hoặc nhảy lên đầu trang.
- Browser không ghi nhận lỗi JavaScript trong lượt kiểm tra.
- Tests chạy module UI thực với clock/event giả lập: autoplay, pause/resume, focus, wheel, ngoài viewport, tab ẩn, rewind, bàn phím, reduced motion, danh sách ngắn và resize giữa chuyển động. Kiểm tra HTML so sánh từng tên/ảnh/giá/giá gạch/giảm giá/trạng thái/nút mua với snapshot.
- Build, kiểm tra đường dẫn và kiểm tra HTTP: xem validation.json và http-validation.json. HTTP kiểm tra 121 tài nguyên, không lỗi.

Ảnh minh chứng: screenshots/categories-desktop.jpg và screenshots/categories-mobile.jpg. Ma trận responsive: category-responsive.json.

## Giới hạn đối chiếu

Dữ liệu local được giữ theo yêu cầu, nên tên/ảnh/giá hiện tại có thể khác website trực tuyến. Đối chiếu hình học không đồng nghĩa ảnh chụp hai trang giống từng pixel; font rasterization, DPR và ảnh WebP có thể tạo khác biệt. Chưa đo lại Lighthouse/Core Web Vitals trong lượt thay đổi này.
