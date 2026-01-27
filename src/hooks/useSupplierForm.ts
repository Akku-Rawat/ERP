import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { SupplierFormData, SupplierTab } from "../types/Supply/supplier";
import { emptySupplierForm } from "../types/Supply/supplier";
import { createSupplier, updateSupplier } from "../api/supplierApi";




interface UseSupplierFormProps {
  initialData?: SupplierFormData | null;
  isEditMode?: boolean;
  onSuccess?: (data: SupplierFormData) => void;
  onClose?: () => void;
}

export const useSupplierForm = ({
  initialData,
  isEditMode = false,
  onSuccess,
  onClose,
}: UseSupplierFormProps) => {
  const [form, setForm] = useState<SupplierFormData>(emptySupplierForm);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SupplierTab>("supplier");

  // Prefill Edit Data
  useEffect(() => {
    setForm(initialData || emptySupplierForm);
    setActiveTab("supplier");
  }, [initialData]);

  // Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: checked as any }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };




const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    let resp;

    if (isEditMode) {
      resp = await updateSupplier(form);
    } else {
      resp = await createSupplier(form);
    }

    toast.success(isEditMode ? "Supplier updated!" : "Supplier created!");
    onSuccess?.(form);
    reset();
    onClose?.();
  } catch (err: any) {
    console.error(err);
    toast.error(err?.message || "Failed to save supplier");
  } finally {
    setLoading(false);
  }
};

  // Reset Form
  const reset = () => {
    setForm(initialData || emptySupplierForm);
  };

  // Next Tab
  const goToNextTab = () => {
    const tabs: SupplierTab[] = ["supplier", "payment"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return {
    form,
    loading,
    activeTab,
    setActiveTab,
    handleChange,
    handleSubmit,
    reset,
    goToNextTab,
  };
};
