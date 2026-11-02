/**
 * Mốc thời gian của dữ liệu mẫu tính tương đối theo ngày hiện tại,
 * để lịch, hạn nộp và ngày cấp chứng nhận luôn hợp lý khi trình bày.
 */
export const DAY = 86400;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

export const TODAY = startOfToday();

/** Thời điểm `days` ngày so với hôm nay (âm là quá khứ), lúc hour:minute giờ địa phương. */
export function at(days: number, hour = 9, minute = 0): number {
  return TODAY + days * DAY + hour * 3600 + minute * 60;
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
