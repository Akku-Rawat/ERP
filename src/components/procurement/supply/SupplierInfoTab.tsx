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
     <section className="flex-1 overflow-y-auto p-4 space-y-6 bg-app">
      <div className="space-y-6">
        {/* Supplier Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Supplier Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <ModalInput
              label="Tax Id / TPIN"
              name="tpin"
              value={form.tpin}
              onChange={onChange}
              placeholder="maximum 10 digit"
              required
            />
            <ModalInput
              label="Supplier Name"
              name="supplierName"
              value={form.supplierName}
              onChange={onChange}
              required
            />
            <ModalInput
              label="Supplier Code"
              name="supplierCode"
              value={form.supplierCode}
              onChange={onChange}
            />
             <ModalSelect
            label="Tax Category"
            name="taxCategory"
            value={form.taxCategory}
            onChange={onChange}
            options={[
                ...taxCategorySelectOptions,
            ]}
          />
         
          </div>
        </div>


        {/* Contact Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <ModalInput
              label="Contact Person Name"
              name="contactPerson"
              value={form.contactPerson}
              onChange={onChange}
              required
            />
            <ModalInput
              label="Phone No"
              name="phoneNo"
              value={form.phoneNo}
              onChange={onChange}
              type="tel"
            />
            <ModalInput
              label="Alternate No"
              name="alternateNo"
              value={form.alternateNo}
              onChange={onChange}
            />
            <ModalInput
              label="Email Id"
              name="emailId"
              value={form.emailId}
              onChange={onChange}
              type="email"
             
            />
          </div>
        </div>

      </div>
    </section>
  );
};
