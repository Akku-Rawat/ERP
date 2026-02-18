import React, { useEffect } from "react";
import { Card, Checkbox } from "./formComponent";
import { ModalInput ,ModalSelect } from "./modalComponent";
import { getCountryList } from "../../../api/lookupApi";

interface Address {
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

interface AddressBlockProps {
  type: "billing" | "shipping";
  title: string;
  subtitle?: string;
  data: Address;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  sameAsBilling?: boolean;
  onSameAsBillingChange?: (checked: boolean) => void;
  disableAll?: boolean;
}

const AddressBlock: React.FC<AddressBlockProps> = ({
  type,
  title,
  subtitle,
  data,
  onChange,
  sameAsBilling,
  onSameAsBillingChange,
  disableAll = false,
}) => {
  const isShipping = type === "shipping";

const [countries, setCountries] = React.useState<any[]>([]);

const countryOptions = countries.map((c: any) => ({
  label: c.name,   
  value: c.code,   
}));


useEffect(() => {
  const fetchCountries = async () => {
    try {
      const res = await getCountryList();

      // If API returns direct array
      setCountries(res || []);

    } catch (err) {
      console.error("Failed to load countries", err);
    }
  };

  fetchCountries();
}, []);



  return (
    <Card
      title={title}
      subtitle={subtitle}
      className="relative"
    >
      {/* Same as billing toggle */}
      {isShipping && onSameAsBillingChange && (
        <div className="absolute top-6 right-6">
          <Checkbox
            label="Same as billing"
            checked={!!sameAsBilling}
            onChange={onSameAsBillingChange}
          />

        </div>
      )}

      <div className="space-y-4 mt-4">
        <ModalInput
          label="Line 1"
          name="line1"
          value={data.line1}
          onChange={onChange}
          disabled={disableAll || sameAsBilling}
        />

        <ModalInput
          label="Line 2"
          name="line2"
          value={data.line2}
          onChange={onChange}
          disabled={disableAll || sameAsBilling}
        />

        <div className="grid grid-cols-2 gap-4">
          <ModalInput
            label="Postal Code"
            name="postalCode"
            value={data.postalCode}
            onChange={onChange}
            disabled={disableAll || sameAsBilling}
          />

          <ModalInput
            label="City"
            name="city"
            value={data.city}
            onChange={onChange}
            disabled={disableAll || sameAsBilling}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ModalInput
            label="State"
            name="state"
            value={data.state}
            onChange={onChange}
            disabled={disableAll || sameAsBilling}
          />

          <ModalSelect
  label="Country"
  name="country"
  value={data.country}
  onChange={onChange}
  options={countryOptions}
  disabled={disableAll || sameAsBilling}
/>


        </div>
      </div>
    </Card>
  );
};

export default AddressBlock;
