import React, { useState } from "react";
import { Input } from "../../ui/modal/formComponent";
import type { PurchaseOrderFormData } from "../../../types/Supply/purchaseOrder";
import { MapPin, Truck, Building2, Plus, Minus, User } from "lucide-react";

interface AddressTabProps {
  form: PurchaseOrderFormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddressTab: React.FC<AddressTabProps> = ({ form, onFormChange }) => {
  const A = form.addresses;
  type AddressKey = keyof PurchaseOrderFormData["addresses"];

  const [open, setOpen] = useState<Record<AddressKey, boolean>>({
    supplierAddress: true,
    dispatchAddress: false,
    shippingAddress: true,
    companyBillingAddress: false,
  });

  const toggle = (key: AddressKey) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  const Block = ({
    title,
    subtitle,
    icon: Icon,
    keyName,
    extraRight,
  }: {
    title: string;
    subtitle?: string;
    icon: any;
    keyName: AddressKey;
    extraRight?: React.ReactNode;
  }) => {
    const data = A[keyName];

    return (
      <div className="bg-card border border-theme rounded-xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 bg-app border-b border-theme">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-main">{title}</p>
              {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {extraRight}
            <button
              type="button"
              onClick={() => toggle(keyName)}
              className="p-1 rounded hover:bg-row-hover"
            >
              {open[keyName] ? <Minus size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>

        {/* BODY */}
        {open[keyName] && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="Address Title" name={`addresses.${keyName}.addressTitle`} value={data.addressTitle} onChange={onFormChange} />
            <Input label="Address Type" name={`addresses.${keyName}.addressType`} value={data.addressType} onChange={onFormChange} />

            <Input label="Address Line 1" name={`addresses.${keyName}.addressLine1`} value={data.addressLine1} onChange={onFormChange} />
            <Input label="Address Line 2" name={`addresses.${keyName}.addressLine2`} value={data.addressLine2} onChange={onFormChange} />

            <Input label="Postal Code" name={`addresses.${keyName}.postalCode`} value={data.postalCode} onChange={onFormChange} />
            <Input label="City" name={`addresses.${keyName}.city`} value={data.city} onChange={onFormChange} />

            <Input label="State" name={`addresses.${keyName}.state`} value={data.state} onChange={onFormChange} />
            <Input label="Country" name={`addresses.${keyName}.country`} value={data.country} onChange={onFormChange} />

            {keyName === "supplierAddress" && (
              <>
                <Input label="Phone" name={`addresses.${keyName}.phone`} value={data.phone || ""} onChange={onFormChange} />
                <Input label="Email" name={`addresses.${keyName}.email`} value={data.email || ""} onChange={onFormChange} />
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Supplier Contact + Place of Supply */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card border border-theme p-4 rounded-xl mt-8">
       
        <Input
          label="Supplier Contact"
          name="supplierContact"
          value={form.supplierContact}
          onChange={onFormChange}
        />

        <Input
          label="Place of Supply"
          name="placeOfSupply"
          value={form.placeOfSupply}
          onChange={onFormChange}
        />
      </div>

      {/* ADDRESS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="space-y-4">
          <Block
            title="Supplier Address"
            icon={MapPin}
            keyName="supplierAddress"
          />

          <Block
            title="Company Billing Address"
            icon={Building2}
            keyName="companyBillingAddress"
          />
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <Block
            title="Shipping Address"
            icon={Truck}
            keyName="shippingAddress"
          />

          <Block
            title="Dispatch Address"
            icon={Truck}
            keyName="dispatchAddress"
          />
        </div>

      </div>
    </div>
  );
};
