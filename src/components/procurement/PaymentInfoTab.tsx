import React from "react";
import { DollarSign } from "lucide-react";
import { Input, Select, Card } from "../ui/modal/formComponent";
import type { SupplierFormData } from "../../types/Supply/supplier";
import { currencyOptions } from "../../types/Supply/supplier";

interface PaymentInfoTabProps {
  form: SupplierFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const PaymentInfoTab: React.FC<PaymentInfoTabProps> = ({ form, onChange }) => {
  return (
    <Card
      title="Payment & Bank Details"
      subtitle="Payment terms and bank information"
      icon={<DollarSign className="w-5 h-5 text-primary" />}
    >
      {/* Payment Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Select
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={onChange}
          >
            <option value="">Select currency...</option>
            {currencyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="Payment Terms (Days)"
            name="paymentTerms"
            value={form.paymentTerms}
            onChange={onChange}
          />
          <Input
            label="Date of Addition"
            name="dateOfAddition"
            type="date"
            value={form.dateOfAddition}
            onChange={onChange}
          />
          <Input
            label="Opening Balance"
            name="openingBalance"
            type="number"
            value={form.openingBalance}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="my-6 border-t border-gray-200" />

      {/* Bank Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Input
            label="Account No"
            name="accountNumber"
            value={form.accountNumber}
            onChange={onChange}
            required
          />
          <Input
            label="Account Holder Name"
            name="accountHolder"
            value={form.accountHolder}
            onChange={onChange}
            required
          />
          <Input
            label="Sort Code"
            name="sortCode"
            value={form.sortCode}
            onChange={onChange}
          />
          <Input
            label="SWIFT Code"
            name="swiftCode"
            value={form.swiftCode}
            onChange={onChange}
          />
          <Input
            label="Branch Address"
            name="branchAddress"
            value={form.branchAddress}
            onChange={onChange}
          />
        </div>
      </div>
    </Card>
  );
};