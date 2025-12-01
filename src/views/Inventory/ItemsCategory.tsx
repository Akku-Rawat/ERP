import React, { useEffect, useState } from "react";
import ItemsCategoryModal from "../../components/inventory/ItemsCategoryModal";

import { getAllItemGroups } from "../../api/itemCategoryApi";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
}

interface ProductsProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
}

const ItemsCategory: React.FC<ProductsProps> = ({
  products,
  searchTerm,
  setSearchTerm,
  onAdd,
}) => {
  const [itemsCat, setItemsCat] = useState<any[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [itemCatLoading, setItemCatLoading] = useState(false);

  const fetchItemsCategory = async () => {
    try {
      setItemCatLoading(true);
      const response = await getAllItemGroups();
      setItemsCat(response);
    } catch (err) {
      console.error("Error loading item:", err);
    } finally {
      setItemCatLoading(false);
    }
  };

  useEffect(() => {
    fetchItemsCategory();
  }, []);

  const filteredItemsCat = itemsCat.filter((i: any) =>
    [
      i.item_code,
      i.item_name,
      i.item_group,
      i.custom_min_stock_level,
      i.custom_max_stock_level,
      i.custom_vendor,
      i.custom_selling_price,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
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
          Add Items Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Unit of Measurement</th>
              <th className="px-4 py-2 text-left">Selling Price</th>
              <th className="px-4 py-2 text-left">Sales Account</th>
            </tr>
          </thead>
          <tbody>
            {filteredItemsCat.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.item_group_name}</td>
                <td className="px-4 py-2">{p.custom_description}</td>
                <td className="px-4 py-2">{p.custom_unit_of_measurement}</td>
                <td className="px-4 py-2">{p.custom_selling_price}</td>
                <td className="px-4 py-2">{p.custom_sales_account}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ItemsCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={(data) => console.log("New Items Category:", data)}
      />
    </div>
  );
};

export default ItemsCategory;
