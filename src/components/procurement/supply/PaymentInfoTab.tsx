import React from "react";
import type { SupplierFormData } from "../../../types/Supply/supplier";
import { currencyOptions } from "../../../types/Supply/supplier";
import { ModalInput, ModalSelect } from "../../ui/modal/modalComponent";

interface PaymentInfoTabProps {
  form: SupplierFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  errors?: {
    currency?: string;
    paymentTerms?: string;
    dateOfAddition?: string;
    openingBalance?: string;
    bankAccount?: string;
    accountNumber?: string;
    accountHolder?: string;
    sortCode?: string;
    swiftCode?: string;
    branchAddress?: string;
  };
}

const currencySelectOptions = currencyOptions.map((c) => ({
  value: c,
  label: c,
}));

export const PaymentInfoTab: React.FC<PaymentInfoTabProps> = ({
  form,
  onChange,
  errors = {},
}) => {
  return (
    <section className="flex-1 overflow-y-auto p-4 space-y-6 bg-app">
      {/* Payment Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Payment Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <ModalSelect
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={onChange}
            options={[...currencySelectOptions]}
            required
            error={errors.currency}
          />

          <ModalInput
            label="Payment Terms "
            name="paymentTerms"
            min={0} // UI block
            value={form.paymentTerms}
            onChange={onChange}
            required
            error={errors.paymentTerms}
          />

          <ModalInput
            label="Date of Addition"
            name="dateOfAddition"
            type="date"
            value={form.dateOfAddition}
            onChange={onChange}
            required
            error={errors.dateOfAddition}
          />

          <ModalInput
            label="Opening Balance"
            name="openingBalance"
            type="number"
            value={form.openingBalance}
            onChange={onChange}
            required
            error={errors.openingBalance}
          />
        </div>
      </div>

      <div className="my-6 border-t border-gray-200" />

      {/* Bank Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Bank Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <ModalInput
            label="Bank"
            name="bankAccount"
            value={form.bankAccount}
            onChange={onChange}
            required
            error={errors.bankAccount}
          />

          <ModalInput
            label="Account No"
            name="accountNumber"
            value={form.accountNumber}
            onChange={onChange}
            required
            error={errors.accountNumber}
          />

          <ModalInput
            label="Account Holder Name"
            name="accountHolder"
            value={form.accountHolder}
            onChange={onChange}
            required
            error={errors.accountHolder}
          />

          <ModalInput
            label="Sort Code"
            name="sortCode"
            value={form.sortCode}
            onChange={onChange}
            required
            error={errors.sortCode}
          />

          <ModalInput
            label="SWIFT Code"
            name="swiftCode"
            value={form.swiftCode}
            onChange={onChange}
            required
            error={errors.swiftCode}
          />

          <ModalInput
            label="Branch Address"
            name="branchAddress"
            value={form.branchAddress}
            onChange={onChange}
            required
            error={errors.branchAddress}
          />
        </div>
      </div>
    </section>
  );
};
