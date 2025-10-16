import React, { useState } from "react";

// Modern Section for card-style headers
const Block: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div className="border rounded-md bg-white mb-4">
    <div className="px-4 pt-3 pb-2 text-gray-800 font-bold text-sm border-b bg-gray-50">{title}</div>
    <div className="p-4 grid gap-4">{children}</div>
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="border border-gray-300 rounded-md bg-white px-3 py-2 text-sm w-full"
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className="border border-gray-300 rounded-md bg-white px-3 py-2 text-sm w-full"
  >
    {props.children}
  </select>
);

const TableHeader: React.FC<{ label: string; className?: string }> = ({
  label,
  className = "",
}) => (
  <th
    className={`bg-gray-50 border-b border-gray-200 px-2 py-2 text-xs font-medium text-gray-700 ${className}`}
  >
    {label}
  </th>
);

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const demoCustomers = [
  "Cash Customer",
  "Acme Ventures",
  "Sample Walkin"
];
const demoProducts = [
  { product: "C001 - Choco Bar", price: 40, available: 16 },
  { product: "C002 - Milk Shake", price: 60, available: 9 },
  { product: "S005 - Veg Sandwich", price: 50, available: 20 }
];

const POSModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [number] = useState("POS-2025-001");
  const [date, setDate] = useState("");
  const [cashier, setCashier] = useState("Demo User");
  const [customer, setCustomer] = useState("");
  const [scanCode, setScanCode] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState("");

  // Add demo item to cart for simplicity
  const addToCart = () => {
    const found = demoProducts.find(
      prod => prod.product.startsWith(scanCode)
    );
    if (found) {
      setCart([
        ...cart,
        { ...found, qty: 1, amount: found.price }
      ]);
      setScanCode("");
    }
  };

  const updateItemQty = (idx: number, qty: number) => {
    const ct = [...cart];
    ct[idx].qty = qty;
    ct[idx].amount = qty * ct[idx].price;
    setCart(ct);
  };

  const removeItem = (idx: number) => {
    setCart(cart.filter((_, i) => i !== idx));
  };

  const subtotal = cart.reduce((acc, itm) => acc + itm.amount, 0);
  const discountVal = Number(discount);
  const grandTotal = subtotal - discountVal;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        number,
        date,
        cashier,
        customer,
        cart,
        paymentMethod,
        discount: discountVal,
        note,
        grandTotal
      });
    }
    onClose();
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-4xl mx-auto my-8 rounded-lg bg-white shadow-2xl border">
        <form onSubmit={handleSave} autoComplete="off">
          {/* Modal header */}
          <div className="flex items-center justify-between py-4 px-6 bg-blue-50 rounded-t-lg border-b">
            <h2 className="text-2xl font-bold text-blue-700">New POS Sale</h2>
            <button type="button" className="text-2xl text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center" onClick={onClose}>&times;</button>
          </div>
          <div className="overflow-y-auto max-h-[80vh] p-4 md:p-6">
            {/* Document Header */}
            <Block title="DOCUMENT HEADER">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <Input value={number} readOnly placeholder="Bill No." />
                </div>
                <div>
                  <Input value={cashier} readOnly placeholder="Cashier" />
                </div>
                <div>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Date" />
                </div>
                <div>
                  <Input placeholder="Any remarks" />
                </div>
              </div>
            </Block>
            {/* Customer */}
            <Block title="CUSTOMER">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select value={customer} onChange={e => setCustomer(e.target.value)}>
                    <option value="">Select customer</option>
                    {demoCustomers.map(cust => (
                      <option key={cust}>{cust}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Input placeholder="Phone (optional)" />
                </div>
              </div>
            </Block>
            {/* Add/scan product */}
            <Block title="ADD/SCAN PRODUCT">
              <div className="flex gap-3 items-center">
                <Input
                  placeholder="Scan code or enter (e.g., C001)"
                  value={scanCode}
                  onChange={e => setScanCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addToCart}
                  className="bg-blue-600 text-white rounded px-5 py-2 font-bold"
                >
                  Add Item
                </button>
              </div>
            </Block>
            {/* Product Table */}
            <Block title="CART ITEMS">
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded text-xs">
                  <thead>
                    <tr>
                      <TableHeader label="#" />
                      <TableHeader label="Product" />
                      <TableHeader label="Qty" />
                      <TableHeader label="Price" />
                      <TableHeader label="Amount" />
                      <TableHeader label="Remove" />
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-2 text-gray-400">No items added.</td>
                      </tr>
                    ) : (
                      cart.map((item, idx) => (
                        <tr key={idx} className="bg-white border-t">
                          <td className="px-2 py-2">{idx + 1}</td>
                          <td className="px-2 py-2">{item.product}</td>
                          <td className="px-2 py-2">
                            <Input
                              type="number"
                              min={1}
                              max={item.available}
                              value={item.qty}
                              onChange={e => updateItemQty(idx, Number(e.target.value))}
                              style={{ width: "60px" }}
                            />
                          </td>
                          <td className="px-2 py-2">{item.price}</td>
                          <td className="px-2 py-2">{item.amount}</td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="bg-red-100 text-red-600 rounded-full px-3 py-1 font-bold"
                            >&times;</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Block>
            {/* Payment & Note */}
            <Block title="PAYMENT & NOTES">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-600 text-xs mb-1 font-semibold">Payment Method</label>
                  <Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                    <option value="">Select method</option>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>UPI</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-gray-600 text-xs mb-1 font-semibold">Discount</label>
                  <Input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={e => setDiscount(Number(e.target.value))}
                    placeholder="Discount (₹)"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs mb-1 font-semibold">Note</label>
                  <Input
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Any note"
                  />
                </div>
              </div>
            </Block>
            {/* Summary */}
            <div className="flex justify-end gap-4 my-6">
              <div className="bg-gray-100 rounded px-6 py-4 text-lg font-medium text-gray-700 w-72">
                <div className="mb-1 flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="mb-1 flex justify-between">
                  <span>Discount:</span>
                  <span>₹{discountVal}</span>
                </div>
                <div className="flex justify-between text-blue-800 font-bold border-t pt-2 mt-2 text-xl">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-end items-center bg-gray-50 py-4 px-6 border-t rounded-b-lg">
            <button
              type="button"
              className="w-28 rounded-3xl bg-gray-200 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-28 rounded-3xl bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 ml-3"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default POSModal;
