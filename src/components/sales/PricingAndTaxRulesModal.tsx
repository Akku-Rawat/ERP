import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PriceListItem {
  id: number;
  listName: string;
  product: string;
  price: number;
  currency: string;
  validFrom: string;
}

interface TaxRuleItem {
  id: number;
  ruleName: string;
  applicableOn: string;
  taxPercent: number;
  taxType: string;
  validFrom: string;
}

interface ModalProps {
  type: "price" | "tax";
  show: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PriceListItem> | Partial<TaxRuleItem>) => void;
}

const PricingAndTaxRulesModal: React.FC<ModalProps> = ({ type, show, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState<any>({});

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = ['price', 'taxPercent'].includes(name) ? Number(value) : value;
    setFormData((f: any) => ({ ...f, [name]: val }));
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white w-[96vw] max-w-lg shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden" onSubmit={handleSubmit}>
            {/* Modal Title Bar */}
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Add {type === "price" ? "Price List" : "Tax Rule"}
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border-b">
              {/* Section Card Style */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div className="font-semibold text-gray-600 mb-4">{
                  type === "price" ? "PRICE LIST INFORMATION" : "TAX RULE INFORMATION"
                }</div>
                {type === "price" ? (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      name="listName"
                      placeholder="List Name"
                      value={formData.listName || ""}
                      onChange={handleChange}
                      className="col-span-2 border rounded p-2"
                      required
                    />
                    <input
                      name="product"
                      placeholder="Product"
                      value={formData.product || ""}
                      onChange={handleChange}
                      className="col-span-2 border rounded p-2"
                      required
                    />
                    <input
                      name="price"
                      type="number"
                      placeholder="Price"
                      value={formData.price || ""}
                      onChange={handleChange}
                      className="col-span-1 border rounded p-2"
                      required
                    />
                    <input
                      name="currency"
                      placeholder="Currency"
                      value={formData.currency || "INR"}
                      onChange={handleChange}
                      className="col-span-1 border rounded p-2"
                    />
                    <input
                      name="validFrom"
                      type="date"
                      value={formData.validFrom || ""}
                      onChange={handleChange}
                      className="col-span-2 border rounded p-2"
                      required
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      name="ruleName"
                      placeholder="Rule Name"
                      value={formData.ruleName || ""}
                      onChange={handleChange}
                      className="col-span-2 border rounded p-2"
                      required
                    />
                    <input
                      name="applicableOn"
                      placeholder="Applicable On"
                      value={formData.applicableOn || ""}
                      onChange={handleChange}
                      className="col-span-2 border rounded p-2"
                      required
                    />
                    <input
                      name="taxPercent"
                      type="number"
                      placeholder="Tax %"
                      value={formData.taxPercent || ""}
                      onChange={handleChange}
                      className="col-span-1 border rounded p-2"
                      required
                    />
                    <input
                      name="taxType"
                      placeholder="Tax Type"
                      value={formData.taxType || "GST"}
                      onChange={handleChange}
                      className="col-span-1 border rounded p-2"
                    />
                    <input
                      name="validFrom"
                      type="date"
                      value={formData.validFrom || ""}
                      onChange={handleChange}
                      className="col-span-2 border rounded p-2"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7 shrink-0">
              <button
                type="button"
                className="w-24 rounded-3xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-24 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PricingAndTaxRulesModal;
