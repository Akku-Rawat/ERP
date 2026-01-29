import React, { useState, useEffect } from "react";
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
  const ITEMS_PER_PAGE = 5;

  // Supplier pagination
  const [supPage, setSupPage] = useState(0);
  useEffect(() => {
    const p = Math.floor((suppliers.length - 1) / ITEMS_PER_PAGE);
    if (p !== supPage) setSupPage(p);
  }, [suppliers.length]);

  const paginatedSuppliers = suppliers.slice(
    supPage * ITEMS_PER_PAGE,
    (supPage + 1) * ITEMS_PER_PAGE
  );

  // Items pagination
  const [itemPage, setItemPage] = useState(0);
  useEffect(() => {
    const p = Math.floor((items.length - 1) / ITEMS_PER_PAGE);
    if (p !== itemPage) setItemPage(p);
  }, [items.length]);

  const paginatedItems = items.slice(
    itemPage * ITEMS_PER_PAGE,
    (itemPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="grid grid-cols-3 gap-6 p-4 bg-app text-main">
      <div className="col-span-2 space-y-6">

        {/* RFQ DETAILS */}
        <Card title="RFQ Details">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Input label="RFQ Number" value={rfqNumber} onChange={(e) => onRfqNumberChange(e.target.value)} />
            <Input type="date" label="Request Date" value={requestDate} onChange={(e) => onRequestDateChange(e.target.value)} />
            <Input type="date" label="Quote Deadline" value={quoteDeadline} onChange={(e) => onQuoteDeadlineChange(e.target.value)} />
            <Select label="Status" value={status} onChange={(e) => onStatusChange(e.target.value)}>
              <option>Draft</option>
              <option>Sent</option>
              <option>Received</option>
            </Select>
          </div>
        </Card>

        {/* SUPPLIERS */}
        <Card title="Suppliers">
          {/* Pagination info */}
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>
              Showing {supPage * ITEMS_PER_PAGE + 1}–
              {Math.min((supPage + 1) * ITEMS_PER_PAGE, suppliers.length)} of {suppliers.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setSupPage((p) => Math.max(0, p - 1))} disabled={supPage === 0}
                className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50">
                Prev
              </button>
              <button onClick={() => setSupPage((p) => p + 1)}
                disabled={(supPage + 1) * ITEMS_PER_PAGE >= suppliers.length}
                className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50">
                Next
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-theme rounded-lg">
            <table className="w-full text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-2 py-2">#</th>
                  <th className="px-2 py-2">Supplier</th>
                  <th className="px-2 py-2">Contact</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Send</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y border-theme">
                {paginatedSuppliers.map((sup, idx) => {
                  const i = supPage * ITEMS_PER_PAGE + idx;
                  return (
                    <tr key={i} className="row-hover">
                      <td className="px-2 py-2">{i + 1}</td>
                      <td className="px-1 py-1">
                        <Input label="" value={sup.supplier} onChange={(e) => onSupplierChange(i, "supplier", e.target.value)} />
                      </td>
                      <td className="px-1 py-1">
                        <Input label="" value={sup.contact} onChange={(e) => onSupplierChange(i, "contact", e.target.value)} />
                      </td>
                      <td className="px-1 py-1">
                        <Input label="" value={sup.email} onChange={(e) => onSupplierChange(i, "email", e.target.value)} />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input type="checkbox" checked={sup.sendEmail} onChange={(e) => onSupplierChange(i, "sendEmail", e.target.checked)} />
                      </td>
                      <td className="px-1 py-1">
                        <Button variant="ghost" onClick={() => onRemoveSupplier(i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button variant="secondary" className="mt-3" onClick={onAddSupplier}>
            <Plus className="w-4 h-4" /> Add Supplier
          </Button>
        </Card>

        {/* ITEMS */}
        <Card title="Items">
          {/* Pagination info */}
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>
              Showing {itemPage * ITEMS_PER_PAGE + 1}–
              {Math.min((itemPage + 1) * ITEMS_PER_PAGE, items.length)} of {items.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setItemPage((p) => Math.max(0, p - 1))} disabled={itemPage === 0}
                className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50">
                Prev
              </button>
              <button onClick={() => setItemPage((p) => p + 1)}
                disabled={(itemPage + 1) * ITEMS_PER_PAGE >= items.length}
                className="px-2 py-1 bg-app border border-theme rounded disabled:opacity-50">
                Next
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-theme rounded-lg">
            <table className="w-full text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-2 py-2">No</th>
                  <th className="px-2 py-2">Item Code</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Qty</th>
                  <th className="px-2 py-2">UOM</th>
                  <th className="px-2 py-2">Warehouse</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y border-theme">
                {paginatedItems.map((it, idx) => {
                  const i = itemPage * ITEMS_PER_PAGE + idx;
                  return (
                    <tr key={i} className="row-hover">
                      <td className="px-2 py-2">{i + 1}</td>
                      <td className="px-1 py-1">
                        <Input label="" value={it.itemCode} onChange={(e) => onItemChange(i, "itemCode", e.target.value)} />
                      </td>
                      <td className="px-1 py-1">
                        <Input type="date" label="" value={it.requiredDate} onChange={(e) => onItemChange(i, "requiredDate", e.target.value)} />
                      </td>
                      <td className="px-1 py-1">
                        <Input type="number" label="" value={it.quantity} onChange={(e) => onItemChange(i, "quantity", Number(e.target.value))} />
                      </td>
                      <td className="px-1 py-1">
                        <Input label="" value={it.uom} onChange={(e) => onItemChange(i, "uom", e.target.value)} />
                      </td>
                      <td className="px-1 py-1">
                        <Input label="" value={it.warehouse} onChange={(e) => onItemChange(i, "warehouse", e.target.value)} />
                      </td>
                      <td className="px-1 py-1">
                        <Button variant="ghost" onClick={() => onRemoveItem(i)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button variant="secondary" className="mt-3" onClick={onAddItem}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </Card>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="col-span-1 space-y-6">
        <Card title="Supplier Summary">
          <p className="text-sm text-muted">Total Suppliers: {suppliers.length}</p>
          <p className="text-sm text-muted">
            Emails to Send: {suppliers.filter((s) => s.sendEmail).length}
          </p>
        </Card>

        <Card title="Items Summary">
          <p className="text-sm text-muted">Total Items: {items.length}</p>
          <p className="text-sm text-muted">
            Total Qty: {items.reduce((s, it) => s + it.quantity, 0)}
          </p>
        </Card>
      </div>
    </div>
  );
};
