import Link from 'next/link';
import { opportunities } from '@/lib/data';
import { OpportunityLedger } from '@/components/ledger';
import { Reveal } from '@/components/reveal';
import { SectionHead, DemoMiniCard, Notice } from '@/components/ui';
import { BrandMark } from '@/components/shell';
import { faNum } from '@/lib/fa';

export default function HomePage() {
  return (
    <>
      {/* ---------------- MASTHEAD ---------------- */}
      <div className="masthead">
        <div className="container masthead__row">
          <span>پروندهٔ ویژه · واگذاری نمایندگی</span>
          <span className="nowrap">
            پاییز ۱۴۰۵ <i className="masthead__sep" aria-hidden="true" /> شمارهٔ ۰۱
          </span>
          <span className="nowrap">
            بازار ایران <i className="masthead__sep" aria-hidden="true" /> نسخهٔ نمایشی
          </span>
        </div>
      </div>

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <div className="issue-line">پلتفرم واگذاری نمایندگی · ایران</div>

            <h1 className="hero__title">
              <span className="hero__title-top">واگذاری نمایندگی</span>
              <span className="hero__title-main">
                با پروندهٔ <em>بررسی‌شده</em>
              </span>
            </h1>

            <p className="lead">
              فرانچایز پلاس سایت آگهی نیست. پروندهٔ هر دو طرف ساخته و بررسی می‌شود، هویت و مدارک
              احراز می‌شود، و گفت‌وگو فقط بعد از تأیید تیم باز می‌شود.
            </p>

            <div className="row gap-2 wrap">
              <Link href="/opportunities/" className="btn btn--primary">
                دیدن فرصت‌های نمایندگی
                <span className="btn__arrow" aria-hidden="true">
                  ←
                </span>
              </Link>
              <Link href="/how-it-works/" className="btn btn--ghost">
                چطور کار می‌کند
              </Link>
            </div>

            <p className="hero__note">
              ایجاد برند رسمی و انتشار فرصت فقط توسط مدیر مجاز انجام می‌شود. واگذارکننده اطلاعات
              برند را برای بررسی ارسال می‌کند و خودش چیزی منتشر نمی‌کند.
            </p>
          </div>

          <div className="hero__visual">
            <div className="plate" aria-hidden="true">
              <span className="hero__spine">FRANCHISE PLUS · 1405</span>

              <div className="plate__caption">
                <span>پالت مرجع · دادهٔ نمایشی</span>
                <span className="plate__swatches">
                  0A1011 · 0D2A49 · 2D6C92 · 3F4C45 · CB9B43 · A9C7B3
                </span>
              </div>

              <div className="plate__art">
                <span className="band band--ink" />
                <span className="band band--navy" />
                <span className="band band--blue" />
                <span className="band band--slate" />
                <span className="band band--gold" />
                <span className="band band--sage" />
                <span className="plate__mark">
                  <BrandMark size={104} tone="light" />
                </span>
              </div>
            </div>

            <div className="hero__float">
              <DemoMiniCard />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STEPS (dark) ---------------- */}
      <section className="section section--dark">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: '58ch', marginBottom: '2.6rem' }}>
              <span className="eyebrow">مسیر کار</span>
              <h2 className="h2" style={{ marginTop: '0.8rem', color: '#F5F1E9' }}>
                سه گام، بدون آگهی‌بازی و بدون واسطهٔ ناشناس
              </h2>
              <p className="muted small" style={{ marginTop: '0.7rem' }}>
                هر گام خروجی مشخصی دارد و تا گام قبل تأیید نشود، گام بعد باز نمی‌شود.
              </p>
            </div>
          </Reveal>

          <ol className="steps">
            <li className="step">
              <span className="step__n">گام ۰۱</span>
              <h3 className="step__title">پرونده بساز</h3>
              <p className="step__body">
                نقش را انتخاب می‌کنی و اطلاعات را کامل می‌کنی: بودجه، منطقه، مدارک — یا برای
                واگذارکننده: اطلاعات برند، مجوزها و شرایط مالی.
              </p>
            </li>
            <li className="step">
              <span className="step__n">گام ۰۲</span>
              <h3 className="step__title">بررسی و تطبیق</h3>
              <p className="step__body">
                کارشناس احراز، هویت و مدارک هر دو طرف را بررسی می‌کند. فرصت‌های مناسب با قواعد
                مشخص و قابل توضیح پیشنهاد می‌شوند.
              </p>
            </li>
            <li className="step">
              <span className="step__n">گام ۰۳</span>
              <h3 className="step__title">گفت‌وگوی کنترل‌شده</h3>
              <p className="step__body">
                درخواست همکاری توسط تیم بررسی می‌شود. بعد از تأیید، گفت‌وگو باز می‌شود و کارشناس
                پرونده با دسترسی محدود در آن حاضر است.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------------- OPPORTUNITIES — LEDGER ---------------- */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="فرصت‌ها"
            title="فرصت‌های منتشرشده"
            body="فقط فرصتی که مدیر تأیید و منتشر کرده باشد اینجا می‌آید. هر ردیف، اطلاعات مالی و شرایط را شفاف اعلام می‌کند."
            action={{ href: '/opportunities/', label: 'همهٔ فرصت‌ها' }}
          />

          <Reveal>
            <OpportunityLedger items={opportunities} />
          </Reveal>

          <p className="micro muted" style={{ marginTop: '0.9rem' }}>
            ردیف‌ها نمونهٔ طراحی‌اند؛ هیچ برند واقعی در این صفحه نیست.
          </p>
        </div>
      </section>

      {/* ---------------- PULL QUOTE ---------------- */}
      <section className="pullquote">
        <div className="container">
          <Reveal>
            <p className="pullquote__text">
              در بازار نمایندگی، اعتماد گران‌ترین کالاست؛ نه تعداد آگهی.
            </p>
            <div className="pullquote__cite">اصل طراحی محصول · فرانچایز پلاس</div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- WHY MANAGED ---------------- */}
      <section className="section">
        <div className="container grid grid--2" style={{ gap: 'clamp(2rem, 5vw, 4rem)' }}>
          <div>
            <span className="eyebrow">مدل مدیریت‌شده</span>
            <h2 className="h2" style={{ marginTop: '0.8rem', marginBottom: '1rem' }}>
              چرا این پلتفرم «مدیریت‌شده» است؟
            </h2>
            <p className="muted small" style={{ lineHeight: 2 }}>
              در بازار نمایندگی، بزرگ‌ترین ریسک دو طرف اطلاعات ناقص است: متقاضی نمی‌داند برند چقدر
              جدی است، برند نمی‌داند متقاضی توان اجرا دارد. پلتفرم این شکاف را با بررسی و ثبت
              شفاف پر می‌کند — نه با تعداد زیاد آگهی.
            </p>
            <div style={{ marginTop: '1.4rem' }}>
              <Notice kind="info" title="مرز روشن">
                هر کارمند فقط پرونده و گفت‌وگویی را می‌بیند که به او تخصیص داده شده است. هر مشاهدهٔ
                مدرک یا گفت‌وگوی حساس در گزارش ممیزی ثبت می‌شود.
              </Notice>
            </div>
          </div>

          <div>
            {[
              {
                t: 'دسترسی بر اساس نقش و پرونده',
                b: 'مجوز = نقش + مالکیت پرونده + تخصیص کارمند + هدف دسترسی. کنترل رابط کاربری کافی نیست؛ هر درخواست API هم بررسی می‌شود.',
              },
              {
                t: 'تأیید پرداخت از سمت سرور',
                b: 'بازگشت کاربر از درگاه به‌تنهایی اثبات پرداخت نیست. تراکنش یکتا، تطبیق مبلغ با فاکتور داخلی و جلوگیری از ثبت تکراری، شرط ثبت مالی است.',
              },
              {
                t: 'انتشار فقط با تأیید مدیر',
                b: 'رکورد رسمی برند و فرصت را فقط Admin می‌سازد. هیچ دکمه یا مسیر مستقیمی برای انتشار توسط واگذارکننده وجود ندارد.',
              },
              {
                t: 'تطبیق قابل توضیح',
                b: 'قواعد تطبیق نسخه‌دار و شفاف‌اند: بودجه، منطقه، صنعت و آمادگی. هیچ‌کس به‌صورت خودکار رد نمی‌شود و هیچ تضمینی برای موفقیت داده نمی‌شود.',
              },
            ].map((f, i) => (
              <div className="feature" key={f.t}>
                <span className="feature__n">{faNum(String(i + 1).padStart(2, '0'))}</span>
                <div>
                  <div className="feature__title">{f.t}</div>
                  <p className="feature__body">{f.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SCOPE HONESTY ---------------- */}
      <section className="section section--bone">
        <div className="container">
          <SectionHead
            eyebrow="وضعیت این نسخه"
            title="این نسخه چه هست و چه نیست"
            body="شفاف بودن دربارهٔ دامنهٔ کار، بخشی از خود محصول است. این صفحه یک پیش‌نمایش طراحی است، نه محصول نهایی."
          />
          <div className="grid grid--2">
            <div className="card-flat">
              <div className="h3" style={{ marginBottom: '0.7rem' }}>
                چه چیزی آماده است
              </div>
              <ul className="small muted" style={{ lineHeight: 2 }}>
                <li>— صفحات عمومی: خانه، فرصت‌ها، جزئیات فرصت، مسیر کار</li>
                <li>— جریان ثبت‌نام و انتخاب نقش</li>
                <li>— پنل گیرنده، پنل واگذارکننده، صف کارشناسان</li>
                <li>— گفت‌وگوی کنترل‌شده با حضور کارشناس</li>
                <li>— سیستم طراحی فارسی/RTL با هویت برند</li>
              </ul>
            </div>
            <div className="card-flat">
              <div className="h3" style={{ marginBottom: '0.7rem' }}>
                چه چیزی هنوز نیست
              </div>
              <ul className="small muted" style={{ lineHeight: 2 }}>
                <li>— محصول نهایی با دیتابیس و API واقعی</li>
                <li>— اتصال زندهٔ زرین‌پال (فقط در مرحلهٔ ۷ و پس از تأیید)</li>
                <li>— دادهٔ واقعی برند یا پرونده — همه ساختگی است</li>
                <li>— ویدئوی برند؛ جایگاه Hero برای آن آماده شده است</li>
                <li>— متن حقوقی، حریم خصوصی و قیمت‌گذاری</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FRANCHISOR BANNER ---------------- */}
      <section className="section section--plain" id="franchisor">
        <div className="container">
          <div className="banner">
            <div>
              <span className="eyebrow">برای واگذارکنندگان</span>
              <h2 className="h2" style={{ marginTop: '0.7rem', marginBottom: '0.6rem' }}>
                اطلاعات برندت را برای بررسی بفرست
              </h2>
              <p className="muted small" style={{ maxWidth: '58ch', lineHeight: 1.95 }}>
                پروندهٔ برند، مدارک مالکیت، شرایط مالی و مناطق قابل واگذاری را ثبت می‌کنی. تیم
                بررسی می‌کند و در صورت تأیید، رکورد رسمی برند و فرصت توسط مدیر ساخته و منتشر
                می‌شود.
              </p>
            </div>
            <Link href="/panel/franchisor/" className="btn btn--bronze">
              ارسال اطلاعات برند
              <span className="btn__arrow" aria-hidden="true">
                ←
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
