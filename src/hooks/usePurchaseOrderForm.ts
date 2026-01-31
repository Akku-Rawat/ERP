import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type {
  PurchaseOrderFormData,
  POTab,
  ItemRow,
  TaxRow,
  PaymentRow,
} from "../types/Supply/purchaseOrder";
import {
  emptyPOForm,
  emptyItem,
  emptyTaxRow,
  emptyPaymentRow,
} from "../types/Supply/purchaseOrder";
import { createPurchaseOrder } from "../api/procurement/PurchaseOrderApi";
import { mapUIToCreatePO } from "../types/Supply/purchaseOrderMapper";
import { validatePO } from "./poValidator";
import { getPurchaseOrderById } from "../api/procurement/PurchaseOrderApi";
import { mapApiToUI } from "../types/Supply/purchaseOrderMapper";
import { updatePurchaseOrder } from "../api/procurement/PurchaseOrderApi";
import { getCountryList } from "../api/lookupApi";

interface UsePurchaseOrderFormProps {
  isOpen: boolean;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  poId?: string | number;
}

export const usePurchaseOrderForm = ({
  isOpen,
  onSuccess,
  onClose,
  poId,
}: UsePurchaseOrderFormProps) => {
  const [form, setForm] = useState<PurchaseOrderFormData>(emptyPOForm);
  const [activeTab, setActiveTab] = useState<POTab>("details");
  const [taxCategory, setTaxCategory] = useState<"Export" | "Non-Export" | "LPO" | "">("");
  const [saving, setSaving] = useState(false);

  const isEditMode = !!poId;

  // Handle Export Country Logic
  useEffect(() => {
    if (taxCategory !== "Export") {
      setForm((p) => ({ ...p, placeOfSupply: "", exportToCountry: "" }));
      return;
    }

    const resolveCountry = async () => {
      const list = await getCountryList();
      const countryName = form.exportToCountry;
      if (!countryName) return;

      const code = getCountryCode(list, countryName);

      setForm((p) => ({
        ...p,
        placeOfSupply: code,
      }));
    };

    resolveCountry();
  }, [taxCategory, form.exportToCountry]);

  // Sync taxCategory with form
  useEffect(() => {
    setForm((p) => ({ ...p, taxCategory }));
  }, [taxCategory]);

  // Update VAT codes for all items when tax category changes
  useEffect(() => {
    if (!taxCategory) return;

    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        // Skip if item doesn't have item code yet
        if (!item.itemCode) return item;

        // Update VAT code based on new tax category
        let newVatCd = "A"; // default

        if (taxCategory === "Export") {
          newVatCd = "C1";
        } else if (taxCategory === "LPO") {
          newVatCd = "E";
        } else if (taxCategory === "Non-Export") {
          // Keep the item's original tax code if available
          newVatCd = item.vatCd || "A";
        }

        return {
          ...item,
          vatCd: newVatCd,
        };
      }),
    }));
  }, [taxCategory]);

  // Load PO Data in Edit Mode
  useEffect(() => {
    if (!isOpen || !poId) return;

    const loadPO = async () => {
      try {
        toast.loading("Loading Purchase Order...");

        const apiData = await getPurchaseOrderById(poId);
        const mapped = mapApiToUI(apiData);

        setForm(mapped);
        setTaxCategory(mapped.taxCategory as any);
        toast.dismiss();
        toast.success("Purchase Order Loaded");
      } catch (err) {
        console.error("PO Load Error", err);
        toast.dismiss();
        toast.error("Failed to load Purchase Order");
      }
    };

    loadPO();
  }, [isOpen, poId]);

  // Set default date on create mode
  useEffect(() => {
    if (!isOpen || poId) return;
    const today = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, date: today, requiredBy: today }));
  }, [isOpen, poId]);

  // Calculate totals (Items + Taxes + Rounding)
  useEffect(() => {
    const subTotal = form.items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
      0
    );

    const totalQty = form.items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0
    );

    const taxTotal = form.taxRows.reduce((sum, t) => {
      const taxableAmount = Number(t.amount) || 0;
      const taxRate = Number(t.taxRate) || 0;
      return sum + (taxableAmount * taxRate) / 100;
    }, 0);

    const grandTotal = subTotal + taxTotal;
    const roundedTotal = Math.round(grandTotal);
    const roundingAdjustment = Number((roundedTotal - grandTotal).toFixed(2));

    setForm((p) => ({
      ...p,
      totalQuantity: totalQty,
      grandTotal,
      roundingAdjustment,
      roundedTotal,
    }));
  }, [form.items, form.taxRows]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const keys = name.split(".");
      const updated = { ...prev } as any;
      let obj = updated;

      keys.slice(0, -1).forEach((k) => {
        obj[k] = { ...obj[k] };
        obj = obj[k];
      });

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSupplierChange = (sup: any) => {
    if (!sup) {
      toast.error("Invalid supplier selected");
      return;
    }

    setForm((p) => ({
      ...p,
      supplier: sup.name,
      supplierId: sup.id,
      supplierCode: sup.code,

      addresses: {
        ...p.addresses,
        supplierAddress: {
          ...p.addresses.supplierAddress,
          addressLine1: sup.address?.line1 || "",
          addressLine2: sup.address?.line2 || "",
          city: sup.address?.city || "",
          state: sup.address?.state || "",
          country: sup.address?.country || "",
          postalCode: sup.address?.postalCode || "",
          phone: sup.phone || "",
          email: sup.email || "",
        },
      },
    }));

    toast.success(`Supplier selected: ${sup.name}`);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const { name, value } = e.target;
    const isNum = ["quantity", "rate"].includes(name);
    const items = [...form.items];
    items[idx] = { ...items[idx], [name]: isNum ? Number(value) : value };
    setForm((p) => ({ ...p, items }));
  };

  const addItem = () => {
    setForm((p) => ({ ...p, items: [...p.items, { ...emptyItem }] }));
    toast.success("New item row added");
  };

  const removeItem = (idx: number) => {
    if (form.items.length === 1) {
      toast.error("At least one item is required");
      return;
    }
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
    toast.success("Item removed");
  };

  const handleTaxRowChange = (idx: number, key: keyof TaxRow, value: any) => {
    const taxRows = [...form.taxRows];
    taxRows[idx] = { ...taxRows[idx], [key]: value };
    setForm((p) => ({ ...p, taxRows }));
  };

  const addTaxRow = () => {
    setForm((p) => ({ ...p, taxRows: [...p.taxRows, { ...emptyTaxRow }] }));
  };

  const removeTaxRow = (idx: number) => {
    setForm((p) => ({ ...p, taxRows: p.taxRows.filter((_, i) => i !== idx) }));
  };

  const handlePaymentRowChange = (idx: number, key: keyof PaymentRow, value: any) => {
    const paymentRows = [...form.paymentRows];
    paymentRows[idx] = { ...paymentRows[idx], [key]: value };
    setForm((p) => ({ ...p, paymentRows }));
  };

  const addPaymentRow = () => {
    setForm((p) => ({ ...p, paymentRows: [...p.paymentRows, { ...emptyPaymentRow }] }));
  };

  const removePaymentRow = (idx: number) => {
    if (form.paymentRows.length === 1) return;
    setForm((p) => ({ ...p, paymentRows: p.paymentRows.filter((_, i) => i !== idx) }));
  };

  const handleSaveTemplate = (html: string) => {
    setForm((p) => ({ ...p, messageHtml: html }));
    console.log("Template saved:", {
      name: form.templateName,
      type: form.templateType,
      subject: form.subject,
      messageHtml: html,
    });
    toast.success("Template saved!");
  };

  const resetTemplate = () => {
    setForm((p) => ({
      ...p,
      templateName: "",
      templateType: "",
      subject: "",
      messageHtml: "",
      sendAttachedFiles: false,
      sendPrint: false,
    }));
  };

  const getCurrencySymbol = () => {
    switch (form.currency) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "ZMW":
        return "K";
      default:
        return "₹";
    }
  };

  /**
   * Determine VAT Code based on Tax Category and Item
   * Like Invoice system
   */
  const getVatCode = (item: any, category: string): string => {
    // Export Category → Always C1
    if (category === "Export") {
      return "C1";
    }

    // LPO Category → Always E (Exempt)
    if (category === "LPO") {
      return "E";
    }

    // Non-Export → Use item's tax code or default to A (Standard)
    if (category === "Non-Export") {
      return item.taxCode || item.vatCd || "A";
    }

    // Default fallback
    return item.taxCode || item.vatCd || "A";
  };

  const handleItemSelect = (item: any, idx: number) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = {
        ...items[idx],
        itemCode: item.id,
        itemName: item.itemName,
        uom: item.unitOfMeasureCd || "Unit",
        rate: Number(item.sellingPrice || 0),
        vatCd: getVatCode(item, taxCategory),
      };

      return { ...prev, items };
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Ensure taxCategory is synced with form before validation
    const formToValidate = { ...form, taxCategory };
    const errors = validatePO(formToValidate);
    
    if (errors.length) {
      // Show only unique errors to avoid duplicates
      const uniqueErrors = [...new Set(errors)];
      uniqueErrors.forEach((err) => toast.error(err));
      return;
    }

    try {
      setSaving(true);

      const payload = mapUIToCreatePO(formToValidate);

      let res;
      if (isEditMode) {
        res = await updatePurchaseOrder({ poId, ...payload });
        toast.success("Purchase Order Updated");
      } else {
        res = await createPurchaseOrder(payload);
        toast.success("Purchase Order Created");
      }

      onSuccess?.(res);
      onClose?.();
      if (!isEditMode) reset();
    } catch (error: any) {
      console.error("PO ERROR", error);
      toast.error(error?.response?.data?.message || "PO save failed");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setForm(emptyPOForm);
    setActiveTab("details");
    setTaxCategory("");
  };

  return {
    form,
    activeTab,
    setActiveTab,
    handleFormChange,
    handleSupplierChange,
    handleItemChange,
    addItem,
    removeItem,
    handleTaxRowChange,
    addTaxRow,
    removeTaxRow,
    handlePaymentRowChange,
    addPaymentRow,
    removePaymentRow,
    handleSaveTemplate,
    handleItemSelect,
    resetTemplate,
    getCurrencySymbol,
    taxCategory,
    setTaxCategory,
    handleSubmit,
    reset,
    setForm,
  };
};

function getCountryCode(list: any[], countryName: string): string {
  if (!Array.isArray(list) || !countryName) return "";
  const country = list.find(
    (c: any) =>
      c.name?.toLowerCase() === countryName.toLowerCase() ||
      c.countryName?.toLowerCase() === countryName.toLowerCase()
  );
  return country?.code || country?.countryCode || "";
}