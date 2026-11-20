# Một vũ trụ nhỏ dành riêng cho bạn

Một website thiệp sinh nhật tĩnh, không cần backend hay build step. Mở `index.html` để chạy local hoặc deploy trực tiếp lên GitHub Pages / Cloudflare Pages.

## Cá nhân hóa

Mở [config.js](./config.js) và thay đổi:

- `recipient`, `birthday`, `sender`: tên người nhận, ngày sinh nhật và chữ ký.
- `letter`: nội dung lá thư; có thể viết nhiều câu trong một chuỗi.
- `memories`: danh sách `{ image, caption }`. Thay URL ảnh bằng ảnh online hoặc đường dẫn local như `assets/photo-1.jpg`.
- `wishes`: danh sách các lời chúc cho những thẻ lật 3D.
- `music`: đường dẫn file nhạc local, ví dụ `assets/music.mp3`. Trình duyệt chỉ cho phép phát nhạc sau khi người dùng bấm nút bật nhạc.

Ảnh mặc định dùng ảnh Unsplash để trang có thể xem ngay. Khi deploy ổn định, nên tải ảnh cá nhân vào thư mục `assets/` rồi dùng đường dẫn local.

## Chạy và deploy

Không cần cài package. Có thể mở `index.html` trực tiếp, hoặc chạy một static server:

```bash
python3 -m http.server 8080
```

Sau đó truy cập `http://localhost:8080`. Với GitHub Pages, chọn branch chứa project và thư mục root trong Settings → Pages. Cloudflare Pages có thể deploy repository này với framework preset `None`, build command để trống và output directory là `/`.