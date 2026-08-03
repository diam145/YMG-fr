import React, { useState } from 'react';
import {
  Globe2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Phone,
  Wallet,
  Building2,
  Store,
  CheckCircle2,
  Sparkles,
  Volume2,
  Send,
  RefreshCw,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Users,
} from 'lucide-react';
import { Dialect } from '../types';

interface HomePageProps {
  onNavigateLogin: (role?: 'individual' | 'diaspora' | 'business' | 'agent') => void;
  onNavigateDemo: (view?: 'consumer' | 'diaspora' | 'business' | 'ussd') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentDialect: Dialect;
  onChangeDialect: (dialect: Dialect) => void;
  onTriggerVoice: (key: string) => void;
  isSpeaking: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateLogin,
  onNavigateDemo,
  theme,
  onToggleTheme,
  currentDialect,
  onChangeDialect,
  onTriggerVoice,
  isSpeaking,
}) => {
  const isDark = theme === 'dark';

  // Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcCurrency, setCalcCurrency] = useState<'EUR' | 'USD' | 'GBP'>('EUR');

  const rates = {
    EUR: 9450,
    USD: 8620,
    GBP: 11150,
  };

  const calculatedGNF = calcAmount * rates[calcCurrency];
  const traditionalFee = Math.round(calcAmount * 0.065); // traditional money transfer ~6.5%
  const westflowFee = 0; // Transparent zero fee or minimal fee

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Announcement & Quick Controls Bar */}
      <div className={`border-b px-4 py-2 text-xs transition-colors ${isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-100/90 border-slate-200 text-slate-700'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Direct Guinée 🇬🇳
            </span>
            <span className="hidden sm:inline text-xs">Taux officiel BCRG: 1 EUR = 9,450 GNF • Sans frais cachés</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dialect Selector */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500 hidden md:inline">Langue:</span>
              <select
                value={currentDialect}
                onChange={(e) => onChangeDialect(e.target.value as Dialect)}
                className={`px-2 py-0.5 rounded border text-xs font-semibold focus:outline-none ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="fr">Français</option>
                <option value="susu">Susu (Soussou)</option>
                <option value="pular">Pular (Peul)</option>
                <option value="malinke">Malinké (Maninka)</option>
              </select>
            </div>

            {/* Voice Guidance Button */}
            <button
              onClick={() => onTriggerVoice('welcome')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                isSpeaking
                  ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                  : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Guide Vocal</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-full transition-all ${
                isDark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-200 text-indigo-900 hover:bg-slate-300'
              }`}
              title="Basculer Thème"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="w-full max-w-[92%] xl:max-w-[88%] mx-auto px-2 sm:px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onNavigateDemo('consumer')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg ring-2 ring-emerald-500/20 shrink-0">
              <span className="font-black text-slate-950 text-xl sm:text-2xl tracking-tighter">WF</span>
            </div>
            {/* Mobile-only flag badge */}
            <span className="sm:hidden bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              🇬🇳
            </span>
            {/* Desktop Brand Text */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className={`font-black text-2xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  West<span className="text-emerald-500">Flow</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  GUINÉE 🇬🇳
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Le Futur des Services Financiers</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#solutions" className={`hover:text-emerald-500 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Solutions
            </a>
            <a href="#calculator" className={`hover:text-emerald-500 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Transfert & Taux
            </a>
            <a href="#business" className={`hover:text-emerald-500 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Entreprises & Paie
            </a>
            <a href="#security" className={`hover:text-emerald-500 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Sécurité & USSD
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigateLogin()}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-all whitespace-nowrap ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
              }`}
            >
              Se Connecter
            </button>
            <button
              onClick={() => onNavigateLogin('individual')}
              className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md hover:shadow-emerald-500/20 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Ouvrir un Compte</span>
              <span className="sm:hidden">S'inscrire</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glowing background blur accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[92%] xl:max-w-[88%] mx-auto px-2 sm:px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Nouveau en Guinée (Conakry, Kindia, Labé, Kankan)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15]">
              Le Compte Digital & Transfert de Référence en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300">Guinée</span>
            </h1>

            <p className={`text-base sm:text-xl leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Envoyez de l'argent depuis la Diaspora sans frais cachés. Gagnez en indépendance financière avec nos Jars d'épargne, la paie d'entreprise simplifiée et l'accès hors-ligne via <span className="text-emerald-500 font-bold font-mono">*155#</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigateLogin()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                Commencer Maintenant <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigateDemo('consumer')}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold border text-base transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
                }`}
              >
                Explorer la Démo Interactive
              </button>
            </div>

            {/* Social proof highlights */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-slate-800/20 dark:border-slate-800/80">
              <div>
                <p className="text-2xl font-black text-emerald-500">0 GNF</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Frais de transfert P2P</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-500">9,450 GNF</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Taux garanti pour 1 EUR</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-500">&lt; 5 sec</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Délai de réception Orange/MTN</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-500">*155#</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accès USSD sans Internet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVOLUT / WISE STYLE LIVE CALCULATOR SECTION */}
      <section id="calculator" className={`py-16 border-y transition-colors ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/70 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                Taux de Change Transparent
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Envoyez de l'argent en Guinée comme si vous y étiez
              </h2>
              <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Fini les frais cachés et les marges abusives des agences traditionnelles. Avec WestFlow, la conversion de vos Euros ou Dollars vers le Franc Guinéen s'effectue au taux moyen du marché BCRG en temps réel.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Livraison directe sur Orange Money Guinée, MTN MoMo ou compte bancaire.</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Retrait d'espèces immédiat par code OTP dans plus de 1,200 kiosques partenaires.</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Notification SMS instantanée pour le bénéficiaire à Conakry ou en région.</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Box */}
            <div className="lg:col-span-6">
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                  <span>Calculateur de Transfert</span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    Taux Garanti 24h
                  </span>
                </h3>

                <div className="space-y-4">
                  {/* You Send */}
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Vous envoyez</label>
                    <div className="flex items-center justify-between gap-4">
                      <input
                        type="number"
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(Math.max(1, parseInt(e.target.value) || 0))}
                        className={`w-full text-2xl font-black bg-transparent outline-none ${isDark ? 'text-white' : 'text-slate-900'}`}
                      />
                      <select
                        value={calcCurrency}
                        onChange={(e) => setCalcCurrency(e.target.value as any)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border outline-none ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="EUR">🇪🇺 EUR</option>
                        <option value="USD">🇺🇸 USD</option>
                        <option value="GBP">🇬🇧 GBP</option>
                      </select>
                    </div>
                  </div>

                  {/* Wise style calculation details */}
                  <div className={`px-4 py-3 rounded-xl text-xs space-y-2 font-mono ${isDark ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                    <div className="flex justify-between">
                      <span>Frais WestFlow :</span>
                      <span className="text-emerald-500 font-bold">0.00 {calcCurrency} (Offert)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux de change appliqué :</span>
                      <span className="font-bold">1 {calcCurrency} = {rates[calcCurrency].toLocaleString()} GNF</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800/40">
                      <span>Économie vs Agences classiques :</span>
                      <span className="text-emerald-400 font-bold">≈ {traditionalFee} {calcCurrency} économisés</span>
                    </div>
                  </div>

                  {/* Recipient Gets */}
                  <div className={`p-4 rounded-2xl border ${isDark ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-emerald-50/80 border-emerald-200'}`}>
                    <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">Le bénéficiaire reçoit en Guinée</label>
                    <div className="text-3xl font-black text-emerald-500">
                      {calculatedGNF.toLocaleString()} <span className="text-lg">GNF</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateLogin('diaspora')}
                    className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Envoyer Cet Montant Maintenant <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT TYPES / ECOSYSTEM PILLARS */}
      <section id="solutions" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Un Écosystème Adapté à Tous Vos Besoins</h2>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Choisissez le profil de compte qui correspond à votre activité pour accéder à un tableau de bord sur mesure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Particuliers */}
            <div
              onClick={() => onNavigateLogin('individual')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer group hover:-translate-y-1 shadow-md flex flex-col justify-between ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Particuliers (Guinée)</h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Portefeuille au quotidien, paiement de factures (EDG, SEG, Canal+), sous-comptes Jars d'épargne et retraits sans carte.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">
                <span>Accéder au Compte</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2. Diaspora */}
            <div
              onClick={() => onNavigateLogin('diaspora')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer group hover:-translate-y-1 shadow-md flex flex-col justify-between ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center justify-center mb-6">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Diaspora (Europe / USA)</h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Transferts vers Conakry & régions, compte multi-devises (EUR, USD, GBP), taux garanti et annuaire de bénéficiaires.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
                <span>Accéder au Compte</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. Entreprises */}
            <div
              onClick={() => onNavigateLogin('business')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer group hover:-translate-y-1 shadow-md flex flex-col justify-between ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/30 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Business & Payroll</h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Paiement automatisé des salaires par lot (Mobile Money/Banque), facturation B2B et encaissement QR Code marchand.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-bold text-purple-500 group-hover:translate-x-1 transition-transform">
                <span>Accéder au Compte</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 4. Agents */}
            <div
              onClick={() => onNavigateLogin('agent')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer group hover:-translate-y-1 shadow-md flex flex-col justify-between ${
                isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mb-6">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Agents & Kiosques USSD</h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Validation de codes de retrait hors-ligne (*155#), contrôle de sécurité anti-SIM Swap et gestion du float de trésorerie.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                <span>Accéder au Compte</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t py-12 transition-colors ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-sm">WF</div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">WestFlow Guinée © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold">
            <button onClick={() => onNavigateDemo('consumer')} className="hover:text-emerald-500">Portefeuille</button>
            <button onClick={() => onNavigateDemo('diaspora')} className="hover:text-emerald-500">Diaspora</button>
            <button onClick={() => onNavigateDemo('business')} className="hover:text-emerald-500">Business</button>
            <button onClick={() => onNavigateDemo('ussd')} className="hover:text-emerald-500">USSD (*155#)</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
