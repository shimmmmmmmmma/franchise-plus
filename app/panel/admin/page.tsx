import Link from 'next/link';
import { PanelShell } from '@/components/panel';
import { Notice, StatusBadge } from '@/components/ui';
import { adminKpis, adminQueue } from '@/lib/data';

const nav = [
  { label: 'صف بررسی', active: true, count: '۵' },
  { label: 'پرونده‌های احراز', href: '/panel/admin/' },
  { label: 'پیشنهادهای برند', href: '/panel/admin/', count: '۱' },
  { label: 'انتشار فرصت', href: '/panel/admin/' },
  { label: 'زرین‌پال و مالی', href: '/panel/admin/', locked: true },
  { label: 'گزارش ممیزی', href: '/panel/admin/' },
];

export default function AdminPanel() {
  return (
    <PanelShell
      sideTitle="پنل کارشناسان و مدیر"
      nav={nav}
      title="صف بررسی"
      subtitle="نمای یک کارشناس با تخصیص پرونده — دسترسی هر نقش فقط به پرونده‌های تخصیص‌یافته"
      actions={
        <>
          <span className="badge badge--info">نقش نمایشی: Verification Officer</span>
          <button type="button" className="btn btn--ghost btn--sm">
            فیلترها
          </button>
        </>
      }
    >
      <div className="kpi-row">
        {adminKpis.map((k) => (
          <div className="kpi" key={k.k}>
            <div className="kpi__k">{k.k}</div>
            <div className="kpi__v">{k.v}</div>
            <div className="kpi__d">{k.d}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.3rem' }}>
        <Notice kind="info" title="محدودهٔ دید">
          این صف فقط پرونده‌هایی را نشان می‌دهد که به این کارشناس تخصیص داده شده یا هنوز تخصیص‌نیافته
          است. مشاهدهٔ مدارک هویتی، گفت‌وگو و تصمیم‌ها در گزارش ممیزی ثبت می‌شود.
        </Notice>
      </div>

      <div className="chips" style={{ marginBottom: '1rem' }} aria-hidden="true">
        <span className="chip" aria-pressed>
          همه
        </span>
        <span className="chip">در انتظار بررسی</span>
        <span className="chip">در حال مذاکره</span>
        <span className="chip">تأییدشده</span>
        <span className="chip">ردشده</span>
      </div>

      <div className="card-flat" style={{ padding: '0.4rem 1rem 0.8rem' }}>
        <table className="table">
          <caption>صف بررسی — ۵ پروندهٔ نمونه (دادهٔ ساختگی)</caption>
          <thead>
            <tr>
              <th scope="col">شناسه</th>
              <th scope="col">متقاضی / برند</th>
              <th scope="col">نقش</th>
              <th scope="col">موضوع</th>
              <th scope="col">شهر</th>
              <th scope="col">وضعیت</th>
              <th scope="col">کارشناس</th>
              <th scope="col">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {adminQueue.map((row) => (
              <tr key={row.id}>
                <td className="num" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--muted)' }}>
                  {row.id}
                </td>
                <td>
                  <div className="table__person">
                    <span className="avatar" aria-hidden="true">
                      {row.person.slice(0, 1)}
                    </span>
                    <span>{row.person}</span>
                  </div>
                </td>
                <td className="small muted">{row.role}</td>
                <td className="small">{row.item}</td>
                <td className="small muted">{row.city}</td>
                <td>
                  <StatusBadge kind={row.status}>{row.statusLabel}</StatusBadge>
                </td>
                <td className="small muted">{row.owner}</td>
                <td>
                  <Link href="/chat/" className="micro" style={{ color: 'var(--bronze)', whiteSpace: 'nowrap' }}>
                    بررسی
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid--2" style={{ marginTop: '1.4rem' }}>
        <section className="card-flat">
          <div className="h3" style={{ marginBottom: '0.7rem' }}>
            تصمیم‌های اخیر (نمونه)
          </div>
          <div className="timeline">
            <div className="tl-item" data-state="done">
              <span className="tl-dot" aria-hidden="true">
                ✓
              </span>
              <div>
                <div className="tl-title">کلینیک آرتمیس — تأیید مدارک برند</div>
                <div className="tl-meta">کارشناس احراز ۱ · ۱۴۰۵/۰۸/۱۵</div>
                <p className="tl-note">تصمیم با دلیل ثبت شد؛ رکورد رسمی توسط Admin ساخته شد.</p>
              </div>
            </div>
            <div className="tl-item" data-state="active">
              <span className="tl-dot" aria-hidden="true">
                !
              </span>
              <div>
                <div className="tl-title">درخواست سارا رضایی — کافه آرکا</div>
                <div className="tl-meta">در انتظار تخصیص · امروز</div>
                <p className="tl-note">اولویت: بررسی توان مالی و تطبیق با سرمایهٔ اولیهٔ فرصت.</p>
              </div>
            </div>
            <div className="tl-item" data-state="pending">
              <span className="tl-dot" aria-hidden="true" />
              <div>
                <div className="tl-title">پیشنهاد برند بارانا</div>
                <div className="tl-meta">در صف · ۱۴۰۵/۰۸/۲۰</div>
              </div>
            </div>
          </div>
        </section>

        <section className="card-flat">
          <div className="h3" style={{ marginBottom: '0.7rem' }}>
            ثبت ممیزی (نمونه)
          </div>
          <p className="small muted" style={{ marginBottom: '0.8rem', lineHeight: 1.95 }}>
            هر مشاهدهٔ سند، ورود به گفت‌وگوی حساس، تغییر نقش، تصمیم و اقدام مالی، یک رکورد
            تغییرناپذیر تولید می‌کند.
          </p>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">زمان</th>
                <th scope="col">کاربر</th>
                <th scope="col">اقدام</th>
                <th scope="col">هدف</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="micro muted">۱۰:۴۲</td>
                <td className="micro">کارشناس احراز ۲</td>
                <td className="micro">مشاهدهٔ مدرک</td>
                <td className="micro muted">FP-۱۰۳۹</td>
              </tr>
              <tr>
                <td className="micro muted">۱۰:۳۱</td>
                <td className="micro">مشاور ۱</td>
                <td className="micro">ورود به گفت‌وگو</td>
                <td className="micro muted">FP-۱۰۳۱</td>
              </tr>
              <tr>
                <td className="micro muted">۰۹:۵۸</td>
                <td className="micro">Admin</td>
                <td className="micro">انتشار فرصت</td>
                <td className="micro muted">آرکاد</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </PanelShell>
  );
}
