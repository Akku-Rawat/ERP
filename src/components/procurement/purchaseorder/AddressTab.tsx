import React from "react";
import { Textarea } from "../../ui/modal/formComponent";
import type { PurchaseOrderFormData } from "../../../types/Supply/purchaseOrder";

interface AddressTabProps {
  form: PurchaseOrderFormData;
  onFormChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AddressTab: React.FC<AddressTabProps> = ({ form, onFormChange }) => {
  return (
    <div className="space-y-8 mt-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">Supplier Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Textarea
            label="Supplier Address"
            name="supplierAddress"
            value={form.supplierAddress}
            onChange={onFormChange}
            rows={2}
          />
          <Textarea
            label="Supplier Contact"
            name="supplierContact"
            value={form.supplierContact}
            onChange={onFormChange}
            rows={2}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Textarea
            label="Dispatch Address"
            name="dispatchAddress"
            value={form.dispatchAddress}
            onChange={onFormChange}
            rows={2}
          />
          <Textarea
            label="Shipping Address"
            name="shippingAddress"
            value={form.shippingAddress}
            onChange={onFormChange}
            rows={2}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">Company Billing Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Textarea
            label="Company Billing Address"
            name="companyBillingAddress"
            value={form.companyBillingAddress}
            onChange={onFormChange}
            rows={2}
          />
          <Textarea
            label="Place of Supply"
            name="placeOfSupply"
            value={form.placeOfSupply}
            onChange={onFormChange}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};
