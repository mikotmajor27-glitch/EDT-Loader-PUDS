'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, ArrowUpRight, BadgeCheck, Check, CircleHelp, Clock3, Copy, History, LockKeyhole, RotateCcw, Settings, ShieldCheck, Store, Wallet, Smartphone, Zap } from 'lucide-react';
import WalletModules from './WalletModules';

type Profile = { id: string; name: string };
type DemoCode = { code: string; pudsId: string; amount: number; note?: string; status: 'Available' | 'Used/Expired'; createdAt: string };
type Transaction = { ref: string; type: string; amount: number; from: string; to: string; note: string; status: 'Completed'; createdAt: string };
type DemoState = { balances: Record<string, number>; codes: DemoCode[]; transactions: Transaction[] };
type Screen = 'home' | 'send' | 'terminal' | 'history' | 'settings' | 'edt' | 'booking' | 'cashin' | 'cashout' | 'codes';

const STORAGE_KEY = 'puds-wallet-demo-v1';
const STARTING_BALANCE = 12480.5;
const profiles: Profile[] = [
  { id: 'PUDS-24819', name: 'Maria Dela Cruz' },
  { id: 'PUDS-10001', name: 'Juan Dela Cruz' },
  { id: 'PUDS-10002', name: 'Maria Santos' },
  { id: 'PUDS-10003', name: 'Pedro Reyes' },
];
const emptyState = (): DemoState => ({ balances: Object.fromEntries(profiles.map((profile) => [profile.id, STARTING_BALANCE])), codes: [], transactions: [] });
const money = (amount: number) => amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const newReference = () => `PUDS-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;

export default function PudsDemo() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentId, setCurrentId] = useState(profiles[0].id);
  const [demo, setDemo] = useState<DemoState>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('250');
  const [note, setNote] = useState('');
  const [terminalId, setTerminalId] = useState(profiles[0].id);
  const [terminalCode, setTerminalCode] = useState('');
  const [terminalAmount, setTerminalAmount] = useState('420');
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const [notice, setNotice] = useState('');
  const [terminalPassword, setTerminalPassword] = useState('');
  const [terminalUnlocked, setTerminalUnlocked] = useState(false);
  const [terminalEmail, setTerminalEmail] = useState('');
  const [terminalOtp, setTerminalOtp] = useState('');
  const [terminalOtpSent, setTerminalOtpSent] = useState(false);
  const [terminalOtpVerified, setTerminalOtpVerified] = useState(false);
  const [terminalPasswordInput, setTerminalPasswordInput] = useState('');
  const [terminalPasswordConfirm, setTerminalPasswordConfirm] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DemoState>;
        const defaults = emptyState();
        setDemo({
          balances: { ...defaults.balances, ...(parsed.balances ?? {}) },
          codes: Array.isArray(parsed.codes) ? parsed.codes : [],
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        });
      }
    } catch {
      setDemo(emptyState());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  }, [demo, hydrated]);

  const currentProfile = profiles.find((profile) => profile.id === currentId) ?? profiles[0];
  const balance = demo.balances[currentId] ?? STARTING_BALANCE;
  const resolvedRecipient = profiles.find((profile) => profile.id === recipient.trim().toUpperCase());
  const availableCode = useMemo(() => demo.codes.find((item) => item.code === terminalCode && item.pudsId === terminalId.trim().toUpperCase() && item.status === 'Available'), [demo.codes, terminalCode, terminalId]);

  useEffect(() => {
    if (availableCode) setTerminalAmount(String(availableCode.amount));
  }, [availableCode]);

  const submitTransfer = () => {
    const recipientId = recipient.trim().toUpperCase();
    const value = Number(amount);
    if (!/^PUDS-\d{5}$/.test(recipientId)) return setNotice('Enter a valid PUDS-XXXXX ID.');
    if (recipientId === currentId) return setNotice('Choose a different recipient profile.');
    if (!profiles.some((profile) => profile.id === recipientId)) return setNotice('Recipient not found. Choose a PUDS ID in the demo directory so the recipient can receive the transfer.');
    if (!Number.isFinite(value) || value <= 0 || Math.round(value * 100) !== value * 100) return setNotice('Enter a valid amount greater than ₱0.');
    if (value > balance) return setNotice('Insufficient demo balance for this transfer.');
    const transaction: Transaction = { ref: newReference(), type: 'Send money', amount: value, from: currentId, to: recipientId, note: note.trim(), status: 'Completed', createdAt: new Date().toISOString() };
    setDemo((prev) => ({ ...prev, balances: { ...prev.balances, [currentId]: (prev.balances[currentId] ?? STARTING_BALANCE) - value, ...(profiles.some((profile) => profile.id === recipientId) ? { [recipientId]: (prev.balances[recipientId] ?? STARTING_BALANCE) + value } : {}) }, transactions: [transaction, ...prev.transactions] }));
    setReceipt(transaction);
    setNotice('Transfer completed. This is simulated demo PHP only.');
  };

  const processTerminal = () => {
    const id = terminalId.trim().toUpperCase();
    if (!availableCode) return setNotice('Code not found, expired, or already used. Check the PUDS ID and 4-digit code.');
    const amountToDebit = Number(terminalAmount);
    if (!Number.isFinite(amountToDebit) || amountToDebit <= 0 || Math.round(amountToDebit * 100) !== amountToDebit * 100) return setNotice('Enter a valid terminal amount greater than ₱0.');
    if (amountToDebit !== availableCode.amount) return setNotice(`Enter the exact amount authorized by this code: ₱${money(availableCode.amount)}.`);
    if (amountToDebit > (demo.balances[id] ?? STARTING_BALANCE)) return setNotice('Insufficient demo balance.');
    const transaction: Transaction = { ref: newReference(), type: 'Terminal payment / cash-out', amount: amountToDebit, from: id, to: 'PUDS Terminal', note: availableCode.note || `Terminal amount entered: ₱${money(Number(terminalAmount) || 0)}`, status: 'Completed', createdAt: new Date().toISOString() };
    setDemo((prev) => ({ ...prev, balances: { ...prev.balances, [id]: (prev.balances[id] ?? STARTING_BALANCE) - amountToDebit }, codes: prev.codes.map((item) => item.code === availableCode.code ? { ...item, status: 'Used/Expired' } : item), transactions: [transaction, ...prev.transactions] }));
    setReceipt(transaction);
    setNotice('Payment completed. This code is now used and expired.');
    setTerminalCode('');
  };

  const purchase = (value: number, type: string, detail: string) => {
    if (!Number.isFinite(value) || value <= 0 || value > balance || Math.round(value * 100) !== value * 100) return false;
    const transaction: Transaction = { ref: newReference(), type, amount: value, from: currentId, to: detail, note: detail, status: 'Completed', createdAt: new Date().toISOString() };
    setDemo((prev) => ({ ...prev, balances: { ...prev.balances, [currentId]: (prev.balances[currentId] ?? STARTING_BALANCE) - value }, transactions: [transaction, ...prev.transactions] }));
    return true;
  };

  const deposit = (value: number, provider: string, reference: string) => {
    const transaction: Transaction = { ref: reference, type: 'Cash in', amount: value, from: provider, to: currentId, note: reference, status: 'Completed', createdAt: new Date().toISOString() };
    setDemo((prev) => ({ ...prev, balances: { ...prev.balances, [currentId]: (prev.balances[currentId] ?? STARTING_BALANCE) + value }, transactions: [transaction, ...prev.transactions] }));
  };

  const createBookingCode = (value: number, detail: string) => {
    if (!Number.isFinite(value) || value <= 0 || value > balance) { setNotice('Enter a valid amount within your wallet balance.'); return ''; }
    let secret: string;
    do {
      secret = String(Math.floor(1000 + Math.random() * 9000));
    } while (demo.codes.some((item) => item.code === secret && item.status === 'Available'));
    const created: DemoCode = { code: secret, pudsId: currentId, amount: value, note: detail, status: 'Available', createdAt: new Date().toISOString() };
    setDemo((prev) => ({ ...prev, codes: [created, ...prev.codes] }));
    return secret;
  };

  const submitTerminalGate = () => {
    if (terminalPassword) {
      if (terminalPasswordInput !== terminalPassword) return setNotice('Incorrect owner password. Please try again.');
      setTerminalUnlocked(true);
      setTerminalPasswordInput('');
      setNotice('PUDS Terminal unlocked.');
      return;
    }
    if (!terminalOtpVerified) {
      if (!/^[^\s@]+@gmail\.com$/i.test(terminalEmail)) return setNotice('Enter a valid Gmail address for the demo owner.');
      if (!terminalOtpSent) { setTerminalOtpSent(true); return setNotice('Demo OTP sent: 123456.'); }
      if (terminalOtp !== '123456') return setNotice('Incorrect demo OTP. Use 123456.');
      setTerminalOtpVerified(true);
      setTerminalOtp('');
      setNotice('Demo email verified. Create an owner password.');
      return;
    }
    if (terminalPasswordInput.length < 8) return setNotice('Use a password with at least 8 characters.');
    if (terminalPasswordInput !== terminalPasswordConfirm) return setNotice('Passwords do not match.');
    setTerminalPassword(terminalPasswordInput);
    setTerminalUnlocked(true);
    setTerminalPasswordInput('');
    setTerminalPasswordConfirm('');
    setTerminalEmail('');
    setTerminalOtpVerified(false);
    setTerminalOtpSent(false);
    setNotice('Demo terminal owner password created.');
  };

  const resetDemo = () => {
    const fresh = emptyState();
    setDemo(fresh);
    setReceipt(null);
    setNotice('Demo data reset. Each sample wallet is back to ₱12,480.50.');
  };

  const dateTime = (iso: string) => new Date(iso).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <main className="puds-app demo-wallet">
      <header className="topbar">
        <a className="brand-link" href="#home" onClick={(event) => { event.preventDefault(); setScreen('home'); setReceipt(null); }} aria-label="PUDS home"><span className="brand-lockup"><span className="brand-mark"><Wallet size={19} /></span><span><strong>PUDS</strong><small>Ang Wallet sa Balat</small></span></span></a>
        <nav className="portal-switch" aria-label="Demo app navigation"><button className={screen !== 'terminal' ? 'portal-tab active' : 'portal-tab'} onClick={() => { setScreen('home'); setReceipt(null); setTerminalUnlocked(false); }}><Wallet size={16} /> PUDS App</button><button className={screen === 'terminal' ? 'portal-tab active' : 'portal-tab'} onClick={() => { setScreen('terminal'); setReceipt(null); setTerminalUnlocked(false); }}><Store size={16} /> PUDS Terminal</button></nav>
        <button className="help-button" onClick={() => setNotice('DEMO MODE: simulated PHP funds only. No real money or payment credentials are used.')}><CircleHelp size={17} /><span>Help</span></button>
      </header>
      <div className="demo-ribbon"><span className="live-dot" /><b>DEMO MODE</b><span>Simulated PHP · No real money</span><span className="ribbon-spacer" /><ShieldCheck size={14} /> Saved on this device</div>
      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}

      {screen === 'home' && <>
        <section className="welcome-row"><div><div className="eyebrow">YOUR DEMO WALLET · SIMULATED PHP</div><h1>Money in your<br className="mobile-break" /> <em>hands.</em></h1><p>Try transfers and terminal payments safely in a persistent demo.</p></div><label className="account-pill profile-picker">Demo profile<select aria-label="Choose demo wallet profile" value={currentId} onChange={(event) => { setCurrentId(event.target.value); setNotice('Switched demo profile. Each profile has its own balance.'); }}><option value="PUDS-24819">Maria Dela Cruz · PUDS-24819</option>{profiles.slice(1).map((profile) => <option key={profile.id} value={profile.id}>{profile.name} · {profile.id}</option>)}</select></label></section>
        <section className="wallet-layout"><div className="wallet-column"><div className="balance-card"><div className="balance-top"><span><span className="balance-icon"><Wallet size={16} /></span> PUDS WALLET</span><span className="verified-label"><BadgeCheck size={14} /> DEMO MODE</span></div><div className="balance-amount"><span>₱</span> {Math.floor(balance).toLocaleString('en-PH')}<span className="cents">.{(balance % 1).toFixed(2).slice(2)}</span></div><div className="balance-caption">Available balance <span>•</span> Simulated funds only</div><div className="balance-footer"><span><span className="balance-dot" /> Ready to use</span><span>{currentProfile.id}</span></div></div>
          <div className="action-grid"><button onClick={() => { setScreen('send'); setReceipt(null); }} className="action-tile"><span className="action-icon send-icon"><ArrowUpRight size={20} /></span><b>Send</b><small>Transfer money</small></button><button onClick={() => setScreen('cashin')} className="action-tile"><span className="action-icon receive-icon"><Store size={20} /></span><b>Cash In</b><small>7-Eleven CLiQQ</small></button><button onClick={() => setScreen('edt')} className="action-tile"><span className="action-icon edt-icon"><Zap size={20} /></span><b>EDT Loader</b><small>Dual-SIM data/load</small></button><button onClick={() => setScreen('booking')} className="action-tile"><span className="action-icon secure-icon"><Store size={20} /></span><b>Restaurant Booking</b><small>Walk-in & advance</small></button><button onClick={() => setScreen('cashout')} className="action-tile"><span className="action-icon receive-icon"><BadgeCheck size={20} /></span><b>Cash Out</b><small>One-time store code</small></button><button onClick={() => { setScreen('terminal'); setReceipt(null); }} className="action-tile"><span className="action-icon secure-icon"><LockKeyhole size={20} /></span><b>PUDS Terminal</b><small>Password protected</small></button><button onClick={() => setScreen('history')} className="action-tile"><span className="action-icon edt-icon"><History size={20} /></span><b>History</b><small>Recent demo activity</small></button><button onClick={() => setScreen('settings')} className="action-tile"><span className="action-icon secure-icon"><Settings size={20} /></span><b>Settings</b><small>Reset demo data</small></button></div>
          <div className="section-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Transaction history</h2></div><button className="text-link" onClick={() => setScreen('history')}>View all <ArrowUpRight size={14} /></button></div>
          <div className="activity-card">{demo.transactions.filter((item) => item.from === currentId || item.to === currentId).slice(0, 4).map((item) => <div className="activity-row" key={item.ref}><span className="activity-symbol activity-blue"><ArrowUpRight size={17} /></span><span className="activity-copy"><b>{item.type}</b><small>{dateTime(item.createdAt)} · {item.ref}</small></span><strong className={item.to === currentId ? 'amount-in' : ''}>{item.to === currentId ? '+' : '−'} ₱{money(item.amount)}</strong></div>)}{!demo.transactions.some((item) => item.from === currentId || item.to === currentId) && <div className="empty-activity">No transactions yet. Send a transfer or try a terminal code.</div>}</div></div>
          <aside className="side-column"><div className="side-card profile-card"><div className="side-card-top"><span className="side-icon"><ShieldCheck size={18} /></span><span className="eyebrow">YOUR PUDS ID</span><button onClick={() => { navigator.clipboard?.writeText(currentId); setNotice('PUDS ID copied.'); }} aria-label="Copy PUDS ID"><Copy size={15} /></button></div><strong className="puds-number">{currentId}</strong><p>{currentProfile.name}<br />Switch profiles above to test inbound transfers.</p><div className="demo-directory"><b>Demo recipient directory</b>{profiles.slice(1).map((profile) => <button key={profile.id} onClick={() => setCurrentId(profile.id)}>{profile.id} · {profile.name}</button>)}</div></div><div className="security-note"><LockKeyhole size={15} /><span><b>Presentation-safe demo.</b><br />Balances and activity are stored in this browser only.</span></div></aside></section>
      </>}

      {screen === 'send' && <section className="flow-wrap"><button className="back-link" onClick={() => { setScreen('home'); setReceipt(null); }}><ArrowLeftRight size={16} /> Wallet</button><div className="flow-card"><div className="flow-heading"><span className="eyebrow">PUDS APP · DEMO MODE</span><h1>{receipt ? 'Payment receipt' : 'Send money'}</h1><p>{receipt ? 'Completed successfully. Demo funds only.' : `Available balance: ₱${money(balance)} · ${currentId}`}</p></div>{receipt ? <div className="demo-receipt"><span className="success-check"><Check size={25} /></span><span className="eyebrow">DIGITAL RECEIPT · COMPLETED</span><strong>₱{money(receipt.amount)}</strong><div className="receipt-lines"><span>Reference number</span><b>{receipt.ref}</b><span>Timestamp</span><b>{dateTime(receipt.createdAt)}</b><span>From</span><b>{receipt.from}</b><span>To</span><b>{receipt.to}</b>{receipt.note && <><span>Note</span><b>{receipt.note}</b></>}<span>Status</span><b>Completed</b></div><button className="primary-button full-button" onClick={() => { setReceipt(null); setScreen('home'); }}>Done</button></div> : <div className="flow-fields"><label>Recipient PUDS ID<input value={recipient} onChange={(event) => setRecipient(event.target.value.toUpperCase())} placeholder="PUDS-XXXXX" list="puds-recipients" autoCapitalize="characters" /><datalist id="puds-recipients">{profiles.filter((profile) => profile.id !== currentId).map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}</datalist></label>{resolvedRecipient && <div className="merchant-hint"><BadgeCheck size={17} /><span><b>{resolvedRecipient.name}</b><small>Demo recipient · {resolvedRecipient.id}</small></span></div>}<label>Amount (₱)<input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0.01" step="0.01" inputMode="decimal" /></label><label>Note (optional)<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="What is this for?" maxLength={120} /></label><button className="primary-button full-button" onClick={submitTransfer}>Send money · ₱{money(Number(amount) || 0)} <ArrowUpRight size={16} /></button><p className="privacy-note"><Clock3 size={14} /> Kapag matagumpay, direktang papasok sa PUDS wallet ng recipient ang ipinadala mong halaga.</p></div>}</div></section>}

      {(['edt', 'booking', 'cashin', 'cashout', 'codes'] as const).includes(screen as 'edt' | 'booking' | 'cashin' | 'cashout' | 'codes') && <WalletModules module={screen as 'edt' | 'booking' | 'cashin' | 'cashout' | 'codes'} pudsId={currentId} balance={balance} codes={demo.codes} onBack={() => setScreen('home')} onPurchase={purchase} onDeposit={deposit} onCreateCode={createBookingCode} />}

      {screen === 'terminal' && <section className="terminal-page">{!terminalUnlocked && <div className="terminal-gate-backdrop"><div className="terminal-gate" role="dialog" aria-modal="true" aria-labelledby="terminal-gate-title"><span className="flow-icon"><LockKeyhole size={20} /></span><span className="eyebrow">MERCHANT ACCESS</span><h2 id="terminal-gate-title">{terminalPassword ? 'Unlock PUDS Terminal' : terminalOtpVerified ? 'Create owner password' : 'Protect your terminal'}</h2><p>{terminalPassword ? 'Enter the owner password before processing payments.' : terminalOtpVerified ? 'Create a password with at least 8 characters.' : 'Verify a Gmail address to set the demo owner password. Demo OTP: 123456.'}</p>{terminalPassword ? <label>Owner password<input autoComplete="current-password" type="password" value={terminalPasswordInput} onChange={e => setTerminalPasswordInput(e.target.value)} /></label> : terminalOtpVerified ? <><label>New password<input autoComplete="new-password" type="password" value={terminalPasswordInput} onChange={e => setTerminalPasswordInput(e.target.value)} /></label><label>Confirm password<input autoComplete="new-password" type="password" value={terminalPasswordConfirm} onChange={e => setTerminalPasswordConfirm(e.target.value)} /></label></> : <><label>Owner Gmail<input autoComplete="email" type="email" value={terminalEmail} onChange={e => setTerminalEmail(e.target.value)} placeholder="owner@gmail.com" /></label>{terminalOtpSent && <label>6-digit OTP<input inputMode="numeric" maxLength={6} value={terminalOtp} onChange={e => setTerminalOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" /></label>}</>}<button className="primary-button full-button" onClick={submitTerminalGate}>{terminalPassword ? 'Unlock terminal' : terminalOtpVerified ? 'Save password' : terminalOtpSent ? 'Verify OTP' : 'Send demo OTP'}</button><button className="subtle-button" onClick={() => { setScreen('home'); setNotice(''); }}>Return to PUDS App</button><p className="privacy-note"><LockKeyhole size={13} /> Demo-only gate. Do not use real payment credentials.</p></div></div>}<div className="terminal-intro"><span className="eyebrow"><span className="live-dot" /> PUDS TERMINAL · DEMO MODE</span><h1>Pay or cash out<br /><em>with a one-time code.</em></h1><p>Use a code generated by the PUDS App. A successful terminal transaction debits the code owner&apos;s simulated wallet once.</p></div><div className="terminal-card"><div className="terminal-card-header"><span className="terminal-logo"><Store size={20} /></span><span><b>{receipt ? 'Payment complete' : 'Process demo payment'}</b><small>Simulated PHP only · No real money</small></span><span className="terminal-status"><span className="live-dot" /> Ready</span></div>{receipt ? <div className="terminal-success"><span className="success-check"><Check size={25} /></span><span className="eyebrow">TRANSACTION APPROVED · COMPLETED</span><strong>₱{money(receipt.amount)}</strong><p>Ref {receipt.ref} · {dateTime(receipt.createdAt)}</p><p className="terminal-demo-note">PUDS ID {receipt.from} · Code used/expired</p><button className="primary-button full-button" onClick={() => { setReceipt(null); setTerminalCode(''); }}>New transaction</button></div> : <div className="terminal-form"><label>Customer PUDS ID<input value={terminalId} onChange={(event) => setTerminalId(event.target.value.toUpperCase())} placeholder="PUDS-XXXXX" /></label><label>4-digit Secret Code<input value={terminalCode} onChange={(event) => setTerminalCode(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" maxLength={4} placeholder="0000" /></label>{availableCode && <div className="merchant-hint"><BadgeCheck size={17} /><span><b>Code verified · {profiles.find((profile) => profile.id === availableCode.pudsId)?.name ?? 'Demo user'}</b><small>Available amount: ₱{money(availableCode.amount)}</small></span></div>}<label>Terminal total (₱)<input type="number" min="0.01" step="0.01" value={terminalAmount} onChange={(event) => setTerminalAmount(event.target.value)} /></label><p className="privacy-note">Ilagay ang eksaktong halagang nakatalaga sa code. Isang beses lang ito puwedeng i-redeem.</p><button className="primary-button full-button" disabled={!availableCode} onClick={processTerminal}>Verify &amp; process <Check size={16} /></button><button className="subtle-button" onClick={() => setScreen('cashout')}>Generate a cash-out code in PUDS App</button></div>}</div></section>}

      {screen === 'history' && <section className="flow-wrap"><button className="back-link" onClick={() => setScreen('home')}><ArrowLeftRight size={16} /> Wallet</button><div className="flow-card"><div className="flow-heading"><span className="eyebrow">DEMO MODE</span><h1>Transaction history</h1><p>Persistent activity for {currentId} and demo recipients.</p></div><div className="history-list">{demo.transactions.filter((item) => item.from === currentId || item.to === currentId).map((item) => <article className="history-item" key={item.ref}><div><b>{item.type}</b><span>{dateTime(item.createdAt)} · {item.ref}</span><span>{item.from} → {item.to}</span></div><strong>{item.to === currentId ? '+' : '−'} ₱{money(item.amount)}<small>{item.status}</small></strong></article>)}{!demo.transactions.some((item) => item.from === currentId || item.to === currentId) && <p className="empty-activity">No transactions yet.</p>}</div><h2 className="section-subtitle">Secret codes</h2><div className="history-list">{demo.codes.filter((item) => item.pudsId === currentId).map((item) => <article className="history-item" key={item.code}><div><b>Code · ••••{item.code.slice(-2)}</b><span>₱{money(item.amount)} · {dateTime(item.createdAt)}</span></div><strong className={item.status === 'Available' ? 'code-available' : ''}>{item.status}</strong></article>)}{!demo.codes.some((item) => item.pudsId === currentId) && <p className="empty-activity">No codes generated yet.</p>}</div></div></section>}

      {screen === 'settings' && <section className="flow-wrap"><button className="back-link" onClick={() => setScreen('home')}><ArrowLeftLeftIcon /> Wallet</button><div className="flow-card"><div className="flow-heading"><span className="eyebrow">SETTINGS · DEMO</span><h1>Demo settings</h1><p>All balances, one-time codes, and transaction history are stored locally in this browser.</p></div><div className="settings-warning"><ShieldCheck size={18} /><span><b>DEMO MODE</b><small>Funds are simulated PHP. This app does not connect to banks or move real money.</small></span></div><button className="reset-button" onClick={resetDemo}><RotateCcw size={16} /> Reset Demo Data</button><p className="privacy-note">Reset restores each sample wallet to ₱{money(STARTING_BALANCE)} and clears all generated codes and transactions.</p></div></section>}

      <footer className="page-footer"><span>© 2026 PUDS · DEMO MODE</span><span>Simulated funds only</span></footer>
      <nav className="mobile-nav" aria-label="Main navigation"><button onClick={() => setScreen('home')}><Wallet size={18} /><span>Wallet</span></button><button onClick={() => setScreen('send')}><ArrowUpRight size={18} /><span>Send</span></button><button onClick={() => setScreen('cashin')}><Store size={18} /><span>Cash In</span></button><button onClick={() => setScreen('edt')}><Zap size={18} /><span>EDT</span></button><button onClick={() => setScreen('booking')}><Smartphone size={18} /><span>Booking</span></button><button onClick={() => setScreen('codes')}><BadgeCheck size={18} /><span>Codes</span></button></nav>
    </main>
  );
}

function ArrowLeftLeftIcon() {
  return <ArrowLeftRight size={16} />;
}
