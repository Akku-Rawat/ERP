import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { updateItemByItemCode, createItem } from "../../api/itemApi";
import ItemCategorySelect from "../selects/ItemCategorySelect";
import { getItemGroupById } from "../../api/itemCategoryApi";
import ItemGenericSelect from "../selects/ItemGenericSelect";
import {
  getPackagingUnits,
  getCountries,
  getUOMs,
  getItemClasses,
} from "../../api/itemZraApi";

type FormState = Record<string, any>;

const emptyForm: Record<string, any> = {
  itemType: "Goods",
  itemName: "",
  itemGroup: "",

  itemClassCode: "",
  itemTypeCode: 0,
  originNationCode: "",
  packagingUnitCode: "",
  svcCharge: "Y",
  ins: "Y",
  sellingPrice: 0,
  buyingPrice: 0,

  unitOfMeasureCd: "Nos",
  hsnSacUnspc: "",
  description: "",
  sku: "",
  taxPreference: "Taxable",
  preferredVendor: "",
  salesAccount: "",
  purchaseAccount: "",

  nonExportTax: "",
  nonExportCode: "",
  nonExportName: "",
  nonExportDescription: "",
  nonExportTaxPerct: "",

  exportTax: "",
  exportCode: "",
  exportName: "",
  exportDescription: "",
  exportTaxPerct: "",

  localPurchaseOrderTax: "",
  localPurchaseOrderCode: "",
  localPurchaseOrderName: "",
  localPurchaseOrderDescription: "",
  localPurchaseOrderPerct: "",

  dimensionUnit: "",
  weight: "",
  valuationMethod: "",
  trackingMethod: "None",
  reorderLevel: 0,
  minStockLevel: 0,
  maxStockLevel: 0,

  brand: "",
  dimensionLength: "",
  dimensionWidth: "",
  dimensionHeight: "",
  weightUnit: "",
};

const ItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  // onSubmit?: (data: Record<string, any>) => void;
  onSubmit?: () => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(false);
  const [itemCategoryDetails, setItemCategoryDetails] = useState<any>(null);

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
  //       response = await updateItemByItemCode(initialData.item_code, payload);
  //     } else {
  //       response = await createItem(payload);
  //     }

  //     if (response.status_code !== 200) {
  //       let errorMessage = "Failed to save item";
  //       try {
  //         const errData = await response;
  //         errorMessage = errData.message || errorMessage;
  //       } catch {}
  //       throw new Error(errorMessage);
  //     }

  //     onSubmit?.(response);

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

      if (isEditMode && initialData?.id) {
        response = await updateItemByItemCode(initialData.id, payload);
      } else {
        response = await createItem(payload);
      }
      onSubmit?.();
    } catch (err: any) {
      let errorMessage = "Something went wrong while saving the item.";

      if (err.response?.data) {
        const data = err.response.data;

        if (data._server_messages) {
          try {
            const msgs = JSON.parse(data._server_messages);
            errorMessage = msgs
              .map((m: string) => {
                try {
                  return JSON.parse(m).message || "";
                } catch {
                  return m;
                }
              })
              .filter(Boolean)
              .join("\n");
          } catch {}
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        duration: 8000,
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const loadItemCategoryDetailsById = async (id: string) => {
    try {
      const response = await getItemGroupById(id);
      if (!response || response.status_code !== 200) return;
      setForm((p) => ({ ...p, item_group: response.data.name }));
      setItemCategoryDetails(response.data);
    } catch (err) {
      toast.error("Error loading item category details:");
    }
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
                        {/* <Input
                          label="Item Group"
                          name="item_group"
                          value={form.item_group || ""}
                          onChange={handleForm}
                          className="w-full"
                          required
                        /> */}
                        <ItemCategorySelect
                          value={form.itemGroup}
                          onChange={async ({ name, id }) => {
                            setForm((p) => ({ ...p, itemGroup: name }));
                            await loadItemCategoryDetailsById(id);
                          }}
                          className="w-full"
                        />

                        <Input
                          label="Items Name"
                          name="itemName"
                          value={form.itemName || ""}
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

                        {/* <Input
                          label="Item Class Code"
                          name="custom_itemclscd"
                          value={form.custom_itemclscd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        /> */}
                        {/* <ItemGenericSelect
  label="Item Class"
  value={form.itemClassCode}
  fetchData={getItemClasses}
  // displayField="code" 
  displayFormatter={(item) => `${item.code} - ${item.name}`} 
  onChange={({ id }) => {
    setForm(p => ({ ...p, itemClassCode: id }));
  }}
/> */}
                        <ItemGenericSelect
                          label="Item Class"
                          value={form.itemClassCode}
                          fetchData={getItemClasses}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, itemClassCode: id }))
                          }
                        />
                        {/* <Input
                          label="Item Packaging Code "
                          name="custom_pkgunitcd"
                          value={form.custom_pkgunitcd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        /> */}
                        {/* <ItemGenericSelect
                          label="Packaging Unit"
                          value={form.custom_pkgunitcd}  // ← this should be "PACK", "AC", etc.
                          fetchData={getPackagingUnits}
                          onChange={({ name, id }) => {
                              setForm(p => ({ ...p, custom_pkgunitcd: id, packaging_unit: name 
                          }));
                          }}
                        /> */}
                        {/* <ItemGenericSelect
  label="Packaging Unit"
  value={form.packagingUnitCode}
  fetchData={getPackagingUnits}
  // displayField="code"  
  displayFormatter={(item) => `${item.code} - ${item.name}`} 
  onChange={({ id }) => {
    setForm(p => ({ ...p, packagingUnitCode: id }));
  }}
/> */}
                        <ItemGenericSelect
                          label="Packaging Unit"
                          value={form.packagingUnitCode}
                          fetchData={getPackagingUnits}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, packagingUnitCode: id }))
                          }
                        />
                        <Input
                          label="Item Type Code"
                          name="itemTypeCode"
                          value={form.itemTypeCode || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        {/* <Input
                          label="Country Code"
                          name="custom_orgnnatcd"
                          value={form.custom_orgnnatcd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        /> */}
                        {/* <ItemGenericSelect
  label="Country Code"
  value={form.originNationCode}
  fetchData={getCountries}
  // displayField="code"
  displayFormatter={(item) => `${item.code} - ${item.name}`} 
  onChange={({ id }) => {
    setForm(p => ({ ...p, originNationCode: id }));
  }}
/> */}
                        <ItemGenericSelect
                          label="Country Code"
                          value={form.originNationCode}
                          fetchData={getCountries}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, originNationCode: id }))
                          }
                        />
                        {/* <Input
                          label="HSN/SAC/UNSPC"
                          name="hsnSacUnspc"
                          value={form.hsnSacUnspc || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        /> */}
                        {/* <Input
                          label="Unit of Measurement"
                          name="unitOfMeasureCd"
                          value={form.unitOfMeasureCd || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        /> */}
                        {/* <ItemGenericSelect
  label="UOM"
  value={form.unitOfMeasureCd}
  fetchData={getUOMs}
  // displayField="code"
  displayFormatter={(item) => `${item.code} - ${item.name}`} 
  onChange={({ id }) => {
    setForm(p => ({ ...p, unitOfMeasureCd: id }));
  }}
/> */}
                        <ItemGenericSelect
                          label="UOM"
                          value={form.unitOfMeasureCd}
                          fetchData={getUOMs}
                          onChange={({ id }) =>
                            setForm((p) => ({ ...p, unitOfMeasureCd: id }))
                          }
                        />
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-600">
                            SVC Charge
                          </span>
                          <select
                            name="svcCharge"
                            value={form.svcCharge || ""}
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
                            name="ins"
                            value={form.ins || ""}
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
                          name="sellingPrice"
                          value={form.sellingPrice || ""}
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
                          name="buyingPrice"
                          value={form.buyingPrice || ""}
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
                          name="taxPreference"
                          value={form.taxPreference || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                        <Input
                          label="Preferred Vendor"
                          name="preferredVendor"
                          value={form.preferredVendor || ""}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                      </div>
                    </div>
                  </>
                )}

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
                                  name="nonExportTax"
                                  value={form.nonExportTax || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="e.g. VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="nonExportCode"
                                  value={form.nonExportCode || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="V001"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="nonExportName"
                                  value={form.nonExportName || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Standard VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="nonExportDescription"
                                  value={form.nonExportDescription || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="12% VAT on non-export"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="nonExportTaxPerct"
                                  value={form.nonExportTaxPerct || ""}
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
                                  name="exportTax"
                                  value={form.exportTax || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Zero Rated"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="exportCode"
                                  value={form.exportCode || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="ZR01"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="exportName"
                                  value={form.exportName || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Zero Rated Export"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="exportDescription"
                                  value={form.exportDescription || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="0% on exports"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="exportTaxPerct"
                                  value={form.exportTaxPerct || ""}
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
                                  name="localPurchaseOrderTax"
                                  value={form.localPurchaseOrderTax || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Local VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="localPurchaseOrderCode"
                                  value={form.localPurchaseOrderCode || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="LV05"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="localPurchaseOrderName"
                                  value={form.localPurchaseOrderName || ""}
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="Local Purchase VAT"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="localPurchaseOrderDescription"
                                  value={
                                    form.localPurchaseOrderDescription || ""
                                  }
                                  onChange={handleForm}
                                  className="w-full px-2 py-1.5 border rounded text-xs"
                                  placeholder="5% on local purchases"
                                />
                              </td>
                              <td className="border px-2 py-1">
                                <input
                                  type="text"
                                  name="localPurchaseOrderPerct"
                                  value={form.localPurchaseOrderPerct || ""}
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
                              name="dimensionLength"
                              placeholder="L"
                              value={form.dimensionLength || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <span className="text-gray-500 font-medium">×</span>

                            <Input
                              label=""
                              name="dimensionWidth"
                              placeholder="W"
                              value={form.dimensionWidth || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <span className="text-gray-500 font-medium">×</span>

                            <Input
                              label=""
                              name="dimensionHeight"
                              placeholder="H"
                              value={form.dimensionHeight || ""}
                              onChange={handleForm}
                              className="w-full text-center text-xs"
                            />

                            <select
                              name="dimensionUnit"
                              value={form.dimensionUnit || "cm"}
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
                              name="weight"
                              placeholder="0"
                              value={form.weight}
                              onChange={handleForm}
                              className="flex-1"
                            />
                            <select
                              name="weightUnit"
                              value={form.weightUnit}
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
                            name="valuationMethod"
                            value={form.valuationMethod}
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
                        {/* <input
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
                          } */}
                        <input
                          type="checkbox"
                          id="trackInventory"
                          name="trackInventory"
                          checked={form.trackInventory || false}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              trackInventory: e.target.checked,
                            }))
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
                          name="reorderLevel"
                          value={form.reorderLevel}
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
