import type { FieldConfig } from "../types/fieldConfig.types";


export const ZRA_ITEM_FIELDS: FieldConfig[] = [
  // Item Type - Static dropdown (same for all companies)
  {
    fieldName: 'itemTypeCode',
    fieldType: 'static-select',
    label: 'Item Type',
    required: true,
    colSpan: 1,
    options: [
      { value: '1', label: 'Raw Material' },
      { value: '2', label: 'Finished Product' },
      { value: '3', label: 'Service' },
    ],
  },

  // Item Group - API driven with custom component
  {
    fieldName: 'itemGroup',
    fieldType: 'api-select',
    label: 'Item Category',
    required: true,
    colSpan: 1,
    apiFunctionName: 'ItemCategorySelect', // Special component
    customComponent: 'ItemCategorySelect',
  },

  // Item Name
  {
    fieldName: 'itemName',
    fieldType: 'text-input',
    label: 'Items Name',
    required: true,
    colSpan: 3,
  },

  // Description
  {
    fieldName: 'description',
    fieldType: 'textarea',
    label: 'Description',
    colSpan: 3,
  },

  // Item Class - API driven
  {
    fieldName: 'itemClassCode',
    fieldType: 'api-select',
    label: 'Item Class',
    colSpan: 1,
    apiFunctionName: 'getItemClasses',
    customComponent: 'ItemTreeSelect',
  },

  // Packaging Unit - API driven
  {
    fieldName: 'packagingUnitCode',
    fieldType: 'api-select',
    label: 'Packaging Unit',
    colSpan: 1,
    apiFunctionName: 'getPackagingUnits',
    customComponent: 'ItemGenericSelect',
  },

  // Country Code - API driven
  {
    fieldName: 'originNationCode',
    fieldType: 'api-select',
    label: 'Country Code',
    colSpan: 1,
    apiFunctionName: 'getCountries',
    customComponent: 'ItemGenericSelect',
  },

  // Unit of Measure - API driven
  {
    fieldName: 'unitOfMeasureCd',
    fieldType: 'api-select',
    label: 'Unit of Measurement',
    colSpan: 1,
    apiFunctionName: 'getUOMs',
    customComponent: 'ItemGenericSelect',
  },

  // Service Charge
  {
    fieldName: 'svcCharge',
    fieldType: 'static-select',
    label: 'Service Charge',
    required: true,
    colSpan: 1,
    options: [
      { value: 'Y', label: 'Y' },
      { value: 'N', label: 'N' },
    ],
  },

  // Insurance
  {
    fieldName: 'ins',
    fieldType: 'static-select',
    label: 'INSURANCE',
    required: true,
    colSpan: 1,
    options: [
      { value: 'Y', label: 'Y' },
      { value: 'N', label: 'N' },
    ],
  },

  // SKU
  {
    fieldName: 'sku',
    fieldType: 'text-input',
    label: 'SKU',
    colSpan: 3,
  },
];