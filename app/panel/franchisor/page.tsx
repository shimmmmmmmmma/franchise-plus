import Link from 'next/link';
import { PanelShell } from '@/components/panel';
import { Notice, StatusBadge } from '@/components/ui';

const nav = [
  { label: 'وضعیت پیشنهاد برند', active: true },
  { label: 'پیشنهاد فرصت جدید', href: '/panel/franchisor/' },
  { label: 'اطلاعات برند', href: '/panel/franchisor/' },
  { label: 'مناطق قابل واگذاری', href: '/panel/franchisor/' },
  { label: 'گفت‌وگوها', href: '/chat/', count: '۱' },
  { label: 'انتشار فرصت', locked: true },
];

const steps = [
  { t: 'اطلاعات برند ارسال شد', meta: '۱۴۰۵/۰۸/۲۰', state: 'done', note: 'شرکت پخش آریانا' },
  { t: 'بررسی مدارک مالکیت و مجوزها', meta: 'در جریان — کارشناس احراز ۲', state: 'active', note: 'یک مجوز صنفی ناخوانا بود؛ نسخهٔ واضح لازم است.' },
  { t: 'تأیید برند', meta: '—', state: 'pending', note: 'پس از تأیید مدارک' },
  { t: 'ساخت رکورد رسمی توسط مدیر', meta: '—', state: 'pending', note: 'فقط Admin / Super Admin' },
  { t: 'انتشار فرصت در سایت', meta: '—', state: 'pending', note: 'پس از تأیید نهایی' },
];

export default function FranchisorPanel() {
  return (
    <PanelShell
      sideTitle="پنل واگذارکننده"
      nav={nav}
      title="پیشنهاد برند: خرده‌فروشی بارانا"
      subtitle="شناسهٔ پیشنهاد FP-۱۰۳۹ · ثبت‌شده در ۱۴۰۵/۰۸/۲۰"
      actions={<StatusBadge kind="wait">در انتظار بررسی مدارک</StatusBadge>}
      actionsLabel="وضعیت پیشنهاد"
    >
      <div style={{ marginBottom: '1.3rem' }}>
        <Notice kind="warn" title="مرز دسترسی">
          شما امکان ساخت یا انتشار مستقیم رکورد رسمی برند و فرصت را ندارید. این کار فقط توسط مدیر
          انجام می‌شود. اطلاعاتی که می‌فرستید «پیشنهاد خصوصی» است و تا تأیید، عمومی نمی‌شود.
        </Notice>
      </div>

      <div className="dash-grid">
        <section className="card-flat">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="h3">مسیر بررسی</div>
            <span className="micro muted">میانگین بررسی: ۲ تا ۴ روز کاری</span>
          </div>
          <div className="timeline">
            {steps.map((s) => (
              <div className="tl-item" key={s.t} data-state={s.state}>
                <span className="tl-dot" aria-hidden="true">
                  {s.state === 'done' ? '✓' : s.state === 'active' ? '!' : ''}
                </span>
                <div>
                  <div className="tl-title">{s.t}</div>
                  <div className="tl-meta">{s.meta}</div>
                  {s.note ? <p className="tl-note">{s.note}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div>
          <section className="card-flat">
            <div className="h3" style={{ marginBottom: '0.8rem' }}>
              اطلاعات ثبت‌شده
            </div>
            <div className="fact">
              <span className="fact__k">نام برند</span>
              <span className="fact__v">خرده‌فروشی بارانا</span>
            </div>
            <div className="fact">
              <span className="fact__k">حوزهٔ فعالیت</span>
              <span className="fact__v">خرده‌فروشی محصولات خانگی</span>
            </div>
            <div className="fact">
              <span className="fact__k">شهر اصلی</span>
              <span className="fact__v">تبریز</span>
            </div>
            <div className="fact">
              <span className="fact__k">شعب فعال</span>
              <span className="fact__v">۹</span>
            </div>
            <div className="fact">
              <span className="fact__k">سرمایهٔ اولیه</span>
              <span className="fact__v">۱.۵ تا ۲.۲ میلیارد تومان</span>
            </div>
            <div className="fact">
              <span className="fact__k">حق امتیاز</span>
              <span className="fact__v">۵٪ از فروش ماهانه</span>
            </div>
            <button type="button" className="btn btn--ghost btn--sm btn--block" style={{ marginTop: '0.9rem' }} disabled>
              ویرایش اطلاعات (پس از ارسال، قفل است)
            </button>
          </section>

          <section className="card-flat" style={{ marginTop: '0.9rem' }}>
            <div className="h3" style={{ marginBottom: '0.6rem' }}>
              مدارک
            </div>
            <div className="fact">
              <span className="fact__k">مدارک مالکیت</span>
              <span className="fact__v" style={{ color: 'var(--sage)' }}>
                تأیید شد
              </span>
            </div>
            <div className="fact">
              <span className="fact__k">مجوز صنفی</span>
              <span className="fact__v" style={{ color: '#8A6A2F' }}>
                نیازمند نسخهٔ واضح
              </span>
            </div>
            <div className="fact">
              <span className="fact__k">فایل لوگو</span>
              <span className="fact__v">ثبت شد</span>
            </div>
            <Link href="/panel/franchisor/" className="btn btn--bronze btn--sm btn--block" style={{ marginTop: '0.9rem' }}>
              بارگذاری نسخهٔ جدید مجوز
            </Link>
          </section>
        </div>
      </div>

      <section style={{ marginTop: '1.4rem' }}>
        <div className="card-flat">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: '0.7rem' }}>
            <div className="h3">پیشنهاد فرصت جدید</div>
            <span className="badge badge--muted">در انتظار تأیید برند</span>
          </div>
          <p className="small muted" style={{ lineHeight: 1.95 }}>
            تا زمانی که برند تأیید نشود، امکان ارسال پیشنهاد فرصت جدید فعال نیست. پس از تأیید،
            می‌توانید مناطق قابل واگذاری، شرایط مالی و الزامات متقاضی را برای هر فرصت ثبت کنید.
          </p>
          <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: '0.9rem' }} disabled>
            ارسال پیشنهاد فرصت (قفل)
          </button>
        </div>
      </section>
    </PanelShell>
  );
}
