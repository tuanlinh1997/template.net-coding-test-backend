# API Document: Get Camera Image

## Endpoint
`POST /tv/camera/image`

## Description
API này trả về thông tin hình ảnh và loại camera .

## Request

### 📤 Headers

| Tên Header    | Giá trị mẫu              | Ghi chú                |
|---------------|--------------------------|------------------------|
| Authorization | Bearer your_token_here   | Bắt buộc nếu có auth   |

### Query Parameters
Query Parameters:
| Tham số             | Bắt buộc | Mô tả                                    |
| ------------------- | -------- | ---------------------------------------- |
| `manufacturer_id`   | ✔️       | ID thiết bị / client                     |
- Truyền thêm các param mặc định
---
📘 Mô tả Response
| Trường       | Kiểu dữ liệu | Mô tả                                               |
| ------------ | ------------ | --------------------------------------------------- |
| `statusCode` | int          | Mã trạng thái HTTP, thường là `200` nếu thành công. |
| `result`     | int          | Trạng thái xử lý nghiệp vụ, `0` nếu thành công.     |
| `message`    | string       | Thông báo kết quả xử lý.                            |
| `ip_client`  | string       | IP của client thực hiện request.                    |
| `data`       | object       | Dữ liệu chi tiết của response.                      |
| `time_exec`  | int          | Tổng thời gian xử lý request (ms).                  |
| `time_log`   | object       | Thời gian xử lý chi tiết theo từng bước.            |
---
📘 Mô tả data
| Trường           | Kiểu dữ liệu | Mô tả                                                               |
| ---------------- | ------------ | ------------------------------------------------------------------- |
| `data_type_service`| object  | Thông tin loại dịch vụ camera.                                 |
| `data_image`       | array   | Danh sách hình ảnh quảng cáo camera.                           |
---
📘 Mô tả data_type_service
| Trường                      | Kiểu dữ liệu | Mô tả                                     |
| --------------------------- | ------------ | ----------------------------------------- |
| `CAM_ID`                    | string       | ID cấu hình dịch vụ                       |
| `CAM_VALUE`                 | object       | Thông tin dịch vụ Camera                  |
| `IS_CHECK`                  | number       | Cờ tắt mở dịch vụ  |
---
📘 Mô tả CAM_VALUE
| Trường             | Kiểu dữ liệu | Mô tả                                    |
| ------------------ | ------------ | ---------------------------------------- |
| `TITLE`            | string       | Tiêu đề.                            |
| `SERVICE`          | array        | Giá trị loại dịch vụ.               |
---
📘 Mô tả SERVICE
| Trường             | Kiểu dữ liệu | Mô tả                                    |
| ------------------ | ------------ | ---------------------------------------- |
| `ID`               | number       | Tiêu đề.                            |
| `VALUE`            | string       | Loại dịch vụ.                       |
---
📘 Mô tả data_image
| Trường           | Kiểu dữ liệu | Mô tả                                                   |
| ---------------- | ------------ | ------------------------------------------------------- |
| `CATE_ID`        | string       | ID chiến dịch camera.                                   |
| `CAM_VALUE`      | array        | Dữ liệu các ảnh.                                        |
## Response

### Success Response (200)
```json
{
  "result": 0,
  "message": "Success",
  "data": {
    "data_type_service": {
      "CAM_ID": "89",
      "CAM_VALUE": {
        "TITLE": "Quý khách có nhu cầu đăng ký Wifi Mesh/Camera? Quý khách vui lòng chọn một hoặc nhiều loại dịch vụ để hoàn tất bước Đăng ký.",
        "SERVICE": [
          {
            "ID": 210,
            "VALUE": "Wifi Mesh"
          },
          {
            "ID": 222,
            "VALUE": "Camera trong nhà"
          },
          {
            "ID": 224,
            "VALUE": "Camera ngoài trời"
          }
        ]
      },
      "IS_CHECK": 1
    },
    "data_image": {
      "CAM_ID": "1",
      "CAM_VALUE": [
        "https://s12974.cdn.mytvnet.vn/vimages/d2/2e/e0/0b/b1/15/d2e0b-pimageadsbg-config-camera-unkn.jpg",
        "https://s12974.cdn.mytvnet.vn/vimages/eb/b9/93/3f/ff/fa/eb93f-lphoto20250704141605cad10jpg-content-mytv.jpg"
      ]
    }
  },
  "IP_SERVER": "0.1",
  "time_exec": 50,
  "ser_time": "11-09-2025 09:36:58",
  "ip_client": "14.161.25.75",
  "time_log": {
    "t0": 0,
    "tcdnnode-start-270": 37,
    "tcdnnode-end-270": 12,
    "end": 0
  }
}
```

### ❌ Lỗi phổ biến
| Mã lỗi | Mô tả                  | JSON trả về                          |
|--------|------------------------|--------------------------------------|
| 400    | Request sai định dạng | `{"error": "Invalid request"}`       |
| 401    | Không xác thực        | `{"error": "Unauthorized"}`          |
| 404    | Không tìm thấy dữ liệu| `{"error": "Not Found"}`             |
| 500    | Lỗi server            | `{"error": "Internal Server Error"}` |
