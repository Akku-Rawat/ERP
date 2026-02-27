import type { FieldConfig } from "../types/fieldConfig.types";

/**
 * ZRA item field configuration.
 *
 * All lookup data (item classes, packaging units, countries, UOMs) is
 * fetched from the ZRA API via the customComponent resolver.
 */
export const ZRA_ITEM_FIELDS: FieldConfig[] = [
  // ── Core classification ────────────────────────────────────────────────────

  {
    fieldName: "itemTypeCode",
    fieldType: "static-select",
    label: "Item Type",
    required: true,
    colSpan: 1,
    options: [
      { value: "1", label: "Raw Material" },
      { value: "2", label: "Finished Product" },
      { value: "3", label: "Service" },
    ],
  },

  {
    fieldName: "itemGroup",
    fieldType: "api-select",
    label: "Item Category",
    required: true,
    colSpan: 1,
    apiFunctionName: "ItemCategorySelect",
    customComponent: "ItemCategorySelect",
  },

  {
    fieldName: "itemName",
    fieldType: "text-input",
    label: "Item Name",
    required: true,
    colSpan: 1,
  },

  {
    fieldName: "description",
    fieldType: "textarea",
    label: "Description",
    required: true,
    colSpan: 1,
  },

  // ── Classification codes ───────────────────────────────────────────────────

  {
    fieldName: "itemClassCode",
    fieldType: "api-select",
    label: "Item Class",
    required: true,
    colSpan: 1,
    apiFunctionName: "getItemClasses",
    customComponent: "ItemTreeSelect",
  },

  {
    fieldName: "packagingUnitCode",
    fieldType: "api-select",
    label: "Packaging Unit",
    required: true,
    colSpan: 1,
    apiFunctionName: "getPackagingUnits",
    customComponent: "ItemGenericSelect",
  },

  // ── Origin & measurement ───────────────────────────────────────────────────

  {
    fieldName: "originNationCode",
    fieldType: "api-select",
    label: "Country of Origin",
    required: true,
    colSpan: 1,
    apiFunctionName: "getCountries",
    customComponent: "ItemGenericSelect",
  },

  {
    fieldName: "unitOfMeasureCd",
    fieldType: "api-select",
    label: "Unit of Measurement",
    required: true,
    colSpan: 1,
    apiFunctionName: "getUOMs",
    customComponent: "ItemGenericSelect",
  },

  // ── Charges & identifiers ──────────────────────────────────────────────────

  {
    fieldName: "svcCharge",
    fieldType: "static-select",
    label: "Service Charge",
    required: true,
    colSpan: 1,
    options: [
      { value: "Y", label: "Yes" },
      { value: "N", label: "No" },
    ],
  },

  {
    fieldName: "ins",
    fieldType: "static-select",
    label: "Insurance",
    required: true,
    colSpan: 1,
    options: [
      { value: "Y", label: "Yes" },
      { value: "N", label: "No" },
    ],
  },

  {
    fieldName: "sku",
    fieldType: "text-input",
    label: "SKU",
    required: true,
    colSpan: 1,
  },
];