# Spec triển khai đã được duyệt

Nguồn chuẩn cửa hàng: bản index.html local 912.001 byte; không cập nhật danh mục, tên hoặc giá từ website trực tuyến. HTML chứa sẵn nội dung. Giao diện dùng Tailwind CSS v4 biên dịch sẵn, Inter WOFF2 tiếng Việt, JavaScript thuần tối thiểu. Website phát hành chạy trên hosting tĩnh.

Thứ tự: header, điều hướng, hero, playlist, khuyến mãi, 7 nhóm sản phẩm, cam kết, FAQ, showroom, footer. Giữ 171 vị trí sản phẩm, logo, banner, tên/giá/giá gạch/nhãn/trạng thái, màu #ff5636/#002023/#004147 và nền #f5f5f5. Container 1.220 px, từ 1.620 px mở rộng 1.620 px. Dải sản phẩm có 2/3/5/6 thẻ tùy breakpoint; chỉ dải nội dung được cuộn ngang.

Menu native details, Escape; tab ARIA với phím mũi tên/Home/End; hero snap tự chuyển 5 giây, dừng khi tương tác, không tự chuyển khi giảm chuyển động. FAQ details. Cửa hàng demo href="#", chặn hành động và submit. Loại tooltip lặp, thư viện cũ, tracking, iframe ứng dụng cũ và canonical. Demo noindex,nofollow.

Ảnh phân nhóm image/brand,banners,products,icons; gộp hash, WebP, banner srcset, kích thước rõ ràng, lazy dưới màn hình. Font lưu local. Bản gốc backup ngoài root. assets-map ghi nguồn, hash, trạng thái và used. Xóa include sau kiểm tra tham chiếu hoàn tất.

YouTube kênh https://www.youtube.com/@thaygiaoba2602, 4 playlist Siêu Trung Thực, Vlog, Aba Reaction, Daily Moment. Snapshot một lần tối đa 30 video công khai mỗi playlist, giữ thứ tự; không đồng bộ runtime. Homepage 4 thẻ, mở playlist local tab mới. videos/index.html và 4 trang playlist riêng. Player click-to-load chính thức với full playlist ID; query video được whitelist; trạng thái bên ngoài đồng bộ qua IFrame API. Có liên kết YouTube dự phòng; không tải video về máy.

Nghiệm thu: đủ 171 vị trí, không tham chiếu include/dependency cũ, không local 404/ID trùng/lỗi JS mới; không overflow toàn trang ở 360/390/768/1280/1440/1920. HTML giảm >=40%; CSS <=70 KB raw; own JS <=20 KB gzip/page. Lighthouse >=90 desktop/>=85 mobile, CLS <=0,1 là mục tiêu đo, phải ghi rõ khi chưa đo được. Bàn giao nguồn, compiled CSS, snapshot, bản đồ tài nguyên, README và báo cáo hạn chế.
