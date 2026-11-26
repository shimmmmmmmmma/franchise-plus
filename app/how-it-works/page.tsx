import type { Metadata } from 'next';
import Link from 'next/link';
import { Crumbs, Notice, SectionHead } from '@/components/ui';
import { Reveal } from '@/components/reveal';
import { faNum } from '@/lib/fa';

export const metadata: Metadata = {
  title: 'چطور کار می‌کند',
  description:
    'دو مسیر موازی در فرانچایز پلاس: مسیر گیرندهٔ نمایندگی و مسیر واگذارکننده — از ثبت‌نام و احراز هویت تا تطبیق، مذاکره و ثبت همکاری.',
  alternates: { canonical: '/how-it-works/' },
};

const receiverSteps = [  {
    t: 'ثبت‌نام و تأیید شماره',
    b: 'شمارهٔ همراه با رمز یک‌بارمصرف تأیید می‌شود. نشست کاربر روی سرور نگهداری می‌شود، نه در مرورگر.',
  },
  {
    t: 'تکمیل پروندهٔ گیرنده',
    b: 'اطلاعات هویتی، استان و شهر، بودجه، منبع تأمین سرمایه، صنایع موردعلاقه و وضعیت ملک.',
  },
  {
    t: 'بارگذاری مدارک',
    b: 'مدارک هویتی و مدارک محل. فایل‌ها در فضای خصوصی ذخیره می‌شوند و لینک عمومی ندارند.',
  },
  {
    t: 'بررسی کارشناس احراز',
    b: 'کارشناس مدارک را بررسی می‌کند. هر مشاهدهٔ مدرک در گزارش ممیزی ثبت می‌شود.',
  },
  {
    t: 'دریافت فرصت‌های هم‌خوان',
    b: 'قواعد تطبیق (بودجه، منطقه، صنعت، زمان آمادگی) نسخه‌دار و قابل توضیح‌اند.',
  },
  {
    t: 'ثبت درخواست و بررسی تیم',
    b: 'درخواست توسط تیم بررسی می‌شود. پذیرش یا رد با دلیل مناسب اعلام می‌شود.',
  },
  {
    t: 'گفت‌وگوی کنترل‌شده',
    b: 'پس از تأیید، گفت‌وگو باز می‌شود. کارشناس پرونده با دسترسی محدود حاضر است و پیام‌ها ثبت می‌شوند.',
  },
];

const franchisorSteps = [
  {
    t: 'ثبت‌نام و تشکیل پروندهٔ واگذارکننده',
    b: 'مشخصات مالک یا نمایندهٔ قانونی، اطلاعات برند و حوزهٔ فعالیت.',
  },
  {
    t: 'ارسال اطلاعات برند برای بررسی',
    b: 'لوگو، معرفی، مدارک مالکیت، مجوزها، سابقه و شعب فعال. این اطلاعات «پیشنهاد خصوصی» است.',
  },
  {
    t: 'ثبت شرایط مالی و مناطق',
    b: 'سرمایهٔ اولیه، حق امتیاز، تجهیزات، آموزش، تبلیغات و شرایط قرارداد و فسخ.',
  },
  {
    t: 'بررسی تیم و احراز برند',
    b: 'کارشناس مدارک و مجوزها را بررسی می‌کند. نتیجه با دلیل ثبت می‌شود.',
  },
  {
    t: 'ساخت رکورد رسمی توسط مدیر',
    b: 'فقط Admin یا Super Admin رکورد رسمی برند و فرصت را می‌سازد — نه واگذارکننده.',
  },
  {
    t: 'انتشار فرصت',
    b: 'پس از انتشار، فرصت در فهرست عمومی دیده می‌شود. پیش‌نویس و مدارک خصوصی هرگز عمومی نمی‌شوند.',
  },
];

function Track({
  label,
  title,
  steps,
}: {
  label: string;
  title: string;
  steps: { t: string; b: string }[];
}) {
  return (
    <div className="track">
      <div className="track__head">
        <span className="eyebrow">{label}</span>
        <h2 className="h3" style={{ marginTop: '0.5rem' }}>
          {title}
        </h2>
      </div>
      <ol className="track__list">
        {steps.map((s, i) => (
          <li className="track__item" key={s.t}>
            <span className="track__n">{faNum(String(i + 1).padStart(2, '0'))}</span>
            <div>
              <div className="track__title">{s.t}</div>
              <p className="track__note">{s.b}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="container">
      <Crumbs items={[{ href: '/', label: 'خانه' }, { label: 'چطور کار می‌کند' }]} />

      <header className="page-head">
        <span className="eyebrow">مسیر و قواعد</span>
        <h1 className="h1" style={{ marginTop: '0.8rem' }}>
          چطور کار می‌کند
        </h1>
        <p className="lead" style={{ marginTop: '0.7rem' }}>
          دو مسیر جدا برای گیرنده و واگذارندهٔ نمایندگی، با یک قاعدهٔ مشترک: هیچ‌چیز بدون بررسی و
          تأیید منتشر یا باز نمی‌شود.
        </p>
      </header>

      <Reveal>
        <div className="tracks">
          <Track label="مسیر گیرندهٔ نمایندگی" title="از پرونده تا گفت‌وگو" steps={receiverSteps} />
          <Track label="مسیر واگذارکننده" title="از پیشنهاد خصوصی تا انتشار" steps={franchisorSteps} />
        </div>
      </Reveal>

      <section className="section" id="privacy">
        <SectionHead
          eyebrow="محرمانگی"
          title="چه چیزی عمومی است و چه چیزی نه"
          body="این تفکیک در سطح API اجرا می‌شود، نه فقط در طراحی صفحه. مسیرهای عمومی فقط فیلدهای صریحاً عمومی‌شده را برمی‌گردانند."
        />
        <div className="grid grid--2" style={{ gap: 'clamp(1.5rem, 4vw, 3rem)' }}>
          <div className="privacy-col">
            <div className="row gap-2" style={{ marginBottom: '0.9rem' }}>
              <span className="badge badge--ok">عمومی</span>
            </div>
            <ul className="list-hair">
              <li>نام برند، صنعت، شهر و معرفی منتشرشده</li>
              <li>بازهٔ سرمایهٔ اولیه و شرایط مالی اعلام‌شده در فرصت</li>
              <li>الزامات متقاضی و پشتیبانی واگذارکننده</li>
              <li>وضعیت کلی فرصت (منتشرشده / بسته)</li>
            </ul>
          </div>
          <div className="privacy-col">
            <div className="row gap-2" style={{ marginBottom: '0.9rem' }}>
              <span className="badge badge--danger">هرگز عمومی نمی‌شود</span>
            </div>
            <ul className="list-hair">
              <li>پیش‌نویس‌ها و پرونده‌های ارسالی تأییدنشده</li>
              <li>شمارهٔ ملی، مدارک هویتی و مدارک مالکیت</li>
              <li>منبع سرمایه و اطلاعات تماس خصوصی</li>
              <li>متن گفت‌وگوها و پیام‌های طرفین</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="rules">
        <SectionHead eyebrow="قواعد" title="چهار قاعده که تغییر نمی‌کند" />
        <div className="rules">
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
            <div className="rule-item" key={c.t}>
              <span className="rule-item__n">{faNum(String(i + 1).padStart(2, '0'))}</span>
              <div className="rule-item__title">{c.t}</div>
              <p className="rule-item__body">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingBottom: '3.5rem' }}>
        <div className="callout-row" style={{ borderBlockStart: 0, paddingBlockStart: 0 }}>
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
        <Notice kind="warn" title="یادآوری">
          این نسخه پیش‌نمایش طراحی است؛ فرم‌ها به سروری وصل نیستند و هیچ اطلاعاتی ذخیره نمی‌کنند.
        </Notice>
      </section>
    </div>
  );
}
