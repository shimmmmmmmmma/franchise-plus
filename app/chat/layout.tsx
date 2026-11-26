import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'گفت‌وگوی کنترل‌شده',
  description:
    'گفت‌وگوی کنترل‌شدهٔ پرونده میان گیرندهٔ نمایندگی، واگذارکننده و کارشناس پرونده — پس از تأیید درخواست و با ثبت در گزارش ممیزی.',
  alternates: { canonical: '/chat/' },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
