# گزارش مرحله — ثبت پذیرش Phase 1 و بررسی گزینه‌های ایران

> **یادداشت نسخه:** این فایل گزارش تاریخیِ زمان نگارش است؛ فرمان‌ها، وضعیت Git و موارد توقف در ادامه snapshot همان زمان‌اند، نه وضعیت جاری. پذیرش اصلاح‌شده و همسوسازی اسناد در رکورد Phase 1 و commitهای بعدی ثبت می‌شوند.

**تاریخ گزارش اولیه:** ۱۴۰۵/۰۸/۳۰ (۲۰۲۶-۱۱-۲۱)<br>
**نوع کار:** مستندسازی و تحقیق منبع‌دار؛ بدون تغییر کد اجرایی، schema، migration، DB، deployment یا اتصال سرویس.

## خروجی‌های این مرحله

- `docs/phase1/ACCEPTANCE_RECORD.md` — مبنای پذیرش مالک، دامنهٔ دقیق Phase 1، بدهی‌های پذیرفته‌شده و شروط صریح Phase 2 را ثبت می‌کند. این رکورد، اجرای چک‌لیست فنی را تأیید نمی‌کند.
- `docs/phase2/IRAN_PROVIDER_RESEARCH.md` — مقایسهٔ پیشنهادی و غیرتعهدآور میزبانی، PostgreSQL، پیامک/OTP و ذخیره‌سازی فایل در ایران؛ شامل قیمت‌های صفحه‌های عمومی، محاسبهٔ سادهٔ سالانه، لینک منبع و موارد تأییدنشده.
- این گزارش — فرمان‌ها و خروجی‌های واقعی پایین را نگه می‌دارد. هیچ‌یک از این فایل‌ها در این مرحله commit یا `git add` نشده‌اند.

## مبنای Git و فرمان‌های اجراشده

درخت کاری مربوط به `/home/user/franchise-plus-platform`، مخزن `shimmmmmmmmma/franchise-plus` است. مبنای مورد قبول مالک همچنان commit دقیق `4002c70` است؛ `main` فعلی نسخهٔ دیگری است.

فرمان:

```bash
git merge-base --is-ancestor 4002c70fef15ff9662e0db9e3356b44a12f48f3a origin/main
```

خروجی واقعی: کد خروج `0` (کامیت مورد تأیید، جدّ `origin/main` است).

فرمان:

```bash
git diff --name-status 4002c70fef15ff9662e0db9e3356b44a12f48f3a..origin/main
git diff --stat 4002c70fef15ff9662e0db9e3356b44a12f48f3a..origin/main
```

خروجی واقعی:

```text
A	docs/HANDOFF_FULL.md
 docs/HANDOFF_FULL.md | 251 +++++++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 251 insertions(+)
```

فرمان و خروجی refs جاری:

```bash
git ls-remote --heads origin main gh-pages
```

```text
4514e9ca4d9a26c370521eccb16b8689039e271e	refs/heads/gh-pages
8655c1bebd3728c80e9b7b617dc1ee820d92fd9a	refs/heads/main
```

بنابراین ref زندهٔ `gh-pages` هنگام بررسی `4514e9c…` و ref `main` برابر `8655c1b…` بود؛ این با پذیرش UI روی `4002c70` یکی نیست.

## بررسی درخت کاری

فرمان:

```bash
git diff --check
```

خروجی: بدون پیام خطا؛ کد خروج `0`.

بررسی فاصلهٔ انتهایی دو یادداشت جدید با Python:

```bash
python3 - <<'PY'
from pathlib import Path
files = [Path('docs/phase1/ACCEPTANCE_RECORD.md'), Path('docs/phase2/IRAN_PROVIDER_RESEARCH.md')]
errors = []
for path in files:
    for lineno, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        if line.rstrip(' \t') != line:
            errors.append(f'{path}:{lineno}: trailing whitespace')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print('PASS: no trailing spaces/tabs in either authored note')
PY
```

خروجی واقعی:

```text
PASS: no trailing spaces/tabs in either authored note
authored_note_whitespace_exit=0
```

خروجی `git status --short` در پایان این مرحله:

```text
 M .gitignore
 M README.md
 M package-lock.json
 M package.json
?? .env.example
?? compose.dev.yml
?? docs/phase1/
?? docs/phase2/
?? prisma.config.ts
?? prisma/
```

تغییرات Phase 2 قبلاً در درخت کاری وجود داشتند و reset/overwrite نشدند. این مرحله هیچ commit، staging، reset یا deploy انجام نداد. فایل `.env` محلی خوانده، چاپ یا تغییر داده نشد.

## URL قابل مشاهده و وضعیت زنده

صفحهٔ موجود با واکشی وب بررسی شد:

- URL: <https://shimmmmmmmmma.github.io/franchise-plus/>
- نتیجهٔ واقعی: `fetch_page` با `status=success` و عنوان «فرانچایز پلاس | پلتفرم واگذاری نمایندگی».
- صفحه نشان «پیش‌نمایش طراحی — Phase 1» دارد و خودش اعلام می‌کند برندها، پرونده‌ها و ارقام ساختگی‌اند؛ این نشانی فقط پیش‌نمایش ثابت Phase 1 است. این مرحله هیچ سرور یا URL محلی تازه‌ای راه‌اندازی نکرد.

## حدود آزمون و اتصال

در این مرحله `npm run build`، تست API/DB، اجرای Compose، restore پشتیبان یا آزمون مرورگر/دسترس‌پذیری تکرار نشد. Docker/Compose در بررسی قبلی نصب نبود و آزمون‌های تاریخی DB روی PostgreSQL سیستمی بودند؛ آن‌ها را نتیجهٔ این مرحله یا شاهد Compose تلقی نمی‌کنیم. هیچ KYC، خرید، ثبت‌نام، آزمون شبکه از ISP داخل ایران، ارسال SMS، بارگذاری فایل، پرداخت یا اتصال واقعی به ارائه‌دهنده انجام نشد.

## گام بعدی — متوقف تا تأیید مالک

پیشنهاد گام بعدی فقط **همسان‌سازی اسنادی** و بدون تغییر اجرایی است. مسیرهایی که پیش از هر ویرایش شناسایی و برای تأیید مالک ارائه می‌شوند:

- `docs/DATABASE_SCHEMA.md` — نقش‌های چندگانه، `user_roles`، نقش فعال و مرز جدول‌های MVP؛
- `docs/SECURITY_AND_ACCESS_CONTROL.md` — مجوز API بر مبنای نقش فعال/مالکیت/تخصیص، تعارض منافع و آزمون‌های منع دسترسی؛
- `docs/PROJECT_ROADMAP.md` — جریان محدود MVP و گیت Phase 1/2.

این سه سند در این مرحله ویرایش نشده‌اند. هر تغییر در آن‌ها، schema، migration، API یا سرویس بیرونی تا دریافت تأیید جداگانه متوقف می‌ماند.
