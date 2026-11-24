# فرانچایز پلاس — FRANCHISE PLUS

پلتفرم مدیریت، توسعه و واگذاری نمایندگی در ایران.

این مخزن در حال حاضر **پیش‌نمایش طراحی Phase 1** است: صفحات و جریان‌های UX/UI با
دادهٔ ساختگی، بدون دیتابیس، بدون API و بدون اتصال به درگاه پرداخت.

> ⚠️ همهٔ برندها، پرونده‌ها و اعداد این نسخه ساختگی‌اند. هیچ اطلاعات واقعی در این مخزن نیست.

---

## اجرای محلی

```bash
npm install
npm run dev      # http://localhost:4173
```

ساخت نسخهٔ استاتیک:

```bash
npm run build    # خروجی در out/
```

## ساختار

```
app/                 صفحات (App Router)
  page.tsx           خانه
  opportunities/     فهرست و جزئیات فرصت
  how-it-works/      مسیر کار، محرمانگی و قواعد
  join/              ثبت‌نام و انتخاب نقش (گیرنده / واگذارکننده)
  dashboard/         پنل گیرندهٔ نمایندگی
  panel/franchisor/  پنل واگذارکننده
  panel/admin/       صف بررسی مدیر و کارشناسان
  chat/              گفت‌وگوی کنترل‌شده
components/          اجزای مشترک: پوسته، نشان برند، کارت فرصت، پوستهٔ پنل
lib/data.ts          دادهٔ نمونه (ساختگی)
lib/fa.ts            تبدیل ارقام به فارسی
```

## تصمیم‌های قفل‌شده (از مشخصات مالک محصول)

- بازار: فقط ایران · زبان: فارسی · رابط کاملاً RTL
- مدل: Managed — بررسی مرکزی پرونده‌ها
- ایجاد برند رسمی و انتشار فرصت: فقط Admin / Super Admin
- احراز هویت: هر دو طرف (گیرنده و واگذارکننده)
- گفت‌وگو: فقط پس از تأیید تیم، با حضور محدود کارشناس
- پرداخت: زرین‌پال — تأیید فقط سمت سرور، با idempotency
- پالت: سرمه‌ای `#142A3A` · استخوانی `#F5F1E9` · برنز `#795636` · سبز `#526B5C`
- فونت: Kalameh (برند) — در این نسخه Vazirmatn به‌عنوان fallback خودمیزبان استفاده شده است

## اسناد Phase 1

در پوشهٔ [`docs/`](docs/):

| سند | موضوع |
|---|---|
| [PROJECT_MASTER.md](docs/PROJECT_MASTER.md) | خلاصهٔ مدیریتی، زیرسیستم‌ها، تصمیم‌ها |
| [PROJECT_ROADMAP.md](docs/PROJECT_ROADMAP.md) | هشت فاز، معیار پذیرش هر فاز |
| [TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md) | معماری، ماژول‌ها، زیرساخت |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | مدل داده و Prisma |
| [API_SPECIFICATION.md](docs/API_SPECIFICATION.md) | قرارداد REST نسخه ۱ |
| [SECURITY_AND_ACCESS_CONTROL.md](docs/SECURITY_AND_ACCESS_CONTROL.md) | RBAC و محرمانگی |
| [UI_UX_DESIGN_SYSTEM.md](docs/UI_UX_DESIGN_SYSTEM.md) | سیستم طراحی پیاده‌شده |
| [TESTING_AND_ACCEPTANCE.md](docs/TESTING_AND_ACCEPTANCE.md) | استراتژی تست و پذیرش |
| [DEVELOPER_EXECUTION.md](docs/DEVELOPER_EXECUTION.md) | بستهٔ اجرایی توسعه‌دهنده |
| [DEPLOYMENT_AND_OPERATIONS.md](docs/DEPLOYMENT_AND_OPERATIONS.md) | انتشار، پایش، پشتیبان |

## فونت‌ها

| فونت | وضعیت | مجوز |
|---|---|---|
| Vazirmatn v33.003 | فونت فعال رابط (self-host از بستهٔ `@fontsource-variable/vazirmatn`؛ همان نسخهٔ ٣٣.٠٠٣) | SIL OFL 1.1 — متن کامل در [`public/fonts/Vazirmatn-OFL.txt`](public/fonts/Vazirmatn-OFL.txt) |
| Kalameh | فونت برند طبق مشخصات مالک؛ فایل و مجوز تحویل نشده | تجاری — تا تحویل فایل مجاز، استفاده نمی‌شود |

فونت از CDN بارگیری نمی‌شود؛ فایل‌ها همراه خروجی ساخته می‌شوند.

## وضعیت

- [x] سیستم طراحی فارسی/RTL
- [x] صفحات عمومی
- [x] پنل‌ها و گفت‌وگوی کنترل‌شده (نمایشی)
- [x] اسناد Phase 1 (`docs/`)
- [ ] Phase 2: زیرساخت، دیتابیس، احراز هویت

## سایت منتشرشده

https://shimmmmmmmmma.github.io/franchise-plus/

