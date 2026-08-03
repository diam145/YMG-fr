import React, { useState } from 'react';
import { FxRate, Transaction } from '../../types';
import { formatGNF, generateRef, formatCurrency } from '../../utils/formatters';
import {
  Globe2,
  ArrowRightLeft,
  CreditCard,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Send,
  Zap,
} from 'lucide-react';

interface DiasporaPortalProps {
  fxRates: FxRate[];
  onAddTransaction: (tx: Transaction) => void;
  onTriggerVoice: (key: string) => void;
  theme?: 'dark' | 'light';
}

export const DiasporaPortal: React.FC<DiasporaPortalProps> = ({
  fxRates,
  onAddTransaction,
  onTriggerVoice,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [sendAmountForeign, setSendAmountForeign] = useState('200');
  const [sendCurrency, setSendCurrency] = useState<'EUR' | 'USD' | 'CAD' | 'GBP'>('EUR');

  const [recipientName, setRecipientName] = useState('Amadou Diallo (Famille Conakry)');
  const [recipientPhone, setRecipientPhone] = useState('+224 628 45 12 90');
  const [deliveryMethod, setDeliveryMethod] = useState<'wallet' | 'orange_money' | 'bank_ecobank' | 'kiosk_code'>(
    'orange_money'
  );

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'sepa'>('card');
  const [transferSubmitted, setTransferSubmitted] = useState<Transaction | null>(null);

  const activeFxObj = fxRates.find((f) => f.fromCurrency === sendCurrency) || fxRates[0];
  const foreignNum = parseFloat(sendAmountForeign || '0');
  const gnfReceived = Math.round(foreignNum * activeFxObj.rate);

  // Compare savings vs Western Union / Moneygram
  const traditionalFeeGNF = Math.round(gnfReceived * 0.065); // 6.5% traditional fee
  const westflowFeeGNF = 0; // 0 fee on WestFlow promotion

  const handleExecuteRemittance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foreignNum || foreignNum <= 0) return;

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: generateRef('WF-DIASPORA'),
      type: 'diaspora_receive',
      amountGNF: gnfReceived,
      amountForeign: foreignNum,
      currencyForeign: sendCurrency,
      feeGNF: 0,
      senderName: 'Mamadou Diallo (Paris, France)',
      senderPhone: '+33 6 12 34 56 78',
      recipientName: recipientName,
      recipientPhone: recipientPhone,
      recipientMethod: deliveryMethod === 'orange_money' ? 'orange_money' : 'wallet',
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      note: `Transfert Diaspora depuis la France (${sendAmountForeign} ${sendCurrency})`,
    };

    onAddTransaction(newTx);
    setTransferSubmitted(newTx);
    onTriggerVoice('welcome');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Diaspora Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/40 inline-flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" /> Diaspora Europe & Amérique du Nord
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Envoyez de l'argent en Guinée au taux officiel en 0 seconde.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Zéro frais de transfert, taux de change garanti en temps réel (BCRG) et dépôt direct sur compte bancaire Ecobank, portefeuille WestFlow ou compte Orange Money / MTN MoMo.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-blue-500/30 text-xs space-y-2 font-mono">
            <div className="flex items-center justify-between text-blue-300 font-bold border-b border-slate-800 pb-2">
              <span>Taux du Jour (BCRG)</span>
              <span className="text-emerald-400">1 EUR = 9,450 GNF</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Économisez en moyenne <strong className="text-white">120,000 GNF</strong> par transfert comparé aux agences traditionnelles.
            </p>
          </div>
        </div>
      </div>

      {!transferSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Transfer Calculator */}
          <div
            className={`lg:col-span-7 border rounded-3xl p-6 sm:p-8 transition-all shadow-md space-y-6 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-emerald-500" /> Calculateur de Transfert International
            </h3>

            <form onSubmit={handleExecuteRemittance} className="space-y-5">
              {/* You Send Input */}
              <div>
                <label className={`block text-xs mb-1.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Vous envoyez depuis l'étranger
                </label>
                <div
                  className={`flex items-center border rounded-2xl p-2 transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800 focus-within:border-emerald-500' : 'bg-slate-50 border-slate-300 focus-within:border-emerald-500'
                  }`}
                >
                  <input
                    type="number"
                    value={sendAmountForeign}
                    onChange={(e) => setSendAmountForeign(e.target.value)}
                    className={`w-full bg-transparent px-3 text-2xl font-black focus:outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                    placeholder="200"
                    required
                  />
                  <select
                    value={sendCurrency}
                    onChange={(e) => setSendCurrency(e.target.value as any)}
                    className={`border font-bold text-sm rounded-xl px-3 py-2.5 focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                    }`}
                  >
                    <option value="EUR">🇪🇺 EUR (€)</option>
                    <option value="USD">🇺🇸 USD ($)</option>
                    <option value="CAD">🇨🇦 CAD ($)</option>
                    <option value="GBP">🇬🇧 GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* FX Breakdown Widget */}
              <div
                className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  isDark ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex justify-between">
                  <span>Taux de conversion :</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    1 {sendCurrency} = {activeFxObj.rate.toLocaleString()} GNF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de transfert WestFlow :</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0.00 {sendCurrency} (GRATUIT)</span>
                </div>
                <div className="flex justify-between">
                  <span>Délai de livraison :</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Instantané (0 sec)
                  </span>
                </div>
              </div>

              {/* Recipient Receives Output */}
              <div>
                <label className={`block text-xs mb-1.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Le bénéficiaire reçoit en Guinée
                </label>
                <div
                  className={`flex items-center border rounded-2xl p-3 ${
                    isDark ? 'bg-slate-950 border-emerald-500/40' : 'bg-emerald-50/50 border-emerald-300'
                  }`}
                >
                  <div className="w-full text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatGNF(gnfReceived)}</div>
                  <span className="text-xs font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                    GNF
                  </span>
                </div>
              </div>

              {/* Delivery Method Selection */}
              <div>
                <label className={`block text-xs mb-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Mode de Réception en Guinée
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('orange_money')}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                      deliveryMethod === 'orange_money'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-700 dark:text-orange-200 ring-2 ring-orange-500/30'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-extrabold text-orange-500 mb-0.5">Orange Money</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Directement sur +224 62X</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('wallet')}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                      deliveryMethod === 'wallet'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-0.5">WestFlow App</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Vers Portefeuille & Jars</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('bank_ecobank')}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                      deliveryMethod === 'bank_ecobank'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-200 ring-2 ring-blue-500/30'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-extrabold text-blue-600 dark:text-blue-400 mb-0.5">Ecobank / Vista</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Virement bancaire direct</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('kiosk_code')}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                      deliveryMethod === 'kiosk_code'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-200 ring-2 ring-amber-500/30'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="font-extrabold text-amber-600 dark:text-amber-400 mb-0.5">Code SMS Kiosque</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pour parent sans smartphone</div>
                  </button>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Nom Complet du Bénéficiaire
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-xs mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Téléphone Guinée (+224)
                  </label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Payment Method in Diaspora */}
              <div>
                <label className={`block text-xs mb-1.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Mode de Paiement (Étranger)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Carte Bancaire
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                     Pay / Google
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('sepa')}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'sepa'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> SEPA / Plaid
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-md transition-all text-base flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Envoyer {sendAmountForeign} {sendCurrency} Maintenant ({formatGNF(gnfReceived)})
              </button>
            </form>
          </div>

          {/* Right Column: Comparative Value & Security Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Savings Comparison Card */}
            <div
              className={`border rounded-3xl p-6 transition-all shadow-sm space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <h4 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Avantage Tarifaire WestFlow
              </h4>

              <div className="space-y-3 text-xs">
                <div
                  className={`p-3 rounded-xl border flex justify-between items-center ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>WestFlow (Conakry)</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Taux officiel BCRG + 0€ Frais</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{formatGNF(gnfReceived)}</div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">LIVRÉ INSTANTANÉMENT</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border flex justify-between items-center opacity-70 ${
                    isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <div className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Western Union / Agences</div>
                    <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Frais de guichet + 4.5% spread</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-extrabold text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {formatGNF(gnfReceived - traditionalFeeGNF)}
                    </div>
                    <span className="text-[10px] text-red-500 font-bold">- {formatGNF(traditionalFeeGNF)} de perte</span>
                  </div>
                </div>
              </div>

              <p
                className={`text-[11px] leading-relaxed p-3 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                }`}
              >
                💡 Votre famille en Guinée reçoit jusqu'à <strong className="text-emerald-600 dark:text-emerald-400">120,000 GNF de plus</strong> par tranche de 200€ grâce à la suppression des intermédiaires physiques.
              </p>
            </div>

            {/* Regulatory & Security Compliance */}
            <div
              className={`border rounded-3xl p-6 transition-all shadow-sm space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-6 h-6" />
                <span>Sécurité Réglementée par la BCRG</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                WestFlow opère en partenariat direct avec les établissements de crédit agréés par la Banque Centrale de la République de Guinée (BCRG). Les fonds sont conservés sur des comptes de cantonnement sécurisés à l'Ecobank et Vista Bank Conakry.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Remittance Success & Live Tracking Timeline */
        <div className="max-w-2xl mx-auto bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-white shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Transfert International Confirmé !</h2>
            <p className="text-xs text-slate-300 mt-1">
              Réf. Règlement: <code className="text-emerald-400 font-mono">{transferSubmitted.reference}</code>
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suivi de Livraison en Temps Réel</h4>

            <div className="relative pl-6 border-l-2 border-emerald-500 space-y-4 text-xs">
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                <div className="font-bold text-white">Paiement Débité à l'Étranger</div>
                <div className="text-[11px] text-slate-400">
                  {transferSubmitted.amountForeign} {transferSubmitted.currencyForeign} via {paymentMethod.toUpperCase()}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                <div className="font-bold text-white">Compensation FX instantanée (BCRG)</div>
                <div className="text-[11px] text-slate-400">Converti au taux garanti de 1 EUR = 9,450 GNF</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                <div className="font-bold text-emerald-400">Fonds Disponible à Conakry</div>
                <div className="text-[11px] text-emerald-300">
                  {formatGNF(transferSubmitted.amountGNF)} crédités sur le compte de {transferSubmitted.recipientName}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setTransferSubmitted(null)}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
            >
              Faire un autre envoi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
