import React, { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";

// ✅ Reusable Modal Component
const Modal = ({ title, isOpen, onClose, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg">✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const SalesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState("product-master");
  const location = useLocation();

  // Core Data States
  const [products, setProducts] = useState([
    { item_id: "P001", item_name: "Laptop", uom: "Unit", base_price: 1200, category: "Electronics", tax_code: "GST18" },
    { item_id: "P002", item_name: "Mouse", uom: "Unit", base_price: 25, category: "Accessories", tax_code: "GST18" },
  ]);

  const [quotations, setQuotations] = useState([
    { quotation_id: "QUO-001", date: "2025-10-14", amount: 25000, status: "PENDING", validUntil: "2025-11-14" },
    { quotation_id: "QUO-002", date: "2025-10-13", amount: 15000, status: "APPROVED", validUntil: "2025-11-13" },
  ]);

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);

  // Handlers
  const addProduct = (product: any) => {
    setProducts([
      ...products,
      { ...product, item_id: `P${(products.length + 1).toString().padStart(3, "0")}` },
    ]);
  };

  const addQuotation = (quotation: any) => {
    setQuotations([
      ...quotations,
      { ...quotation, quotation_id: `QUO-${(quotations.length + 1).toString().padStart(3, "0")}` },
    ]);
  };

  const tabs = [
    "product-master",
    "sales-quotation",
    "sales-order",
    "delivery-note",
    "sales-invoice",
    "return-note",
    "tax-charges",
    "inventory-linkage",
    "sales-reports",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
     {/* Navigation Box */}
<div className="bg-white shadow-2xl rounded-xl mx-6 mt-6 p-4 border border-gray-200">
  <div className="flex flex-wrap items-center justify-between">
    {/* Title */}
    <h1 className="text-2xl font-bold text-teal-700 mb-2 sm:mb-0">Sales Module</h1>

    {/* Tabs */}
    <div className="flex flex-wrap items-center gap-2">
      {/* Always visible important tabs */}
      {[
        "product-master",
        "sales-order",
        "delivery-note",
        "sales-invoice",
        "sales-quotation",
        "return-note",
        "tax-charges",
      ].map((tab) => (
        <Link
          key={tab}
          to={`/${tab}`}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === tab
              ? "bg-teal-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-teal-100"
          }`}
        >
          {tab
            .split("-")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" ")}
        </Link>
      ))}

      {/* Dropdown for optional components */}
      <div>
        <select
          value={activeTab}
          onChange={(e) => {
            const tab = e.target.value;
            setActiveTab(tab);
            window.history.pushState({}, "", `/${tab}`);
          }}
          className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">More...</option>
          {["inventory-linkage", "sales-reports"].map((tab) => (
            <option key={tab} value={tab}>
              {tab
                .split("-")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ")}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
</div>




      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Routes>
            {/* Product Master */}
            <Route
              path="/product-master"
              element={
                <>
                  <div className="flex justify-between mb-4 items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Product Master</h3>
                    <button
                      onClick={() => setShowProductModal(true)}
                      className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                    >
                      <Plus size={18} className="mr-1" /> Add Product
                    </button>
                  </div>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Base Price</th>
                        <th className="p-2 border">Tax Code</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.item_id} className="border hover:bg-gray-50">
                          <td className="p-2">{p.item_id}</td>
                          <td className="p-2">{p.item_name}</td>
                          <td className="p-2">{p.category}</td>
                          <td className="p-2">${p.base_price}</td>
                          <td className="p-2">{p.tax_code}</td>
                          <td className="p-2 flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              }
            />

            {/* Sales Quotation */}
            <Route
              path="/sales-quotation"
              element={
                <>
                  <div className="flex justify-between mb-4 items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Sales Quotation</h3>
                    <button
                      onClick={() => setShowQuotationModal(true)}
                      className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                    >
                      <Plus size={18} className="mr-1" /> New Quotation
                    </button>
                  </div>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-2 border">Quotation ID</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Valid Until</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotations.map((q) => (
                        <tr key={q.quotation_id} className="border hover:bg-gray-50">
                          <td className="p-2">{q.quotation_id}</td>
                          <td className="p-2">{q.date}</td>
                          <td className="p-2">₹ {q.amount}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-white ${
                                q.status === "PENDING"
                                  ? "bg-orange-500"
                                  : q.status === "APPROVED"
                                  ? "bg-green-600"
                                  : "bg-gray-500"
                              }`}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td className="p-2">{q.validUntil}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              }
            />

            {/* Others Placeholder */}
            <Route path="*" element={<p className="text-gray-600">Select a section from above tabs.</p>} />
          </Routes>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        <Modal
          title="Add New Product"
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = Object.fromEntries(new FormData(form).entries());
              addProduct(data);
              setShowProductModal(false);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input name="item_name" placeholder="Item Name" className="border p-2 rounded" required />
              <input name="category" placeholder="Category" className="border p-2 rounded" />
              <input name="base_price" type="number" placeholder="Base Price" className="border p-2 rounded" />
              <input name="tax_code" placeholder="Tax Code" className="border p-2 rounded" />
            </div>
            <div className="mt-4 flex justify-end">
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                Save
              </button>
            </div>
          </form>
        </Modal>
      </AnimatePresence>

      {/* Quotation Modal */}
      <AnimatePresence>
        <Modal
          title="New Sales Quotation"
          isOpen={showQuotationModal}
          onClose={() => setShowQuotationModal(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const data = Object.fromEntries(new FormData(form).entries());
              addQuotation({ ...data, date: new Date().toISOString().split("T")[0] });
              setShowQuotationModal(false);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <input name="amount" type="number" placeholder="Quotation Amount" className="border p-2 rounded" />
              <select name="status" className="border p-2 rounded">
                <option value="DRAFT">DRAFT</option>
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
              </select>
              <input name="validUntil" type="date" className="border p-2 rounded" />
            </div>
            <div className="mt-4 flex justify-end">
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                Save
              </button>
            </div>
          </form>
        </Modal>
      </AnimatePresence>
    </div>
  );
};

export default SalesModule;
