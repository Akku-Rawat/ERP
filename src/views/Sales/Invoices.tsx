import React, { useState, useRef } from "react"; 
import InvoiceModal from "../../components/sales/InvoiceModal";

const InvoicesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoice, setInvoice] = useState<any[]>([]);

  const filteredInvoices = invoice.filter((i: any) =>
    [i.item_code, i.item_name, i.item_group, i.custom_min_stock_level, i.custom_max_stock_level, 
      i.custom_vendor, i.custom_selling_price]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );



  return (
    <div className="p-4">
      {/* Search */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search Invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Invoice ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Issue Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.invoiceId || inv.invoiceNumber} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{inv.invoiceId}</td>
                <td className="px-4 py-2">{inv.CutomerName}</td>
                <td className="px-4 py-2">{inv.dateOfInvoice}</td>
                <td className="px-4 py-2">{inv.dueDate}</td>
                <td className="px-4 py-2">₹{inv.grandTotal.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2 text-center">
 
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={data => console.log('Invoice data', data)}
      />
    </div>
  );
};

export default InvoicesTable;