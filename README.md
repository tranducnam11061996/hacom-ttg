# TGB SHOP — Next.js demo

Một dự án giao diện dùng Next.js App Router, React, TypeScript và Tailwind CSS 4. Giao diện sử dụng nhận diện TGB SHOP hồng–đen, với dữ liệu sản phẩm mẫu hiện tại.

Hệ màu, logo và kết quả kiểm tra chuyển đổi được ghi tại [docs/brand/README.md](docs/brand/README.md). Banner chiến dịch và ảnh sản phẩm có nhận diện TTG được giữ theo phạm vi chuyển đổi đã duyệt.

## Chạy dự án

Yêu cầu Node.js 22 trở lên và npm.

```powershell
npm ci
npm run dev
```

Mở http://localhost:3000. Để chạy bản production:

```powershell
npm run build
npm start
```

Kiểm tra mã nguồn bằng `npm run lint` và `npm run typecheck`.

## Cấu trúc

| Thư mục | Trách nhiệm |
| --- | --- |
| `src/app` | Route, layout cửa hàng/video và trang 404; các `page.tsx` ghép màn hình |
| `src/features` | Giao diện và hành vi riêng của home, catalog, product-detail, cart, build-pc, videos |
| `src/components` | Layout, UI, thẻ sản phẩm và phần hỗ trợ dùng chung |
| `src/data` | Dữ liệu mẫu JSON; ảnh dùng đường dẫn `/images/...` trực tiếp |
| `src/hooks` | Vòng đời carousel dùng chung, gồm autoplay, kéo/vuốt và cleanup |
| `src/lib` | Đường dẫn route và định dạng tiền |
| `src/styles` | Tailwind entry, token, font và quy tắc cơ bản |
| `public` | Ảnh và font local |

CSS đặc thù nằm cạnh feature hoặc nhóm component sở hữu: CSS nền ở root layout, CSS cửa hàng ở store layout, CSS riêng ở route tương ứng. Các component có tương tác dùng React state/hook; nội dung tĩnh dùng Server Component khi có thể.

## Các màn hình

- `/`: trang chủ.
- `/pc`: danh mục PC GAMING.
- `/pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc`: chi tiết sản phẩm mẫu.
- `/cart`: giỏ mẫu 3 sản phẩm, tổng 134.940.000 VNĐ.
- `/buildpc`: cấu hình mẫu 9 linh kiện, tổng 46.660.000 đ; 9 nhóm chọn linh kiện, mỗi nhóm 20 sản phẩm mẫu.
- `/videos`: danh sách 4 playlist.
- `/videos/playlist/sieu-trung-thuc`, `/videos/playlist/vlog`, `/videos/playlist/aba-reaction`, `/videos/playlist/daily-moment`: trình phát và danh sách tập.

URL HTML cũ chuyển hướng sang route tương ứng; query `?video=...` được giữ lại. Slug playlist không tồn tại trả về trang 404.

Mỗi route có title và description riêng. Ảnh/tên sản phẩm dẫn đến màn chi tiết mẫu chung; danh mục bán hàng dẫn đến `/pc`. Playlist render danh sách tập từ server và chỉ tải player khi bấm phát. Font production được cache một giờ; khi thay file font cùng tên cần tải lại bỏ qua cache.

SEO và hiệu năng chưa nghiệm thu hoàn toàn: popup lần đầu và một số lần đổi nhóm khuyến mãi còn vượt mục tiêu phản hồi 200 ms.

## Chỉnh sửa

Sửa nội dung ở `src/data`: `store.json` cho trang chủ, `header.json`/`footer.json` cho layout, `catalog.json`, `product.json`, `cart.json`, `build-pc.json` và `youtube.json` cho từng màn hình. Sửa bố cục và tương tác ở feature/component tương ứng. Khi thêm hoặc đổi ảnh, đặt file trong `public/images` và cập nhật đường dẫn cùng kích thước trong dữ liệu.

HTML trong dữ liệu chỉ phục vụ nội dung biên tập đã làm sạch: mô tả, thông số, khuyến mãi, tooltip và FAQ. Không dùng `Content` để dựng cả trang hoặc nhận HTML chưa kiểm soát từ người dùng.

## Giới hạn demo

Tìm kiếm, lọc, sắp xếp, phân trang, tài khoản, mua hàng, xuất file, đổi số lượng và chọn linh kiện chỉ thông báo demo. Biểu mẫu nhập thử nhưng không gửi hoặc lưu dữ liệu; cấu hình và tổng tiền mẫu giữ cố định. Menu, carousel, FAQ, bộ lọc mobile và popup vẫn có tương tác trình diễn.

Video giữ 82 tập từ dữ liệu đã lưu. Ảnh YouTube và phát video cần Internet. IFrame API chỉ tải khi bấm phát; chọn tập bằng query chỉ nhận ID thuộc playlist mẫu. Luôn có liên kết xem trên YouTube khi trình phát bị chặn.

Build dùng dữ liệu local, không thu thập lại nguồn. Dự án không cần database, API key hoặc backend nghiệp vụ.
