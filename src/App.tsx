/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortalView, Dialect, Jar, Transaction, BankCard } from './types';
import { INITIAL_JARS, INITIAL_TRANSACTIONS, INITIAL_FX_RATES, INITIAL_CARDS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { VoiceGuidanceWidget } from './components/VoiceGuidanceWidget';
import { ConsumerPortal } from './components/consumer/ConsumerPortal';
import { DiasporaPortal } from './components/diaspora/DiasporaPortal';
import { BusinessPortal } from './components/business/BusinessPortal';
import { UssdSimulator } from './components/ussd/UssdSimulator';
import { CreditScorePortal } from './components/credit/CreditScorePortal';
import { CardsPortal } from './components/cards/CardsPortal';
import { SecurityCenter } from './components/security/SecurityCenter';
import { ArchitectureInspector } from './components/architecture/ArchitectureInspector';
import { HomePage } from './components/HomePage';
import { LoginPage, UserProfile, UserRole, DEMO_PROFILES } from './components/LoginPage';
import { playVoiceGuidance, stopVoiceGuidance } from './utils/audioSynthesizer';

type AppScreen = 'home' | 'login' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [loginRole, setLoginRole] = useState<UserRole>('individual');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [currentView, setCurrentView] = useState<PortalView>('consumer');
  const [isOnline, setIsOnline] = useState(true);
  const [currentDialect, setCurrentDialect] = useState<Dialect>('fr');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [jars, setJars] = useState<Jar[]>(INITIAL_JARS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cards, setCards] = useState<BankCard[]>(INITIAL_CARDS);

  const handleUpdateCardStatus = (cardId: string, newStatus: BankCard['status']) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c))
    );
  };

  const handleToggleCardFeature = (cardId: string, feature: 'contactless' | 'online' | 'atm') => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        if (feature === 'contactless') return { ...c, isContactlessEnabled: !c.isContactlessEnabled };
        if (feature === 'online') return { ...c, isOnlinePaymentsEnabled: !c.isOnlinePaymentsEnabled };
        if (feature === 'atm') return { ...c, isAtmWithdrawalEnabled: !c.isAtmWithdrawalEnabled };
        return c;
      })
    );
  };

  const handleCreateVirtualCard = (label: string, limitGNF: number, colorScheme: BankCard['colorScheme']) => {
    const newCard: BankCard = {
      id: `card_virtual_${Date.now()}`,
      type: 'virtual',
      cardholderName: (currentUser?.name || 'MAMADOU DIALLO').toUpperCase(),
      cardNumber: `4${Math.floor(1000 + Math.random() * 9000)} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryMonth: '12',
      expiryYear: '29',
      cvv: `${Math.floor(100 + Math.random() * 900)}`,
      status: 'active',
      monthlyLimitGNF: limitGNF,
      spentThisMonthGNF: 0,
      colorScheme,
      isContactlessEnabled: false,
      isOnlinePaymentsEnabled: true,
      isAtmWithdrawalEnabled: false,
      label,
    };
    setCards((prev) => [...prev, newCard]);
  };

  const mainJar = jars.find((j) => j.type === 'main') || jars[0];
  const offlineQueueCount = transactions.filter((t) => t.status === 'queued_offline').length;

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Voice Guidance Handler
  const handleTriggerVoice = (promptKey: string) => {
    setIsSpeaking(true);
    playVoiceGuidance(
      promptKey,
      currentDialect,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleStopSpeaking = () => {
    stopVoiceGuidance();
    setIsSpeaking(false);
  };

  // Add new transaction & update main jar balance
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    if (newTx.status === 'completed') {
      const isIncoming =
        newTx.type === 'diaspora_receive' || newTx.type === 'momo_cash_in' || newTx.type === 'p2p_receive';

      setJars((prevJars) =>
        prevJars.map((j) => {
          if (j.id === 'jar_main' || j.type === 'main') {
            const diff = isIncoming ? newTx.amountGNF : -(newTx.amountGNF + newTx.feeGNF);
            return { ...j, balanceGNF: Math.max(0, j.balanceGNF + diff) };
          }
          return j;
        })
      );
    }
  };

  // Transfer between jars
  const handleTransferBetweenJars = (fromJarId: string, toJarId: string, amount: number) => {
    setJars((prev) =>
      prev.map((j) => {
        if (j.id === fromJarId) return { ...j, balanceGNF: Math.max(0, j.balanceGNF - amount) };
        if (j.id === toJarId) return { ...j, balanceGNF: j.balanceGNF + amount };
        return j;
      })
    );
  };

  // Create new jar
  const handleCreateJar = (name: string, targetGNF: number, type: Jar['type']) => {
    const newJar: Jar = {
      id: `jar_${Date.now()}`,
      name,
      type,
      balanceGNF: 0,
      targetGNF,
      iconName: 'PiggyBank',
      color: 'from-emerald-600 to-teal-700',
    };
    setJars((prev) => [...prev, newJar]);
  };

  // Routing navigation helpers
  const handleGoToLogin = (role: UserRole = 'individual') => {
    setLoginRole(role);
    setScreen('login');
  };

  const handleGoToDemo = (view: PortalView = 'consumer') => {
    let matchedRole: UserRole = 'individual';
    if (view === 'diaspora') matchedRole = 'diaspora';
    else if (view === 'business') matchedRole = 'business';
    else if (view === 'ussd') matchedRole = 'agent';

    setCurrentUser(DEMO_PROFILES[matchedRole]);
    setCurrentView(view);
    setScreen('dashboard');
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    // Map role to primary portal view
    if (profile.role === 'individual') setCurrentView('consumer');
    else if (profile.role === 'diaspora') setCurrentView('diaspora');
    else if (profile.role === 'business') setCurrentView('business');
    else if (profile.role === 'agent') setCurrentView('ussd');

    setScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('home');
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-200 selection:bg-emerald-500 selection:text-slate-950 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 1. LANDING HOME PAGE */}
      {screen === 'home' && (
        <HomePage
          onNavigateLogin={handleGoToLogin}
          onNavigateDemo={handleGoToDemo}
          theme={theme}
          onToggleTheme={toggleTheme}
          currentDialect={currentDialect}
          onChangeDialect={setCurrentDialect}
          onTriggerVoice={handleTriggerVoice}
          isSpeaking={isSpeaking}
        />
      )}

      {/* 2. LOGIN PAGE */}
      {screen === 'login' && (
        <LoginPage
          initialRole={loginRole}
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => setScreen('home')}
          theme={theme}
          onToggleTheme={toggleTheme}
          currentDialect={currentDialect}
          onChangeDialect={setCurrentDialect}
          onTriggerVoice={handleTriggerVoice}
          isSpeaking={isSpeaking}
        />
      )}

      {/* 3. AUTHENTICATED ROLE-ADAPTED DASHBOARD */}
      {screen === 'dashboard' && (
        <>
          {/* Header Navigation */}
          <Navbar
            currentView={currentView}
            onSelectView={setCurrentView}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            offlineQueueCount={offlineQueueCount}
            currentDialect={currentDialect}
            onChangeDialect={setCurrentDialect}
            onTriggerVoice={handleTriggerVoice}
            isSpeaking={isSpeaking}
            theme={theme}
            onToggleTheme={toggleTheme}
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigateHome={() => setScreen('home')}
          />

          {/* Main Content Area - Spans ~85-90% of screen width */}
          <main className="w-full max-w-[92%] xl:max-w-[88%] mx-auto px-2 sm:px-4 pt-6">
            {currentView === 'consumer' && (
              <ConsumerPortal
                jars={jars}
                transactions={transactions}
                isOnline={isOnline}
                onAddTransaction={handleAddTransaction}
                onTransferBetweenJars={handleTransferBetweenJars}
                onCreateJar={handleCreateJar}
                onTriggerVoice={handleTriggerVoice}
                theme={theme}
              />
            )}

            {currentView === 'cards' && (
              <CardsPortal
                cards={cards}
                onUpdateCardStatus={handleUpdateCardStatus}
                onToggleCardFeature={handleToggleCardFeature}
                onCreateVirtualCard={handleCreateVirtualCard}
                onTriggerVoice={handleTriggerVoice}
                theme={theme}
              />
            )}

            {currentView === 'diaspora' && (
              <DiasporaPortal
                fxRates={INITIAL_FX_RATES}
                onAddTransaction={handleAddTransaction}
                onTriggerVoice={handleTriggerVoice}
                theme={theme}
              />
            )}

            {currentView === 'business' && (
              <BusinessPortal
                onAddTransaction={handleAddTransaction}
                onTriggerVoice={handleTriggerVoice}
                theme={theme}
              />
            )}

            {currentView === 'ussd' && (
              <UssdSimulator
                balanceGNF={mainJar.balanceGNF}
                onTriggerVoice={handleTriggerVoice}
                theme={theme}
              />
            )}

            {currentView === 'credit' && (
              <CreditScorePortal
                onAddTransaction={handleAddTransaction}
                onTriggerVoice={handleTriggerVoice}
                theme={theme}
              />
            )}

            {currentView === 'security' && <SecurityCenter theme={theme} />}

            {currentView === 'architecture' && <ArchitectureInspector theme={theme} />}
          </main>

          {/* Floating Localized Voice Guidance Control (VUI) */}
          <VoiceGuidanceWidget
            currentDialect={currentDialect}
            onChangeDialect={setCurrentDialect}
            isSpeaking={isSpeaking}
            onStopSpeaking={handleStopSpeaking}
            onSpeakWelcome={() => handleTriggerVoice('welcome')}
          />
        </>
      )}
    </div>
  );
}
