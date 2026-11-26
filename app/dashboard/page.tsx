import type { Metadata } from 'next';
import Link from 'next/link';
import { PanelShell } from '@/components/panel';
import { Notice, StatusBadge } from '@/components/ui';
import {
  opportunities,
  receiverProfile,
  myApplications,
  verificationTimeline,
} from '@/lib/data';
import { faNum } from '@/lib/fa';

export const metadata: Metadata = {
  title: 'پنل من — خلاصهٔ پرونده',
  description:
    'نمای پروندهٔ گیرندهٔ نمایندگی: وضعیت احراز هویت، فرصت‌های هم‌خوان، درخواست‌ها و قدم بعدی.',
  alternates: { canonical: '/dashboard/' },
};

const nav = [
  { label: 'خلاصهٔ پرونده', active: true },
  { label: 'فرصت‌های هم‌خوان', href: '/opportunities/', count: '۳' },
  { label: 'درخواست‌های من', href: '/dashboard/', count: '۲' },
  { label: 'مدارک و احراز هویت', href: '/dashboard/' },
  { label: 'گفت‌وگوها', href: '/chat/', count: '۱' },
  { label: 'اشتراک و صورتحساب', locked: true },
];

export default function DashboardPage() {
  return (
    <PanelShell
      sideTitle="پنل گیرندهٔ نمایندگی"
      nav={nav}
      title={`${receiverProfile.name}`}
      subtitle={`${receiverProfile.city} · ${receiverProfile.budget} · ${receiverProfile.sectors.join(' ، ')}`}
      actions={
        <Link href="/opportunities/" className="btn btn--ghost btn--sm">
          دیدن فرصت‌ها
        </Link>
      }
    >
      <div className="next-action" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="next-action__label">اقدام بعدی</div>
          <div className="next-action__title">دو مدرک باقی‌مانده تا تأیید نهایی پرونده</div>
          <p className="next-action__body">
            جواز کسب محل و سند یا اجاره‌نامهٔ ملک را بارگذاری کن. تا این مرحله، امکان ثبت درخواست
            همکاری برای فرصت‌های جدید فعال نمی‌شود.
          </p>
        </div>
        <div className="row gap-2">
          <span className="badge badge--wait">مهلت پیشنهادی: ۷ روز</span>
          <Link href="/dashboard/" className="btn btn--bronze btn--sm">
            بارگذاری مدارک
          </Link>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi__k">تکمیل پرونده</div>
          <div className="kpi__v">{faNum(receiverProfile.completeness)}٪</div>
          <div className="kpi__d">۲ مدرک باقی‌مانده</div>
        </div>
        <div className="kpi">
          <div className="kpi__k">وضعیت احراز هویت</div>
          <div className="kpi__v" style={{ fontSize: '1.15rem', color: 'var(--sage)' }}>
            تأییدشده
          </div>
          <div className="kpi__d">کارشناس احراز · ۱۴۰۵/۰۸/۰۵</div>
        </div>
        <div className="kpi">
          <div className="kpi__k">درخواست فعال</div>
          <div className="kpi__v">۲</div>
          <div className="kpi__d">۱ در بررسی تیم، ۱ در گفت‌وگو</div>
        </div>
        <div className="kpi">
          <div className="kpi__k">فرصت هم‌خوان جدید</div>
          <div className="kpi__v">۳</div>
          <div className="kpi__d">بر اساس بودجه و منطقه</div>
        </div>
      </div>

      <div className="dash-grid">
        <section className="card-flat">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="h3">مسیر پرونده</div>
            <StatusBadge kind="info">در جریان</StatusBadge>
          </div>
          <div className="timeline">
            {verificationTimeline.map((t) => (
              <div className="tl-item" key={t.title} data-state={t.state}>
                <span className="tl-dot" aria-hidden="true">
                  {t.state === 'done' ? '✓' : t.state === 'active' ? '!' : ''}
                </span>
                <div>
                  <div className="tl-title">{t.title}</div>
                  <div className="tl-meta">{t.meta}</div>
                  {t.note ? <p className="tl-note">{t.note}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-flat">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="h3">درخواست‌های من</div>
            <Link href="/dashboard/" className="micro" style={{ color: 'var(--bronze)' }}>
              همه
            </Link>
          </div>

          {myApplications.map((a) => (
            <div key={a.brand} style={{ paddingBlock: '0.75rem', borderTop: '1px solid var(--line-soft)' }}>
              <div className="row" style={{ justifyContent: 'space-between', gap: '0.6rem' }}>
                <Link href={`/opportunities/${a.slug}/`} style={{ fontWeight: 500, fontSize: '0.92rem' }}>
                  {a.brand}
                </Link>
                <StatusBadge kind={a.status}>{a.stage}</StatusBadge>
              </div>
              <div className="micro muted" style={{ marginTop: '0.3rem' }}>
                ثبت {a.date} — {a.note}
              </div>
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
            <Notice kind="info" title="گفت‌وگو باز است">
              برای «خرده‌فروشی بارانا» گفت‌وگو پس از تأیید باز شده است.{' '}
              <Link href="/chat/" style={{ color: 'var(--bronze)', textDecoration: 'underline' }}>
                ورود به گفت‌وگو
              </Link>
            </Notice>
          </div>
        </section>
      </div>

      <section style={{ marginTop: '1.5rem' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: '0.9rem' }}>
          <div className="h3">فرصت‌های هم‌خوان با پروندهٔ تو</div>
          <span className="micro muted">قواعد تطبیق نسخه ۱.۰ — بودجه، منطقه، صنعت</span>
        </div>

        <div className="grid grid--3">
          {opportunities.slice(0, 3).map((o) => (
            <div className="card-flat" key={o.slug}>
              <div className="row gap-2" style={{ marginBottom: '0.6rem' }}>
                <span className="opp-card__logo" style={{ width: 34, height: 34, fontSize: '0.9rem' }} aria-hidden="true">
                  {o.monogram}
                </span>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.92rem' }}>{o.brand}</div>
                  <div className="micro muted">{o.city}</div>
                </div>
              </div>
              <div className="fact">
                <span className="fact__k">سرمایهٔ اولیه</span>
                <span className="fact__v">{o.investment}</span>
              </div>
              <div className="fact">
                <span className="fact__k">دلیل تطبیق</span>
                <span className="fact__v" style={{ fontSize: '0.72rem' }}>
                  بودجه و منطقه
                </span>
              </div>
              <Link
                href={`/opportunities/${o.slug}/`}
                className="btn btn--ghost btn--sm btn--block"
                style={{ marginTop: '0.8rem' }}
              >
                بررسی فرصت
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PanelShell>
  );
}
