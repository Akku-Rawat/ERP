import React, { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  amount: number;
}

const QuotationTemplate = () => {
  const [companyName, setCompanyName] = useState('Rolaface Software Ltd');
  const [slogan, setSlogan] = useState('Innovative Solutions for Your Business');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('[Date]');
  const [quoteNumber, setQuoteNumber] = useState('[100]');
  const [customerId, setCustomerId] = useState('[ABC12345]');
  
  const [customerName, setCustomerName] = useState('[Name]');
  const [customerCompany, setCustomerCompany] = useState('[Company Name]');
  const [customerAddress, setCustomerAddress] = useState('[Street Address]');
  const [customerCity, setCustomerCity] = useState('[City, ST ZIP Code]');
  const [customerPhone, setCustomerPhone] = useState('[Phone]');
  
  const [projectDescription, setProjectDescription] = useState('');
  const [specialNotes, setSpecialNotes] = useState('Once signed, please Fax, mail or e-mail it to the provided address.');
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', amount: 0 }
  ]);
  
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  
  const [footerAddress, setFooterAddress] = useState('[Street Address], [City, ST ZIP Code]');
  const [footerContact, setFooterContact] = useState('[Phone]  [Fax]  [E-mail]');

  const addLineItem = () => {
    setLineItems([...lineItems, { id: Date.now().toString(), description: '', amount: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: 'description' | 'amount', value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = discount;
  const taxAmount = ((subtotal - discountAmount) * taxRate) / 100;
  const total = subtotal - discountAmount + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="bg-indigo-900 text-white p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-indigo-900 text-2xl font-bold">
            #
          </div>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="bg-transparent text-2xl font-bold border-none outline-none flex-1 text-white placeholder-indigo-200"
          />
        </div>

        {/* Slogan and Info Bar */}
        <div className="p-6 flex justify-between items-start border-b">
          <input
            type="text"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="text-sm font-semibold border-none outline-none"
            placeholder="Your Company Slogan"
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="bg-gray-700 text-white px-2 py-1">Date:</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2 py-1 border outline-none text-sm"
            />
            <div className="bg-gray-700 text-white px-2 py-1">Valid Until:</div>
            <input
              type="text"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="px-2 py-1 border outline-none text-sm"
            />
            <div className="bg-gray-700 text-white px-2 py-1">Quote #:</div>
            <input
              type="text"
              value={quoteNumber}
              onChange={(e) => setQuoteNumber(e.target.value)}
              className="px-2 py-1 border outline-none text-sm"
            />
            <div className="bg-gray-700 text-white px-2 py-1">Customer ID:</div>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="px-2 py-1 border outline-none text-sm"
            />
          </div>
        </div>

        {/* Customer and Project Description */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <div className="bg-gray-700 text-white px-3 py-2 font-semibold mb-2">Customer:</div>
            <div className="space-y-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2 py-1 border outline-none text-sm"
                placeholder="Name"
              />
              <input
                type="text"
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                className="w-full px-2 py-1 border outline-none text-sm"
                placeholder="Company Name"
              />
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-2 py-1 border outline-none text-sm"
                placeholder="Street Address"
              />
              <input
                type="text"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full px-2 py-1 border outline-none text-sm"
                placeholder="City, ST ZIP Code"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-2 py-1 border outline-none text-sm"
                placeholder="Phone"
              />
            </div>
          </div>
          <div>
            <div className="bg-gray-700 text-white px-3 py-2 font-semibold mb-2">Quote/Project Description</div>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full h-40 px-3 py-2 border outline-none text-sm resize-none"
              placeholder="Enter project description..."
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="px-6">
          <div className="border">
            <div className="bg-gray-700 text-white grid grid-cols-12 px-3 py-2 font-semibold text-sm">
              <div className="col-span-10">Description</div>
              <div className="col-span-2 text-right">Line Total</div>
            </div>
            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 items-center border-t">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  className="col-span-9 px-3 py-2 border-none outline-none text-sm"
                  placeholder="Item description..."
                />
                <input
                  type="number"
                  value={item.amount || ''}
                  onChange={(e) => updateLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="col-span-2 px-3 py-2 border-none outline-none text-sm text-right"
                  placeholder="0.00"
                />
                <button
                  onClick={() => removeLineItem(item.id)}
                  className="col-span-1 flex justify-center items-center text-red-600 hover:text-red-800"
                  disabled={lineItems.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addLineItem}
            className="mt-2 flex items-center gap-2 text-indigo-900 hover:text-indigo-700 text-sm font-semibold"
          >
            <Plus size={16} /> Add Line Item
          </button>
        </div>

        {/* Special Notes and Totals */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <div className="bg-gray-700 text-white px-3 py-2 font-semibold mb-2">Special Notes and Instructions</div>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full h-32 px-3 py-2 border outline-none text-sm resize-none"
            />
          </div>
          <div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <input
                  type="number"
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 border outline-none text-right"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Tax/VAT Rate</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={taxRate || ''}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border outline-none text-right"
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Tax/VAT</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-indigo-900 text-white px-3 py-2 font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Signature */}
        <div className="px-6 pb-6">
          <div className="text-xs text-center space-y-1 mb-4">
            <p>Above information is not an invoice and only an estimate of services/goods described above.</p>
            <p>Payment will be collected in prior to provision of services/goods described in this quote.</p>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm mb-4">Please confirm your acceptance of this quote by signing this document</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="border-b pb-1">Signature</div>
              <div className="border-b pb-1">Print Name</div>
              <div className="border-b pb-1">Date</div>
            </div>
          </div>
          <div className="text-center mt-6 text-sm">
            <p>If you have any questions concerning this quote, contact [Name, Phone]</p>
            <p className="font-bold mt-4">Thank you for your business!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-200 px-6 py-4 text-center text-sm space-y-1">
          <input
            type="text"
            value={footerAddress}
            onChange={(e) => setFooterAddress(e.target.value)}
            className="w-full bg-transparent text-center border-none outline-none text-sm"
          />
          <input
            type="text"
            value={footerContact}
            onChange={(e) => setFooterContact(e.target.value)}
            className="w-full bg-transparent text-center border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto mt-4 flex justify-end gap-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-indigo-900 text-white px-4 py-2 rounded hover:bg-indigo-800"
        >
          <Download size={16} /> Download/Print
        </button>
      </div>
    </div>
  );
};

export default QuotationTemplate;