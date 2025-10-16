import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

interface FormData {
  // Product Information
  productOwner: string;
  productCode: string;
  productActive: boolean;
  productCategory: string;
  salesEndDate: string;
  supportEndDate: string;
  productName: string;
  vendorName: string;
  manufacturer: string;
  salesStartDate: string;
  supportStartDate: string;
  // Price Information
  unitPrice: number;
  tax: number;
  commissionRate: number;
  taxable: boolean;
  // Stock Information
  usageUnit: string;
  quantityInStock: number;
  handler: string;
  qtyOrdered: number;
  reorderLevel: number;
  quantityInDemand: number;
  // Description Information
  description: string;
  // Image
  file: File | null;
}

const emptyForm: FormData = {
  productOwner: "",
  productCode: "",
  productActive: true,
  productCategory: "",
  salesEndDate: "",
  supportEndDate: "",
  productName: "",
  vendorName: "",
  manufacturer: "",
  salesStartDate: "",
  supportStartDate: "",
  unitPrice: 0,
  tax: 0,
  commissionRate: 0,
  taxable: true,
  usageUnit: "",
  quantityInStock: 0,
  handler: "",
  qtyOrdered: 0,
  reorderLevel: 0,
  quantityInDemand: 0,
  description: "",
  file: null,
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [openSections, setOpenSections] = useState({
    productInfo: true,
    priceInfo: true,
    stockInfo: true,
    descriptionInfo: true,
    productImage: true,
  });

  const toggleSection = (name: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [name]: !s[name] }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setForm(emptyForm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white w-[96vw] max-w-6xl shadow-lg flex flex-col max-h-[90vh] overflow-hidden"
        >
          <form className="pb-2 bg-[#fefefe]/10 flex flex-col flex-1 overflow-hidden" onSubmit={handleSubmit}>
            <div className="flex h-12 items-center justify-between border-b px-6 py-3 rounded-t-lg bg-blue-100/30 shrink-0">
              <h3 className="text-2xl w-full font-semibold text-blue-600">
                Create Product
              </h3>
              <button type="button" className="text-gray-700 hover:bg-[#fefefe] rounded-full w-8 h-8" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto border-b px-4">
              {/* PRODUCT INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("productInfo")}
                >
                  <span className="mr-2">PRODUCT INFORMATION</span>
                  <span className="ml-auto">{openSections.productInfo ? "▾" : "▸"}</span>
                </div>
                {openSections.productInfo && (
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <input className="col-span-1 border rounded p-2" placeholder="Product Owner" name="productOwner" value={form.productOwner} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Product Code" name="productCode" value={form.productCode} onChange={handleChange} />
                    <div className="col-span-1 flex items-center">
                      <input type="checkbox" className="mr-2" name="productActive" checked={form.productActive} onChange={handleChange} />
                      <label>Product Active</label>
                    </div>
                    <input className="col-span-1 border rounded p-2" placeholder="Product Category" name="productCategory" value={form.productCategory} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="date" placeholder="Sales End Date" name="salesEndDate" value={form.salesEndDate} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="date" placeholder="Support End Date" name="supportEndDate" value={form.supportEndDate} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Product Name" name="productName" value={form.productName} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Vendor Name" name="vendorName" value={form.vendorName} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="date" placeholder="Sales Start Date" name="salesStartDate" value={form.salesStartDate} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="date" placeholder="Support Start Date" name="supportStartDate" value={form.supportStartDate} onChange={handleChange} />
                  </div>
                )}
              </div>

              {/* PRICE INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("priceInfo")}
                >
                  <span className="mr-2">PRICE INFORMATION</span>
                  <span className="ml-auto">{openSections.priceInfo ? "▾" : "▸"}</span>
                </div>
                {openSections.priceInfo && (
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Unit Price" name="unitPrice" value={form.unitPrice} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Tax" name="tax" value={form.tax} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Commission Rate" name="commissionRate" value={form.commissionRate} onChange={handleChange} />
                    <div className="col-span-1 flex items-center">
                      <input type="checkbox" className="mr-2" name="taxable" checked={form.taxable} onChange={handleChange} />
                      <label>Taxable</label>
                    </div>
                  </div>
                )}
              </div>

              {/* STOCK INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("stockInfo")}
                >
                  <span className="mr-2">STOCK INFORMATION</span>
                  <span className="ml-auto">{openSections.stockInfo ? "▾" : "▸"}</span>
                </div>
                {openSections.stockInfo && (
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <input className="col-span-1 border rounded p-2" placeholder="Usage Unit" name="usageUnit" value={form.usageUnit} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Quantity in Stock" name="quantityInStock" value={form.quantityInStock} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" placeholder="Handler" name="handler" value={form.handler} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Qty Ordered" name="qtyOrdered" value={form.qtyOrdered} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Reorder Level" name="reorderLevel" value={form.reorderLevel} onChange={handleChange} />
                    <input className="col-span-1 border rounded p-2" type="number" placeholder="Quantity in Demand" name="quantityInDemand" value={form.quantityInDemand} onChange={handleChange} />
                  </div>
                )}
              </div>

              {/* DESCRIPTION INFORMATION */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("descriptionInfo")}
                >
                  <span className="mr-2">DESCRIPTION INFORMATION</span>
                  <span className="ml-auto">{openSections.descriptionInfo ? "▾" : "▸"}</span>
                </div>
                {openSections.descriptionInfo && (
                  <div className="mb-6">
                    <textarea className="border rounded p-2 w-full h-32" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <button type="button" className="border rounded p-2 text-sm">Create Form Views</button>
                      <button type="button" className="border rounded p-2 text-sm">Standard View</button>
                      <button type="button" className="border rounded p-2 text-sm">Create a custom form page</button>
                    </div>
                  </div>
                )}
              </div>

              {/* PRODUCT IMAGE */}
              <div className="border m-4 p-6 flex flex-col gap-y-2">
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-6 mb-3"
                  onClick={() => toggleSection("productImage")}
                >
                  <span className="mr-2">PRODUCT IMAGE</span>
                  <span className="ml-auto">{openSections.productImage ? "▾" : "▸"}</span>
                </div>
                {openSections.productImage && (
                  <div className="flex items-center gap-4">
                    <input type="file" accept="image/*" onChange={handleFile} className="block" />
                    {form.file && <span className="text-xs text-green-700">{form.file.name}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="m-3 flex items-center justify-between gap-x-7 shrink-0">
              <button type="button"
                className="w-24 rounded-3xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex gap-x-2">
                <button
                  type="submit"
                  className="w-24 rounded-3xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="w-24 rounded-3xl bg-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-500 hover:text-white"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProductModal;