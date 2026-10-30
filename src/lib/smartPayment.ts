/**
 * Smart Payment Logic for Baraa Restaurant
 * Features:
 * - Auto-detects carrier / mobile wallet from customer's phone number (EVC Plus, Zaad, Sahal, eDahab)
 * - Dynamic USSD code generation tailored to selected provider and exact order amount
 * - One-click USSD dialing (tel:*712*...) and 1-click clipboard copy
 * - Transaction ID verification tracking for confirmed payments
 * - Support for Cash on Delivery and Premier Wallet
 */

export const RESTAURANT_MERCHANT_NUMBER = '771909054';
export const RESTAURANT_MERCHANT_NAME = 'Baraa Restaurant';

export type PaymentMethodId = 'EVC Plus' | 'Zaad' | 'Sahal' | 'eDahab' | 'Premier Wallet' | 'Cash on Delivery';

/**
 * Returns integer amount string safe for USSD dialers (phone keypads cannot dial decimals)
 */
export function formatUssdAmount(amount: number): string {
  if (!amount || amount <= 0) return '1';
  if (amount % 1 === 0) return amount.toString();
  // Round up to nearest whole USD to ensure valid USSD syntax
  return Math.ceil(amount).toString();
}

export interface PaymentOption {
  id: PaymentMethodId;
  name: string;
  provider: string;
  badge: string;
  merchantNumber: string;
  ussdPrefix: string;
  ussdTemplate: (merchant: string, amount: number) => string;
  promptUssd: (merchant: string) => string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    activeRing: string;
    badgeBg: string;
  };
  prefixes: string[]; // e.g., ['61', '77', '68']
  description: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'EVC Plus',
    name: 'EVC Plus (Hormuud)',
    provider: 'Hormuud Telecom',
    badge: 'Ugu Caansan (Popular)',
    merchantNumber: RESTAURANT_MERCHANT_NUMBER,
    ussdPrefix: '*712*',
    ussdTemplate: (merchant, amount) => {
      const amtStr = formatUssdAmount(amount);
      return `*712*${merchant}*${amtStr}#`;
    },
    promptUssd: (merchant) => `*712*${merchant}#`,
    themeColor: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      activeRing: 'ring-emerald-500 border-emerald-500 bg-emerald-50/90',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    prefixes: ['61', '68', '77', '69', '71'],
    description: 'Toos ugu bixi EVC Plus lambarka 771909054',
  },
  {
    id: 'Zaad',
    name: 'Zaad Service (Telesom)',
    provider: 'Telesom',
    badge: 'Telesom',
    merchantNumber: RESTAURANT_MERCHANT_NUMBER,
    ussdPrefix: '*888*',
    ussdTemplate: (merchant, amount) => {
      const amtStr = formatUssdAmount(amount);
      return `*888*${merchant}*${amtStr}#`;
    },
    promptUssd: (merchant) => `*888*${merchant}#`,
    themeColor: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      activeRing: 'ring-amber-500 border-amber-500 bg-amber-50/90',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    prefixes: ['63', '67'],
    description: 'Toos ugu bixi Zaad Service lambarka 771909054',
  },
  {
    id: 'Sahal',
    name: 'Sahal Service (Golis)',
    provider: 'Golis Telecom',
    badge: 'Golis',
    merchantNumber: RESTAURANT_MERCHANT_NUMBER,
    ussdPrefix: '*789*',
    ussdTemplate: (merchant, amount) => {
      const amtStr = formatUssdAmount(amount);
      return `*789*${merchant}*${amtStr}#`;
    },
    promptUssd: (merchant) => `*789*${merchant}#`,
    themeColor: {
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      text: 'text-sky-900',
      activeRing: 'ring-sky-500 border-sky-500 bg-sky-50/90',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    prefixes: ['90', '91', '62', '78'],
    description: 'Toos ugu bixi Sahal Service lambarka 771909054',
  },
  {
    id: 'eDahab',
    name: 'eDahab (Somtel)',
    provider: 'Somtel / Dahabshiil',
    badge: 'Somtel',
    merchantNumber: RESTAURANT_MERCHANT_NUMBER,
    ussdPrefix: '*770*',
    ussdTemplate: (merchant, amount) => {
      const amtStr = formatUssdAmount(amount);
      return `*770*${merchant}*${amtStr}#`;
    },
    promptUssd: (merchant) => `*770*${merchant}#`,
    themeColor: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-950',
      activeRing: 'ring-yellow-500 border-yellow-500 bg-yellow-50/90',
      badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    prefixes: ['65', '66', '64', '76'],
    description: 'Toos ugu bixi eDahab lambarka 771909054',
  },
  {
    id: 'Cash on Delivery',
    name: 'Kaash (Marka la keeno)',
    provider: 'Cash Payment',
    badge: 'Caddaan (Cash)',
    merchantNumber: '',
    ussdPrefix: '',
    ussdTemplate: () => '',
    promptUssd: () => '',
    themeColor: {
      bg: 'bg-stone-50',
      border: 'border-stone-300',
      text: 'text-stone-900',
      activeRing: 'ring-stone-500 border-stone-500 bg-stone-50/90',
      badgeBg: 'bg-stone-200 text-stone-800 border-stone-300',
    },
    prefixes: [],
    description: 'Lacagta caddaan ah ayaad siinaysaa gaarsiiyaha (Rider-ka).',
  },
];

/**
 * Automatically detects the customer's payment method based on their phone number
 */
export function detectPaymentMethodFromPhone(phone: string): {
  detectedMethod: PaymentMethodId | null;
  providerName: string | null;
  isAutoDetected: boolean;
} {
  if (!phone) {
    return { detectedMethod: null, providerName: null, isAutoDetected: false };
  }

  // Remove non-digit characters
  const clean = phone.replace(/[^0-9]/g, '');
  let localNum = clean;

  // Strip international 252 code
  if (localNum.startsWith('252')) {
    localNum = localNum.slice(3);
  }

  // Strip leading zero
  if (localNum.startsWith('0')) {
    localNum = localNum.slice(1);
  }

  // Check against our prefixes
  for (const option of PAYMENT_OPTIONS) {
    for (const prefix of option.prefixes) {
      if (localNum.startsWith(prefix)) {
        return {
          detectedMethod: option.id,
          providerName: option.name,
          isAutoDetected: true,
        };
      }
    }
  }

  return { detectedMethod: null, providerName: null, isAutoDetected: false };
}

/**
 * Generates the precise USSD code for a given payment method and amount
 */
export function generateSmartUSSD(
  methodId: string,
  amount: number,
  merchantNumber: string = RESTAURANT_MERCHANT_NUMBER
): string {
  const option = PAYMENT_OPTIONS.find(
    (opt) => opt.id.toLowerCase() === methodId.toLowerCase() || opt.name.toLowerCase().includes(methodId.toLowerCase())
  );

  if (!option || !option.ussdTemplate || option.id === 'Cash on Delivery') {
    // Default fallback to EVC Plus if not specified
    const amtStr = formatUssdAmount(amount);
    return `*712*${merchantNumber}*${amtStr}#`;
  }

  return option.ussdTemplate(merchantNumber, amount);
}

/**
 * Returns the prompt USSD (e.g. *712*771909054#) which asks the user to enter exact amount on phone screen
 */
export function getPromptUSSD(
  methodId: string,
  merchantNumber: string = RESTAURANT_MERCHANT_NUMBER
): string {
  const option = PAYMENT_OPTIONS.find(
    (opt) => opt.id.toLowerCase() === methodId.toLowerCase() || opt.name.toLowerCase().includes(methodId.toLowerCase())
  );
  if (!option || !option.promptUssd || option.id === 'Cash on Delivery') {
    return `*712*${merchantNumber}#`;
  }
  return option.promptUssd(merchantNumber);
}
