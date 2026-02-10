import React from "react";
import { Building2, Mail } from "lucide-react";
import { Input, Card } from "../../ui/modal/formComponent";
import {  taxCategorySelectOptions, type SupplierFormData } from "../../../types/Supply/supplier";
import CountrySelect from "../../selects/CountrySelect";
import Select from "../../ui/Select";
import { ModalInput, ModalSelect } from "../../ui/modal/modalComponent";


interface SupplierInfoTabProps {
  form: SupplierFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const SupplierInfoTab: React.FC<SupplierInfoTabProps> = ({ form, onChange }) => {
  return (
    <Card
      title="Supplier Information"
      subtitle="Supplier, contact and address details"
      icon={<Building2 className="w-5 h-5 text-primary" />}
    >
      <div className="space-y-6">
        {/* Supplier Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Supplier Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Input
              label="Tax Id / TPIN"
              name="tpin"
              value={form.tpin}
              onChange={onChange}
              placeholder="maximum 10 digit"
              required
            />
            <Input
              label="Supplier Name"
              name="supplierName"
              value={form.supplierName}
              onChange={onChange}
              required
            />
            <Input
              label="Supplier Code"
              name="supplierCode"
              value={form.supplierCode}
              onChange={onChange}
            />
             <Select
            label="Tax Category"
            name="taxCategory"
            value={form.taxCategory}
            onChange={onChange}
            options={[
              { value: "", label: "Select Tax Category..." },
                ...taxCategorySelectOptions,
            ]}
          />
         
          </div>
        </div>


        {/* Contact Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Input
              label="Contact Person Name"
              name="contactPerson"
              value={form.contactPerson}
              onChange={onChange}
              required
            />
            <Input
              label="Phone No"
              name="phoneNo"
              value={form.phoneNo}
              onChange={onChange}
              type="tel"
            />
            <Input
              label="Alternate No"
              name="alternateNo"
              value={form.alternateNo}
              onChange={onChange}
            />
            <Input
              label="Email Id"
              name="emailId"
              value={form.emailId}
              onChange={onChange}
              type="email"
             
            />
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* Address Details */}
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
      </div>
    </Card>
  );
};
