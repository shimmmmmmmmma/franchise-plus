import type { Metadata } from 'next';
import '@fontsource-variable/vazirmatn';
import '@fontsource/estedad/400.css';
import '@fontsource/estedad/500.css';
import '@fontsource/estedad/600.css';
import '@fontsource/estedad/700.css';
import '@fontsource/estedad/800.css';
import '@fontsource/gulzar/arabic-400.css';
import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/shell';

export const metadata: Metadata = {
  title: 'فرانچایز پلاس | پلتفرم واگذاری نمایندگی',
  description:
    'فرانچایز پلاس: مدیریت پرونده، احراز هویت دو طرف، تطبیق متقاضی با فرصت و گفت‌وگوی کنترل‌شده برای واگذاری نمایندگی در ایران.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* کلاس `js` پیش از رندر اضافه می‌شود؛ بدون آن همهٔ محتوا دیده می‌شود */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
      </head>
      <body>
        <a href="#main" className="sr-only">
          پرش به محتوای اصلی
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
