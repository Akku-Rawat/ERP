import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { SupplierFormData, SupplierTab } from "../types/Supply/supplier";
import { emptySupplierForm } from "../types/Supply/supplier";
import { createSupplier, updateSupplier } from "../api/supplierApi";
import { mapSupplierToApi } from "../types/Supply/supplierMapper";
import { Supplier } from "../types/Supply/supplier";


interface UseSupplierFormProps {
   initialData?: Supplier | null; 
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



const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();
  try {
    setLoading(true);

    const payload = mapSupplierToApi(form, initialData?.supplierId);

    if (isEditMode) {
      await updateSupplier(payload); 
    } else {
      await createSupplier(payload); 
    }

    onSuccess?.(form);
    onClose?.();
  } catch (err) {
    console.error("Supplier save failed", err);
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
