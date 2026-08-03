export type PortalView =
  | 'consumer'
  | 'diaspora'
  | 'business'
  | 'ussd'
  | 'credit'
  | 'cards'
  | 'security'
  | 'architecture';

export interface BankCard {
  id: string;
  type: 'physical' | 'virtual';
  cardholderName: string;
  cardNumber: string; // e.g. "4532 •••• •••• 8892"
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  status: 'active' | 'frozen' | 'blocked';
  monthlyLimitGNF: number;
  spentThisMonthGNF: number;
  colorScheme: 'gold_emerald' | 'dark_titanium' | 'deep_ocean' | 'neon_violet';
  isContactlessEnabled: boolean;
  isOnlinePaymentsEnabled: boolean;
  isAtmWithdrawalEnabled: boolean;
  label: string; // e.g. "Carte Principale Visa Metal", "Abonnements Netflix & SaaS", "Achats Madina"
}

export interface RecurrentPayment {
  id: string;
  title: string;
  billerName: string;
  amountGNF: number;
  frequency: 'monthly' | 'weekly' | 'quarterly';
  nextDueDate: string;
  autoPayEnabled: boolean;
  category: 'edg_electricity' | 'seg_water' | 'canal_plus' | 'school' | 'jar_auto' | 'custom';
  accountNumber: string;
}

export type Dialect = 'fr' | 'susu' | 'pular' | 'malinke';

export interface Jar {
  id: string;
  name: string;
  type: 'main' | 'savings' | 'travel' | 'goal' | 'emergency';
  balanceGNF: number;
  targetGNF?: number;
  iconName: string;
  color: string;
  autoSavePercent?: number;
}

export type TransactionType =
  | 'p2p_send'
  | 'p2p_receive'
  | 'diaspora_receive'
  | 'momo_cash_in'
  | 'momo_cash_out'
  | 'bank_deposit'
  | 'bank_withdraw'
  | 'bill_payment'
  | 'airtime'
  | 'kiosk_otp_withdraw'
  | 'payroll_payout'
  | 'merchant_qr_pay';

export type TransactionStatus = 'completed' | 'pending' | 'queued_offline' | 'quarantined_sim_swap' | 'failed';

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  amountGNF: number;
  amountForeign?: number;
  currencyForeign?: string;
  feeGNF: number;
  senderName: string;
  senderPhone?: string;
  recipientName: string;
  recipientPhone?: string;
  recipientMethod?: 'wallet' | 'orange_money' | 'mtn_momo' | 'ecobank' | 'vista_bank' | 'kiosk_code';
  status: TransactionStatus;
  timestamp: string;
  jarId?: string;
  note?: string;
  otpCode?: string;
  otpExpiresAt?: string;
  simSwapChecked?: boolean;
}

export interface FxRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number; // e.g. 1 EUR = 9450 GNF
  feePercentage: number;
  spreadPercent: number;
}

export interface PayrollEmployee {
  id: string;
  fullName: string;
  phone: string;
  department: string;
  salaryGNF: number;
  paymentMethod: 'westflow_wallet' | 'orange_money' | 'mtn_momo' | 'bank_account' | 'sms_kiosk_code';
  bankAccountNumber?: string;
  status: 'active' | 'paused';
  lastPaidDate?: string;
}

export interface KycStatus {
  tier: 1 | 2 | 3;
  fullName: string;
  phone: string;
  nationalIdNumber?: string;
  idVerified: boolean;
  livenessVerified: boolean;
  dailyLimitGNF: number;
  monthlyLimitGNF: number;
}

export interface SimSwapCheckResult {
  phone: string;
  swappedLast48Hours: boolean;
  swapTimestamp?: string;
  carrier: 'Orange Guinea' | 'MTN Guinea' | 'Cellcom';
  riskScore: 'LOW' | 'HIGH' | 'CRITICAL';
  actionTaken: 'ALLOW' | 'MFA_REQUIRED' | 'QUARANTINE';
}

export interface VoicePrompt {
  id: string;
  key: string;
  fr: string;
  susu: string;
  pular: string;
  malinke: string;
  audioDurationSec?: number;
}
