'use client';

import { useState } from 'react';
import {
  ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Banknote,
  Camera, Check, ChevronDown, CircleHelp, Clock3, Copy, CreditCard, Fingerprint,
  House, LockKeyhole, Menu, QrCode, ScanLine, ShieldCheck, Smartphone, Store,
  Wallet, Wifi, Zap,
} from 'lucide-react';

type Portal = 'wallet' | 'terminal';
type View = 'home' | 'register' | 'send' | 'receive' | 'edt' | 'security' | 'cashout';
type PaymentType = 'cash' | 'bill' | 'jollibee';
type TransactionKind = 'cashout' | 'bill' | 'advance' | 'walkin';

const jollibeeMeals = [
  { name: '1-pc Chickenjoy with rice', price: 99 },
  { name: 'Yumburger combo', price: 119 },
  { name: 'Jolly Spaghetti + Burger Steak', price: 149 },
];

const packages = [
  { name: 'Starter', data: '10 GB', duration: '7 days', price: 160, perSim: '5 GB bawat SIM' },
  { name: 'Sulit', data: '20 GB', duration: '15 days', price: 300, perSim: '10 GB bawat SIM' },
  { name: 'Todo', data: '40 GB', duration: '30 days', price: 600, perSim: '20 GB bawat SIM' },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="brand-lockup"><span className="brand-mark"><Wallet size={19} strokeWidth={2.2} /></span><span><strong>PUDS</strong>{!compact && <small>Ang Wallet sa Balat</small>}</span></div>;
}

export default function PudsDemo() {
  const [portal, setPortal] = useState<Portal>('wallet');
  const [view, setView] = useState<View>('home');
  const [registered, setRegistered] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [idFile, setIdFile] = useState('');
  const [faceVerified, setFaceVerified] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('250');
  const [paymentType, setPaymentType] = useState<PaymentType>('cash');
  const [orderType, setOrderType] = useState<'advance' | 'walkin'>('advance');
  const [branch, setBranch] = useState('Jollibee Cubao - Gateway Mall');
  const [mealIndex, setMealIndex] = useState(0);
  const [activeTransaction, setActiveTransaction] = useState<{ code: string; kind: TransactionKind; amount: number; branch: string; item: string } | null>(null);
  const [secretCode, setSecretCode] = useState('');
  const [transactionDone, setTransactionDone] = useState(false);
  const [terminalId, setTerminalId] = useState('PUDS-24819');
  const [terminalCode, setTerminalCode] = useState('');
  const [cashoutDone, setCashoutDone] = useState(false);
  const [terminalAction, setTerminalAction] = useState<TransactionKind>('walkin');
  const [terminalAmount, setTerminalAmount] = useState('420');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [merchantAuthOpen, setMerchantAuthOpen] = useState(false);
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantOtp, setMerchantOtp] = useState('');
  const [merchantOtpSent, setMerchantOtpSent] = useState(false);
  const [merchantVerified, setMerchantVerified] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [simOne, setSimOne] = useState('0917 555 0142');
  const [simTwo, setSimTwo] = useState('0998 555 0142');
  const [notice, setNotice] = useState('');

  const backHome = () => { setView('home'); setNotice(''); };
  const completeRegistration = () => { setRegistered(true); setView('home'); setStep(1); };
  const sendFunds = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const kind: TransactionKind = paymentType === 'cash' ? 'cashout' : paymentType === 'bill' ? 'bill' : orderType;
    const amountDue = paymentType === 'jollibee' ? (orderType === 'advance' ? jollibeeMeals[mealIndex].price : 0) : Number(amount || 0);
    const orderBranch = paymentType === 'jollibee' ? (orderType === 'advance' ? branch : 'Any Jollibee Branch · Walk-in / No Order Yet') : recipient || 'PUDS Tindahan';
    const orderItem = paymentType === 'jollibee' && orderType === 'advance' ? jollibeeMeals[mealIndex].name : paymentType === 'jollibee' ? 'Walk-in purchase' : recipient || 'PUDS payment';
    setSecretCode(code);
    setActiveTransaction({ code, kind, amount: amountDue, branch: orderBranch, item: orderItem });
    setTerminalAction(kind);
    if (kind === 'cashout' && amountDue > 0) setTerminalAmount(String(amountDue));
    setTransactionDone(true);
    setCashoutDone(false);
  };
  const processCashout = () => {
    if (!activeTransaction) { setNotice('Gumawa muna ng secret code sa PUDS App demo.'); return; }
    if (terminalId !== 'PUDS-24819' || terminalCode !== activeTransaction.code) { setNotice('Hindi tugma ang PUDS ID o secret code. Subukan ulit.'); return; }
    if (terminalAction !== activeTransaction.kind) { setNotice('Hindi tugma ang transaction type. Piliin ang tamang cashier action.'); return; }
    if ((terminalAction === 'walkin' || terminalAction === 'cashout') && Number(terminalAmount) <= 0) { setNotice('Maglagay ng valid na halaga.'); return; }
    setReceiptNumber(`PUDS-${Math.floor(100000 + Math.random() * 900000)}`);
    setCashoutDone(true);
    setNotice('');
  };

  return (
    <main className="puds-app">
      <header className="topbar">
        <a className="brand-link" href="#home" onClick={(event) => { event.preventDefault(); backHome(); }} aria-label="PUDS home"><Brand /></a>
        <nav className="portal-switch" aria-label="Pumili ng portal">
          <button className={portal === 'wallet' ? 'portal-tab active' : 'portal-tab'} onClick={() => { setPortal('wallet'); backHome(); }}><Wallet size={16} /> PUDS App</button>
          <button className={portal === 'terminal' ? 'portal-tab active' : 'portal-tab'} onClick={() => { setPortal('terminal'); backHome(); }}><Store size={16} /> PUDS Terminal</button>
        </nav>
        <button className="help-button" onClick={() => setNotice('Demo mode ito. Walang totoong pera o sensitibong impormasyon na ipinapadala.')}><CircleHelp size={17} /><span>Help</span></button>
      </header>

      <div className="demo-ribbon"><span className="live-dot" /> Interactive demo <span className="ribbon-divider">·</span> PUDS 1-2026-50120 <span className="ribbon-spacer" /> <ShieldCheck size={14} /> Your details stay on this device</div>

      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Isara">×</button></div>}

      {portal === 'wallet' ? (
        <>
          {view === 'home' && <>
            <section className="welcome-row">
              <div><div className="eyebrow">MAGANDANG ARAW <span>·</span> GOOD DAY</div><h1>Ang pera mo,<br className="mobile-break" /> <em>nasa palad mo.</em></h1><p>Isang wallet para sa araw-araw. Simple, mabilis, at para sa lahat.</p></div>
              <div className="account-pill"><span className="avatar">{registered ? 'M' : 'G'}</span><span><b>{registered ? 'Maria Dela Cruz' : 'Guest user'}</b><small>{registered ? 'PUDS-24819' : 'Explore the demo'}</small></span><ChevronDown size={15} /></div>
            </section>
            <section className="wallet-layout">
              <div className="wallet-column">
                <div className="balance-card">
                  <div className="balance-top"><span><span className="balance-icon"><Wallet size={16} /></span> PUDS WALLET</span><span className="verified-label"><BadgeCheck size={14} /> {registered ? 'Verified demo' : 'Demo account'}</span></div>
                  <div className="balance-amount"><span>₱</span> 12,480<span className="cents">.50</span></div>
                  <div className="balance-caption">Available balance <span>•</span> Demo funds only</div>
                  <div className="balance-footer"><span><span className="balance-dot" /> Ready to use</span><span>Updated just now</span></div>
                </div>
                <div className="action-grid">
                  <button onClick={() => { setView('send'); setTransactionDone(false); }} className="action-tile"><span className="action-icon send-icon"><ArrowUpRight size={20} /></span><b>Send</b><small>Magbayad o magpadala</small></button>
                  <button onClick={() => setView('receive')} className="action-tile"><span className="action-icon receive-icon"><ArrowDownLeft size={20} /></span><b>Receive</b><small>Tumanggap ng bayad</small></button>
                  <button onClick={() => { setView('edt'); setLoaded(false); }} className="action-tile"><span className="action-icon edt-icon"><Zap size={20} /></span><b>EDT Loader</b><small>Load sa parehong SIM</small></button>
                  <button onClick={() => setView('security')} className="action-tile"><span className="action-icon secure-icon"><Fingerprint size={20} /></span><b>Security</b><small>Protektahan ang account</small></button>
                </div>
                <div className="section-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Mga galaw mo</h2></div><button className="text-link" onClick={() => setNotice('Ito ang mga halimbawang transaksyon sa demo.')}>View all <ArrowRight size={14} /></button></div>
                <div className="activity-card">
                  <div className="activity-row"><span className="activity-symbol activity-green"><ArrowDownLeft size={17} /></span><span className="activity-copy"><b>Bayad mula kay Ana</b><small>Today, 10:42 AM · PUDS ID</small></span><strong className="amount-in">+ ₱850.00</strong></div>
                  <div className="activity-row"><span className="activity-symbol activity-orange"><Zap size={17} /></span><span className="activity-copy"><b>EDT data bundle</b><small>Yesterday · Both SIMs</small></span><strong>− ₱300.00</strong></div>
                  <div className="activity-row"><span className="activity-symbol activity-blue"><Banknote size={17} /></span><span className="activity-copy"><b>Tindahan ni Aling Tess</b><small>Nov 16 · Secret code cash-out</small></span><strong>− ₱420.00</strong></div>
                </div>
              </div>
              <aside className="side-column">
                <div className="side-card profile-card"><div className="side-card-top"><span className="side-icon"><ShieldCheck size={18} /></span><span className="eyebrow">YOUR PUDS ID</span><button onClick={() => { navigator.clipboard?.writeText('PUDS-24819'); setNotice('Nakopya na ang PUDS ID mo.'); }} aria-label="Copy PUDS ID"><Copy size={15} /></button></div><strong className="puds-number">PUDS-24819</strong><p>Ibahagi ito para makatanggap ng bayad.</p><button className="outline-action" onClick={() => setView('receive')}><QrCode size={16} /> Ipakita ang QR code</button></div>
                <div className="side-card loader-card"><div className="loader-top"><span className="loader-bolt"><Zap size={17} /></span><span className="eyebrow">BUILT FOR DUAL SIM</span></div><h3>Isang load.<br />Dalawang SIM.</h3><p>Load para sa trabaho, biyahe, at araw-araw — sabay sa dalawang SIM.</p><button className="loader-link" onClick={() => { setView('edt'); setLoaded(false); }}>Buksan ang EDT Loader <ArrowRight size={15} /></button><div className="sim-chips"><span><span className="sim-dot green-dot" /> SIM 1</span><span><span className="sim-dot blue-dot" /> SIM 2</span></div></div>
                <div className="security-note"><LockKeyhole size={15} /><span><b>Ikaw ang may kontrol.</b><br />Bagong device? Mag-verify muna bago mag-login.</span><button onClick={() => setView('security')} aria-label="Tungkol sa seguridad"><ArrowRight size={14} /></button></div>
              </aside>
            </section>
          </>}

          {view === 'register' && <section className="flow-wrap"><button className="back-link" onClick={backHome}><ArrowLeft size={16} /> Bumalik sa wallet</button><div className="flow-card"><div className="flow-heading"><span className="flow-icon"><ShieldCheck size={21} /></span><span className="eyebrow">PUDS APP · ACCOUNT SETUP</span><h1>Gumawa ng account</h1><p>Mag-register sa ilang simpleng hakbang. Demo flow lamang ito.</p></div><div className="stepper"><span className={step >= 1 ? 'step active' : 'step'}><b>1</b><small>Email</small></span><i /><span className={step >= 2 ? 'step active' : 'step'}><b>2</b><small>Identity</small></span><i /><span className={step >= 3 ? 'step active' : 'step'}><b>3</b><small>Password</small></span></div>
              {step === 1 && <div className="flow-fields"><label>Email address <span>Gmail</span><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ikaw@gmail.com" type="email" /></label>{otp && <label>One-time password (OTP)<input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" inputMode="numeric" /><small className="field-hint">Demo OTP: <b>123456</b></small></label>}<button className="primary-button full-button" onClick={() => { if (!/^[^\s@]+@gmail\.com$/i.test(email)) { setNotice('Maglagay ng valid na email address.'); return; } if (!otp) { setOtp(''); setNotice('Demo: ipinadala ang OTP 123456. Ilagay ito para magpatuloy.'); setOtp('123456'); return; } if (otp === '123456') { setStep(2); setNotice(''); } else setNotice('Hindi tama ang demo OTP. Subukan ang 123456.'); }}>{otp ? 'I-verify ang OTP' : 'Ipadala ang OTP'} <ArrowRight size={16} /></button><p className="privacy-note"><LockKeyhole size={13} /> Sa totoong serbisyo, ligtas at beripikado ang OTP.</p></div>}
              {step === 2 && <div className="flow-fields"><label>Valid government ID<div className="upload-box"><CreditCard size={20} /><span><b>{idFile || 'Pumili ng ID para sa demo'}</b><small>UMID, passport, driver&apos;s license, atbp.</small></span><input type="file" accept="image/*,.pdf" onChange={(e) => setIdFile(e.target.files?.[0]?.name || '')} aria-label="Mag-upload ng government ID" /></div></label><div className="camera-box"><span className="camera-icon"><Camera size={20} /></span><div><b>Live face video check</b><small>Camera verification simulation — walang video na nire-record.</small></div><button className={faceVerified ? 'verify-button verified' : 'verify-button'} onClick={() => setFaceVerified(true)}>{faceVerified ? <><Check size={14} /> Verified</> : 'Simulate'}</button></div><button className="primary-button full-button" disabled={!idFile || !faceVerified} onClick={() => { setStep(3); setNotice(''); }}>Magpatuloy <ArrowRight size={16} /></button><button className="subtle-button" onClick={() => setStep(1)}>Bumalik</button></div>}
              {step === 3 && <div className="flow-fields"><label>Gumawa ng password<input type="password" placeholder="At least 8 characters" /></label><label>Kumpirmahin ang password<input type="password" placeholder="I-type muli ang password" /></label><div className="camera-box"><ShieldCheck size={20} /><div><b>Handa na ang iyong demo account</b><small>Hindi ise-save ang password o KYC details.</small></div></div><button className="primary-button full-button" onClick={completeRegistration}>Tapusin ang demo registration <Check size={16} /></button><button className="subtle-button" onClick={() => setStep(2)}>Bumalik</button></div>}
            </div></section>}

          {view === 'send' && <section className="flow-wrap"><button className="back-link" onClick={backHome}><ArrowLeft size={16} /> Wallet</button><div className="flow-card"><div className="flow-heading"><span className="flow-icon"><ArrowUpRight size={21} /></span><span className="eyebrow">SEND · MAGBAYAD</span><h1>{transactionDone ? 'Handa na ang bayad' : 'Magpadala ng pera'}</h1><p>{transactionDone ? 'Ibigay ang secret code sa merchant para ma-claim ang bayad.' : 'Pumili ng tindahan, Jollibee order, o bayarin.'}</p></div>{transactionDone ? <div className="success-state"><span className="success-check"><Check size={26} /></span><span className="eyebrow">ONE-TIME SECRET CODE · KABISADUHIN LANG</span><strong className="secret-code">{secretCode}</strong><p>{activeTransaction?.amount ? `₱${activeTransaction.amount.toLocaleString('en-PH')}` : 'Ita-type ang halaga sa cashier'} · {activeTransaction?.branch || recipient || 'PUDS Tindahan'}</p>{activeTransaction?.kind === 'advance' && <div className="order-summary"><b>Advance order</b><span>{activeTransaction.item}</span></div>}<div className="privacy-note"><Clock3 size={14} /> One-time demo code · ipasok kasama ang PUDS ID sa terminal</div><button className="primary-button full-button" onClick={() => { setPortal('terminal'); setView('home'); }}>Buksan ang PUDS Terminal <ArrowRight size={16} /></button><button className="subtle-button" onClick={backHome}>Tapos na</button></div> : <div className="flow-fields"><div className="payment-types" role="group" aria-label="Pumili ng babayaran"><button className={paymentType === 'cash' ? 'payment-type selected' : 'payment-type'} onClick={() => setPaymentType('cash')}><Store size={16} /><span>Tindahan</span></button><button className={paymentType === 'jollibee' ? 'payment-type selected' : 'payment-type'} onClick={() => setPaymentType('jollibee')}><span className="jollibee-mark">J</span><span>Jollibee</span></button><button className={paymentType === 'bill' ? 'payment-type selected' : 'payment-type'} onClick={() => setPaymentType('bill')}><CreditCard size={16} /><span>Bills</span></button></div>{paymentType === 'cash' && <><label>PUDS ID o pangalan ng tindahan<input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Hal. PUDS-24819 o tindahan" /></label><label>Halaga (₱)<input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" inputMode="decimal" /></label><div className="merchant-hint"><Store size={17} /><span><b>Phone-free cash-out</b><small>Gamitin ang 4-digit code sa PUDS Terminal.</small></span></div></>}{paymentType === 'bill' && <><label>Bill provider<select value={recipient} onChange={(e) => setRecipient(e.target.value)}><option value="Meralco">Meralco</option><option value="Maynilad">Maynilad</option><option value="Manila Water">Manila Water</option><option value="Globe Telecom">Globe Telecom</option></select></label><label>Halaga (₱)<input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" inputMode="decimal" /></label></>}{paymentType === 'jollibee' && <div className="jollibee-order"><div className="order-modes" role="group" aria-label="Pumili ng Jollibee order"><button className={orderType === 'advance' ? 'order-mode selected' : 'order-mode'} onClick={() => setOrderType('advance')}><b>Advance order</b><small>Pre-cooked pagdating mo</small></button><button className={orderType === 'walkin' ? 'order-mode selected' : 'order-mode'} onClick={() => setOrderType('walkin')}><b>Walk-in</b><small>Walang order muna</small></button></div>{orderType === 'advance' ? <><label>Jollibee branch<select value={branch} onChange={(e) => setBranch(e.target.value)}><option>Jollibee Cubao - Gateway Mall</option><option>Jollibee Makati - Ayala Avenue</option><option>Jollibee Katipunan - Quezon City</option></select></label><label>Piliin ang advance order<select value={mealIndex} onChange={(e) => setMealIndex(Number(e.target.value))}>{jollibeeMeals.map((meal, index) => <option key={meal.name} value={index}>{meal.name} · ₱{meal.price}</option>)}</select></label><div className="merchant-hint"><Clock3 size={17} /><span><b>Lulutuin bago ka dumating</b><small>{branch} · ipakita ang code sa pickup counter.</small></span></div></> : <><div className="any-branch"><b>Any Jollibee Branch</b><span>Walk-in / No Order Yet</span></div><div className="merchant-hint"><Smartphone size={17} /><span><b>Iwan ang phone sa bahay</b><small>Kabisaduhin ang code; ilagay sa cashier kasama ang PUDS ID. Cashier ang maglalagay ng total.</small></span></div></>}</div>}<button className="primary-button full-button" onClick={sendFunds} disabled={paymentType !== 'jollibee' && !Number(amount)}>Gumawa ng one-time secret code <ArrowRight size={16} /></button></div>}</div></section>}

          {view === 'receive' && <section className="flow-wrap"><button className="back-link" onClick={backHome}><ArrowLeft size={16} /> Wallet</button><div className="flow-card receive-flow"><div className="flow-heading"><span className="eyebrow">RECEIVE · TUMANGGAP</span><h1>I-scan para magbayad</h1><p>Ipakita ang QR code o ibahagi ang PUDS ID mo.</p></div><div className="qr-art" aria-label="Illustrative demo QR code"><div className="qr-grid"><span className="qr-finder finder-one" /><span className="qr-finder finder-two" /><span className="qr-finder finder-three" /><span className="qr-pixels" /></div></div><span className="eyebrow">YOUR PUDS ID</span><strong className="receive-id">PUDS-24819</strong><button className="outline-action" onClick={() => { navigator.clipboard?.writeText('PUDS-24819'); setNotice('Nakopya na ang PUDS ID mo.'); }}><Copy size={15} /> Kopyahin ang ID</button><p className="privacy-note">Demo QR — hindi ito naglalaman ng payment credentials.</p></div></section>}

          {view === 'edt' && <section className="flow-wrap"><button className="back-link" onClick={backHome}><ArrowLeft size={16} /> Wallet</button><div className="flow-card edt-flow"><div className="flow-heading"><span className="flow-icon edt-heading-icon"><Zap size={21} /></span><span className="eyebrow">EDT LOADER · BUILT FOR DUAL SIM</span><h1>{loaded ? 'Load submitted!' : 'Isang load, dalawang SIM.'}</h1><p>{loaded ? 'Demo order lang ito — walang totoong load na ipinadala.' : 'Piliin ang data bundle para sa iyong mga SIM card.'}</p></div>{loaded ? <div className="success-state"><span className="success-check"><Check size={26} /></span><strong>{packages[selectedPackage].data} bundle</strong><p>SIM 1 · {simOne}<br />SIM 2 · {simTwo}</p><button className="primary-button full-button" onClick={backHome}>Bumalik sa wallet</button></div> : <div className="flow-fields"><div className="package-list">{packages.map((item, index) => <button key={item.name} className={selectedPackage === index ? 'package-option selected' : 'package-option'} onClick={() => setSelectedPackage(index)}><span className="package-radio">{selectedPackage === index && <i />}</span><span className="package-copy"><b>{item.name} <span>{item.data}</span></b><small>{item.duration} · {item.perSim}</small></span><strong>₱{item.price}</strong></button>)}</div><div className="sim-fields"><label><span className="sim-label"><span className="sim-dot green-dot" /> SIM 1</span><input value={simOne} onChange={(e) => setSimOne(e.target.value)} aria-label="SIM 1 number" /></label><label><span className="sim-label"><span className="sim-dot blue-dot" /> SIM 2</span><input value={simTwo} onChange={(e) => setSimTwo(e.target.value)} aria-label="SIM 2 number" /></label></div><button className="primary-button full-button" onClick={() => setLoaded(true)}>Load both SIMs · ₱{packages[selectedPackage].price} <ArrowRight size={16} /></button><p className="privacy-note"><Wifi size={13} /> Works with Smart, Globe, and DITO. Demo only.</p></div>}</div></section>}

          {view === 'security' && <section className="flow-wrap"><button className="back-link" onClick={backHome}><ArrowLeft size={16} /> Wallet</button><div className="flow-card"><div className="flow-heading"><span className="flow-icon"><Fingerprint size={21} /></span><span className="eyebrow">SECURITY · PROTEKSYON</span><h1>Bagong device?</h1><p>Para protektado ang wallet mo, kailangan ulitin ang identity check sa bagong phone o computer.</p></div><div className="camera-box"><CreditCard size={20} /><div><b>Government ID</b><small>Mag-upload at mag-verify ng valid ID.</small></div><Check className="security-check" size={17} /></div><div className="camera-box"><Camera size={20} /><div><b>Live face video verification</b><small>Ikumpara ang mukha sa ID. Demo simulation lamang.</small></div><button className={faceVerified ? 'verify-button verified' : 'verify-button'} onClick={() => setFaceVerified(true)}>{faceVerified ? <><Check size={14} /> Verified</> : 'Simulate'}</button></div><div className="security-callout"><LockKeyhole size={16} /><span>Sa production, kailangang gawin ang tunay na server-verified identity check bago magbigay ng access.</span></div><button className="primary-button full-button" disabled={!faceVerified} onClick={() => setNotice('Na-verify ang demo device. Walang totoong identity check na isinagawa.')}>I-verify ang device <ArrowRight size={16} /></button></div></section>}
          <footer className="page-footer"><span>© 2026 PUDS · Ang Wallet sa Balat</span><span>IPOPHL 1-2026-50120</span></footer>
        </>
      ) : (
        <section className="terminal-page">
          <div className="terminal-intro"><span className="eyebrow"><span className="live-dot" /> PUDS TERMINAL · MERCHANT PORTAL</span><h1>Serbisyo para sa<br /><em>bawat tindahan.</em></h1><p>Tumanggap ng bayad at magproseso ng cash-out — kahit walang smartphone ang customer.</p><div className="terminal-trust"><span><ShieldCheck size={15} /> Secure demo</span><span><Smartphone size={15} /> Phone-free cash-out</span><span><Wifi size={15} /> Mabilis at simple</span></div></div>
          <div className="terminal-card"><div className="terminal-card-header"><span className="terminal-logo"><Store size={20} /></span><span><b>{cashoutDone ? (terminalAction === 'advance' ? 'Advance order claimed' : terminalAction === 'walkin' ? 'Walk-in payment complete' : terminalAction === 'bill' ? 'Bill payment complete' : 'Cash-out complete') : 'Process a PUDS payment'}</b><small>{cashoutDone ? `Receipt ${receiptNumber} · Demo successful` : merchantVerified ? `${merchantEmail} · Verified demo` : 'PUDS Tindahan · Merchant terminal'}</small></span><span className="terminal-status"><span className="live-dot" /> Ready</span></div>{merchantAuthOpen ? <div className="terminal-form"><div className="flow-heading"><span className="flow-icon"><LockKeyhole size={20} /></span><span className="eyebrow">MERCHANT ACCESS</span><h1>Mag-login o mag-register</h1><p>Gamit ang Gmail at one-time password. Demo OTP: 123456.</p></div><label>Gmail address<input type="email" value={merchantEmail} onChange={(event) => setMerchantEmail(event.target.value)} placeholder="tindahan@gmail.com" /></label>{merchantOtpSent && <label>One-time password (OTP)<input inputMode="numeric" maxLength={6} value={merchantOtp} onChange={(event) => setMerchantOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" /></label>}<button className="primary-button full-button" onClick={() => { if (!/^[^\s@]+@gmail\.com$/i.test(merchantEmail)) { setNotice('Maglagay ng valid na Gmail address.'); return; } if (!merchantOtpSent) { setMerchantOtpSent(true); setNotice('Demo: ipinadala ang OTP 123456.'); return; } if (merchantOtp === '123456') { setMerchantVerified(true); setMerchantAuthOpen(false); setMerchantOtpSent(false); setMerchantOtp(''); setNotice('Na-verify ang merchant demo account.'); } else setNotice('Hindi tama ang demo OTP. Subukan ang 123456.'); }}>{merchantOtpSent ? 'I-verify ang OTP' : 'Ipadala ang OTP'} <ArrowRight size={16} /></button><button className="subtle-button" onClick={() => setMerchantAuthOpen(false)}>Bumalik sa terminal</button><p className="privacy-note"><LockKeyhole size={13} /> Walang totoong email na ipinapadala sa demo.</p></div> : cashoutDone ? <div className="terminal-success"><span className="success-check"><Check size={25} /></span><span className="eyebrow">TRANSACTION APPROVED</span><strong>{activeTransaction?.amount ? `₱${activeTransaction.amount.toLocaleString('en-PH')}` : `₱${Number(terminalAmount).toLocaleString('en-PH')}`}</strong><p>{terminalAction === 'advance' ? 'Advance order claimed' : terminalAction === 'walkin' ? 'Walk-in payment approved' : terminalAction === 'bill' ? 'Bill payment processed' : 'Cash-out complete'}</p>{activeTransaction?.kind === 'advance' && <p>{activeTransaction.item} · {activeTransaction.branch}</p>}<p className="terminal-demo-note">Receipt {receiptNumber} · PUDS ID {terminalId} · Code {terminalCode}</p><p className="terminal-demo-note">Simulation complete. Walang totoong pera na nailipat.</p><button className="primary-button full-button" onClick={() => { setCashoutDone(false); setTerminalCode(''); setActiveTransaction(null); setSecretCode(''); setTransactionDone(false); setNotice(''); }}>Bagong transaksyon <ArrowRight size={16} /></button></div> : <div className="terminal-form"><div className="terminal-actions" role="group" aria-label="Piliin ang cashier action"><button className={terminalAction === 'walkin' ? 'terminal-action selected' : 'terminal-action'} onClick={() => setTerminalAction('walkin')}>Walk-in payment</button><button className={terminalAction === 'advance' ? 'terminal-action selected' : 'terminal-action'} onClick={() => setTerminalAction('advance')}>Advance pickup</button><button className={terminalAction === 'bill' ? 'terminal-action selected' : 'terminal-action'} onClick={() => setTerminalAction('bill')}>Bills payment</button><button className={terminalAction === 'cashout' ? 'terminal-action selected' : 'terminal-action'} onClick={() => setTerminalAction('cashout')}>Tindahan cash-out</button></div><div className="scan-panel"><div className="scan-graphic"><ScanLine size={23} /></div><div><b>I-scan ang customer QR</b><small>O ilagay ang PUDS ID at secret code sa ibaba.</small></div><button className="scan-button" onClick={() => { setTerminalId('PUDS-24819'); setNotice('Demo: na-scan ang sample PUDS ID. Ilagay ang 4-digit code na ginawa sa wallet.'); }}>Scan <QrCode size={15} /></button></div><div className="or-divider"><span>MANUAL ENTRY</span></div><label>PUDS ID<input value={terminalId} onChange={(e) => setTerminalId(e.target.value.toUpperCase())} placeholder="PUDS-XXXXX" /></label><label>4-digit secret code<input value={terminalCode} onChange={(e) => setTerminalCode(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" maxLength={4} placeholder="• • • •" /></label><div className="number-pad" role="group" aria-label="Secret code keypad">{['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', 'Delete'].map((key) => <button type="button" key={key} className="keypad-key" aria-label={key === 'Delete' ? 'Burahin ang huling numero' : key === 'Clear' ? 'Burahin ang code' : `Ilagay ang ${key}`} onClick={() => setTerminalCode((current) => key === 'Clear' ? '' : key === 'Delete' ? current.slice(0, -1) : `${current}${key}`.slice(0, 4))}>{key}</button>)}</div><div className="cashout-amount"><span>{terminalAction === 'advance' ? 'Advance order pickup' : terminalAction === 'bill' ? 'Bill payment' : terminalAction === 'walkin' ? 'Walk-in order total' : 'Customer cash-out'}</span>{terminalAction === 'walkin' || terminalAction === 'cashout' ? <label className="terminal-amount-field">Amount (₱)<input value={terminalAmount} onChange={(event) => setTerminalAmount(event.target.value)} type="number" min="1" inputMode="decimal" /></label> : <b>{activeTransaction?.amount ? `₱${activeTransaction.amount.toLocaleString('en-PH')}` : 'Amount linked to wallet code'}</b>}</div><button className="primary-button full-button" disabled={!terminalId || terminalCode.length !== 4} onClick={processCashout}>I-verify at iproseso <ArrowRight size={16} /></button><p className="privacy-note"><LockKeyhole size={13} /> Demo lang. Huwag gumamit ng totoong customer credentials.</p></div>}</div>
          <div className="terminal-register"><span>May tindahan ka na?</span><button onClick={() => { setMerchantAuthOpen(true); setMerchantOtpSent(false); setMerchantOtp(''); setNotice(''); }}>Merchant login / Mag-register via Gmail + OTP <ArrowRight size={14} /></button></div>
          <footer className="page-footer"><span>© 2026 PUDS · PUDS Terminal</span><span>IPOPHL 1-2026-50120</span></footer>
        </section>
      )}

      {portal === 'wallet' && view === 'home' && !registered && <div className="floating-cta"><span>Bagong user? Simulan ang demo registration.</span><button className="primary-button" onClick={() => { setView('register'); setStep(1); }}>Gumawa ng account <ArrowRight size={15} /></button></div>}
      <div className="mobile-nav"><button onClick={backHome}><House size={18} /><span>Home</span></button><button onClick={() => setView('send')}><ArrowUpRight size={18} /><span>Send</span></button><button onClick={() => setView('receive')}><QrCode size={18} /><span>Receive</span></button><button onClick={() => setView('edt')}><Zap size={18} /><span>EDT</span></button><button onClick={() => { setPortal(portal === 'wallet' ? 'terminal' : 'wallet'); backHome(); }}><Menu size={18} /><span>More</span></button></div>
      <div className="toast-region" aria-live="polite" />
    </main>
  );
}
