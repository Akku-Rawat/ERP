import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateItemByItemCode, createItem } from "../../api/itemApi";
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
  const [itemOptions, setItemOptions] = useState<Array<{ label: string; value: string }>>([]);
    // Fetch all available items for dropdown on open
    useEffect(() => {
      if (!isOpen) return;
      (async () => {
        try {
          const items = await getAllStockItems();
          const itemOptions = items.map((item: any) => ({
            label: item.item_code || item.itemName || item.item_name || item.name || item.id || "",
            value: item.item_code || item.itemName || item.id || item.name || ""
          })).filter(opt => !!opt.value);
          setItemOptions(itemOptions);
        } catch (err) {
          setItemOptions([]);
        }
      })();
    }, [isOpen]);
    useEffect(() => {
      if (!form.itemCode) return;
      getStockById(form.itemCode)
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            itemCode: data.item_code || data.itemCode || prev.itemCode,
            warehouse: data.id || prev.id,
          }));
        })
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
      const payload = { ...form, itemTypeCode: Number(form.itemTypeCode) };

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
          } catch { }
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
      title={isEditMode ? "Edit Item" : "Add Item"}
      subtitle="Create and manage item details"
      maxWidth="6xl"
      height="90vh"
    >
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        {/* Tabs */}
        <div className="bg-app border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
          </div>
        </div>

        {/* Tab Content */}
        <section className="flex-1 overflow-y-auto p-4 space-y-6 bg-app">
          <div className="gap-6 max-h-screen overflow-auto p-4">
            {activeTab === "details" && (
              <>
              
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted mb-1 block">Select Item</label>
                  <select
                    className="w-full px-3 py-2 rounded border border-theme bg-white"
                    value={form.id || ""}
                    onChange={e => {
                      const selectedId = e.target.value;
                      const selectedOption = itemOptions.find(opt => opt.value === selectedId);
                      setForm(p => ({
                        ...p,
                        id: selectedId,
                        itemName: selectedOption ? selectedOption.label : ""
                      }));
                    }}
                  >
                    <option value="">Select an item</option>
                    {itemOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <h3 className="mb-4 text-lg font-semibold text-main underline">
                  Items Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Input
                      label="Item Name"
                      name="itemName"
                      value={form.itemName || ""}
                      onChange={handleForm}
                      className="w-full col-span-3"
                      readOnly
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted">
                        Item Quantity
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          name="quantity"
                          value={form.quantity || ""}
                          onChange={handleForm}
                          placeholder="Enter Item quantity"
                          className="w-full px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted">
                        Item Price
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          name="rate"
                          value={form.rate || ""}
                          onChange={handleForm}
                          placeholder="enter Item price"
                          className="w-full px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                        />
                      </div>
                    </div>

                    <Input
                      label="Item Code"
                      name="id"
                      value={form.id || ""}
                      onChange={handleForm}
                      className="w-full col-span-3"
                      required
                      readOnly
                    />
                    
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        {/*  FOOTER INSIDE FORM */}
        <div className="flex justify-end gap-2 border-t border-theme px-6 py-4">
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="ghost" type="button" onClick={reset}>
            Reset
          </Button>

          <Button variant="primary" loading={loading} type="submit">
            Save Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Input component unchanged
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-muted">{label}</span>
    <input
      ref={ref}
      className={`rounded border border-theme px-3 py-2 bg-card text-main 
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${props.disabled ? "bg-app text-muted cursor-not-allowed" : ""
        } ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";

export default ItemModal;
