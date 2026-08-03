import React, { useState } from 'react';
import { SimSwapCheckResult, KycStatus } from '../../types';
import { INITIAL_KYC } from '../../data/mockData';
import { formatGNF } from '../../utils/formatters';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Camera,
  FileCheck,
  Lock,
  RefreshCw,
  Search,
  Zap,
} from 'lucide-react';

export const SecurityCenter: React.FC = () => {
  const [kyc, setKyc] = useState<KycStatus>(INITIAL_KYC);
  const [testPhone, setTestPhone] = useState('+224 628 45 12 90');
  const [simCheckResult, setSimCheckResult] = useState<SimSwapCheckResult | null>(null);
  const [isCheckingSim, setIsCheckingSim] = useState(false);

  // Liveness simulator
  const [isLivenessRunning, setIsLivenessRunning] = useState(false);
  const [livenessStep, setLivenessStep] = useState(0);

  const handleCheckSimSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingSim(true);

    setTimeout(() => {
      // Simulate CAMARA API call result
      const isSwapped = testPhone.includes('622') || testPhone.includes('999');
      setSimCheckResult({
        phone: testPhone,
        swappedLast48Hours: isSwapped,
        swapTimestamp: isSwapped ? '2026-08-02 14:10' : undefined,
        carrier: testPhone.includes('66') ? 'MTN Guinea' : 'Orange Guinea',
        riskScore: isSwapped ? 'CRITICAL' : 'LOW',
        actionTaken: isSwapped ? 'QUARANTINE' : 'ALLOW',
      });
      setIsCheckingSim(false);
    }, 1200);
  };

  const handleStartLiveness = () => {
    setIsLivenessRunning(true);
    setLivenessStep(1);

    setTimeout(() => setLivenessStep(2), 1500);
    setTimeout(() => setLivenessStep(3), 3000);
    setTimeout(() => {
      setIsLivenessRunning(false);
      setKyc((prev) => ({
        ...prev,
        tier: 3,
        livenessVerified: true,
        dailyLimitGNF: 999000000,
      }));
    }, 4200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/40 inline-flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Norme Anti-Fraude GSMA CAMARA & BCRG
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">Protection SIM-Swap & Tiered KYC</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Vérification automatique du changement de carte SIM sous 48 heures pour bloquer les attaques d'ingénierie sociale à Conakry.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/30 text-xs text-indigo-200 font-mono">
            <span>Chiffrement HSM AES-256</span>
            <p className="text-[11px] text-slate-400">Plafond Actuel Tier 2: {formatGNF(kyc.dailyLimitGNF)}/jour</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GSMA CAMARA SIM-Swap Middleware Test Bench */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" /> Middleware Anti-SIM Swap (API Telco GSMA)
            </h3>
            <p className="text-xs text-slate-400">
              Interroge directement les réseaux Orange & MTN Guinea pour valider l'intégrité de la puce SIM.
            </p>
          </div>

          <form onSubmit={handleCheckSimSwap} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Numéro de Téléphone à Vérifier</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  disabled={isCheckingSim}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-md flex items-center gap-1.5"
                >
                  {isCheckingSim ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Test CAMARA
                </button>
              </div>
            </div>
          </form>

          {/* SIM Swap Result Box */}
          {simCheckResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 animate-in zoom-in-95 ${
                simCheckResult.swappedLast48Hours
                  ? 'bg-red-950/60 border-red-500/50 text-red-200'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  {simCheckResult.swappedLast48Hours ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  Résultat Détection SIM Swap : {simCheckResult.riskScore}
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-900 border border-current">
                  {simCheckResult.carrier}
                </span>
              </div>

              <p className="text-xs">
                {simCheckResult.swappedLast48Hours
                  ? '⚠️ ATTENTION: La carte SIM a été renouvelée récemment (moins de 48h). Les retraits d\'espèces importants sont mis sous quarantaine automatique.'
                  : '✅ Carte SIM authentique et stable. Aucune réémission récente détectée.'}
              </p>

              <div className="pt-2 border-t border-current/20 flex justify-between text-[11px] font-mono">
                <span>Action Système :</span>
                <strong className="uppercase">{simCheckResult.actionTaken}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Tiered KYC Verification Center */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" /> Niveaux de Vérification KYC (Tiered KYC)
            </h3>
            <p className="text-xs text-slate-400">
              Conformité régulation BCRG pour les institutions financières en Guinée.
            </p>
          </div>

          <div className="space-y-3">
            {/* Tier 1 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Tier 1: Téléphone Uniquement</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">VERIFIÉ</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">Plafond: 2,000,000 GNF/jour</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Tier 2 */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Tier 2: Carte Nationale d'Identité / Passeport OCR</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">VERIFIÉ</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">Plafond: 25,000,000 GNF/jour</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Tier 3 */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                kyc.tier === 3 ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Tier 3: Liveness 3D & Biométrie Visage</span>
                  {kyc.tier === 3 ? (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">
                      ACTIF (SANS PLAFOND)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">DISPONIBLE</span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">Plafond: Illimité (Transactions Entreprises)</p>
              </div>

              {kyc.tier !== 3 && (
                <button
                  onClick={handleStartLiveness}
                  disabled={isLivenessRunning}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1"
                >
                  <Camera className="w-4 h-4" /> Activer Tier 3
                </button>
              )}
            </div>
          </div>

          {/* Liveness Scanner Simulator Box */}
          {isLivenessRunning && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/50 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto flex items-center justify-center">
                <Camera className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="font-bold text-indigo-300 text-sm">
                {livenessStep === 1 && '1/3 : Analyse du cadre du visage...'}
                {livenessStep === 2 && '2/3 : Clignez des yeux pour validation liveness...'}
                {livenessStep === 3 && '3/3 : Correspondance biométrique OCR carte d\'identité...'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
