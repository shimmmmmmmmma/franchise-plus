import Link from 'next/link';
import { faNum } from '@/lib/fa';
import type { Opportunity } from '@/lib/data';

/**
 * فهرست ادیتوریال فرصت‌ها — ردیف‌های جدولی به‌جای کارت‌های متقارن.
 * الهام گرفته از صفحهٔ فهرست مجله: شماره، ستون‌های عددی، خطوط مو.
 */
export function OpportunityLedger({
  items,
  showHead = true,
}: {
  items: Opportunity[];
  showHead?: boolean;
}) {
  return (
    <div className="ledger">
      {showHead ? (
        <div className="ledger__head" aria-hidden="true">
          <span>#</span>
          <span>برند و صنعت</span>
          <span>سرمایهٔ اولیه</span>
          <span>حق امتیاز</span>
          <span />
        </div>
      ) : null}

      {items.map((o, i) => (
        <Link key={o.slug} href={`/opportunities/${o.slug}/`} className="ledger__row">
          <span className="ledger__idx">{faNum(String(i + 1).padStart(2, '0'))}</span>
          <span>
            <span className="ledger__name">{o.brand}</span>
            <span className="ledger__meta">
              {o.sector} · {o.city} · {faNum(o.branches)} شعبه
            </span>
          </span>
          <span className="ledger__val">
            <small>سرمایهٔ اولیه</small>
            {o.investment}
          </span>
          <span className="ledger__val">
            <small>حق امتیاز</small>
            {o.royalty}
          </span>
          <span className="ledger__arrow" aria-hidden="true">
            ←
          </span>
        </Link>
      ))}
    </div>
  );
}
