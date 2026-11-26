import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'فرصت‌های نمایندگی',
  description:
    'فهرست فرصت‌های واگذاری نمایندگی در ایران: سرمایهٔ اولیه، حق امتیاز، شهر و صنعت. هر فرصت پیش از انتشار توسط تیم بررسی شده است.',
  alternates: { canonical: '/opportunities/' },
};

export default function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
