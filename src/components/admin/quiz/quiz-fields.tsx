"use client";

/**
 * Admin QUIZ-01: form cài đặt bài kiểm tra. 6 trường cốt lõi hiện sẵn (mở/đóng, thời gian làm, điểm đạt,
 * số lần làm, cách tính điểm) + Xem lại đáp án; trường đánh dấu Advanced nằm trong "Hiện thêm" của từng nhóm,
 * nhóm ít dùng thu gọn. Không bỏ field nào của Moodle (Safe Exam Browser đã tắt ở site).
 * Moodle: /course/modedit.php?update={cmid} (mod_quiz_mod_form).
 */
import { Input } from "@/components/ui/input";
import type { QuizSettings, ReviewItem, ReviewWhen } from "@/types/moodle-admin";
import { CheckRow, DateTimeField, DurationField, Field, FormSection, NativeSelect, ShowMore, Textarea } from "../common/form";

const WHEN: { key: ReviewWhen; label: string }[] = [
  { key: "during", label: "Trong khi làm" },
  { key: "immediately", label: "Ngay sau khi nộp" },
  { key: "open", label: "Sau đó, khi bài còn mở" },
  { key: "closed", label: "Sau khi bài đóng" },
];

const ITEMS: { key: ReviewItem; label: string }[] = [
  { key: "attempt", label: "Bài làm" },
  { key: "correctness", label: "Đúng hay sai" },
  { key: "marks", label: "Điểm" },
  { key: "rightanswer", label: "Đáp án đúng" },
  { key: "specificfeedback", label: "Phản hồi từng câu" },
  { key: "generalfeedback", label: "Giải thích chung" },
  { key: "overallfeedback", label: "Nhận xét tổng" },
];

export function QuizCoreSections({
  v,
  set,
  grade,
  errors,
  expanded,
}: {
  v: QuizSettings;
  set: (patch: Partial<QuizSettings>) => void;
  grade: number;
  errors: Record<string, string>;
  expanded: boolean;
}) {
  const setReview = (when: ReviewWhen, item: ReviewItem, val: boolean) => set({ review: { ...v.review, [when]: { ...v.review[when], [item]: val } } });
  return (
    <>
      <FormSection title="Thời gian" description="Mở, đóng và thời gian làm bài." defaultOpen key={`t${expanded}`}>
        <Field label="Mở bài" help="Trước thời điểm này học viên chưa làm được bài.">
          <DateTimeField value={v.timeopen} onChange={(t) => set({ timeopen: t })} />
        </Field>
        <Field label="Đóng bài" help="Hạn nộp. Hiện trên lịch và Bài kiểm tra của học viên." error={errors.timeclose}>
          <DateTimeField value={v.timeclose} onChange={(t) => set({ timeclose: t })} />
        </Field>
        <Field label="Thời gian làm bài">
          <DurationField value={v.timelimit} onChange={(t) => set({ timelimit: t })} />
        </Field>
        <ShowMore count={2}>
          <Field label="Khi hết giờ" htmlFor="q-overdue">
            <NativeSelect id="q-overdue" className="w-auto" value={v.overduehandling} onChange={(e) => set({ overduehandling: e.target.value as QuizSettings["overduehandling"] })}>
              <option value="autosubmit">Tự động nộp bài đang làm</option>
              <option value="graceperiod">Cho thêm thời gian để nộp, không sửa câu trả lời</option>
              <option value="autoabandon">Không tính lượt nếu chưa nộp</option>
            </NativeSelect>
          </Field>
          <Field label="Thời gian thêm để nộp">
            <DurationField value={v.graceperiod} onChange={(t) => set({ graceperiod: t })} />
          </Field>
        </ShowMore>
      </FormSection>

      <FormSection title="Điểm" description="Điểm đạt, số lần làm và cách tính điểm." defaultOpen key={`g${expanded}`}>
        <Field label="Điểm đạt" htmlFor="q-gradepass" hint={`Trên thang ${grade}. Dùng cho điều kiện hoàn thành và mở phần tiếp theo.`} error={errors.gradepass}>
          <Input id="q-gradepass" type="number" step="0.5" min={0} max={grade} className="w-28" value={v.gradepass} onChange={(e) => set({ gradepass: Number(e.target.value) })} />
        </Field>
        <Field label="Số lần làm" htmlFor="q-attempts">
          <NativeSelect id="q-attempts" className="w-auto" value={v.attempts} onChange={(e) => set({ attempts: Number(e.target.value) })}>
            <option value={0}>Không giới hạn</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} lần
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Cách tính điểm" htmlFor="q-grademethod" help="Áp dụng khi cho làm nhiều lần.">
          <NativeSelect id="q-grademethod" className="w-auto" value={v.grademethod} onChange={(e) => set({ grademethod: Number(e.target.value) as QuizSettings["grademethod"] })}>
            <option value={1}>Lần điểm cao nhất</option>
            <option value={2}>Trung bình các lần</option>
            <option value={3}>Lần đầu tiên</option>
            <option value={4}>Lần cuối cùng</option>
          </NativeSelect>
        </Field>
        <ShowMore count={1}>
          <Field label="Danh mục điểm" htmlFor="q-gradecat">
            <NativeSelect id="q-gradecat" className="w-auto" defaultValue="0">
              <option value="0">Không phân loại</option>
            </NativeSelect>
          </Field>
        </ShowMore>
      </FormSection>

      <FormSection title="Xem lại đáp án" description="Học viên thấy gì sau khi làm bài." defaultOpen key={`r${expanded}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr>
                <th className="py-2 pr-3 text-left font-medium text-muted-foreground">Thông tin</th>
                {WHEN.map((w) => (
                  <th key={w.key} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
                    {w.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((it) => (
                <tr key={it.key} className="border-t">
                  <td className="py-2 pr-3">{it.label}</td>
                  {WHEN.map((w) => (
                    <td key={w.key} className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={v.review[w.key][it.key]}
                        onChange={(e) => setReview(w.key, it.key, e.target.checked)}
                        aria-label={`${it.label}: ${w.label}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>
    </>
  );
}

export function QuizMoreSections({ v, set, expanded }: { v: QuizSettings; set: (patch: Partial<QuizSettings>) => void; expanded: boolean }) {
  return (
    <>
      <FormSection title="Bố cục" defaultOpen={expanded} key={`l${expanded}`}>
        <Field label="Trang mới sau mỗi" htmlFor="q-qpp">
          <NativeSelect id="q-qpp" className="w-auto" value={v.questionsperpage} onChange={(e) => set({ questionsperpage: Number(e.target.value) })}>
            <option value={0}>Không ngắt trang (mọi câu một trang)</option>
            {[1, 2, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n} câu
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Cách chuyển câu" htmlFor="q-nav">
          <NativeSelect id="q-nav" className="w-auto" value={v.navmethod} onChange={(e) => set({ navmethod: e.target.value as QuizSettings["navmethod"] })}>
            <option value="free">Tự do</option>
            <option value="seq">Lần lượt (không quay lại)</option>
          </NativeSelect>
        </Field>
      </FormSection>

      <FormSection title="Cách hoạt động của câu hỏi" defaultOpen={expanded} key={`b${expanded}`}>
        <Field label="Trộn phương án">
          <CheckRow checked={v.shuffleanswers} onChange={(c) => set({ shuffleanswers: c })} label="Có" />
        </Field>
        <Field label="Cách câu hỏi hoạt động" htmlFor="q-behaviour">
          <NativeSelect id="q-behaviour" className="w-auto" value={v.preferredbehaviour} onChange={(e) => set({ preferredbehaviour: e.target.value as QuizSettings["preferredbehaviour"] })}>
            <option value="deferredfeedback">Phản hồi sau khi nộp</option>
            <option value="immediatefeedback">Phản hồi ngay từng câu</option>
            <option value="interactive">Tương tác, nhiều lần thử</option>
            <option value="adaptive">Thích ứng</option>
            <option value="adaptivenopenalty">Thích ứng (không trừ điểm)</option>
            <option value="immediatecbm">Phản hồi ngay kèm mức tự tin</option>
          </NativeSelect>
        </Field>
        <Field label="Cho làm lại từng câu trong lượt">
          <CheckRow checked={v.canredoquestions} onChange={(c) => set({ canredoquestions: c })} label="Có" />
        </Field>
        <Field label="Lượt sau dựa trên lượt trước">
          <CheckRow checked={v.attemptonlast} onChange={(c) => set({ attemptonlast: c })} label="Có" />
        </Field>
      </FormSection>

      <FormSection title="Giao diện" defaultOpen={expanded} key={`a${expanded}`}>
        <Field label="Hiện ảnh người làm" htmlFor="q-pic">
          <NativeSelect id="q-pic" className="w-auto" value={v.showuserpicture} onChange={(e) => set({ showuserpicture: Number(e.target.value) as 0 | 1 | 2 })}>
            <option value={0}>Không</option>
            <option value={1}>Ảnh nhỏ</option>
            <option value={2}>Ảnh lớn</option>
          </NativeSelect>
        </Field>
        <Field label="Số chữ số thập phân của điểm" htmlFor="q-dp">
          <NativeSelect id="q-dp" className="w-auto" value={v.decimalpoints} onChange={(e) => set({ decimalpoints: Number(e.target.value) })}>
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Số chữ số thập phân điểm từng câu" htmlFor="q-qdp">
          <NativeSelect id="q-qdp" className="w-auto" value={v.questiondecimalpoints} onChange={(e) => set({ questiondecimalpoints: Number(e.target.value) })}>
            <option value={-1}>Giống điểm bài</option>
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Hiện các khối khi làm bài">
          <CheckRow checked={v.showblocks} onChange={(c) => set({ showblocks: c })} label="Có" />
        </Field>
      </FormSection>

      <FormSection title="Hạn chế thêm khi làm bài" defaultOpen={expanded} key={`x${expanded}`}>
        <Field label="Mật khẩu làm bài" htmlFor="q-pass">
          <Input id="q-pass" type="password" autoComplete="new-password" className="max-w-xs" placeholder="Để trống nếu không dùng" value={v.quizpassword} onChange={(e) => set({ quizpassword: e.target.value })} />
        </Field>
        <Field label="Chỉ cho phép địa chỉ mạng" htmlFor="q-subnet" hint="Ví dụ 10.0.0.0/8. Để trống nếu không giới hạn.">
          <Input id="q-subnet" className="max-w-xs" value={v.subnet} onChange={(e) => set({ subnet: e.target.value })} />
        </Field>
        <Field label="Chờ giữa lượt 1 và 2">
          <DurationField value={v.delay1} onChange={(t) => set({ delay1: t })} />
        </Field>
        <Field label="Chờ giữa các lượt sau">
          <DurationField value={v.delay2} onChange={(t) => set({ delay2: t })} />
        </Field>
        <Field label="Bảo mật trình duyệt" htmlFor="q-sec">
          <NativeSelect id="q-sec" className="w-auto" value={v.browsersecurity} onChange={(e) => set({ browsersecurity: e.target.value as QuizSettings["browsersecurity"] })}>
            <option value="-">Không</option>
            <option value="securewindow">Cửa sổ toàn màn hình có bảo mật JavaScript</option>
          </NativeSelect>
        </Field>
      </FormSection>

      <FormSection title="Nhận xét tổng" description="Lời nhận xét theo khoảng điểm." defaultOpen={expanded} key={`f${expanded}`}>
        <Field label="Từ 80%" htmlFor="q-fb1">
          <Textarea id="q-fb1" rows={2} placeholder="Ví dụ: Bạn đã nắm vững nội dung phần này." />
        </Field>
        <Field label="Dưới 80%" htmlFor="q-fb2">
          <Textarea id="q-fb2" rows={2} placeholder="Ví dụ: Xem lại video và bài đọc rồi làm lại." />
        </Field>
      </FormSection>
    </>
  );
}
