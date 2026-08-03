import React, { useState } from 'react';
import { formatGNF } from '../../utils/formatters';
import { Phone, PhoneCall, RefreshCw, Delete, Volume2, ShieldAlert } from 'lucide-react';

interface UssdSimulatorProps {
  balanceGNF: number;
  onTriggerVoice: (key: string) => void;
}

export const UssdSimulator: React.FC<UssdSimulatorProps> = ({ balanceGNF, onTriggerVoice }) => {
  const [typedCode, setTypedCode] = useState('*155#');
  const [ussdSessionActive, setUssdSessionActive] = useState(false);
  const [screenText, setScreenText] = useState<string[]>([]);
  const [userInputPrompt, setUserInputPrompt] = useState('');

  const handleKeyPress = (num: string) => {
    if (!ussdSessionActive) {
      setTypedCode((prev) => prev + num);
    } else {
      setUserInputPrompt((prev) => prev + num);
    }
  };

  const handleClear = () => {
    if (!ussdSessionActive) {
      setTypedCode((prev) => prev.slice(0, -1));
    } else {
      setUserInputPrompt((prev) => prev.slice(0, -1));
    }
  };

  const handleDial = () => {
    if (!ussdSessionActive) {
      setUssdSessionActive(true);
      if (typedCode === '*155#' || typedCode === '*144#') {
        setScreenText([
          '-- WESTFLOW USSD GUINÉE --',
          '1. Solde Portefeuille & Jars',
          '2. Transfert d\'Argent (MoMo/P2P)',
          '3. Code Retrait Kiosque',
          '4. Payer Facture EDG/SEG',
          'Répondre avec 1-4:',
        ]);
      } else {
        setScreenText(['Code USSD Inconnu.', 'Tapez *155# pour WestFlow']);
      }
    } else {
      // Process input
      const choice = userInputPrompt.trim();
      setUserInputPrompt('');

      if (choice === '1') {
        setScreenText([
          '-- SOLDE WESTFLOW --',
          `Solde Principal: ${formatGNF(balanceGNF)}`,
          'Jars Epargne: 8,500,000 GNF',
          'Appuyez sur 0 pour retour',
        ]);
        onTriggerVoice('check_balance');
      } else if (choice === '2') {
        setScreenText([
          '-- TRANSFERT --',
          'Entrez le numéro du destinataire (Ex: 628451290):',
        ]);
      } else if (choice === '3') {
        const code = Math.floor(100000 + Math.random() * 900000);
        setScreenText([
          '-- RETRAIT KIOSQUE --',
          `Code OTP: ${code}`,
          'Valide 15 min dans tous les kiosques Orange.',
        ]);
        onTriggerVoice('cashout_kiosk');
      } else if (choice === '4') {
        setScreenText([
          '-- FACTURES EDG --',
          'Compteur 883920192:',
          'Facture Récente: 150,000 GNF',
          'Appuyez 1 pour Valider Paiement',
        ]);
      } else {
        setScreenText(['Session terminée.', 'Merci d\'avoir utilisé WestFlow USSD!']);
        setTimeout(() => setUssdSessionActive(false), 2000);
      }
    }
  };

  const handleEndCall = () => {
    setUssdSessionActive(false);
    setScreenText([]);
    setUserInputPrompt('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/40 inline-flex items-center gap-1.5 mb-2">
              <Phone className="w-3.5 h-3.5" /> Canal USSD Fallback (*144# / *155#)
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">Simulateur Téléphone à Clavier (2G)</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Garantit l'accès aux services financiers même dans les zones sans connexion 3G/4G (Pita, Siguiri, Koundara) ou pour les utilisateurs de feature phones.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 text-xs text-amber-200">
            <span className="font-bold">Protocole Gateway SMPP/USSD</span>
            <p className="text-[11px] text-slate-400">Routage direct via Africa's Talking / Orange Guinée</p>
          </div>
        </div>
      </div>

      {/* Feature Phone Sandbox UI */}
      <div className="max-w-md mx-auto bg-slate-900 border-4 border-slate-700 rounded-[40px] p-6 shadow-2xl text-white space-y-6 relative">
        {/* Phone Earpiece */}
        <div className="w-16 h-1.5 bg-slate-700 rounded-full mx-auto" />

        {/* Feature Phone Screen */}
        <div className="bg-emerald-950/90 border-2 border-emerald-500/50 rounded-2xl p-4 font-mono text-emerald-300 min-h-[220px] shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 border-b border-emerald-500/30 pb-1 mb-2">
            <span>ORANGE GUINÉE 2G</span>
            <span>📶 100%</span>
          </div>

          {!ussdSessionActive ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs text-emerald-400/70">Tapez un code USSD :</p>
              <div className="text-3xl font-extrabold text-emerald-200 tracking-wider font-mono">
                {typedCode || '_'}
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-xs">
              {screenText.map((line, idx) => (
                <div key={idx} className="leading-tight">{line}</div>
              ))}
              <div className="pt-2 text-emerald-100 font-bold flex items-center gap-1">
                <span>&gt; {userInputPrompt}</span>
                <span className="w-1.5 h-3 bg-emerald-400 animate-pulse inline-block" />
              </div>
            </div>
          )}

          <div className="text-[9px] text-emerald-500/80 text-right border-t border-emerald-500/20 pt-1 mt-2">
            WestFlow USSD Engine v1.26
          </div>
        </div>

        {/* Keypad Buttons */}
        <div className="grid grid-cols-3 gap-3 px-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white font-black text-lg rounded-xl border border-slate-700 shadow-md transition-all active:scale-95"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Call / End Controls */}
        <div className="grid grid-cols-3 gap-3 px-2">
          <button
            onClick={handleDial}
            className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-1"
          >
            <PhoneCall className="w-4 h-4" /> Composer
          </button>

          <button
            onClick={handleClear}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-1"
          >
            <Delete className="w-4 h-4" /> Effacer
          </button>

          <button
            onClick={handleEndCall}
            className="py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-1"
          >
            Raccrocher
          </button>
        </div>
      </div>
    </div>
  );
};
