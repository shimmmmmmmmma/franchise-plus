import Link from 'next/link';
import { BrandMark } from '@/components/shell';

export const metadata = {
  title: 'صفحه پیدا نشد | فرانچایز پلاس',
};

export default function NotFound() {
  return (
    <div className="container">
      <div className="notfound">
        <div className="notfound__side">
          <span className="eyebrow">خطای مسیر</span>
          <div className="notfound__code">۴۰۴</div>
          <div className="notfound__mark" aria-hidden="true">
            <BrandMark size={72} tone="dark" />
          </div>
        </div>

        <div className="notfound__body">
          <h1 className="h1" style={{ marginBottom: '0.9rem' }}>
            این صفحه در پرونده نیست
          </h1>
          <p className="lead" style={{ maxWidth: '48ch' }}>
            نشانی‌ای که باز کردی وجود ندارد یا جابه‌جا شده است. در این نسخهٔ پیش‌نمایش، فقط چند
            مسیر مشخص ساخته شده‌اند.
          </p>

          <div className="notfound__links">
            <div>
              <div className="notfound__links-title">مسیرهای موجود</div>
              <ol className="notfound__list">
                <li>
                  <Link href="/">خانه</Link>
                  <span>معرفی پلتفرم و فهرست کوتاه فرصت‌ها</span>
                </li>
                <li>
                  <Link href="/opportunities/">فرصت‌های نمایندگی</Link>
                  <span>فهرست فیلترشدنی فرصت‌های منتشرشده</span>
                </li>
                <li>
                  <Link href="/how-it-works/">چطور کار می‌کند</Link>
                  <span>دو مسیر گیرنده و واگذارکننده</span>
                </li>
                <li>
                  <Link href="/join/">شروع پرونده</Link>
                  <span>انتخاب نقش و تکمیل اطلاعات</span>
                </li>
                <li>
                  <Link href="/dashboard/">پنل من</Link>
                  <span>نمای پروندهٔ گیرندهٔ نمایندگی</span>
                </li>
                <li>
                  <Link href="/panel/admin/">پنل کارشناسان</Link>
                  <span>صف بررسی و محدودهٔ دید</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="notfound__cta">
            <Link href="/" className="btn btn--primary">
              بازگشت به خانه
              <span className="btn__arrow" aria-hidden="true">
                ←
              </span>
            </Link>
            <Link href="/opportunities/" className="btn btn--ghost">
              دیدن فرصت‌ها
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
