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
import { toast } from "sonner";
import { createItemStock } from "../../api/stockApi";
import { getStockById, getAllStockItems } from "../../api/stockItemApi";
import Modal from "../ui/modal/modal";
import { Button } from "../../components/ui/modal/formComponent";

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
        const items = await getAllStockItems();
        console.log("Fetched items:", items);
        const itemOptions = items
          .map((item: any) => ({
            label:
              item.itemName ||
              item.item_name ||
              item.name ||
              item.id ||
              "",
            value:
              item.itemName || item.item_name || item.name || item.id || "",
            id: item.id || "",
            itemClassCode: item.itemClassCode || item.item_class_code || "",
          }))
          .filter((opt) => !!opt.id);
        console.log("Processed itemOptions:", itemOptions);
        setItemOptions(itemOptions);
      } catch (err) {
        setItemOptions([]);
      }
    })();
  }, [isOpen]);
  useEffect(() => {
    if (!form.itemCode) return;
    getStockById(form.itemCode).then((data) => {
      setForm((prev) => ({
        ...prev,
        itemCode: data.item_code || data.itemCode || prev.itemCode,
        warehouse: data.id || prev.id,
      }));
    });
  }, [form.itemCode]);

  const [activeTab, setActiveTab] = useState<
    "details" | "taxDetails" | "inventoryDetails"
  >("details");

  useEffect(() => {
    if (!isOpen) return;

    setForm(isEditMode && initialData ? initialData : emptyForm);
    setActiveTab("details");
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!form.id) {
        toast.error("Please select an item");
        setLoading(false);
        return;
      }

      const qty = parseFloat(form.quantity);
      const price = parseFloat(form.rate);

      if (!qty || qty <= 0) {
        toast.error("Please enter a valid quantity greater than 0");
        setLoading(false);
        return;
      }

      if (!price || price <= 0) {
        toast.error("Please enter a valid price greater than 0");
        setLoading(false);
        return;
      }

      // Prepare stock entry payload
      const payload = {
        items: [
          {
            item_code: form.id,
            qty: qty,
            price: price,
          },
        ],
      };

      console.log("Sending stock entry payload:", payload);
      const response = await createItemStock(payload);
      toast.success("Stock entry created successfully");
      onSubmit?.();
    } catch (err: any) {
      let errorMessage = "Something went wrong while saving the stock entry.";

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
                    <div className="flex flex-col gap-1 text-sm col-span-3">
                      <label className="font-medium text-gray-600">
                        Select Item
                      </label>
                      <select
                        className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={
                          itemOptions.find((opt) => opt.id === form.id)?.value || ""
                        }
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedOption = itemOptions.find(
                            (opt) => opt.value === selectedValue,
                          );
                          console.log("Selected option:", selectedOption);
                          setForm((p) => ({
                            ...p,
                            id: selectedOption?.id || "",
                            itemName: selectedOption?.label || "",
                            itemClassCode: selectedOption?.itemClassCode || "",
                          }));
                        }}
                      >
                        <option value="">Select an item</option>
                        {itemOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
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
