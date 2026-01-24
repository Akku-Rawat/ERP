import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input, Select, Card, Button } from "../../ui/modal/formComponent";
import type { SupplierRow, ItemRow } from "../../../types/Supply/rfq";

interface DetailsTabProps {
  rfqNumber: string;
  requestDate: string;
  quoteDeadline: string;
  status: string;
  suppliers: SupplierRow[];
  items: ItemRow[];
  onRfqNumberChange: (value: string) => void;
  onRequestDateChange: (value: string) => void;
  onQuoteDeadlineChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSupplierChange: (idx: number, field: keyof SupplierRow, value: any) => void;
  onAddSupplier: () => void;
  onRemoveSupplier: (idx: number) => void;
  onItemChange: (idx: number, field: keyof ItemRow, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (idx: number) => void;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
  rfqNumber,
  requestDate,
  quoteDeadline,
  status,
  suppliers,
  items,
  onRfqNumberChange,
  onRequestDateChange,
  onQuoteDeadlineChange,
  onStatusChange,
  onSupplierChange,
  onAddSupplier,
  onRemoveSupplier,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      <div className="col-span-2 space-y-6">
        <Card title="RFQ Details">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Input
              label="RFQ Number"
              value={rfqNumber}
              onChange={(e) => onRfqNumberChange(e.target.value)}
            />
            <Input
              type="date"
              label="Request Date"
              value={requestDate}
              onChange={(e) => onRequestDateChange(e.target.value)}
            />
            <Input
              type="date"
              label="Quote Deadline"
              value={quoteDeadline}
              onChange={(e) => onQuoteDeadlineChange(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option>Draft</option>
              <option>Sent</option>
              <option>Received</option>
            </Select>
          </div>
        </Card>

        <Card title="Suppliers">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-row-hover">
                <tr>
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">Supplier</th>
                  <th className="px-2 py-2">Contact</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Send</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((sup, i) => (
                  <tr key={i}>
                    <td className="px-2 py-2">{i + 1}</td>
                    <td className="px-1 py-1">
                      <Input
                        label=""
                        value={sup.supplier}
                        onChange={(e) => onSupplierChange(i, "supplier", e.target.value)}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Input
                        label=""
                        value={sup.contact}
                        onChange={(e) => onSupplierChange(i, "contact", e.target.value)}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Input
                        label=""
                        value={sup.email}
                        onChange={(e) => onSupplierChange(i, "email", e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={sup.sendEmail}
                        onChange={(e) => onSupplierChange(i, "sendEmail", e.target.checked)}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Button variant="ghost" onClick={() => onRemoveSupplier(i)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="secondary" className="mt-3" onClick={onAddSupplier}>
            <Plus className="w-4 h-4" /> Add Supplier
          </Button>
        </Card>

        <Card title="Items">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-row-hover">
                <tr>
                  <th className="px-2 py-2">No</th>
                  <th className="px-2 py-2">Item Code</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Qty</th>
                  <th className="px-2 py-2">UOM</th>
                  <th className="px-2 py-2">Warehouse</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i}>
                    <td className="px-2 py-2">{i + 1}</td>
                    <td className="px-1 py-1">
                      <Input
                        label=""
                        value={it.itemCode}
                        onChange={(e) => onItemChange(i, "itemCode", e.target.value)}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Input
                        type="date"
                        label=""
                        value={it.requiredDate}
                        onChange={(e) => onItemChange(i, "requiredDate", e.target.value)}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Input
                        type="number"
                        label=""
                        value={it.quantity}
                        onChange={(e) => onItemChange(i, "quantity", Number(e.target.value))}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Input
                        label=""
                        value={it.uom}
                        onChange={(e) => onItemChange(i, "uom", e.target.value)}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Input
                        label=""
                        value={it.warehouse}
                        onChange={(e) => onItemChange(i, "warehouse", e.target.value)}
                      />
                    </td>
                    <td className="px-1 py-1">
                      <Button variant="ghost" onClick={() => onRemoveItem(i)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="secondary" className="mt-3" onClick={onAddItem}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </Card>
      </div>

      <div className="col-span-1 space-y-6">
        <Card title="Supplier Summary">
          <p className="text-sm text-gray-600">Total Suppliers: {suppliers.length}</p>
          <p className="text-sm text-gray-600">
            Emails to Send: {suppliers.filter((s) => s.sendEmail).length}
          </p>
        </Card>

        <Card title="Items Summary">
          <p className="text-sm text-gray-600">Total Items: {items.length}</p>
          <p className="text-sm text-gray-600">
            Total Qty: {items.reduce((s, it) => s + it.quantity, 0)}
          </p>
        </Card>
      </div>
    </div>
  );
};
