'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { industries, opportunities } from '@/lib/data';
import { faNum } from '@/lib/fa';
import { OpportunityCard, Crumbs, Notice } from '@/components/ui';

export default function OpportunitiesPage() {
  const [sector, setSector] = useState('همه');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    return opportunities.filter((item) => {
      const bySector = sector === 'همه' || item.sector === sector;
      const q = query.trim();
      const byQuery =
        q.length === 0 ||
        item.brand.includes(q) ||
        item.city.includes(q) ||
        item.sector.includes(q);
      return bySector && byQuery;
    });
  }, [sector, query]);

  return (
    <div className="container">
      <Crumbs items={[{ href: '/', label: 'خانه' }, { label: 'فرصت‌های نمایندگی' }]} />

      <header style={{ paddingBottom: '1.6rem' }}>
        <span className="eyebrow">فرصت‌ها</span>
        <h1 className="h1" style={{ marginTop: '0.7rem' }}>
          فرصت‌های نمایندگی منتشرشده
        </h1>
        <p className="lead" style={{ marginTop: '0.6rem' }}>
          فقط فرصت‌هایی که تیم بررسی و مدیر منتشر کرده است. فیلترها بخشی از طراحی‌اند؛ در این
          پیش‌نمایش، دادهٔ ساختگی نمایش داده می‌شود.
        </p>
      </header>

      <div style={{ paddingBottom: '1rem' }}>
        <Notice kind="warn">
          این فهرست نمونه است. هیچ برند واقعی در این صفحه وجود ندارد و اعداد برای آزمون طراحی
          است.
        </Notice>
      </div>

      <div className="row wrap" style={{ justifyContent: 'space-between', gap: '1rem', paddingBlock: '1.2rem' }}>
        <div className="chips" role="group" aria-label="فیلتر صنعت">
          {industries.map((item) => (
            <button
              key={item}
              type="button"
              className="chip"
              aria-pressed={sector === item}
              onClick={() => setSector(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '240px', flex: '0 1 260px' }}>
          <label className="sr-only" htmlFor="q">
            جست‌وجو در فرصت‌ها
          </label>
          <input
            id="q"
            className="input"
            placeholder="جست‌وجو: برند، شهر یا صنعت"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'space-between', paddingBottom: '1rem' }}>
        <span className="micro muted">
          {faNum(list.length)} فرصت از {faNum(opportunities.length)} فرصت نمونه
        </span>
        <span className="micro muted">مرتب‌سازی: تازه‌ترین انتشار</span>
      </div>

      {list.length === 0 ? (
        <div className="card-flat" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div className="h3" style={{ marginBottom: '0.5rem' }}>
            برای این فیلتر فرصتی پیدا نشد
          </div>
          <p className="small muted" style={{ marginBottom: '1.2rem' }}>
            فیلتر صنعت را بردار یا عبارت جست‌وجو را کوتاه‌تر کن.
          </p>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setSector('همه');
              setQuery('');
            }}
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid--3" style={{ paddingBottom: '3rem' }}>
          {list.map((item) => (
            <OpportunityCard key={item.slug} item={item} />
          ))}
        </div>
      )}

      <div className="banner" style={{ marginBottom: '3rem' }}>
        <div>
          <div className="h3" style={{ marginBottom: '0.4rem' }}>
            فرصت مناسب پیدا نکردی؟
          </div>
          <p className="muted small">
            پروندهٔ گیرندهٔ نمایندگی را بساز؛ وقتی فرصت هم‌خوان منتشر شد، در پنل خودت می‌بینی.
          </p>
        </div>
        <Link href="/join/" className="btn btn--primary">
          ساخت پرونده
          <span className="btn__arrow" aria-hidden="true">
            ←
          </span>
        </Link>
      </div>
    </div>
  );
}
