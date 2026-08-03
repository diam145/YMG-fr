import React, { useState } from 'react';
import { PayrollEmployee, Transaction } from '../../types';
import { INITIAL_PAYROLL_EMPLOYEES } from '../../data/mockData';
import { formatGNF, generateRef } from '../../utils/formatters';
import {
  Building2,
  Users,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Download,
  ShieldCheck,
  CreditCard,
  FileText,
  Sparkles,
  Search,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface BusinessPortalProps {
  onAddTransaction: (tx: Transaction) => void;
  onTriggerVoice: (key: string) => void;
  theme?: 'dark' | 'light';
}

export const BusinessPortal: React.FC<BusinessPortalProps> = ({
  onAddTransaction,
  onTriggerVoice,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [employees, setEmployees] = useState<PayrollEmployee[]>(INITIAL_PAYROLL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);
  const [payrollSuccess, setPayrollSuccess] = useState(false);

  // New Employee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('+224 ');
  const [newEmpDept, setNewEmpDept] = useState('Opérations');
  const [newEmpSalary, setNewEmpSalary] = useState('4000000');
  const [newEmpMethod, setNewEmpMethod] = useState<PayrollEmployee['paymentMethod']>('orange_money');

  // Corporate treasury balances
  const [treasuryBalance, setTreasuryBalance] = useState(185000000); // 185M GNF
  const totalPayrollCost = employees.reduce((acc, emp) => acc + emp.salaryGNF, 0);

  // Corporate sub-accounts / department wallets
  const [subAccounts, setSubAccounts] = useState([
    { id: 'sub_1', name: 'Flotte Véhicules & Carburant Total', balanceGNF: 25000000, code: 'SUB-FLOTTE-01' },
    { id: 'sub_2', name: 'Achats Fournisseurs Marché Madina', balanceGNF: 45000000, code: 'SUB-MADINA-02' },
    { id: 'sub_3', name: 'Caisse Menue Dépenses Kaloum', balanceGNF: 12000000, code: 'SUB-KALOUM-03' },
  ]);

  // Supplier Invoices queue
  const [invoices, setInvoices] = useState([
    { id: 'inv_101', supplier: 'SOGEA-SATOM Guinée', concept: 'Livraison Matériaux Chantier Kipé', amountGNF: 18500000, status: 'en_attente', dueDate: '10 Aout 2026' },
    { id: 'inv_102', supplier: 'TotalEnergies Guinée S.A.', concept: 'Cartes Carburant Mensuelles', amountGNF: 8200000, status: 'payee', dueDate: '01 Aout 2026' },
  ]);

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm)
  );

  const handleRunPayroll = () => {
    if (treasuryBalance < totalPayrollCost) return;

    setIsProcessingPayroll(true);
    setTimeout(() => {
      // Execute atomic payroll disbursement
      employees.forEach((emp) => {
        const tx: Transaction = {
          id: `tx_pay_${Date.now()}_${emp.id}`,
          reference: generateRef('WF-PAYROLL'),
          type: 'payroll_payout',
          amountGNF: emp.salaryGNF,
          feeGNF: 0,
          senderName: 'Soguipah Guinée S.A. (Entreprise)',
          recipientName: emp.fullName,
          recipientPhone: emp.phone,
          recipientMethod:
            emp.paymentMethod === 'westflow_wallet'
              ? 'wallet'
              : emp.paymentMethod === 'orange_money'
              ? 'orange_money'
              : emp.paymentMethod === 'mtn_momo'
              ? 'mtn_momo'
              : 'kiosk_code',
          status: 'completed',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: `Salaire Juillet 2026 - Département ${emp.department}`,
        };
        onAddTransaction(tx);
      });

      setTreasuryBalance((prev) => prev - totalPayrollCost);
      setIsProcessingPayroll(false);
      setPayrollSuccess(true);
      onTriggerVoice('bulk_payroll');
    }, 1500);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const salary = parseInt(newEmpSalary, 10);
    if (!salary || salary <= 0) return;

    const newEmp: PayrollEmployee = {
      id: `emp_${Date.now()}`,
      fullName: newEmpName,
      phone: newEmpPhone,
      department: newEmpDept,
      salaryGNF: salary,
      paymentMethod: newEmpMethod,
      status: 'active',
      lastPaidDate: 'N/A',
    };

    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setNewEmpName('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Corporate Dashboard Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-bold rounded-full border border-teal-500/40 inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Portal Business B2B & Paie Entreprise
              </span>
              <span className="text-xs text-slate-400">Raison Sociale: Soguipah S.A. Conakry</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black">Trésorerie & Traitement de la Paie</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Disbursement massif de salaires en un clic vers portefeuilles WestFlow, Orange Money, MTN MoMo ou SMS Kiosque pour employés non banquarisés.
            </p>
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-teal-500/30 text-right space-y-1">
            <span className="text-xs text-slate-400 font-medium">Compte Trésorerie Ecobank Conakry</span>
            <div className="text-3xl font-black text-teal-400">{formatGNF(treasuryBalance)}</div>
            <span className="text-[10px] text-emerald-400 font-bold block">0.0% MDR Frais sur Payroll</span>
          </div>
        </div>
      </div>

      {/* Corporate Payroll Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" /> Module de Paie Massif (Bulk Payroll API)
            </h3>
            <p className="text-xs text-slate-400">
              {employees.length} employés actifs • Coût total mensuel: <strong className="text-white">{formatGNF(totalPayrollCost)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Ajouter Employé
            </button>

            <button
              onClick={handleRunPayroll}
              disabled={isProcessingPayroll}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessingPayroll ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Traitement Ledger Go...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Exécuter la Paie ({formatGNF(totalPayrollCost)})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un employé par nom, téléphone ou département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Employee Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Employé</th>
                <th className="p-3">Département</th>
                <th className="p-3">Téléphone</th>
                <th className="p-3">Canal de Paiement</th>
                <th className="p-3 text-right">Salaire (GNF)</th>
                <th className="p-3 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">{emp.fullName}</td>
                  <td className="p-3 text-slate-300">{emp.department}</td>
                  <td className="p-3 font-mono text-slate-300">{emp.phone}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        emp.paymentMethod === 'westflow_wallet'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : emp.paymentMethod === 'orange_money'
                          ? 'bg-orange-500/20 text-orange-300'
                          : emp.paymentMethod === 'sms_kiosk_code'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {emp.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-teal-300">{formatGNF(emp.salaryGNF)}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                      ACTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Corporate Operational Sub-Accounts & B2B Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Sub-Wallets */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-extrabold text-sm text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" /> Sous-Comptes & Portefeuilles Départements
            </h4>
            <span className="text-xs text-slate-400 font-mono">3 Départements</span>
          </div>
          <p className="text-xs text-slate-300">
            Isolez la trésorerie de vos équipes pour la gestion du carburant, des achats Madina et de la petite caisse.
          </p>

          <div className="space-y-3">
            {subAccounts.map((sub) => (
              <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white">{sub.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{sub.code}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-sm text-teal-400 font-mono">{formatGNF(sub.balanceGNF)}</div>
                  <span className="text-[10px] text-emerald-400 font-bold">Plafond illimité</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B2B Supplier Invoices Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-extrabold text-sm text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Queue de Règlement Factures Fournisseurs B2B
            </h4>
            <span className="text-xs text-slate-400 font-mono">2 Factures</span>
          </div>
          <p className="text-xs text-slate-300">
            Validez et réglez vos fournisseurs SOGEA, TotalEnergies, EDG Guinée directement par virement certifié BCRG.
          </p>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white">{inv.supplier}</div>
                  <div className="text-[10px] text-slate-400">{inv.concept}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Échéance: {inv.dueDate}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-extrabold text-xs text-white font-mono">{formatGNF(inv.amountGNF)}</div>
                  {inv.status === 'en_attente' ? (
                    <button
                      onClick={() => {
                        setInvoices((prev) =>
                          prev.map((i) => (i.id === inv.id ? { ...i, status: 'payee' } : i))
                        );
                        const tx: Transaction = {
                          id: `tx_inv_${Date.now()}`,
                          reference: generateRef('WF-B2B'),
                          type: 'bill_payment',
                          amountGNF: inv.amountGNF,
                          feeGNF: 0,
                          senderName: 'Soguipah S.A.',
                          recipientName: inv.supplier,
                          status: 'completed',
                          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                          note: `Règlement B2B Facture #${inv.id}`,
                        };
                        onAddTransaction(tx);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] rounded-lg transition-all"
                    >
                      Régler
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      ✓ Payée
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Merchant Payment Acceptance (QR & POS Terminal) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Merchant QR Code Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
          <h4 className="font-extrabold text-sm text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-5 h-5" /> QR Code Marchand Statique & Dynamique
          </h4>
          <p className="text-xs text-slate-300">
            Imprimez ce QR Code pour votre boutique à Kaloum ou Madina. Les clients scannent et vous payent en 1 seconde sans aucun frais de gestion.
          </p>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl">
              <div className="w-32 h-32 bg-slate-950 p-2 flex flex-col items-center justify-center text-center">
                <QrCode className="w-20 h-20 text-teal-400" />
                <span className="text-[8px] font-mono text-white mt-1">SOGUIPAH-MERCHANT-GN</span>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400">Identifiant Marchand BCRG: <span className="text-teal-400 font-bold">MERCHANT-GN-88102</span></div>
          </div>
        </div>

        {/* Corporate Maker / Checker Dual Governance */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
          <h4 className="font-extrabold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Gouvernance Corporate Maker / Checker
          </h4>
          <p className="text-xs text-slate-300">
            Conformité BCRG: Toutes les opérations de virement supérieures à <strong className="text-white">10,000,000 GNF</strong> nécessitent la double validation du Directeur Financier et de l'Administrateur.
          </p>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Validation Virement Ecobank (45M GNF)</div>
                <div className="text-slate-400 text-[10px]">Demandé par Comptable A. Sylla</div>
              </div>
              <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded font-bold text-[10px]">
                En attente 2nde Signature
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Employee */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" /> Nouveau Salarié
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Nom Complèt</label>
                <input
                  type="text"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Téléphone Guinée</label>
                <input
                  type="text"
                  value={newEmpPhone}
                  onChange={(e) => setNewEmpPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Département</label>
                <input
                  type="text"
                  value={newEmpDept}
                  onChange={(e) => setNewEmpDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Canal de Paiement Souhaité</label>
                <select
                  value={newEmpMethod}
                  onChange={(e) => setNewEmpMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="orange_money">Orange Money Guinée</option>
                  <option value="westflow_wallet">WestFlow Portefeuille App</option>
                  <option value="mtn_momo">MTN Mobile Money Guinée</option>
                  <option value="sms_kiosk_code">SMS Code Kiosque (Non Banquarisé)</option>
                  <option value="bank_account">Compte Bancaire Ecobank / Vista</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Salaire Mensuel Net (GNF)</label>
                <input
                  type="number"
                  value={newEmpSalary}
                  onChange={(e) => setNewEmpSalary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-lg font-bold text-teal-400 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
              >
                Enregistrer l'Employé
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
