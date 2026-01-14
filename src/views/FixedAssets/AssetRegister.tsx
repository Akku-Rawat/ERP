import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import AddAssetModal from "../../components/FixedAsset/AddAssetModal";

type Asset = {
  id: number;
  name: string;
  category: string;
  location: string;
  purchaseDate: string;
  value: number;
};

const AssetRegister: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddAsset = (asset: Omit<Asset, "id">) => {
    setAssets([
      ...assets,
      { id: Date.now(), ...asset, value: Number(asset.value) },
    ]);
  };

  const handleDelete = (id: number) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add Asset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-black rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-black">
            <tr>
              <th className="p-3 text-left">Asset Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Purchase Date</th>
              <th className="p-3 text-right">Value</th>
                <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No assets added
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="border-t border-black">
                  <td className="p-3">{asset.name}</td>
                  <td className="p-3">{asset.category}</td>
                  <td className="p-3">{asset.location}</td>
                  <td className="p-3">{asset.purchaseDate}</td>
                  <td className="p-3 text-right">
                    ZK {asset.value.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AddAssetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddAsset}
      />
    </div>
  );
};

export default AssetRegister;
