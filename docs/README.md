##  Yêu cầu:
- OS: Ubuntu 16.04 trở lên, Debian 8 trở lên
- NodeJS 8
- npm (mặc định cài nodejs 8 đã bao gồm luôn npm)
- yarn (tùy chọn, theo hướng dẫn thì sử dụng npm)

## Lưu ý:
- Môi trường làm việc trong bài hướng dẫn này có thông tin như sau:
 - OS: Debian 8
 - NodeJS 8
 - yarn
 - virtualhost ecom.example.com chạy code của repository https://git.ghtk.vn/ghtk/ecom cũng được setup trên server này

## Cài đặt:
- Lần đàu khi kéo clone project về thì chạy lệnh sau để setup các thư viện phụ thuộc:

```
yarn install --no-bin-links
```

- Chạy lệnh dưới để khởi động môi trường dev:

```
HOST=0.0.0.0 PORT=3000 yarn run dev
```

- Truy cập thử URL http://127.0.0.1/adm/

- Project sử dụng dữ liệu gọi từ các API của ecom.example.com, config lại file nginx config của ecom.example.com như sau

```
location ~ ^/adm/(.*)$ {
    proxy_pass http://127.0.0.1:3000/adm/$1;
}
```

- Test lại: truy cập http://ecom.example.com/adm/