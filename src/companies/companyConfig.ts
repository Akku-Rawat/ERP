import type { FieldConfig } from "../types/fieldConfig.types";

export const ZRA_ITEM_FIELDS: FieldConfig[] = [
  // Item Type - Static dropdown (same for all companies)
  {
    fieldName: "itemTypeCode",
    fieldType: "static-select",
    label: "Item Type",
    required: true,
    colSpan: 1,
    placeholder: "Select item type",
    options: [
      { value: "1", label: "Raw Material" },
      { value: "2", label: "Finished Product" },
      { value: "3", label: "Service" },
    ],
  },

  // Item Group - API driven with custom component
  {
    fieldName: "itemGroup",
    fieldType: "api-select",
    label: "Item Category",
    required: true,
    colSpan: 1,
    placeholder: "Search item category",
    apiFunctionName: "ItemCategorySelect", // Special component
    customComponent: "ItemCategorySelect",
  },

  // Item Name
  {
    fieldName: "itemName",
    fieldType: "text-input",
    label: "Items Name",
    required: true,
    colSpan: 1,
    placeholder: "Enter item name",
  },

  // Description
  {
    fieldName: "description",
    fieldType: "textarea",
    label: "Description",
    required: true,
    colSpan: 1,
    placeholder: "Enter description",
  },

  // Item Class - API driven
  {
    fieldName: "itemClassCode",
    fieldType: "api-select",
    label: "Item Class",
    required: true,
    colSpan: 1,
    placeholder: "Search item class",
    apiFunctionName: "getItemClasses",
    customComponent: "ItemTreeSelect",
  },

  // Packaging Unit - API driven
  {
    fieldName: "packagingUnitCode",
    fieldType: "api-select",
    label: "Packaging Unit",
    required: true,
    colSpan: 1,
    placeholder: "Search packaging unit",
    apiFunctionName: "getPackagingUnits",
    customComponent: "ItemGenericSelect",
  },

  // Country Code - API driven
  {
    fieldName: "originNationCode",
    fieldType: "api-select",
    label: "Country Code",
    required: true,
    colSpan: 1,
    placeholder: "Search country",
    apiFunctionName: "getCountries",
    customComponent: "ItemGenericSelect",
  },

  // Unit of Measure - API driven
  {
    fieldName: "unitOfMeasureCd",
    fieldType: "api-select",
    label: "Unit of Measurement",
    required: true,
    colSpan: 1,
    placeholder: "Search unit of measure",
    apiFunctionName: "getUOMs",
    customComponent: "ItemGenericSelect",
  },

  // Service Charge
  {
    fieldName: "svcCharge",
    fieldType: "static-select",
    label: "Service Charge",
    required: true,
    colSpan: 1,
    placeholder: "Select",
    options: [
      { value: "Y", label: "Yes" },
      { value: "N", label: "No" },
    ],
  },

  // Insurance
  {
    fieldName: "ins",
    fieldType: "static-select",
    label: "Insurance",
    required: true,
    colSpan: 1,
    placeholder: "Select",
    options: [
      { value: "Y", label: "Yes" },
      { value: "N", label: "No" },
    ],
  },

  // SKU
  {
    fieldName: "sku",
    fieldType: "text-input",
    label: "SKU",
    required: true,
    colSpan: 1,
    placeholder: "Enter SKU",
  },
];
