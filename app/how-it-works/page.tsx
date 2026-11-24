import Link from 'next/link';
import { Crumbs, Notice, SectionHead } from '@/components/ui';

const receiverSteps = [
  {
    t: '۱. ثبت‌نام و تأیید شماره',
    b: 'شمارهٔ همراه با رمز یک‌بارمصرف تأیید می‌شود. نشست کاربر روی سرور نگهداری می‌شود، نه در مرورگر.',
  },
  {
    t: '۲. تکمیل پروندهٔ گیرنده',
    b: 'اطلاعات هویتی، استان و شهر، بودجه، منبع تأمین سرمایه، صنایع موردعلاقه و وضعیت ملک.',
  },
  {
    t: '۳. بارگذاری مدارک',
    b: 'مدارک هویتی و مدارک محل. فایل‌ها در فضای خصوصی ذخیره می‌شوند و لینک عمومی ندارند.',
  },
  {
    t: '۴. بررسی کارشناس احراز',
    b: 'کارشناس مدارک را بررسی می‌کند. هر مشاهدهٔ مدرک در گزارش ممیزی ثبت می‌شود.',
  },
  {
    t: '۵. دریافت فرصت‌های هم‌خوان',
    b: 'قواعد تطبیق (بودجه، منطقه، صنعت، زمان آمادگی) نسخه‌دار و قابل توضیح‌اند.',
  },
  {
    t: '۶. ثبت درخواست و بررسی تیم',
    b: 'درخواست توسط تیم بررسی می‌شود. پذیرش یا رد با دلیل مناسب اعلام می‌شود.',
  },
  {
    t: '۷. گفت‌وگوی کنترل‌شده',
    b: 'پس از تأیید، گفت‌وگو باز می‌شود. کارشناس پرونده با دسترسی محدود حاضر است و پیام‌ها ثبت می‌شوند.',
  },
];

const franchisorSteps = [
  {
    t: '۱. ثبت‌نام و تشکیل پروندهٔ واگذارکننده',
    b: 'مشخصات مالک یا نمایندهٔ قانونی، اطلاعات برند و حوزهٔ فعالیت.',
  },
  {
    t: '۲. ارسال اطلاعات برند برای بررسی',
    b: 'لوگو، معرفی، مدارک مالکیت، مجوزها، سابقه و شعب فعال. این اطلاعات «پیشنهاد خصوصی» است.',
  },
  {
    t: '۳. ثبت شرایط مالی و مناطق',
    b: 'سرمایهٔ اولیه، حق امتیاز، تجهیزات، آموزش، تبلیغات و شرایط قرارداد و فسخ.',
  },
  {
    t: '۴. بررسی تیم و احراز برند',
    b: 'کارشناس مدارک و مجوزها را بررسی می‌کند. نتیجه با دلیل ثبت می‌شود.',
  },
  {
    t: '۵. ساخت رکورد رسمی توسط مدیر',
    b: 'فقط Admin یا Super Admin رکورد رسمی برند و فرصت را می‌سازد — نه واگذارکننده.',
  },
  {
    t: '۶. انتشار فرصت',
    b: 'پس از انتشار، فرصت در فهرست عمومی دیده می‌شود. پیش‌نویس و مدارک خصوصی هرگز عمومی نمی‌شوند.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container">
      <Crumbs items={[{ href: '/', label: 'خانه' }, { label: 'چطور کار می‌کند' }]} />

      <header style={{ paddingBottom: '2rem' }}>
        <span className="eyebrow">مسیر و قواعد</span>
        <h1 className="h1" style={{ marginTop: '0.7rem' }}>
          چطور کار می‌کند
        </h1>
        <p className="lead" style={{ marginTop: '0.6rem' }}>
          دو مسیر جدا برای گیرنده و واگذارندهٔ نمایندگی، با یک قاعدهٔ مشترک: هیچ‌چیز بدون بررسی و
          تأیید منتشر یا باز نمی‌شود.
        </p>
      </header>

      <div className="grid grid--2" style={{ gap: '2rem', paddingBottom: '2.5rem' }}>
        <section className="card-flat" style={{ padding: '1.6rem 1.5rem' }}>
          <span className="eyebrow">مسیر گیرندهٔ نمایندگی</span>
          <h2 className="h2" style={{ marginTop: '0.6rem', marginBottom: '1rem', fontSize: '1.35rem' }}>
            از پرونده تا گفت‌وگو
          </h2>
          <div className="timeline">
            {receiverSteps.map((s, i) => (
              <div className="tl-item" key={s.t} data-state={i === 0 ? 'active' : 'pending'}>
                <span className="tl-dot" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <div className="tl-title">{s.t}</div>
                  <p className="tl-note">{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-flat" style={{ padding: '1.6rem 1.5rem' }}>
          <span className="eyebrow">مسیر واگذارکننده</span>
          <h2 className="h2" style={{ marginTop: '0.6rem', marginBottom: '1rem', fontSize: '1.35rem' }}>
            از پیشنهاد خصوصی تا انتشار
          </h2>
          <div className="timeline">
            {franchisorSteps.map((s, i) => (
              <div className="tl-item" key={s.t} data-state={i === 0 ? 'active' : 'pending'}>
                <span className="tl-dot" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <div className="tl-title">{s.t}</div>
                  <p className="tl-note">{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="section" id="privacy">
        <SectionHead
          eyebrow="محرمانگی"
          title="چه چیزی عمومی است و چه چیزی نه"
          body="این تفکیک در سطح API اجرا می‌شود، نه فقط در طراحی صفحه. مسیرهای عمومی فقط فیلدهای صریحاً عمومی‌شده را برمی‌گردانند."
        />
        <div className="grid grid--2">
          <div className="card-flat">
            <div className="row gap-2" style={{ marginBottom: '0.7rem' }}>
              <span className="badge badge--ok">عمومی</span>
            </div>
            <ul className="small muted" style={{ lineHeight: 2.1 }}>
              <li>— نام برند، صنعت، شهر و معرفی منتشرشده</li>
              <li>— بازهٔ سرمایهٔ اولیه و شرایط مالی اعلام‌شده در فرصت</li>
              <li>— الزامات متقاضی و پشتیبانی واگذارکننده</li>
              <li>— وضعیت کلی فرصت (منتشرشده / بسته)</li>
            </ul>
          </div>
          <div className="card-flat">
            <div className="row gap-2" style={{ marginBottom: '0.7rem' }}>
              <span className="badge badge--danger">هرگز عمومی نمی‌شود</span>
            </div>
            <ul className="small muted" style={{ lineHeight: 2.1 }}>
              <li>— پیش‌نویس‌ها و پرونده‌های ارسالی تأییدنشده</li>
              <li>— شمارهٔ ملی، مدارک هویتی و مدارک مالکیت</li>
              <li>— منبع سرمایه و اطلاعات تماس خصوصی</li>
              <li>— متن گفت‌وگوها و پیام‌های طرفین</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="franchisor">
        <SectionHead
          eyebrow="قواعد"
          title="چهار قاعده که تغییر نمی‌کند"
        />
        <div className="grid grid--4">
          {[
            {
              t: 'انتشار با مدیر است',
              b: 'واگذارکننده درخواست می‌دهد؛ رکورد رسمی را Admin می‌سازد و منتشر می‌کند.',
            },
            {
              t: 'هر دو طرف احراز می‌شوند',
              b: 'بدون پروندهٔ بررسی‌شده، گفت‌وگو باز نمی‌شود — برای هر دو سمت.',
            },
            {
              t: 'پرداخت سمت سرور تأیید می‌شود',
              b: 'بازگشت از درگاه اثبات پرداخت نیست. تطبیق مبلغ با فاکتور داخلی الزامی است.',
            },
            {
              t: 'هر مشاهدهٔ حساس ممیزی می‌شود',
              b: 'مدرک، گفت‌وگو، تغییر نقش، تصمیم و اقدام مالی در گزارش ممیزی ثبت می‌شود.',
            },
          ].map((c, i) => (
            <div className="card-flat" key={c.t}>
              <div className="micro" style={{ color: 'var(--bronze)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                {`۰${i + 1}`}
              </div>
              <div className="h3" style={{ fontSize: '0.98rem', marginBottom: '0.4rem' }}>
                {c.t}
              </div>
              <p className="small muted" style={{ lineHeight: 1.9 }}>
                {c.b}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--plain" style={{ paddingBottom: '3.5rem' }}>
        <div className="banner">
          <div>
            <div className="h3" style={{ marginBottom: '0.4rem' }}>
              آماده‌ای پرونده‌ات را بسازی؟
            </div>
            <p className="muted small">
              نقش را انتخاب کن؛ فرم‌ها بر اساس نقش و اطلاعات لازم هر مسیر طراحی شده‌اند.
            </p>
          </div>
          <Link href="/join/" className="btn btn--primary">
            شروع پرونده
            <span className="btn__arrow" aria-hidden="true">
              ←
            </span>
          </Link>
        </div>
        <div style={{ marginTop: '1.2rem' }}>
          <Notice kind="warn" title="یادآوری">
            این نسخه پیش‌نمایش طراحی است؛ فرم‌ها به سروری وصل نیستند و هیچ اطلاعاتی ذخیره نمی‌کنند.
          </Notice>
        </div>
      </section>
    </div>
  );
}
