import React, { useState, useEffect } from "react";
import {
  updateItemGroupById,
  createItemGroup,
} from "../../api/itemCategoryApi";
import { getUOMs } from "../../api/itemZraApi";
import { showApiError, showSuccess } from "../../utils/alert";

import ItemGenericSelect from "../selects/ItemGenericSelect";
import Modal from "../ui/modal/modal";
import { Button } from "../ui/modal/formComponent";
import { ModalInput } from "../ui/modal/modalComponent";

const emptyForm: Record<string, any> = {
  id: "",
  groupName: "",
  description: "",
  salesAccount: "",
  customSellingPrice: "",
  unitOfMeasurement: "",
  itemType: "",
};
const itemTypeOptions = [
  { value: "", label: "Select Item Type..." },
  { value: "1", label: "Raw Material" },
  { value: "2", label: "Finished Product" },
  { value: "3", label: "Service" },
];
const ItemsCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  isEditMode?: boolean;
}> = ({ isOpen, onClose, onSubmit, initialData, isEditMode = false }) => {
  const [form, setForm] = useState<Record<string, any>>(emptyForm);
  const [loading, setLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"type" | "tax">("type");

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
    setActiveTab("type");
  }, [initialData, isOpen]);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = { ...form };

    let response;

    if (isEditMode && initialData?.id) {
      response = await updateItemGroupById(initialData.id, payload);
    } else {
      response = await createItemGroup(payload);
    }

    if (!response || ![200, 201].includes(response.status_code)) {
      showApiError(response);
      return;
    }

 
    onSubmit?.(payload);
    handleClose();
  } catch (err: any) {
    console.error("Category save failed:", err);
    showApiError(err);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: checked }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleClose = () => {
    setForm(emptyForm);
    onClose();
  };

  const reset = () => {
    setForm(initialData ?? emptyForm);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Item Category" : "Add Item Category"}
      subtitle="Manage item category details"
      maxWidth="4xl"
      height="50vh"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
            <Button
              variant="primary"
              loading={loading}
              type="submit"
              form="item-category-form"
            >
              {isEditMode ? "Update" : "Save"} Category
            </Button>
          </div>
        </>
      }
    >
      <form
        id="item-category-form"
        onSubmit={handleSubmit}
        className="h-full flex flex-col"
      >
        {/* Tabs */}
        <div className="bg-app border-b border-theme px-8 shrink-0">
          <div className="flex gap-8">
            {(["type", "tax"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 bg-transparent border-none text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? "text-primary border-b-[3px] border-primary"
                    : "text-muted border-b-[3px] border-transparent hover:text-main"
                }`}
              >
                {tab === "type" && "Category Details"}
                {tab === "tax" && "Payment & Pricing"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <section className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Items Category Details Tab */}
          {activeTab === "type" && (
            <>
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-700 underline">
                  Category Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="flex flex-col gap-1 text-sm w-full">
                    <span className="font-medium text-gray-600">
                      Item Type
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                    <select
                      name="itemType"
                      value={form.itemType || ""}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    >
                      {itemTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ModalInput
                    label="Id"
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    required
                  />
                  <ModalInput
                    label="Category Name"
                    name="groupName"
                    value={form.groupName}
                    onChange={handleChange}
                    // required
                  />
                  <ModalInput
                    label="Category Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                  {/* <Input
                        label="Unit of Measurement"
                        name="unitOfMeasurement"
                        value={form.unitOfMeasurement}
                        onChange={handleChange}
                      /> */}
                  {/* <ItemGenericSelect
                        label="UOM"
                        value={form.unitOfMeasurement}
                        fetchData={getUOMs}
                        // displayField="code"
                        displayFormatter={(item) => `${item.code} - ${item.name}`}
                        onChange={({ id }) => {
                          setForm(p => ({ ...p, unitOfMeasurement: id }));
                        }}
                      /> */}
                  <ItemGenericSelect
                    label="UOM"
                    value={form.unitOfMeasurement}
                    fetchData={getUOMs}
                    onChange={({ id }) =>
                      setForm((p) => ({ ...p, unitOfMeasurement: id }))
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* Payment Details Tab */}
          {activeTab === "tax" && (
            <div className="space-y-8 mt-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 underline mb-4">
                  Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <ModalInput
                    label="Selling Price"
                    name="sellingPrice"
                    value={form.sellingPrice || ""}
                    onChange={handleChange}
                  />
                  <ModalInput
                    label="Sales Account"
                    name="salesAccount"
                    value={form.salesAccount || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </form>
    </Modal>
  );
};

// Input Component (unchanged)
// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   icon?: React.ReactNode;
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ label, icon, className = "", ...props }, ref) => (
//     <label className="flex flex-col gap-1 text-sm w-full">
//       <span className="font-medium text-gray-600">
//         {label}
//         {props.required && <span className="text-red-500 ml-1">*</span>}
//       </span>
//       <div className="relative">
//         {icon && (
//           <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
//             {icon}
//           </div>
//         )}
//         <input
//           ref={ref}
//           className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${icon ? "pl-10" : ""
//             } ${props.disabled ? "bg-gray-50" : ""} ${className}`}
//           {...props}
//         />
//       </div>
//     </label>
//   ),
// );
// Input.displayName = "Input";

export default ItemsCategoryModal;
