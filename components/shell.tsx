'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  const isActive = (href: string) => {
    const clean = href.replace(/\/$/, '');
    const current = (pathname || '/').replace(/\/$/, '') || '/';
    if (clean === '') return current === '';
    return current === clean || current.startsWith(clean + '/');
  };

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
        </div>
      </header>
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
