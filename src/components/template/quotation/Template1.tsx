import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

interface LineItem {
  id: string;
  qty: string;
  description: string;
  unitPrice: string;
  lineTotal: number;
}

const QuotationTemplate = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companySlogan, setCompanySlogan] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyFax, setCompanyFax] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  
  const [contactName, setContactName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [customerId, setCustomerId] = useState('');
  
  const [salesperson, setSalesperson] = useState('');
  const [job, setJob] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Due on receipt');
  const [dueDate, setDueDate] = useState('');
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', qty: '', description: '', unitPrice: '', lineTotal: 0 }
  ]);
  
  const [salesTaxRate, setSalesTaxRate] = useState('0');
  const [preparedBy, setPreparedBy] = useState('');
  const [conditions, setConditions] = useState('');
  const [signatureLine, setSignatureLine] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: Date.now().toString(),
      qty: '',
      description: '',
      unitPrice: '',
      lineTotal: 0
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'unitPrice') {
          const qty = parseFloat(field === 'qty' ? value : updated.qty) || 0;
          const price = parseFloat(field === 'unitPrice' ? value : updated.unitPrice) || 0;
          updated.lineTotal = qty * price;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const salesTax = subtotal * (parseFloat(salesTaxRate) / 100);
  const total = subtotal + salesTax;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8">
          <div className="flex justify-between items-start mb-6">
            {/* Logo Upload */}
            <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
              {logo ? (
                <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              )}
            </div>
            
            <div className="text-right">
              <h1 className="text-4xl font-bold text-gray-800">QUOTE</h1>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="[Company Name]"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-xl font-bold border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="(Company Slogan)"
              value={companySlogan}
              onChange={(e) => setCompanySlogan(e.target.value)}
              className="text-sm italic border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="[Street Address, City, ST ZIP Code]"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="text-sm border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Phone [phone]"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="text-sm border-b border-gray-300 bg-transparent flex-1 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Fax [fax]"
                value={companyFax}
                onChange={(e) => setCompanyFax(e.target.value)}
                className="text-sm border-b border-gray-300 bg-transparent flex-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <input
              type="email"
              placeholder="[email]"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="text-sm border-b border-gray-300 bg-transparent w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Invoice Details */}
          <div className="mt-6 text-right space-y-2">
            <div className="flex justify-end gap-2">
              <span className="font-semibold">INVOICE #</span>
              <input
                type="text"
                placeholder="[NO.]"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="border-b border-gray-300 bg-transparent w-32 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <span className="font-semibold">DATE:</span>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <span className="font-semibold">EXPIRATION DATE:</span>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Client Info Section */}
        <div className="p-8">
          <div className="mb-6">
            <div className="font-bold mb-2">TO</div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="[Contact Name]"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="[Company Name]"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="[Street Address]"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="[City, ST ZIP Code]"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="[phone]"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Customer ID [No.]"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Payment Info Table */}
          <div className="grid grid-cols-4 gap-4 mb-6 border-t border-b border-gray-300 py-3">
            <div>
              <label className="font-semibold block mb-1">SALESPERSON</label>
              <input
                type="text"
                value={salesperson}
                onChange={(e) => setSalesperson(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">JOB</label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">PAYMENT TERMS</label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">DUE DATE</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-b border-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-300 mb-6">
            <div className="grid grid-cols-12 bg-blue-100 font-semibold border-b border-gray-300">
              <div className="col-span-1 p-2 border-r border-gray-300">QTY</div>
              <div className="col-span-6 p-2 border-r border-gray-300">DESCRIPTION</div>
              <div className="col-span-2 p-2 border-r border-gray-300">UNIT PRICE</div>
              <div className="col-span-2 p-2 border-r border-gray-300">LINE TOTAL</div>
              <div className="col-span-1 p-2"></div>
            </div>
            
            {lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 border-b border-gray-300">
                <div className="col-span-1 p-2 border-r border-gray-300">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateLineItem(item.id, 'qty', e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-6 p-2 border-r border-gray-300">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="Description"
                  />
                </div>
                <div className="col-span-2 p-2 border-r border-gray-300">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                    className="w-full focus:outline-none"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2 p-2 border-r border-gray-300">
                  <span className="font-semibold">${item.lineTotal.toFixed(2)}</span>
                </div>
                <div className="col-span-1 p-2 flex justify-center">
                  <button
                    onClick={() => removeLineItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addLineItem}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Line Item
          </button>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-semibold">SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <span className="font-semibold">SALES TAX</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={salesTaxRate}
                    onChange={(e) => setSalesTaxRate(e.target.value)}
                    className="w-16 border-b border-gray-300 text-right focus:outline-none"
                    step="0.1"
                  />
                  <span>%</span>
                  <span>${salesTax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="space-y-4 border-t border-gray-300 pt-6">
            <div>
              <label className="block mb-1">Quotation prepared by:</label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">
                This is a quotation on the goods named, subject to the conditions noted below:
              </label>
              <textarea
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="[Describe any conditions pertaining to these prices and any additional terms of the agreement. You may want to include contingencies that will affect the quotation.]"
                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-blue-500 rounded"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block mb-1">To accept this quotation, sign here and return:</label>
              <input
                type="text"
                value={signatureLine}
                onChange={(e) => setSignatureLine(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-8 text-center bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded">
            <p className="font-bold text-lg">THANK YOU FOR YOUR BUSINESS!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationTemplate;