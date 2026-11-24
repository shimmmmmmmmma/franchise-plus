# مشخصات API — فرانچایز پلاس (REST نسخهٔ ۱)

> این سند قرارداد مسیرها، داده و خطاهای API نسخهٔ ۱ برای تیم بک‌اند و یکپارچه‌سازی وب است. سند پیشرفت پروژه یا مجوز شروع کدنویسی نیست.

**نسخه:** 0.1 · **تاریخ:** 2026-11-25 · **وضعیت:** پیش‌نویس طراحی برای Phase 2 — هیچ endpointی پیاده‌سازی نشده است
**مبنا:** خط مبنای فنی تأییدشده (D-01) و مشخصات مالک محصول؛ مخزن `franchise-plus-platform/`

## فهرست

- [خلاصه](#خلاصه)
- [۱. دامنه، مبنا و وضعیت تصمیم‌ها](#۱-دامنه-مبنا-و-وضعیت-تصمیمها)
- [۲. قراردادهای عمومی](#۲-قراردادهای-عمومی)
- [۳. احراز هویت و نشست](#۳-احراز-هویت-و-نشست)
- [۴. پروندهٔ گیرندهٔ نمایندگی](#۴-پروندهٔ-گیرندهٔ-نمایندگی)
- [۵. پروندهٔ واگذارکننده](#۵-پروندهٔ-واگذارکننده)
- [۶. پیشنهاد برند و پیشنهاد فرصت](#۶-پیشنهاد-برند-و-پیشنهاد-فرصت)
- [۷. بررسی، رکورد رسمی و انتشار](#۷-بررسی-رکورد-رسمی-و-انتشار)
- [۸. درخواست همکاری](#۸-درخواست-همکاری)
- [۹. تطبیق](#۹-تطبیق)
- [۱۰. گفت‌وگو، جلسه و نتیجه](#۱۰-گفتوگو-جلسه-و-نتیجه)
- [۱۱. مالی، اشتراک، مشاوره، تبلیغات و زرین‌پال](#۱۱-مالی-اشتراک-مشاوره-تبلیغات-و-زرینپال)
- [۱۲. ماتریس خلاصهٔ دسترسی](#۱۲-ماتریس-خلاصهٔ-دسترسی)
- [۱۳. قرارداد پیاده‌سازی و پذیرش](#۱۳-قرارداد-پیادهسازی-و-پذیرش)
- [۱۴. ابهام‌ها و تصمیم‌های باز](#۱۴-ابهامها-و-تصمیمهای-باز)
- [پیوست الف: واژه‌نامه](#پیوست-الف-واژهنامه)
- [پیوست ب: ارجاع به مخزن](#پیوست-ب-ارجاع-به-مخزن)
- [پیوست ج: تاریخچهٔ نسخه](#پیوست-ج-تاریخچهٔ-نسخه)

## خلاصه

این سند قرارداد REST نسخهٔ ۱ را در ۹ گروه مسیر تعریف می‌کند: احراز هویت، پروندهٔ گیرنده، پروندهٔ واگذارکننده، پیشنهاد برند، بررسی و انتشار مدیر، درخواست، تطبیق، گفت‌وگو و مالی/زرین‌پال. سه قاعده در کل قرارداد تکرار شده است: واگذارکننده هیچ مسیر انتشار ندارد؛ مبلغ فاکتور فقط سمت سرور ساخته می‌شود؛ callback درگاه تا تأیید سمت سرور و تطبیق مبلغ، اثر مالی ایجاد نمی‌کند. همهٔ مسیرها پیشنهاد فنی برای Phase 2 هستند و در مخزن فعلی هیچ‌کدام پیاده نشده‌اند.

## ۱. دامنه، مبنا و وضعیت تصمیم‌ها

### ۱.۱ این سند چه چیزی را تعیین می‌کند

- مسیر، متد، نقش مجاز، ورودی، خروجی و خطاهای هر گروه API.
- قراردادهای مشترک: قالب پاسخ، کد خطا، صفحه‌بندی، idempotency، نسخه‌بندی و قواعد داده.
- ماشین حالت‌هایی که یکپارچه‌سازی به آن‌ها وابسته است.
- مرزهای منفی: مسیرهایی که نباید وجود داشته باشند.

این سند شامل مدل داده کامل، طرح جدول‌ها، متن حقوقی، قیمت‌گذاری، فرمول کمیسیون و متن قرارداد زرین‌پال نیست. این موارد در اسناد `DATABASE_SCHEMA.md` و `PROJECT_MASTER.md` و تصمیم‌های مالک جای دارند.

### ۱.۲ وضعیت تصمیم‌ها

| نوع | مورد | وضعیت و مرز |
|---|---|---|
| تصمیم قطعی محصول | بازار فقط ایران؛ رابط فقط فارسی و RTL | بدون تغییر؛ بر API اثر دارد: پیام خطا فارسی، تاریخ نمایش شمسی |
| تصمیم قطعی محصول | مدل Managed؛ بررسی مرکزی پرونده‌ها | جریان‌های تأیید و تخصیص بر همین مبنا طراحی شده‌اند |
| تصمیم قطعی محصول | ساخت برند رسمی و انتشار فرصت فقط Admin / Super Admin | در بخش ۶ و ۷ به‌صورت ممنوعیت مسیر و بررسی مجوز اجرا شده است |
| تصمیم قطعی محصول | احراز هویت هر دو طرف | پیش‌شرط درخواست و گفت‌وگو |
| تصمیم قطعی محصول | گفت‌وگو فقط پس از تأیید درخواست | در ماشین حالت درخواست و گفت‌وگو |
| تصمیم قطعی محصول | پرداخت زرین‌پال؛ تأیید سمت سرور | در بخش ۱۱ با invariantهای صریح |
| پیشنهاد فنی | REST نسخه‌بندی‌شده در `/api/v1`؛ قالب JSON؛ UUIDv7؛ صفحه‌بندی ترکیبی؛ idempotency | پس از پذیرش Phase 1 و در Phase 2 قابل اجرا؛ جایگزین آن نیازمند تصمیم ثبت‌شده است |
| پیشنهاد فنی | نشست سمت سرور با cookie و CSRF؛ بدون توکن در `localStorage` | جزئیات در `SECURITY_AND_ACCESS_CONTROL.md` |
| فرضیه | API روی زیردامنهٔ همان دامنهٔ وب سرو می‌شود (مثلاً `api.example.ir`) | اگر میزبان یا معماری شبکه تغییر کند، تنظیم cookie و CORS بازبینی می‌شود |
| فرضیه | حجم دادهٔ اولیه اجازهٔ صفحه‌بندی offset در صف‌های مدیریت را می‌دهد | با رشد داده، مهاجرت به cursor بدون شکستن قرارداد |
| نیازمند تأیید مالک | قیمت پلن‌ها، خدمات مشاوره، جایگاه تبلیغ، درصد کمیسیون، سیاست استرداد | هیچ عددی در این سند به‌عنوان تصمیم نوشته نشده است |
| نیازمند تأیید مالک | ارائه‌دهندهٔ پیامک، میزبان، محل داده، متن حقوقی و مدت نگهداری | فقط معیار بررسی در سند امنیت آمده است |
| نیازمند تأیید مالک | امکان فعال‌بودن هم‌زمان دو نقش گیرنده و واگذارکننده برای یک حساب | API هر دو پرونده را جدا نگه می‌دارد؛ فعال‌سازی هم‌زمان بدون تأیید مالک انجام نمی‌شود |
| نیازمند تأیید مالک | فهرست دقیق مدارک احراز و میزان اطلاعات مالی عمومی فرصت | ورودی‌ها به‌صورت حداقلی و قابل گسترش تعریف شده‌اند |

### ۱.۳ وضعیت فعلی مخزن

مخزن `franchise-plus-platform/` پیش‌نمایش استاتیک Phase 1 است: `next.config.mjs` خروجی `export` دارد و هیچ سرور API، دیتابیس، نشست یا اتصال پرداختی در آن نیست. صفحات از `lib/data.ts` می‌خوانند و فرم `app/join/page.tsx` فقط اعتبارسنجی سمت مرورگر دارد. بنابراین:

- هیچ‌یک از مسیرهای این سند «آماده» یا «تست‌شده» نیست؛ وضعیت همه «در انتظار مرحلهٔ ۲» است.
- اعتبارسنجی‌های موجود در `app/join/page.tsx` و `app/chat/page.tsx` امنیت نیستند و فقط رفتار نمایشی‌اند.
- اتصال صفحات به API در انتظار مرحلهٔ ۳ (وب عمومی) و مرحلهٔ ۴ (پنل‌ها) است.

## ۲. قراردادهای عمومی

### ۲.۱ مسیر پایه و قالب

| مورد | قرارداد |
|---|---|
| مسیر پایه | `https://<host>/api/v1` |
| قالب | JSON با `Content-Type: application/json; charset=utf-8` |
| اسلش انتهایی | مسیرهای API بدون `/` پایانی؛ درخواست با اسلش، `404` می‌گیرد |
| نام فیلدها | `lower_snake_case`؛ شناسه‌ها `*_id`؛ مبالغ `*_irr`؛ زمان‌ها `*_at` |
| متدها | `GET` خواندن؛ `POST` ساخت یا اقدام؛ `PATCH` ویرایش جزئی؛ `PUT` جایگزینی کامل مجموعه؛ `DELETE` حذف/ابطال |
| اثر جانبی | هیچ `GET`ی اثر جانبی ندارد؛ اقدام‌های حالت با `POST` انجام می‌شود |
| زبان پیام | `message` همیشه فارسی؛ `code` پایدار و انگلیسی |
| شناسهٔ درخواست | هدر `X-Request-Id` در پاسخ؛ در خطا نیز `error.request_id` |

### ۲.۲ پاسخ موفق و خطا

پاسخ یک شیء:

```json
{
  "data": {
    "id": "018f2c1e-7b3a-7c41-9d8e-2f6a1b0c9d42",
    "status": "submitted",
    "submitted_at": "2026-11-25T08:15:00Z"
  }
}
```

پاسخ فهرست:

```json
{
  "data": [],
  "meta": {
    "pagination": {
      "mode": "offset",
      "page": 1,
      "per_page": 20,
      "total": 0,
      "total_pages": 0
    }
  }
}
```

پاسخ خطا:

```json
{
  "error": {
    "code": "validation_error",
    "message": "ورودی معتبر نیست.",
    "fields": [
      {
        "path": "phone",
        "code": "invalid_format",
        "message": "شمارهٔ همراه باید با ۰۹ شروع شود و ۱۱ رقم باشد."
      }
    ],
    "request_id": "req_01J8Z3K4M5N6P7Q8R9S0T1"
  }
}
```

قواعد:

- `fields` فقط برای خطای اعتبارسنجی می‌آید و هرگز مقدار ورودی را بازنمی‌گرداند.
- پیام خطای عمومی نباید وجود یا نبود یک منبع را لو بدهد (بخش ۲.۷).
- خطای `5xx` هرگز جزئیات داخلی، پشتهٔ خطا یا نام جدول را برنمی‌گرداند.

### ۲.۳ کاتالوگ خطا

| HTTP | `code` | معنا | کاربرد |
|---|---|---|---|
| 400 | `malformed_request` | بدنهٔ JSON یا هدر لازم خراب است | همه |
| 401 | `unauthenticated` | نشست معتبر نیست | مسیرهای احرازشده |
| 401 | `session_expired` | نشست منقضی شده است | پس از idle یا absolute timeout |
| 401 | `otp_invalid` | کد یک‌بارمصرف نادرست است | تأیید شماره |
| 403 | `forbidden` | نقش یا دامنهٔ دسترسی اجازه نمی‌دهد | همه |
| 403 | `role_not_allowed` | نقش فعال برای این مسیر مجاز نیست | مسیرهای نقش‌محور |
| 403 | `mfa_required` | ورود کارمند نیازمند عامل دوم است | ورود کارکنان |
| 404 | `not_found` | منبع وجود ندارد یا در دامنهٔ دید بازیگر نیست | جلوگیری از IDOR |
| 405 | `method_not_allowed` | متد برای این مسیر تعریف نشده است | همه |
| 409 | `invalid_state_transition` | تغییر وضعیت از حالت فعلی مجاز نیست | درخواست، انتشار، پرداخت |
| 409 | `duplicate_resource` | منبع تکراری است (مثلاً درخواست فعال برای همان فرصت) | درخواست، برند |
| 409 | `idempotency_key_reuse` | همان کلید با بدنهٔ متفاوت ارسال شده است | مسیرهای idempotent |
| 409 | `active_attempt_exists` | تلاش پرداخت فعال برای فاکتور وجود دارد | پرداخت |
| 409 | `invoice_already_paid` | فاکتور قبلاً پرداخت شده است | پرداخت |
| 409 | `payment_amount_mismatch` | مبلغ تأییدشده با فاکتور نمی‌خواند | پرداخت |
| 410 | `otp_expired` | کد منقضی شده است | تأیید شماره |
| 410 | `upload_url_expired` | نشانی آپلود منقضی شده است | مدارک |
| 413 | `payload_too_large` | بدنه یا فایل بیش از حد مجاز است | آپلود، پیام |
| 415 | `unsupported_media_type` | نوع فایل یا بدنه پشتیبانی نمی‌شود | آپلود |
| 422 | `validation_error` | یک یا چند فیلد نامعتبر است | همه |
| 422 | `unknown_parameter` | پارامتر ناشناخته در query یا بدنه | همه |
| 423 | `account_suspended` | حساب توسط مدیر تعلیق شده است | ورود |
| 429 | `rate_limited` | سهمیهٔ درخواست تمام شده است | همه |
| 500 | `internal_error` | خطای پیش‌بینی‌نشده | همه |
| 502 | `provider_error` | پاسخ نامعتبر از سرویس بیرونی | زرین‌پال، پیامک |
| 503 | `service_unavailable` | سرویس موقتاً در دسترس نیست | همه |
| 504 | `provider_timeout` | سرویس بیرونی پاسخ نداد | زرین‌پال |

### ۲.۴ صفحه‌بندی، فیلتر و مرتب‌سازی

دو حالت صریح، بدون ترکیب:

| حالت | پارامترها | کاربرد | `meta.pagination` |
|---|---|---|---|
| Offset | `page` (پیش‌فرض ۱)، `per_page` (پیش‌فرض ۲۰، حداکثر ۱۰۰) | فهرست عمومی، صف‌های مدیریت، فاکتورها، درخواست‌ها | `mode`, `page`, `per_page`, `total`, `total_pages` |
| Cursor | `limit` (پیش‌فرض ۳۰، حداکثر ۱۰۰)، `cursor` | پیام‌ها، رویدادهای ممیزی، اعلان‌ها | `mode`, `next_cursor`, `has_more` |

قواعد:

- ارسال هم‌زمان `page` و `cursor` → `422 invalid_pagination`.
- `cursor` رشتهٔ مبهم و امضاشده است؛ کلاینت آن را تفسیر نمی‌کند.
- `sort` فقط از فهرست مجاز هر مسیر پذیرفته می‌شود؛ پیش‌فرض `-created_at`. `-` یعنی نزولی.
- فیلترهای ناشناخته → `422 unknown_parameter`؛ حذف بی‌صدای پارامتر مجاز نیست.
- جست‌وجوی متنی حداقل ۲ و حداکثر ۸۰ نویسه؛ نتیجهٔ خالی `200` با آرایهٔ خالی است، نه `404`.

### ۲.۵ Idempotency

| مورد | قرارداد |
|---|---|
| هدر | `Idempotency-Key` |
| قالب | ۱۶ تا ۱۲۸ نویسهٔ چاپی؛ پیشنهاد: UUIDv7 |
| دامنه | به ازای `actor + method + path`؛ کلیدهای دو کاربر متفاوت به هم مربوط نمی‌شوند |
| نگهداری | ۲۴ ساعت برای عملیات عمومی؛ ۷ روز برای پرداخت و استرداد |
| تکرار | همان پاسخ اصلی با هدر `Idempotent-Replay: true`؛ اثر جانبی دوباره اجرا نمی‌شود |
| بدنهٔ متفاوت با همان کلید | `409 idempotency_key_reuse` |
| خطای `5xx` | ذخیره نمی‌شود؛ تلاش مجدد با همان کلید مجاز است |
| جایگزین نیست | idempotency جای ماشین حالت و قید یکتای دیتابیس را نمی‌گیرد؛ هر دو لازم‌اند |

مسیرهای نیازمند کلید: ساخت درخواست، ساخت تلاش پرداخت، ساخت فاکتور دستی، انتشار/لغو انتشار، تصمیم بررسی، استرداد، تأیید آپلود مدرک، ارسال پیشنهاد برند. پیام گفت‌وگو به‌جای هدر، فیلد `client_message_id` دارد که در هر گفت‌وگو یکتاست.

### ۲.۶ نسخه‌بندی و سازگاری

| مورد | قرارداد |
|---|---|
| نسخه در مسیر | `/api/v1`؛ نسخهٔ کامل در URL، نه در هدر |
| تغییر سازگار | افزودن فیلد اختیاری، افزودن مقدار جدید به enum، افزودن مسیر | بدون تغییر نسخه |
| تغییر ناسازگار | حذف/تغییر معنا/تغییر نوع فیلد، تغییر رفتار خطا، تغییر پیش‌فرض | فقط `/api/v2` |
| کلاینت و enum ناشناخته | کلاینت باید مقدار ناشناخته را «نامشخص» نمایش دهد و نشکند | آزمون قرارداد |
| منسوخ‌سازی | هدرهای `Deprecation` و `Sunset`؛ حداقل ۹۰ روز اطلاع | پیش از حذف |
| نسخهٔ هم‌زمان | v1 و v2 تا پایان مهلت اعلام‌شده فعال می‌مانند | مهاجرت تدریجی |
| تغییرات | فایل `docs/api/CHANGELOG.md` در Phase 2 ساخته می‌شود | در انتظار مرحلهٔ ۲ |

### ۲.۷ احراز هویت و مجوز

- احراز نشست با cookie سمت سرور است؛ جزئیات در `SECURITY_AND_ACCESS_CONTROL.md` بخش ۷.
- درخواست‌های تغییردهنده باید هدر `X-CSRF-Token` داشته باشند؛ نبود یا ناهم‌خوانی → `403 forbidden`.
- API هر درخواست را مستقل بررسی می‌کند. پنهان‌کردن دکمه در UI مجوز نیست.
- `GET /auth/session` فهرست `permissions` را برای راهنمایی UI برمی‌گرداند؛ مرجع نهایی بررسی سمت سرور است.
- سیاست تفکیک خطا:
  - منبعی که بازیگر اصلاً به آن ادعای مالکیت/تخصیص ندارد → `404 not_found`.
  - منبعی که بازیگر می‌بیند اما اقدامش مجاز نیست → `403 forbidden`.
  - نقش اشتباه برای یک مسیر شناخته‌شده → `403 role_not_allowed`.
- هیچ مسیری `owner_id`، `role` یا `status` نهایی را از بدنهٔ کلاینت نمی‌پذیرد؛ این‌ها از نشست و ماشین حالت سمت سرور می‌آیند.

### ۲.۸ قواعد داده

| داده | قرارداد |
|---|---|
| پول | عدد صحیح در واحد **ریال** با پسوند `_irr`؛ `float` ممنوع؛ نمایش تومان فقط در UI و با تقسیم بر ۱۰ |
| ارز | فیلد `currency` همیشه `"IRR"` در نسخهٔ فعلی |
| تاریخ و زمان | ISO 8601 با `Z` برای زمان؛ `YYYY-MM-DD` برای تاریخ بی‌زمان؛ نمایش شمسی فقط در UI |
| شناسه | UUIDv7 به‌صورت رشته؛ `slug` فقط برای محتوای منتشرشده؛ کد نمایشی مانند `FP-1042` کلید مجوز نیست |
| تلفن | E.164 (`+98912...`) در API؛ UI ارقام فارسی را نرمال می‌کند |
| کد ملی | فقط نوشتنی در ورودی؛ در پاسخ `national_id_masked`؛ هرگز در فهرست، URL، لاگ یا اعلان |
| متن | UTF-8؛ بدون HTML؛ طول هر فیلد در جدول همان گروه |
| شمارهٔ کارت/حساب | API ذخیره نمی‌کند؛ درگاه پرداخت مسئول است |
| PII در query | ممنوع؛ جست‌وجوی تلفن/کد ملی فقط با `POST` و ثبت ممیزی |
| واحد پول در درگاه | تبدیل ریال/تومان فقط در لایهٔ adapter زرین‌پال، با آزمون sandbox؛ مقدار خام کلاینت هرگز به درگاه نمی‌رود |

### ۲.۹ ماشین‌های حالت مشترک

**پیشنهاد برند:**

| از | به | اقدام | نقش |
|---|---|---|---|
| `draft` | `submitted` | ارسال | واگذارکننده |
| `submitted` | `under_review` | تخصیص/شروع بررسی | VO، AD |
| `under_review` | `changes_requested` | درخواست اصلاح | VO، AD |
| `changes_requested` | `submitted` | ارسال نسخهٔ اصلاحی | واگذارکننده |
| `under_review` | `approved` | تأیید | VO پیشنهاد، AD تأیید نهایی |
| `under_review` | `rejected` | رد با دلیل | VO، AD |
| `draft` / `submitted` | `withdrawn` | انصراف | واگذارکننده |
| `approved` | `converted` | ساخت رکورد رسمی | AD/SA |

**فرصت:**

| از | به | اقدام | نقش |
|---|---|---|---|
| `draft` | `in_review` | ارسال برای بررسی | AD/SA |
| `in_review` | `approved` | تأیید محتوا | AD/SA |
| `approved` | `scheduled` | زمان‌بندی انتشار | AD/SA |
| `approved` / `scheduled` | `published` | انتشار | AD/SA |
| `published` | `paused` | توقف موقت | AD/SA |
| `published` / `paused` | `closed` | بستن | AD/SA |
| هر حالت | `archived` | بایگانی | AD/SA |

**درخواست همکاری:**

| از | به | اقدام | نقش |
|---|---|---|---|
| — | `submitted` | ثبت | گیرنده |
| `submitted` | `under_review` | تخصیص/شروع | AD، FC |
| `under_review` | `info_requested` | درخواست اطلاعات | AD، FC |
| `info_requested` | `under_review` | پاسخ متقاضی | گیرنده |
| `under_review` | `accepted` | پذیرش | AD، FC |
| `under_review` | `rejected` | رد با دلیل | AD، FC |
| `submitted` / `under_review` / `info_requested` | `withdrawn` | انصراف | گیرنده |
| `accepted` | `closed` | پایان پرونده | AD، FC |

**تلاش پرداخت:**

| از | به | اقدام | شرط |
|---|---|---|---|
| — | `initiated` | ساخت تلاش | فاکتور معتبر و بدون تلاش فعال |
| `initiated` | `redirected` | دریافت authority از درگاه | پاسخ موفق درگاه |
| `redirected` | `callback_received` | بازگشت کاربر | authority شناخته‌شده |
| `callback_received` | `verified` | تأیید سمت سرور | کد موفق + مبلغ منطبق + قید یکتا |
| `redirected` / `callback_received` | `failed` | شکست | رد درگاه یا انقضای تلاش |
| `initiated` / `redirected` | `expired` | انقضا | پایان مهلت |
| `callback_received` | `reconciliation_required` | مغایرت | مبلغ یا مرجع ناهم‌خوان |

`verified` حالت نهایی است و به حالت قبل برنمی‌گردد. اصلاح مالی فقط با رکورد جدید ledger و مغایرت ثبت‌شده انجام می‌شود.

### ۲.۱۰ کدهای نقش

| کد API | نقش فارسی | دامنهٔ پیش‌فرض |
|---|---|---|
| `super_admin` | Super Admin | ادارهٔ سیستم، نقش‌ها، ممیزی کامل |
| `admin` | Admin | گردش کار، انتشار، تخصیص، تصمیم |
| `verification_officer` | Verification Officer | احراز هویت و مدارک تخصیص‌یافته |
| `franchise_consultant` | Franchise Consultant | پرونده، تطبیق و گفت‌وگوی تخصیص‌یافته |
| `financial_officer` | Financial Officer | فاکتور، پرداخت، مغایرت |
| `support_officer` | Support Officer | حداقل داده برای پشتیبانی، با مجوز موقت |
| `franchise_receiver` | گیرندهٔ نمایندگی | پرونده، درخواست و تطبیق خود |
| `franchise_franchisor` | واگذارکننده | پرونده و پیشنهادهای خود؛ بدون انتشار |

یک کارمند می‌تواند چند نقش داشته باشد؛ مجموع مجوزها اتحاد نقش‌هاست، اما قید مالکیت/تخصیص همچنان اعمال می‌شود.

## ۳. احراز هویت و نشست

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `POST /auth/register` | عمومی | `role`، `full_name`، `phone`، `terms_version` | `202`؛ `challenge_id`، `next` | `422`, `429`, `409 duplicate_resource` |
| `POST /auth/otp/request` | عمومی | `phone`، `purpose`، `challenge_id` اختیاری | `202`؛ `challenge_id`، `expires_in`، `resend_after` | `422`, `429` |
| `POST /auth/otp/verify` | عمومی | `challenge_id`، `code` | `200`؛ کاربر، نقش‌ها، `session_expires_at` + `Set-Cookie` | `401 otp_invalid`, `410 otp_expired`, `429` |
| `GET /auth/session` | احرازشده | — | `actor`، `roles`، `permissions`، `profiles` | `401` |
| `POST /auth/logout` | احرازشده | — | `204` | `401` |
| `POST /auth/logout-all` | احرازشده | — | `204`؛ همهٔ نشست‌های دیگر باطل | `401` |
| `GET /auth/sessions` | احرازشده | — | فهرست دستگاه‌ها با `last_seen_at`، `ip_masked` | `401` |
| `DELETE /auth/sessions/{id}` | مالک | — | `204` | `401`, `404` |
| `POST /auth/staff/login` | عمومی | `email`، `password`، `totp_code` اختیاری | `200` + `Set-Cookie` | `401`, `403 mfa_required`, `423`, `429` |
| `POST /auth/password/change` | کارمند | `current_password`، `new_password` | `204`؛ باطل‌شدن سایر نشست‌ها | `401`, `422`, `429` |
| `POST /auth/phone/change/request` | احرازشده | `new_phone` | `202`؛ `challenge_id` | `409`, `429` |
| `POST /auth/phone/change/confirm` | احرازشده | `challenge_id`، `code` | `200` | `401`, `410`, `429` |

قواعد:

- `register` همیشه پاسخ یکسان می‌دهد؛ وجود قبلی شماره لو نمی‌رود. اگر شماره قبلاً ثبت شده باشد، پس از تأیید OTP نقش درخواستی به همان حساب افزوده یا بررسی می‌شود.
- `otp/request` برای شمارهٔ ناشناس نیز `202` می‌دهد؛ تفاوت رفتار فقط در ارسال یا عدم ارسال پیامک است.
- `purpose` یکی از `signup`، `login`، `phone_change`، `recovery` است و کد صادرشده به همان purpose و همان شماره مقید است.
- نشست فقط پس از `otp/verify` یا `staff/login` ساخته می‌شود؛ `register` به‌تنهایی نشست نمی‌دهد.
- تغییر شمارهٔ همراه نیازمند تأیید شمارهٔ جدید و اطلاع به شمارهٔ قبلی است.
- ورود کارکنان با ایمیل سازمانی و رمز است؛ برای نقش‌های حساس، `mfa_required` تا فعال‌شدن عامل دوم ادامه دارد.
- پاسخ `GET /auth/session` نمونه:

```json
{
  "data": {
    "actor": {
      "user_id": "018f2c1e-7b3a-7c41-9d8e-2f6a1b0c9d42",
      "display_name": "سارا رضایی",
      "phone_masked": "0912***4567"
    },
    "roles": ["franchise_receiver"],
    "permissions": ["receiver_profile:read", "application:create"],
    "profiles": {
      "receiver": {"status": "verified", "completeness": 80},
      "franchisor": null
    },
    "session_expires_at": "2026-12-02T08:15:00Z"
  }
}
```

## ۴. پروندهٔ گیرندهٔ نمایندگی

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `GET /me/receiver-profile` | گیرنده (مالک) | — | پروندهٔ کامل با فیلدهای ماسک‌شده | `401`, `403`, `404` |
| `PATCH /me/receiver-profile` | گیرنده (مالک) | فیلدهای بخش ۴.۱ | پروندهٔ به‌روزشده | `401`, `422`, `409` |
| `PUT /me/receiver-profile/preferences` | گیرنده (مالک) | `industry_ids[]`، `region_ids[]`، `budget_min_irr`، `budget_max_irr`، `ready_by` | مجموعهٔ جایگزین‌شده | `401`, `422` |
| `POST /me/receiver-profile/submit` | گیرنده (مالک) | `consent_version` | `202`؛ `verification_case_id`، `status` | `409`, `422` |
| `POST /me/documents` | گیرنده/واگذارکننده | `kind`، `filename`، `content_type`، `size_bytes`، `sha256` | `201`؛ `document_id`، `upload_url`، `expires_at` | `413`, `415`, `422`, `429` |
| `POST /me/documents/{id}/complete` | مالک مدرک | — | `200`؛ `status`، `scan_status` | `404`, `409`, `410` |
| `GET /me/documents` | گیرنده/واگذارکننده | `kind` اختیاری | فهرست متادیتا؛ بدون URL دائمی | `401` |
| `GET /me/documents/{id}/download-url` | مالک یا نقش مجاز | — | `200`؛ `url`، `expires_at` | `403`, `404`, `429` |
| `DELETE /me/documents/{id}` | مالک مدرک | — | `204` | `409` اگر در بررسی است |

### ۴.۱ فیلدهای پرونده

| فیلد | نوع | الزام | قاعده |
|---|---|---|---|
| `full_name` | string | لازم | ۳ تا ۸۰ نویسه |
| `national_id` | string | لازم برای احراز | ۱۰ رقم با کنترل رقم؛ فقط نوشتنی |
| `birth_date` | date | اختیاری | فقط اگر سیاست احراز آن را لازم بداند |
| `province_id` / `city_id` | uuid | لازم | از درخت مناطق فعال |
| `address` | string | اختیاری | حداکثر ۳۰۰ نویسه؛ در فهرست‌ها نمایش داده نمی‌شود |
| `budget_min_irr` / `budget_max_irr` | integer | لازم | بزرگ‌تر از صفر؛ `min ≤ max` |
| `capital_source` | enum | لازم | `personal`, `loan`, `investor`, `other`؛ محرمانه |
| `education` | string | اختیاری | حداکثر ۱۲۰ نویسه |
| `management_experience_years` | integer | اختیاری | ۰ تا ۶۰ |
| `preferred_industry_ids` | uuid[] | لازم | حداقل ۱، حداکثر ۵ گرهٔ برگ |
| `preferred_region_ids` | uuid[] | لازم | حداقل ۱، حداکثر ۱۰ |
| `property_status` | enum | لازم | `owned`, `rented`, `none` |
| `property_area_sqm` | integer | اختیاری | ۰ تا ۲۰۰۰۰ |
| `ready_by` | date | لازم | تاریخ آینده یا امروز |
| `notes` | string | اختیاری | حداکثر ۱۰۰۰ نویسه |

`GET` هرگز `national_id` کامل، `address` کامل یا `capital_source` خام را به نقش‌های غیرمجاز نمی‌دهد. `completeness` عدد محاسبه‌شدهٔ سمت سرور است، نه ورودی کلاینت.

### ۴.۲ مدارک

| مورد | قرارداد |
|---|---|
| `kind` | `national_id_card`, `passport`, `business_license`, `property_deed`, `lease`, `logo`, `ownership_proof`, `other` |
| انواع مجاز | `application/pdf`, `image/jpeg`, `image/png` |
| حجم | حداکثر ۱۰ مگابایت برای هر فایل (پیشنهاد) |
| فرایند | `POST /me/documents` نشانی آپلود کوتاه‌عمر می‌دهد؛ پس از آپلود، `complete` وضعیت را نهایی می‌کند |
| اسکن | پیش از در دسترس قرار گرفتن برای کارشناس، `scan_status` باید `clean` شود |
| URL | فقط `download-url` کوتاه‌عمر (پیشنهاد: ۵ دقیقه)؛ هیچ URL عمومی یا دائمی |
| ممیزی | هر صدور URL و هر دانلود با `actor`، `document_id` و `request_id` ثبت می‌شود |

## ۵. پروندهٔ واگذارکننده

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `GET /me/franchisor-profile` | واگذارکننده (مالک) | — | پروندهٔ شخص/سازمان | `401`, `404` |
| `PATCH /me/franchisor-profile` | واگذارکننده (مالک) | فیلدهای بخش ۵.۱ | پروندهٔ به‌روزشده | `401`, `422`, `409` |
| `POST /me/franchisor-profile/submit` | واگذارکننده (مالک) | `consent_version` | `202`؛ `verification_case_id` | `409`, `422` |
| `GET /me/organization` | واگذارکننده (مالک/مدیر) | — | سازمان، اعضا، وضعیت | `401`, `404` |
| `GET /me/organization/members` | واگذارکننده (مالک/مدیر) | — | فهرست اعضا با نقش سازمانی | `401`, `403` |
| `POST /me/organization/invitations` | مالک/مدیر سازمان | `phone`، `org_role` | `201`؛ `invitation_id` | `409`, `422`, `429` |
| `DELETE /me/organization/members/{id}` | مالک سازمان | — | `204` | `403`, `404`, `409` |

### ۵.۱ فیلدهای پرونده

| فیلد | نوع | الزام | قاعده |
|---|---|---|---|
| `legal_type` | enum | لازم | `person`, `company` |
| `legal_name` | string | لازم | ۳ تا ۱۲۰ نویسه |
| `registration_number` | string | برای شرکت | حداکثر ۳۰ نویسه؛ محرمانه |
| `national_id` | string | برای شخص | فقط نوشتنی؛ برای شرکت، شناسهٔ نمایندهٔ قانونی |
| `representative_name` | string | لازم | ۳ تا ۸۰ نویسه |
| `contact_phone` | string | لازم | E.164؛ با تلفن حساب یکسان یا تأییدشده |
| `contact_email` | string | اختیاری | قالب معتبر؛ در فهرست عمومی نمی‌آید |
| `province_id` / `city_id` | uuid | لازم | از درخت مناطق فعال |
| `brand_name` | string | لازم | ۲ تا ۸۰ نویسه؛ ادعای واگذارکننده، نه برند رسمی |
| `sector_industry_id` | uuid | لازم | گرهٔ برگ فعال |
| `description` | string | لازم | ۵۰ تا ۲۰۰۰ نویسه |
| `branches_count` | integer | لازم | ۰ تا ۱۰۰۰۰ |
| `founded_year` | integer | اختیاری | بین ۱۳۰۰ تا سال جاری شمسی |
| `website` | string | اختیاری | فقط ثبت می‌شود؛ سرور آن را واکشی نمی‌کند (ضد SSRF) |

`org_role` یکی از `owner`، `admin`، `agent`، `viewer` است. فقط `owner` و `admin` می‌توانند اعضای جدید دعوت کنند؛ `agent` پس از پذیرش درخواست می‌تواند در گفت‌وگو شرکت کند؛ `viewer` فقط خواندن پرونده.

## ۶. پیشنهاد برند و پیشنهاد فرصت

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `POST /me/brand-submissions` | واگذارکننده | فیلدهای بخش ۶.۱ | `201`؛ پیش‌نویس | `401`, `422` |
| `GET /me/brand-submissions` | واگذارکننده | `status` اختیاری | فهرست پیشنهادهای خود | `401` |
| `GET /me/brand-submissions/{id}` | مالک | — | پیشنهاد + وضعیت بررسی | `403`, `404` |
| `PATCH /me/brand-submissions/{id}` | مالک | فیلدهای بخش ۶.۱ | پیش‌نویس به‌روزشده | `409` اگر قفل شده |
| `POST /me/brand-submissions/{id}/submit` | مالک | `consent_version` | `202`؛ `status=submitted` | `409`, `422` |
| `POST /me/brand-submissions/{id}/withdraw` | مالک | `reason` | `200`؛ `status=withdrawn` | `409` |
| `POST /me/brand-submissions/{id}/documents` | مالک | `document_ids[]`، `kind` | `200`؛ فهرست پیوست‌ها | `403`, `404`, `422` |
| `GET /me/brand-submissions/{id}/review` | مالک | — | وضعیت، درخواست‌های اصلاح، دلیل رد | `403`, `404` |
| `POST /me/brand-submissions/{id}/opportunity-proposals` | مالک | فیلدهای بخش ۶.۲ | `201`؛ پیش‌نویس فرصت | `409`, `422` |
| `GET /me/brand-submissions/{id}/opportunity-proposals` | مالک | — | فهرست پیشنهادهای فرصت | `403`, `404` |
| `PATCH /me/brand-submissions/{id}/opportunity-proposals/{pid}` | مالک | فیلدهای بخش ۶.۲ | به‌روزرسانی پیش‌نویس | `409` |
| `POST /me/brand-submissions/{id}/opportunity-proposals/{pid}/submit` | مالک | — | `202`؛ `status=submitted` | `409`, `422` |

### ۶.۱ فیلدهای پیشنهاد برند

| فیلد | نوع | الزام | قاعده |
|---|---|---|---|
| `proposed_brand_name` | string | لازم | ۲ تا ۸۰ نویسه؛ عنوان پیشنهادی، نه برند رسمی |
| `brand_name_en` | string | اختیاری | حداکثر ۸۰ نویسه |
| `sector_industry_id` | uuid | لازم | گرهٔ برگ فعال |
| `description` | string | لازم | ۵۰ تا ۲۰۰۰ نویسه |
| `logo_document_id` | uuid | لازم | مدرک با `kind=logo` و اسکن پاک |
| `ownership_document_ids` | uuid[] | لازم | حداقل ۱ |
| `license_document_ids` | uuid[] | لازم | حداقل ۱ |
| `branches_count` | integer | لازم | ۰ تا ۱۰۰۰۰ |
| `financial_terms` | object | لازم | `initial_investment_min_irr`، `initial_investment_max_irr`، `royalty_text`، `contract_term_months`، `termination_terms_text` |
| `regions` | uuid[] | لازم | حداقل ۱ استان/شهر فعال |
| `support` | object | لازم | `training`، `marketing`، `supply`، `support` به‌صورت متن |
| `requirements_text` | string | لازم | حداکثر ۲۰۰۰ نویسه |
| `equipment_text` | string | اختیاری | حداکثر ۲۰۰۰ نویسه |
| `space_sqm_min` | integer | اختیاری | ۰ تا ۲۰۰۰۰ |
| `staff_count` | integer | اختیاری | ۰ تا ۱۰۰۰ |

قواعد:

- `financial_terms` ادعای واگذارکننده است و در این مرحله «قیمت پلتفرم» نیست. مبلغ‌ها integer ریال‌اند؛ متن شرایط (حق امتیاز، فسخ) آزاد و بدون محاسبه است.
- پیش‌نویس تا زمان ارسال قابل ویرایش است؛ پس از `submitted` فقط «پیوست اصلاحی» اضافه می‌شود، نه بازنویسی تاریخچه.
- هر تغییر پس از ارسال، نسخهٔ جدید می‌سازد و نسخهٔ قبلی در تاریخچه می‌ماند.
- ورودی نمی‌تواند `brand_id` رسمی، `status` انتشار یا `published_at` بدهد؛ چنین فیلدهایی → `422 unknown_parameter`.

### ۶.۲ فیلدهای پیشنهاد فرصت

| فیلد | نوع | الزام |
|---|---|---|
| `title` | string | لازم؛ ۵ تا ۱۰۰ نویسه |
| `summary` | string | لازم؛ ۳۰ تا ۳۰۰ نویسه |
| `about` | string | لازم؛ حداکثر ۳۰۰۰ نویسه |
| `highlights` | string[] | حداقل ۱، حداکثر ۸ |
| `requirements` | string[] | حداقل ۱، حداکثر ۱۰ |
| `region_ids` | uuid[] | حداقل ۱ |
| `available_from` | date | اختیاری |
| `exclusivity` | enum | `none`, `regional`, `city` |
| `investment_min_irr` / `investment_max_irr` | integer | لازم؛ `min ≤ max` |
| `area_sqm_min` / `area_sqm_max` | integer | اختیاری |

پیشنهاد فرصت فقط پس از `approved` شدن پیشنهاد برند قابل ارسال است؛ در غیر این صورت `409 invalid_state_transition`.

> ### ممنوعیت صریح: هیچ مسیر انتشار برای واگذارکننده وجود ندارد
>
> - `POST /me/brand-submissions/{id}/publish` وجود ندارد و باید `404` بدهد.
> - `POST /me/opportunities` یا `PATCH /me/opportunities/{id}` وجود ندارد.
> - `PATCH` پیشنهاد برند با فیلد `status`، `published_at` یا `brand_id` رسمی پذیرفته نمی‌شود (`422 unknown_parameter`).
> - هیچ نقش `franchise_franchisor` به `POST /admin/opportunities/{id}/publish` دسترسی ندارد (`403 role_not_allowed`).
> - قید دیتابیس: رکورد رسمی برند و رویداد انتشار باید `created_by_staff_id` / `published_by_staff_id` داشته باشند؛ نوشتن با هویت واگذارکننده در لایهٔ داده رد می‌شود.

## ۷. بررسی، رکورد رسمی و انتشار

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `GET /admin/verifications` | VO، AD، SA | `status`، `assignee=me` | صف تخصیص‌یافته/بدون تخصیص | `403` |
| `POST /admin/verifications/{id}/assign` | AD، SA | `staff_user_id`، `expires_at` | `200`؛ تخصیص | `403`, `404`, `409` |
| `POST /admin/verifications/{id}/decision` | VO (پیشنهاد)، AD/SA (نهایی) | `decision`، `reason_code`، `note`، `requested_documents[]` | `200`؛ وضعیت جدید | `403`, `409`, `422` |
| `POST /admin/receiver-profiles/{id}/reveal` | VO (تخصیص)، AD/SA (با مجوز) | `fields[]`، `reason` | `200`؛ مقدار ماسک‌نشده با `expires_at` | `403`, `404`, `422`, `429` |
| `GET /admin/brand-submissions` | AD، SA، VO | `status`، `assignee=me` | صف پیشنهادها | `403` |
| `GET /admin/brand-submissions/{id}` | AD، SA، VO (تخصیص) | — | پیشنهاد + مدارک + تاریخچه | `403`, `404` |
| `POST /admin/brand-submissions/{id}/decision` | VO (پیشنهاد)، AD/SA (نهایی) | `decision`، `reason_code`، `note` | `200` | `403`, `409`, `422` |
| `POST /admin/brands` | AD، SA | `submission_id`، `slug`، `official_name`، `official_description` | `201`؛ برند رسمی نسخهٔ ۱ | `403`, `409`, `422` |
| `GET /admin/brands/{id}` | AD، SA، VO | — | برند + نسخه‌ها | `403`, `404` |
| `PATCH /admin/brands/{id}` | AD، SA | فیلدهای رسمی | `200`؛ نسخهٔ جدید | `403`, `409`, `422` |
| `POST /admin/brands/{id}/activate` | AD، SA | — | `200`؛ `status=active` | `403`, `409` |
| `GET /admin/opportunities` | AD، SA | `status`، `brand_id` | فهرست فرصت‌ها | `403` |
| `POST /admin/opportunities` | AD، SA | فیلدهای رسمی فرصت | `201`؛ پیش‌نویس | `403`, `422` |
| `PATCH /admin/opportunities/{id}` | AD، SA | فیلدهای رسمی | `200`؛ نسخهٔ جدید | `403`, `409`, `422` |
| `POST /admin/opportunities/{id}/publish` | AD، SA | `publish_at` اختیاری، `note` | `200`؛ `published_at`، `public_url` | `403`, `409`, `422` |
| `POST /admin/opportunities/{id}/unpublish` | AD، SA | `reason_code`، `note` | `200`؛ `status=paused` | `403`, `409` |
| `POST /admin/opportunities/{id}/archive` | AD، SA | `reason_code` | `200`؛ `status=archived` | `403`, `409` |
| `GET /admin/opportunities/{id}/publication-events` | AD، SA | cursor | تاریخچهٔ انتشار | `403`, `404` |
| `POST /admin/staff-assignments` | AD، SA | `staff_user_id`، `case_type`، `case_id`، `role_in_case`، `expires_at`، `reason` | `201` | `403`, `409`, `422` |
| `DELETE /admin/staff-assignments/{id}` | AD، SA | `reason` | `204` | `403`, `404` |
| `POST /admin/access-grants` | SA؛ AD محدود | `staff_user_id`، `resource_type`، `resource_id`، `fields[]`، `expires_at`، `reason` | `201` | `403`, `422` |
| `DELETE /admin/access-grants/{id}` | SA؛ AD محدود | — | `204` | `403`, `404` |
| `GET /admin/audit-events` | SA، AD (دامنهٔ عملیاتی) | فیلترها + cursor | رویدادهای ممیزی | `403` |

### ۷.۱ قواعد بررسی و انتشار

- تصمیم بررسی بدون `reason_code` معتبر پذیرفته نمی‌شود؛ متن آزاد جای کد دلیل را نمی‌گیرد.
- `reason_code`های پیشنهادی: `documents_incomplete`, `ownership_unverified`, `license_invalid`, `brand_conflict`, `financial_terms_unclear`, `other`.
- تأیید برند توسط VO «پیشنهاد» است؛ ساخت رکورد رسمی فقط با AD/SA و به‌صورت idempotent بر پایهٔ `submission_id` انجام می‌شود.
- `POST /admin/brands` برای هر `submission_id` فقط یک برند می‌سازد؛ تکرار → همان برند با `Idempotent-Replay`.
- ویرایش برند یا فرصت، نسخهٔ جدید می‌سازد؛ حذف فیزیکی نسخهٔ منتشرشده ممنوع است.
- انتشار نیازمند: برند `active`، فرصت `approved`، فیلدهای عمومی کامل، تصویر/لوگوی اسکن‌شده، و نقش AD/SA.
- انتشار idempotent است؛ انتشار دوبارهٔ همان نسخه → `409 invalid_state_transition` یا پاسخ replay با همان کلید.
- `unpublish` فوراً projection عمومی را حذف می‌کند؛ حداکثر تأخیر cache هدف ۶۰ ثانیه است و در پاسخ `cache_purge` گزارش می‌شود.
- هر تصمیم، انتشار، لغو انتشار و تغییر نسخه، رویداد ممیزی و `publication_event` می‌سازد.
- `reveal` فقط برای فیلدهای مجاز و با `reason` انجام می‌شود؛ پاسخ `expires_at` دارد و در ممیزی ثبت می‌شود.

### ۷.۲ خروجی عمومی انتشار

| مسیر | نقش | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `GET /public/opportunities` | عمومی | `industry_id`، `province_id`، `city_id`، `q`، `page` | فقط projection منتشرشده | `422`, `429` |
| `GET /public/opportunities/{slug}` | عمومی | — | جزئیات عمومی + `version` | `404` |
| `GET /public/industries` | عمومی | — | درخت فعال دسته‌ها | `429` |
| `GET /public/brands/{slug}` | عمومی | — | برند فعال و فرصت‌های منتشرشده | `404` |

Projection عمومی فقط فیلدهای allowlist را برمی‌گرداند: نام برند، صنعت، استان/شهر، معرفی منتشرشده، بازهٔ سرمایه، شرایط مالی اعلام‌شده، الزامات، پشتیبانی، وضعیت کلی. مدارک، شمارهٔ ملی، منبع سرمایه، تماس خصوصی، پیش‌نویس و پیام‌ها هرگز در این پاسخ‌ها نیستند. کش عمومی `max-age=60` و private `no-store`.

## ۸. درخواست همکاری

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `POST /opportunities/{id}/applications` | گیرندهٔ احرازشده | `message` (≤۱۰۰۰)، `consent_version` | `201`؛ `application_id`، `status` | `403`, `409`, `422`, `429` |
| `GET /me/applications` | گیرنده | `status`، `page` | فهرست درخواست‌های خود | `401` |
| `GET /me/applications/{id}` | مالک درخواست | — | جزئیات + زمان‌بندی + `conversation_id` | `403`, `404` |
| `POST /me/applications/{id}/withdraw` | مالک | `reason` | `200`؛ `status=withdrawn` | `409` |
| `POST /me/applications/{id}/responses` | مالک | `message`، `document_ids[]` | `200`؛ بازگشت به `under_review` | `409`, `422` |
| `GET /admin/applications` | AD، FC، SA | `status`، `assignee=me` | صف درخواست‌ها | `403` |
| `GET /admin/applications/{id}` | AD، FC (تخصیص)، SA | — | پروندهٔ کامل درخواست | `403`, `404` |
| `POST /admin/applications/{id}/assign` | AD، SA | `staff_user_id` | `200` | `403`, `409` |
| `POST /admin/applications/{id}/decision` | AD، FC (پیشنهاد) | `decision`، `reason_code`، `note`، `requested_items[]` | `200`؛ وضعیت جدید | `403`, `409`, `422` |

قواعد:

- پیش‌شرط ثبت: پروندهٔ گیرنده `verified`، فرصت `published`، نبود درخواست فعال برای همان `(receiver_id, opportunity_id)`.
- تکرار درخواست فعال → `409 duplicate_resource`؛ درخواست پس از رد شدن با دلیل جدید و بازهٔ زمانی سیاست‌شده بررسی می‌شود (سیاست بازآزمایی نیازمند تأیید مالک).
- `decision` یکی از `accept`, `reject`, `request_info` است. `accept` به‌صورت اتمیک گفت‌وگو می‌سازد؛ اگر ساخت گفت‌وگو شکست بخورد، تصمیم commit نمی‌شود.
- `reject` بدون `reason_code` و `note` پذیرفته نمی‌شود؛ دلیل به گیرنده نمایش داده می‌شود.
- پذیرش یا رد خودکار وجود ندارد؛ هیچ قاعدهٔ تطبیق اجازهٔ تصمیم‌گیری ندارد.
- `GET /me/applications/{id}` تا پیش از پذیرش `conversation_id: null` دارد و هیچ پیامی برنمی‌گرداند.
- هر تغییر وضعیت در `application_events` و ممیزی ثبت می‌شود.

## ۹. تطبیق

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `GET /me/matches` | گیرنده | cursor، `min_score` اختیاری | نتایج فعال با دلیل | `401` |
| `GET /me/matches/{id}` | مالک نتیجه | — | نتیجه + توضیح کامل | `403`, `404` |
| `POST /me/matches/{id}/feedback` | مالک نتیجه | `value` (`relevant`/`not_relevant`)، `reason_code` اختیاری | `204` | `403`, `422` |
| `GET /admin/matching/configs` | AD، SA، FC (خواندن) | — | نسخه‌های پیکربندی | `403` |
| `POST /admin/matching/configs` | AD، SA | `name`، `weights`، `hard_filters`، `min_score`، `notes` | `201`؛ پیش‌نویس نسخه | `403`, `422` |
| `POST /admin/matching/configs/{id}/activate` | AD، SA | — | `200`؛ نسخهٔ فعال | `403`, `409` |
| `POST /admin/matching/runs` | AD، SA | `config_id`، `scope`، `dry_run` | `202`؛ `run_id` | `403`, `409`, `422` |
| `GET /admin/matching/runs/{id}` | AD، SA | — | وضعیت، شمارش، خطا | `403`, `404` |
| `GET /admin/matching/runs/{id}/results` | AD، SA | `page` | نتایج با دلیل | `403` |

### ۹.۱ قرارداد توضیح تطبیق

```json
{
  "data": {
    "match_id": "018f2c1e-7b3a-7c41-9d8e-2f6a1b0c9d42",
    "opportunity": {"slug": "kafe-arka", "brand_name": "کافه آرکا"},
    "score": 78,
    "config_version": 3,
    "computed_at": "2026-11-25T06:00:00Z",
    "reasons": [
      {
        "criterion": "budget_overlap",
        "weight": 40,
        "passed": true,
        "actual": "۲ تا ۳ میلیارد تومان",
        "expected": "۲.۵ تا ۴ میلیارد تومان"
      },
      {
        "criterion": "region",
        "weight": 30,
        "passed": true,
        "actual": "تهران",
        "expected": "تهران، البرز"
      },
      {
        "criterion": "readiness",
        "weight": 15,
        "passed": false,
        "actual": "۹۰ روز",
        "expected": "≤ ۶۰ روز"
      }
    ]
  }
}
```

قواعد:

- قواعد قطعی، نسخه‌دار و توضیح‌پذیر؛ بدون مدل جعبه‌سیاه و بدون ادعای تضمین موفقیت.
- ویژگی‌های حساس (جنسیت، قومیت، مذهب، وضعیت تأهل) نه در ورودی و نه در امتیازدهی استفاده نمی‌شوند.
- نتیجهٔ تطبیق به واگذارکننده نمایش داده نمی‌شود.
- `feedback` فقط برای بهبود تجمیعی پیکربندی است؛ هیچ بازخوردی باعث رد یا جریمهٔ فردی نمی‌شود.
- اجرای تطبیق idempotent بر پایهٔ `(receiver_id, config_version, window)` است؛ تکرار اجرا نتیجهٔ تکراری نمی‌سازد.
- امتیاز و آستانه اعداد پیشنهادی تنظیم‌پذیرند؛ هیچ آستانه‌ای در این سند قطعی نیست.

## ۱۰. گفت‌وگو، جلسه و نتیجه

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `GET /conversations` | شرکت‌کننده/FC تخصیصی | cursor | گفت‌وگوهای در دسترس | `401` |
| `GET /conversations/{id}` | شرکت‌کننده/FC تخصیصی | — | سرصفحه، شرکت‌کنندگان، وضعیت | `403`, `404` |
| `GET /conversations/{id}/messages` | همان | `limit`، `cursor` | پیام‌ها به ترتیب زمان | `403`, `404` |
| `POST /conversations/{id}/messages` | شرکت‌کننده | `body` (≤۴۰۰۰)، `client_message_id`، `attachment_ids[]` | `201`؛ پیام | `403`, `409`, `413`, `415`, `422` |
| `POST /conversations/{id}/read` | شرکت‌کننده | `last_message_id` | `204` | `403`, `404` |
| `GET /conversations/{id}/events` | شرکت‌کننده | `Last-Event-ID` اختیاری | `text/event-stream` | `403`, `404` |
| `POST /conversations/{id}/meetings` | شرکت‌کننده/FC | `proposed_at`، `duration_minutes`، `mode`، `location_text` | `201`؛ جلسه | `403`, `409`, `422` |
| `POST /meetings/{id}/confirm` | شرکت‌کننده | — | `200` | `403`, `409` |
| `POST /meetings/{id}/cancel` | شرکت‌کننده/FC | `reason` | `200` | `403`, `409` |
| `GET /conversations/{id}/documents` | شرکت‌کننده/FC | — | فهرست اسناد مجاز | `403` |
| `POST /conversations/{id}/documents` | FC، AD | `document_id`، `kind` | `201`؛ پیوند سند | `403`, `409` |
| `POST /conversations/{id}/outcome` | FC، AD، SA | `result`، `reason_code`، `contract_document_id` اختیاری | `201`؛ نتیجه | `403`, `409`, `422` |

قواعد:

- گفت‌وگو فقط پس از `accepted` شدن درخواست ساخته می‌شود؛ هیچ مسیر عمومی ساخت گفت‌وگو وجود ندارد.
- شرکت‌کنندگان: گیرنده، نمایندهٔ سازمان واگذارکننده (نقش `agent`/`admin`)، و در صورت تخصیص، مشاور پرونده.
- مشاور فقط گفت‌وگوهای تخصیص‌یافته را می‌بیند؛ ورود و مشاهدهٔ او ممیزی می‌شود.
- پیام ویرایش یا حذف نمی‌شود؛ حذف فقط با اقدام انضباطی/حقوقی و رویداد ممیزی جداگانه انجام می‌شود.
- `client_message_id` در هر گفت‌وگو یکتاست؛ تکرار همان شناسه، پیام دوم نمی‌سازد و پیام اصلی را برمی‌گرداند.
- پیوست‌ها باید از `/me/documents` آمده و `scan_status=clean` داشته باشند؛ حداکثر ۳ پیوست در هر پیام.
- `events` برای رخداد تازه است (SSE)؛ در قطع اتصال، کلاینت با `GET messages` و `cursor` همگام می‌شود. WebSocket دوطرفه در نسخهٔ اول تعریف نشده است.
- وضعیت گفت‌وگو: `open`, `closed`, `archived`. پس از `closed` فقط خواندن مجاز است.
- `outcome` نتیجهٔ مذاکره را ثبت می‌کند (`agreement`, `no_agreement`, `pending`)؛ محاسبهٔ کمیسیون در Phase 7 و پس از تصویب فرمول انجام می‌شود و endpoint محاسبه در این نسخه وجود ندارد.

## ۱۱. مالی، اشتراک، مشاوره، تبلیغات و زرین‌پال

### ۱۱.۱ اصول

- مبلغ فاکتور فقط از `price_book` فعال سمت سرور ساخته می‌شود؛ کلاینت هیچ مبلغی نمی‌فرستد.
- مبالغ integer ریال؛ `float` ممنوع؛ تبدیل واحد فقط در adapter درگاه.
- هر فاکتور، تلاش پرداخت، تأیید و ردیف ledger قید یکتای دیتابیس دارد.
- callback مرورگر ورودی نامطمئن است؛ تأیید فقط با فراخوانی سرور به سرور و تطبیق مبلغ/مرجع.
- قیمت‌ها، درصد کمیسیون، مالیات و سیاست استرداد در این سند تعیین نشده‌اند؛ تا تصویب مالک، مقادیر محیط توسعه ساختگی و غیرعمومی‌اند.

### ۱۱.۲ فاکتور، اشتراک و مشاوره

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `GET /me/invoices` | گیرنده/واگذارکننده | `status`، `page` | فاکتورهای خود | `401` |
| `GET /me/invoices/{id}` | مالک فاکتور | — | فاکتور + خطوط + وضعیت پرداخت | `403`, `404` |
| `GET /public/plans` | عمومی | — | پلن‌های فعال با قیمت منتشرشده | `429` |
| `POST /me/subscriptions/checkout` | گیرنده/واگذارکننده | `plan_id`، `billing_cycle` | `201`؛ `invoice_id` | `409`, `422` |
| `GET /me/subscriptions` | گیرنده/واگذارکننده | — | اشتراک فعال/تاریخی | `401` |
| `POST /me/subscriptions/{id}/cancel` | مالک اشتراک | `reason` | `202`؛ `effective_at` | `409` |
| `GET /public/consultation-services` | عمومی | — | خدمات فعال | `429` |
| `POST /me/consultations` | گیرنده/واگذارکننده | `service_id`، `preferred_slots[]`، `note` | `201`؛ `consultation_id`، `invoice_id` | `409`, `422` |
| `GET /me/consultations` | گیرنده/واگذارکننده | — | مشاوره‌های خود | `401` |
| `POST /admin/invoices` | FO، AD | `user_id`، `lines[]`، `due_at` | `201`؛ فاکتور | `403`, `422` |
| `GET /admin/invoices` | FO، AD، SA | فیلترها | صف فاکتورها | `403` |
| `GET /admin/invoices/{id}` | FO، AD، SA | — | فاکتور کامل | `403`, `404` |
| `POST /admin/invoices/{id}/void` | FO (درخواست)، AD/SA (تأیید) | `reason` | `200`؛ `status=void` | `403`, `409` |
| `POST /admin/finance/exports` | FO، SA | `type`، `from`، `to`، `reason` | `202`؛ `export_id` | `403`, `429` |
| `GET /admin/finance/summary` | FO، AD، SA | `from`، `to` | جمع‌های مالی | `403`, `422` |
| `GET /admin/finance/ledger` | FO، SA | فیلترها + cursor | ردیف‌های ledger (فقط خواندن) | `403` |

قواعد:

- `POST /me/subscriptions/checkout` فقط `plan_id` می‌گیرد؛ مبلغ از پلن فعال و دورهٔ صورتحساب محاسبه می‌شود. پلن غیرفعال یا قیمت منتشرنشده → `409`.
- فاکتور دستی فقط برای FO/AD و با `lines[]` از کاتالوگ مجاز؛ `amount_irr` هر خط سمت سرور محاسبه می‌شود.
- `void` فقط برای فاکتور پرداخت‌نشده؛ فاکتور پرداخت‌شده مسیر استرداد دارد.
- لغو اشتراک بدون سیاست استرداد، فقط پایان دوره را ثبت می‌کند؛ `effective_at` از سیاست فعال خوانده می‌شود و تا تصویب، مقدار پیش‌فرض اعلام نمی‌شود.
- مالیات (`tax_irr`) در نسخهٔ اول صفر است تا سیاست مالیاتی تصویب شود؛ تغییر آن نیازمند تصمیم ثبت‌شده است.

### ۱۱.۳ پرداخت و زرین‌پال

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `POST /me/invoices/{id}/payment-attempts` | مالک فاکتور | `provider=zarinpal` | `201`؛ `attempt_id`، `redirect_url`، `expires_at` | `403`, `409`, `422`, `429`, `502` |
| `GET /payments/attempts/{id}` | مالک/FO/AD | — | وضعیت تلاش + `invoice_id` | `403`, `404` |
| `GET /payments/zarinpal/callback` | عمومی (بدون نشست) | `Authority`، `Status` از درگاه | `302` به صفحهٔ نتیجه | `400`, `404`, `429` |
| `GET /admin/payments` | FO، AD، SA | فیلترها | فهرست تلاش‌ها | `403` |
| `GET /admin/payments/{id}` | FO، AD، SA | — | تلاش + رویدادها | `403`, `404` |
| `POST /admin/payments/{id}/reconcile` | FO | `action`، `note` | `200`؛ وضعیت مغایرت | `403`, `409`, `422` |
| `POST /admin/invoices/{id}/refunds` | FO | `amount_irr`، `reason_code`، `note` | `201`؛ `refund_id` | `403`, `409`, `422` |
| `POST /admin/refunds/{id}/decide` | AD، SA (نه درخواست‌دهنده) | `decision`، `note` | `200` | `403`, `409` |
| `GET /admin/refunds` | FO، AD، SA | `status` | فهرست استردادها | `403` |
| `GET /admin/reconciliation-cases` | FO، AD، SA | `status` | فهرست مغایرت‌ها | `403` |
| `POST /admin/reconciliation-cases/{id}/resolve` | FO (پیشنهاد)، AD/SA (تأیید) | `resolution`، `note` | `200` | `403`, `409` |

**جریان پرداخت (الزامی):**

1. رویداد مالی (خرید اشتراک، رزرو مشاوره، فاکتور دستی) فاکتور را از `price_book` فعال و سمت سرور می‌سازد؛ هیچ مبلغی از کلاینت پذیرفته نمی‌شود.
2. سرور وضعیت فاکتور را بررسی می‌کند (`issued` یا `overdue`) و وجود تلاش فعال را رد می‌کند.
3. سرور تلاش یکتا می‌سازد: `attempt_no = max + 1`، `status=initiated`، قید یکتای `(invoice_id, attempt_no)`.
4. سرور از درگاه درخواست پرداخت می‌گیرد؛ `provider_authority` با قید یکتا ذخیره و وضعیت `redirected` می‌شود. `merchant_id` فقط سمت سرور است.
5. کاربر به درگاه می‌رود. بازگشت او به `/payments/zarinpal/callback` فقط «ورودی نامطمئن» است.
6. سرور تلاش را با `provider_authority` پیدا می‌کند (نه با `invoice_id` از query)؛ authority ناشناس → صفحهٔ نتیجهٔ عمومی، بدون افشای وجود فاکتور.
7. سرور با درگاه verify می‌کند: کد نتیجه، مبلغ، واحد و مرجع را با فاکتور و تلاش تطبیق می‌دهد. `Status=OK` به‌تنهایی کافی نیست.
8. در تراکنش دیتابیس، ردیف تلاش با `FOR UPDATE` قفل می‌شود: اگر قبلاً `verified` است، همان نتیجه برگردانده می‌شود؛ وگرنه `verified` ثبت و یک ردیف ledger با قید یکتا ساخته می‌شود و فاکتور `paid` می‌شود.
9. خطا/timeout در verify: تلاش در `callback_received` می‌ماند و job تلاش مجدد (پیشنهاد: هر ۱ دقیقه، حداکثر ۱۵ دقیقه) اجرا می‌شود؛ در این بازه فاکتور پرداخت‌شده اعلام نمی‌شود.
10. callback تکراری: به‌دلیل قید یکتای authority و بررسی وضعیت، verify دوم و ردیف ledger دوم ساخته نمی‌شود؛ پاسخ همان نتیجهٔ قبلی است.
11. مبلغ ناهم‌خوان یا مرجع ناهم‌خوان: `reconciliation_required`، پروندهٔ مغایرت باز می‌شود و هیچ اثر مالی ثبت نمی‌شود.

**Invariantهای پرداخت:**

- `invoice.amount_irr = sum(lines.amount_irr)` و بزرگ‌تر از صفر است.
- برای هر فاکتور حداکثر یک تلاش `paid/verified` و یک ردیف ledger از نوع پرداخت وجود دارد.
- `provider_authority` یکتا و غیرقابل استفادهٔ مجدد است.
- `verified` به حالت قبل برنمی‌گردد.
- callback هرگز وضعیت را مستقیم تغییر نمی‌دهد؛ فقط پس از verify و در تراکنش.
- دادهٔ کارت بانکی در سیستم ذخیره نمی‌شود؛ فقط `authority`، `ref_id` و وضعیت نگهداری می‌شود.
- همهٔ تغییرات وضعیت با `request_id`، `actor` سیستمی و زمان ممیزی می‌شوند.

**استرداد و مغایرت:**

- استرداد فقط برای فاکتور `paid`؛ مبلغ مثبت و حداکثر برابر مبلغ پرداخت‌شده.
- درخواست استرداد توسط FO و تأیید توسط AD/SA و شخصی غیر از درخواست‌دهنده انجام می‌شود.
- تا تصویب سیاست استرداد، این مسیر در محیط تولید با feature flag غیرفعال است و `409 refund_policy_not_configured` برمی‌گرداند.
- مغایرت هرگز با ویرایش ردیف ledger حل نمی‌شود؛ فقط ردیف اصلاحی جدید و دلیل ثبت‌شده.
- قابلیت استرداد در زرین‌پال باید در قرارداد و sandbox بررسی شود؛ فرض وجود API استرداد، فرضیه است و نباید مبنای تعهد به کاربر شود.

### ۱۱.۴ مشاوره، تبلیغات و گزارش

| مسیر | نقش مجاز | ورودی | خروجی | خطاها |
|---|---|---|---|---|
| `POST /admin/consultations/{id}/confirm` | FC، AD | `slot`، `meeting_id` | `200` | `403`, `409` |
| `POST /admin/consultations/{id}/complete` | FC، AD | `note` | `200` | `403`, `409` |
| `GET /public/ad-slots` | عمومی | `placement` | جایگاه‌های فعال | `429` |
| `GET /admin/ad-campaigns` | AD، SA | `status` | کمپین‌ها | `403` |
| `POST /admin/ad-campaigns` | AD | `advertiser_id`، `slot_id`، `creative_document_id`، `start_at`، `end_at` | `201` | `403`, `422` |
| `POST /admin/ad-campaigns/{id}/approve` | AD، SA | — | `200` | `403`, `409` |
| `POST /admin/ad-campaigns/{id}/pause` | AD، SA | `reason` | `200` | `403`, `409` |

قواعد: جایگاه تبلیغاتی فقط از فهرست مدیریت‌شده؛ creative باید اسکن پاک داشته باشد؛ تبلیغ تأییدنشده رندر نمی‌شود؛ هیچ ادعای نتیجه یا آمار ساختگی در پاسخ API تولید نمی‌شود.

## ۱۲. ماتریس خلاصهٔ دسترسی

✅ کامل · ◐ محدود/تخصیصی/با مجوز · خود: فقط دادهٔ خود · — بدون دسترسی

| گروه مسیر | گیرنده | واگذارکننده | VO | FC | FO | SO | AD | SA |
|---|---|---|---|---|---|---|---|---|
| احراز و نشست خود | خود | خود | خود | خود | خود | خود | خود | خود |
| پروندهٔ گیرنده | خود | — | ◐ تخصیص | ◐ تخصیص | — | ◐ مجوز | ◐ پرونده | ◐ پرونده |
| پروندهٔ واگذارکننده | — | خود | ◐ تخصیص | ◐ تخصیص | — | ◐ مجوز | ◐ پرونده | ◐ پرونده |
| مدارک حساس | خود | خود | ◐ تخصیص | ◐ مجوز | — | ◐ مجوز | ◐ با مجوز | ◐ با مجوز |
| پیشنهاد برند | — | خود | ◐ بررسی | — | — | — | ✅ | ✅ |
| برند رسمی | — | — | — | — | — | — | ✅ | ✅ |
| انتشار فرصت | — | — | — | — | — | — | ✅ | ✅ |
| درخواست | خود | ◐ خلاصه | — | ◐ تخصیص | — | — | ✅ | ✅ |
| تطبیق | خود | — | — | ◐ خواندن | — | — | ✅ | ✅ |
| گفت‌وگو | ◐ عضو | ◐ عضو | — | ◐ تخصیص | — | — | ◐ با مجوز | ◐ با مجوز |
| مالی خود | خود | خود | — | — | ◐ | — | ◐ | ◐ |
| مالی کل | — | — | — | — | ✅ | — | ◐ | ◐ |
| استرداد/مغایرت | — | — | — | — | ◐ درخواست | — | ◐ تأیید | ◐ تأیید |
| تخصیص/مجوز | — | — | — | — | — | — | ◐ | ✅ |
| ممیزی | — | — | ◐ خود | ◐ خود | ◐ مالی | ◐ خود | ◐ عملیاتی | ✅ |

ماتریس کامل و توضیح هر سلول در `SECURITY_AND_ACCESS_CONTROL.md` بخش ۴ آمده است؛ این جدول فقط راهنمای سریع است.

## ۱۳. قرارداد پیاده‌سازی و پذیرش

| مورد | تعهد | وضعیت |
|---|---|---|
| قرارداد OpenAPI | فایل `docs/api/openapi.v1.yaml` از همین سند تولید و در CI اعتبارسنجی شود | در انتظار مرحلهٔ ۲ |
| Mock server | پاسخ نمونه برای همهٔ مسیرها، قابل استفادهٔ تیم وب | در انتظار مرحلهٔ ۲ |
| آزمون قرارداد | هر مسیر: نقش مجاز، نقش غیرمجاز، ورودی نامعتبر، حالت نامعتبر، idempotency | در انتظار مرحلهٔ ۲ |
| آزمون IDOR | دو حساب هم‌نقش و دو نقش متفاوت؛ تلاش دسترسی به شناسهٔ دیگری باید ۴۰۴ بدهد | در انتظار مرحلهٔ ۲ |
| آزمون پرداخت | sandbox: موفق، ناموفق، callback تکراری، مبلغ ناهم‌خوان، timeout، تلاش هم‌زمان | در انتظار مرحلهٔ ۷ |
| مستندات خطا | همهٔ کدهای خطا در OpenAPI و در UI قابل نمایش | در انتظار مرحلهٔ ۲ |
| نسخه‌بندی | تگ نسخهٔ API و changelog | در انتظار مرحلهٔ ۲ |

«آماده» فقط وقتی اعلام می‌شود که آزمون‌های بالا با شاهد اجرا در CI ثبت شده باشند. هیچ endpointی با نمایش صفحه یا mock، «پیاده‌شده» محسوب نمی‌شود.

## ۱۴. ابهام‌ها و تصمیم‌های باز

| # | ابهام | اثر | تصمیم لازم |
|---|---|---|---|
| ۱ | فعال‌بودن هم‌زمان دو نقش گیرنده و واگذارکننده برای یک حساب | ساختار پرونده و منوی نقش | مالک |
| ۲ | فهرست دقیق مدارک احراز هر نقش | فیلدها و وضعیت بررسی | مالک + بررسی حقوقی |
| ۳ | کدام اطلاعات مالی فرصت عمومی شود | projection عمومی و حریم رقابتی | مالک |
| ۴ | فرمول و رویداد کمیسیون | ماشین مالی و ledger | مالک |
| ۵ | قیمت پلن، مشاوره و تبلیغ | `price_book` و صفحهٔ عمومی | مالک |
| ۶ | سیاست استرداد و مالیات | مسیر refund و فیلد tax | مالک + مالی/حقوقی |
| ۷ | ارائه‌دهندهٔ پیامک و میزبان | پیاده‌سازی OTP و استقرار | مالک |
| ۸ | قرارداد و کلید زرین‌پال؛ رفتار sandbox و استرداد | adapter پرداخت | مالک + بررسی فنی |
| ۹ | مدت نگهداری داده و متن حقوقی | حذف/ناشناس‌سازی | مالک + حقوقی |
| ۱۰ | نمایش هویت متقاضی به واگذارکننده پیش از پذیرش | مجوز درخواست/گفت‌وگو | مالک |
| ۱۱ | سیاست بازآزمایی درخواست ردشده | ماشین حالت درخواست | مالک |
| ۱۲ | نیاز به پرداخت جزئی/اقساطی | مدل فاکتور و تلاش پرداخت | مالک |

## پیوست الف: واژه‌نامه

| واژه | معنا |
|---|---|
| پرونده | مجموعهٔ داده، مدارک و وضعیت یک گیرنده یا واگذارکننده |
| پیشنهاد برند | درخواست خصوصی واگذارکننده برای بررسی برند؛ برند رسمی نیست |
| رکورد رسمی | برند/فرصت ساخته‌شده توسط AD/SA که مبنای انتشار است |
| projection عمومی | نسخهٔ allowlist‌شدهٔ یک رکورد منتشرشده برای نمایش عمومی |
| تلاش پرداخت | یک کوشش پرداخت برای یک فاکتور با `attempt_no` یکتا |
| مغایرت | اختلاف مبلغ/مرجع/وضعیت میان درگاه و سیستم که نیازمند بررسی دستی است |
| idempotency | تکرار همان درخواست، اثر جانبی دوم نمی‌سازد |
| IDOR | دسترسی به شیء دیگری با تغییر شناسه در درخواست |

## پیوست ب: ارجاع به مخزن

| مسیر | چیزی که نشان می‌دهد | ارتباط با این سند |
|---|---|---|
| `franchise-plus-platform/next.config.mjs` | خروجی `export` و نبود سرور | دلیل اینکه هیچ APIای وجود ندارد |
| `franchise-plus-platform/lib/data.ts` | دادهٔ ساختگی فرصت‌ها و پرونده | منبع فعلی صفحات؛ جایگزین آن API است |
| `franchise-plus-platform/app/join/page.tsx` | اعتبارسنجی سمت مرورگر | امنیت نیست؛ اعتبارسنجی مرجع در API |
| `franchise-plus-platform/app/dashboard/page.tsx` | نمایش پرونده و درخواست‌ها | مصرف‌کنندهٔ گروه‌های ۴، ۸ و ۹ |
| `franchise-plus-platform/app/panel/franchisor/page.tsx` | قفل انتشار برای واگذارکننده | مرجع بصری ممنوعیت بخش ۶ |
| `franchise-plus-platform/app/panel/admin/page.tsx` | صف بررسی و ممیزی نمایشی | مصرف‌کنندهٔ گروه ۷ |
| `franchise-plus-platform/app/chat/page.tsx` | پیام‌ها فقط در حافظهٔ مرورگر | دلیل نبود پیام پایدار؛ گروه ۱۰ |
| `franchise-plus-platform/app/how-it-works/page.tsx` | قواعد محصول و محرمانگی | مرجع جریان‌ها |
| `franchise-plus-platform/app/globals.css` | توکن‌های طراحی | خارج از دامنهٔ API |

## پیوست ج: تاریخچهٔ نسخه

| نسخه | تاریخ | تغییر |
|---|---|---|
| 0.1 | 2026-11-25 | نسخهٔ اول: قراردادهای عمومی، ۹ گروه مسیر، ماشین حالت‌ها، جریان زرین‌پال و ماتریس دسترسی |
