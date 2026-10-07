# Báo cáo tài nguyên

Nguồn include ban đầu: 131 file, 19.607.560 byte. Dung lượng file trùng theo hash: 2.738.423 byte. Bản gốc được giữ tại `D:\hacom-ttg-original-2026-10-07.zip` ngoài root website.

Đã kiểm kê URL ảnh từ src/data-src, inline/CSS và overlay sản phẩm. 52 đường dẫn lazy-load chưa có file cùng tên được xử lý bằng đúng URL nguồn trong HTML. Ảnh thiếu tại thời điểm hoàn tất: **0**, không sử dụng placeholder thay sản phẩm.

Các tài nguyên được phân loại và chuẩn hóa WebP trong image/brand, banners, products, icons; Inter WOFF2 có subset tiếng Việt/latin/latin-ext trong fonts. Banner lớn có biến thể 800 px; ảnh sản phẩm không được phóng to. Hash gộp file giống hệt; vị trí sản phẩm vẫn giữ độc lập.

168 ánh xạ nguồn được ghi trong data/assets-map.json. `used=true` là ảnh được trang phát hành tham chiếu. 107 file ảnh được giữ lại, gồm biến thể banner; những ảnh điều hướng/đồ trang trí không còn sử dụng được bỏ khỏi bản chạy. Map vẫn giữ nguồn và hash của ảnh không dùng để đối chiếu.

Không di chuyển thư viện JS, stylesheet ứng dụng cũ hay tracking vào bộ phát hành. CSS mới được build từ Tailwind; JS mới viết thuần. Không còn tham chiếu include trong HTML/CSS/JS chạy thực tế. Dữ liệu snapshot và scripts có thể chứa đường dẫn cũ làm khóa ánh xạ lịch sử, không phải request runtime.
