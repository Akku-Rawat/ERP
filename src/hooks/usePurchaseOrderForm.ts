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

interface UsePurchaseOrderFormProps {
  isOpen: boolean;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
}

export const usePurchaseOrderForm = ({ 
  isOpen, 
  onSuccess, 
  onClose 
}: UsePurchaseOrderFormProps) => {
  const [form, setForm] = useState<PurchaseOrderFormData>(emptyPOForm);
  const [activeTab, setActiveTab] = useState<POTab>("details");
  const [suppliers, setSuppliers] = useState<{ name: string }[]>([]);
  const [suppLoading, setSuppLoading] = useState(true);

  // Load suppliers
  useEffect(() => {
    if (!isOpen) return;

    const loadSuppliers = async () => {
      try {
        setSuppLoading(true);
        // Replace with actual API call
        const mockSuppliers = [
          { name: "Supplier A" },
          { name: "Supplier B" },
          { name: "Supplier C" },
        ];
        setSuppliers(mockSuppliers);
      } catch (err) {
        console.error("Error loading suppliers:", err);
      } finally {
        setSuppLoading(false);
      }
    };

    loadSuppliers();
  }, [isOpen]);

  // Set default dates
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setForm((prev) => ({ ...prev, date: today, requiredBy: today }));
    }
  }, [isOpen]);

  // Calculate totals
  useEffect(() => {
    const totalQty = form.items.reduce((sum, item) => sum + item.quantity, 0);
    const grandTotal = form.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const roundedTotal = Math.round(grandTotal);
    const roundingAdjustment = roundedTotal - grandTotal;

    setForm((p) => ({
      ...p,
      totalQuantity: totalQty,
      grandTotal,
      roundingAdjustment,
      roundedTotal,
    }));
  }, [form.items]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSupplierChange = (name: string) => {
    setForm((p) => ({ ...p, supplier: name }));
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
  };

  const removeItem = (idx: number) => {
    if (form.items.length === 1) return;
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.(form);
    reset();
    onClose?.();
  };

  const reset = () => {
    setForm(emptyPOForm);
    setActiveTab("details");
  };

  return {
    form,
    activeTab,
    setActiveTab,
    suppliers,
    suppLoading,
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
    resetTemplate,
    getCurrencySymbol,
    handleSubmit,
    reset,
  };
};
