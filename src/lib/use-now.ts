"use client";

import { useState } from "react";

/** Thời điểm hiện tại (giây) cố định trong vòng đời component, để render thuần (không gọi Date.now khi render). */
export function useNow(): number {
  const [now] = useState(() => Math.floor(Date.now() / 1000));
  return now;
}
