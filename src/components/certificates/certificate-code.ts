/** Mã chứng nhận hiển thị trên bản in. Bản thật lấy từ plugin chứng nhận (CERT-01, điểm chưa chốt). */
export function certificateCode(courseId: number, userId: number, issued: number) {
  return `VG-${new Date(issued * 1000).getFullYear()}-${String(courseId).padStart(3, "0")}${String(userId).slice(-4)}`;
}
