import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { SupplierFormData, SupplierTab } from "../types/Supply/supplier";
import { emptySupplierForm } from "../types/Supply/supplier";

const base_url = import.meta.env.VITE_BASE_URL;
const CUSTOMER_ENDPOINT = `${base_url}/resource/Customer`;

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

  useEffect(() => {
    setForm(initialData || emptySupplierForm);
    setActiveTab("supplier");
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      let response;

      if (isEditMode && initialData?.supplierName) {
        response = await fetch(`${CUSTOMER_ENDPOINT}/${initialData.supplierName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AUTHORIZATION,
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(CUSTOMER_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: import.meta.env.VITE_AUTHORIZATION,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save supplier");
      }

      await response.json();
      toast.success(isEditMode ? "Supplier updated!" : "Supplier created!");
      onSuccess?.(form);
      reset();
      onClose?.();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(initialData || emptySupplierForm);
  };

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