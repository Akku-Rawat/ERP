/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from "react";
import {
  showApiError,
  showSuccess,
  showLoading,
  closeSwal,
} from "../../utils/alert";

import { createItemStock } from "../../api/stockApi";
import { getStockById, getAllStockItems } from "../../api/stockItemApi";
import Modal from "../ui/modal/modal";
import { Button } from "../../components/ui/modal/formComponent";
import SearchSelect from "../ui/modal/SearchSelect";
import { getAllItems } from "../../api/itemApi";

type FormState = Record<string, any>;

const emptyForm: Record<string, any> = {
  id: "",
  itemName: "",
  itemGroup: "",
  itemClassCode: "",
  itemTypeCode: "",
  originNationCode: "",
  packagingUnitCode: "",
  svcCharge: "Y",
  ins: "Y",
  sellingPrice: 0,
  buyingPrice: 0,
  unitOfMeasureCd: "Nos",
  description: "",
  sku: "",
  taxPreference: "",
  preferredVendor: "",
  salesAccount: "",
  purchaseAccount: "",
  taxCategory: "Non-Export",
  taxType: "",
  taxCode: "",
  taxName: "",
  taxDescription: "",
  taxPerct: "",
  dimensionUnit: "",
  weight: "",
  valuationMethod: "",
  trackingMethod: "",
  reorderLevel: "",
  minStockLevel: "",
  maxStockLevel: "",
  brand: "",
  weightUnit: "",
  dimensionLength: "",
  dimensionWidth: "",
  dimensionHeight: "",
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
  const [itemOptions, setItemOptions] = useState<
    Array<{ label: string; value: string; id: string; itemClassCode?: string }>
  >([]);
  // Fetch all available items for dropdown on open
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const response = await getAllItems(1, 1000);

        const items = response?.data || [];

        const mappedOptions = items.map((item: any) => ({
          label: item.itemName,
          value: item.id,
          id: item.id,
          itemClassCode: item.itemClassCode,
        }));

        setItemOptions(mappedOptions);
      } catch (err) {
        console.error("Item fetch failed:", err);
        setItemOptions([]);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!form.id) return;

    getStockById(form.id).then((res) => {
      console.log("Full Response:", res);

      const item = res?.items?.[0];

      if (!item) return;

      setForm((prev) => ({
        ...prev,
        itemClassCode: item.itemCode || "",
        quantity: item.quantity || "",
        rate: item.rate || "",
        warehouse: item.warehouse || "",
      }));
    });
  }, [form.id]);

  const [activeTab, setActiveTab] = useState<
    "details" | "taxDetails" | "inventoryDetails"
  >("details");

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && initialData) {
      setForm({ ...emptyForm, ...initialData });
    } else {
      setForm(emptyForm);
    }

    setActiveTab("details");
  }, [isOpen, isEditMode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!form.id) {
        showApiError("Please select an item");
        return;
      }

      const qty = parseFloat(form.quantity);
      const price = parseFloat(form.rate);

      if (!qty || qty <= 0) {
        showApiError("Please enter a valid quantity greater than 0");
        return;
      }

      if (!price || price <= 0) {
        showApiError("Please enter a valid price greater than 0");
        return;
      }

      const payload = {
        items: [
          {
            item_code: form.id,
            qty: qty,
            price: price,
          },
        ],
      };

      showLoading("Creating Stock Entry...");

      await createItemStock(payload);

      closeSwal();
      showSuccess("Stock entry created successfully");

      onSubmit?.();
      handleClose();
    } catch (error: any) {
      closeSwal();
      showApiError(error);
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Stock Entry" : "Add Stock Entry"}
      subtitle="Create and manage stock entry details"
      maxWidth="6xl"
      height="90vh"
    >
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
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
            Stock Entry Details
          </button>
        </div>

        {/* Tab Content */}
        <section className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="gap-6 max-h-screen overflow-auto p-4">
            {activeTab === "details" && (
              <>
                <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                  Stock Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 text-sm col-span-1">
                      <SearchSelect
                        label="Select Item"
                        value={form.itemName}
                        required
                        fetchOptions={async (q: string) => {
                          return itemOptions
                            .filter((item) =>
                              item.label.toLowerCase().includes(q.toLowerCase())
                            )
                            .map((item) => ({
                              label: item.label,
                              value: item.id,
                            }));
                        }}
                        onChange={(selectedId: string) => {
                          const selectedItem = itemOptions.find(
                            (item) => item.id === selectedId
                          );

                          setForm((prev) => ({
                            ...prev,
                            id: selectedId,
                            itemName: selectedItem?.label || "",
                            itemClassCode: selectedItem?.itemClassCode || "",
                          }));
                        }}
                      />
                    </div>

                    <Input
                      label="Item Code"
                      name="itemClassCode"
                      value={form.itemClassCode || ""}
                      onChange={handleForm}
                      className="w-full"
                      readOnly
                    />

                    <Input
                      label="Item Name"
                      name="itemName"
                      value={form.itemName || ""}
                      onChange={handleForm}
                      className="w-full col-span-2"
                      readOnly
                    />

                    <Input
                      label="Item Quantity"
                      name="quantity"
                      type="number"
                      step="1"
                      value={form.quantity || ""}
                      onChange={handleForm}
                      placeholder="Enter Item quantity"
                      className="w-full"
                      required
                    />

                    <Input
                      label="Item Price"
                      name="rate"
                      type="number"
                      step="0.01"
                      value={form.rate || ""}
                      onChange={handleForm}
                      placeholder="Enter Item price"
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        {/* FOOTER INSIDE FORM */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="ghost" type="button" onClick={reset}>
            Reset
          </Button>

          <Button variant="primary" loading={loading} type="submit">
            Save Stock Entry
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Input component
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
