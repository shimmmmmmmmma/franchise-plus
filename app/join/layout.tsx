import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروع پرونده',
  description:
    'انتخاب نقش (گیرندهٔ نمایندگی یا واگذارکننده)، تکمیل اطلاعات پایه و ثبت شمارهٔ همراه برای شروع پرونده در فرانچایز پلاس.',
  alternates: { canonical: '/join/' },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
