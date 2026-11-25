'use client';

import { useEffect, useRef } from 'react';

/**
 * ظاهر شدن هدفمند هنگام اسکرول — بدون کتابخانه، با احترام به prefers-reduced-motion.
 *
 * اصل مهم: محتوا پیش‌فرض دیده می‌شود. پنهان‌سازی فقط وقتی اعمال می‌شود که
 * جاوااسکریپت واقعاً در حال اجرا باشد (کلاس `js` روی <html>) و عنصر هنوز
 * به دید نرسیده باشد. اگر اسکریپت دیر برسد، چیزی از دست نمی‌رود.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.dataset.shown = 'true';
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show();
      return;
    }

    // اگر همان لحظه در دید است، بدون تأخیر نشان بده (بدون پرش بصری)
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inView) {
      window.setTimeout(show, delay);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          window.setTimeout(show, delay);
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    io.observe(el);

    // شبکهٔ اطمینان: اگر observe به هر دلیلی اجرا نشد، محتوا پنهان نماند
    const safety = window.setTimeout(show, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  );
}
