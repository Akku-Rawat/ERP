import React from "react";
import { Card, Checkbox } from "./formComponent";
import { ModalInput } from "./modalComponent";

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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

          <ModalInput
            label="Country"
            name="country"
            value={data.country}
            onChange={onChange}
            disabled={disableAll || sameAsBilling}
          />
        </div>
      </div>
    </Card>
  );
};

export default AddressBlock;
