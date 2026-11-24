import Link from 'next/link';
import type { ReactNode } from 'react';

export type PanelNavItem = {
  label: string;
  href?: string;
  count?: string;
  active?: boolean;
  locked?: boolean;
};

export function PanelShell({
  sideTitle,
  nav,
  title,
  subtitle,
  actions,
  children,
}: {
  sideTitle: string;
  nav: PanelNavItem[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="panel">
      <aside className="panel__side">
        <div className="panel__side-title">{sideTitle}</div>
        <nav className="panel__nav" aria-label={sideTitle}>
          {nav.map((item) => {
            const className = 'panel__nav-item';
            const content = (
              <>
                <span>
                  {item.label}
                  {item.locked ? <span aria-hidden="true"> · قفل</span> : null}
                </span>
                {item.count ? <span className="panel__count">{item.count}</span> : null}
              </>
            );
            return item.href && !item.active ? (
              <Link key={item.label} href={item.href} className={className}>
                {content}
              </Link>
            ) : (
              <span
                key={item.label}
                className={className}
                data-active={item.active ? 'true' : undefined}
                aria-current={item.active ? 'page' : undefined}
                style={item.locked ? { opacity: 0.55 } : undefined}
              >
                {content}
              </span>
            );
          })}
        </nav>
      </aside>

      <div className="panel__main">
        <div className="panel__head">
          <div>
            <h1 className="h2">{title}</h1>
            {subtitle ? (
              <p className="small muted" style={{ marginTop: '0.35rem' }}>
                {subtitle}
              </p>
            ) : null}
          </div>
          {actions ? <div className="row gap-2 wrap">{actions}</div> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
