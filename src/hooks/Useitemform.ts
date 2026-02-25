import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { showApiError, showLoading, closeSwal } from "../utils/alert";
import { updateItemByItemCode, createItem } from "../api/itemApi";
import { getItemGroupById } from "../api/itemCategoryApi";
import { getRolaPackagingUnitCodes } from "../api/lookupApi";
import { useCompanySelection } from "../hooks/useCompanySelection";
import { getItemFieldConfigs } from "../config/companyConfigResolver";
import {
  getTaxConfigs,
  isTaxAutoPopulated,
} from "../taxconfig/taxConfigResolver";
import { API } from "../config/api";

// ---------------------------------------------------------------------------
// Default empty form state — all fields initialised to safe defaults.
// Boolean flags use `false`; strings use `""` to avoid uncontrolled-input
// warnings in React.
// ---------------------------------------------------------------------------
export const emptyForm: Record<string, any> = {
  id: "",
  itemName: "",
  itemGroup: "",
  itemClassCode: "",
  itemTypeCode: "",
  originNationCode: "",
  packagingUnitCode: "",
  svcCharge: "",
  ins: "",
  sellingPrice: "",
  buyingPrice: "",
  unitOfMeasureCd: "",
  description: "",
  sku: "",
  taxPreference: "",
  preferredVendor: "",
  salesAccount: "",
  purchaseAccount: "",
  taxCategory: "",
  taxType: "",
  taxCode: "",
  taxName: "",
  taxDescription: "",
  taxPerct: "",
  // countryCode is sent inside taxInfo — stored flat in form state
  countryCode: "",
  dimensionUnit: "",
  weight: "",
  valuationMethod: "",
  trackingMethod: "",
  reorderLevel: "",
  expiryDate: "",
  manufacturingDate: "",
  shelfLifeInDays: "",
  endOfLife: "",
  minStockLevel: "",
  maxStockLevel: "",
  brand: "",
  weightUnit: "",
  dimensionLength: "",
  dimensionWidth: "",
  dimensionHeight: "",
  trackInventory: false,
  // Batch tracking flags
  has_batch_no: false,
  batchNo: "",
  create_new_batch: false,
  has_expiry_date: false,
};

// ---------------------------------------------------------------------------
// buildPayload — transforms flat form state into the nested API request shape.
//
// Structure mirrors exactly what the backend expects:
//   - vendorInfo, taxInfo, inventoryInfo are always present
//   - taxInfo includes countryCode
//   - batchInfo is included for non-service items (itemTypeCode !== 3)
//   - batchNo / expiryDate / manufacturingDate are always sent as strings;
//     the backend treats "" as "not set" — never send null here
// ---------------------------------------------------------------------------
const buildPayload = (form: Record<string, any>) => ({
  itemName: form.itemName,
  itemGroup: form.itemGroup,
  itemClassCode: form.itemClassCode,
  itemTypeCode: Number(form.itemTypeCode),
  originNationCode: form.originNationCode,
  packagingUnitCode: form.packagingUnitCode,
  svcCharge: form.svcCharge,
  ins: form.ins,
  sellingPrice: Number(form.sellingPrice),
  buyingPrice: Number(form.buyingPrice),
  unitOfMeasureCd: form.unitOfMeasureCd,
  description: form.description,
  sku: form.sku,
  weight: form.weight,
  weightUnit: form.weightUnit,
  dimensionLength: form.dimensionLength,
  dimensionWidth: form.dimensionWidth,
  dimensionHeight: form.dimensionHeight,
  brand: form.brand,

  vendorInfo: {
    preferredVendor: form.preferredVendor,
    salesAccount: form.salesAccount,
    purchaseAccount: form.purchaseAccount,
  },

  taxInfo: {
    taxCategory: form.taxCategory,
    taxPreference: form.taxPreference,
    taxType: form.taxType,
    taxCode: form.taxCode,
    taxName: form.taxName,
    taxDescription: form.taxDescription,
    taxPerct: form.taxPerct,
    // Backend requires countryCode inside taxInfo.
    // Falls back to originNationCode if countryCode is not separately stored.
    countryCode: form.countryCode || form.originNationCode || "",
  },

  inventoryInfo: {
    valuationMethod: form.valuationMethod,
    trackingMethod: form.trackingMethod,
    reorderLevel: form.reorderLevel,
    minStockLevel: form.minStockLevel,
    maxStockLevel: form.maxStockLevel,
  },

  // batchInfo is only relevant for physical/inventory items (type 1 & 2).
  // Conditionally spread so the key is absent for service items (type 3).
  ...(Number(form.itemTypeCode) !== 3 && {
    batchInfo: {
      has_batch_no: form.has_batch_no,
      create_new_batch: false,
      // Always send as string — backend treats "" as "not provided".
      // Do NOT send null; it causes backend validation errors.
      batchNo: form.has_batch_no ? form.batchNo : "",
      has_expiry_date: form.has_expiry_date,
      // Always send date fields as strings regardless of the flag.
      // Backend ignores their values when has_expiry_date is false.
      expiryDate: form.has_expiry_date ? form.expiryDate : "",
      manufacturingDate: form.has_expiry_date ? form.manufacturingDate : "",
      shelfLifeInDays: Number(form.shelfLifeInDays) || 52,
      endOfLife: form.endOfLife || "",
    },
  }),
});

interface UseItemFormProps {
  isOpen: boolean;
  isEditMode: boolean;
  initialData?: Record<string, any> | null;
  onSubmit?: (res: any) => void;
  onClose: () => void;
}

export const useItemForm = ({
  isOpen,
  isEditMode,
  initialData,
  onSubmit,
  onClose,
}: UseItemFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "taxDetails" | "inventoryDetails"
  >("details");
  const [packagingOptions, setPackagingOptions] = useState<any[]>([]);
  const [loadingPackaging, setLoadingPackaging] = useState(false);
  const [itemClassOptions, setItemClassOptions] = useState<
    Array<{ cd: string; cdNm: string; lvl: string }>
  >([]);
  const [loadingItemClasses, setLoadingItemClasses] = useState(false);
  const [selectedLevel1, setSelectedLevel1] = useState("");
  const [selectedLevel2, setSelectedLevel2] = useState("");
  const [selectedLevel3, setSelectedLevel3] = useState("");
  const [selectedLevel4, setSelectedLevel4] = useState("");

  const { companyCode } = useCompanySelection();
  const fieldConfigs = getItemFieldConfigs(companyCode);
  const taxConfigs = getTaxConfigs(companyCode);
  const autoPopulateTax = isTaxAutoPopulated(companyCode);

  // Derived flags used by the UI to conditionally show/hide sections.
  const isServiceItem = Number(form.itemTypeCode) === 3;
  const showBatchExpiry =
    Number(form.itemTypeCode) === 1 || Number(form.itemTypeCode) === 2;

  // ---------------------------------------------------------------------------
  // Data fetchers
  // ---------------------------------------------------------------------------

  const fetchItemClassList = useCallback(async () => {
    try {
      setLoadingItemClasses(true);
      const response = await fetch(API.lookup.getItemClasses);
      const data = await response.json();
      const mapped = data.map((item: any) => ({
        cd: item.itemClsCd || item.cd || "",
        cdNm: item.itemClsNm || item.cdNm || "",
        lvl: item.itemClsLvl || item.lvl || "1",
      }));
      setItemClassOptions(mapped || []);
    } catch (err) {
      console.error("Failed to fetch item class list:", err);
      setItemClassOptions([]);
    } finally {
      setLoadingItemClasses(false);
    }
  }, []);

  const fetchPackagingUnits = useCallback(async () => {
    try {
      setLoadingPackaging(true);
      const data = await getRolaPackagingUnitCodes();
      setPackagingOptions(data);
    } catch (err) {
      console.error("Failed to fetch packaging units:", err);
      setPackagingOptions([]);
    } finally {
      setLoadingPackaging(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Initialise / reset form whenever the modal opens.
  //
  // For edit mode the API response is nested (taxInfo, vendorInfo, inventoryInfo,
  // batchInfo). We flatten all nested objects into the single flat `form` state
  // so every input can bind directly to `form.<fieldName>`.
  //
  // Key rules:
  //   - Use `??` (nullish coalescing) for booleans and values that may
  //     legitimately be `false` or `0` — `||` would incorrectly replace them.
  //   - Use `??` for string fields too so empty strings from the API are
  //     preserved and not replaced by a fallback.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && initialData) {
      const flatData: Record<string, any> = {
        // Spread emptyForm first to guarantee all keys exist, then override
        // with top-level fields from the API response.
        ...emptyForm,
        ...initialData,

        // taxInfo → flat
        taxCategory:
          initialData.taxInfo?.taxCategory ?? initialData.taxCategory ?? "",
        taxPreference:
          initialData.taxInfo?.taxPreference ?? initialData.taxPreference ?? "",
        taxType: initialData.taxInfo?.taxType ?? initialData.taxType ?? "",
        taxCode: initialData.taxInfo?.taxCode ?? initialData.taxCode ?? "",
        taxName: initialData.taxInfo?.taxName ?? initialData.taxName ?? "",
        taxDescription:
          initialData.taxInfo?.taxDescription ??
          initialData.taxDescription ??
          "",
        taxPerct: initialData.taxInfo?.taxPerct ?? initialData.taxPerct ?? "",
        // countryCode lives inside taxInfo in the API response
        countryCode:
          initialData.taxInfo?.countryCode ?? initialData.countryCode ?? "",

        // vendorInfo → flat
        preferredVendor:
          initialData.vendorInfo?.preferredVendor ??
          initialData.preferredVendor ??
          "",
        salesAccount:
          initialData.vendorInfo?.salesAccount ??
          initialData.salesAccount ??
          "",
        purchaseAccount:
          initialData.vendorInfo?.purchaseAccount ??
          initialData.purchaseAccount ??
          "",

        // inventoryInfo → flat
        valuationMethod:
          initialData.inventoryInfo?.valuationMethod ??
          initialData.valuationMethod ??
          "",
        trackingMethod:
          initialData.inventoryInfo?.trackingMethod ??
          initialData.trackingMethod ??
          "",
        reorderLevel:
          initialData.inventoryInfo?.reorderLevel ??
          initialData.reorderLevel ??
          "",
        minStockLevel:
          initialData.inventoryInfo?.minStockLevel ??
          initialData.minStockLevel ??
          "",
        maxStockLevel:
          initialData.inventoryInfo?.maxStockLevel ??
          initialData.maxStockLevel ??
          "",

        // batchInfo → flat
        // All fields use `??` so `false` booleans and `""` strings from the
        // API are preserved and not replaced by the fallback defaults.
        has_batch_no:
          initialData.batchInfo?.has_batch_no ??
          initialData.has_batch_no ??
          false,
        create_new_batch:
          initialData.batchInfo?.create_new_batch ??
          initialData.create_new_batch ??
          false,
        has_expiry_date:
          initialData.batchInfo?.has_expiry_date ??
          initialData.has_expiry_date ??
          false,
        batchNo:
          initialData.batchInfo?.batchNo ?? initialData.batchNo ?? "",
        expiryDate:
          initialData.batchInfo?.expiryDate ?? initialData.expiryDate ?? "",
        manufacturingDate:
          initialData.batchInfo?.manufacturingDate ??
          initialData.manufacturingDate ??
          "",
        shelfLifeInDays:
          initialData.batchInfo?.shelfLifeInDays ??
          initialData.shelfLifeInDays ??
          "",
        endOfLife:
          initialData.batchInfo?.endOfLife ?? initialData.endOfLife ?? "",
      };
      setForm(flatData);
    } else {
      setForm(emptyForm);
    }

    setActiveTab("details");

    // Reset HSN level selectors only when opening in create mode.
    if (!isEditMode) {
      setSelectedLevel1("");
      setSelectedLevel2("");
      setSelectedLevel3("");
      setSelectedLevel4("");
    }

    void fetchItemClassList();
    void fetchPackagingUnits();
  }, [isOpen, isEditMode, initialData]);

  // ---------------------------------------------------------------------------
  // Pre-select HSN code level dropdowns when editing an existing item.
  // Runs after itemClassOptions are loaded so the options exist before we set
  // the selected values.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (
      !isEditMode ||
      !initialData?.itemClassCode ||
      itemClassOptions.length === 0
    )
      return;

    const code = String(initialData.itemClassCode);
    const codeExists = (c: string) =>
      itemClassOptions.some((opt) => opt.cd === c);

    if (code.length >= 2 && codeExists(code.substring(0, 2)))
      setSelectedLevel1(code.substring(0, 2));
    if (code.length >= 4 && codeExists(code.substring(0, 4)))
      setSelectedLevel2(code.substring(0, 4));
    if (code.length >= 6 && codeExists(code.substring(0, 6)))
      setSelectedLevel3(code.substring(0, 6));
    if (code.length >= 8 && codeExists(code.substring(0, 8)))
      setSelectedLevel4(code.substring(0, 8));
  }, [isEditMode, initialData, itemClassOptions]);

  // ---------------------------------------------------------------------------
  // HSN code hierarchical level helpers
  // ---------------------------------------------------------------------------

  const getCodesByLevel = (level: string, parentCode?: string) => {
    return itemClassOptions.filter((option) => {
      if (option.lvl !== level) return false;
      if (level === "1") return true;
      if (!parentCode) return false;
      const prefixLength = parseInt(level) * 2;
      return (
        option.cd.substring(0, prefixLength - 2) ===
        parentCode.substring(0, prefixLength - 2)
      );
    });
  };

  const handleLevelChange = (level: number, value: string) => {
    // Reset all child levels when a parent level changes.
    if (level === 1) {
      setSelectedLevel1(value);
      setSelectedLevel2("");
      setSelectedLevel3("");
      setSelectedLevel4("");
    } else if (level === 2) {
      setSelectedLevel2(value);
      setSelectedLevel3("");
      setSelectedLevel4("");
    } else if (level === 3) {
      setSelectedLevel3(value);
      setSelectedLevel4("");
    } else {
      setSelectedLevel4(value);
    }

    // The deepest selected level becomes the committed itemClassCode.
    const finalCode =
      level === 4
        ? value || selectedLevel3 || selectedLevel2 || selectedLevel1
        : level === 3
          ? value || selectedLevel2 || selectedLevel1
          : level === 2
            ? value || selectedLevel1
            : value;

    setForm((prev) => ({ ...prev, itemClassCode: finalCode }));
  };

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const validateItemDetails = (): boolean => {
    if (!form.itemClassCode || String(form.itemClassCode).trim() === "") {
      toast.error("Item Class Code is required.");
      return false;
    }

    const requiredFields = [
      { field: "itemTypeCode", label: "Item Type" },
      { field: "itemGroup", label: "Item Category" },
      { field: "itemName", label: "Items Name" },
      { field: "description", label: "Description" },
      { field: "packagingUnitCode", label: "Packaging Unit" },
      { field: "originNationCode", label: "Country Code" },
      { field: "unitOfMeasureCd", label: "Unit of Measurement" },
      { field: "svcCharge", label: "Service Charge" },
      { field: "ins", label: "Insurance" },
      { field: "sku", label: "SKU" },
      { field: "sellingPrice", label: "Selling Price", isNumeric: true },
      { field: "salesAccount", label: "Sales Account" },
      { field: "buyingPrice", label: "Buying Price", isNumeric: true },
      { field: "purchaseAccount", label: "Purchase Account" },
      { field: "taxPreference", label: "Tax Preference" },
      { field: "preferredVendor", label: "Preferred Vendor" },
    ];

    for (const { field, label, isNumeric } of requiredFields) {
      const val = form[field];
      const isEmpty = isNumeric
        ? val === "" || val === null || val === undefined
        : !val || String(val).trim() === "";
      if (isEmpty) {
        toast.error(`${label} is required. Please fill in all required fields.`);
        return false;
      }
    }

    return true;
  };

  const validateTaxDetails = (): boolean => {
    if (!form.taxCategory || String(form.taxCategory).trim() === "") {
      toast.error("Please select a Tax Category.");
      return false;
    }
    return true;
  };

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  const handleForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Tax category change has special handling: when auto-populate is enabled,
    // selecting a category fills all related tax fields from the config.
    if (name === "taxCategory") {
      if (!autoPopulateTax) {
        setForm((prev) => ({ ...prev, taxCategory: value }));
        return;
      }

      const taxConfig = taxConfigs[value];
      if (!taxConfig) {
        // Unknown category — clear all tax fields to avoid stale data.
        setForm((prev) => ({
          ...prev,
          taxCategory: "",
          taxType: "",
          taxPerct: "",
          taxCode: "",
          taxDescription: "",
          taxName: "",
        }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        taxCategory: value,
        taxType: taxConfig.taxType,
        taxPerct: taxConfig.taxPerct,
        taxCode: taxConfig.taxCode,
        taxDescription: taxConfig.taxDescription,
        taxName: value,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicFieldChange = (name: string, value: any) => {
    if (name === "itemTypeCode") {
      // Changing item type invalidates the previously selected item group.
      setForm((prev) => ({ ...prev, [name]: value, itemGroup: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const loadItemCategoryDetailsById = async (id: string) => {
    try {
      const response = await getItemGroupById(id);
      if (!response || response.status_code !== 200) return;
      setForm((p) => ({ ...p, item_group: response.data.name }));
    } catch {
      showApiError("Error loading item category details");
    }
  };

  const handleCategoryChange = async (data: { name: string; id: string }) => {
    setForm((prev) => ({ ...prev, itemGroup: data.name }));
    await loadItemCategoryDetailsById(data.id);
  };

  // ---------------------------------------------------------------------------
  // Form lifecycle
  // ---------------------------------------------------------------------------

  const reset = () => {
    setForm(emptyForm);
    setSelectedLevel1("");
    setSelectedLevel2("");
    setSelectedLevel3("");
    setSelectedLevel4("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1 — validate item details and advance to tax details.
    if (activeTab === "details") {
      if (validateItemDetails()) {
        toast.success("Item details validated. Please complete Tax Details.");
        setActiveTab("taxDetails");
      }
      return;
    }

    // Step 2 — validate tax details.
    // For non-service items, advance to inventory/batch tab before submitting
    // so the user can fill in batch, expiry, and stock level fields.
    // Service items (type 3) have no inventory tab — submit directly.
    if (activeTab === "taxDetails") {
      if (!validateTaxDetails()) return;
      if (!isServiceItem) {
        toast.success("Tax details validated. Please complete Inventory Details.");
        setActiveTab("inventoryDetails");
        return;
      }
      // Service item — fall through to submit below.
    }

    // Step 3 — final submission (inventoryDetails for physical items, taxDetails for service items).
    try {
      setLoading(true);
      showLoading(isEditMode ? "Updating Item..." : "Creating Item...");

      const payload = buildPayload(form);

      const response =
        isEditMode && initialData?.id
          ? await updateItemByItemCode(initialData.id, payload)
          : await createItem(payload);

      closeSwal();

      if (!response || ![200, 201].includes(response.status_code)) {
        showApiError(response);
        return;
      }

      onSubmit?.(response);
      handleClose();
    } catch (err: any) {
      closeSwal();
      console.error("Item save failed:", err);
      showApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    autoPopulateTax,
    loading,
    activeTab,
    setActiveTab,
    isServiceItem,
    showBatchExpiry,
    fieldConfigs,
    taxConfigs,
    packagingOptions,
    loadingPackaging,
    itemClassOptions,
    loadingItemClasses,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    selectedLevel4,
    handleForm,
    handleDynamicFieldChange,
    handleCategoryChange,
    handleLevelChange,
    getCodesByLevel,
    reset,
    handleClose,
    handleSubmit,
  };
};