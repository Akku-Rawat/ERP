import React, { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';

interface LineItem {
  id: string;
  itemName: string;
  description: string;
  hsn: string;
  qty: number;
  gstRate: number;
  cost: number;
  amount: number;
}

const QuotationTemplate = () => {
  // Company Info
  const [companyName, setCompanyName] = useState('Rolaface Software Ltd');
  const [companyAddress, setCompanyAddress] = useState('1309, Opal tower, Lala lajpatray, Kentucky, 626004');
  const [companyPhone, setCompanyPhone] = useState('93574-8810');
  const [companyGSTIN, setCompanyGSTIN] = useState('29VGCED1234KZE5');
  const [companyPAN, setCompanyPAN] = useState('VGCED1234K');
  
  // Invoice Details
  const [invoiceNo, setInvoiceNo] = useState('RPT2020-01007');
  const [invoiceDate, setInvoiceDate] = useState('February 10, 2021');
  const [dueDate, setDueDate] = useState('February 10, 2021');
  const [dueAmount, setDueAmount] = useState('');
  
  // Bill To
  const [billToName, setBillToName] = useState('Studio Den');
  const [billToAddress, setBillToAddress] = useState('406, 8/4 Inder Ghan wall, Bangalore, Karnataka, India - 560009');
  const [billToGSTIN, setBillToGSTIN] = useState('19VGCED1234KZ1D');
  const [billToPAN, setBillToPAN] = useState('VGCED1234K');
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', itemName: 'Web Development', description: 'Create and send unlimited professional invoices for free. Use our simple Request to collect payments faster.', hsn: '0056', qty: 10, gstRate: 9, cost: 100, amount: 1000 }
  ]);
  
  // Bank Details
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountName, setAccountName] = useState('Foolad Labs');
  const [accountNumber, setAccountNumber] = useState('45390416789');
  const [ifsc, setIfsc] = useState('HDFC0001698');
  const [accountType, setAccountType] = useState('Savings');
  const [upi, setUpi] = useState('fooladlabs@okhdfc');
  
  const [termsConditions, setTermsConditions] = useState('Please pay within 15 days from the date of invoice, overdue interest @ 14% will be charged on delayed payments.\n\nPlease quote invoice number when remitting funds.');
  const [additionalNotes, setAdditionalNotes] = useState('It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here.');

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: Date.now().toString(), 
      itemName: '', 
      description: '', 
      hsn: '0056', 
      qty: 1, 
      gstRate: 9, 
      cost: 0, 
      amount: 0 
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'cost') {
          updated.amount = updated.qty * updated.cost;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = lineItems.reduce((sum, item) => sum + (item.amount * item.gstRate / 100), 0);
  const sgstAmount = gstAmount / 2;
  const cgstAmount = gstAmount / 2;
  const totalAmount = subtotal + gstAmount;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-6 grid grid-cols-2 gap-6">
          {/* Company Info */}
          <div className="text-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-blue-600">F</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-transparent text-xl font-bold border-none outline-none w-full text-white placeholder-blue-200"
                />
                <textarea
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-full text-white placeholder-blue-200 resize-none mt-1"
                  rows={2}
                />
                <input
                  type="text"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-full text-white placeholder-blue-200 mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="opacity-80">GSTIN:</span>
                <input
                  type="text"
                  value={companyGSTIN}
                  onChange={(e) => setCompanyGSTIN(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white ml-2"
                />
              </div>
              <div>
                <span className="opacity-80">PAN:</span>
                <input
                  type="text"
                  value={companyPAN}
                  onChange={(e) => setCompanyPAN(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white ml-2"
                />
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="text-white">
            <h3 className="font-bold mb-2 text-sm opacity-80">BILLED TO</h3>
            <input
              type="text"
              value={billToName}
              onChange={(e) => setBillToName(e.target.value)}
              className="bg-transparent text-lg font-bold border-none outline-none w-full text-white placeholder-blue-200"
            />
            <textarea
              value={billToAddress}
              onChange={(e) => setBillToAddress(e.target.value)}
              className="bg-transparent text-sm border-none outline-none w-full text-white placeholder-blue-200 resize-none mt-1"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div>
                <span className="opacity-80">GSTIN:</span>
                <input
                  type="text"
                  value={billToGSTIN}
                  onChange={(e) => setBillToGSTIN(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white ml-2"
                />
              </div>
              <div>
                <span className="opacity-80">PAN:</span>
                <input
                  type="text"
                  value={billToPAN}
                  onChange={(e) => setBillToPAN(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white ml-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details Bar */}
        <div className="bg-gray-100 px-6 py-4 grid grid-cols-4 gap-4 border-b-2 border-blue-600">
          <div>
            <label className="text-xs text-gray-600 font-semibold block mb-1">INVOICE #</label>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-semibold block mb-1">Invoice Date</label>
            <input
              type="text"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-semibold block mb-1">Due Date</label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 font-semibold block mb-1">Due Amount</label>
            <input
              type="text"
              value={dueAmount}
              onChange={(e) => setDueAmount(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded outline-none focus:border-blue-600 text-sm font-bold"
              placeholder="₹94,240"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 py-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-200 grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold text-gray-700">
              <div className="col-span-1">#</div>
              <div className="col-span-3">ITEM NAME/ITEM DESCRIPTION</div>
              <div className="col-span-1">HSN</div>
              <div className="col-span-1 text-center">QTY</div>
              <div className="col-span-1 text-center">GST RATE</div>
              <div className="col-span-2 text-right">COST</div>
              <div className="col-span-2 text-right">AMOUNT</div>
              <div className="col-span-1"></div>
            </div>

            {lineItems.map((item, index) => (
              <div key={item.id} className="border-t border-gray-200">
                <div className="grid grid-cols-12 gap-2 px-4 py-3 items-start">
                  <div className="col-span-1 text-sm font-semibold pt-2">{String(index + 1).padStart(2, '0')}</div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => updateLineItem(item.id, 'itemName', e.target.value)}
                      className="w-full px-2 py-1 border-b border-gray-300 outline-none focus:border-blue-600 text-sm font-semibold"
                      placeholder="Item Name"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border-none outline-none text-xs text-gray-600 resize-none mt-1"
                      rows={2}
                      placeholder="Item description..."
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      value={item.hsn}
                      onChange={(e) => updateLineItem(item.id, 'hsn', e.target.value)}
                      className="w-full px-2 py-1 border-b border-gray-300 outline-none focus:border-blue-600 text-sm text-center"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      value={item.qty || ''}
                      onChange={(e) => updateLineItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border-b border-gray-300 outline-none focus:border-blue-600 text-sm text-center"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      value={item.gstRate || ''}
                      onChange={(e) => updateLineItem(item.id, 'gstRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border-b border-gray-300 outline-none focus:border-blue-600 text-sm text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.cost || ''}
                      onChange={(e) => updateLineItem(item.id, 'cost', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border-b border-gray-300 outline-none focus:border-blue-600 text-sm text-right"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2 text-right font-bold text-sm pt-2">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="col-span-1 flex justify-center pt-2">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addLineItem}
              className="w-full py-3 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 font-semibold border-t border-gray-200"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>
        </div>

        {/* Bank Details and Totals */}
        <div className="px-6 py-4 grid grid-cols-2 gap-6">
          {/* Bank Details */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h3 className="text-blue-600 font-bold mb-3 text-sm">BANK AND UPI DETAILS</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Bank Name:</span>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="border-b border-gray-300 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Account Holder Name:</span>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="border-b border-gray-300 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Account Number:</span>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="border-b border-gray-300 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">IFSC:</span>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="border-b border-gray-300 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Account Type:</span>
                <input
                  type="text"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="border-b border-gray-300 outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">UPI:</span>
                <input
                  type="text"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="border-b border-gray-300 outline-none focus:border-blue-600"
                />
              </div>
            </div>
            <div className="mt-4 bg-gray-100 p-3 rounded">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 mx-auto flex items-center justify-center">
                <span className="text-xs text-gray-400">QR Code</span>
              </div>
              <p className="text-xs text-center text-gray-600 mt-2">Scan to pay via UPI</p>
            </div>
          </div>

          {/* Totals */}
          <div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="space-y-2 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount(%)</span>
                  <span className="font-bold">₹{(0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxable Amount</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CGST</span>
                  <span className="font-bold">₹{Math.round(cgstAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGST</span>
                  <span className="font-bold">₹{Math.round(sgstAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <span className="font-bold text-lg">Total Due Amount</span>
                <span className="font-bold text-2xl">₹{Math.round(totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-4 border border-gray-300 rounded-lg p-4 bg-blue-50">
              <h4 className="font-bold text-sm mb-2">INVOICE TOTAL IN WORDS</h4>
              <p className="text-sm font-semibold">Ninety Four Thousand Two Hundred and Fourty Rupees Only</p>
            </div>
          </div>
        </div>

        {/* Terms and Additional Notes */}
        <div className="px-6 py-4 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-blue-600 font-bold mb-2 text-sm">TERMS AND CONDITIONS</h3>
            <textarea
              value={termsConditions}
              onChange={(e) => setTermsConditions(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 resize-none text-xs"
            />
          </div>
          <div>
            <h3 className="text-blue-600 font-bold mb-2 text-sm">ADDITIONAL NOTES</h3>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-600 resize-none text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 text-center text-xs text-gray-600 border-t">
          <p>This is a computer-generated invoice and does not require a signature</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="max-w-6xl mx-auto mt-6 flex justify-end">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-lg"
        >
          <Download size={20} /> Download/Print Invoice
        </button>
      </div>
    </div>
  );
};

export default QuotationTemplate;