"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlarmClock,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Lock,
  RotateCcw,
  Target,
  Timer,
  X,
  XCircle,
} from "lucide-react";
import { MoodleHtml } from "@/components/common/moodle-html";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getQuestions, learnerModules, moduleHref, sectionShortName } from "@/lib/learning";
import { formatGrade, useLearning } from "@/lib/store/learning-store";
import { cn, formatClock, formatDateTime } from "@/lib/utils";
import type { StoredAttempt } from "@/types/moodle";
import { QuestionCard } from "./question-card";

type Mode = { name: "intro" } | { name: "attempt" } | { name: "summary" } | { name: "result"; attemptId: number } | { name: "review"; attemptId: number };

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <Icon className="size-5 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

/** QUIZ-03: đồng hồ đếm ngược, tự nộp khi hết giờ */
function useCountdown(deadline: number | null, onExpire: () => void) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const expireRef = useRef(onExpire);
  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);
  useEffect(() => {
    if (!deadline) return;
    let fired = false;
    const id = window.setInterval(() => {
      const t = Math.floor(Date.now() / 1000);
      setNow(t);
      if (!fired && t >= deadline) {
        fired = true;
        expireRef.current();
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);
  return deadline ? Math.max(0, deadline - now) : null;
}

/** QUIZ-01..06: giới thiệu, làm bài, đồng hồ, xác nhận nộp, kết quả, xem lại, mở phần tiếp theo */
export function QuizView({ courseId, cmid }: { courseId: number; cmid: number }) {
  const { course, quizzes, actions } = useLearning();
  const view = course(courseId)!;
  const item = quizzes.find((q) => q.module.id === cmid)!;
  const { summary, section, module } = item;
  const { quiz, attempts, draft } = summary;
  const questions = getQuestions(cmid);
  const [mode, setMode] = useState<Mode>({ name: "intro" });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const submit = () => {
    setConfirmOpen(false);
    const result = actions.submitAttempt(cmid);
    if (result) setMode({ name: "result", attemptId: result.id });
    window.scrollTo({ top: 0 });
  };

  const inAttempt = (mode.name === "attempt" || mode.name === "summary") && !!draft;
  const remaining = useCountdown(inAttempt && quiz.timelimit ? draft!.timestart + quiz.timelimit : null, submit);

  const playableIndex = view.playable.findIndex((m) => m.id === cmid);
  const nextLesson = playableIndex >= 0 ? view.playable[playableIndex + 1] : undefined;

  if (!module.uservisible) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
          <Lock className="size-6 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-xl font-bold">{quiz.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bài kiểm tra chưa mở. <MoodleHtml inline html={module.availabilityinfo ?? ""} />.
        </p>
        <Button asChild className="mt-6">
          <Link href={`/courses/${courseId}`}>Về trang khóa học</Link>
        </Button>
      </div>
    );
  }

  // ---------- Làm bài ----------
  if (inAttempt && draft) {
    const current = Math.min(Math.max(draft.current, 1), questions.length);
    const q = questions[current - 1];
    const answered = questions.filter((x) => (draft.answers[x.slot] ?? []).length > 0).length;
    const go = (n: number) => {
      actions.saveDraft(cmid, { current: n });
      setMode({ name: "attempt" });
    };
    const timer = remaining !== null && (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-sm font-semibold tabular-nums",
          remaining <= 60 ? "bg-danger-soft text-destructive" : "bg-muted text-foreground",
        )}
        aria-live="polite"
        aria-label={`Thời gian còn lại ${formatClock(remaining)}`}
      >
        <AlarmClock className="size-4" /> {formatClock(remaining)}
      </span>
    );

    return (
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
        <div className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  {quiz.name} • Lần làm thứ {draft.attempt}
                </p>
                <p className="text-xs text-muted-foreground">Câu trả lời được tự động lưu</p>
              </div>
              {timer}
            </div>

            {mode.name === "attempt" ? (
              <QuestionCard
                key={q.slot}
                question={q}
                total={questions.length}
                selected={draft.answers[q.slot] ?? []}
                onChange={(value) => actions.saveDraft(cmid, { answers: { ...draft.answers, [q.slot]: value } })}
              />
            ) : (
              <div>
                <h2 className="text-xl font-bold">Tóm tắt bài làm</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Đã trả lời {answered}/{questions.length} câu. Bấm vào một câu để quay lại sửa.
                </p>
                <ul className="mt-5 divide-y rounded-xl border">
                  {questions.map((x) => {
                    const done = (draft.answers[x.slot] ?? []).length > 0;
                    return (
                      <li key={x.slot}>
                        <button type="button" onClick={() => go(x.slot)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted/60">
                          <span className="w-12 shrink-0 font-semibold">Câu {x.slot}</span>
                          <span className="min-w-0 flex-1 truncate text-muted-foreground">{x.text}</span>
                          <span className={cn("shrink-0 text-xs font-semibold", done ? "text-success" : "text-warning")}>
                            {done ? "Đã trả lời" : "Chưa trả lời"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-1.5" aria-label="Danh sách câu hỏi">
              {questions.map((x) => {
                const done = (draft.answers[x.slot] ?? []).length > 0;
                const active = mode.name === "attempt" && x.slot === current;
                return (
                  <button
                    key={x.slot}
                    type="button"
                    onClick={() => go(x.slot)}
                    aria-label={`Câu ${x.slot}${done ? ", đã trả lời" : ""}`}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "size-9 rounded-md border text-sm font-semibold",
                      done ? "border-brand-200 bg-brand-50 text-brand-700" : "bg-card text-muted-foreground",
                      active && "border-primary ring-2 ring-primary/30",
                    )}
                  >
                    {x.slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t bg-card/95 px-4 py-3 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {mode.name === "attempt" ? `Câu ${current}/${questions.length}` : `${answered}/${questions.length} câu đã trả lời`}
            </p>
            <div className="flex gap-2">
              {mode.name === "attempt" ? (
                <>
                  <Button variant="outline" onClick={() => go(current - 1)} disabled={current === 1} aria-label="Câu trước">
                    <ChevronLeft /> <span className="hidden sm:inline">Câu trước</span>
                  </Button>
                  {current < questions.length ? (
                    <Button onClick={() => go(current + 1)}>
                      Câu tiếp <ChevronRight />
                    </Button>
                  ) : (
                    <Button onClick={() => setMode({ name: "summary" })}>Xem lại và nộp bài</Button>
                  )}
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => go(current)}>
                    <ArrowLeft /> <span className="hidden sm:inline">Quay lại làm bài</span>
                  </Button>
                  <Button onClick={() => setConfirmOpen(true)}>Nộp bài</Button>
                </>
              )}
            </div>
          </div>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nộp bài kiểm tra?</DialogTitle>
              <DialogDescription>
                {answered < questions.length
                  ? `Bạn còn ${questions.length - answered} câu chưa trả lời. Câu chưa trả lời được tính 0 điểm.`
                  : "Bạn đã trả lời tất cả câu hỏi."}{" "}
                Sau khi nộp, bạn không thể sửa câu trả lời.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Tiếp tục làm bài</Button>
              </DialogClose>
              <Button onClick={submit}>Nộp bài</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ---------- Kết quả và xem lại ----------
  const attemptOf = (id: number) => attempts.find((a) => a.id === id);

  if (mode.name === "review") {
    const a = attemptOf(mode.attemptId)!;
    return (
      <div className="px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <Button variant="ghost" onClick={() => setMode({ name: "result", attemptId: a.id })} className="-ml-3">
            <ArrowLeft /> Kết quả lần làm thứ {a.attempt}
          </Button>
          <h1 className="mt-2 text-2xl font-bold">Xem lại bài làm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {quiz.name} • Lần {a.attempt} • Điểm {formatGrade(a.grade)}/{quiz.grade}
          </p>
          <div className="mt-8 space-y-10">
            {questions.map((q) => (
              <QuestionCard key={q.slot} question={q} total={questions.length} selected={a.answers[q.slot] ?? []} review />
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3 border-t pt-6">
            <Button variant="outline" onClick={() => setMode({ name: "intro" })}>
              Về trang bài kiểm tra
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode.name === "result") {
    const a = attemptOf(mode.attemptId)!;
    return <ResultPanel courseId={courseId} cmid={cmid} attempt={a} onReview={() => setMode({ name: "review", attemptId: a.id })} onRetry={() => {
      actions.startAttempt(cmid);
      setMode({ name: "attempt" });
    }} onIntro={() => setMode({ name: "intro" })} />;
  }

  // ---------- Giới thiệu ----------
  const best = summary.best;
  const canStart = summary.attemptsLeft > 0;
  const startLabel = draft ? "Làm tiếp" : attempts.length ? `Làm lại (còn ${summary.attemptsLeft} lượt)` : "Bắt đầu làm bài";

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-muted-foreground">{section.name}</p>
        <h1 className="mt-1 text-3xl font-bold">{quiz.name}</h1>
        <p className="mt-2 text-muted-foreground">
          {sectionShortName(section)} | {questions.length} câu hỏi
        </p>
        <MoodleHtml html={quiz.intro} className="mt-4" />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={ClipboardCheck} label="Số câu" value={`${questions.length} câu`} />
          <Stat icon={Timer} label="Thời gian" value={quiz.timelimit ? `${quiz.timelimit / 60} phút` : "Không giới hạn"} />
          <Stat icon={Target} label="Điểm đạt" value={`${quiz.gradepass}/${quiz.grade}`} />
          <Stat icon={RotateCcw} label="Số lần làm" value={`${attempts.length}/${quiz.attempts} lần`} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Ghi nhận điểm cao nhất trong các lần làm.{quiz.timeclose ? ` Hạn nộp: ${formatDateTime(quiz.timeclose)}.` : ""}
        </p>

        {summary.passed && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            <div>
              <p className="font-semibold text-success">Bạn đã đạt bài kiểm tra này</p>
              <p className="mt-0.5 text-foreground/80">Điểm cao nhất {formatGrade(best!)}/{quiz.grade}. Bạn vẫn có thể làm lại để cải thiện điểm nếu còn lượt.</p>
            </div>
          </div>
        )}
        {summary.state === "exhausted" && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-danger-soft p-4 text-sm">
            <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Bạn đã dùng hết {quiz.attempts} lượt làm bài</p>
              <p className="mt-0.5 text-foreground/80">Liên hệ Phòng Đào tạo (daotao@vigo.vn) để được hướng dẫn ôn tập và mở thêm lượt.</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {canStart && (
            <Button
              size="lg"
              onClick={() => {
                actions.startAttempt(cmid);
                setMode({ name: "attempt" });
              }}
            >
              {startLabel}
            </Button>
          )}
          {nextLesson && (
            <Button asChild variant="ghost" size="lg">
              <Link href={moduleHref(courseId, nextLesson)}>Bỏ qua</Link>
            </Button>
          )}
        </div>

        {attempts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold">Các lần làm bài</h2>
            <div className="mt-3 overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Lần</th>
                    <th className="px-4 py-2.5 font-medium">Hoàn thành lúc</th>
                    <th className="px-4 py-2.5 font-medium">Thời gian làm</th>
                    <th className="px-4 py-2.5 font-medium">Điểm</th>
                    <th className="px-4 py-2.5 font-medium">Kết quả</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attempts.map((a) => {
                    const pass = a.grade >= quiz.gradepass;
                    const isBest = a.grade === best;
                    return (
                      <tr key={a.id} className={cn(isBest && "bg-brand-50/50")}>
                        <td className="px-4 py-3 font-medium">{a.attempt}</td>
                        <td className="px-4 py-3">{formatDateTime(a.timefinish)}</td>
                        <td className="px-4 py-3">{formatClock(a.timefinish - a.timestart)}</td>
                        <td className="px-4 py-3 font-semibold">
                          {formatGrade(a.grade)}/{quiz.grade}
                          {isBest && <span className="ml-2 text-xs font-medium text-primary">Cao nhất</span>}
                        </td>
                        <td className={cn("px-4 py-3 font-semibold", pass ? "text-success" : "text-destructive")}>{pass ? "Đạt" : "Chưa đạt"}</td>
                        <td className="px-4 py-3 text-right">
                          <button type="button" onClick={() => setMode({ name: "review", attemptId: a.id })} className="text-sm font-semibold text-primary hover:underline">
                            Xem lại
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/** QUIZ-05, QUIZ-06: kết quả Đạt/Chưa đạt, số lượt còn lại, mở phần tiếp theo */
function ResultPanel({
  courseId,
  cmid,
  attempt,
  onReview,
  onRetry,
  onIntro,
}: {
  courseId: number;
  cmid: number;
  attempt: StoredAttempt;
  onReview: () => void;
  onRetry: () => void;
  onIntro: () => void;
}) {
  const { course, quizzes } = useLearning();
  const view = course(courseId)!;
  const { summary, section } = quizzes.find((q) => q.module.id === cmid)!;
  const { quiz } = summary;
  const questions = getQuestions(cmid);
  const pass = attempt.grade >= quiz.gradepass;
  const correctCount = questions.filter((q) => {
    const sel = attempt.answers[q.slot] ?? [];
    const c = q.correct ?? [];
    return sel.length === c.length && sel.every((s) => c.includes(s));
  }).length;
  const nextSection = view.sections.find((s) => s.section === section.section + 1);
  const nextFirst = nextSection && learnerModules(nextSection).find((m) => m.modname !== "label");
  const firstOfSection = learnerModules(section).find((m) => m.modname !== "label");
  const known = questions.filter((q) => {
    const sel = attempt.answers[q.slot] ?? [];
    const c = q.correct ?? [];
    return sel.length === c.length && sel.every((s) => c.includes(s));
  });
  const review = questions.filter((q) => !known.includes(q));

  return (
    <div>
      <div className={cn("px-4 py-8 text-white sm:px-8 sm:py-10", pass ? "bg-brand-900" : "bg-player")}>
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-5">
          <div className={cn("flex size-16 shrink-0 items-center justify-center rounded-full", pass ? "bg-success" : "bg-white/10")}>
            {pass ? <Award className="size-8" /> : <X className="size-8" />}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">{pass ? "Chúc mừng, bạn đã đạt!" : "Chưa đạt, hãy ôn lại và làm lại nhé"}</h1>
            <p className="mt-1 text-white/80">
              Bạn trả lời đúng hoàn toàn {correctCount}/{questions.length} câu. Điểm {formatGrade(attempt.grade)}/{quiz.grade}, cần {quiz.gradepass}/{quiz.grade} để đạt.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat icon={Target} label="Điểm lần này" value={`${formatGrade(attempt.grade)}/${quiz.grade}`} />
            <Stat icon={Award} label="Điểm cao nhất" value={`${formatGrade(summary.best ?? 0)}/${quiz.grade}`} />
            <Stat icon={RotateCcw} label="Lượt còn lại" value={`${summary.attemptsLeft}/${quiz.attempts}`} />
          </div>

          {pass && nextSection && nextSection.uservisible && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
              <p>
                <span className="font-semibold text-success">{nextSection.name}</span> đã được mở. Bạn có thể học tiếp ngay.
              </p>
            </div>
          )}
          {pass && view.status === "completed" && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm">
              <Award className="mt-0.5 size-5 shrink-0 text-success" />
              <p>
                Bạn đã hoàn thành khóa <span className="font-semibold">{view.info.fullname}</span>. Chứng nhận đã sẵn sàng.
              </p>
            </div>
          )}
          {!pass && summary.attemptsLeft === 0 && !summary.passed && (
            <div className="mt-6 rounded-xl border border-destructive/30 bg-danger-soft p-4 text-sm">
              Bạn đã dùng hết lượt làm bài. Liên hệ Phòng Đào tạo (daotao@vigo.vn) để được hướng dẫn ôn tập và mở thêm lượt.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {pass && nextFirst && nextSection?.uservisible && (
              <Button asChild size="lg">
                <Link href={moduleHref(courseId, nextFirst)}>
                  Học {sectionShortName(nextSection)} <ChevronRight />
                </Link>
              </Button>
            )}
            {pass && view.status === "completed" && (
              <Button asChild size="lg">
                <Link href={`/certificates/${courseId}`}>
                  <Award /> Xem chứng nhận
                </Link>
              </Button>
            )}
            {!pass && summary.attemptsLeft > 0 && !summary.passed && (
              <Button size="lg" onClick={onRetry}>
                <RotateCcw /> Làm lại (còn {summary.attemptsLeft} lượt)
              </Button>
            )}
            <Button size="lg" variant="outline-primary" onClick={onReview}>
              Xem lại đáp án
            </Button>
            {!pass && firstOfSection && (
              <Button asChild size="lg" variant="ghost">
                <Link href={moduleHref(courseId, firstOfSection)}>Ôn lại bài học</Link>
              </Button>
            )}
            <Button size="lg" variant="ghost" onClick={onIntro}>
              Lịch sử làm bài
            </Button>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="size-4 text-success" /> Bạn đã nắm vững ({known.length})
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {known.map((q) => (
                  <li key={q.slot}>{q.text}</li>
                ))}
                {!known.length && <li>Chưa có câu nào đúng hoàn toàn.</li>}
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <XCircle className="size-4 text-destructive" /> Nội dung nên ôn lại ({review.length})
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {review.map((q) => (
                  <li key={q.slot}>{q.text}</li>
                ))}
                {!review.length && <li>Bạn đã trả lời đúng tất cả câu hỏi.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
