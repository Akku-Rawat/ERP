import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { SupplierFormData, SupplierTab } from "../types/Supply/supplier";
import { emptySupplierForm } from "../types/Supply/supplier";
import { createSupplier,updateSupplier } from "../api/procurement/supplierApi";
import { mapSupplierToApi } from "../types/Supply/supplierMapper";
import { Supplier } from "../types/Supply/supplier";
import { mapSupplierToForm } from "../types/Supply/supplierMapper";

interface UseSupplierFormProps {
   initialData?: Supplier | null; 
  isEditMode?: boolean;
  onSuccess?: (data: SupplierFormData) => void;
  onClose?: () => void;
}

const validateSupplier = (form: SupplierFormData) => {
  if (!form.supplierName) return "Supplier Name is required";
  if (!form.tpin) return "TPIN is required";
  if (!form.phoneNo) return "Phone Number is required";
  if (!form.emailId) return "Email is required";
  if (!form.currency) return "Currency is required";

  // TPIN must be exactly 10 digits
  if (!/^\d{10}$/.test(form.tpin)) {
    return "TPIN must be exactly 10 digits";
  }

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId)) {
    return "Invalid email format";
  }

  // Phone validation (10–15 digits)
  if (!/^\d{10,15}$/.test(form.phoneNo)) {
    return "Phone number must be 10-15 digits";
  }

  return null;
};



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
    if (initialData) {
      setForm(mapSupplierToForm(initialData));
    } else {
      setForm({
        ...emptySupplierForm,
        dateOfAddition: new Date().toISOString().split("T")[0],
      });
    }

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

  const error = validateSupplier(form);
  if (error) {
    toast.error(error);
    return;
  }

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
    console.error(err);
    toast.error("Failed to save supplier");
  } finally {
    setLoading(false);
  }
};




  // Reset Form
const reset = () => {
  if (initialData) {
    setForm(mapSupplierToForm(initialData));
  } else {
    setForm(emptySupplierForm);
  }
  toast("Form reset");
};



  // Next Tab
const goToNextTab = () => {
  const tabs: SupplierTab[] = [
    "supplier",
    "payment",
    "address",
  ];

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
