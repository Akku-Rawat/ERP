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
import { getSupplierById } from "../../src/api/procurement/supplierApi";
import { getCompanyById } from "../api/companySetupApi";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;


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
  const [saving, setSaving] = useState(false);

  const isEditMode = !!poId;


useEffect(() => {
  if (!isOpen) return;

  const loadCompanyBuyingTerms = async () => {
    try {
      const res = await getCompanyById(COMPANY_ID);
      const buyingTerms = res?.data?.terms?.buying;

      if (!buyingTerms) return;

      setForm((prev) => ({
        ...prev,
        terms: { buying: buyingTerms },
      }));
    } catch (e) {
      console.error("Failed to load company buying terms", e);
    }
  };

  loadCompanyBuyingTerms();
}, [isOpen]);


useEffect(() => {
  if (!form.taxCategory) return;

  setForm((prev) => ({
    ...prev,
    items: prev.items.map((item) => {
      if (!item.itemCode) return item;

      let vatCd = "A";
      if (form.taxCategory === "Export") vatCd = "C1";
      else if (form.taxCategory === "LPO") vatCd = "E";

      return { ...item, vatCd };
    }),
  }));
}, [form.taxCategory]);


  // Load PO Data in Edit Mode
useEffect(() => {
  if (!isOpen || !poId) return;

  const loadPO = async () => {
    const toastId = toast.loading("Loading Purchase Order...");

    try {
      const apiData = await getPurchaseOrderById(poId);
      const mapped = mapApiToUI(apiData);

      setForm(mapped); 
      toast.success("Purchase Order Loaded", { id: toastId });
    } catch (err) {
      console.error("PO Load Error", err);
      toast.error("Failed to load Purchase Order", { id: toastId });
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

  // Handle address fields
  if (name.startsWith('addresses.')) {
    const parts = name.split('.');
    const addressKey = parts[1];
    const fieldName = parts[2];
    
    setForm((prev) => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        [addressKey]: {
          ...(prev.addresses as any)[addressKey],
          [fieldName]: value
        }
      }
    }));
    return;
  }

  // Simple fields
  setForm((prev) => ({ ...prev, [name]: value }));
};
const handleSupplierChange = async (sup: any) => {
  if (!sup) return;

  try {
    const res = await getSupplierById(sup.id);
    const supplier = res?.data;
    if (!supplier) return;

    let destCode = "";

    if (supplier.taxCategory === "Export" && supplier.billingCountry) {
      const countryRes = await getCountryList();
      const list = Array.isArray(countryRes)
        ? countryRes
        : countryRes?.data ?? [];

      destCode = getCountryCode(list, supplier.billingCountry);
    }

    setForm((p) => ({
      ...p,

      /* ===== BASIC SUPPLIER INFO ===== */
      supplier: supplier.supplierName,
      supplierId: supplier.supplierId,
      supplierCode: supplier.supplierCode,
      supplierEmail: supplier.emailId,
      supplierPhone: supplier.phoneNo,
      taxCategory: supplier.taxCategory,

      /* ===== 🔑 AUTO FETCHED FIELDS ===== */
      currency: supplier.currency || p.currency,
      supplierContact: supplier.contactPerson || "",

      /* ===== EXPORT HANDLING ===== */
      destnCountryCd: destCode,
      placeOfSupply: destCode,

      /* ===== ADDRESS AUTO FILL ===== */
      addresses: {
        ...p.addresses,
        supplierAddress: {
          ...p.addresses.supplierAddress,
          addressLine1: supplier.billingAddressLine1 || "",
          addressLine2: supplier.billingAddressLine2 || "",
          city: supplier.billingCity || "",
          state: supplier.province || "",
          country: supplier.billingCountry || "",
          postalCode: supplier.billingPostalCode || "",
          phone: supplier.phoneNo || "",
          email: supplier.emailId || "",
        },
      },
    }));
  } catch (e) {
    console.error("Supplier detail fetch failed", e);
  }
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
      vatCd: getVatCode(item, prev.taxCategory), 
    };

    return { ...prev, items };
  });
};


const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();

  // 🔒 Mandatory tax category check
  if (!form.taxCategory) {
    toast.error("Tax Category is required");
    return;
  }

  const errors = validatePO(form);

  if (errors.length) {
    const uniqueErrors = [...new Set(errors)];
    uniqueErrors.forEach((err) => toast.error(err));
    return;
  }

  try {
    setSaving(true);

    const payload = mapUIToCreatePO(form); 

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
    handleSubmit,
    reset,
    setForm,
  };
};

function getCountryCode(list: any[], countryName?: string): string {
  if (!countryName || !Array.isArray(list)) return "";

  const n = countryName.trim().toLowerCase();

  const byCode = list.find((c: any) => c.code?.toLowerCase() === n);
  if (byCode) return byCode.code;

  const byName = list.find((c: any) =>
    c.name?.toLowerCase().includes(n)
  );
  if (byName) return byName.code;

  const reverse = list.find((c: any) =>
    n.includes(c.name?.toLowerCase())
  );
  if (reverse) return reverse.code;

  return "";
}