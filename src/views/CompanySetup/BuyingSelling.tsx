import React, { useEffect, useState } from "react";
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
  ChevronDown,
} from "lucide-react";

import type {
  Terms,
  TermPhase,
  TermSection,
  PaymentTerms,
} from "../../types/termsAndCondition";

interface BuyingSellingProps {
  terms?: Terms | null;
}

type SectionId =
  | "general"
  | "payment"
  | "delivery"
  | "cancellation"
  | "warranty"
  | "liability";

type Tab = "buying" | "selling";

const sections = [
  { id: "general", label: "General Service Terms", icon: FileText },
  { id: "payment", label: "Payment Terms", icon: CreditCard },
  { id: "delivery", label: "Service Delivery Terms", icon: Truck },
  { id: "cancellation", label: "Cancellation / Refund Policy", icon: XCircle },
  { id: "warranty", label: "Warranty", icon: Shield },
  { id: "liability", label: "Limitations and Liability", icon: AlertTriangle },
];

// Empty section structure for reset
const emptySection = (): TermSection => ({
  general: "",
  delivery: "",
  cancellation: "",
  warranty: "",
  liability: "",
  payment: {
    phases: [],
    dueDates: "",
    lateCharges: "",
    tax: "",
    notes: "",
  },
});


const BuyingSelling: React.FC<BuyingSellingProps> = ({ terms }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [buyingSection, setBuyingSection] = useState<SectionId>("general");
  const [sellingSection, setSellingSection] = useState<SectionId>("general");

  const [formData, setFormData] = useState({
    buying: emptySection(),
    selling: emptySection(),
  });

  useEffect(() => {
    if (!terms) return;

    setFormData({
      buying: {
        general: terms.buying?.general ?? "",
        delivery: terms.buying?.delivery ?? "",
        cancellation: terms.buying?.cancellation ?? "",
        warranty: terms.buying?.warranty ?? "",
        liability: terms.buying?.liability ?? "",
        payment: {
          phases: terms.buying?.payment?.phases ?? [],
          dueDates: terms.buying?.payment?.dueDates ?? "",
          lateCharges: terms.buying?.payment?.lateCharges ?? "",
          tax: terms.buying?.payment?.tax ?? "",
          notes: terms.buying?.payment?.notes ?? "",
        },
      },

      selling: {
        general: terms.selling?.general ?? "",
        delivery: terms.selling?.delivery ?? "",
        cancellation: terms.selling?.cancellation ?? "",
        warranty: terms.selling?.warranty ?? "",
        liability: terms.selling?.liability ?? "",
        payment: {
          phases: terms.selling?.payment?.phases ?? [],
          dueDates: terms.selling?.payment?.dueDates ?? "",
          lateCharges: terms.selling?.payment?.lateCharges ?? "",
          tax: terms.selling?.payment?.tax ?? "",
          notes: terms.selling?.payment?.notes ?? "",
        },
      },
    });
  }, [terms]);

  const handleSectionChange = (tab: Tab, value: string) => {
    const section = tab === "buying" ? buyingSection : sellingSection;

    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [section]: value,
      },
    }));
  };

  const handlePaymentChange = (
    tab: Tab,
    field: keyof PaymentTerms | keyof TermPhase,
    value: string,
    index: number | null = null
  ) => {
    const p = formData[tab].payment;

    if (index !== null) {
      const updated = [...p.phases];
      updated[index] = { ...updated[index], [field]: value };
      setFormData(prev => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          payment: { ...p, phases: updated },
        },
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        payment: { ...p, [field]: value },
      },
    }));
  };

  const addPhase = (tab: Tab) => {
    const newPhase: TermPhase = {
      id: Date.now().toString(),
      name: "",
      percentage: "",
      condition: "",
    };

    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        payment: {
          ...prev[tab].payment,
          phases: [...prev[tab].payment.phases, newPhase],
        },
      },
    }));
  };

  const removePhase = (tab: Tab, index: number) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        payment: {
          ...prev[tab].payment,
          phases: prev[tab].payment.phases.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const getFilledCount = (tab: Tab) =>
    Object.values(formData[tab]).filter(
      v => typeof v === "string" && v.trim() !== ""
    ).length;


  const handleReset = () => {
    setFormData({
      buying: emptySection(),
      selling: emptySection(),
    });
  };

  const handleSubmit = () => {
    console.log("Final payload:", formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };


  const PaymentTermsUI = ({ tab }: { tab: Tab }) => {
    const p = formData[tab].payment;

    return (
      <div className="space-y-4">
        <div className="border border-theme rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-head">
                <th className="px-3 py-2">Phase</th>
                <th className="px-3 py-2">Percentage</th>
                <th className="px-3 py-2">Condition</th>
                <th className="px-3 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {p.phases.map((row, idx) => (
                <tr key={row.id} className="border-b border-theme">
                  <td className="px-3 py-2">
                    <input
                      value={row.name}
                      onChange={e =>
                        handlePaymentChange(tab, "name", e.target.value, idx)
                      }
                      className="bg-transparent w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.percentage}
                      onChange={e =>
                        handlePaymentChange(tab, "percentage", e.target.value, idx)
                      }
                      className="bg-transparent w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.condition}
                      onChange={e =>
                        handlePaymentChange(tab, "condition", e.target.value, idx)
                      }
                      className="bg-transparent w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="text-red-500 text-xs"
                      onClick={() => removePhase(tab, idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="px-3 py-1 border border-theme rounded text-sm"
          onClick={() => addPhase(tab)}
        >
          Add Phase
        </button>

        <div className="space-y-3 text-sm">
          <div className="flex">
            <span className="w-40">Due Dates:</span>
            <input
              value={p.dueDates}
              onChange={e => handlePaymentChange(tab, "dueDates", e.target.value)}
              className="flex-1 bg-transparent"
            />
          </div>

          <div className="flex">
            <span className="w-40">Late Charges:</span>
            <input
              value={p.lateCharges}
              onChange={e => handlePaymentChange(tab, "lateCharges", e.target.value)}
              className="flex-1 bg-transparent"
            />
          </div>

          <div className="flex">
            <span className="w-40">Tax:</span>
            <input
              value={p.tax}
              onChange={e => handlePaymentChange(tab, "tax", e.target.value)}
              className="flex-1 bg-transparent"
            />
          </div>

          <div className="flex">
            <span className="w-40">Notes:</span>
            <input
              value={p.notes}
              onChange={e => handlePaymentChange(tab, "notes", e.target.value)}
              className="flex-1 bg-transparent"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (tab: Tab) => {
    const section = tab === "buying" ? buyingSection : sellingSection;

    if (section === "payment") return <PaymentTermsUI tab={tab} />;

    return (
      <textarea
        value={formData[tab][section]}
        onChange={e => handleSectionChange(tab, e.target.value)}
        className="w-full h-64 bg-card border border-theme rounded-lg p-3"
      />
    );
  };

  return (
    <div className="min-h-screen bg-app">
      {/* SUCCESS TOAST */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-card border border-green-200 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <Check className="text-success" />
          <span>Terms saved successfully!</span>
        </div>
      )}

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* BUYING CARD */}
        <div className="bg-card rounded-xl border border-theme">
          <div className="px-4 py-2 bg-primary text-white flex items-center gap-3">
            <ShoppingCart />
            <span className="font-semibold">Buying Terms</span>
            <span className="ml-auto text-xs bg-white/20 px-2 rounded">
              {getFilledCount("buying")}/6
            </span>
          </div>

          <div className="p-4">
            <select
              value={buyingSection}
              onChange={e => setBuyingSection(e.target.value as SectionId)}
              className="w-full border border-theme p-2 rounded bg-card"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            <div className="mt-4">{renderSection("buying")}</div>
          </div>
        </div>

        {/* SELLING CARD */}
        <div className="bg-card rounded-xl border border-theme">
          <div className="px-4 py-2 bg-primary text-white flex items-center gap-3">
            <TrendingUp />
            <span className="font-semibold">Selling Terms</span>
            <span className="ml-auto text-xs bg-white/20 px-2 rounded">
              {getFilledCount("selling")}/6
            </span>
          </div>

          <div className="p-4">
            <select
              value={sellingSection}
              onChange={e => setSellingSection(e.target.value as SectionId)}
              className="w-full border border-theme p-2 rounded bg-card"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            <div className="mt-4">{renderSection("selling")}</div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-theme rounded bg-card"
        >
          <RotateCcw className="inline-block mr-2" />
          Reset
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded bg-primary text-white"
        >
          <Save className="inline-block mr-2" />
          Save Terms
        </button>
      </div>
    </div>
  );
};

export default BuyingSelling;
