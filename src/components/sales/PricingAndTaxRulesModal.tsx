import React from "react";

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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Add {type === "price" ? "Price List" : "Tax Rule"}
        </h3>

        <form className="space-y-2" onSubmit={handleSubmit}>
          {type === "price" ? (
            <>
              <input
                type="text"
                placeholder="List Name"
                onChange={(e) => setFormData((f: any) => ({ ...f, listName: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Product"
                onChange={(e) => setFormData((f: any) => ({ ...f, product: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
              <input
                type="number"
                placeholder="Price"
                onChange={(e) => setFormData((f: any) => ({ ...f, price: Number(e.target.value) }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Currency"
                defaultValue="INR"
                onChange={(e) => setFormData((f: any) => ({ ...f, currency: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
              />
              <input
                type="date"
                onChange={(e) => setFormData((f: any) => ({ ...f, validFrom: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Rule Name"
                onChange={(e) => setFormData((f: any) => ({ ...f, ruleName: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Applicable On"
                onChange={(e) => setFormData((f: any) => ({ ...f, applicableOn: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
              <input
                type="number"
                placeholder="Tax %"
                onChange={(e) => setFormData((f: any) => ({ ...f, taxPercent: Number(e.target.value) }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Tax Type"
                defaultValue="GST"
                onChange={(e) => setFormData((f: any) => ({ ...f, taxType: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
              />
              <input
                type="date"
                onChange={(e) => setFormData((f: any) => ({ ...f, validFrom: e.target.value }))}
                className="border px-2 py-1 rounded w-full"
                required
              />
            </>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingAndTaxRulesModal;