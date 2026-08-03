import React, { useState } from 'react';
import { formatGNF, generateRef } from '../../utils/formatters';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  AlertTriangle,
  HelpCircle,
  PlusCircle,
  FileText,
  DollarSign,
  Sparkles,
  Info,
  Calendar,
  Percent,
} from 'lucide-react';

interface CreditScorePortalProps {
  onTriggerVoice: (key: string) => void;
  theme?: 'dark' | 'light';
  onAddTransaction?: (tx: any) => void;
}

export const CreditScorePortal: React.FC<CreditScorePortalProps> = ({
  onTriggerVoice,
  theme = 'dark',
  onAddTransaction,
}) => {
  const isDark = theme === 'dark';

  // Loan Request Modal State
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(3);
  const [loanPurpose, setLoanPurpose] = useState<string>('Stock Commerce / Marché Madina');
  const [loanSuccessMessage, setLoanSuccessMessage] = useState<string | null>(null);

  // Loan interest rate: 1.5% monthly
  const monthlyRate = 0.015;
  const totalInterest = Math.round(loanAmount * monthlyRate * loanTermMonths);
  const totalRepayment = loanAmount + totalInterest;
  const monthlyInstallment = Math.round(totalRepayment / loanTermMonths);

  // Mock Credit History
  const [scoreHistory] = useState([
    { month: 'Oct 2025', score: 620, note: 'Ouverture du compte & vérification Tier 2' },
    { month: 'Nov 2025', score: 655, note: '+35 pts: 3 paiements de factures EDG sans retard' },
    { month: 'Déc 2025', score: 690, note: '+35 pts: Epargne régulière de 1.000.000 GNF dans Jar Urgence' },
    { month: 'Jan 2026', score: 715, note: '+25 pts: Remboursement ponctuel du micro-prêt 500k GNF' },
    { month: 'Fév 2026', score: 730, note: '+15 pts: Volume de transactions Mobile Money stable' },
    { month: 'Mar 2026 (Actuel)', score: 745, note: '+15 pts: Zéro incident ou retard de paiement' },
  ]);

  const currentScore = 745;
  const maxScore = 850;
  const scorePercent = Math.round((currentScore / maxScore) * 100);

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    setLoanSuccessMessage(
      `Félicitations ! Votre prêt de ${formatGNF(loanAmount)} a été approuvé et crédité sur votre Portefeuille Principal.`
    );

    if (onAddTransaction) {
      onAddTransaction({
        id: `tx_loan_${Date.now()}`,
        reference: generateRef('WF-LOAN'),
        type: 'p2p_receive',
        amountGNF: loanAmount,
        feeGNF: 0,
        senderName: 'WestFlow Micro-Crédit BCRG',
        recipientName: 'Mamadou Diallo',
        status: 'completed',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        note: `Prêt Avance Trésorerie (${loanTermMonths} mois @ 1.5%/mois)`,
      });
    }

    setTimeout(() => {
      setShowLoanModal(false);
      setLoanSuccessMessage(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div
        className={`border rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-xl ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border-slate-800 text-white'
            : 'bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 border-indigo-100 text-slate-900'
        }`}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold mb-3">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Système de Scoring Crédit Alternatif Guinée</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Score Crédit & Santé Financière
            </h1>
            <p className={`text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              WestFlow analyse la ponctualité de vos factures (EDG/SEG), la régularité de vos Jars d'épargne et le flux de votre portefeuille pour vous accorder un accès direct aux micro-crédits sans garantie lourde.
            </p>
          </div>

          <button
            onClick={() => setShowLoanModal(true)}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 shrink-0"
          >
            <Zap className="w-5 h-5" />
            <span>Demander un Micro-Prêt Instantané</span>
          </button>
        </div>
      </div>

      {/* Main Score Gauge & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Gauge Card */}
        <div
          className={`lg:col-span-5 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all shadow-md ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Votre Score Actuel
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Très Bon (Class A)
              </span>
            </div>

            {/* Score Big Display */}
            <div className="text-center py-6">
              <div className="relative inline-block">
                <div className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                  {currentScore}
                </div>
                <div className={`text-xs font-bold font-mono mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  sur {maxScore} points
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6 space-y-2">
                <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>300 (Faible)</span>
                  <span>580 (Moyen)</span>
                  <span>700 (Bon)</span>
                  <span className="text-emerald-500">850 (Excellent)</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border text-xs space-y-2 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <div className="flex items-center justify-between font-bold">
              <span>Capacité d'emprunt maximale :</span>
              <span className="text-emerald-500 font-extrabold text-sm">{formatGNF(3500000)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Taux d'intérêt préférentiel :</span>
              <span className="font-mono text-emerald-400">1.5 % / mois</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Délai de décision :</span>
              <span className="font-bold text-white">Instantané (&lt; 10 sec)</span>
            </div>
          </div>
        </div>

        {/* Factors Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Facteurs d'Évaluation du Score
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Factor 1 */}
            <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  98%
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  Impact Élevé
                </span>
              </div>
              <h4 className="font-bold text-sm mb-1">Ponctualité des Factures</h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Règlement sans retard des compteurs EDG, SEG et abonnements Canal+.
              </p>
            </div>

            {/* Factor 2 */}
            <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  85%
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  Impact Moyen
                </span>
              </div>
              <h4 className="font-bold text-sm mb-1">Épargne dans les Jars</h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Réserves d'argent régulières conservées dans les sous-comptes Jars.
              </p>
            </div>

            {/* Factor 3 */}
            <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                  92%
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                  Impact Moyen
                </span>
              </div>
              <h4 className="font-bold text-sm mb-1">Mouvements de Portefeuille</h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Entrées/sorties régulières via Orange Money, MTN MoMo et transferts Diaspora.
              </p>
            </div>

            {/* Factor 4 */}
            <div className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  100%
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  Vérifié
                </span>
              </div>
              <h4 className="font-bold text-sm mb-1">Niveau KYC & Identité BCRG</h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Carte Nationale d'Identité ou Passeport Guinéen validé avec biométrie.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Score Evolution Timeline */}
      <div className={`border rounded-3xl p-6 sm:p-8 transition-all shadow-md ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Calendar className="w-5 h-5 text-indigo-500" /> Historique de Progression du Score
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Consultez l'évolution de votre note au fil des mois et des actions financières accomplies.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            +125 Points en 6 mois
          </span>
        </div>

        <div className="space-y-4">
          {scoreHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                isDark ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 font-mono font-black text-lg flex items-center justify-center shrink-0 border border-indigo-500/20">
                  {item.score}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{item.month}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      Vérifié BCRG
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.note}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  Score : {item.score} / 850
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Offers & Micro-Credit Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Offer 1 */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base mb-1">Prêt Avance Trésorerie</h4>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Prêt de 500,000 GNF à 2,500,000 GNF déboursé en quelques secondes directement sur votre Portefeuille.
            </p>
          </div>
          <button
            onClick={() => {
              setLoanAmount(1500000);
              setShowLoanModal(true);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
          >
            Demander ce Prêt
          </button>
        </div>

        {/* Offer 2 */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base mb-1">Financement Équipement Solaire</h4>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Financement de kits solaires résidentiels EDG avec remboursement échelonné sur 6 mois.
            </p>
          </div>
          <button
            onClick={() => {
              setLoanAmount(3000000);
              setShowLoanModal(true);
            }}
            className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            Simuler le Financement
          </button>
        </div>

        {/* Offer 3 */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base mb-1">Micro-Crédit Moto-Kiosque</h4>
            <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Crédit d'équipement réservé aux gérants de kiosques agréés et commerçants ambulants.
            </p>
          </div>
          <button
            onClick={() => {
              setLoanAmount(5000000);
              setShowLoanModal(true);
            }}
            className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            Découvrir l'Offre
          </button>
        </div>
      </div>

      {/* LOAN SIMULATION & REQUEST MODAL */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" /> Demande de Micro-Crédit Instantané
              </h3>
              <button
                onClick={() => {
                  setShowLoanModal(false);
                  setLoanSuccessMessage(null);
                }}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {loanSuccessMessage ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-emerald-300 leading-relaxed">{loanSuccessMessage}</p>
                <p className="text-xs text-slate-400">Redirection vers le portefeuille en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleApplyLoan} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-400 font-medium">Montant Souhaité (GNF)</label>
                    <span className="text-xs font-bold text-emerald-400">{formatGNF(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={3500000}
                    step={250000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>500,000 GNF</span>
                    <span>3,500,000 GNF (Plafond)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Durée de Remboursement</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 3, 6].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setLoanTermMonths(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          loanTermMonths === m
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {m} mois
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Motif du Prêt</label>
                  <input
                    type="text"
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: Achat marchandises, avance loyer..."
                    required
                  />
                </div>

                {/* Simulation Summary Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Montant emprunté :</span>
                    <span className="font-bold text-white">{formatGNF(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Intérêt total (1.5%/mois) :</span>
                    <span className="font-bold text-emerald-400">{formatGNF(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2 font-bold">
                    <span>Mensualité à rembourser :</span>
                    <span className="text-sm font-extrabold text-emerald-400">{formatGNF(monthlyInstallment)} / mois</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Obtenir {formatGNF(loanAmount)} Immédiatement</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
