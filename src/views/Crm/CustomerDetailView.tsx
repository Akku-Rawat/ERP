import React, { useState } from "react";
import { X, Search, Edit, FileText, Receipt, Plus } from "lucide-react";
import CustomerModal from "../../components/crm/CustomerModal";
import QuotationModal from "../../components/sales/QuotationModal";
import InvoiceModal from "../../components/sales/InvoiceModal";

interface Customer {
  id: string;
  customer_name: string;
  customer_type: "Individual" | "Company";
  custom_customer_tpin?: string;
  status: "active" | "inactive" | "prospect";
}

interface Props {
  customer: Customer;
  customers: Customer[];
  onBack: () => void;
  onCustomerSelect: (customer: Customer) => void;
  onAdd: () => void;
}

const CustomerDetailView: React.FC<Props> = ({
  customer,
  customers,
  onBack,
  onCustomerSelect,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "quotations" | "invoices">("overview");
  const [showCustomerModal, setShowCustomerModal] = useState(false); 
  const [showQuotationModal, setShowQuotationModal] = useState(false); 
  const [showInvoiceModal, setShowInvoiceModal] = useState(false); 

  const filteredCustomers = customers.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      case "prospect":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="">
      
      <div className="bg-gray-100 shadow px-6 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Customer Details</h1>
        <div className="flex items-center gap-3">
          <button
              onClick={() => setShowCustomerModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" /> Add Customer
            </button>
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSubmit={(data) => {
          setShowCustomerModal(false);
        }}
      />
      </div>

      {/* Main Content */}
      <div className=" grid grid-cols-5">
        
   <div className=" col-span-1 bg-white shadow h-[70vh]">
  
          {/* Search */}
          <div className="p-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search customers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-md transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredCustomers.map((c) => (
              <div
                key={c.id}
                onClick={() => onCustomerSelect(c)}
                className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                  c.id === customer.id 
                    ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-sm" 
                    : "hover:bg-gray-50 border-l-4 border-l-transparent hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white shadow-md ${
                    c.id === customer.id ? "bg-blue-600" : "bg-gradient-to-br from-gray-400 to-gray-500"
                  }`}>
                    <span className="text-sm">{c.customer_name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {c.customer_name}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(c.status)} shadow-sm flex-shrink-0`}></div>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{c.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>

        {/* Right Content */}
        <div className=" col-span-4">
          
          {/* Enhanced Tabs */}
          <div className="bg-white shadow flex items-center px-8 flex-shrink-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-3.5 text-sm font-medium border-b-3 transition-all duration-200 ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("quotations")}
              className={`px-5 py-3.5 text-sm font-medium border-b-3 transition-all duration-200 flex items-center gap-2 ${
                activeTab === "quotations"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              Quotations
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-5 py-3.5 text-sm font-medium border-b-3 transition-all duration-200 flex items-center gap-2 ${
                activeTab === "invoices"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Receipt className="w-4 h-4" />
              Invoices
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-auto">
            
            {activeTab === "overview" && (
              <div className=" w-full h-full overflow-hidden">
                
                {/* Enhanced Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition-shadow duration-300 p-8">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-sm">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Customer Info Grid */}
                  <div className="grid grid-cols-3">
                    {/* Column 1 */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">Customer Name</label>
                        <p className="text-sm font-semibold text-gray-900">{customer.customer_name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">Member Since</label>
                        <p className="text-sm font-semibold text-gray-900">Jan 15, 2021</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">Phone Number</label>
                        <p className="text-sm font-semibold text-gray-900">-</p>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">TPIN</label>
                        <p className="text-sm font-semibold text-gray-900">{customer.custom_customer_tpin || "-"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">Email Address</label>
                        <p className="text-sm font-semibold text-blue-600">-</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">Payment Terms</label>
                        <p className="text-sm font-semibold text-gray-900">-</p>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">Currency</label>
                        <p className="text-sm font-semibold text-gray-900">USD</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">Status</label>
                        <span className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                          customer.status === "active"
                            ? "bg-green-100 text-green-700"
                            : customer.status === "inactive"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {customer.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t-2 border-gray-100 my-2"></div>

                  {/* Address Section */}
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Address Information</h3>

                  <div className="grid grid-cols-2 gap-6">
                    
                    {/* Billing Address */}
                    <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900">Billing Address</h4>
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-all duration-200">
                          <Edit className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                      <div className="space-y-1.5 text-sm text-gray-700 leading-relaxed">
                        <p>123 Innovation Drive</p>
                        <p>Suite 450</p>
                        <p>Tech City, CA 94105</p>
                        <p>United States</p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900">Shipping Address</h4>
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-all duration-200">
                          <Edit className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                      <div className="space-y-1.5 text-sm text-gray-700 leading-relaxed">
                        <p>123 Innovation Drive</p>
                        <p>Suite 450</p>
                        <p>Tech City, CA 94105</p>
                        <p>United States</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {activeTab === "quotations" && (
              <div className="w-full h-full">
                <div className="bg-white rounded-xl border border-gray-200 shadow-md p-16 text-center">
                  <p className="text-gray-700 font-bold text-lg mb-2">No Quotations Yet</p>
                  <p className="text-sm text-gray-500 mb-8">Quotations will appear here once created</p>
                  <button 
                  onClick={() => setShowQuotationModal(true)}
                  className="px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Create Quotation
                  </button>
                </div>

                <QuotationModal
        isOpen={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
        onSubmit={(data) => {
          setShowQuotationModal(false);
            }}
                />
              </div>
              
            )}

            {activeTab === "invoices" && (
              <div className="w-full h-full">
                <div className="bg-white rounded-xl border border-gray-200 shadow-md p-16 text-center">
                  <Receipt className="w-20 h-20 mx-auto text-gray-300 mb-5" />
                  <p className="text-gray-700 font-bold text-lg mb-2">No Invoices Yet</p>
                  <p className="text-sm text-gray-500 mb-8">Invoices will appear here once created</p>
                  <button 
                  onClick={()=> setShowInvoiceModal(true)}
                  className="px-8 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Create Invoice
                  </button>
                </div>
                <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={(data) => {
          setShowInvoiceModal(false);
            }}
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
  
};

export default CustomerDetailView;
