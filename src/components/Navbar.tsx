import React, { useState } from 'react';
import { PortalView, Dialect } from '../types';
import { UserProfile } from './LoginPage';
import {
  Wallet,
  Globe2,
  Building2,
  Phone,
  ShieldCheck,
  Code2,
  Volume2,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  LogOut,
  Home,
  Store,
  Award,
  CreditCard,
  Menu,
  X,
  ChevronRight,
  Check,
} from 'lucide-react';

interface NavbarProps {
  currentView: PortalView;
  onSelectView: (view: PortalView) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  offlineQueueCount: number;
  currentDialect: Dialect;
  onChangeDialect: (dialect: Dialect) => void;
  onTriggerVoice: (key: string) => void;
  isSpeaking: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  isOnline,
  onToggleOnline,
  offlineQueueCount,
  currentDialect,
  onChangeDialect,
  onTriggerVoice,
  isSpeaking,
  theme,
  onToggleTheme,
  currentUser,
  onLogout,
  onNavigateHome,
}) => {
  const isDark = theme === 'dark';
  const userRole = currentUser?.role || 'individual';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Build role-tailored navigation tabs
  const getNavItems = () => {
    const items: { view: PortalView; label: string; icon: any }[] = [];

    if (userRole === 'individual') {
      items.push({ view: 'consumer', label: 'Portefeuille & Jars', icon: Wallet });
      items.push({ view: 'cards', label: 'Cartes', icon: CreditCard });
      items.push({ view: 'credit', label: 'Score Crédit', icon: Award });
      items.push({ view: 'ussd', label: 'USSD (*155#)', icon: Phone });
    } else if (userRole === 'diaspora') {
      items.push({ view: 'diaspora', label: 'Diaspora Transfert', icon: Globe2 });
      items.push({ view: 'cards', label: 'Cartes', icon: CreditCard });
      items.push({ view: 'consumer', label: 'Portefeuille', icon: Wallet });
      items.push({ view: 'credit', label: 'Score Crédit', icon: Award });
    } else if (userRole === 'business') {
      items.push({ view: 'business', label: 'Business & Paie', icon: Building2 });
      items.push({ view: 'cards', label: 'Cartes Corporate', icon: CreditCard });
      items.push({ view: 'consumer', label: 'Portefeuille Business', icon: Wallet });
    } else if (userRole === 'agent') {
      items.push({ view: 'ussd', label: 'Kiosque Agent (*155#)', icon: Phone });
      items.push({ view: 'consumer', label: 'Portefeuille Agent', icon: Wallet });
      items.push({ view: 'cards', label: 'Cartes', icon: CreditCard });
    } else {
      items.push({ view: 'consumer', label: 'Portefeuille', icon: Wallet });
      items.push({ view: 'cards', label: 'Cartes', icon: CreditCard });
    }

    // Common system tabs
    items.push({ view: 'security', label: 'Sécurité', icon: ShieldCheck });
    items.push({ view: 'architecture', label: 'Ledger Go', icon: Code2 });

    return items;
  };

  const navItems = getNavItems();

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900 backdrop-blur-md'
      }`}
    >
      {/* Top Bar: Live FX Ticker & Network Status & Theme Toggle */}
      <div
        className={`px-4 py-1.5 text-xs border-b flex flex-wrap items-center justify-between gap-2 ${
          isDark ? 'bg-slate-950/80 border-slate-800/80 text-slate-300' : 'bg-slate-100/90 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Taux BCRG:
          </span>
          <span className={`px-2 py-0.5 rounded border text-[11px] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
            1 EUR = <strong>9,450 GNF</strong>
          </span>
          <span className={`px-2 py-0.5 rounded border text-[11px] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
            1 USD = <strong>8,620 GNF</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                : 'bg-slate-200 hover:bg-slate-300 text-indigo-900 border border-slate-300'
            }`}
            title="Changer de thème (Clair / Sombre)"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Mode Clair</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Mode Sombre</span>
              </>
            )}
          </button>

          {/* Online/Offline Toggle */}
          <button
            onClick={onToggleOnline}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              isOnline
                ? isDark
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-amber-950 text-amber-300 border border-amber-700/50 hover:bg-amber-900 animate-pulse'
            }`}
            title="Basculez le réseau pour tester le mode hors-ligne"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">En Ligne</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span>Hors-Ligne ({offlineQueueCount})</span>
              </>
            )}
          </button>

          {/* VUI Voice Guidance Trigger Button */}
          <button
            onClick={() => onTriggerVoice('welcome')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              isSpeaking
                ? 'bg-purple-600 text-white ring-2 ring-purple-400 animate-bounce'
                : isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
            }`}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin text-white' : 'text-purple-500'}`} />
            <span className="hidden sm:inline">Guide Vocal</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="w-full max-w-[92%] xl:max-w-[88%] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={onNavigateHome}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md ring-1 ring-white/20 shrink-0">
              <span className="font-extrabold text-slate-950 text-lg sm:text-xl tracking-tighter">WF</span>
            </div>
            {/* Mobile flag badge */}
            <span className="sm:hidden bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              🇬🇳
            </span>
            {/* Desktop Brand Details */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  West<span className="text-emerald-500">Flow</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  GUINÉE 🇬🇳
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Services Financiers & Transfert
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => onSelectView(item.view)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile Summary & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2.5">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
                title="Page d'accueil"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Accueil</span>
              </button>
            )}

            <div className="hidden sm:block text-right">
              <div className={`text-xs font-bold flex items-center justify-end gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentUser ? currentUser.name : 'Mamadou Diallo'}
                <span className="w-2 h-2 rounded-full bg-emerald-500" title={currentUser?.tier || 'Tier 2 Vérifié'} />
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold tracking-tight">
                {userRole === 'individual'
                  ? 'Particulier (Tier 2)'
                  : userRole === 'business'
                  ? 'Compte PME / Paie'
                  : userRole === 'diaspora'
                  ? 'Diaspora Europe'
                  : 'Kiosque Agent'}
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className={`hidden sm:flex p-2 rounded-xl text-xs font-bold transition-all border ${
                  isDark
                    ? 'bg-rose-950/40 border-rose-800/50 text-rose-300 hover:bg-rose-900/60'
                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                }`}
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden w-9 h-9 p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                isMobileMenuOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md'
                  : isDark
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
              }`}
              aria-label="Menu de Navigation"
              title="Menu de Navigation"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Hamburger Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/80 animate-in slide-in-from-top-2 duration-200 pb-3 pt-2">
            <div
              className={`p-4 rounded-2xl border space-y-4 shadow-2xl ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/50">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Menu className="w-3.5 h-3.5" /> Navigation & Portails
                  </span>
                  <div className="text-xs font-extrabold text-slate-200">
                    Sélectionnez une fonctionnalité
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {userRole === 'individual'
                    ? 'Particulier'
                    : userRole === 'business'
                    ? 'PME / Business'
                    : userRole === 'diaspora'
                    ? 'Diaspora'
                    : 'Kiosque Agent'}
                </span>
              </div>

              {/* Navigation Options List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        onSelectView(item.view);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                          : isDark
                          ? 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? 'bg-slate-950/20 text-slate-950'
                              : isDark
                              ? 'bg-slate-800 text-emerald-400'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-extrabold">{item.label}</span>
                      </div>
                      {isActive ? (
                        <Check className="w-4 h-4 text-slate-950 font-black" />
                      ) : (
                        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions Footer */}
              <div className={`pt-3 border-t grid grid-cols-2 gap-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                {onNavigateHome && (
                  <button
                    onClick={() => {
                      onNavigateHome();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <Home className="w-4 h-4 text-emerald-500" />
                    <span>Accueil</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      isDark
                        ? 'bg-rose-950/40 border-rose-800/50 text-rose-300 hover:bg-rose-900/60'
                        : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Déconnexion</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
