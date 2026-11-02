import { cn } from "@/lib/utils";

/** Logo chữ tạm thời. Thay bằng file logo VIGO (svg) khi có. */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div className={cn("flex flex-col leading-none select-none", className)}>
      <span className={cn("text-2xl font-extrabold tracking-tight", inverted ? "text-white" : "text-brand-600")}>VIGO</span>
      <span className={cn("mt-0.5 text-[9px] font-semibold tracking-[0.25em]", inverted ? "text-white/80" : "text-brand-600")}>
        SCIENCE FOR CARE
      </span>
    </div>
  );
}
