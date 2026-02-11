import React from "react";
import { MapPin } from "lucide-react";
import { Input, Card } from "../../ui/modal/formComponent";
import CountrySelect from "../../selects/CountrySelect";
import type { SupplierFormData } from "../../../types/Supply/supplier";

interface AddressTabProps {
  form: SupplierFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export const AddressTab: React.FC<AddressTabProps> = ({
  form,
  onChange,
}) => {
  return (
    <Card
      title="Address Details"
      subtitle="Billing and location information"
      icon={<MapPin className="w-5 h-5 text-primary" />}
    >
          <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Input
              label="Address Line 1"
              name="billingAddressLine1"
              value={form.billingAddressLine1}
              onChange={onChange}
            />

            <Input
              label="Address Line 2"
              name="billingAddressLine2"
              value={form.billingAddressLine2}
              onChange={onChange}
            />

            <Input
              label="City"
              name="billingCity"
              value={form.billingCity}
              onChange={onChange}
            />

            <CountrySelect
              value={form.billingCountry}
              label="Country"
              onChange={(country: { code: string; name: string }) =>
                onChange({
                  target: { name: "billingCountry", value: country.name },
                } as any)
              }
            />


            <Input
              label="District"
              name="district"
              value={form.district}
              onChange={onChange}
            />

            <Input
              label="Province"
              name="province"
              value={form.province}
              onChange={onChange}
            />

          

            <Input
              label="Postal Code"
              name="billingPostalCode"
              value={form.billingPostalCode}
              onChange={onChange}
            />
          </div>

        </div>
    </Card>
  );
};
