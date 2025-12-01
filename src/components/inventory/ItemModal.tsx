import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const base_url = import.meta.env.VITE_BASE_URL;
const CREATE_ITEMS_ENDPOINT = `${base_url}.item.item.create_item_api`;
console.log("CREATE_ITEMS_ENDPOINT" + CREATE_ITEMS_ENDPOINT);

type FormState = Record<string, any>;

const emptyForm: Record<string, any> = {
  item_type: "Goods",
  item_name: "",
  item_code: "",
  item_group: "",
  custom_itemclscd: "",
  custom_itemtycd: 0,
  custom_orgnnatcd: "",
  custom_pkgunitcd: "",
  custom_svcchargeyn: "Y",
  custom_isrcaplcbyn: "Y",
  custom_selling_price: 0,
  custom_purchase_amount: "",
  custom_buying_price: 0,
  custom_suk: "",
  custom_vendor: "",
  custom_non_export_tax: "",
  custom_non_export_code: "",
  custom_non_export_name: "",
  custom_non_export_description: "",
  custom_non_export_tax_perct: "",
  custom_export_tax: "",
  custom_export_code: "",
  custom_export_name: "",
  custom_export_description: "",
  custom_export_tax_perct: "",

  custom_local_purchase_order_tax: "",
  custom_local_purchase_order_code: "",
  custom_local_purchase_order_name: "",
  custom_local_purchase_order_description: "",
  custom_local_purchase_order_perct: "",

  custom_dimension: "",
  custom_weight: "",
  custom_valuation: "",
  custom_is_track_inventory: true,
  custom_tracking_method: "None",
  custom_reorder_level: 0,
  custom_min_stock_level: 0,
  custom_max_stock_level: 0,
  custom_sales_account: "",
  custom_purchase_account: "",
  unitOfMeasureCd: "Nos",
  hsn_sac_unspc: "",
  description: "",
  sku: "",
  tax_preference: "Taxable",
  tax_rate: 0,
  preferred_vendor: "",
  opening_stock: 0,
  opening_stock_value: 0,
  valuation_method: "FIFO",
  tracking_method: "None",
  weight: 0,
  weight_unit: "kg",
  dimensions: "",
  brand: "",
  is_active: true,
  allow_alternative_unit: false,
  has_batch_or_serial: false,
  length: "",
  width: "",
  height: "",
  weightUnit: "",
};

const ItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "details" | "taxDetails" | "inventoryDetails"
  >("details");

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || emptyForm);
      setActiveTab("details");
    }
  }, [isOpen, initialData]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const payload = { ...form };
  //     let response;

  //     if (isEditMode && initialData?.item_code) {
  //       payload.id = initialData.item_code;
  //       console.log("payload.id " + initialData.item_code);
  //       const UPDATE_ITEMS_ENDPOINT = `${base_url}.item.item.update_item_api?item_code`;

  //       const updateUrl = `${UPDATE_ITEMS_ENDPOINT}?item_code=${initialData.item_code}`;

  //       response = await fetch(updateUrl, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: import.meta.env.VITE_AUTHORIZATION,
  //         },
  //         body: JSON.stringify(payload),
  //       });
  //     } else {
  //       response = await fetch(CREATE_ITEMS_ENDPOINT, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: import.meta.env.VITE_AUTHORIZATION,
  //         },
  //         body: JSON.stringify(payload),
  //       });
  //     }

  //     if (!response.ok) {
  //       const err = await response.json();
  //       throw new Error(err.message || "Failed to save Items");
  //     }

  //     const data = await response.json();

  //     console.log(isEditMode ? "Items updated successfully!" : "Items created successfully!");
  //     onSubmit?.({} as any);

  //     handleClose();
  //   } catch (err: any) {
  //     console.error("Save customer error:", err);
  //     console.log(err.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const payload = { ...form };

  //     let response;

  //     if (isEditMode && initialData?.item_code) {
  //       const itemCode = initialData.item_code;

  //       const UPDATE_ITEMS_ENDPOINT = `${base_url}item.item.update_item_api?item_code=${itemCode}`;

  //       response = await fetch(UPDATE_ITEMS_ENDPOINT, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: import.meta.env.VITE_AUTHORIZATION,
  //         },
  //         body: JSON.stringify(payload),
  //       });
  //     } else {
  //       response = await fetch(CREATE_ITEMS_ENDPOINT, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: import.meta.env.VITE_AUTHORIZATION,
  //         },
  //         body: JSON.stringify(payload),
  //       });
  //     }
  //     if (!response.ok) {
  //       let errorMessage = "Failed to save item";
  //       try {
  //         const errData = await response.json();
  //         errorMessage = errData.message || errorMessage;
  //       } catch {
  //         // ignore if no JSON
  //       }
  //       throw new Error(errorMessage);
  //     }

  //     const data = await response.json();

  //     alert(isEditMode ? "Item updated successfully!" : "Item created successfully!");
  //     onSubmit?.(data);
  //     handleClose();
  //   } catch (err: any) {
  //     console.error("Save item error:", err);
  //     alert(err.message || "Something went wrong while saving the item.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form };

      let response;

      if (isEditMode && initialData?.item_code) {
        // CORRECT UPDATE ENDPOINT
        const updateUrl = `${base_url}.item.item.update_item_api?item_code=${initialData.item_code}`;

        response = await fetch(updateUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AUTHORIZATION,
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(CREATE_ITEMS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AUTHORIZATION,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        let errorMessage = "Failed to save item";
        try {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();

      alert(
        isEditMode
          ? "Item updated successfully!"
          : "Item created successfully!",
      );

      // This triggers refresh in parent
      onSubmit?.(data);
      handleClose();
    } catch (err: any) {
      console.error("Save item error:", err);
      alert(err.message || "Something went wrong while saving the item.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const handleForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">
                Add Items
              </h2>
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
                          <span className="font-medium text-gray-600">
                            Item Type
                          </span>
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

                        <Input
                          label="Items Name"
                          name="item_name"
                          value={form.item_name || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                          required
                        />
                        <Input
                          label="Description"
                          name="description"
                          value={form.description || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Item Group"
                          name="item_group"
                          value={form.item_group || ""}
                          onChange={handleForm}
                          className="w-full"
                          required
                        />
                        <Input
                          label="Item Class Code"
                          name="custom_itemclscd"
                          value={form.custom_itemclscd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Item Packaging Code "
                          name="custom_pkgunitcd"
                          value={form.custom_pkgunitcd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Item Type Code"
                          name="custom_itemtycd"
                          value={form.custom_itemtycd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Country Code"
                          name="custom_orgnnatcd"
                          value={form.custom_orgnnatcd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="HSN/SAC/UNSPC"
                          name="unspc"
                          value={form.unspc || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Unit of Measurement"
                          name="unitOfMeasureCd"
                          value={form.unitOfMeasureCd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">
                            SVC Charge
                          </span>
                          <select
                            name="svcChargeYn"
                            value={form.svcChargeYn || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">INS</span>
                          <select
                            name="isrcAplcbYn"
                            value={form.isrcAplcbYn || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            required
                          >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </label>
                        <Input
                          label="SKU"
                          name="sku"
                          value={form.sku || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                      </div>
                    </div>

                    <h3 className="py-6 text-lg font-semibold text-gray-700 underline">
                      Sales & Purchase
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Selling Price"
                          name="custom_selling_price"
                          value={form.custom_selling_price || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Sales Account"
                          name="salesAccount"
                          value={form.salesAccount || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Buying Price"
                          name="custom_buying_price"
                          value={form.custom_buying_price || ""}
                          onChange={handleForm}
                          className="w-full"
                        />
                        <Input
                          label="Purchase Account"
                          name="purchaseAccount"
                          value={form.purchaseAccount || ""}
                          onChange={handleForm}
                          className="w-full"
                        />
                        <Input
                          label="Tax"
                          name="tax"
                          value={form.tax || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Preferred Vendor"
                          name="prefferedVendor"
                          value={form.prefferedVendor || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* {activeTab === "taxDetails" && (
  <>
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
            {nonExportRows.map((form, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">
                  <input type="text" value={} onChange={(e) => handleNonExportChange(index, "tax", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="e.g. VAT" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={form.code || ""} onChange={(e) => handleNonExportChange(index, "code", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="V001" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={form.name || ""} onChange={(e) => handleNonExportChange(index, "name", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Standard VAT" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={form.description || ""} onChange={(e) => handleNonExportChange(index, "description", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="12% VAT on non-export" />
                </td>
                <td className="border px-2 py-1">
                  <input type="text" value={form.rate || ""} onChange={(e) => handleNonExportChange(index, "rate", e.target.value)} className="w-20 px-2 py-1.5 border rounded text-xs text-right" placeholder="12" />
                </td>

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
            {exportRows.map((form, index) => (
              <tr key={index}>
                <td className="border px-2 py-1"><input type="text" value={form.tax || ""} onChange={(e) => handleExportChange(index, "tax", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Zero Rated" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.code || ""} onChange={(e) => handleExportChange(index, "code", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="ZR01" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.name || ""} onChange={(e) => handleExportChange(index, "name", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Zero Rated Export" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.description || ""} onChange={(e) => handleExportChange(index, "description", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="0% on exports" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.rate || ""} onChange={(e) => handleExportChange(index, "rate", e.target.value)} className="w-20 px-2 py-1.5 border rounded text-xs text-right" placeholder="0" /></td>

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
            {localRows.map((form, index) => (
              <tr key={index}>
                <td className="border px-2 py-1"><input type="text" value={form.tax || ""} onChange={(e) => handleLocalChange(index, "tax", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Local VAT" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.code || ""} onChange={(e) => handleLocalChange(index, "code", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="LV05" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.name || ""} onChange={(e) => handleLocalChange(index, "name", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Local Purchase VAT" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.description || ""} onChange={(e) => handleLocalChange(index, "description", e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="5% on local purchases" /></td>
                <td className="border px-2 py-1"><input type="text" value={form.rate || ""} onChange={(e) => handleLocalChange(index, "rate", e.target.value)} className="w-20 px-2 py-1.5 border rounded text-xs text-right" placeholder="5" /></td>

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
)} */}

                {activeTab === "taxDetails" && (
                  <>
                    {/* Non-Export Table */}
                    <div className="mb-10">
                      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">
                        Non-Export
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-4 py-2 text-center">
                                Tax
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Code
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Name
                              </th>
                              <th className="border px-6 py-2 text-center">
                                Description
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Tax %
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_non_export_tax"
                                  value={form.custom_non_export_tax || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="e.g. VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_non_export_code"
                                  value={form.custom_non_export_code || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="V001"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_non_export_name"
                                  value={form.custom_non_export_name || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Standard VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_non_export_description"
                                  value={
                                    form.custom_non_export_description || ""
                                  }
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="12% VAT on non-export"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_non_export_tax_perct"
                                  value={form.custom_non_export_tax_perct || ""}
                                  onChange={handleForm}
                                  className="w-20 px-2 py-1.5 border rounded text-xs text-right"
                                  placeholder="12"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Export Table */}
                    <div className="mb-10">
                      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">
                        Export
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-4 py-2 text-center">
                                Tax
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Code
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Name
                              </th>
                              <th className="border px-6 py-2 text-center">
                                Description
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Tax %
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_export_tax"
                                  value={form.custom_export_tax || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Zero Rated"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_export_code"
                                  value={form.custom_export_code || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="ZR01"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_export_name"
                                  value={form.custom_export_name || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Zero Rated Export"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_export_description"
                                  value={form.custom_export_description || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="0% on exports"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_export_tax_perct"
                                  value={form.custom_export_tax_perct || ""}
                                  onChange={handleForm}
                                  className="w-20 px-2 py-1.5 border rounded text-xs text-right"
                                  placeholder="0"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Local Purchase Order Table */}
                    <div className="mb-6">
                      <h4 className="mb-4 text-lg font-semibold text-gray-700 underline">
                        Local Purchase Order
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-4 py-2 text-center">
                                Tax
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Code
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Name
                              </th>
                              <th className="border px-6 py-2 text-center">
                                Description
                              </th>
                              <th className="border px-4 py-2 text-center">
                                Tax %
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_local_purchase_order_tax"
                                  value={
                                    form.custom_local_purchase_order_tax || ""
                                  }
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Local VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_local_purchase_order_code"
                                  value={
                                    form.custom_local_purchase_order_code || ""
                                  }
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="LV05"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_local_purchase_order_name"
                                  value={
                                    form.custom_local_purchase_order_name || ""
                                  }
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Local Purchase VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_local_purchase_order_description"
                                  value={
                                    form.custom_local_purchase_order_description ||
                                    ""
                                  }
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="5% on local purchases"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="custom_local_purchase_order_perct"
                                  value={
                                    form.custom_local_purchase_order_perct || ""
                                  }
                                  onChange={handleForm}
                                  className="w-20 px-2 py-1.5 border rounded text-xs text-right"
                                  placeholder="5"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "inventoryDetails" && (
                  <>
                    <h3 className=" mb-2 text-lg font-semibold text-gray-700 underline">
                      Inventory Details
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Brand"
                          name="brand"
                          value={form.brand}
                          onChange={handleForm}
                          className="w-full"
                        />

                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-600 text-sm">
                            Dimensions (L × W × H)
                          </span>
                          <div className="flex items-center gap-1">
                            <Input
                              label=""
                              name="length"
                              placeholder="L"
                              value={form.length || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <span className="text-gray-500 font-medium">×</span>

                            <Input
                              label=""
                              name="width"
                              placeholder="W"
                              value={form.width || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <span className="text-gray-500 font-medium">×</span>

                            <Input
                              label=""
                              name="height"
                              placeholder="H"
                              value={form.height || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

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

                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-600 text-sm">
                            Weight
                          </span>
                          <div className="flex gap-2">
                            <Input
                              label=""
                              name="custom_weight"
                              placeholder="0"
                              value={form.custom_weight}
                              onChange={handleForm}
                              className="flex-1"
                            />
                            <select
                              name="weightUnit"
                              value={form.weightUnit || "kg"}
                              onChange={handleForm}
                              // className="w-28 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              className="w-16 px-1 py-1.5 text-xs border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                          <span className="font-medium text-gray-600">
                            Valuation Method
                          </span>
                          <select
                            name="valutaionMethod"
                            value={form.valutaionMethod || ""}
                            onChange={handleForm}
                            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                          >
                            <option value="">Select...</option>
                            <option value="FIFO">FIFO</option>
                            <option value="WAC">WAC</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-6 col-span-full lg:col-span-4 xl:col-span-3 space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="trackInventory"
                          name="trackInventory"
                          checked={form.trackInventory || false}
                          onChange={(e) =>
                            handleForm({
                              target: {
                                name: "trackInventory",
                                value: e.target.checked,
                              },
                            })
                          }
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
                            <option value="serial">
                              Serial Number (SR No)
                            </option>
                            <option value="imei">IMEI</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <h3 className=" mt-12 text-lg font-semibold text-gray-700 underline">
                      Stock Level Tracking
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Min Stock Level"
                          name="custom_min_stock_level"
                          value={form.custom_min_stock_level}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Max Stock Level"
                          name="custom_max_stock_level"
                          value={form.custom_max_stock_level}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Re-order Level"
                          name="custom_reorder_level"
                          value={form.custom_reorder_level}
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
                <button
                  type="submit"
                  // onClick={submit}
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
