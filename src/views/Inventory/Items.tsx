import React, { useState, useEffect} from "react";
import ItemModal from "../../components/inventory/ItemModal";


const base_url = import.meta.env.VITE_BASE_URL;
const GET_ITEMS_ENDPOINT = `${base_url}.item.item.get_all_items_api`;

interface ItemsProps {
  onAdd: () => void;  
}

const Items: React.FC<ItemsProps> = ({onAdd}) => {

  const [item, setItem] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemLoading, setItemLoading] = useState(true);
  const [showItemsModal, setShowItemsModal] = useState(false);

    const fetchItems = async () => {
    try {
      setItemLoading(true);
      const response = await fetch(GET_ITEMS_ENDPOINT, {
        headers: { Authorization: import.meta.env.VITE_AUTHORIZATION },
      });
      if (!response.ok) throw new Error("Failed to load customers");
      const result = await response.json();
      setItem(result.data || []);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setItemLoading(false);
    }
  };

  const filtered = item.filter((i: any) =>
    [i.item_code, i.item_name, i.item_group, i.custom_min_stock_level, i.custom_max_stock_level, 
      i.custom_vendor, i.custom_selling_price]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Items
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Item Code</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Min Stock</th>
              <th className="px-4 py-2 text-left">Max Stock</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{i.item_code}</td>
                <td className="px-4 py-2">{i.item_name}</td>
                <td className="px-4 py-2">{i.item_group}</td>
                <td className="px-4 py-2">{i.custom_min_stock_level}</td>
                <td className="px-4 py-2">{i.custom_max_stock_level}</td>
                <td className="px-4 py-2">${i.custom_vendor}</td>
                <td className="px-4 py-2">{i.custom_selling_price}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ItemModal
        isOpen={showItemsModal}
        onClose={() => setShowItemsModal(false)}
        onSubmit={(data) => console.log("New Items:", data)}
      />
    </div>
  );
};

export default Items;
