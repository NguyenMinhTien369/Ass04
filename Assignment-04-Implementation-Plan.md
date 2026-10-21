Mình đã đọc toàn bộ 7 trang của [Assignment 4.docx](</home/minhcup/Documents/SDN/Assignment 4.docx>). Bài yêu cầu xây dựng một ứng dụng quiz full-stack hoàn chỉnh, không chỉ dựng giao diện.

## 1. Phạm vi bắt buộc

### Backend

- [ ] Sử dụng Node.js.
- [ ] Khởi tạo Express server.
- [ ] Cho phép frontend gửi request đến API, bao gồm cấu hình CORS và JSON middleware.
- [ ] Kết nối MongoDB.
- [ ] Sử dụng Mongoose.
- [ ] Tạo model `Quiz`.
- [ ] Tạo model `Question`.
- [ ] Thực hiện đầy đủ CRUD cho quiz:
  - Tạo quiz.
  - Lấy danh sách quiz.
  - Xem chi tiết một quiz.
  - Cập nhật quiz.
  - Xóa quiz.
- [ ] Thực hiện đầy đủ CRUD cho question:
  - Tạo câu hỏi.
  - Lấy danh sách câu hỏi.
  - Xem câu hỏi.
  - Cập nhật câu hỏi.
  - Xóa câu hỏi.
- [ ] Liên kết câu hỏi với quiz tương ứng.
- [ ] Validate dữ liệu đầu vào của các API.
- [ ] Có xử lý lỗi thống nhất cho API.

### Frontend

- [ ] Xây dựng bằng React.
- [ ] Sử dụng Redux để quản lý state.
- [ ] Sử dụng React Router để điều hướng phía client.
- [ ] Sử dụng Bootstrap 5 để thiết kế giao diện.
- [ ] Hiển thị danh sách quiz.
- [ ] Hiển thị các câu hỏi thuộc quiz.
- [ ] Cho phép người dùng chọn đáp án.
- [ ] Cho phép gửi đáp án.
- [ ] Người dùng phải đăng nhập thành công trước khi tải và hiển thị quiz.
- [ ] Có đăng ký tài khoản.
- [ ] Có đăng nhập.
- [ ] Có đăng xuất.
- [ ] Phân biệt tài khoản admin và người dùng thường.
- [ ] Admin có quyền quản lý câu hỏi.
- [ ] Người dùng thường chỉ được làm quiz.

## 2. Thiết kế dữ liệu cần có

Để đáp ứng chức năng một cách đầy đủ, nên có ít nhất ba model.

### User

- [ ] `username` hoặc `email`.
- [ ] `passwordHash`, không lưu mật khẩu dạng plain text.
- [ ] `role`, tối thiểu gồm `admin` và `user`.
- [ ] Validate tài khoản trùng.
- [ ] Mã hóa mật khẩu trước khi lưu.

### Quiz

- [ ] Tên hoặc tiêu đề quiz.
- [ ] Mô tả, nếu cần.
- [ ] Danh sách hoặc quan hệ tới các question.
- [ ] Trạng thái quiz, nếu có như `published`.
- [ ] Timestamp tạo và cập nhật.

### Question

Ảnh mẫu trong đề thể hiện cấu trúc:

- [ ] Nội dung câu hỏi, ví dụ `questionText`.
- [ ] Danh sách các lựa chọn `options`.
- [ ] Đáp án đúng, có thể là `correctAnswerIndex`.
- [ ] Tham chiếu đến quiz chứa câu hỏi.
- [ ] Validate có đủ lựa chọn.
- [ ] Validate đáp án đúng nằm trong phạm vi các lựa chọn.

Không nên gửi `correctAnswerIndex` xuống frontend của người dùng thường trước khi họ nộp bài.

## 3. API cần triển khai

Tên endpoint có thể khác, nhưng chức năng phải tương đương.

### Authentication

- [ ] `POST /api/auth/signup`: đăng ký.
- [ ] `POST /api/auth/login`: đăng nhập.
- [ ] `POST /api/auth/logout`: đăng xuất nếu dùng cookie/session.
- [ ] `GET /api/auth/me`: lấy thông tin người dùng đang đăng nhập.
- [ ] Trả token hoặc session sau khi đăng nhập.
- [ ] Middleware kiểm tra đăng nhập.
- [ ] Middleware kiểm tra quyền admin.

### Quiz

- [ ] `POST /api/quizzes`: tạo quiz.
- [ ] `GET /api/quizzes`: lấy danh sách quiz.
- [ ] `GET /api/quizzes/:id`: lấy một quiz.
- [ ] `PUT` hoặc `PATCH /api/quizzes/:id`: cập nhật quiz.
- [ ] `DELETE /api/quizzes/:id`: xóa quiz.
- [ ] Chỉ admin được gọi các API tạo, sửa và xóa.
- [ ] Người dùng đã đăng nhập được đọc quiz để làm bài.

### Question

- [ ] `POST /api/questions`: tạo câu hỏi.
- [ ] `GET /api/questions`: lấy danh sách câu hỏi.
- [ ] `GET /api/questions/:id`: lấy một câu hỏi.
- [ ] `PUT` hoặc `PATCH /api/questions/:id`: cập nhật câu hỏi.
- [ ] `DELETE /api/questions/:id`: xóa câu hỏi.
- [ ] Hỗ trợ lấy câu hỏi theo quiz.
- [ ] Chỉ admin được tạo, sửa và xóa câu hỏi.

### Nộp bài quiz

Đề yêu cầu người dùng chọn và gửi đáp án; ảnh mẫu có màn hình kết quả. Vì vậy nên có:

- [ ] Endpoint nhận các đáp án của một lượt làm bài.
- [ ] Backend đối chiếu đáp án đúng.
- [ ] Trả về số câu đúng hoặc điểm.
- [ ] Không tin điểm do frontend tự tính.

## 4. Validation và xử lý lỗi

Đây là yêu cầu được ghi rõ trong tài liệu.

- [ ] Kiểm tra các field bắt buộc.
- [ ] Kiểm tra MongoDB ID hợp lệ.
- [ ] Không cho tạo quiz/câu hỏi với dữ liệu rỗng.
- [ ] Không cho đặt đáp án đúng ngoài phạm vi `options`.
- [ ] Xử lý username/email đã tồn tại.
- [ ] Xử lý đăng nhập sai.
- [ ] Trả `401` khi chưa đăng nhập.
- [ ] Trả `403` khi user thường gọi chức năng admin.
- [ ] Trả `404` khi không tìm thấy quiz hoặc question.
- [ ] Trả `400` hoặc `422` cho dữ liệu không hợp lệ.
- [ ] Trả `500` cho lỗi hệ thống.
- [ ] Frontend hiển thị thông báo lỗi rõ ràng thay vì chỉ ghi lỗi vào console.

## 5. Redux cần quản lý gì

Không nên chỉ cài Redux mà không thực sự sử dụng, vì tiêu chí chấm ghi rõ frontend phải tải và hiển thị quiz theo Redux architecture.

- [ ] `auth` state:
  - Người dùng hiện tại.
  - Token hoặc trạng thái session.
  - Trạng thái đăng nhập.
  - Loading và error.
- [ ] `quizzes` state:
  - Danh sách quiz.
  - Quiz đang chọn.
  - Loading và error.
- [ ] `questions` state:
  - Danh sách câu hỏi.
  - Trạng thái CRUD của admin.
- [ ] `quizAttempt` state:
  - Câu hỏi hiện tại.
  - Các đáp án đã chọn.
  - Kết quả hoặc điểm.
- [ ] Dùng async action/thunk để gọi API.
- [ ] Có trạng thái loading, success và failure.
- [ ] Sau đăng nhập, Redux lưu user rồi mới tải quiz.
- [ ] Sau thao tác CRUD, danh sách trên giao diện được cập nhật đúng.

## 6. Routing và bảo vệ trang

Tối thiểu nên có các route sau:

- [ ] `/signup`: đăng ký.
- [ ] `/login`: đăng nhập.
- [ ] `/dashboard`: trang của người dùng.
- [ ] `/quizzes` hoặc `/dashboard/quiz`: danh sách/làm quiz.
- [ ] `/quizzes/:id`: làm một quiz cụ thể.
- [ ] `/result`: xem kết quả, hoặc hiển thị kết quả ngay trong trang quiz.
- [ ] `/admin`: admin dashboard.
- [ ] `/admin/quizzes`: quản lý quiz.
- [ ] `/admin/questions`: quản lý câu hỏi.
- [ ] Protected route chặn người chưa đăng nhập.
- [ ] Admin route chặn tài khoản không phải admin.
- [ ] Đăng xuất xóa thông tin xác thực và đưa người dùng về trang login.
- [ ] Reload trình duyệt vẫn xác định được trạng thái đăng nhập hợp lý.

## 7. Luồng người dùng thường

Theo yêu cầu và ảnh minh họa, cần chứng minh được toàn bộ luồng:

- [ ] Đăng ký tài khoản user.
- [ ] Đăng nhập thành công.
- [ ] Chuyển đến user dashboard.
- [ ] Hiển thị tên người dùng.
- [ ] Không hiển thị hoặc không cho truy cập tính năng quản trị.
- [ ] Mở trang quiz.
- [ ] Tải quiz và câu hỏi từ backend thông qua Redux.
- [ ] Hiển thị câu hỏi và các lựa chọn.
- [ ] Chọn một đáp án.
- [ ] Gửi đáp án.
- [ ] Chuyển sang câu tiếp theo hoặc hoàn tất quiz.
- [ ] Hiển thị màn hình `Quiz Completed`.
- [ ] Hiển thị điểm.
- [ ] Có thể bắt đầu lại quiz, tương ứng nút `Restart Quiz` trong ảnh mẫu.
- [ ] Đăng xuất thành công.

## 8. Luồng admin

- [ ] Đăng nhập bằng tài khoản có role `admin`.
- [ ] Chuyển đến admin dashboard.
- [ ] Hiển thị tên admin.
- [ ] Có trang quản lý quiz.
- [ ] Admin tạo, xem, sửa và xóa quiz.
- [ ] Có trang quản lý câu hỏi.
- [ ] Form tạo câu hỏi gồm:
  - Nội dung câu hỏi.
  - Các lựa chọn.
  - Chỉ số hoặc giá trị đáp án đúng.
  - Quiz chứa câu hỏi.
- [ ] Danh sách câu hỏi hiện có được hiển thị.
- [ ] Có nút Edit.
- [ ] Có nút Delete.
- [ ] Thêm câu hỏi xong danh sách cập nhật.
- [ ] Sửa xong giao diện hiển thị dữ liệu mới.
- [ ] Xóa xong câu hỏi biến mất.
- [ ] User thường không thể vượt quyền bằng cách nhập URL admin trực tiếp hoặc gọi API thủ công.

Lưu ý: câu mô tả frontend chỉ nói rõ admin CRUD `question`, nhưng phần backend yêu cầu CRUD cả `quizzes` và `questions`. Để bao phủ an toàn 100%, nên cung cấp giao diện admin CRUD cho cả hai.

## 9. Giao diện Bootstrap 5

- [ ] Bootstrap 5 được cài/import và thực sự sử dụng.
- [ ] Form login và signup rõ ràng.
- [ ] Dashboard có navigation.
- [ ] Form quản lý câu hỏi dễ sử dụng.
- [ ] Nút tạo, sửa, xóa có trạng thái và màu sắc hợp lý.
- [ ] Có loading indicator.
- [ ] Có thông báo lỗi và thành công.
- [ ] Giao diện không vỡ ở kích thước màn hình thông thường.
- [ ] Không bắt buộc phải sao chép chính xác từng pixel của ảnh minh họa, nhưng phải thể hiện đủ các luồng tương ứng.

## 10. Kiểm thử nghiệm thu

Trước khi nộp, cần chạy ít nhất các trường hợp sau:

- [ ] Đăng ký thành công.
- [ ] Không đăng ký được tài khoản trùng.
- [ ] Đăng nhập đúng thành công.
- [ ] Đăng nhập sai có thông báo.
- [ ] Chưa đăng nhập không xem được quiz.
- [ ] User thường không truy cập được admin.
- [ ] Admin tạo được quiz.
- [ ] Admin sửa được quiz.
- [ ] Admin xóa được quiz.
- [ ] Admin tạo được câu hỏi.
- [ ] Admin sửa được câu hỏi.
- [ ] Admin xóa được câu hỏi.
- [ ] Quiz hiển thị đúng các câu hỏi từ MongoDB.
- [ ] Người dùng chọn và gửi đáp án được.
- [ ] Điểm được tính chính xác.
- [ ] Restart quiz đặt lại đáp án và điểm.
- [ ] Logout vô hiệu hóa phiên/token.
- [ ] Dữ liệu không hợp lệ trả lỗi thích hợp.
- [ ] Backend không bị crash khi ID sai hoặc không tìm thấy dữ liệu.

## 11. Nên chuẩn bị khi nộp bài

Tài liệu không nêu cụ thể định dạng nộp bài, nhưng để giảng viên có thể chạy và chấm được, nên có:

- [ ] Thư mục backend và frontend rõ ràng.
- [ ] `README.md` hướng dẫn cài đặt và chạy.
- [ ] `.env.example`, không nộp mật khẩu thật hoặc secret thật.
- [ ] Danh sách biến môi trường như MongoDB URI, JWT secret và port.
- [ ] Script chạy server/client trong `package.json`.
- [ ] Dữ liệu seed gồm ít nhất:
  - Một tài khoản admin.
  - Một tài khoản user.
  - Một quiz.
  - Nhiều câu hỏi.
- [ ] Ghi tài khoản demo trong README.
- [ ] Mô tả các API hoặc kèm Postman collection.
- [ ] Ảnh hoặc video chứng minh các luồng chính.
- [ ] Không đưa `node_modules` vào source nộp.
- [ ] Kiểm tra project chạy được từ một máy mới theo README.

## Những phần không nên hiểu nhầm là bắt buộc

- `Article` và `Manage Articles` xuất hiện trong ảnh chụp nhưng không nằm trong phần yêu cầu bằng văn bản, nên không cần xây dựng để đạt assignment.
- Lưu lịch sử điểm lâu dài không được yêu cầu rõ. Tuy nhiên, tính và hiển thị điểm sau khi hoàn thành quiz nên làm vì ảnh mẫu có `Your score`.
- Giao diện không cần giống hệt ảnh, nhưng chức năng login user, làm quiz, hoàn thành quiz, login admin và CRUD câu hỏi phải chứng minh được.
- Trang 7 không có yêu cầu bổ sung.

Nếu hoàn thành toàn bộ các mục từ phần 1 đến phần 10, bạn đã bao phủ cả yêu cầu viết trong đề, tiêu chí chấm và các luồng chức năng thể hiện qua ảnh minh họa.