/**
 * Nội dung HTML của các bài đọc (mod_page_get_pages_by_courses > content), theo cmid.
 * Cũng dùng để sinh file PDF tài liệu trong public/files (scripts/generate-assets.mjs).
 * Nội dung chuyên môn chỉ để tham khảo nội bộ, không thay thế chỉ định của bác sĩ.
 */
export const pageContents: Record<number, string> = {
  // ----- Overview Brand VIGO -----
  1613: `<h2>Tuần đầu tiên tại VIGO</h2>
<p>Chào mừng bạn. Sổ tay này giúp bạn biết cần làm gì trong tuần đầu và tìm ai khi cần hỗ trợ.</p>
<h3>Việc cần hoàn thành</h3>
<ol><li>Nhận tài khoản email, LMS và nhóm Zalo phòng ban.</li><li>Hoàn thành khóa <strong>Overview Brand VIGO</strong> trên LMS.</li><li>Gặp quản lý trực tiếp để thống nhất mục tiêu 90 ngày.</li><li>Đọc và ký xác nhận Quy tắc ứng xử.</li></ol>
<h3>Đầu mối hỗ trợ</h3>
<table><thead><tr><th>Nội dung</th><th>Đầu mối</th></tr></thead><tbody>
<tr><td>Tài khoản, thiết bị</td><td>Phòng Hành chính</td></tr>
<tr><td>Khóa học, lịch đào tạo</td><td>Phòng Đào tạo (daotao@vigo.vn)</td></tr>
<tr><td>Chế độ, hợp đồng</td><td>Phòng Nhân sự</td></tr></tbody></table>
<p>Ba giá trị bạn sẽ nghe nhắc nhiều: <strong>Khoa học</strong> trong từng lời tư vấn, <strong>Tận tâm</strong> với khách hàng và đối tác, <strong>Chính trực</strong> trong mọi cam kết.</p>`,
  1623: `<h2>Bản đồ sản phẩm theo nhu cầu</h2>
<p>Khi khách hàng hoặc đối tác nêu nhu cầu, hãy xác định trước nhóm nhu cầu rồi mới nói tới sản phẩm.</p>
<table><thead><tr><th>Nhu cầu</th><th>Nhóm giải pháp</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Phục hồi, tăng chất lượng da</td><td>PN tại phòng khám</td><td>Rejuran Healer</td></tr>
<tr><td>Vùng mắt mỏng, nếp nhăn nhỏ</td><td>PN chuyên vùng mắt</td><td>Rejuran I</td></tr>
<tr><td>Sẹo rỗ</td><td>PN nồng độ cao</td><td>Rejuran S</td></tr>
<tr><td>Duy trì tại nhà</td><td>Chăm sóc sau điều trị</td><td>Dòng dưỡng phục hồi</td></tr></tbody></table>
<h3>Lưu ý</h3><ul><li>Sản phẩm tiêm chỉ do bác sĩ chỉ định và thực hiện.</li><li>Không so sánh hạ thấp sản phẩm của thương hiệu khác.</li></ul>`,
  1633: `<h2>Quy tắc ứng xử</h2>
<p>Mọi nhân viên VIGO đại diện cho thương hiệu khi làm việc với khách hàng, phòng khám đối tác và trên mạng xã hội.</p>
<h3>Bảo mật thông tin</h3>
<ul><li>Không chia sẻ ảnh khách hàng khi chưa có đồng ý bằng văn bản.</li><li>Không đăng tài liệu nội bộ, giá nhập, chính sách đối tác lên kênh công khai.</li><li>Dữ liệu khách hàng chỉ lưu trên hệ thống được cấp.</li></ul>
<h3>Khi nhận khiếu nại</h3>
<ol><li>Lắng nghe, không tranh luận.</li><li>Ghi nhận đầy đủ thông tin.</li><li>Báo quản lý trong vòng 2 giờ làm việc.</li></ol>`,

  // ----- Nền tảng Rejuran và đánh giá da -----
  1313: `<h2>Ba thành phần quyết định chất lượng da</h2>
<p>Trung bì chứa <strong>nguyên bào sợi</strong> (fibroblast), tế bào sản xuất collagen, elastin và các thành phần của chất nền ngoại bào.</p>
<h3>Collagen</h3><p>Chiếm phần lớn khối lượng trung bì, tạo độ chắc. Từ khoảng 25 tuổi, lượng collagen giảm dần mỗi năm.</p>
<h3>Elastin</h3><p>Giúp da đàn hồi trở lại sau khi bị kéo giãn. Tia UV làm elastin thoái hóa nhanh.</p>
<h3>Chất nền ngoại bào</h3><p>Gồm acid hyaluronic và proteoglycan, giữ nước và là môi trường để tế bào hoạt động.</p>
<p><em>Ghi nhớ:</em> mục tiêu của các liệu pháp phục hồi là cải thiện môi trường cho nguyên bào sợi hoạt động tốt hơn.</p>`,
  1323: `<h2>PN và PDRN: ý chính cần nhớ</h2>
<table><thead><tr><th>Tiêu chí</th><th>PDRN</th><th>PN</th></tr></thead><tbody>
<tr><td>Chuỗi phân tử</td><td>Ngắn hơn</td><td>Dài hơn, tạo cấu trúc dạng lưới</td></tr>
<tr><td>Thời gian lưu tại mô</td><td>Ngắn</td><td>Dài hơn</td></tr>
<tr><td>Ứng dụng</td><td>Hỗ trợ lành thương</td><td>Phục hồi, trẻ hóa da, cải thiện sẹo</td></tr></tbody></table>
<h3>Cơ chế được mô tả trong tài liệu</h3>
<ul><li>Hỗ trợ hoạt động của nguyên bào sợi.</li><li>Giảm phản ứng viêm tại chỗ.</li><li>Tạo khung giữ nước trong mô.</li></ul>
<p>Khi tư vấn, dùng ngôn ngữ đơn giản: PN giúp da tự phục hồi từ bên trong, không phải chất làm đầy.</p>`,
  1333: `<h2>Phiếu đánh giá da chuẩn VIGO</h2>
<p>Phiếu gồm 5 mục, điền đầy đủ trước khi bác sĩ đề xuất liệu trình.</p>
<ol><li><strong>Thông tin chung:</strong> tuổi, nghề nghiệp, thời gian tiếp xúc ánh nắng.</li><li><strong>Tiền sử:</strong> dị ứng (đặc biệt cá, hải sản), bệnh lý, thuốc đang dùng, thủ thuật gần đây.</li><li><strong>Phân loại da:</strong> Fitzpatrick (I-VI), Glogau (I-IV).</li><li><strong>Tình trạng hiện tại:</strong> sắc tố, nếp nhăn, lỗ chân lông, sẹo, độ ẩm.</li><li><strong>Mong muốn của khách hàng:</strong> ghi đúng lời khách hàng.</li></ol>
<h3>Ảnh chụp</h3><p>Chụp 3 góc (thẳng, nghiêng trái, nghiêng phải), cùng ánh sáng, không trang điểm.</p>`,

  // ----- Rejuran Internal Training -----
  1113: `<h2>Rejuran khác gì filler và skinbooster HA</h2>
<p>Đây là câu hỏi khách hàng hỏi nhiều nhất. Hãy trả lời ngắn gọn bằng mục đích điều trị, không đi sâu vào thuật ngữ.</p>
<table><thead><tr><th>Tiêu chí</th><th>Rejuran (PN)</th><th>Skinbooster HA</th><th>Filler HA</th></tr></thead><tbody>
<tr><td>Mục đích chính</td><td>Phục hồi, cải thiện chất lượng da</td><td>Cấp ẩm</td><td>Làm đầy, tạo khối</td></tr>
<tr><td>Thay đổi hình dáng</td><td>Không</td><td>Không</td><td>Có</td></tr>
<tr><td>Liệu trình thường gặp</td><td>3 buổi, cách 2-4 tuần</td><td>2-3 buổi</td><td>1 buổi</td></tr></tbody></table>
<h3>Câu trả lời mẫu</h3>
<p>"Filler giúp làm đầy vùng bị hõm. Rejuran thì không làm đầy, mà giúp da khỏe hơn từ bên trong: da dày hơn, mịn hơn và đều màu hơn sau liệu trình."</p>
<h3>Ghi nhớ</h3><ul><li>Không hứa hẹn kết quả tuyệt đối.</li><li>Quyết định chỉ định luôn thuộc về bác sĩ.</li></ul>`,
  1123: `<h2>Chỉ định và chống chỉ định</h2>
<h3>Dòng sản phẩm</h3>
<table><thead><tr><th>Sản phẩm</th><th>Đặc điểm</th><th>Thường dùng cho</th></tr></thead><tbody>
<tr><td>Rejuran Healer</td><td>Dòng cơ bản</td><td>Phục hồi, trẻ hóa toàn mặt</td></tr>
<tr><td>Rejuran I</td><td>Dành cho vùng mắt</td><td>Nếp nhăn nhỏ, da mỏng quanh mắt</td></tr>
<tr><td>Rejuran S</td><td>Nồng độ cao</td><td>Sẹo rỗ</td></tr>
<tr><td>Rejuran HB</td><td>Có thêm thành phần gây tê</td><td>Khách hàng nhạy cảm với đau</td></tr></tbody></table>
<h3>Cần báo bác sĩ trước khi chỉ định</h3>
<ul><li>Tiền sử dị ứng cá, hải sản hoặc thành phần sản phẩm.</li><li>Đang mang thai hoặc cho con bú.</li><li>Đang có nhiễm trùng, viêm da cấp tại vùng điều trị.</li><li>Bệnh tự miễn, rối loạn đông máu, đang dùng thuốc chống đông.</li></ul>`,
  1133: `<h2>Kịch bản tư vấn mẫu: khách hàng lần đầu</h2>
<h3>Bước 1. Chào hỏi và tạo thiện cảm</h3><p>"Chào chị, em là Minh Anh. Hôm nay chị muốn cải thiện điều gì nhất cho làn da ạ?"</p>
<h3>Bước 2. Lắng nghe nhu cầu</h3><p>Ghi lại đúng lời khách hàng. Hỏi thêm về thói quen chăm sóc da và thời gian có thể dành cho liệu trình.</p>
<h3>Bước 3. Đánh giá da</h3><p>Dùng phiếu đánh giá chuẩn. Hỏi tiền sử dị ứng trước khi nói về sản phẩm.</p>
<h3>Bước 4. Giải thích giải pháp</h3><p>Nói về kết quả khách hàng quan tâm, sau đó mới nói về sản phẩm. Nêu rõ số buổi và phản ứng có thể gặp.</p>
<h3>Bước 5. Thống nhất và hẹn lịch</h3><p>Tóm tắt lại, hỏi khách hàng còn băn khoăn gì, hẹn lịch gặp bác sĩ.</p>`,
  1143: `<h2>Hướng dẫn chăm sóc sau liệu trình</h2>
<p>Nội dung chuẩn gửi khách hàng sau mỗi buổi điều trị.</p>
<h3>Trong 24 giờ đầu</h3><ul><li>Không trang điểm, không chạm tay lên vùng điều trị.</li><li>Có thể xuất hiện sẩn nhỏ, đỏ nhẹ, thường giảm dần sau 1-3 ngày.</li></ul>
<h3>Trong 72 giờ đầu</h3><ul><li>Tránh xông hơi, bơi, tập luyện ra nhiều mồ hôi.</li><li>Không dùng sản phẩm có retinoid, AHA, BHA.</li></ul>
<h3>Suốt liệu trình</h3><ul><li>Dùng kem chống nắng hằng ngày.</li><li>Dưỡng ẩm phục hồi theo hướng dẫn.</li></ul>
<p><strong>Liên hệ ngay</strong> nếu đau tăng dần, sưng nóng lan rộng, có mủ hoặc sốt.</p>`,

  // ----- An toàn và xử lý biến chứng -----
  1213: `<h2>Checklist an toàn trước thủ thuật</h2>
<ol><li>Xác nhận đúng khách hàng, đúng chỉ định.</li><li>Phiếu đánh giá da và cam kết đã ký.</li><li>Hỏi lại tiền sử dị ứng.</li><li>Kiểm tra hạn dùng, số lô sản phẩm.</li><li>Kiểm tra nhiệt độ bảo quản.</li><li>Vệ sinh tay đúng quy trình.</li><li>Chuẩn bị dụng cụ vô khuẩn.</li><li>Làm sạch và sát khuẩn vùng điều trị.</li><li>Chuẩn bị bộ xử trí phản vệ trong tầm tay.</li><li>Chụp ảnh trước điều trị.</li><li>Ghi nhận số lô vào hồ sơ.</li><li>Hướng dẫn chăm sóc sau thủ thuật.</li></ol>
<p>Không bỏ qua bước nào, kể cả khi khách hàng quen.</p>`,
  1223: `<h2>Phân biệt phản ứng và biến chứng</h2>
<table><thead><tr><th></th><th>Phản ứng thường gặp</th><th>Dấu hiệu cần báo bác sĩ</th></tr></thead><tbody>
<tr><td>Đau</td><td>Nhẹ, giảm dần</td><td>Tăng dần, dữ dội</td></tr>
<tr><td>Đỏ, sưng</td><td>Khu trú, giảm sau 1-3 ngày</td><td>Lan rộng, nóng, kéo dài</td></tr>
<tr><td>Màu da</td><td>Bầm nhỏ</td><td>Trắng bệch, tím lan, mảng lưới</td></tr>
<tr><td>Toàn thân</td><td>Không</td><td>Sốt, khó thở, nổi mề đay</td></tr></tbody></table>
<p>Khi nghi ngờ, luôn báo bác sĩ phụ trách. Không tự xử trí ngoài phạm vi được đào tạo.</p>`,
  1233: `<h2>Hướng dẫn điền mẫu báo cáo sự cố</h2>
<ul><li><strong>Thời gian, địa điểm:</strong> ghi chính xác giờ phát hiện.</li><li><strong>Khách hàng:</strong> mã khách hàng, không ghi số điện thoại trong báo cáo gửi rộng.</li><li><strong>Sản phẩm:</strong> tên, số lô, hạn dùng.</li><li><strong>Mô tả:</strong> diễn biến theo thời gian, kèm ảnh nếu có.</li><li><strong>Xử trí đã làm:</strong> ai xử trí, kết quả.</li></ul>
<p>Gửi báo cáo cho quản lý trực tiếp và Phòng Chuyên môn trong vòng <strong>24 giờ</strong>.</p>`,

  // ----- Kỹ thuật tiêm Rejuran trong Y tế -----
  1413: `<h2>Mốc giải phẫu cần nhớ</h2>
<p>Tài liệu tóm tắt cho buổi thực hành. Kỹ thuật tiêm chỉ được thực hiện bởi bác sĩ có chứng chỉ hành nghề.</p>
<h3>Các lớp mô vùng mặt</h3><ol><li>Da (thượng bì, trung bì)</li><li>Mô dưới da</li><li>Lớp cân cơ nông</li><li>Cơ</li><li>Màng xương</li></ol>
<h3>Vùng cần thận trọng</h3><ul><li>Vùng rãnh mũi má và quanh mũi.</li><li>Vùng thái dương.</li><li>Vùng giữa hai cung mày.</li></ul>`,
  1423: `<h2>So sánh nappage và bolus</h2>
<table><thead><tr><th></th><th>Nappage</th><th>Bolus</th></tr></thead><tbody>
<tr><td>Đặc điểm</td><td>Nhiều điểm nhỏ, nông</td><td>Ít điểm, lượng lớn hơn mỗi điểm</td></tr>
<tr><td>Ưu điểm</td><td>Phân bố đều</td><td>Ít điểm tiêm, nhanh</td></tr>
<tr><td>Lưu ý</td><td>Sẩn nhỏ nhiều hơn</td><td>Cần kỹ năng kiểm soát độ sâu</td></tr></tbody></table>
<p>Bác sĩ lựa chọn kỹ thuật theo vùng, tình trạng da và mong muốn của khách hàng.</p>`,
  1433: `<h2>Liệu trình tham khảo</h2>
<table><thead><tr><th>Vùng</th><th>Sản phẩm</th><th>Số buổi</th><th>Khoảng cách</th></tr></thead><tbody>
<tr><td>Toàn mặt</td><td>Rejuran Healer</td><td>3</td><td>2-4 tuần</td></tr>
<tr><td>Quanh mắt</td><td>Rejuran I</td><td>3</td><td>2-4 tuần</td></tr>
<tr><td>Sẹo rỗ</td><td>Rejuran S</td><td>3-4</td><td>3-4 tuần</td></tr></tbody></table>
<p>Liệu trình duy trì thường cân nhắc sau 6 tháng tùy đánh giá của bác sĩ.</p>`,

  // ----- Ứng dụng chuyên sâu và phối hợp -----
  1513: `<h2>Thứ tự phối hợp trong cùng buổi</h2>
<p>Nguyên tắc chung: thủ thuật tác động sâu và gây tổn thương nhiệt thực hiện trước, sản phẩm phục hồi đưa vào sau theo chỉ định của bác sĩ.</p>
<ul><li>Đánh giá lại da trước mỗi buổi phối hợp.</li><li>Ghi rõ thông số thiết bị đã dùng.</li><li>Tăng cường hướng dẫn chống nắng sau buổi phối hợp.</li></ul>`,
  1523: `<h2>Lưu ý khi phối hợp nhiều phương pháp</h2>
<ol><li>Kiểm tra khoảng cách với thủ thuật gần nhất.</li><li>Đánh giá hàng rào bảo vệ da.</li><li>Giải thích rõ cho khách hàng về thời gian hồi phục.</li><li>Ghi nhận đầy đủ vào hồ sơ điều trị.</li></ol>`,
  1533: `<h2>Khung phân tích ca lâm sàng</h2>
<ol><li><strong>Thông tin khách hàng:</strong> tuổi, loại da, nhu cầu.</li><li><strong>Đánh giá ban đầu:</strong> ảnh và phiếu đánh giá.</li><li><strong>Liệu trình:</strong> sản phẩm, kỹ thuật, số buổi.</li><li><strong>Kết quả:</strong> ảnh trước sau cùng điều kiện chụp.</li><li><strong>Bài học:</strong> điều gì làm tốt, điều gì cần cải thiện.</li></ol>`,
};
