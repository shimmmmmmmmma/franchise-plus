'use client';

import { useEffect, useRef, useState } from 'react';
import { PanelShell } from '@/components/panel';
import { Notice, StatusBadge } from '@/components/ui';
import { chatMessages } from '@/lib/data';

const nav = [
  { label: 'گفت‌وگوها', active: true, count: '۱' },
  { label: 'جلسه‌ها', href: '/chat/' },
  { label: 'اسناد و قرارداد', href: '/chat/' },
  { label: 'خلاصهٔ پرونده', href: '/dashboard/' },
];

type Msg = {
  kind: 'system' | 'me' | 'them';
  author: string;
  time: string;
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(chatMessages as Msg[]);
  const [draft, setDraft] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  // اسکرول به آخرین پیام و اعلام پیام جدید به صفحه‌خوان‌ها (aria-live روی لاگ)
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { kind: 'me', author: 'سارا رضایی', time: '۱۱:۰۲', text }]);
    setDraft('');
  };

  return (
    <PanelShell
      sideTitle="مذاکره و پیگیری"
      nav={nav}
      title="گفت‌وگوی کنترل‌شده"
      subtitle="خرده‌فروشی بارانا · کارشناس پرونده: مشاور ۱ · گفت‌وگو پس از تأیید درخواست باز شده است"
      actions={<StatusBadge kind="ok">گفت‌وگو فعال</StatusBadge>}
    >
      <div className="chat-grid">
        <section className="chat">
          <div className="chat__head">
            <div className="row gap-2">
              <span className="avatar" aria-hidden="true">
                ب
              </span>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 500 }}>خرده‌فروشی بارانا</div>
                <div className="micro muted">نمایندهٔ برند · حضور کارشناس پرونده</div>
              </div>
            </div>
            <span className="badge badge--muted">پیام‌ها ثبت می‌شوند</span>
          </div>

          <div
            className="chat__log"
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="پیام‌های گفت‌وگو"
            tabIndex={0}
          >
            {messages.map((m, i) => {
              if (m.kind === 'system') {
                return (
                  <div className="msg msg--system" key={`${m.kind}-${i}`}>
                    <div className="msg__bubble">{m.text}</div>
                  </div>
                );
              }
              return (
                <div className={`msg ${m.kind === 'me' ? 'msg--me' : 'msg--them'}`} key={`${m.kind}-${i}`}>
                  <div className="msg__meta">
                    <span>{m.author}</span>
                    <span>{m.time}</span>
                  </div>
                  <div className="msg__bubble">{m.text}</div>
                </div>
              );
            })}
          </div>

          <div className="chat__compose">
            <label className="sr-only" htmlFor="draft">
              متن پیام
            </label>
            <input
              id="draft"
              className="input"
              placeholder="پیام خود را بنویس… (در این پیش‌نمایش ذخیره نمی‌شود)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-describedby="draft-help"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button type="button" className="btn btn--primary" onClick={send}>
              ارسال
            </button>
            <p id="draft-help" className="sr-only">
              با کلید Enter پیام در همین مرورگر ثبت می‌شود و به سروری ارسال نمی‌شود.
            </p>
          </div>
        </section>

        <aside>
          <div className="card-flat">
            <div className="h3" style={{ marginBottom: '0.7rem' }}>
              حاضران در گفت‌وگو
            </div>
            <div className="fact">
              <span className="fact__k">گیرندهٔ نمایندگی</span>
              <span className="fact__v">سارا رضایی</span>
            </div>
            <div className="fact">
              <span className="fact__k">واگذارکننده</span>
              <span className="fact__v">نمایندهٔ برند بارانا</span>
            </div>
            <div className="fact">
              <span className="fact__k">کارشناس پرونده</span>
              <span className="fact__v">مشاور ۱ — دسترسی محدود</span>
            </div>
            <div className="fact">
              <span className="fact__k">وضعیت پرونده</span>
              <span className="fact__v">در مذاکره</span>
            </div>
          </div>

          <div className="card-flat" style={{ marginTop: '0.9rem' }}>
            <div className="h3" style={{ marginBottom: '0.6rem' }}>
              قواعد این گفت‌وگو
            </div>
            <ul className="small muted" style={{ lineHeight: 2 }}>
              <li>— گفت‌وگو فقط پس از تأیید درخواست باز می‌شود</li>
              <li>— کارشناس فقط بخشی از پیام‌ها را می‌بیند که به پرونده مربوط است</li>
              <li>— پیام‌ها و مشاهدهٔ گفت‌وگو در گزارش ممیزی ثبت می‌شود</li>
            </ul>
          </div>

          <div style={{ marginTop: '0.9rem' }}>
            <Notice kind="warn" title="این گفت‌وگو نمایشی است">
              پیام‌های ارسالی در حافظهٔ مرورگر می‌مانند و به سروری ارسال نمی‌شوند.
            </Notice>
          </div>
        </aside>
      </div>

      <section className="grid grid--2" style={{ marginTop: '1.4rem' }}>
        <div className="card-flat">
          <div className="h3" style={{ marginBottom: '0.6rem' }}>
            قدم بعدی پرونده
          </div>
          <p className="small muted" style={{ lineHeight: 1.95 }}>
            پس از توافق اولیه، جلسهٔ حضوری ثبت می‌شود و خلاصهٔ مذاکره و اسناد در پرونده نگهداری
            می‌شود. ثبت نتیجهٔ همکاری، مبنای محاسبهٔ درآمد پلتفرم است.
          </p>
          <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: '0.8rem' }}>
            درخواست جلسه
          </button>
        </div>
        <div className="card-flat">
          <div className="h3" style={{ marginBottom: '0.6rem' }}>
            اسناد مرتبط
          </div>
          <div className="fact">
            <span className="fact__k">فهرست تجهیزات</span>
            <span className="fact__v">پیوست فرصت</span>
          </div>
          <div className="fact">
            <span className="fact__k">پیش‌نویس قرارداد</span>
            <span className="fact__v muted">در انتظار متن حقوقی</span>
          </div>
        </div>
      </section>
    </PanelShell>
  );
}
