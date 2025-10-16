import React, { useState } from "react";
import PricingAndTaxRulesModal from "../../components/sales/PricingAndTaxRulesModal";

interface PriceListItem {
  id: number;
  listName: string;
  product: string;
  price: number;
  currency: string;
  validFrom: string;
}

interface TaxRuleItem {
  id: number;
  ruleName: string;
  applicableOn: string;
  taxPercent: number;
  taxType: string;
  validFrom: string;
}

const PricingAndTaxRules: React.FC = () => {
  const [priceList, setPriceList] = useState<PriceListItem[]>([
    { id: 1, listName: "Default", product: "Cheque Book", price: 150, currency: "INR", validFrom: "2025-10-01" },
    { id: 2, listName: "Premium", product: "Loan Application", price: 900, currency: "INR", validFrom: "2025-10-01" },
  ]);
  const [taxRules, setTaxRules] = useState<TaxRuleItem[]>([
    { id: 1, ruleName: "Standard GST", applicableOn: "Bank Service", taxPercent: 18, taxType: "GST", validFrom: "2025-10-01" },
    { id: 2, ruleName: "Zero Tax Saving", applicableOn: "Savings Account", taxPercent: 0, taxType: "GST", validFrom: "2025-10-01" },
  ]);

  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);

  const handlePriceSubmit = (data: Partial<PriceListItem>) => {
    setPriceList([
      ...priceList,
      { id: Date.now(), listName: data.listName || "", product: data.product || "", price: Number(data.price) || 0, currency: data.currency || "INR", validFrom: data.validFrom || "" },
    ]);
    setShowPriceForm(false);
  };

  const handleTaxSubmit = (data: Partial<TaxRuleItem>) => {
    setTaxRules([
      ...taxRules,
      { id: Date.now(), ruleName: data.ruleName || "", applicableOn: data.applicableOn || "", taxPercent: Number(data.taxPercent) || 0, taxType: data.taxType || "GST", validFrom: data.validFrom || "" },
    ]);
    setShowTaxForm(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pricing & Tax Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Price Lists Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Price Lists</h3>
            <button
              className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
              onClick={() => setShowPriceForm(true)}
            >
              + Add
            </button>
          </div>

          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">List Name</th>
                <th className="px-2 py-1">Product</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Currency</th>
                <th className="px-2 py-1">Valid From</th>
              </tr>
            </thead>
            <tbody>
              {priceList.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-2 py-1">{item.listName}</td>
                  <td className="px-2 py-1">{item.product}</td>
                  <td className="px-2 py-1">₹{item.price}</td>
                  <td className="px-2 py-1">{item.currency}</td>
                  <td className="px-2 py-1">{item.validFrom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Rules Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Tax Rules</h3>
            <button
              className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
              onClick={() => setShowTaxForm(true)}
            >
              + Add
            </button>
          </div>

          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1">Rule Name</th>
                <th className="px-2 py-1">Applicable On</th>
                <th className="px-2 py-1">Tax %</th>
                <th className="px-2 py-1">Tax Type</th>
                <th className="px-2 py-1">Valid From</th>
              </tr>
            </thead>
            <tbody>
              {taxRules.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-2 py-1">{item.ruleName}</td>
                  <td className="px-2 py-1">{item.applicableOn}</td>
                  <td className="px-2 py-1">{item.taxPercent}%</td>
                  <td className="px-2 py-1">{item.taxType}</td>
                  <td className="px-2 py-1">{item.validFrom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PricingAndTaxRulesModal
        type="price"
        show={showPriceForm}
        onClose={() => setShowPriceForm(false)}
        onSubmit={handlePriceSubmit}
      />
      <PricingAndTaxRulesModal
        type="tax"
        show={showTaxForm}
        onClose={() => setShowTaxForm(false)}
        onSubmit={handleTaxSubmit}
      />
    </div>
  );
};

export default PricingAndTaxRules;
