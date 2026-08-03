import React, { useState } from 'react';
import { BankCard } from '../../types';
import { Card3DCanvas } from './Card3DCanvas';
import { formatGNF } from '../../utils/formatters';
import {
  CreditCard,
  Plus,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Smartphone,
  Globe,
  DollarSign,
  AlertCircle,
  Copy,
  Check,
  MapPin,
  Settings,
  Flame,
  PlusCircle,
  RefreshCw,
  ShoppingBag,
  Tv,
} from 'lucide-react';

interface CardsPortalProps {
  cards: BankCard[];
  onUpdateCardStatus: (cardId: string, newStatus: BankCard['status']) => void;
  onToggleCardFeature: (cardId: string, feature: 'contactless' | 'online' | 'atm') => void;
  onCreateVirtualCard: (label: string, limitGNF: number, colorScheme: BankCard['colorScheme']) => void;
  onTriggerVoice: (key: string) => void;
  theme?: 'dark' | 'light';
}

export const CardsPortal: React.FC<CardsPortalProps> = ({
  cards,
  onUpdateCardStatus,
  onToggleCardFeature,
  onCreateVirtualCard,
  onTriggerVoice,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || 'card_physical_1');
  const [showSensitiveDetails, setShowSensitiveDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // New Virtual Card Modal
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardLabel, setNewCardLabel] = useState('Achats En Ligne & Subscriptions');
  const [newCardLimit, setNewCardLimit] = useState(2000000);
  const [newCardColor, setNewCardColor] = useState<BankCard['colorScheme']>('neon_violet');

  // Physical Card Order Modal
  const [showOrderPhysicalModal, setShowOrderPhysicalModal] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState('Conakry (Kaloum / Dixinn / Ratoma)');
  const [deliveryPhone, setDeliveryPhone] = useState('+224 628 45 12 90');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateVirtualCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardLabel) return;
    onCreateVirtualCard(newCardLabel, newCardLimit, newCardColor);
    setShowNewCardModal(false);
  };

  const handleOrderPhysicalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowOrderPhysicalModal(false);
    }, 2500);
  };

  // Mock card transaction logs
  const cardTransactions = [
    { id: 1, merchant: 'Netflix International', category: 'Abonnement', date: 'Aujourd\'hui, 14:20', amount: '120.000 GNF', icon: Tv },
    { id: 2, merchant: 'Supermarché Leader Price Dixinn', category: 'Achats physiques', date: 'Hier, 18:45', amount: '450.000 GNF', icon: ShoppingBag },
    { id: 3, merchant: 'Paiement En Ligne Canal+', category: 'Facture', date: '28 Fév 2026', amount: '220.000 GNF', icon: Zap },
    { id: 4, merchant: 'Guichet Automatique Ecobank Kaloum', category: 'Retrait DAB', date: '25 Fév 2026', amount: '500.000 GNF', icon: DollarSign },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div
        className={`border rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-xl ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-950 border-slate-800 text-white'
            : 'bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border-emerald-100 text-slate-900'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Cartes Visa & Mastercard WestFlow Guinée</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Gestion de Vos Cartes Physique & Virtuelles
            </h1>
            <p className={`text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Gérez votre carte physique Métal et créez jusqu'à 3 cartes virtuelles sécurisées pour vos abonnements et achats sur Internet, avec contrôle instantané des plafonds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowOrderPhysicalModal(true)}
              className={`px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Commander Carte Physique</span>
            </button>

            <button
              onClick={() => setShowNewCardModal(true)}
              disabled={cards.filter((c) => c.type === 'virtual').length >= 3}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer Carte Virtuelle (+ {3 - cards.filter((c) => c.type === 'virtual').length} dispo)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Card Selector + 3D Interactive Canvas + Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cards List Selection */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Vos Cartes Actives ({cards.length})
          </h3>

          <div className="space-y-3">
            {cards.map((card) => {
              const isSelected = card.id === selectedCardId;
              const isFrozen = card.status === 'frozen';

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? isDark
                        ? 'bg-slate-800/90 border-emerald-500 shadow-lg ring-1 ring-emerald-500/30'
                        : 'bg-emerald-50/80 border-emerald-500 shadow-md'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                      {card.type === 'physical' ? '💳 Physique Métal' : '🌐 Virtuelle'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFrozen
                          ? 'bg-amber-500/20 text-amber-500'
                          : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      {isFrozen ? '❄️ Gelée' : '✓ Active'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm mb-1">{card.label}</h4>
                  <p className="font-mono text-xs tracking-widest text-slate-400 mb-3">{card.cardNumber}</p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/40">
                    <span>Plafond Mensuel:</span>
                    <span className="font-bold text-emerald-400">{formatGNF(card.monthlyLimitGNF)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center/Right Column: 3D Render & Interactive Settings */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3D Card Display Showcase */}
          <div
            className={`border rounded-3xl p-6 relative overflow-hidden transition-all shadow-lg flex flex-col justify-between min-h-[380px] ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-medium">Aperçu 3D Interactif</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedCard.label}
                  <span className="text-xs text-emerald-400 font-mono">({selectedCard.type.toUpperCase()})</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSensitiveDetails(!showSensitiveDetails)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  }`}
                >
                  {showSensitiveDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSensitiveDetails ? 'Masquer Infos' : 'Révéler Numéro & CVV'}</span>
                </button>

                <button
                  onClick={() =>
                    onUpdateCardStatus(
                      selectedCard.id,
                      selectedCard.status === 'frozen' ? 'active' : 'frozen'
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCard.status === 'frozen'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                  }`}
                >
                  {selectedCard.status === 'frozen' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{selectedCard.status === 'frozen' ? 'Dégeler la carte' : 'Geler la carte'}</span>
                </button>
              </div>
            </div>

            {/* Three.js 3D Canvas Rendering Area */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full max-w-md h-[240px]">
                <Card3DCanvas card={selectedCard} isInteractive={true} />
              </div>
            </div>

            {/* Detailed Info Strip (Card Numbers, CVV, Expiry) */}
            <div className={`p-4 rounded-2xl border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-sans">Numéro de Carte</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-emerald-400 text-sm">
                    {showSensitiveDetails ? '4532 9102 8841 8892' : selectedCard.cardNumber}
                  </span>
                  <button
                    onClick={() => handleCopy('4532910288418892', 'card')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedField === 'card' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-sans">Date d'Expiration</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {selectedCard.expiryMonth} / {selectedCard.expiryYear}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-sans">Code Sécurité CVV</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-amber-400 text-sm">
                    {showSensitiveDetails ? selectedCard.cvv : '•••'}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedCard.cvv, 'cvv')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedField === 'cvv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card Features Controls & Spending Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature Toggles */}
            <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h4 className="font-bold text-sm uppercase text-slate-400 flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-500" /> Contrôles d'Utilisation
              </h4>

              <div className="space-y-3">
                {/* Toggle 1: Contactless */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold">Paiement Sans Contact (NFC)</div>
                      <div className="text-[10px] text-slate-400">Paiement rapide TPE jusqu'à 300.000 GNF</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleCardFeature(selectedCard.id, 'contactless')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      selectedCard.isContactlessEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950" />
                  </button>
                </div>

                {/* Toggle 2: Online Payments */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-bold">Achats sur Internet (E-commerce)</div>
                      <div className="text-[10px] text-slate-400">Autoriser abonnements SaaS & e-shops</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleCardFeature(selectedCard.id, 'online')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      selectedCard.isOnlinePaymentsEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950" />
                  </button>
                </div>

                {/* Toggle 3: ATM Withdrawals */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-bold">Retraits Guichets DAB (ATM)</div>
                      <div className="text-[10px] text-slate-400">Guichets Ecobank, UBA, Vista Bank</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleCardFeature(selectedCard.id, 'atm')}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      selectedCard.isAtmWithdrawalEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950" />
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Limit Tracker & Card Transactions */}
            <div className={`p-6 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm uppercase text-slate-400">Plafond Mensuel</h4>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {formatGNF(selectedCard.spentThisMonthGNF)} / {formatGNF(selectedCard.monthlyLimitGNF)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((selectedCard.spentThisMonthGNF / selectedCard.monthlyLimitGNF) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Dépenses: {Math.round((selectedCard.spentThisMonthGNF / selectedCard.monthlyLimitGNF) * 100)}%</span>
                  <span>Restant: {formatGNF(selectedCard.monthlyLimitGNF - selectedCard.spentThisMonthGNF)}</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="pt-2 border-t border-slate-800/60">
                <div className="text-xs font-bold text-slate-300 mb-2">Historique Récent par Carte</div>
                <div className="space-y-2">
                  {cardTransactions.map((tx) => {
                    const Icon = tx.icon;
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 text-xs">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <div>
                            <div className="font-bold">{tx.merchant}</div>
                            <div className="text-[10px] text-slate-500">{tx.date}</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-300">{tx.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW VIRTUAL CARD MODAL */}
      {showNewCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" /> Créer une Carte Virtuelle Instantanée
              </h3>
              <button onClick={() => setShowNewCardModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVirtualCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Nom / Libellé de la Carte</label>
                <input
                  type="text"
                  value={newCardLabel}
                  onChange={(e) => setNewCardLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ex: Abonnements SaaS, Voyage Europe..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Plafond de Dépenses Mensuel (GNF)</label>
                <input
                  type="number"
                  value={newCardLimit}
                  onChange={(e) => setNewCardLimit(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Style de la Carte Virtuelle</label>
                <select
                  value={newCardColor}
                  onChange={(e) => setNewCardColor(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="neon_violet">Violet Néon Digital</option>
                  <option value="dark_titanium">Titane Noir Métal</option>
                  <option value="deep_ocean">Bleu Océan Profond</option>
                  <option value="gold_emerald">Or & Émeraude Guinée</option>
                </select>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-bold text-emerald-400">Paiement 100% Sécurisé</div>
                <div>Générez un CVV dynamique et désactivez la carte à tout moment d'un simple clic.</div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
              >
                Générer la Carte Virtuelle
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER PHYSICAL CARD MODAL */}
      {showOrderPhysicalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> Commande de Carte Physique Métal
              </h3>
              <button onClick={() => setShowOrderPhysicalModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-emerald-300">Commande Enregistrée !</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Votre carte physique WestFlow Métal sera livrée à {deliveryCity} sous 48h par nos coursiers agréés.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOrderPhysicalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Adresse de Livraison (Guinée)</label>
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Téléphone de Contact</label>
                  <input
                    type="text"
                    value={deliveryPhone}
                    onChange={(e) => setDeliveryPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Frais d'émission & livraison :</span>
                    <span className="text-emerald-400">GRATUIT (Tier 2)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Puce EMV haute sécurité + paiement sans contact NFC.</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
                >
                  Confirmer la Commande
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
