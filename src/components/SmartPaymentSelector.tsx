import React, { useEffect, useRef } from 'react';
import { 
  CreditCard, Sparkles, Banknote, Zap
} from 'lucide-react';
import { 
  PAYMENT_OPTIONS, 
  PaymentMethodId, 
  detectPaymentMethodFromPhone,
} from '../lib/smartPayment';

interface SmartPaymentSelectorProps {
  selectedMethod: string;
  onSelectMethod: (method: PaymentMethodId) => void;
  customerPhone: string;
  totalAmount: number;
  paymentStatus?: 'pay_now' | 'already_paid' | 'cash_on_delivery';
  onChangePaymentStatus?: (status: 'pay_now' | 'already_paid' | 'cash_on_delivery') => void;
  transactionId?: string;
  onChangeTransactionId?: (txId: string) => void;
}

export default function SmartPaymentSelector({
  selectedMethod,
  onSelectMethod,
  customerPhone,
  totalAmount,
  paymentStatus = 'pay_now',
  onChangePaymentStatus,
}: SmartPaymentSelectorProps) {
  const [lastAutoDetected, setLastAutoDetected] = React.useState<string | null>(null);
  const prevPhoneRef = useRef(customerPhone);

  // Auto-detect carrier when phone number changes
  useEffect(() => {
    if (customerPhone !== prevPhoneRef.current) {
      prevPhoneRef.current = customerPhone;
      const { detectedMethod, isAutoDetected } = detectPaymentMethodFromPhone(customerPhone);

      if (isAutoDetected && detectedMethod && detectedMethod !== selectedMethod) {
        onSelectMethod(detectedMethod);
        setLastAutoDetected(detectedMethod);
        if (onChangePaymentStatus) {
          onChangePaymentStatus(detectedMethod === 'Cash on Delivery' ? 'cash_on_delivery' : 'pay_now');
        }
      }
    }
  }, [customerPhone, selectedMethod, onSelectMethod, onChangePaymentStatus]);

  const isCash = selectedMethod === 'Cash on Delivery' || paymentStatus === 'cash_on_delivery';

  const handleSelect = (option: (typeof PAYMENT_OPTIONS)[0]) => {
    onSelectMethod(option.id);
    if (onChangePaymentStatus) {
      onChangePaymentStatus(option.id === 'Cash on Delivery' ? 'cash_on_delivery' : 'pay_now');
    }
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-slate-200" id="smart-payment-section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-heading font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-gold-600" />
          <span>Lacag Bixinta (Payment Method) *</span>
        </label>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
          <Zap className="w-3 h-3 text-emerald-600" /> Auto Detection
        </span>
      </div>

      {/* Auto Detection Banner */}
      {lastAutoDetected && customerPhone && (
        <div className="p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Lambarkaaga (<strong>{customerPhone}</strong>) waxaa si toos ah loogu aqoonsaday:{' '}
              <strong className="text-emerald-900">{lastAutoDetected}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Payment Method Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-gold-500 bg-white shadow-sm ring-2 ring-gold-500/20'
                  : 'border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-gray-900 leading-tight truncate">
                    {option.id}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0"></span>
                  )}
                </div>
                <p className="text-[9.5px] text-gray-500 truncate">{option.provider}</p>
              </div>

              <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[9px] font-mono text-gray-400">
                  {option.ussdPrefix ? `${option.ussdPrefix}#` : 'Caddaan'}
                </span>
                <span className={`text-[8.5px] font-semibold px-1 py-0.2 rounded ${option.themeColor.badgeBg}`}>
                  {option.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Cash on Delivery Notice (only when Cash is selected) */}
      {isCash && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
          <Banknote className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Waxaad lacagta guud oo dhan (${totalAmount.toFixed(2)}) caddaan ah siinaysaa gaarsiiyaha marka uu cuntada kuu keeno.</span>
        </div>
      )}
    </div>
  );
}
