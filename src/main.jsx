import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialRecipients = [
  { name: 'Maya Thompson', email: 'maya.thompson@example.com', group: 'Match alerts', active: true },
  { name: 'Oliver Martin', email: 'oliver.martin@example.com', group: 'Weekly digest', active: true },
  { name: 'Priya Shah', email: 'priya.shah@example.com', group: 'Match alerts', active: true },
  { name: 'Noah Williams', email: 'noah.williams@example.com', group: 'Premium picks', active: false },
];

function Icon({ children, size = 18 }) { return <span className="icon" style={{ fontSize: size }}>{children}</span>; }

function App() {
  const [recipients, setRecipients] = useState(initialRecipients);
  const [automation, setAutomation] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sentNow, setSentNow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', group: 'Match alerts' });
  const activeCount = useMemo(() => recipients.filter((item) => item.active).length, [recipients]);

  const addRecipient = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setRecipients((current) => [...current, { ...form, active: true }]);
    setForm({ name: '', email: '', group: 'Match alerts' });
    setModalOpen(false);
  };

  const sendUpdate = () => {
    setSentNow(true);
    window.setTimeout(() => setSentNow(false), 3200);
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">G</span><span>goalwire</span></div>
      <nav>
        <a className="nav-item active"><Icon>⌂</Icon> Overview</a>
        <a className="nav-item"><Icon>◉</Icon> Matches</a>
        <a className="nav-item"><Icon>✦</Icon> Predictions</a>
        <a className="nav-item"><Icon>✉</Icon> Email alerts <span className="nav-badge">3</span></a>
        <a className="nav-item"><Icon>▦</Icon> Reports</a>
      </nav>
      <div className="sidebar-bottom"><a className="nav-item"><Icon>⚙</Icon> Settings</a><div className="profile"><div className="avatar">AR</div><div><strong>Alex Rivera</strong><small>Administrator</small></div><span className="more">•••</span></div></div>
    </aside>
    <main>
      <header className="topbar"><div className="crumb">Admin dashboard <span>/</span> Overview</div><div className="top-actions"><button className="bell">♧<i /></button><div className="avatar top-avatar">AR</div></div></header>
      <div className="content">
        <section className="hero"><div><p className="eyebrow">MONDAY, 24 JUNE</p><h1>Good morning, Alex <span>✦</span></h1><p className="subhead">Your email alerts are running smoothly. Here’s what’s happening today.</p></div><button className="outline-button" onClick={() => setModalOpen(true)}><span>＋</span> Add recipient</button></section>

        <section className="stat-grid">
          <article className="stat-card"><div className="stat-icon purple">✉</div><div><p>ACTIVE RECIPIENTS</p><h2>{activeCount}</h2><small><b>+12%</b> from last month</small></div></article>
          <article className="stat-card"><div className="stat-icon orange">↗</div><div><p>EMAILS SENT</p><h2>1,284</h2><small><b>+8.4%</b> this week</small></div></article>
          <article className="stat-card"><div className="stat-icon green">✓</div><div><p>DELIVERY RATE</p><h2>98.7%</h2><small><b>+0.6%</b> from last week</small></div></article>
        </section>

        <section className="grid-main">
          <article className="panel automation-panel"><div className="panel-heading"><div><p className="eyebrow">AUTOMATION</p><h2>Match alerts</h2></div><label className="switch"><input type="checkbox" checked={automation} onChange={(e) => setAutomation(e.target.checked)} /><span /></label></div><p className="panel-copy">Send tailored match predictions to your saved recipients before every kickoff.</p><div className="next-send"><div className="calendar"><b>24</b><small>JUN</small></div><div><small>NEXT SCHEDULED SEND</small><strong>Today at 18:30</strong><p>Spain vs. Italy · Euro 2024</p></div><button className="ghost-button" onClick={sendUpdate}>Send now</button></div>{sentNow && <div className="toast">Update queued for {activeCount} active recipients.</div>}</article>
          <article className="panel performance"><div className="panel-heading"><div><p className="eyebrow">LAST 30 DAYS</p><h2>Engagement</h2></div><button className="dots">•••</button></div><div className="metric-row"><div><strong>62.4%</strong><span>Open rate</span></div><div><strong>18.9%</strong><span>Click rate</span></div></div><svg viewBox="0 0 450 126" preserveAspectRatio="none" aria-label="Engagement trend"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#7564e8" stopOpacity=".22"/><stop offset="1" stopColor="#7564e8" stopOpacity="0"/></linearGradient></defs><path d="M0 93 C24 73 42 84 62 70 S101 100 123 82 S159 34 178 59 S215 78 238 55 S268 70 290 40 S329 64 348 44 S386 65 405 35 S432 43 450 12 L450 126 L0 126Z" fill="url(#fill)"/><path d="M0 93 C24 73 42 84 62 70 S101 100 123 82 S159 34 178 59 S215 78 238 55 S268 70 290 40 S329 64 348 44 S386 65 405 35 S432 43 450 12" fill="none" stroke="#7666e8" strokeWidth="3"/></svg><div className="axis"><span>May 25</span><span>Jun 1</span><span>Jun 8</span><span>Jun 15</span><span>Jun 22</span></div></article>
        </section>

        <section className="panel recipients-panel"><div className="panel-heading"><div><p className="eyebrow">SAVED CONTACTS</p><h2>Recipients</h2></div><button className="text-button">View all <span>→</span></button></div><div className="recipient-list">{recipients.slice(0, 4).map((person, index) => <div className="recipient" key={person.email}><div className={'recipient-avatar a' + index}>{person.name.split(' ').map(x => x[0]).join('')}</div><div className="person"><strong>{person.name}</strong><span>{person.email}</span></div><span className="tag">{person.group}</span><label className="switch tiny"><input aria-label={`Toggle ${person.name}`} type="checkbox" checked={person.active} onChange={() => setRecipients(current => current.map(item => item.email === person.email ? { ...item, active: !item.active } : item))}/><span /></label></div>)}</div></section>
      </div>
    </main>
    {modalOpen && <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}><form className="modal" onSubmit={addRecipient} onMouseDown={(e) => e.stopPropagation()}><button className="close" type="button" onClick={() => setModalOpen(false)}>×</button><p className="eyebrow">SAVED CONTACTS</p><h2>Add a recipient</h2><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Lee" autoFocus /></label><label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jordan@example.com" /></label><label>Alert group<select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}><option>Match alerts</option><option>Weekly digest</option><option>Premium picks</option></select></label><button className="primary-button" type="submit">Save recipient</button></form></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
