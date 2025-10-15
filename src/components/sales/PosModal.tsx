import React, { useState, useReducer } from "react";

// --- Sample data for products ---
const sampleProducts = [
  {
    id: 1,
    name: "Wireless Mouse",
    image: "https://via.placeholder.com/80?text=Mouse",
    price: 18.99,
  },
  {
    id: 2,
    name: "USB-C Cable",
    image: "https://via.placeholder.com/80?text=Cable",
    price: 8.5,
  },
  {
    id: 3,
    name: "Notebook",
    image: "https://via.placeholder.com/80?text=Notebook",
    price: 3.25,
  },
  {
    id: 4,
    name: "Water Bottle",
    image: "https://via.placeholder.com/80?text=Bottle",
    price: 12.0,
  },
];

// --- Types ---
type Product = typeof sampleProducts[number];
type CartItem = Product & { quantity: number };

interface PosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: number }
  | { type: "UPDATE_QTY"; id: number; quantity: number }
  | { type: "APPLY_DISCOUNT"; discount: number }
  | { type: "CLEAR" };

interface CartState {
  items: CartItem[];
  discount: number;
}

// --- Cart Reducer ---
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find((item) => item.id === action.product.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case "APPLY_DISCOUNT":
      return {
        ...state,
        discount: action.discount,
      };
    case "CLEAR":
      return {
        items: [],
        discount: 0,
      };
    default:
      return state;
  }
}

const TAX_RATE = 0.08; // 8%

// --- POS Component ---
const PosModal: React.FC<PosModalProps> = ({ isOpen, onClose, onSave }) => {
  const [products] = useState<Product[]>(sampleProducts);
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0,
  });
  const [darkMode, setDarkMode] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes - cart.discount;

  // --- Handlers ---
  const handleAddItem = (product: Product) =>
    dispatch({ type: "ADD", product });
  const handleRemoveItem = (id: number) =>
    dispatch({ type: "REMOVE", id });
  const handleQtyChange = (id: number, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", id, quantity: Math.max(1, quantity) });
  const handleDiscount = () => {
    const discountValue = prompt("Enter discount amount", "0");
    if (discountValue) {
      dispatch({ type: "APPLY_DISCOUNT", discount: Number(discountValue) });
    }
  };
  const handleCheckout = () => {
    if (onSave) onSave(cart);
    alert("Checkout complete! (Demo)");
    dispatch({ type: "CLEAR" });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className={darkMode ? "bg-gray-900 min-h-[90vh] rounded-lg shadow-2xl w-[90vw] max-w-6xl p-2 transition" : "bg-gray-50 min-h-[90vh] rounded-lg shadow-2xl w-[90vw] max-w-6xl p-2 transition"}>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className={darkMode ? "text-white font-bold text-2xl" : "text-gray-900 font-bold text-2xl"}>
              Point of Sale
            </h1>
            <div className="flex items-center gap-2">
              <button
                className="rounded-full bg-gray-200 dark:bg-gray-800 p-2 focus:outline-none"
                onClick={() => setDarkMode((d) => !d)}
                aria-label="Toggle Dark Mode"
                type="button"
              >
                {darkMode ? (
                  <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7.5 7.5 0 1 0 9.79 9.79z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
              <button className="rounded-full p-2 text-2xl font-bold hover:bg-gray-200 text-gray-700" onClick={onClose} title="Close" type="button">&times;</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product List */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-lg mb-2 w-20 h-20 object-contain bg-gray-100"
                    />
                    <div className={darkMode ? "text-white font-medium text-lg mb-1" : "text-gray-900 font-medium text-lg mb-1"}>
                      {product.name}
                    </div>
                    <div className={darkMode ? "text-gray-300 text-sm mb-2" : "text-gray-500 text-sm mb-2"}>
                      ${product.price.toFixed(2)}
                    </div>
                    <button
                      className="mt-auto w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all"
                      onClick={() => handleAddItem(product)}
                      type="button"
                    >
                      Add Item
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
              <div className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                Shopping Cart
              </div>
              {cart.items.length === 0 && (
                <div className="text-gray-400 text-center py-4">Cart is empty</div>
              )}
              <ul className="flex-1 divide-y divide-gray-200 dark:divide-gray-700 mb-4">
                {cart.items.map((item) => (
                  <li key={item.id} className="py-3 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded bg-gray-100 mr-2"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-xs text-gray-500">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center mr-2">
                      <button
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full w-7 h-7 flex items-center justify-center mr-1 text-xl"
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        type="button"
                      >
                        –
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQtyChange(item.id, Number(e.target.value))
                        }
                        className="w-10 text-center border border-gray-300 dark:border-gray-700 rounded-md px-1 py-0.5 text-base"
                      />
                      <button
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full w-7 h-7 flex items-center justify-center ml-1 text-xl"
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity + 1)
                        }
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="ml-2 bg-red-100 dark:bg-red-700 text-red-500 dark:text-red-200 rounded-lg px-2 py-1 text-sm hover:bg-red-200"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove"
                      type="button"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Taxes</span>
                  <span className="text-gray-900 dark:text-white">${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Discount</span>
                  <span className="text-gray-900 dark:text-white">
                    -${cart.discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-blue-600 dark:text-blue-300">${Math.max(total, 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <button
                  className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 text-lg shadow touch-auto"
                  onClick={handleDiscount}
                  type="button"
                >
                  Apply Discount
                </button>
                <button
                  className="w-full py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 text-lg shadow touch-auto"
                  onClick={handleCheckout}
                  disabled={cart.items.length === 0}
                  type="button"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosModal;
