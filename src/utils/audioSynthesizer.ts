import { Dialect } from '../types';

export interface DialectInfo {
  code: Dialect;
  name: string;
  nativeName: string;
  description: string;
  flag: string;
}

export const DIALECTS: DialectInfo[] = [
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français (Guinée)',
    description: 'Langue officielle',
    flag: '🇬🇳',
  },
  {
    code: 'susu',
    name: 'Susu',
    nativeName: 'Soso xui (Basse Guinée)',
    description: 'Parlement de Conakry, Kindia, Forécariah',
    flag: '🌊',
  },
  {
    code: 'pular',
    name: 'Pular',
    nativeName: 'Pulaar (Moyenne Guinée)',
    description: 'Parlement de Labé, Pita, Mamou',
    flag: '🏔️',
  },
  {
    code: 'malinke',
    name: 'Malinke',
    nativeName: 'Maninkakan (Haute Guinée)',
    description: 'Parlement de Kankan, Siguiri, Nzérékoré',
    flag: '☀️',
  },
];

export const VOICE_PROMPTS_MAP: Record<string, Record<Dialect, string>> = {
  welcome: {
    fr: "Bienvenue sur WestFlow. Votre compte est sécurisé.",
    susu: "I nisi WestFlow ra. I xa koba fenyi raba.",
    pular: "Bisimilla maa e WestFlow. Ceede ma ko do doinaaki.",
    malinke: "I danbe WestFlow la. I ka wari be jiki la.",
  },
  check_balance: {
    fr: "Votre solde principal est de deux millions quatre cent cinquante mille Francs Guinéens.",
    susu: "I xa koba gbe na million firin keme naani tongo suwulu Francs Guinéens.",
    pular: "Mangu ceede ma ko miliyoŋaaji ɗiɗi e teemeɗɗe nayi e hoggirɗe jowi Francs Guinéens.",
    malinke: "I ka wari be miliyo fila kemi naani tan loolu Francs Guinéens.",
  },
  cashout_kiosk: {
    fr: "Code de retrait généré. Présentez ce code à 6 chiffres dans n'importe quel kiosque Orange Money.",
    susu: "I xa code xa fe ra. A fe 6 na tongo Orange Money kiosk ra.",
    pular: "Do ko koodu ngam heɓde ceede ma e kiosk Orange Money.",
    malinke: "I ka code sɔ̀rɔ̀. I ka bi 6 nin yira Orange Money kiosk la.",
  },
  p2p_success: {
    fr: "Transfert effectué avec succès sans aucun frais.",
    susu: "I xa transfer raba fenyi, mu faye mu na.",
    pular: "A neldi ceede ɗen no foti, tawi ala tayre.",
    malinke: "I ka wari lase nɔ̀ɔ̀rɔ̀ la, saara ti a la.",
  },
  sim_swap_safe: {
    fr: "Sécurité vérifiée. Votre carte SIM n'a subi aucun changement récent.",
    susu: "SIM card fenyi. Gbe mu maxandi.",
    pular: "Kartu SIM ma ko selluɗo, tawi ala waylo-waylo.",
    malinke: "I ka SIM card be jiki la, bayele ti kɛ a la.",
  },
  bulk_payroll: {
    fr: "Paiement de la paie entreprise traité pour tous les employés.",
    susu: "Walikɛɛ xa koba ra. Birin naxa sɔ̀rɔ̀.",
    pular: "Ceede gollotooɓe mben fow neldaama no moƴƴi.",
    malinke: "Baara kɛla lu ka sara la se ra fɛɛɛ.",
  },
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const playVoiceGuidance = (
  promptKey: string,
  dialect: Dialect,
  onStart?: () => void,
  onEnd?: () => void
) => {
  if (typeof window === 'undefined') return;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const promptObj = VOICE_PROMPTS_MAP[promptKey] || VOICE_PROMPTS_MAP['welcome'];
    const textToSpeak = promptObj[dialect] || promptObj['fr'];

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Tune pitch & speed for natural warmth
    if (dialect === 'fr') {
      utterance.lang = 'fr-FR';
      utterance.rate = 0.95;
    } else {
      // For African dialects without native browser TTS voices, use French or English phonetics with relaxed rate
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } else {
    if (onStart) onStart();
    setTimeout(() => {
      if (onEnd) onEnd();
    }, 2000);
  }
};

export const stopVoiceGuidance = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
