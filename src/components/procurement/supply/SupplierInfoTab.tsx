import React, { useState } from "react";
import { taxCategorySelectOptions, type SupplierFormData } from "../../../types/Supply/supplier";
import { ModalInput, ModalSelect } from "../../ui/modal/modalComponent";


interface SupplierInfoTabProps {
  form: SupplierFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const SupplierInfoTab: React.FC<SupplierInfoTabProps> = ({ form, onChange }) => {

  const [errors, setErrors] = useState<{
    phoneNo?: string;
    alternateNo?: string;
  }>({});


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // parent form change
    onChange(e);

    // validation
    if (name === "phoneNo" || name === "alternateNo") {
      if (!/^\d*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only numbers allowed",
        }));
      } else if (value.length > 0 && value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Must be 10 digits",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

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
              onChange={handleInputChange}
              type="tel"
              maxLength={10}
              error={errors.phoneNo}
            />

            <ModalInput
              label="Alternate No"
              name="alternateNo"
              value={form.alternateNo}
              onChange={handleInputChange}
              type="tel"
              maxLength={10}
              error={errors.alternateNo}
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
