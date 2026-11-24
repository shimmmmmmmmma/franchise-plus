'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crumbs, Notice } from '@/components/ui';

type Role = 'receiver' | 'franchisor' | null;

export default function JoinPage() {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('تهران');
  const [budget, setBudget] = useState('');
  const [sector, setSector] = useState('');
  const [legalName, setLegalName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [touched, setTouched] = useState(false);

  const phoneOk = /^09\d{9}$/.test(phone.replace(/\s/g, ''));
  const nameOk = name.trim().length >= 3;
  const legalOk = legalName.trim().length >= 3;
  const brandOk = brandName.trim().length >= 2;
  const formOk = role === 'receiver' ? nameOk && phoneOk && budget.trim() !== '' : legalOk && phoneOk && brandOk;

  return (
    <div className="container" style={{ paddingBottom: '3.5rem' }}>
      <Crumbs items={[{ href: '/', label: 'خانه' }, { label: 'شروع پرونده' }]} />

      <header style={{ paddingBottom: '1.8rem' }}>
        <span className="eyebrow">ثبت‌نام</span>
        <h1 className="h1" style={{ marginTop: '0.7rem' }}>
          پرونده‌ات را بساز
        </h1>
        <p className="lead" style={{ marginTop: '0.6rem' }}>
          اول نقش را انتخاب کن. فرم‌ها، مدارک و مراحل بررسی برای گیرنده و واگذارکننده متفاوت است.
        </p>
      </header>

      <ol className="row wrap gap-3" style={{ marginBottom: '1.6rem', fontSize: 'var(--fs-micro)' }}>
        {['انتخاب نقش', 'اطلاعات پایه', 'مدارک و بررسی'].map((s, i) => (
          <li
            key={s}
            className="row gap-2"
            style={{
              color: step === i + 1 ? 'var(--bronze)' : 'var(--muted-2)',
              fontWeight: step === i + 1 ? 600 : 400,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid currentColor',
                fontSize: '0.68rem',
              }}
            >
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section>
          <div className="role-grid">
            <button
              type="button"
              className="role-card"
              aria-pressed={role === 'receiver'}
              onClick={() => setRole('receiver')}
            >
              <span className="role-card__icon" aria-hidden="true">
                ◇
              </span>
              <span className="h3">گیرندهٔ نمایندگی هستم</span>
              <span className="small muted" style={{ lineHeight: 1.9 }}>
                می‌خواهم نمایندگی یک برند را بگیرم. بودجه، منطقه و مدارکم را ثبت می‌کنم و
                فرصت‌های هم‌خوان را می‌بینم.
              </span>
            </button>

            <button
              type="button"
              className="role-card"
              aria-pressed={role === 'franchisor'}
              onClick={() => setRole('franchisor')}
            >
              <span className="role-card__icon" aria-hidden="true">
                ▣
              </span>
              <span className="h3">واگذارکننده هستم</span>
              <span className="small muted" style={{ lineHeight: 1.9 }}>
                برند دارم و می‌خواهم نمایندگی واگذار کنم. اطلاعات برند را برای بررسی می‌فرستم؛
                انتشار با مدیر است.
              </span>
            </button>
          </div>

          <div className="row" style={{ marginTop: '1.6rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn--primary"
              disabled={!role}
              style={{ opacity: role ? 1 : 0.45, cursor: role ? 'pointer' : 'not-allowed' }}
              onClick={() => role && setStep(2)}
            >
              ادامه
              <span className="btn__arrow" aria-hidden="true">
                ←
              </span>
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <div className="join-grid">
          <form
            className="card-flat"
            style={{ padding: '1.6rem' }}
            onSubmit={(e) => {
              e.preventDefault();
              setTouched(true);
              if (formOk) setStep(3);
            }}
            noValidate
          >
            <div className="h3" style={{ marginBottom: '1.1rem' }}>
              {role === 'receiver' ? 'اطلاعات پایهٔ گیرندهٔ نمایندگی' : 'اطلاعات پایهٔ واگذارکننده'}
            </div>

            {role === 'receiver' ? (
              <>
                <div className={`field ${touched && !nameOk ? 'field--error' : ''}`}>
                  <label className="label" htmlFor="name">
                    نام و نام خانوادگی <span className="label__req">*</span>
                  </label>
                  <input
                    id="name"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: سارا رضایی"
                    aria-invalid={touched && !nameOk}
                    aria-describedby={touched && !nameOk ? 'name-err' : undefined}
                    autoComplete="name"
                  />
                  {touched && !nameOk ? (
                    <span className="error-msg" id="name-err">
                      نام را کامل وارد کن (حداقل ۳ حرف).
                    </span>
                  ) : (
                    <span className="help">همان‌طور که در مدارک هویتی آمده است.</span>
                  )}
                </div>

                <div className={`field ${touched && !phoneOk ? 'field--error' : ''}`}>
                  <label className="label" htmlFor="phone">
                    شمارهٔ همراه <span className="label__req">*</span>
                  </label>
                  <input
                    id="phone"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    inputMode="numeric"
                    dir="ltr"
                    style={{ textAlign: 'right' }}
                    aria-invalid={touched && !phoneOk}
                    aria-describedby={touched && !phoneOk ? 'phone-err' : 'phone-help'}
                    autoComplete="tel"
                  />
                  {touched && !phoneOk ? (
                    <span className="error-msg" id="phone-err">
                      شماره باید ۱۱ رقم و با ۰۹ شروع شود.
                    </span>
                  ) : (
                    <span className="help" id="phone-help">
                      برای تأیید، رمز یک‌بارمصرف پیامک می‌شود.
                    </span>
                  )}
                </div>

                <div className="grid grid--2" style={{ gap: '0 1rem' }}>
                  <div className="field">
                    <label className="label" htmlFor="city">
                      استان و شهر
                    </label>
                    <select id="city" className="select" value={city} onChange={(e) => setCity(e.target.value)}>
                      {['تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی'].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`field ${touched && budget.trim() === '' ? 'field--error' : ''}`}>
                    <label className="label" htmlFor="budget">
                      بودجهٔ قابل تخصیص <span className="label__req">*</span>
                    </label>
                    <input
                      id="budget"
                      className="input"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="مثال: ۲ میلیارد تومان"
                      aria-invalid={touched && budget.trim() === ''}
                    />
                    {touched && budget.trim() === '' ? (
                      <span className="error-msg">بازهٔ بودجه را وارد کن.</span>
                    ) : null}
                  </div>
                </div>

                <div className="field">
                  <label className="label" htmlFor="sector">
                    صنعت موردعلاقه
                  </label>
                  <select id="sector" className="select" value={sector} onChange={(e) => setSector(e.target.value)}>
                    <option value="">انتخاب کن</option>
                    {[
                      'غذا، رستوران و کافه',
                      'آموزش',
                      'سلامت و تندرستی',
                      'ورزش و باشگاه',
                      'زیبایی',
                      'خرده‌فروشی',
                      'فناوری و خدمات دیجیتال',
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className={`field ${touched && !legalOk ? 'field--error' : ''}`}>
                  <label className="label" htmlFor="legal">
                    نام مالک یا نمایندهٔ قانونی <span className="label__req">*</span>
                  </label>
                  <input
                    id="legal"
                    className="input"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="مثال: شرکت پخش آریانا"
                  />
                  {touched && !legalOk ? (
                    <span className="error-msg">نام مالک یا شرکت را کامل وارد کن.</span>
                  ) : (
                    <span className="help">مدارک مالکیت در مرحلهٔ بعد خواسته می‌شود.</span>
                  )}
                </div>

                <div className={`field ${touched && !brandOk ? 'field--error' : ''}`}>
                  <label className="label" htmlFor="brand">
                    نام برند <span className="label__req">*</span>
                  </label>
                  <input
                    id="brand"
                    className="input"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="مثال: کافه آرکا"
                  />
                  {touched && !brandOk ? <span className="error-msg">نام برند را وارد کن.</span> : null}
                </div>

                <div className={`field ${touched && !phoneOk ? 'field--error' : ''}`}>
                  <label className="label" htmlFor="phone2">
                    شمارهٔ همراه <span className="label__req">*</span>
                  </label>
                  <input
                    id="phone2"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    inputMode="numeric"
                    dir="ltr"
                    style={{ textAlign: 'right' }}
                    aria-invalid={touched && !phoneOk}
                  />
                  {touched && !phoneOk ? (
                    <span className="error-msg">شماره باید ۱۱ رقم و با ۰۹ شروع شود.</span>
                  ) : null}
                </div>

                <div className="field">
                  <label className="label" htmlFor="city2">
                    شهر اصلی برند
                  </label>
                  <select id="city2" className="select" value={city} onChange={(e) => setCity(e.target.value)}>
                    {['تهران', 'البرز', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <Notice kind="warn" title="دقت کن">
                  ارسال اطلاعات برند، به‌معنای انتشار آن نیست. پس از بررسی و تأیید، رکورد رسمی و
                  فرصت توسط مدیر ساخته و منتشر می‌شود.
                </Notice>
              </>
            )}

            <div className="row" style={{ justifyContent: 'space-between', marginTop: '1.4rem' }}>
              <button type="button" className="btn btn--quiet btn--sm" onClick={() => setStep(1)}>
                → بازگشت
              </button>
              <button type="submit" className="btn btn--primary">
                ثبت و ادامه
                <span className="btn__arrow" aria-hidden="true">
                  ←
                </span>
              </button>
            </div>
          </form>

          <aside>
            <div className="card-flat">
              <div className="micro muted" style={{ marginBottom: '0.6rem' }}>
                چرا این اطلاعات؟
              </div>
              <p className="small muted" style={{ lineHeight: 1.95 }}>
                هر فیلد برای یک تصمیم مشخص استفاده می‌شود: بودجه و منطقه برای تطبیق، مدارک برای
                احراز هویت، و اطلاعات تماس فقط برای اطلاع‌رسانی وضعیت پرونده.
              </p>
              <hr className="rule" style={{ margin: '1rem 0' }} />
              <ul className="small" style={{ lineHeight: 2 }}>
                <li>— دادهٔ هویتی فقط برای نقش‌های مجاز</li>
                <li>— مدارک در فضای خصوصی، بدون لینک عمومی</li>
                <li>— هر مشاهدهٔ مدرک، ممیزی می‌شود</li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {step === 3 && (
        <div className="card-flat" style={{ padding: '2rem', maxWidth: '720px' }}>
          <span className="badge badge--ok">پروندهٔ نمایشی ساخته شد</span>
          <h2 className="h2" style={{ marginTop: '1rem', marginBottom: '0.6rem' }}>
            {role === 'receiver' ? 'پروندهٔ گیرنده ثبت شد' : 'پیشنهاد برند ثبت شد'}
          </h2>
          <p className="muted small" style={{ lineHeight: 1.95 }}>
            {role === 'receiver'
              ? 'قدم بعدی: بارگذاری مدارک هویتی و مدارک محل. تا زمانی که مدارک تأیید نشوند، امکان ثبت درخواست همکاری فعال نمی‌شود.'
              : 'قدم بعدی: بارگذاری مدارک مالکیت و مجوزها. تیم بررسی می‌کند و نتیجه را اعلام می‌کند؛ انتشار فرصت فقط با مدیر است.'}
          </p>

          <div className="notice notice--info" style={{ marginTop: '1.2rem' }}>
            <span aria-hidden="true">i</span>
            <span>
              این یک پیش‌نمایش است: هیچ اطلاعاتی ارسال یا ذخیره نشد. در محصول نهایی، پیامک تأیید
              شماره و بارگذاری امن مدارک انجام می‌شود.
            </span>
          </div>

          <div className="row wrap gap-2" style={{ marginTop: '1.4rem' }}>
            <Link href={role === 'receiver' ? '/dashboard/' : '/panel/franchisor/'} className="btn btn--primary">
              دیدن پنل من
              <span className="btn__arrow" aria-hidden="true">
                ←
              </span>
            </Link>
            <button type="button" className="btn btn--ghost" onClick={() => setStep(1)}>
              شروع دوباره
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
