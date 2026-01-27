import React, { useState , useEffect} from "react";
import {
  X,
  Search,
  Edit,
  FileText,
  Receipt,
  Plus,
  Building2,
} from "lucide-react";
import type { SupplierFormData ,Supplier } from "../../types/Supply/supplier";
import { getSupplierById } from "../../api/supplierApi";
import { mapSupplierApi } from "../../types/Supply/supplierMapper";




interface Props {
  supplier: Supplier;
  suppliers: Supplier[];
  onBack: () => void;
  onSupplierSelect: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
}

const SupplierDetailView: React.FC<Props> = ({
  supplier,
  suppliers,
  onBack,
  onSupplierSelect,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "purchase-orders" | "bills"
  >("overview");
  const [supplierDetail, setSupplierDetail] = useState<Supplier | null>(null);
const [loading, setLoading] = useState(false);


const filteredSuppliers = suppliers.filter(
  (s) =>
    (s.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.supplierCode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.tpin || "").toLowerCase().includes(searchTerm.toLowerCase())
);


useEffect(() => {
  if (!supplier?.supplierId) return;

  const fetchDetail = async () => {
    try {
      setLoading(true);

      if (!supplier.supplierId) return;

         const res = await getSupplierById(supplier.supplierId);

      const mapped = mapSupplierApi(res.data || res); 

      setSupplierDetail(mapped);
    } catch (err) {
      console.error("Failed to load supplier detail", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDetail();
}, [supplier?.supplierId]);



  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAddress = () => {
    const parts = [
      supplierDetail?.billingAddressLine1,
      supplierDetail?.billingAddressLine2,
      supplierDetail?.billingCity,
      supplierDetail?.district,
      supplierDetail?.province,
      supplierDetail?.billingPostalCode,
      supplierDetail?.billingCountry,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
  };

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Building2 className="w-7 h-7 text-indigo-600" />
          Supplier Details
        </h1>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Back to list"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Supplier List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredSuppliers.map((s) => (
              <div
                key={s.supplierId || s.supplierCode || s.supplierName}
                onClick={() => onSupplierSelect(s)}
                className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                  s.supplierName === supplierDetail?.supplierName
                    ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      s.supplierName === supplierDetail?.supplierName
                        ? "bg-indigo-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {(s.supplierName || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {s.supplierName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.supplierCode || s.tpin || "No code/TPIN"}
                    </p>
                  </div>
                  {s.status && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        s.status,
                      )}`}
                    >
                      {s.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("purchase-orders")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "purchase-orders"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                Purchase Orders
              </button>
              <button
                onClick={() => setActiveTab("bills")}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "bills"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Receipt className="w-4 h-4" />
                Bills
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {activeTab === "overview" && (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {supplierDetail?.supplierName}
                      </h2>
                      {supplierDetail?.supplierCode && (
                        <p className="text-sm text-gray-500 font-mono mt-1">
                          Code: {supplierDetail?.supplierCode}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onEdit(supplier)}
                      className="p-3 hover:bg-gray-100 rounded-lg transition"
                      title="Edit Supplier"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Currency
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.currency || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Phone
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.phoneNo || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Email
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.emailId || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          TPIN
                        </p>
                        <p className="mt-1 font-medium">
                          {supplierDetail?.tpin || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Opening Balance
                        </p>
                        <p className="mt-1 font-medium">
                          {Number(supplierDetail?.openingBalance || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {supplierDetail?.status && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </p>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(supplierDetail?.status)}`}
                        >
                          {supplierDetail?.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <hr className="my-8 border-gray-200" />

                  {/* Address & Bank Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Address */}
                    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        Billing Address
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {formatAddress()}
                      </p>
                    </div>

                    {/* Bank Details */}
                    {(supplierDetail?.accountNumber || supplierDetail?.accountHolder) && (
                      <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Bank Details
                        </h4>
                        <div className="space-y-3 text-sm">
                          {supplierDetail?.accountHolder && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Account Holder:
                              </span>
                              <span className="font-medium">
                                {supplierDetail?.accountHolder}
                              </span>
                            </div>
                          )}
                          {supplierDetail?.accountNumber && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account No:</span>
                              <span className="font-medium font-mono">
                                {supplierDetail?.accountNumber}
                              </span>
                            </div>
                          )}
                          {supplierDetail?.swiftCode && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">SWIFT:</span>
                              <span className="font-medium uppercase">
                                {supplierDetail?.swiftCode}
                              </span>
                            </div>
                          )}
                          {supplierDetail?.sortCode && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Sort Code:</span>
                              <span className="font-medium">
                                {supplierDetail?.sortCode}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder Tabs */}
            {activeTab === "purchase-orders" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    No Purchase Orders Yet
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Create your first purchase order with this supplier
                  </p>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Purchase Order
                  </button>
                </div>
              </div>
            )}

            {activeTab === "bills" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Receipt className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    No Bills Recorded
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Record your first bill from this supplier
                  </p>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Record Bill
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailView;
