import React, { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import SupplierDetailView from "./SupplierDetailView";

export interface Supplier {
  supplierName: string;
  supplierCode?: string;
  tpin?: string;
  contactPerson?: string;
  phoneNo?: string;
  emailId?: string;
  currency?: string;
  paymentTerms?: string;
  openingBalance?: string;
  accountNumber?: string;
  accountHolder?: string;
  swiftCode?: string;
  sortCode?: string;
  billingAddressLine1?: string;
  billingCity?: string;
  billingCountry?: string;
  status?: "active" | "inactive" | "pending";
}

interface Props {
  onAdd: () => void;
}

const SupplierManagement: React.FC<Props> = ({ onAdd }) => {
  // Dummy realistic supplier data
  const initialSuppliers: Supplier[] = [
    {
      supplierName: "Zambia Breweries Plc",
      supplierCode: "ZB001",
      tpin: "1001234567",
      contactPerson: "Mary Chileshe",
      phoneNo: "+260 977 123456",
      emailId: "procurement@zambiabreweries.com",
      currency: "ZMW",
      paymentTerms: "30",
      openingBalance: "450,000.00",
      accountNumber: "0123456789",
      accountHolder: "Zambia Breweries Plc",
      swiftCode: "ZBZMZMLU",
      sortCode: "01-00-01",
      billingAddressLine1: "Plot 123, Mungwi Road",
      billingCity: "Lusaka",
      billingCountry: "Zambia",
      status: "active",
    },
    {
      supplierName: "Copperbelt Energy Corporation",
      supplierCode: "CEC002",
      tpin: "1009876543",
      contactPerson: "John Mwamba",
      phoneNo: "+260 966 888999",
      emailId: "suppliers@cec.com.zm",
      currency: "USD",
      paymentTerms: "15",
      openingBalance: "125,000.00",
      accountNumber: "9988776655",
      accountHolder: "Copperbelt Energy Corporation",
      swiftCode: "CECZMLLU",
      billingAddressLine1: "Stand 2375, Luanshya Road",
      billingCity: "Kitwe",
      billingCountry: "Zambia",
      status: "active",
    },
    {
      supplierName: "Shoprite Zambia Ltd",
      supplierCode: "SHOP003",
      tpin: "1005554443",
      contactPerson: "Grace Phiri",
      phoneNo: "+260 955 112233",
      currency: "ZMW",
      paymentTerms: "45",
      openingBalance: "890,000.00",
      accountNumber: "5544332211",
      accountHolder: "Shoprite Zambia Limited",
      billingAddressLine1: "Manda Hill Shopping Centre",
      billingCity: "Lusaka",
      billingCountry: "Zambia",
      status: "active",
    },
    {
      supplierName: "Afritech Solutions",
      supplierCode: "AFT004",
      tpin: "1007778889",
      contactPerson: "David Banda",
      phoneNo: "+260 977 445566",
      emailId: "david@afritech.co.zm",
      currency: "ZMW",
      paymentTerms: "Net 30",
      openingBalance: "67,500.00",
      status: "pending",
    },
    {
      supplierName: "Metal Fabricators of Zambia (ZAMEFA)",
      supplierCode: "ZMF005",
      tpin: "1001112223",
      contactPerson: "Eng. Peter Zulu",
      phoneNo: "+260 212 222333",
      currency: "ZMW",
      paymentTerms: "60",
      openingBalance: "1,200,000.00",
      accountNumber: "1234567890",
      accountHolder: "ZAMEFA Limited",
      swiftCode: "ZMFZMLUXXX",
      billingAddressLine1: "Great North Road",
      billingCity: "Luanshya",
      billingCountry: "Zambia",
      status: "active",
    },
  ];

  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "detail">("table");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.supplierName.toLowerCase().includes(term) ||
        (s.supplierCode ?? "").toLowerCase().includes(term) ||
        (s.tpin ?? "").toLowerCase().includes(term) ||
        (s.status ?? "").toLowerCase().includes(term),
    );
  }, [suppliers, searchTerm]);

  const handleRowClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("table");
    setSelectedSupplier(null);
  };

  const handleDelete = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete supplier "${name}"?`)) {
      // In real app: remove from state/server
      alert("Delete functionality ready — connect to API later");
    }
  };

  return (
    <div className="p-6 bg-app">
      {viewMode === "table" ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add Supplier
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">Code</th>
                  <th className="px-6 py-4 text-left">Supplier Name</th>
                  <th className="px-6 py-4 text-left">TPIN</th>
                  <th className="px-6 py-4 text-left">Currency</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((s) => (
                  <tr
                    key={s.supplierName}
                    onClick={() => handleRowClick(s)}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                      {s.supplierCode || "—"}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {s.supplierName}
                    </td>
                    <td className="px-6 py-4">
                      {s.tpin ? (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {s.tpin}
                        </code>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {s.currency || "ZMW"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          s.status === "active"
                            ? "bg-green-100 text-green-800"
                            : s.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {s.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdd(); // Reuse Add modal in edit mode later
                          }}
                          className="text-indigo-600 hover:text-indigo-800 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(s.supplierName, e)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                {searchTerm
                  ? "No suppliers match your search."
                  : "No suppliers added yet."}
              </div>
            )}
          </div>
        </>
      ) : (
        <SupplierDetailView
          supplier={selectedSupplier!}
          suppliers={suppliers}
          onBack={handleBack}
          onSupplierSelect={handleRowClick}
          onEdit={handleRowClick} // Opens modal later — for now reuses selection
        />
      )}
    </div>
  );
};

export default SupplierManagement;
