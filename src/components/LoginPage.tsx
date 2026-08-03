import React, { useState } from 'react';
import {
  Wallet,
  Globe2,
  Building2,
  Store,
  ShieldCheck,
  Lock,
  Phone,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { Dialect } from '../types';

export type UserRole = 'individual' | 'diaspora' | 'business' | 'agent';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  location: string;
  tier: string;
  avatarUrl?: string;
}

interface LoginPageProps {
  initialRole?: UserRole;
  onLoginSuccess: (profile: UserProfile) => void;
  onBackToHome: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentDialect: Dialect;
  onChangeDialect: (dialect: Dialect) => void;
  onTriggerVoice: (key: string) => void;
  isSpeaking: boolean;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  individual: {
    id: 'usr_individual_01',
    name: 'Mamadou Diallo',
    role: 'individual',
    phone: '+224 628 45 12 90',
    email: 'mamadou.diallo@westflow.gn',
    location: 'Conakry, Kaloum 🇬🇳',
    tier: 'Tier 2 VÉRIFIÉ',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  diaspora: {
    id: 'usr_diaspora_01',
    name: 'Kadiatou Bah',
    role: 'diaspora',
    phone: '+33 6 12 34 56 78',
    email: 'kadiatou.bah@westflow.eu',
    location: 'Paris, France 🇫🇷',
    tier: 'Diaspora Premium',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
  },
  business: {
    id: 'usr_business_01',
    name: 'Conakry Logistics SARL',
    role: 'business',
    phone: '+224 620 99 88 77',
    email: 'contact@conakry-logistics.gn',
    location: 'Zone Industrielle Matoto 🇬🇳',
    tier: 'B2B Enterprise',
    avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80',
  },
  agent: {
    id: 'usr_agent_01',
    name: 'Kiosque Kaloum #402',
    role: 'agent',
    phone: '+224 622 11 22 33',
    email: 'kiosque.402@westflow.gn',
    location: 'Avenue de la République, Kaloum 🇬🇳',
    tier: 'Agent Agrée BCRG',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
};

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'individual',
  onLoginSuccess,
  onBackToHome,
  theme,
  onToggleTheme,
  currentDialect,
  onChangeDialect,
  onTriggerVoice,
  isSpeaking,
}) => {
  const isDark = theme === 'dark';
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [phoneInput, setPhoneInput] = useState(DEMO_PROFILES[initialRole].phone);
  const [pinInput, setPinInput] = useState('1234');
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setPhoneInput(DEMO_PROFILES[role].phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(DEMO_PROFILES[selectedRole]);
  };

  const handleQuickLogin = (role: UserRole) => {
    onLoginSuccess(DEMO_PROFILES[role]);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Header */}
      <header className={`border-b px-4 py-3 flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
        <button
          onClick={onBackToHome}
          className={`flex items-center gap-2 text-xs font-bold transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </button>

        <div className="flex items-center gap-3">
          {/* Dialect Voice Assistant button */}
          <button
            onClick={() => onTriggerVoice('welcome')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                : isDark
                ? 'bg-slate-800 text-purple-300 border border-purple-500/30'
                : 'bg-purple-100 text-purple-800 border border-purple-300'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instruction Vocale ({currentDialect.toUpperCase()})</span>
          </button>

          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-full transition-all ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-indigo-900'}`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Login Card Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8 my-auto">
        <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {/* Brand & Heading */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 mx-auto flex items-center justify-center shadow-md">
              <span className="font-black text-slate-950 text-2xl tracking-tighter">WF</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Espace de Connexion</h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Accédez à votre compte sécurisé WestFlow Guinée
            </p>
          </div>

          {/* Account Role Tabs */}
          <div className="mb-6">
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Type de Compte
            </label>
            <div className={`grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                type="button"
                onClick={() => handleRoleChange('individual')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'individual'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Particulier</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('diaspora')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'diaspora'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Diaspora</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('business')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'business'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Entreprise</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('agent')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'agent'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Agent USSD</span>
              </button>
            </div>
          </div>

          {/* Form inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedRole === 'business' ? 'Identifiant Entreprise / Téléphone' : 'Numéro de Téléphone (Mobile Money)'}
              </label>
              <div className="relative">
                <Phone className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="+224 6XX XX XX XX"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Code PIN de Sécurité (4 chiffres)
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono tracking-widest focus:outline-none focus:border-emerald-500 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Rester connecté</span>
              </label>
              <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-emerald-500 hover:underline font-semibold">
                PIN Oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Se Connecter à l'Espace <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800/40 space-y-3">
            <p className={`text-[11px] font-bold uppercase tracking-wider text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              ⚡ Connexion Rapide Démo (1 Clic)
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleQuickLogin('individual')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isDark
                    ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Mamadou Diallo (Particulier Guinée)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">+224 628</span>
              </button>

              <button
                onClick={() => handleQuickLogin('diaspora')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isDark
                    ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Kadiatou Bah (Diaspora Paris)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">+33 6</span>
              </button>

              <button
                onClick={() => handleQuickLogin('business')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isDark
                    ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Conakry Logistics (Business & Paie)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">B2B</span>
              </button>

              <button
                onClick={() => handleQuickLogin('agent')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  isDark
                    ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Kiosque Kaloum #402 (Agent USSD)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">*155#</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Security Disclaimer Footer */}
      <footer className="py-4 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Connexion sécurisée SSL 256-bit • Régulation Banque Centrale de la République de Guinée (BCRG)</span>
        </div>
      </footer>
    </div>
  );
};
