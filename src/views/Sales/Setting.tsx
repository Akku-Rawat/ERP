import React, { useState } from "react";

const SalesSettings = () => {
  const [taxRate, setTaxRate] = useState(10);
  const [currency, setCurrency] = useState("USD");
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState("Cash");

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log({
      taxRate,
      currency,
      invoicePrefix,
      defaultPaymentMethod,
    });
    alert("Settings saved!");
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Sales Settings</h3>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full p-2 border rounded"
            min={0}
            max={100}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Currency</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Invoice Prefix</label>
          <input
            type="text"
            value={invoicePrefix}
            onChange={(e) => setInvoicePrefix(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Default Payment Method</label>
          <select
            value={defaultPaymentMethod}
            onChange={(e) => setDefaultPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>
        <button
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-teal-700"
          onClick={handleSaveSettings}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SalesSettings;
