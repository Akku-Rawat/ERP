import React from "react";
import Modal from "../ui/modal/modal";

interface StockItem {
  itemCode: string;
  quantity: number;
  rate: number;
  taxableAmount: string;
  taxAmount: string;
  totalAmount: string;
  warehouse: string;
}

interface StockData {
  id: string;
  date: string;
  orgSarNo: string;
  registrationType: string;
  stockEntryType: string;
  totalTaxableAmount: string;
  items: StockItem[];
}

interface ViewStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockData: StockData | null;
}

const ViewStockModal: React.FC<ViewStockModalProps> = ({
  isOpen,
  onClose,
  stockData,
}) => {
  if (!isOpen || !stockData) return null;

  const registrationTypeMap: Record<string, string> = {
    M: "Manual",
    A: "Automatic",
  };

  const stockEntryTypeMap: Record<string, string> = {
    "01": "Opening Stock",
    "02": "Goods Receipt",
    "03": "Goods Issue",
    "04": "Material Transfer",
    "05": "Stock Adjustment",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Entry Details"
      subtitle={`Stock ID: ${stockData.id}`}
      maxWidth="5xl"
      height="auto"
    >
      <div className="p-6 space-y-6">
        {/* Stock Entry Header Information */}
        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Date
            </label>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {stockData.date}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Organization SAR No
            </label>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {stockData.orgSarNo}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Registration Type
            </label>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {registrationTypeMap[stockData.registrationType] ||
                stockData.registrationType}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Stock Entry Type
            </label>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {stockEntryTypeMap[stockData.stockEntryType] ||
                stockData.stockEntryType}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase">
              Total Taxable Amount
            </label>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {parseFloat(stockData.totalTaxableAmount).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Item Code
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Rate
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Taxable Amount
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Tax Amount
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Warehouse
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stockData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {item.itemCode}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {parseFloat(String(item.rate)).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {parseFloat(item.taxableAmount).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {parseFloat(item.taxAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                      {parseFloat(item.totalAmount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.warehouse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewStockModal;
