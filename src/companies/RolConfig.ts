import type { FieldConfig } from "../types/fieldConfig.types";

/**
 * ROLA (COMP-00004) item field configuration.
 *
 * Packaging unit is intentionally omitted — the packing information
 * (pakingunit / packingsize) is handled separately in buildPayload and
 * does not require a UI dropdown for this company.
 */
export const COMP_00004_ITEM_FIELDS: FieldConfig[] = [
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
    required: false,
    colSpan: 1,
  },

  // ── Classification codes ───────────────────────────────────────────────────

  {
    fieldName: "itemClassCode",
    fieldType: "text-input",
    label: "HSN Code",
    required: true,
    colSpan: 1,
    placeholder: "Enter HSN / item class code",
  },

  // ── Origin & measurement ───────────────────────────────────────────────────

  {
    fieldName: "originNationCode",
    fieldType: "api-select",
    label: "Country",
    required: true,
    colSpan: 1,
    apiFunctionName: "getRolaCountries",
    customComponent: "ItemGenericSelect",
    displayField: "name" 
  },

  {
    fieldName: "unitOfMeasureCd",
    fieldType: "api-select",
    label: "UOM",
    required: true,
    colSpan: 1,
    apiFunctionName: "getRolaUOMs",
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