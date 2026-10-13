# TGB SHOP — Bàn giao nhận diện

**Cập nhật khung tiêu đề:** [Khung tự giãn theo độ dài chữ](title-layout-audit.md), gồm kiểm tra nội dung dài và chữ 200%.

**Bản cập nhật mới nhất:** [Audit và style theo PDF](pdf-style-audit.md) · [Bảng đối chiếu PDF–UI](pdf-style-comparison.html). Các quyết định màu/gradient/showroom dưới đây là lịch sử của lượt chuyển nhận diện đầu tiên; báo cáo mới có ưu tiên khi khác nhau.

Ngày kiểm tra: 13/10/2026. Nguồn thiết kế: `mausac/preview2.pdf`; logo chính thức: `mausac/logo.png`.

## Hệ màu

Token nằm tại `src/styles/base.css`. CSS riêng của các màn hình tham chiếu token; không ghi lại màu thương hiệu cũ.

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `primary` | `#FD0A8F` | Điểm nhấn, icon dịch vụ, viền chọn |
| `secondary` | `#111010` | Top bar, showroom, nội dung trên nền sáng |
| `tertiary` | `#006B67` | Dấu kiểm và thông tin hỗ trợ |
| `brand-text` | `#AE0051` | Chữ thương hiệu và giá trong tooltip |
| `brand-action` | `#AE0051` | Nút có chữ trắng |
| `brand-soft` | `#FFE3F3` | Nền lựa chọn, checkbox và tập video đang chọn |
| `brand-muted` | `#EDA5BD` | Họa tiết và focus trên nền tối |
| `brand-selected` | `#FD0A8F` | Viền lựa chọn |
| `brand-focus` | `#AE0051` | Focus trên nền sáng |
| `teal-soft` | `#5BBAB5` | Màu phụ trong palette |
| `page` | `#F5F5F5` | Nền trang |

Gradient nhận diện: hồng sáng → hồng đậm → đen, góc 90°. Gradient có chữ nhỏ: hồng đậm → đen. Pill đầu trang dùng chu kỳ hồng đậm → đen → hồng đậm để chuyển động không tạo đường nối màu đột ngột.

Màu đỏ của giá/lỗi và xanh của trạng thái hàng được giữ theo ý nghĩa. Một số sắc độ được làm đậm để chữ nhỏ dễ đọc: giá cũ `#666666`, tồn kho Build PC `#00653B`, nút trả góp qua thẻ `#235D97` và nút làm mới/xóa bộ lọc `#D91605`. Biểu tượng Zalo/Messenger và ảnh đối tác giữ nguyên.

## Logo và giao diện

- Logo web: `public/images/brand/tgb-shop-logo.png`, PNG RGBA **600 × 404**.
- Vùng nguồn sau khi cắt khoảng trống alpha: `(33, 154)–(1967, 1457)`, kích thước **1934 × 1303**. Chỉ cắt khoảng trống và thu nhỏ theo tỷ lệ bằng Lanczos; không vẽ lại, đổi màu hay sửa chi tiết.
- Logo header: 119 × 80 px trên desktop, 95 × 64 px dưới 1280 px. Footer: 119 × 80 px. Ảnh dùng `object-fit: contain`.
- Favicon: PNG 32/48 px. Apple touch icon: PNG 180 px. Toàn bộ logo được căn giữa trên canvas vuông trong suốt.
- Các file nguồn trong `mausac` giữ nguyên. SHA-256 logo nguồn: `500cbcc87122f076e40d637d4bfbc7a12d640fb553f7cbd9c550078f0b43e4c5`.
- Header, menu, Deal HOT, tiêu đề danh mục, dịch vụ, cam kết, showroom, tooltip, chi tiết sản phẩm, giỏ hàng, Build PC, video và trang 404 sử dụng nhận diện mới.
- Họa tiết Deal HOT/danh mục/showroom dựng bằng CSS. Header và dịch vụ dùng SVG `currentColor`; dấu kiểm/quà tặng/cấu hình dùng SVG mask.
- Tên cửa hàng, metadata, alt text và thông báo demo thống nhất **TGB SHOP**. Tên model sản phẩm, slug, số điện thoại, email, URL ngoài và tên pháp nhân giữ nguyên.
- Tiêu đề Deal HOT chuyển thành HTML; bỏ prop `saleTitle` của `Sale`. Dữ liệu asset cũ được giữ để có thể đối chiếu nhưng không còn render.
- Không thêm thư viện, API hoặc backend. Font Inter và các hành vi demo hiện có được giữ.

## Kiểm tra

Các lệnh nghiệm thu: `npm run lint`, `npm run typecheck`, `npm run build`, `git diff --check`.

Kiểm tra browser thực hiện qua Chrome DevTools MCP, launcher được quản lý và profile chuyên dụng; tác vụ sử dụng tab/context riêng.

| Màn hình | Viewport kiểm tra |
| --- | --- |
| Trang chủ `/` | 375 / 768 / 1280 / 1920 px |
| Danh mục `/pc` | 375 / 768 / 1280 / 1920 px |
| Chi tiết sản phẩm mẫu | 375 / 768 / 1280 / 1920 px |
| Giỏ hàng `/cart` | 375 / 768 / 1280 / 1920 px |
| Build PC `/buildpc` | 375 / 768 / 1280 / 1920 px |
| Video `/videos` | 375 / 768 / 1280 / 1920 px |
| Playlist `/videos/playlist/sieu-trung-thuc` | 375 / 768 / 1280 / 1920 px |
| Route không tồn tại | 375 / 768 / 1280 / 1920 px |

Kết quả: **32/32** trường hợp không tràn ngang, logo đúng kích thước, không có ảnh lỗi trong phần đã tải; không có lỗi/warning console trong 8 màn hình. Chi tiết nằm trong [viewport-checks.json](viewport-checks.json) và [console-checks.json](console-checks.json).

Các tình huống đã kiểm tra:

- Header thường và thu gọn; logo mobile vẫn hiện sau khi cuộn. Menu mở bằng bàn phím, mục đang chọn có gradient; Escape đóng menu.
- Đổi tab Deal HOT, cuộn carousel, mở/đóng FAQ.
- Tooltip bằng focus bàn phím; giá/khuyến mại hồng đậm, mô tả đen, dấu kiểm xanh ngọc. Tooltip không mở trên mobile.
- Bộ lọc mobile mở/đóng, checkbox có màu và nền chọn mới; Escape trả focus về nút mở.
- Gallery, lựa chọn nâng cấp, nút mua hàng và thông báo demo vẫn giữ hành vi trình diễn.
- Dialog Build PC mở, focus vào tìm kiếm; bộ lọc mobile nằm trong viewport; Escape đóng dialog, trả focus và mở khóa cuộn.
- Chọn tập video cập nhật query, tập đang chọn dùng nền hồng nhạt; YouTube chỉ tải khi bấm phát và đạt trạng thái sẵn sàng.
- Giỏ mẫu giữ tổng **134.940.000 VNĐ**; Build PC giữ tổng **46.660.000 đ**.
- Đối chiếu JSON trước/sau: các thay đổi chỉ thuộc logo và nội dung biên tập đã chỉ định. Dữ liệu hàng hóa, giá, cấu hình, route, liên kết và tham chiếu ảnh trong HTML giữ nguyên.
- **387** đường dẫn ảnh local trong mã nguồn/dữ liệu đều tồn tại. Pixel logo web trùng chính xác kết quả crop/resample từ logo gốc.

Độ tương phản các cặp màu thương hiệu được tính bằng công thức luminance sRGB: trắng/hồng đậm khoảng **7,20:1**; hồng đậm/trắng **7,20:1**; trắng/xanh ngọc **6,37:1**; đen thương hiệu/hồng sáng **5,08:1**. Trắng/hồng sáng **3,74:1**, chỉ dùng cho chữ lớn đủ kích thước/độ đậm; chữ phụ trong khối giá có lớp nền tối bổ sung.

Ảnh nghiệm thu trong [screenshots](screenshots): trang chủ desktop/mobile, Deal HOT mobile, showroom, tooltip, sản phẩm desktop/mobile, giỏ hàng, dialog Build PC desktop/mobile và video.

| Vùng đối chiếu | Mẫu PDF | Desktop | Mobile |
| --- | --- | --- | --- |
| Header và trang chủ | [Trang 1](reference/page-1.png) | [Trang chủ](screenshots/home-desktop.png) | [Trang chủ](screenshots/home-mobile.png) |
| Deal HOT | [Trang 2](reference/page-2.png) | [Deal HOT](screenshots/deal-desktop.png) | [Deal HOT](screenshots/deal-mobile.png) |
| Showroom | [Trang 2](reference/page-2.png) | [Showroom](screenshots/showroom-desktop.png) | [Showroom mobile](screenshots/showroom-mobile.png) |
| Tooltip và palette | [Trang 3](reference/page-3.png) | [Tooltip](screenshots/tooltip-desktop.png) | Tooltip được tắt theo hành vi hiện có |
| Chi tiết sản phẩm | [Trang 4](reference/page-4.png) | [Sản phẩm](screenshots/product-desktop.png) | [Sản phẩm](screenshots/product-mobile.png) |

## Ảnh và nhận diện cũ được giữ

Họa tiết góc showroom đã được đối chiếu CSS trên ttgshop.vn: góc trái trên 45 × 30 px, góc phải dưới 27 × 20 px, cách mép 2 px; viền ngoài 2 px, bo góc 12 px. Hai PNG gốc được dùng làm alpha mask và phủ gradient hồng nhận diện → hồng phụ, giữ chính xác hình dạng gốc. Đã kiểm tra tại 375, 768, 1280 và 1920 px, gồm tiêu đề xuống dòng; không tràn ngang hoặc chồng chữ. Lint và build đạt sau chỉnh sửa.

Danh sách có đường dẫn chính xác trong [retained-assets.json](retained-assets.json).

- 9 hero và 3 banner phụ: PC doanh nghiệp, PC Gaming Premium, lắp đặt tại nhà, thu cũ đổi mới và các chiến dịch hiện có.
- Lớp quảng cáo Delta Force, Windows, ưu đãi trong ảnh sản phẩm và các overlay khai báo trong dữ liệu.
- Ảnh model sản phẩm và logo hãng; hình Zalo/Messenger; chứng nhận Bộ Công Thương.
- Website `TTGshop.vn` và liên kết fanpage cũ được giữ vì đây là địa chỉ/tài khoản, không phải nhãn cửa hàng mới.

Các ảnh này có thể còn chữ/logo TTG hoặc màu cam/vàng; đó là giới hạn chuyển đổi đã được duyệt, không phải UI bị bỏ sót. Các tên class/đường dẫn có tiền tố `ttg` được giữ để tránh đổi định danh không cần thiết.
