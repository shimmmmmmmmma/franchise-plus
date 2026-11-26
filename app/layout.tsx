import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/vazirmatn';
import '@fontsource/estedad/400.css';
import '@fontsource/estedad/500.css';
import '@fontsource/estedad/600.css';
import '@fontsource/estedad/700.css';
import '@fontsource/estedad/800.css';
import '@fontsource/gulzar/arabic-400.css';
import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/shell';

const siteUrl = 'https://shimmmmmmmmma.github.io/franchise-plus/';
const siteDescription =
  'فرانچایز پلاس: مدیریت پرونده، احراز هویت دو طرف، تطبیق متقاضی با فرصت و گفت‌وگوی کنترل‌شده برای واگذاری نمایندگی در ایران.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'فرانچایز پلاس | پلتفرم واگذاری نمایندگی',
    template: '%s | فرانچایز پلاس',
  },
  description: siteDescription,
  applicationName: 'فرانچایز پلاس',
  keywords: ['فرانچایز', 'واگذاری نمایندگی', 'نمایندگی', 'بازار فرانچایز ایران', 'فرانچایز پلاس'],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'فرانچایز پلاس',
    title: 'فرانچایز پلاس | پلتفرم واگذاری نمایندگی',
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}og.png`,
        width: 1200,
        height: 630,
        alt: 'فرانچایز پلاس — پلتفرم واگذاری نمایندگی در ایران',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فرانچایز پلاس | پلتفرم واگذاری نمایندگی',
    description: siteDescription,
    images: [`${siteUrl}og.png`],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#142A3A',
  colorScheme: 'light',
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
        <main id="main" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
