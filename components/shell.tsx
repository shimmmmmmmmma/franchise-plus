'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* Brand mark — حرف F انگلیسی با علامت + در گوشهٔ پایین                  */
/* ------------------------------------------------------------------ */

export function BrandMark({
  size = 34,
  tone = 'dark',
}: {
  size?: number;
  tone?: 'dark' | 'light';
}) {
  const stroke = tone === 'dark' ? '#142A3A' : '#F5F1E9';
  const accent = tone === 'dark' ? '#795636' : '#CBAC80';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label="نشان فرانچایز پلاس"
    >
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="7.5"
        stroke={stroke}
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <path d="M12 9h12v2.6h-9.2v4.6H23.4v2.6h-8.6V29H12z" fill={stroke} />
      <path
        d="M32.2 25.2v8.2M28.1 29.3h8.2"
        stroke={accent}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Brand({
  tone = 'dark',
  size = 34,
}: {
  tone?: 'dark' | 'light';
  size?: number;
}) {
  return (
    <span className="brand">
      <BrandMark size={size} tone={tone} />
      <span className="brand__text">
        <span className="brand__fa" style={tone === 'light' ? { color: '#F5F1E9' } : undefined}>
          فرانچایز پلاس
        </span>
        <span className="brand__en">FRANCHISE PLUS</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const navItems = [
  { href: '/', label: 'خانه' },
  { href: '/opportunities/', label: 'فرصت‌های نمایندگی' },
  { href: '/how-it-works/', label: 'چطور کار می‌کند' },
  { href: '/panel/admin/', label: 'پنل کارشناسان' },
  { href: '/dashboard/', label: 'پنل من' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);

  const closeMenu = (returnFocus = false) => {
    restoreFocus.current = returnFocus;
    setMenuOpen(false);
  };

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const isActive = (href: string) => {
    const raw = pathname || '/';
    // usePathname روی GitHub Pages شامل basePath است؛ برای مقایسه حذفش می‌کنیم
    const withoutBase = basePath && raw.startsWith(basePath) ? raw.slice(basePath.length) : raw;
    const current = withoutBase.replace(/\/$/, '') || '/';
    const clean = href.replace(/\/$/, '') || '/';
    if (clean === '/') return current === '/';
    return current === clean || current.startsWith(clean + '/');
  };

  // بستن منو با تغییر مسیر — بدون برگرداندن فوکوس به دکمهٔ منو
  useEffect(() => {
    restoreFocus.current = false;
    setMenuOpen(false);
  }, [pathname]);

  // قفل اسکرول، بستن با Escape، و حصر فوکوس داخل کشو
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const drawer = drawerRef.current;
    const focusables = () =>
      drawer
        ? Array.from(
            drawer.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((el) => el.tabIndex !== -1)
        : [];

    // فوکوس اولیه روی اولین لینک کشو
    const frame = window.requestAnimationFrame(() => {
      const items = focusables();
      (items[0] ?? drawer)?.focus({ preventScroll: true });
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active ? drawer?.contains(active) ?? false : false;

      if (!inside) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // بازگرداندن فوکوس به دکمهٔ منو پس از بستن آگاهانه (Escape یا دکمهٔ بستن)
  useEffect(() => {
    if (menuOpen || !restoreFocus.current) return;
    restoreFocus.current = false;
    toggleRef.current?.focus({ preventScroll: true });
  }, [menuOpen]);

  return (
    <>
      <div className="demo-strip" role="status">
        <b>پیش‌نمایش طراحی — Phase 1.</b> همهٔ برندها، پرونده‌ها و اعداد این نسخه ساختگی‌اند و
        هیچ دادهٔ واقعی نمایش داده نمی‌شود.
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" aria-label="فرانچایز پلاس — خانه">
            <Brand />
          </Link>

          <nav className="nav" aria-label="ناوبری اصلی">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav__link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header__cta">
            <Link href="/join/" className="btn btn--ghost btn--sm">
              ورود
            </Link>
            <Link href="/join/" className="btn btn--primary btn--sm">
              شروع پرونده
            </Link>
          </div>

          <button
            type="button"
            ref={toggleRef}
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            onClick={() => (menuOpen ? closeMenu(true) : setMenuOpen(true))}
          >
            <span className="menu-toggle__bar" aria-hidden="true" />
            <span className="menu-toggle__bar" aria-hidden="true" />
            <span className="menu-toggle__label" aria-hidden="true">
              منو
            </span>
          </button>
        </div>
      </header>

      <div
        className="drawer"
        id="mobile-nav"
        ref={drawerRef}
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        tabIndex={-1}
      >
        <div className="drawer__head container">
          <span className="micro" style={{ letterSpacing: '0.14em', color: 'var(--muted-2)' }}>
            منوی اصلی
          </span>
          <button
            type="button"
            className="drawer__close"
            onClick={() => closeMenu(true)}
            aria-label="بستن منو"
          >
            ×
          </button>
        </div>

        <nav className="container" aria-label="ناوبری موبایل">
          <ul className="drawer__list">
            {navItems.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="drawer__link"
                  data-active={isActive(item.href)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span className="drawer__n">{`۰${i + 1}`.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])}</span>
                  <span className="drawer__label">{item.label}</span>
                  <span className="drawer__arrow" aria-hidden="true">
                    ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="drawer__cta">
            <Link href="/join/" className="btn btn--primary" tabIndex={menuOpen ? 0 : -1}>
              شروع پرونده
              <span className="btn__arrow" aria-hidden="true">
                ←
              </span>
            </Link>
            <Link href="/join/" className="btn btn--ghost" tabIndex={menuOpen ? 0 : -1}>
              ورود به حساب
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Brand tone="light" />
            <p className="footer__desc">
              پلتفرم مدیریت و واگذاری نمایندگی در ایران. پرونده‌ها بررسی می‌شوند، طرفین احراز
              هویت می‌شوند و گفت‌وگو پس از تأیید تیم باز می‌شود.
            </p>
          </div>

          <div>
            <div className="footer__title">پلتفرم</div>
            <Link className="footer__link" href="/opportunities/">
              فرصت‌های نمایندگی
            </Link>
            <Link className="footer__link" href="/how-it-works/">
              چطور کار می‌کند
            </Link>
            <Link className="footer__link" href="/join/">
              ثبت‌نام و انتخاب نقش
            </Link>
          </div>

          <div>
            <div className="footer__title">برای واگذارکنندگان</div>
            <Link className="footer__link" href="/panel/franchisor/">
              ارسال اطلاعات برند
            </Link>
            <Link className="footer__link" href="/panel/franchisor/">
              وضعیت بررسی پیشنهاد
            </Link>
            <Link className="footer__link" href="/how-it-works/#franchisor">
              شرایط واگذاری
            </Link>
          </div>

          <div>
            <div className="footer__title">راهنما</div>
            <Link className="footer__link" href="/how-it-works/">
              مراحل احراز هویت
            </Link>
            <Link className="footer__link" href="/panel/admin/">
              نمای پنل کارشناسان
            </Link>
            <span className="footer__link" style={{ opacity: 0.5 }}>
              قوانین و حریم خصوصی (در انتظار متن حقوقی)
            </span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© ۱۴۰۵ فرانچایز پلاس — همهٔ حقوق محفوظ است.</span>
          <span>پیش‌نمایش طراحی Phase 1 · داده‌های ساختگی · بدون اتصال به درگاه پرداخت</span>
        </div>
      </div>
    </footer>
  );
}
