export const formatGNF = (amount: number): string => {
  return new Intl.NumberFormat('fr-GN', {
    style: 'currency',
    currency: 'GNF',
    maximumFractionDigits: 0,
  }).format(amount).replace('GNF', 'GNF');
};

export const formatCurrency = (amount: number, currency: string): string => {
  if (currency === 'GNF') return formatGNF(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPhoneGN = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('224')) {
    const num = cleaned.slice(3);
    if (num.length === 9) {
      return `+224 ${num.slice(0, 3)} ${num.slice(3, 5)} ${num.slice(5, 7)} ${num.slice(7)}`;
    }
  }
  if (cleaned.length === 9) {
    return `+224 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

export const detectCarrier = (phone: string): 'Orange Money' | 'MTN MoMo' | 'Cellcom' | 'Unknown' => {
  const num = phone.replace(/\D/g, '');
  const localNum = num.startsWith('224') ? num.slice(3) : num;
  if (localNum.startsWith('62') || localNum.startsWith('61')) return 'Orange Money';
  if (localNum.startsWith('66') || localNum.startsWith('65')) return 'MTN MoMo';
  if (localNum.startsWith('63')) return 'Cellcom';
  return 'Orange Money';
};

export const generateRef = (prefix = 'WF'): string => {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 8; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${random}`;
};

export const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
