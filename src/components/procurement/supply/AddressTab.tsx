/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from "react";
import type { SupplierFormData } from "../../../types/Supply/supplier";
import { ModalInput } from "../../ui/modal/modalComponent";
import SearchSelect from "../../ui/modal/SearchSelect";
import { getCountry, getProvinces, getTowns } from "../../../api/PlacesApi";
interface AddressTabProps {
  form: SupplierFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  errors?: {
    billingAddressLine1?: string;
    billingCity?: string;
    billingCountry?: string;
    district?: string;
    province?: string;
    billingPostalCode?: string;
  };
}

export const AddressTab: React.FC<AddressTabProps> = ({ form, onChange, errors = {} }) => {
  const fetchCountryOptions = async (q: string) => {
    const res = await getCountry(q);
    return (res.data || []).map((c: string) => ({
      label: c,
      value: c,
    }));
  };

  const fetchProvinceOptions = async (q: string) => {
    const res = await getProvinces(q);
    return (res.data || []).map((p: string) => ({
      label: p,
      value: p,
    }));
  };

  const fetchTownOptions = async (q: string) => {
    const res = await getTowns(q);
    return (res.data || []).map((t: string) => ({
      label: t,
      value: t,
    }));
  };

  return (
    <section className="flex-1 overflow-y-auto p-4 space-y-6 bg-app">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <ModalInput
            label="Address Line 1"
            name="billingAddressLine1"
            value={form.billingAddressLine1}
            onChange={onChange}
            required
            error={errors.billingAddressLine1}
          />

          <ModalInput
            label="Address Line 2"
            name="billingAddressLine2"
            value={form.billingAddressLine2}
            onChange={onChange}
          />
          <ModalInput
            label="City / Town"
            name="billingCity"
            value={form.billingCity}
            onChange={onChange}
            error={errors.billingCity}
          />

          <ModalInput
            label="Country"
            name="billingCountry"
            value={form.billingCountry}
            onChange={onChange}
            error={errors.billingCountry}
          />
          <ModalInput
            label="District"
            name="district"
            value={form.district}
            onChange={onChange}
            required
            error={errors.district}
          />

          <ModalInput
            label="Province"
            name="province"
            value={form.province}
            onChange={onChange}
            error={errors.province}
          />
          <ModalInput
            label="Postal Code"
            name="billingPostalCode"
            value={form.billingPostalCode}
            onChange={onChange}
            required
            error={errors.billingPostalCode}
          />
        </div>
      </div>
    </section>
  );
};
