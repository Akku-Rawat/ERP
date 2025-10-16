import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

const sectionClass = "border rounded-lg mb-4";
const labelClass = "block text-xs font-semibold mb-1";
const inputClass =
  "border border-gray-300 rounded px-2 py-1 w-full text-sm bg-white focus:outline-none focus:border-blue-400";
const selectClass =
  "border border-gray-300 rounded px-2 py-1 w-full text-sm bg-white focus:outline-none focus:border-blue-400";

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // SECTION TOGGLES
  const [openSections, setOpenSections] = useState({
    fulfillment: true,
    images: true,
    barcode: false,
    additional: true,
    custom: true,
    attachments: false,
    description: false,
    note: false,
  });

  const toggleSection = (name: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [name]: !s[name] }));

  // MAIN FORM STATE
  const [form, setForm] = useState({
    sku: "",
    description: "",
    uom: "pcs",
    onHand: 0,
    stockPrice: 0,
    type: "Product",

    // CATEGORY
    taxCategory: "Default",
    itemCategory: "Internal other",
    trademark: "Default trademark",
    searchScope: "All selected",
    storageLocation: "Materials",
    serialNo: "Without tracking",
    lotNumber: "Without tracking",

    // SELLING PRICE
    price: 0,
    priceType: "Default",

    // FULFILLMENT
    backOrder: "Supplier",
    supplier: "",
    keySupplier: "",
    purchasePrice: 0,
    landingCost: 0,
    dutyRate: 0,
    skuSupplier: "",
    shippingDays: "",
    minOrderQty: 0,
    orderStepQty: 0,
    minStockQty: 0,

    // ADDITIONAL INFO
    countryOrigin: "",
    tariff: "",
    manual: "",
    expiryDate: "",
    netWeight: 0,
    grossWeight: 0,
    uomWeight: "kg",
    volume: 0,
    dimensions: "",

    // CUSTOM FIELDS
    custom1: "",
    custom2: "",
    custom3: "",
  });

  // IMAGE UPLOAD STATE (Simple)
  const [file, setFile] = useState<File | null>(null);

  // HANDLERS
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ ...form, file });
    onClose();
    setForm({
      sku: "",
      description: "",
      uom: "pcs",
      onHand: 0,
      stockPrice: 0,
      type: "Product",

      taxCategory: "Default",
      itemCategory: "Internal other",
      trademark: "Default trademark",
      searchScope: "All selected",
      storageLocation: "Materials",
      serialNo: "Without tracking",
      lotNumber: "Without tracking",

      price: 0,
      priceType: "Default",

      backOrder: "Supplier",
      supplier: "",
      keySupplier: "",
      purchasePrice: 0,
      landingCost: 0,
      dutyRate: 0,
      skuSupplier: "",
      shippingDays: "",
      minOrderQty: 0,
      orderStepQty: 0,
      minStockQty: 0,

      countryOrigin: "",
      tariff: "",
      manual: "",
      expiryDate: "",
      netWeight: 0,
      grossWeight: 0,
      uomWeight: "kg",
      volume: 0,
      dimensions: "",

      custom1: "",
      custom2: "",
      custom3: "",
    });
    setFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="rounded-lg bg-white mt-6 w-[97vw] max-w-6xl shadow-xl pb-2"
        >
          <form className="bg-white" onSubmit={handleSubmit}>
            {/* Modal Header */}
            <div className="flex h-12 items-center justify-between border-b px-6 py-7 rounded-t-lg bg-blue-100/30">
              <h3 className="text-2xl font-semibold text-blue-600">Product Details</h3>
              <button
                type="button"
                className="text-gray-700 hover:bg-gray-200 rounded-full w-8 h-8"
                onClick={onClose}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="overflow-y-auto h-[82vh] border-b px-4">
              {/* BASIC INFO */}
              <div className={sectionClass}>
                <div className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center -mx-4 mb-3">
                  <span className="mr-2">BASIC INFO</span>
                </div>
                <div className="grid grid-cols-7 gap-4 px-4 pb-4">
                  <div>
                    <label className={labelClass}>SKU</label>
                    <input className={inputClass} name="sku" value={form.sku} onChange={handleChange} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Description</label>
                    <input className={inputClass} name="description" value={form.description} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelClass}>UOM</label>
                    <input className={inputClass} name="uom" value={form.uom} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelClass}>On hand</label>
                    <input type="number" className={inputClass} name="onHand" value={form.onHand} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelClass}>Stock price</label>
                    <input type="number" className={inputClass} name="stockPrice" value={form.stockPrice} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <input className={inputClass} name="type" value={form.type} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* ITEM CATEGORY */}
              <div className={sectionClass}>
                <div className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center -mx-4 mb-3">
                  <span className="mr-2">ITEM CATEGORY</span>
                </div>
                <div className="grid grid-cols-6 gap-4 px-4 pb-4">
                  <div>
                    <label className={labelClass}>Tax category</label>
                    <select className={selectClass} name="taxCategory" value={form.taxCategory} onChange={handleChange}>
                      <option>Default</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Item category</label>
                    <select className={selectClass} name="itemCategory" value={form.itemCategory} onChange={handleChange}>
                      <option>Internal other</option>
                      <option>Raw Material</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Trademark</label>
                    <select className={selectClass} name="trademark" value={form.trademark} onChange={handleChange}>
                      <option>Default trademark</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Search scope</label>
                    <select className={selectClass} name="searchScope" value={form.searchScope} onChange={handleChange}>
                      <option>All selected</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Storage location</label>
                    <select className={selectClass} name="storageLocation" value={form.storageLocation} onChange={handleChange}>
                      <option>Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Serial No.</label>
                    <select className={selectClass} name="serialNo" value={form.serialNo} onChange={handleChange}>
                      <option>Without tracking</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Lot number</label>
                    <select className={selectClass} name="lotNumber" value={form.lotNumber} onChange={handleChange}>
                      <option>Without tracking</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SELLING PRICE */}
              <div className={sectionClass}>
                <div className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center -mx-4 mb-3">
                  <span className="mr-2">SELLING PRICE</span>
                </div>
                <div className="grid grid-cols-3 gap-4 px-4 pb-4">
                  <div>
                    <label className={labelClass}>Default - Price</label>
                    <input type="number" className={inputClass} name="price" value={form.price} onChange={handleChange} />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <select className={selectClass} name="priceType" value={form.priceType} onChange={handleChange}>
                      <option>Default</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ITEM PROPERTIES: FULFILLMENT */}
              <div className={sectionClass}>
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-4 mb-3"
                  onClick={() => toggleSection("fulfillment")}
                >
                  <span className="mr-2">FULFILLMENT</span>
                  <span className="ml-auto">{openSections.fulfillment ? "▾" : "▸"}</span>
                </div>
                {openSections.fulfillment && (
                  <div className="grid grid-cols-6 gap-4 px-4 pb-4">
                    <div>
                      <label className={labelClass}>Back Order</label>
                      <select className={selectClass} name="backOrder" value={form.backOrder} onChange={handleChange}>
                        <option>Supplier</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Supplier</label>
                      <input className={inputClass} name="supplier" value={form.supplier} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Key (Supplier)</label>
                      <input className={inputClass} name="keySupplier" value={form.keySupplier} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Purchase price</label>
                      <input type="number" className={inputClass} name="purchasePrice" value={form.purchasePrice} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Landing cost</label>
                      <input type="number" className={inputClass} name="landingCost" value={form.landingCost} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Duty Rate (%)</label>
                      <input type="number" className={inputClass} name="dutyRate" value={form.dutyRate} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>SKU (Supplier)</label>
                      <input className={inputClass} name="skuSupplier" value={form.skuSupplier} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Shipping days</label>
                      <input className={inputClass} name="shippingDays" value={form.shippingDays} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Minimum order qty</label>
                      <input type="number" className={inputClass} name="minOrderQty" value={form.minOrderQty} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Order step quantity</label>
                      <input type="number" className={inputClass} name="orderStepQty" value={form.orderStepQty} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Minimum stock qty</label>
                      <input type="number" className={inputClass} name="minStockQty" value={form.minStockQty} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              {/* ITEM IMAGES */}
              <div className={sectionClass}>
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-4 mb-3"
                  onClick={() => toggleSection("images")}
                >
                  <span className="mr-2">ITEM IMAGES</span>
                  <span className="ml-auto">{openSections.images ? "▾" : "▸"}</span>
                </div>
                {openSections.images && (
                  <div className="px-4 pb-4 flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="block"
                    />
                    {file && <span className="text-xs text-green-700">{file.name}</span>}
                  </div>
                )}
              </div>

              {/* BARCODE / SECOND UOM */}
              <div className={sectionClass}>
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-4 mb-3"
                  onClick={() => toggleSection("barcode")}
                >
                  <span className="mr-2">BARCODE / SECOND UOM</span>
                  <span className="ml-auto">{openSections.barcode ? "▾" : "▸"}</span>
                </div>
                {openSections.barcode && (
                  <div className="px-4 pb-4"> {/* Place barcode/UOM fields here if needed */}</div>
                )}
              </div>

              {/* ADDITIONAL INFO */}
              <div className={sectionClass}>
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-4 mb-3"
                  onClick={() => toggleSection("additional")}
                >
                  <span className="mr-2">ADDITIONAL INFO</span>
                  <span className="ml-auto">{openSections.additional ? "▾" : "▸"}</span>
                </div>
                {openSections.additional && (
                  <div className="grid grid-cols-7 gap-4 px-4 pb-4">
                    <div>
                      <label className={labelClass}>Country of origin</label>
                      <select className={selectClass} name="countryOrigin" value={form.countryOrigin} onChange={handleChange}>
                        <option value="">Select</option>
                        <option>India</option>
                        <option>USA</option>
                        <option>Germany</option>
                        <option>China</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Harmonized Tariff</label>
                      <input className={inputClass} name="tariff" value={form.tariff} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Manual</label>
                      <input className={inputClass} name="manual" value={form.manual} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Expiry date</label>
                      <input className={inputClass} name="expiryDate" value={form.expiryDate} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Net weight</label>
                      <input type="number" className={inputClass} name="netWeight" value={form.netWeight} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Gross weight</label>
                      <input type="number" className={inputClass} name="grossWeight" value={form.grossWeight} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>UOM</label>
                      <select className={selectClass} name="uomWeight" value={form.uomWeight} onChange={handleChange}>
                        <option>kg</option>
                        <option>lb</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Volume</label>
                      <input type="number" className={inputClass} name="volume" value={form.volume} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Dimensions</label>
                      <input className={inputClass} name="dimensions" value={form.dimensions} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              {/* CUSTOM FIELDS */}
              <div className={sectionClass}>
                <div
                  className="font-semibold text-gray-700 bg-gray-50 px-4 py-2 flex items-center cursor-pointer select-none -mx-4 mb-3"
                  onClick={() => toggleSection("custom")}
                >
                  <span className="mr-2">CUSTOM FIELDS</span>
                  <span className="ml-auto">{openSections.custom ? "▾" : "▸"}</span>
                </div>
                {openSections.custom && (
                  <div className="grid grid-cols-3 gap-4 px-4 pb-4">
                    <div>
                      <label className={labelClass}>Custom field 1</label>
                      <input className={inputClass} name="custom1" value={form.custom1} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Custom field 2</label>
                      <input className={inputClass} name="custom2" value={form.custom2} onChange={handleChange} />
                    </div>
                    <div>
                      <label className={labelClass}>Custom field 3</label>
                      <input className={inputClass} name="custom3" value={form.custom3} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="m-4 flex items-center justify-between gap-x-6">
              <button
                type="button"
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
                  onClick={() => {
                    setForm({
                      sku: "",
                      description: "",
                      uom: "pcs",
                      onHand: 0,
                      stockPrice: 0,
                      type: "Product",
                      taxCategory: "Default",
                      itemCategory: "Internal other",
                      trademark: "Default trademark",
                      searchScope: "All selected",
                      storageLocation: "Materials",
                      serialNo: "Without tracking",
                      lotNumber: "Without tracking",
                      price: 0,
                      priceType: "Default",
                      backOrder: "Supplier",
                      supplier: "",
                      keySupplier: "",
                      purchasePrice: 0,
                      landingCost: 0,
                      dutyRate: 0,
                      skuSupplier: "",
                      shippingDays: "",
                      minOrderQty: 0,
                      orderStepQty: 0,
                      minStockQty: 0,
                      countryOrigin: "",
                      tariff: "",
                      manual: "",
                      expiryDate: "",
                      netWeight: 0,
                      grossWeight: 0,
                      uomWeight: "kg",
                      volume: 0,
                      dimensions: "",
                      custom1: "",
                      custom2: "",
                      custom3: "",
                    });
                    setFile(null);
                  }}
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
} 
export default ProductModal;