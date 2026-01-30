import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { 
  PurchaseOrderFormData, 
  POTab, 
  ItemRow, 
  TaxRow, 
  PaymentRow 
} from "../types/Supply/purchaseOrder";
import { 
  emptyPOForm, 
  emptyItem, 
  emptyTaxRow, 
  emptyPaymentRow 
} from "../types/Supply/purchaseOrder";
import { createPurchaseOrder } from "../api/procurement/PurchaseOrderApi";
import { mapUIToCreatePO } from "../types/Supply/purchaseOrderMapper";
import { validatePO } from "./poValidator";
import { getPurchaseOrderById } from "../api/procurement/PurchaseOrderApi";
import { mapApiToUI } from "../types/Supply/purchaseOrderMapper";
import { updatePurchaseOrder } from "../api/procurement/PurchaseOrderApi";




interface UsePurchaseOrderFormProps {
  isOpen: boolean;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
   poId?: string | number;
}

export const usePurchaseOrderForm = ({ 
  isOpen, 
  onSuccess, 
  onClose ,
  poId,
  
}: UsePurchaseOrderFormProps) => {
  const [form, setForm] = useState<PurchaseOrderFormData>(emptyPOForm);
  const [activeTab, setActiveTab] = useState<POTab>("details");
 
const [saving, setSaving] = useState(false);


const isEditMode = !!poId;



    


useEffect(() => {
  if (!isOpen || !poId) return;

  const loadPO = async () => {
    try {
      toast.loading("Loading Purchase Order...");

      const apiData = await getPurchaseOrderById(poId);
      const mapped = mapApiToUI(apiData);

      setForm(mapped);
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


useEffect(() => {
  if (!isOpen || poId) return; // don't overwrite in edit mode
  const today = new Date().toISOString().split("T")[0];
  setForm(prev => ({ ...prev, date: today, requiredBy: today }));
}, [isOpen, poId]);





// Calculate totals (Items + Taxes + Rounding)
useEffect(() => {
  // Sub Total (Items)
  const subTotal = form.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );

  // Total Quantity
  const totalQty = form.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  // Tax Total
  const taxTotal = form.taxRows.reduce((sum, t) => {
    const taxableAmount = Number(t.amount) || 0;
    const taxRate = Number(t.taxRate) || 0;
    return sum + (taxableAmount * taxRate) / 100;
  }, 0);

  // Grand Total
  const grandTotal = subTotal + taxTotal;

  // Rounding
  const roundedTotal = Math.round(grandTotal);
  const roundingAdjustment = Number((roundedTotal - grandTotal).toFixed(2));

setForm(p => ({
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

  setForm(p => ({
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
  setForm(p => ({ ...p, items: [...p.items, { ...emptyItem }] }));
  toast.success("New item row added");
};






const removeItem = (idx: number) => {
  if (form.items.length === 1) {
    toast.error("At least one item is required");
    return;
  }
  setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
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
      case "INR": return "₹";
      case "USD": return "$";
      case "EUR": return "€";
      default: return "₹";
    }
  };

const handleItemSelect = (item: any, idx: number) => {
  setForm(prev => {
    const items = [...prev.items];

    items[idx] = {
      ...items[idx],
      itemCode: item.id,
      itemName: item.itemName, 
      uom: item.unitOfMeasureCd || "Unit",
      rate: Number(item.sellingPrice || 0),
    };

    return { ...prev, items };
  });
};

  
  
const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();

  const errors = validatePO(form);
  if (errors.length) {
    errors.forEach(err => toast.error(err));
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
