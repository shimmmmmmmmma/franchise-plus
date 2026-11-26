import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOpportunity, opportunities } from '@/lib/data';
import { faNum } from '@/lib/fa';
import { Crumbs, Notice, StatusBadge, SectionHead } from '@/components/ui';
import { OpportunityLedger } from '@/components/ledger';
import { Reveal } from '@/components/reveal';

export function generateStaticParams() {
  return opportunities.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getOpportunity(slug);
  if (!item) return { title: 'فرصت پیدا نشد' };
  return {
    title: `${item.brand} — فرصت نمایندگی ${item.city}`,
    description: `${item.brand} در ${item.sector}، ${item.city}: سرمایهٔ اولیه ${item.investment} و حق امتیاز ${item.royalty}. ${item.summary}`,
    alternates: { canonical: `/opportunities/${item.slug}/` },
  };
}

export default async function OpportunityDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getOpportunity(slug);

  if (!item) return notFound();

  return (
    <div className="container">
      <Crumbs
        items={[
          { href: '/', label: 'خانه' },
          { href: '/opportunities/', label: 'فرصت‌ها' },
          { label: item.brand },
        ]}
      />

      <header className="row wrap" style={{ alignItems: 'flex-start', gap: '1.2rem', paddingBottom: '1.4rem' }}>
        <span className="opp-card__logo" style={{ width: 56, height: 56, fontSize: '1.3rem' }} aria-hidden="true">
          {item.monogram}
        </span>
        <div className="grow">
          <div className="row gap-2 wrap" style={{ marginBottom: '0.4rem' }}>
            <StatusBadge kind="ok">برند تأییدشده</StatusBadge>
            <span className="micro muted">شناسهٔ فرصت: FP-{item.slug.toUpperCase().slice(0, 4)}</span>
          </div>
          <h1 className="h1">{item.brand}</h1>
          <p className="muted small" style={{ marginTop: '0.35rem' }}>
            {item.sector} · {item.province}، {item.city} · انتشار {item.published} ·{' '}
            {faNum(item.branches)} شعبهٔ فعال
          </p>
        </div>
      </header>

      <div className="detail-grid" style={{ paddingBottom: '3.5rem' }}>
        <div>
          <section style={{ paddingBottom: '1.8rem' }}>
            <p className="lead" style={{ maxWidth: 'none' }}>
              {item.summary}
            </p>
          </section>

          <section style={{ paddingBlock: '1.6rem', borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="h3" style={{ marginBottom: '0.7rem' }}>
              دربارهٔ این فرصت
            </h2>
            <p className="small muted" style={{ lineHeight: 2 }}>
              {item.about}
            </p>
          </section>

          <section style={{ paddingBlock: '1.6rem', borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="h3" style={{ marginBottom: '0.7rem' }}>
              چه چیزی شامل می‌شود
            </h2>
            <ul className="small" style={{ lineHeight: 2.1, color: 'var(--ink)' }}>
              {item.highlights.map((h) => (
                <li key={h} style={{ display: 'flex', gap: '0.6rem' }}>
                  <span aria-hidden="true" style={{ color: 'var(--bronze)' }}>
                    —
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section style={{ paddingBlock: '1.6rem', borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="h3" style={{ marginBottom: '0.7rem' }}>
              شرایط و الزامات متقاضی
            </h2>
            <ul className="small" style={{ lineHeight: 2.1 }}>
              {item.requirements.map((r) => (
                <li key={r} style={{ display: 'flex', gap: '0.6rem' }}>
                  <span aria-hidden="true" style={{ color: 'var(--bronze)' }}>
                    —
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section style={{ paddingBlock: '1.6rem', borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="h3" style={{ marginBottom: '0.9rem' }}>
              اطلاعات مالی
            </h2>
            <div className="card-flat" style={{ padding: '0.4rem 1.1rem' }}>
              {item.financial.map((row) => (
                <div className="fact" key={row.key} style={{ paddingBlock: '0.6rem' }}>
                  <span className="fact__k">{row.key}</span>
                  <span className="fact__v">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="micro muted" style={{ marginTop: '0.7rem' }}>
              اعداد این بخش نمونهٔ طراحی است. در محصول نهایی، ارقام از پروندهٔ تأییدشدهٔ برند
              خوانده می‌شود و مسئولیت صحت آن با واگذارکننده است.
            </p>
          </section>

          <section style={{ paddingBlock: '1.6rem', borderTop: '1px solid var(--line-soft)' }}>
            <h2 className="h3" style={{ marginBottom: '0.9rem' }}>
              پشتیبانی واگذارکننده
            </h2>
            <div className="spec-grid">
              {item.support.map((row) => (
                <div className="spec-grid__item" key={row.key}>
                  <div className="spec-grid__k">{row.key}</div>
                  <div className="spec-grid__v">{row.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ paddingTop: '1.6rem', borderTop: '1px solid var(--line-soft)' }}>
            <Notice kind="info" title="دادهٔ نمایشی">
              این صفحه نمونهٔ طراحی است و به هیچ برند واقعی اشاره نمی‌کند. در محصول نهایی، متن و
              ارقام از رکورد رسمی منتشرشدهٔ مدیر خوانده می‌شود.
            </Notice>
          </section>
        </div>

        {/* --- sidebar --- */}
        <aside style={{ position: 'sticky', top: '96px' }}>
          <div className="card-flat" style={{ padding: '1.3rem' }}>
            <div className="micro muted" style={{ marginBottom: '0.5rem' }}>
              سرمایهٔ اولیه
            </div>
            <div className="h3" style={{ marginBottom: '1rem' }}>
              {item.investment}
            </div>

            <div className="fact">
              <span className="fact__k">حق امتیاز دوره‌ای</span>
              <span className="fact__v">{item.royalty}</span>
            </div>
            <div className="fact">
              <span className="fact__k">متراژ پیشنهادی</span>
              <span className="fact__v">{item.area}</span>
            </div>
            <div className="fact">
              <span className="fact__k">شهر</span>
              <span className="fact__v">{item.city}</span>
            </div>

            <div style={{ marginTop: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/join/" className="btn btn--primary btn--block">
                ثبت درخواست همکاری
              </Link>
              <Link href="/how-it-works/" className="btn btn--ghost btn--block btn--sm">
                درخواست چطور بررسی می‌شود؟
              </Link>
            </div>

            <p className="micro muted" style={{ marginTop: '0.9rem', lineHeight: 1.9 }}>
              ثبت درخواست فقط پس از تکمیل پرونده و احراز هویت ممکن است. گفت‌وگو با برند پس از
              تأیید تیم باز می‌شود.
            </p>
          </div>

          <div className="card-flat" style={{ padding: '1.1rem 1.3rem', marginTop: '0.9rem' }}>
            <div className="micro muted" style={{ marginBottom: '0.5rem' }}>
              وضعیت این فرصت
            </div>
            <div className="timeline" style={{ marginTop: '0.3rem' }}>
              <div className="tl-item" data-state="done">
                <span className="tl-dot" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <div className="tl-title">اطلاعات برند ارسال شد</div>
                  <div className="tl-meta">۱۴۰۵/۰۷/۱۸</div>
                </div>
              </div>
              <div className="tl-item" data-state="done">
                <span className="tl-dot" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <div className="tl-title">مدارک و مجوزها تأیید شد</div>
                  <div className="tl-meta">۱۴۰۵/۰۸/۰۱</div>
                </div>
              </div>
              <div className="tl-item" data-state="done">
                <span className="tl-dot" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <div className="tl-title">رکورد رسمی توسط مدیر ساخته شد</div>
                  <div className="tl-meta">۱۴۰۵/۰۸/۱۲</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* --- related --- */}
      <section className="section" style={{ borderTop: '1px solid var(--line-soft)' }}>
        <SectionHead
          eyebrow="فرصت‌های مشابه"
          title="در همین صنعت"
          action={{ href: '/opportunities/', label: 'همهٔ فرصت‌ها' }}
        />
        <Reveal>
          <OpportunityLedger
            items={opportunities.filter((o) => o.slug !== item.slug).slice(0, 3)}
            showHead={false}
          />
        </Reveal>
      </section>
    </div>
  );
}
