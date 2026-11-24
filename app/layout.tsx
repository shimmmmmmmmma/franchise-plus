import type { Metadata } from 'next';
import '@fontsource-variable/vazirmatn';
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
