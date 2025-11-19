import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any; // Optional initial data (edit mode)
}

// Use a flexible type instead of strict FormData since backend defines full schema
type FormState = Record<string, any>;

const emptyForm: Record<string, any> = {
  // === Basic Info ===
  item_type: "Goods",                     // Important default
  items_name: "",
  description: "",
  item_group: "",
  hsn_sac_unspc: "",
  unit_of_measurement: "Nos",             // Common default
  sku: "",

  // === Sales & Purchase ===
  selling_price: 0,
  sales_account: "",
  purchase_price: 0,
  purchase_account: "",
  tax_preference: "Taxable",              // Important default
  tax_rate: 0,
  preferred_vendor: "",

  // === Inventory ===
  track_inventory: true,                  // Most items are tracked
  opening_stock: 0,
  opening_stock_value: 0,
  min_stock_level: 0,
  max_stock_level: 0,
  reorder_level: 0,
  valuation_method: "FIFO",               // Common default
  tracking_method: "None",                // None, Batch, Serial, IMEI

  // === Physical ===
  weight: 0,
  weight_unit: "kg",
  dimensions: "",
  brand: "",

  // === Status & Flags ===
  is_active: true,
  allow_alternative_unit: false,
  has_batch_or_serial: false,
};

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<FormState>(emptyForm);

  // Fixed tab typo & duplicate value
  const [activeTab, setActiveTab] = useState<"details" | "taxDetails" | "inventoryDetails">("details");

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setForm(initialData || emptyForm);
      setActiveTab("details");
    }
  }, [isOpen, initialData]);

  const emptyRow = { tax: "", code: "", name: "", description: "", rate: "" };


  const [nonExportRows, setNonExportRows] = useState<TaxRow[]>([emptyRow]);
const [exportRows, setExportRows] = useState<TaxRow[]>([emptyRow]);
const [localRows, setLocalRows] = useState<TaxRow[]>([emptyRow]);

const handleExportChange = (index: number, field: keyof TaxRow, value: string) => {
  setExportRows(rows => rows.map((row, i) => i === index ? { ...row, [field]: value } : row));
};

const handleLocalChange = (index: number, field: keyof TaxRow, value: string) => {
  setLocalRows(rows => rows.map((row, i) => i === index ? { ...row, [field]: value } : row));
};

type TaxRow = {
  tax: string;
  code: string;
  name: string;
  description: string;
  rate: string;
};

// Handlers
const addNonExportRow = () => setNonExportRows([...nonExportRows, { tax: "", code: "", name: "", description: "", rate: "" }]);
const addExportRow = () => setExportRows([...exportRows, { tax: "", code: "", name: "", description: "", rate: "" }]);
const addLocalRow = () => setLocalRows([...localRows, { tax: "", code: "", name: "", description: "", rate: "" }]);

const deleteNonExportRow = (i: number) => setNonExportRows(nonExportRows.filter((_, idx) => idx !== i));
const deleteExportRow = (i: number) => setExportRows(exportRows.filter((_, idx) => idx !== i));
const deleteLocalRow = (i: number) => setLocalRows(localRows.filter((_, idx) => idx !== i));

const handleNonExportChange = (index: number, field: keyof TaxRow, value: string) => {
  setNonExportRows(rows => rows.map((row, i) => i === index ? { ...row, [field]: value } : row));
};

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          {/* <form onSubmit={submit} className="flex flex-col h-full overflow-hidden"> */}
          <form className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">Add Items</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

            {/* Tabs */}
            <div className="flex border-b bg-gray-50">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "details"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Item Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("taxDetails")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "taxDetails"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tax Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inventoryDetails")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "inventoryDetails"
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Inventory Details
              </button>
            </div>

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="gap-6 max-h-screen overflow-auto p-4">
                {activeTab === "details" && (
                  <>
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                      Items Information
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">Item Type</span>
                          <select
                            name="itemType"
                            value={form.itemType || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Goods">Goods</option>
                            <option value="Service">Service</option>
                          </select>
                        </label>

                        <Input label="Items Name" name="itemsName" value={form.itemsName || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Description" name="description" value={form.description || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Item Group" name="itemsGroup" value={form.itemsGroup || ""} onChange={handleForm} className="w-full" />
                        <Input label="HSN/SAC/UNSPC" name="unspc" value={form.unspc || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Unit of Measurement" name="unitOfMeasurement" value={form.unitOfMeasurement || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="SKU" name="sku" value={form.sku || ""} onChange={handleForm} className="w-full col-span-3" />
                      </div>
                    </div>

                    <h3 className="py-6 text-lg font-semibold text-gray-700 underline">
                      Sales & Purchase
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input label="Selling Price" name="sellingPrice" value={form.sellingPrice || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Sales Account" name="salesAccount" value={form.salesAccount || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Purchase Account" name="purchaseAccount" value={form.purchaseAccount || ""} onChange={handleForm} className="w-full" />
                        <Input label="Tax" name="tax" value={form.tax || ""} onChange={handleForm} className="w-full col-span-3" />
                        <Input label="Preferred Vendor" name="prefferedVendor" value={form.prefferedVendor || ""} onChange={handleForm} className="w-full col-span-3" />
                      </div>
                    </div>
                  </>
                )}

                {/* {activeTab === "taxDetails" && (
                  <>
                  <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                    Tax Details
                  </h3>
                 <div className="flex flex-col justify-center gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <div className=" grid col-span-1 gap-4">
                          <h4 className=" flex justify-center text-base font-semibold text-black">Export</h4>
                          <div className=" flex justify-between">
                          <div>Tax Category</div>
                          <div>Tax %</div>
                          </div>
                        </div>
                        <div className=" grid col-span-1 gap-4">
                          <h4 className=" flex justify-center text-base font-semibold text-black">Non-Export</h4>
                          <div>Tax Category</div>
                          <div>Tax %</div>
                        </div>
                        <div className=" grid col-span-1 gap-4">
                          <h4 className=" flex justify-center text-base font-semibold text-black">Local Purchase Order</h4>
                          <div>Tax Category</div>
                          <div>Tax %</div>
                        </div>
                      </div>
                  </div>
                  </>
                )} */}
                {/* {activeTab === "taxDetails" && (
  <>
    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
      Tax Details
    </h3>

    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-center">Export</th>
            <th className="border px-4 py-2 text-center">Non-Export</th>
            <th className="border px-4 py-2 text-center">Local Purchase Order</th>
          </tr>
        </thead>

        <tbody>
           <tr className="bg-gray-50">
            <td className="border px-4 py-2">
              <div className="flex justify-between font-semibold">
                <span>Tax Category</span>
                <span>Tax %</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between font-semibold">
                <span>Tax Category</span>
                <span>Tax %</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between font-semibold">
                <span>Tax Category</span>
                <span>Tax %</span>
              </div>
            </td>
          </tr>

           <tr>
            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Zero Rated</span>
                <span>0%</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Standard VAT</span>
                <span>12%</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Local VAT</span>
                <span>5%</span>
              </div>
            </td>
          </tr>

           <tr>
            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Special Export Duty</span>
                <span>2%</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Reduced VAT</span>
                <span>8%</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Local Service Tax</span>
                <span>3%</span>
              </div>
            </td>
          </tr>

           <tr>
            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Export Handling Fee</span>
                <span>1%</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Luxury Goods Tax</span>
                <span>15%</span>
              </div>
            </td>

            <td className="border px-4 py-2">
              <div className="flex justify-between">
                <span>Local Surcharge</span>
                <span>4%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
)} */}

{/* {activeTab === "taxDetails" && (
  <>
    <div className="mb-6">
      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">
        Non-Export
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Tax</th>
              <th className="border px-4 py-2 text-center">Code</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-6 py-2 text-center">Description</th>
              <th className="border px-4 py-2 text-center">Tax %</th>
              <th className="border px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {nonExportRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.tax}
                    onChange={(e) => handleNonExportChange(index, "tax", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. VAT"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.code}
                    onChange={(e) => handleNonExportChange(index, "code", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. V001"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleNonExportChange(index, "name", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Standard VAT"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleNonExportChange(index, "description", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="12% VAT on non-export"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.rate}
                    onChange={(e) => handleNonExportChange(index, "rate", e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="12"
                  />
                </td>
                <td className="border text-center">
                  <button
                    type="button"
                    onClick={() => deleteNonExportRow(index)}
                    className="text-red-600 hover:text-red-800 text-xl leading-none"
                    title="Delete"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}

            {nonExportRows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                  No Non-Export tax rows added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addNonExportRow}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium transition"
        >
          + Add Row
        </button>
      </div>
    </div>

     <div className="mb-6">
      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">
        Export
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Tax</th>
              <th className="border px-4 py-2 text-center">Code</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-6 py-2 text-center">Description</th>
              <th className="border px-4 py-2 text-center">Tax %</th>
              <th className="border px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {exportRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.tax}
                    onChange={(e) => handleExportChange(index, "tax", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. Zero Rated"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.code}
                    onChange={(e) => handleExportChange(index, "code", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="ZR01"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleExportChange(index, "name", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Zero Rated Export"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleExportChange(index, "description", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="0% on exports"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.rate}
                    onChange={(e) => handleExportChange(index, "rate", e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="0"
                  />
                </td>
                <td className="border text-center">
                  <button
                    type="button"
                    onClick={() => deleteExportRow(index)}
                    className="text-red-600 hover:text-red-800 text-xl leading-none"
                    title="Delete"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}

            {exportRows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                  No Export tax rows added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addExportRow}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium transition"
        >
          + Add Row
        </button>
      </div>
    </div>

     <div className="mb-2">
      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">
        Local Purchase Order
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Tax</th>
              <th className="border px-4 py-2 text-center">Code</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-6 py-2 text-center">Description</th>
              <th className="border px-4 py-2 text-center">Tax %</th>
              <th className="border px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {localRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.tax}
                    onChange={(e) => handleLocalChange(index, "tax", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="e.g. Local VAT"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.code}
                    onChange={(e) => handleLocalChange(index, "code", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="LV05"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleLocalChange(index, "name", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Local Purchase VAT"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleLocalChange(index, "description", e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="5% on local purchases"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={row.rate}
                    onChange={(e) => handleLocalChange(index, "rate", e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="5"
                  />
                </td>
                <td className="border text-center">
                  <button
                    type="button"
                    onClick={() => deleteLocalRow(index)}
                    className="text-red-600 hover:text-red-800 text-xl leading-none"
                    title="Delete"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}

            {localRows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                  No Local Purchase Order tax rows added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="button"
          onClick={addLocalRow}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium transition"
        >
          + Add Row
        </button>
      </div>
    </div>
  </>
)} */}
{activeTab === "taxDetails" && (
  <>
    {/* NON-EXPORT TABLE */}
    <div className="mb-10">
      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">Non-Export</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Tax</th>
              <th className="border px-4 py-2 text-center">Code</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-6 py-2 text-center">Description</th>
              <th className="border px-4 py-2 text-center">Tax %</th>
              <th className="border px-4 py-2 text-center">Action</th>
              <th className="border px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {nonExportRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">
                  <input type="text" value={row.tax || ""} onChange={(e) => handleNonExportChange(index, "tax", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="e.g. VAT" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={row.code || ""} onChange={(e) => handleNonExportChange(index, "code", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="V001" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={row.name || ""} onChange={(e) => handleNonExportChange(index, "name", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Standard VAT" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={row.description || ""} onChange={(e) => handleNonExportChange(index, "description", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="12% VAT on non-export" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={row.rate || ""} onChange={(e) => handleNonExportChange(index, "rate", e.target.value)} className="w-20 px-2 py-1.5 border rounded text-xs text-right" placeholder="12" />
                </td>

                {/* + Add Button - Always on last row */}
                <td className="border text-center align-middle">
                  {index === nonExportRows.length - 1 && (
                    <button
                      type="button"
                      onClick={addNonExportRow}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition"
                    >
                      + Add Row
                    </button>
                  )}
                </td>

                {/* Delete Button - Hide if only one row */}
                <td className="border text-center align-middle">
                  {nonExportRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteNonExportRow(index)}
                      className="text-red-600 hover:text-red-800 text-xl"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* EXPORT TABLE - Fixed condition */}
    <div className="mb-10">
      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">Export</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Tax</th>
              <th className="border px-4 py-2 text-center">Code</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-6 py-2 text-center">Description</th>
              <th className="border px-4 py-2 text-center">Tax %</th>
              <th className="border px-4 py-2 text-center">Action</th>
              <th className="border px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {exportRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-1"><input type="text" value={row.tax || ""} onChange={(e) => handleExportChange(index, "tax", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Zero Rated" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.code || ""} onChange={(e) => handleExportChange(index, "code", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="ZR01" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.name || ""} onChange={(e) => handleExportChange(index, "name", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Zero Rated Export" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.description || ""} onChange={(e) => handleExportChange(index, "description", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="0% on exports" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.rate || ""} onChange={(e) => handleExportChange(index, "rate", e.target.value)} className="w-20 px-2 py-1.5 border rounded text-xs text-right" placeholder="0" /></td>

                <td className="border text-center align-middle">
                  {index === exportRows.length - 1 && (
                    <button
                      type="button"
                      onClick={addExportRow}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition"
                    >
                      + Add Row
                    </button>
                  )}
                </td>

                <td className="border text-center align-middle">
                  {exportRows.length > 1 && (
                    <button type="button" onClick={() => deleteExportRow(index)} className="text-red-600 hover:text-red-800 text-xl">×</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* LOCAL PURCHASE ORDER TABLE - Fixed condition */}
    <div className="mb-6">
      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">Local Purchase Order</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Tax</th>
              <th className="border px-4 py-2 text-center">Code</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-6 py-2 text-center">Description</th>
              <th className="border px-4 py-2 text-center">Tax %</th>
              <th className="border px-4 py-2 text-center">Action</th>
              <th className="border px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {localRows.map((row, index) => (
              <tr key={index}>
                <td className="border px-2 py-1"><input type="text" value={row.tax || ""} onChange={(e) => handleLocalChange(index, "tax", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Local VAT" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.code || ""} onChange={(e) => handleLocalChange(index, "code", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="LV05" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.name || ""} onChange={(e) => handleLocalChange(index, "name", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Local Purchase VAT" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.description || ""} onChange={(e) => handleLocalChange(index, "description", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="5% on local purchases" /></td>
                <td className="border px-2 py-1"><input type="text" value={row.rate || ""} onChange={(e) => handleLocalChange(index, "rate", e.target.value)} className="w-20 px-2 py-1.5 border rounded text-xs text-right" placeholder="5" /></td>

                <td className="border text-center align-middle">
                  {index === localRows.length - 1 && (
                    <button
                      type="button"
                      onClick={addLocalRow}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded transition"
                    >
                      + Add Row
                    </button>
                  )}
                </td>

                <td className="border text-center align-middle">
                  {localRows.length > 1 && (
                    <button type="button" onClick={() => deleteLocalRow(index)} className="text-red-600 hover:text-red-800 text-xl">×</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
)}

                {activeTab === "inventoryDetails" && (
                  <>
                    <h3 className=" mb-2 text-lg font-semibold text-gray-700 underline">Inventory Details</h3>
                   {/* <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Brand"
                          name="brand"
                          value={form.brand}
                          onChange={handleForm}
                          className="w-full"
                        /> 
                        <Input
                          label="Dimensions"
                          name="dimensions"
                          placeholder="L x W x D"
                          value={form.dimensions}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">DimensionType</span>
                          <select
                            name="dimensionType"
                            value={form.dimensionType || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="cm">cm</option>
                            <option value="inch">in</option>
                          </select>
                        </label>
                        <Input
                          label="Weight (Grams/Kg/Lbs/Oz)"
                          name="weight"
                          placeholder="Grams/Kg/Lbs/Oz"
                          value={form.weight}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                         <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">WeightUnit</span>
                          <select
                            name="weightUnit"
                            value={form.weightUnit || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                             <option value="g">Grams</option>
                             <option value="kg">Kg</option>
                           <option value="lbs">Lbs</option>
                            <option value="oz">Oz</option>
                          </select>
                        </label>
                        
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">Valuation Method</span>
                          <select
                            name="valutaionMethod"
                            value={form.valutaionMethod || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Goods">FIFO</option>
                            <option value="Service">WAC</option>
                          </select>
                        </label>
                        
                      </div>
                     </div> */}

                     {/* <div className="flex flex-col gap-4">
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

     <Input
      label="Brand"
      name="brand"
      value={form.brand}
      onChange={handleForm}
      className="w-full"
    />

     <div className="flex flex-col gap-1">
      <span className="font-medium text-gray-600 text-sm">Dimensions</span>
      <div className="flex gap-2">
        <Input
          label=""
          name="dimensions"
          placeholder="L x W x D"
          value={form.dimensions}
          onChange={handleForm}
          className="flex-1"
        />
        <select
          name="dimensionType"
          value={form.dimensionType || ""}
          onChange={handleForm}
          className="w-24 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        >
          <option value="cm">cm</option>
          <option value="in">in</option>
        </select>
      </div>
    </div>

     <div className="flex flex-col gap-1">
      <span className="font-medium text-gray-600 text-sm">Weight</span>
      <div className="flex gap-2">
        <Input
        label=""
          name="weight"
          placeholder="0"
          value={form.weight}
          onChange={handleForm}
          className="flex-1"
        />
        <select
          name="weightUnit"
          value={form.weightUnit || ""}
          onChange={handleForm}
          className="w-28 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        >
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
          <option value="oz">oz</option>
        </select>
      </div>
    </div>

     <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-600">Valuation Method</span>
      <select
        name="valutaionMethod"
        value={form.valutaionMethod || ""}
        onChange={handleForm}
        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
        required
      >
        <option value="FIFO">FIFO</option>
        <option value="WAC">WAC</option>
      </select>
    </div>

  </div>
</div>
    */}
    <div className="flex flex-col gap-4">
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

    {/* Row 1 - Brand */}
    <Input
      label="Brand"
      name="brand"
      value={form.brand}
      onChange={handleForm}
      className="w-full"
    />

  {/* Enhanced Dimensions: L x W x H + Unit - Compact & Balanced */}
<div className="flex flex-col gap-1">
  <span className="font-medium text-gray-600 text-sm">Dimensions (L × W × H)</span>
  <div className="flex items-center gap-1">
    {/* Length */}
    <Input
      label=""
      name="length"
      placeholder="L"
      value={form.length || ""}
      onChange={handleForm}
      className="w-full text-center text-xs"
      // inputClassName="py-1.5"
    />

    <span className="text-gray-500 font-medium">×</span>

    {/* Width */}
    <Input
      label=""
      name="width"
      placeholder="W"
      value={form.width || ""}
      onChange={handleForm}
      className="w-full text-center text-xs"
      // inputClassName="py-1.5"
    />

    <span className="text-gray-500 font-medium">×</span>

    {/* Height */}
    <Input
      label=""
      name="height"
      placeholder="H"
      value={form.height || ""}
      onChange={handleForm}
      className="w-full text-center text-xs"
    />

    {/* Unit - Compact */}
    <select
      name="dimensionType"
      value={form.dimensionType || "cm"}
      onChange={handleForm}
      className="w-16 px-1 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <option value="cm">cm</option>
      <option value="in">in</option>
    </select>
  </div>
</div>

    {/* Weight + Unit */}
    <div className="flex flex-col gap-1">
      <span className="font-medium text-gray-600 text-sm">Weight</span>
      <div className="flex gap-2">
        <Input
          label=""
          name="weight"
          placeholder="0"
          value={form.weight}
          onChange={handleForm}
          className="flex-1"
        />
        <select
          name="weightUnit"
          value={form.weightUnit || "kg"}
          onChange={handleForm}
          className="w-28 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="gm">gm</option>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
          <option value="oz">oz</option>
        </select>
      </div>
    </div>

    {/* Valuation Method */}
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-600">Valuation Method</span>
      <select
        name="valutaionMethod"
        value={form.valutaionMethod || ""}
        onChange={handleForm}
        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
        required
      >
        <option value="">Select...</option>
        <option value="FIFO">FIFO</option>
        <option value="WAC">WAC</option>
      </select>
    </div>
  </div>
</div>

 <div className=" mt-6 col-span-full lg:col-span-4 xl:col-span-3 space-y-4">

  {/* Checkbox Row */}
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      id="trackInventory"
      name="trackInventory"
      checked={form.trackInventory || false}
      onChange={(e) => handleForm({
        target: { name: "trackInventory", value: e.target.checked }
      })}
      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
    />
    <label
      htmlFor="trackInventory"
      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
    >
      Track Inventory 
    </label>
  </div>

   {form.trackInventory && (
    <div className="ml-8 max-w-md">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        Tracking Method
      </label>
      <select
        name="trackingMethod"   
        value={form.trackingMethod || ""}
        onChange={handleForm}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        required
      >
        <option value="">Select tracking method...</option>
        <option value="none">Normal (No tracking)</option>
        <option value="batch">Batch</option>
        <option value="serial">Serial Number (SR No)</option>
        <option value="imei">IMEI</option>
      </select>
    </div>
  )}

</div>

                      <h3 className=" mt-12 text-lg font-semibold text-gray-700 underline">Stock Level Tracking</h3>
                   <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Min Stock Level"
                          name="minStockLevel"
                          value={form.minStockLevel}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Max Stock Level"
                          name="maxStockLevel"
                          value={form.maxStockLevel}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Re-order Level"
                          name="reOrderLevel"
                          value={form.reOrderLevel}
                          onChange={handleForm}
                          className="w-full"
                        />
                      </div>
                     </div> 
                      </>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                >
                  Reset
                </button>
                {/* <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save Item
                </button> */}
                <button
  type="button"
  onClick={submit}
  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600"
>
  Save Item
</button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Input component unchanged
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-gray-600">{label}</span>
    <input
      ref={ref}
      className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        props.disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

export default ItemModal;