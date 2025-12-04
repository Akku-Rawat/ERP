import React, { useState } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  Check,
  RotateCcw,
  Save,
  FileText,
  CreditCard,
  Truck,
  XCircle,
  Shield,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

// Section type IDs
type SectionId =
  | 'general'
  | 'payment'
  | 'delivery'
  | 'cancellation'
  | 'warranty'
  | 'liability';

type Tab = 'buying' | 'selling';

interface SectionTerm {
  general: string;
  payment: string;
  delivery: string;
  cancellation: string;
  warranty: string;
  liability: string;
}

interface PaymentPhase {
  phase: string;
  percentage: string;
  when: string;
}

// PaymentData for each tab
interface PaymentDataType {
  phases: PaymentPhase[];
  dueDates: string;
  lateCharges: string;
  taxes: string;
  specialNotes: string;
}

interface AllPaymentData {
  buying: PaymentDataType;
  selling: PaymentDataType;
}

interface AllFormData {
  buying: SectionTerm;
  selling: SectionTerm;
}

// Section object for dropdowns
interface SectionOption {
  id: SectionId;
  label: string;
  icon: React.ComponentType<any>;
}

const defaultTerms: SectionTerm = {
  general: `1. This Quotation is subject to the following terms and conditions. By accepting this quotation, {{CustomerName}} agrees to be bound by these terms. This quotation, identified by number {{QuotationNumber}}, was issued on {{QuotationDate}} and is valid until {{ValidUntil}}.
2. The services to be provided are: {{ServiceName}}. The total amount payable for these services is {{TotalAmount}}.
3. Payment is due upon receipt of the invoice. Any disputes must be raised within 14 days of the invoice date.`,
  payment: 'PAYMENT_TABLE',
  delivery: `1. Estimated delivery timelines are as follows: Phase 1 – 2 weeks, Phase 2 – 3 weeks, with a total project duration of 5 weeks.`,
  cancellation: `1. Cancellation Conditions: Client may cancel anytime with written notice.
2. Refund Rules: Advance payment is non-refundable, milestone payments refundable only for uninitiated work.`,
  warranty: `1. The Company warrants that the service will be performed professionally and function as intended for 30 days after completion.`,
  liability: `1. The Company is not liable for delays caused by the client.
2. The client is responsible for providing accurate information and resources.
3. In no event shall the Company's total liability, whether in contract or otherwise, exceed the total amount paid by the client for the service.`,
};

const defaultPayment: PaymentDataType = {
  phases: [
    { phase: 'Advance', percentage: 'Advance Payment 20%', when: 'Upon quotation acceptance.' },
    { phase: 'Phase 1', percentage: 'Phase 1 Completion 30%', when: 'After Phase 1 delivery' },
    { phase: 'Final', percentage: 'Final Completion 50%', when: 'On project sign-off' },
  ],
  dueDates: 'Payment due within 30 days from invoice.',
  lateCharges: '12% p.a. on overdue payments.',
  taxes: 'Tax applicable @ 18%.',
  specialNotes: 'Advance payment is non-refundable.',
};

const sections: SectionOption[] = [
  { id: 'general', label: 'General Service Terms', icon: FileText },
  { id: 'payment', label: 'Payment Terms', icon: CreditCard },
  { id: 'delivery', label: 'Service Delivery Terms', icon: Truck },
  { id: 'cancellation', label: 'Cancellation / Refund Policy', icon: XCircle },
  { id: 'warranty', label: 'Warranty', icon: Shield },
  { id: 'liability', label: 'Limitations and Liability', icon: AlertTriangle },
];

const BuyingSelling: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [buyingSection, setBuyingSection] = useState<SectionId>('general');
  const [sellingSection, setSellingSection] = useState<SectionId>('general');

  const [formData, setFormData] = useState<AllFormData>({
    buying: { ...defaultTerms },
    selling: { ...defaultTerms },
  });

  const [paymentData, setPaymentData] = useState<AllPaymentData>({
    buying: { ...defaultPayment },
    selling: { ...defaultPayment },
  });

  const handleChange = (tab: Tab, value: string) => {
    const section = tab === 'buying' ? buyingSection : sellingSection;
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [section]: value
      }
    }));
  };

  const handlePaymentChange = (
    tab: Tab,
    field: keyof PaymentDataType | keyof PaymentPhase,
    value: string,
    index: number | null = null
  ) => {
    setPaymentData(prev => {
      if (index !== null && field !== 'dueDates' && field !== 'lateCharges' && field !== 'taxes' && field !== 'specialNotes') {
        const newPhases = [...prev[tab].phases];
        newPhases[index] = { ...newPhases[index], [field]: value };
        return { ...prev, [tab]: { ...prev[tab], phases: newPhases } };
      }
      return { ...prev, [tab]: { ...prev[tab], [field]: value } };
    });
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    setFormData({ buying: { ...defaultTerms }, selling: { ...defaultTerms } });
  };

  const getFilledCount = (tab: Tab) => {
    return Object.values(formData[tab]).filter(v => v.trim() !== '').length;
  };

  const buyingSectionData = sections.find(s => s.id === buyingSection);
  const sellingSectionData = sections.find(s => s.id === sellingSection);

  const PaymentTermsUI: React.FC<{ tab: Tab }> = ({ tab }) => {
    const data = paymentData[tab];
    return (
      <div className="space-y-4">
        {/* Payment Schedule Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 font-medium text-gray-600 w-1/4">Phase</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600 w-2/5">Percentage</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">When</th>
              </tr>
            </thead>
            <tbody>
              {data.phases.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.phase}
                      onChange={(e) => handlePaymentChange(tab, 'phase', e.target.value, idx)}
                      className="w-full bg-transparent text-gray-700 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.percentage}
                      onChange={(e) => handlePaymentChange(tab, 'percentage', e.target.value, idx)}
                      className="w-full bg-transparent text-gray-700 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.when}
                      onChange={(e) => handlePaymentChange(tab, 'when', e.target.value, idx)}
                      className="w-full bg-transparent text-gray-700 focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Fields */}
        <div className="space-y-3 text-sm">
          <div className="flex">
            <span className="w-40 flex-shrink-0 text-gray-600 font-medium">Due Dates:</span>
            <input
              type="text"
              value={data.dueDates}
              onChange={(e) => handlePaymentChange(tab, 'dueDates', e.target.value)}
              className="flex-1 bg-transparent text-gray-700 focus:outline-none"
            />
          </div>
          <div className="flex">
            <span className="w-40 flex-shrink-0 text-gray-600 font-medium">Late Payment Charges:</span>
            <input
              type="text"
              value={data.lateCharges}
              onChange={(e) => handlePaymentChange(tab, 'lateCharges', e.target.value)}
              className="flex-1 bg-transparent text-gray-700 focus:outline-none"
            />
          </div>
          <div className="flex">
            <span className="w-40 flex-shrink-0 text-gray-600 font-medium">Taxes / Additional Charges:</span>
            <input
              type="text"
              value={data.taxes}
              onChange={(e) => handlePaymentChange(tab, 'taxes', e.target.value)}
              className="flex-1 bg-transparent text-gray-700 focus:outline-none"
            />
          </div>
          <div className="flex">
            <span className="w-40 flex-shrink-0 text-gray-600 font-medium">Special Notes / Conditions:</span>
            <input
              type="text"
              value={data.specialNotes}
              onChange={(e) => handlePaymentChange(tab, 'specialNotes', e.target.value)}
              className="flex-1 bg-transparent text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = (tab: Tab) => {
    const section = tab === 'buying' ? buyingSection : sellingSection;
    const sectionData = tab === 'buying' ? buyingSectionData : sellingSectionData;

    if (section === 'payment') {
      return <PaymentTermsUI tab={tab} />;
    }

    return (
      <textarea
        value={formData[tab][section]}
        onChange={(e) => handleChange(tab, e.target.value)}
        placeholder={`Enter ${sectionData?.label.toLowerCase()}...`}
        className={`w-full h-64 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent focus:bg-white transition-all resize-none ${
          tab === 'buying' ? 'focus:ring-[var(--primary)]' : 'focus:ring-[var(--primary)]'
        }`}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Success Toast */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-white border border-green-200 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <p className="font-medium text-gray-900 text-sm">Terms saved successfully!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Buying Terms Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* filled header using theme */}
            <div
              className="px-4 py-2 border-b border-gray-100 flex items-center gap-3"
              style={{ background: 'var(--primary-600)', color: 'var(--table-head-text)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--primary)', color: 'var(--table-head-text)' }}
              >
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-white text-sm">Buying Terms</h2>
                <p className="text-xs text-white">Purchase order terms</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--table-head-text)' }}
              >
                {getFilledCount('buying')}/6
              </span>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <select
                  value={buyingSection}
                  onChange={(e) => setBuyingSection(e.target.value as SectionId)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer"
                  style={{ outline: 'none' }}
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>{section.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="p-4 h-87">
              {renderContent('buying')}
            </div>
          </div>

          {/* Selling Terms Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div
              className="px-4 py-2 border-b border-gray-100 flex items-center gap-3"
              style={{ background: 'var(--primary-600)', color: 'var(--table-head-text)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--primary)', color: 'var(--table-head-text)' }}
              >
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-white text-sm">Selling Terms</h2>
                <p className="text-xs text-white">Sales order terms</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--table-head-text)' }}
              >
                {getFilledCount('selling')}/6
              </span>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <select
                  value={sellingSection}
                  onChange={(e) => setSellingSection(e.target.value as SectionId)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent cursor-pointer"
                  style={{ outline: 'none' }}
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>{section.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="p-4 h-72">
              {renderContent('selling')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg transition-all"
            style={{ background: 'linear-gradient(90deg, var(--primary) 0%, var(--primary-600) 100%)' }}
          >
            <Save className="w-4 h-4" />
            Save Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyingSelling;
