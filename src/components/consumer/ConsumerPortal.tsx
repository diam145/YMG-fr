import React, { useState } from 'react';
import { Jar, Transaction, Dialect, RecurrentPayment } from '../../types';
import { formatGNF, generateRef, generateOtpCode, formatPhoneGN, detectCarrier } from '../../utils/formatters';
import { CONAKRY_KIOSKS, INITIAL_RECURRENT_PAYMENTS } from '../../data/mockData';
import {
  Wallet,
  PiggyBank,
  Compass,
  ShieldAlert,
  Plus,
  Send,
  Download,
  QrCode,
  Zap,
  Phone,
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  MapPin,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Volume2,
  Calendar,
  Repeat,
  Check,
  X,
} from 'lucide-react';

interface ConsumerPortalProps {
  jars: Jar[];
  transactions: Transaction[];
  isOnline: boolean;
  onAddTransaction: (tx: Transaction) => void;
  onTransferBetweenJars: (fromJarId: string, toJarId: string, amount: number) => void;
  onCreateJar: (name: string, targetGNF: number, type: Jar['type']) => void;
  onTriggerVoice: (key: string) => void;
  theme?: 'dark' | 'light';
}

export const ConsumerPortal: React.FC<ConsumerPortalProps> = ({
  jars,
  transactions,
  isOnline,
  onAddTransaction,
  onTransferBetweenJars,
  onCreateJar,
  onTriggerVoice,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // Modal states
  const [activeModal, setActiveModal] = useState<
    'none' | 'send' | 'cash_in' | 'kiosk_otp' | 'bill_pay' | 'qr_scan' | 'new_jar' | 'transfer_jars'
  >('none');

  // Collapsible Kiosk section state to reduce clutter
  const [showKiosks, setShowKiosks] = useState(false);

  // Transaction filter state for better readability
  const [txFilter, setTxFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [txSearch, setTxSearch] = useState('');

  // Form states
  const [sendPhone, setSendPhone] = useState('');
  const [sendName, setSendName] = useState('');
  const [sendAmount, setSendAmount] = useState('100000');
  const [sendMethod, setSendMethod] = useState<'wallet' | 'orange_money' | 'mtn_momo' | 'ecobank'>('orange_money');
  const [sendNote, setSendNote] = useState('');

  const [cashInSource, setCashInSource] = useState<'orange_money' | 'mtn_momo' | 'ecobank'>('orange_money');
  const [cashInAmount, setCashInAmount] = useState('200000');

  const [otpAmount, setOtpAmount] = useState('500000');
  const [generatedOtp, setGeneratedOtp] = useState<{
    code: string;
    amount: number;
    expiresAt: string;
    kioskName: string;
  } | null>(null);

  const [billType, setBillType] = useState<'edg' | 'seg' | 'canal' | 'airtime'>('edg');
  const [billAccountNo, setBillAccountNo] = useState('883920192');
  const [billAmount, setBillAmount] = useState('150000');

  const [newJarName, setNewJarName] = useState('');
  const [newJarTarget, setNewJarTarget] = useState('5000000');
  const [newJarType, setNewJarType] = useState<Jar['type']>('savings');

  const [transferFromJarId, setTransferFromJarId] = useState<string>('');
  const [transferToJarId, setTransferToJarId] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('200000');

  const [recurrentPayments, setRecurrentPayments] = useState<RecurrentPayment[]>(INITIAL_RECURRENT_PAYMENTS);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  const toggleAutoPay = (id: string) => {
    setRecurrentPayments((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, autoPayEnabled: !rec.autoPayEnabled } : rec))
    );
  };

  const mainJar = jars.find((j) => j.type === 'main') || jars[0];
  const totalBalanceGNF = jars.reduce((acc, j) => acc + j.balanceGNF, 0);

  // Handle New Jar Creation
  const handleExecuteNewJar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJarName) return;
    const target = parseInt(newJarTarget, 10) || 1000000;
    onCreateJar(newJarName, target, newJarType);
    setNewJarName('');
    setActiveModal('none');
  };

  // Handle Internal Money Movement (Jar <-> Main Wallet or Jar <-> Jar)
  const handleExecuteJarTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(transferAmount, 10);
    if (!amount || amount <= 0 || !transferFromJarId || !transferToJarId) return;
    if (transferFromJarId === transferToJarId) return;

    const fromJar = jars.find((j) => j.id === transferFromJarId);
    const toJar = jars.find((j) => j.id === transferToJarId);

    if (fromJar && fromJar.balanceGNF < amount) {
      alert(`Solde insuffisant dans ${fromJar.name}. Solde disponible: ${formatGNF(fromJar.balanceGNF)}`);
      return;
    }

    onTransferBetweenJars(transferFromJarId, transferToJarId, amount);

    const newTx: Transaction = {
      id: `tx_jar_${Date.now()}`,
      reference: generateRef('WF-JAR'),
      type: 'p2p_send',
      amountGNF: amount,
      feeGNF: 0,
      senderName: fromJar?.name || 'Jar Source',
      recipientName: toJar?.name || 'Jar Destination',
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      note: `Virement interne: ${fromJar?.name} ➔ ${toJar?.name}`,
    };

    onAddTransaction(newTx);
    setActiveModal('none');
  };

  // Handle Send Money Execution
  const handleExecuteSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(sendAmount, 10);
    if (!amount || amount <= 0) return;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: generateRef('WF-OUT'),
      type: sendMethod === 'orange_money' || sendMethod === 'mtn_momo' ? 'momo_cash_out' : 'p2p_send',
      amountGNF: amount,
      feeGNF: 0, // WestFlow is zero fee P2P
      senderName: 'Amadou Diallo',
      senderPhone: '+224 628 45 12 90',
      recipientName: sendName || 'Bénéficiaire Guinée',
      recipientPhone: sendPhone || '+224 620 00 00 00',
      recipientMethod: sendMethod,
      status: isOnline ? 'completed' : 'queued_offline',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      jarId: mainJar.id,
      note: sendNote || 'Transfert WestFlow',
    };

    onAddTransaction(newTx);
    setActiveModal('none');
    onTriggerVoice('p2p_success');
  };

  // Handle Cash-In Execution
  const handleExecuteCashIn = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(cashInAmount, 10);
    if (!amount || amount <= 0) return;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: generateRef('WF-IN'),
      type: 'momo_cash_in',
      amountGNF: amount,
      feeGNF: 0,
      senderName: cashInSource === 'orange_money' ? 'Orange Money' : 'Ecobank Rapidtransfer',
      senderPhone: '+224 628 45 12 90',
      recipientName: 'Amadou Diallo',
      status: isOnline ? 'completed' : 'queued_offline',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      jarId: mainJar.id,
      note: `Recharge portefeuille via ${cashInSource}`,
    };

    onAddTransaction(newTx);
    setActiveModal('none');
  };

  // Handle Kiosk OTP Generation
  const handleGenerateKioskOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(otpAmount, 10);
    if (!amount || amount <= 0) return;

    const code = generateOtpCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setGeneratedOtp({
      code,
      amount,
      expiresAt: expires,
      kioskName: 'Tout Kiosque Orange / MTN Conakry',
    });

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: generateRef('WF-OTP'),
      type: 'kiosk_otp_withdraw',
      amountGNF: amount,
      feeGNF: 2500,
      senderName: 'Amadou Diallo',
      recipientName: 'Retrait Kiosque Espèces',
      status: isOnline ? 'completed' : 'queued_offline',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      jarId: mainJar.id,
      otpCode: code,
      otpExpiresAt: expires,
      note: 'Code de retrait sans carte',
    };

    onAddTransaction(newTx);
    onTriggerVoice('cashout_kiosk');
  };

  // Handle Bill Pay
  const handleExecuteBillPay = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(billAmount, 10);
    if (!amount || amount <= 0) return;

    const providerName =
      billType === 'edg'
        ? 'Électricité de Guinée (EDG)'
        : billType === 'seg'
        ? 'Société des Eaux de Guinée (SEG)'
        : billType === 'canal'
        ? 'Canal+ Guinée'
        : 'Recharge Crédit Orange/MTN';

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: generateRef('WF-BILL'),
      type: 'bill_payment',
      amountGNF: amount,
      feeGNF: 0,
      senderName: 'Amadou Diallo',
      recipientName: providerName,
      status: isOnline ? 'completed' : 'queued_offline',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      jarId: mainJar.id,
      note: `Paiement ${providerName} - Compteur #${billAccountNo}`,
    };

    onAddTransaction(newTx);
    setActiveModal('none');
  };

  // Filter transactions based on tab and search term
  const filteredTransactions = transactions.filter((tx) => {
    const isIncoming = tx.type === 'diaspora_receive' || tx.type === 'momo_cash_in' || tx.type === 'p2p_receive';
    if (txFilter === 'incoming' && !isIncoming) return false;
    if (txFilter === 'outgoing' && isIncoming) return false;

    if (txSearch) {
      const q = txSearch.toLowerCase();
      const matchRef = tx.reference.toLowerCase().includes(q);
      const matchName = (tx.recipientName || tx.senderName || '').toLowerCase().includes(q);
      const matchNote = (tx.note || '').toLowerCase().includes(q);
      return matchRef || matchName || matchNote;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-950/90 border border-amber-600/50 rounded-2xl p-4 text-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Mode Hors-Ligne Actif (USSD & Cache Local)</h4>
              <p className="text-xs text-amber-300/80">
                Vos transactions sont sauvegardées en local. Elles seront transmises dès le rétablissement de la connexion.
              </p>
            </div>
          </div>
          <button
            onClick={() => onTriggerVoice('check_balance')}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Synchroniser
          </button>
        </div>
      )}

      {/* Main Account Hero Banner - Crisp & Clear */}
      <div
        className={`border rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-xl ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 text-white'
            : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200 text-slate-900'
        }`}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Portefeuille Principal
              </span>
              <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Conakry, Kaloum</span>
            </div>

            <div className="mt-2">
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Solde Total Cumulé (Tous Jars)</p>
              <div className="flex items-baseline gap-3 mt-1">
                <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formatGNF(totalBalanceGNF)}
                </h1>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isDark ? 'text-slate-300 bg-slate-800' : 'text-slate-700 bg-slate-200'}`}>
                  ≈ {(totalBalanceGNF / 9450).toFixed(2)} EUR
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tier 2 VÉRIFIÉ</span>
              </div>
              <div className={`hidden sm:flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Compte BCRG:</span>
                <code className="text-emerald-600 dark:text-emerald-400 font-mono">GN-7739-4401</code>
              </div>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveModal('send')}
              className="flex flex-col items-center justify-center p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-md group"
            >
              <Send className="w-5 h-5 mb-1 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-xs">Envoyer</span>
            </button>

            <button
              onClick={() => setActiveModal('cash_in')}
              className={`flex flex-col items-center justify-center p-3.5 font-bold rounded-2xl border transition-all group ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-2xs'
              }`}
            >
              <Plus className="w-5 h-5 mb-1 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Recharger</span>
            </button>

            <button
              onClick={() => setActiveModal('kiosk_otp')}
              className={`flex flex-col items-center justify-center p-3.5 font-bold rounded-2xl border transition-all group ${
                isDark ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 shadow-2xs'
              }`}
            >
              <QrCode className="w-5 h-5 mb-1 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span className="text-xs">Retrait Kiosque</span>
            </button>

            <button
              onClick={() => setActiveModal('bill_pay')}
              className={`flex flex-col items-center justify-center p-3.5 font-bold rounded-2xl border transition-all group ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-2xs'
              }`}
            >
              <Zap className="w-5 h-5 mb-1 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs">Payer Factures</span>
            </button>
          </div>
        </div>
      </div>

      {/* The "Jars" Multi-Subaccount System */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <PiggyBank className="w-5 h-5 text-emerald-500" /> Vos Jars & Epargnes
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Sous-comptes modulaires pour organiser vos projets et votre budget.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTransferFromJarId(jars[0]?.id || '');
                setTransferToJarId(jars[1]?.id || jars[0]?.id || '');
                setActiveModal('transfer_jars');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-indigo-300'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-indigo-600 shadow-2xs'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Déplacer l'Argent
            </button>

            <button
              onClick={() => setActiveModal('new_jar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-emerald-400'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-emerald-600 shadow-2xs'
              }`}
            >
              <Plus className="w-4 h-4" /> Nouveau Jar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jars.map((jar) => {
            const progress = jar.targetGNF ? Math.min(100, Math.round((jar.balanceGNF / jar.targetGNF) * 100)) : 100;

            return (
              <div
                key={jar.id}
                className={`border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between transition-all shadow-sm group ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${jar.color} flex items-center justify-center text-white shadow`}>
                      {jar.type === 'main' && <Wallet className="w-5 h-5" />}
                      {jar.type === 'savings' && <PiggyBank className="w-5 h-5" />}
                      {jar.type === 'travel' && <Compass className="w-5 h-5" />}
                      {jar.type === 'emergency' && <ShieldAlert className="w-5 h-5" />}
                    </div>

                    {jar.autoSavePercent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                        Auto-Save {jar.autoSavePercent}%
                      </span>
                    )}
                  </div>

                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{jar.name}</h4>
                  <div className={`text-2xl font-extrabold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatGNF(jar.balanceGNF)}</div>

                  {jar.targetGNF && (
                    <div className="mt-3">
                      <div className={`flex justify-between text-[11px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>Objectif: {formatGNF(jar.targetGNF)}</span>
                        <span className="text-emerald-500 font-bold">{progress}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                  <span className="capitalize text-[11px] font-mono">{jar.type === 'main' ? 'Principal' : jar.type}</span>
                  <button
                    onClick={() => {
                      setTransferFromJarId(jar.id);
                      const targetJar = jars.find((j) => j.id !== jar.id);
                      if (targetJar) setTransferToJarId(targetJar.id);
                      setActiveModal('transfer_jars');
                    }}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Déplacer <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recurrent Payments & Auto-Pay Bills Management */}
      <div
        className={`border rounded-3xl p-6 shadow-sm transition-all ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold mb-1 border border-indigo-500/20">
              <Repeat className="w-3.5 h-3.5" /> Prélèvements Automatiques & Échéances
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Paiements Récurrents & Factures Automatiques
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Automatisez le règlement de vos factures EDG, SEG, abonnements TV ou épargne mensuelle sans risque de coupure.
            </p>
          </div>

          <button
            onClick={() => setActiveModal('bill_pay')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" /> Programmer un Nouveau Paiement
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recurrentPayments.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isDark ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-mono">
                    {rec.frequency === 'monthly' ? 'Mensuel' : rec.frequency}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">N° {rec.accountNumber}</span>
                </div>

                <h4 className="font-extrabold text-sm mb-1 line-clamp-1">{rec.title}</h4>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{rec.billerName}</p>

                <div className="text-sm font-extrabold text-emerald-400 font-mono mb-2">
                  {formatGNF(rec.amountGNF)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" /> Prochaine échéance:
                  </span>
                  <span className="font-bold text-slate-200">{rec.nextDueDate}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Paiement auto:</span>
                  <button
                    onClick={() => toggleAutoPay(rec.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                      rec.autoPayEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {rec.autoPayEnabled ? (
                      <>
                        <Check className="w-3 h-3" /> Activé
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> Manuel
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cardless Cash Retrieval Kiosk Location & OTP Banner */}
      <div
        className={`border rounded-3xl p-6 transition-all shadow-sm ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/30 text-white'
            : 'bg-gradient-to-r from-amber-50/80 via-white to-slate-50 border-amber-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-500/40 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" /> Kiosques Partenaires Telco
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Orange Money & MTN MoMo Conakry</span>
            </div>

            <h3 className="text-xl font-bold">Retrait Espèces Sans Carte au Kiosque</h3>
            <p className={`text-xs max-w-xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Générez un code OTP sécurisé à 6 chiffres pour retirer des espèces dans les kiosques agréés à Conakry et en région.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal('kiosk_otp')}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <QrCode className="w-5 h-5" /> Générer Code Retrait OTP
            </button>

            <button
              onClick={() => setShowKiosks(!showKiosks)}
              className={`px-3 py-3 border rounded-2xl text-xs font-bold transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-2xs'
              }`}
            >
              {showKiosks ? 'Masquer la liste' : 'Voir les kiosques (4)'}
            </button>
          </div>
        </div>

        {/* Expandable Conakry Kiosks Status List */}
        {showKiosks && (
          <div className={`mt-6 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${isDark ? 'border-slate-800' : 'border-amber-200/60'}`}>
            {CONAKRY_KIOSKS.map((k) => (
              <div
                key={k.id}
                className={`p-3 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className={`truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{k.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">
                    {k.status}
                  </span>
                </div>
                <p className={`text-[11px] truncate flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <MapPin className="w-3 h-3 text-amber-500 shrink-0" /> {k.location}
                </p>
                <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Fonds: {k.cashAvailable}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History Section - Clean, Filterable, Readable */}
      <div className={`border rounded-3xl p-6 shadow-sm transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Historique des Transactions</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Transferts, recharges et paiements récents</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Rechercher nom, réf..."
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              className={`px-3 py-1.5 rounded-xl text-xs border outline-none transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
              }`}
            />

            {/* Filter Tabs */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setTxFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  txFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setTxFilter('incoming')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  txFilter === 'incoming'
                    ? 'bg-emerald-500 text-slate-950'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reçues
              </button>
              <button
                onClick={() => setTxFilter('outgoing')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  txFilter === 'outgoing'
                    ? 'bg-emerald-500 text-slate-950'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Envoyées
              </button>
            </div>
          </div>
        </div>

        <div className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">Aucune transaction trouvée.</div>
          ) : (
            filteredTransactions.map((tx) => {
              const isIncoming = tx.type === 'diaspora_receive' || tx.type === 'momo_cash_in' || tx.type === 'p2p_receive';

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedReceiptTx(tx)}
                  className={`py-3.5 flex items-center justify-between px-3 rounded-2xl cursor-pointer transition-all ${
                    isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        isIncoming
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                          : tx.type === 'kiosk_otp_withdraw'
                          ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                          : isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isIncoming ? <Download className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span>{tx.recipientName || tx.senderName}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-600 bg-slate-100'}`}>
                          {tx.reference}
                        </span>
                      </div>
                      <div className={`text-xs flex items-center gap-2 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{tx.timestamp}</span>
                        {tx.note && <span>• {tx.note}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-black text-sm ${isIncoming ? 'text-emerald-500' : isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      {isIncoming ? '+' : '-'}{formatGNF(tx.amountGNF)}
                    </div>
                    <div className="text-[10px] flex items-center justify-end gap-1 font-semibold mt-0.5">
                      {tx.status === 'completed' && <span className="text-emerald-500">Succès</span>}
                      {tx.status === 'queued_offline' && <span className="text-amber-500 animate-pulse">En attente réseau</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* SEND MONEY MODAL */}
      {activeModal === 'send' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" /> Envoyer de l'Argent (Zéro Frais)
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteSend} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Destination du Transfert</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSendMethod('orange_money')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                      sendMethod === 'orange_money' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Orange Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendMethod('mtn_momo')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                      sendMethod === 'mtn_momo' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendMethod('wallet')}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                      sendMethod === 'wallet' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    WestFlow App
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Numéro de Téléphone Bénéficiaire (Guinée)</label>
                <input
                  type="text"
                  placeholder="+224 62X XX XX XX"
                  value={sendPhone}
                  onChange={(e) => setSendPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Nom du Destinataire</label>
                <input
                  type="text"
                  placeholder="Ex: Fatoumata Camara"
                  value={sendName}
                  onChange={(e) => setSendName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Montant en Francs Guinéens (GNF)</label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Motif (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Achats marché Madina"
                  value={sendNote}
                  onChange={(e) => setSendNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
                >
                  Confirmer le Transfert ({formatGNF(parseInt(sendAmount || '0', 10))})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CASH-IN RECHARGE MODAL */}
      {activeModal === 'cash_in' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Recharger le Portefeuille
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteCashIn} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Source des Fonds</label>
                <select
                  value={cashInSource}
                  onChange={(e) => setCashInSource(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="orange_money">Orange Money Guinée (+224 628...)</option>
                  <option value="mtn_momo">MTN Mobile Money Guinée (+224 664...)</option>
                  <option value="ecobank">Ecobank Rapidtransfer Account</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Montant à Recharger (GNF)</label>
                <input
                  type="number"
                  value={cashInAmount}
                  onChange={(e) => setCashInAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                Une notification USSD Push apparaitra sur votre téléphone pour valider votre PIN Orange Money / MTN.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
                >
                  Déclencher Recharge ({formatGNF(parseInt(cashInAmount || '0', 10))})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KIOSK OTP RETRIEVAL GENERATOR MODAL */}
      {activeModal === 'kiosk_otp' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" /> Retrait Espèces Kiosque (Code OTP)
              </h3>
              <button
                onClick={() => {
                  setActiveModal('none');
                  setGeneratedOtp(null);
                }}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {!generatedOtp ? (
              <form onSubmit={handleGenerateKioskOtp} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Montant à Retirer (GNF)</label>
                  <input
                    type="number"
                    value={otpAmount}
                    onChange={(e) => setOtpAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xl font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Frais de guichet kiosque fixes: 2,500 GNF</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-amber-300">Comment ça marche ?</div>
                  <p>
                    1. Présentez le code à 6 chiffres dans n'importe quel kiosque Orange Money ou supermarché partenaire à Conakry.
                  </p>
                  <p>2. L'agent saisit le code sur son terminal POS et vous remet l'argent liquide immédiatement.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
                >
                  Générer le Code à 6 Chiffres
                </button>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/50 space-y-2">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Code de Retrait Valide (15 min)
                  </span>
                  <div className="text-4xl font-black font-mono tracking-widest text-amber-300 bg-amber-950/60 py-3 rounded-xl border border-amber-500/40">
                    {generatedOtp.code}
                  </div>
                  <p className="text-xs text-slate-400">
                    Montant réservé: <strong className="text-white">{formatGNF(generatedOtp.amount)}</strong>
                  </p>
                </div>

                {/* Simulated QR Code for Retail POS */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
                  <div className="w-36 h-36 border-4 border-slate-950 bg-slate-950 p-2 flex flex-col items-center justify-center text-center">
                    <QrCode className="w-24 h-24 text-amber-400" />
                    <span className="text-[9px] font-mono text-white mt-1">WF-OTP-{generatedOtp.code}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left text-xs space-y-1 text-slate-300">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>SMS pour Bénéficiaire :</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(`WestFlow Code Retrait Kiosque: ${generatedOtp.code} pour ${formatGNF(generatedOtp.amount)}`)}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Copy className="w-3 h-3" /> Copier SMS
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                    "WestFlow Guinée: Retirez {formatGNF(generatedOtp.amount)} au kiosque Orange avec le code {generatedOtp.code}. Valide jusqu'à {generatedOtp.expiresAt}."
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveModal('none');
                    setGeneratedOtp(null);
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW JAR MODAL */}
      {activeModal === 'new_jar' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Créer un Nouveau Jar
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteNewJar} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Nom du Jar / Projet</label>
                <input
                  type="text"
                  value={newJarName}
                  onChange={(e) => setNewJarName(e.target.value)}
                  placeholder="Ex: Épargne Loyer Madina, Achat Moto..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Type d'Épargne</label>
                <select
                  value={newJarType}
                  onChange={(e) => setNewJarType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="savings">Épargne Projet (Objectif)</option>
                  <option value="emergency">Fonds d'Urgence & Santé</option>
                  <option value="travel">Pèlerinage / Voyage / Tabaski</option>
                  <option value="goal">Achat Équipement / Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Objectif Cible (GNF)</label>
                <input
                  type="number"
                  value={newJarTarget}
                  onChange={(e) => setNewJarTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
              >
                Créer le Jar Épargne
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INTERNAL JAR MONEY TRANSFER MODAL */}
      {activeModal === 'transfer_jars' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-400" /> Virement Interne (Jars & Portefeuille)
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteJarTransfer} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Depuis le sous-compte (Source)</label>
                <select
                  value={transferFromJarId}
                  onChange={(e) => setTransferFromJarId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {jars.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} — Solde: {formatGNF(j.balanceGNF)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Vers le sous-compte (Destination)</label>
                <select
                  value={transferToJarId}
                  onChange={(e) => setTransferToJarId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {jars
                    .filter((j) => j.id !== transferFromJarId)
                    .map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name} — Solde: {formatGNF(j.balanceGNF)}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Montant du Virement (GNF)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-lg font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
                Les virements entre vos Jars et votre Portefeuille Principal WestFlow sont instantanés et 100% sans frais.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg transition-all"
              >
                Exécuter le Virement ({formatGNF(parseInt(transferAmount || '0', 10))})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BILL PAY MODAL */}
      {activeModal === 'bill_pay' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" /> Payer Factures & Services (EDG / SEG / Canal+)
              </h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteBillPay} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Service ou Fournisseur</label>
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="edg">EDG - Électricité de Guinée (Recharge Compteur)</option>
                  <option value="seg">SEG - Société des Eaux de Guinée</option>
                  <option value="canal">Canal+ Guinée (Abonnement TV)</option>
                  <option value="airtime">Recharge Crédit Téléphone (Orange / MTN)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">
                  {billType === 'edg'
                    ? 'Numéro de Compteur EDG'
                    : billType === 'seg'
                    ? 'Numéro de Police SEG'
                    : billType === 'canal'
                    ? 'Numéro Réabonné Canal+'
                    : 'Numéro de Téléphone à Recharger'}
                </label>
                <input
                  type="text"
                  value={billAccountNo}
                  onChange={(e) => setBillAccountNo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Montant à Payer (GNF)</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-lg font-bold text-blue-400 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg transition-all"
              >
                Payer la Facture ({formatGNF(parseInt(billAmount || '0', 10))})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT PREVIEW MODAL */}
      {selectedReceiptTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg">Reçu Officiel WestFlow</h3>
              <p className="text-xs text-slate-400">Réf. Ledger Go: {selectedReceiptTx.reference}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Montant:</span>
                <span className="font-bold text-emerald-400 text-sm">{formatGNF(selectedReceiptTx.amountGNF)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expéditeur:</span>
                <span className="text-slate-200">{selectedReceiptTx.senderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destinataire:</span>
                <span className="text-slate-200">{selectedReceiptTx.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horodatage:</span>
                <span className="text-slate-200">{selectedReceiptTx.timestamp}</span>
              </div>
              {selectedReceiptTx.otpCode && (
                <div className="flex justify-between bg-amber-950/40 p-2 rounded border border-amber-500/30">
                  <span className="text-amber-300 font-bold">Code OTP Kiosque:</span>
                  <span className="font-black text-amber-300">{selectedReceiptTx.otpCode}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedReceiptTx(null)}
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Fermer le Reçu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
