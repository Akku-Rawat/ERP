import React, { useState, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X} from "lucide-react";
  

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface FormData {
  itemsGroup: string;
  itemsName: string;
  itemsCode: string;
  description: string;
  category: string;
  brand: string;
}

const emptyForm: FormData = {
  itemsGroup:"",
  itemsName: "",
  itemsCode: "",
  description: "",
  category: "",
  brand: "",
};

const ItemModal: React.FC<ItemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setForm((p) => ({ ...p, [name]: value }));
};

  const reset = () => {
    setForm({ ...emptyForm });
   };

 const submit = (e: React.FormEvent) => {
     e.preventDefault();
     onSubmit?.({ ...form });
     reset();
     onClose();
   };

  if (!isOpen) return null;

   return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className=" w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col"
        >
          <form
            onSubmit={submit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
              <h2 className="text-2xl font-semibold text-blue-700">
                Add Items
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </header>

              

            {/* Tab Content */}
            <section className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* ====================== DETAILS ====================== */}
                 <div className="gap-6 max-h-screen overflow-auto p-4">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">Items Information</h3> 
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                          label="Item Group"
                          name="itemsGroup"
                          type="group"
                          value={form.itemsGroup}
                          onChange={handleForm}
                          className="w-full"
                        /> 
                        <div className="flex flex-col gap-1">
                        <Input
                          label="Items Name"
                          name="itemsName"
                          type="name"
                          value={form.itemsName}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                       </div>
                       <div className="flex flex-col gap-1">
                        <Input
                          label="Items Code"
                          name="itemsCode"
                          type="code"
                          value={form.itemsCode}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                       </div>
                       <div className="flex flex-col gap-1">
                        <Input
                          label="Category"
                          name="category"
                          type="cat"
                          value={form.category}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                       </div>
                       <div className="flex flex-col gap-1">
                        <Input
                          label="Brand"
                          name="brand"
                          type="brand"
                          value={form.brand}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                       </div>
                       <div className="flex flex-col gap-1">
                        <Input
                          label="Description"
                          name="description"
                          type="desc"
                          value={form.description}
                          onChange={handleForm}
                          className="w-full col-span-3"
                        />
                       </div>
                      </div>
                     </div> 
  
  </div>

          </section>
            <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save Item
                </button>
              </div>
            </footer>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
 
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className = '', ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm w-full">
    <span className="font-medium text-gray-600">{label}</span>
    <input
      ref={ref}
      className={`rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = 'Input';

const Select: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, name, value, onChange, options }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export default ItemModal;