/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getImportItemById } from "../../api/importApi";
import Modal from "../ui/modal/modal";
import { Button } from "../ui/modal/formComponent";

interface ViewImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  importId: string | null;
}

interface ImportItemDetails {
  taskCode: string;
  declarationDate: string;
  itemSequence: string;
  declarationNumber: string;
  hsCode: string;
  itemName: string;
  importItemStatus: string;
  originCountryCode: string;
  exportCountryCode: string;
  packageQuantity: string;
  packageUnitCode: string | null;
  quantity: string;
  quantityUnitCode: string;
  totalWeight: string;
  netWeight: string;
  supplierName: string;
  agentName: string;
  invoiceAmount: string;
  invoiceCurrency: string;
  invoiceExchangeRate: string;
  id: string;
  syncStatus: string;
}

const ViewImportModal: React.FC<ViewImportModalProps> = ({
  isOpen,
  onClose,
  importId,
}) => {
  const [importData, setImportData] = useState<ImportItemDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && importId) {
      fetchImportDetails();
    }
  }, [isOpen, importId]);

  const fetchImportDetails = async () => {
    if (!importId) return;

    try {
      setLoading(true);
      const data = await getImportItemById(importId);
      setImportData(data);
    } catch (err) {
      toast.error("Failed to load import item details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImportData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Item Details"
      subtitle={`Viewing details for import ID: ${importId}`}
      maxWidth="5xl"
      height="auto"
    >
      <div className="flex flex-col h-full">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading import details...</div>
          </div>
        ) : importData ? (
          <>
            {/* Header Information */}
            <section className="p-6 bg-gray-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Import ID
                  </label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {importData.id}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Task Code
                  </label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {importData.taskCode}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Declaration Number
                  </label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {importData.declarationNumber}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">
                    Declaration Date
                  </label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {importData.declarationDate}
                  </p>
                </div>
              </div>
            </section>

            {/* Item Information */}
            <section className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField label="Import ID" value={importData.id} />
                <InfoField label="Item Name" value={importData.itemName} />
                <InfoField label="Quantity" value={importData.quantity} />
                <InfoField
                  label="Quantity Unit"
                  value={importData.quantityUnitCode}
                />
                <InfoField
                  label="Origin Country"
                  value={importData.originCountryCode}
                />
                <InfoField
                  label="Export Country"
                  value={importData.exportCountryCode}
                />
                <InfoField
                  label="Invoice Amount"
                  value={`${importData.invoiceAmount} ${importData.invoiceCurrency}`}
                />
                <InfoField
                  label="Exchange Rate"
                  value={importData.invoiceExchangeRate}
                />
                <InfoField label="Supplier" value={importData.supplierName} />
                <InfoField label="Agent" value={importData.agentName} />
                <InfoField
                  label="Declaration Number"
                  value={importData.declarationNumber}
                />
                <InfoField label="HS Code" value={importData.hsCode} />
              </div>
            </section>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t px-6 py-4 bg-white">
              <Button variant="secondary" type="button" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">No import data available</div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Helper component for displaying info fields
const InfoField: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <label className="text-xs font-medium text-gray-500 uppercase block mb-1">
      {label}
    </label>
    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
      {value}
    </p>
  </div>
);

export default ViewImportModal;
