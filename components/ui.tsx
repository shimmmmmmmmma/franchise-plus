import Link from 'next/link';
import type { Opportunity, StatusKind } from '@/lib/data';
import { faNum } from '@/lib/fa';

/* ---------------------------------------------------------------- */

export function StatusBadge({
  kind,
  children,
}: {
  kind: StatusKind;
  children: React.ReactNode;
}) {
  return <span className={`badge badge--${kind}`}>{children}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="section-head">
      <div className="section-head__copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="h2">{title}</h2>
        {body ? <p className="muted small" style={{ lineHeight: 1.95 }}>{body}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="btn btn--ghost btn--sm">
          {action.label}
          <span className="btn__arrow" aria-hidden="true">
            ←
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export function Notice({
  kind,
  title,
  children,
}: {
  kind: 'info' | 'warn' | 'ok';
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`notice notice--${kind}`} role="note">
      <span aria-hidden="true">{kind === 'ok' ? '✓' : kind === 'warn' ? '!' : 'i'}</span>
      <span>
        {title ? <b style={{ display: 'block', marginBottom: '0.15rem' }}>{title}</b> : null}
        {children}
      </span>
    </div>
  );
}

export function Crumbs({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav className="crumbs" aria-label="مسیر صفحه">
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          {i > 0 ? (
            <span className="crumbs__sep" aria-hidden="true">
              /
            </span>
          ) : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ---------------------------------------------------------------- */

export function OpportunityCard({ item }: { item: Opportunity }) {
  return (
    <article className="opp-card">
      <div className="opp-card__top">
        <div className="opp-card__brand">
          <span className="opp-card__logo" aria-hidden="true">
            {item.monogram}
          </span>
          <div>
            <div className="opp-card__name">{item.brand}</div>
            <div className="opp-card__sector">
              {item.sector} · {item.city}
            </div>
          </div>
        </div>
        <StatusBadge kind="ok">برند تأییدشده</StatusBadge>
      </div>

      <p className="small muted" style={{ lineHeight: 1.9 }}>
        {item.summary}
      </p>

      <div className="opp-card__facts">
        <div className="fact">
          <span className="fact__k">سرمایهٔ اولیه</span>
          <span className="fact__v">{item.investment}</span>
        </div>
        <div className="fact">
          <span className="fact__k">حق امتیاز دوره‌ای</span>
          <span className="fact__v">{item.royalty}</span>
        </div>
        <div className="fact">
          <span className="fact__k">متراژ پیشنهادی</span>
          <span className="fact__v">{item.area}</span>
        </div>
      </div>

      <div className="opp-card__foot">
        <span className="micro muted">
          {faNum(item.branches)} شعبهٔ فعال · انتشار {item.published}
        </span>
        <Link href={`/opportunities/${item.slug}/`} className="opp-card__cta">
          جزئیات فرصت
          <span aria-hidden="true">←</span>
        </Link>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- */

export function DemoMiniCard() {
  return (
    <div className="mini-card">
      <div className="mini-card__head">
        <span className="mini-card__title">کافه آرکا</span>
        <span className="badge badge--ok">تأییدشده</span>
      </div>
      <div className="mini-card__meta">غذا، رستوران و کافه · تهران، ونک</div>
      <div className="mini-card__rows">
        <div className="mini-row">
          <span>سرمایهٔ اولیه</span>
          <b>۲.۵ تا ۴ میلیارد تومان</b>
        </div>
        <div className="mini-row">
          <span>حق امتیاز</span>
          <b>۷٪ فروش ماهانه</b>
        </div>
        <div className="mini-row">
          <span>وضعیت درخواست شما</span>
          <b style={{ color: '#8A6A2F' }}>در بررسی تیم</b>
        </div>
      </div>
    </div>
  );
}

export function ProfileMiniCard() {
  return (
    <div className="mini-card mini-card--offset">
      <div className="mini-card__head">
        <span className="mini-card__title">پروندهٔ گیرندهٔ نمایندگی</span>
        <span className="badge badge--wait">{faNum(80)}٪</span>
      </div>
      <div className="mini-card__rows">
        <div className="mini-row">
          <span>احراز هویت</span>
          <b style={{ color: '#526B5C' }}>تأیید شد</b>
        </div>
        <div className="mini-row">
          <span>مدرک باقی‌مانده</span>
          <b>جواز کسب محل</b>
        </div>
        <div className="mini-row">
          <span>اقدام بعدی</span>
          <b>بارگذاری سند اجاره</b>
        </div>
      </div>
    </div>
  );
}
