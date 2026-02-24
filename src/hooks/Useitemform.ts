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
  dimensionUnit: "",
  weight: "",
  valuationMethod: "",
  trackingMethod: "",
  reorderLevel: "",
  batchNumber: "",
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
  // ── Batch boolean flags ──
  has_batch_no: false,
  create_new_batch: false,
  has_expiry_date: false,
};

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
  },

  inventoryInfo: {
    valuationMethod: form.valuationMethod,
    trackingMethod: form.trackingMethod,
    reorderLevel: form.reorderLevel,
    minStockLevel: form.minStockLevel,
    maxStockLevel: form.maxStockLevel,
  },

  // batchInfo only for non-service items (itemTypeCode !== 3)
  ...(Number(form.itemTypeCode) !== 3 && {
    batchInfo: {
      has_batch_no: form.has_batch_no,
      create_new_batch: form.create_new_batch,
      batchNo: form.has_batch_no ? form.batchNumber : "",
      has_expiry_date: form.has_expiry_date,
      expiryDate: form.has_expiry_date ? form.expiryDate : "",
      manufacturingDate: form.has_expiry_date ? form.manufacturingDate : "",
      shelfLifeInDays: Number(form.shelfLifeInDays) || 0,
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

  const isServiceItem = Number(form.itemTypeCode) === 3;
  const showBatchExpiry =
    Number(form.itemTypeCode) === 1 || Number(form.itemTypeCode) === 2;

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
      console.error(err);
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
      console.error("Packaging API error:", err);
      setPackagingOptions([]);
    } finally {
      setLoadingPackaging(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // ── OLD: Direct set — nested API fields (taxInfo, vendorInfo etc.) form mein nahi aate the ──
    // setForm(isEditMode && initialData ? initialData : emptyForm);

    // ── NEW: Flatten nested API response into flat form shape ──
    if (isEditMode && initialData) {
      const flatData: Record<string, any> = {
        // All top-level flat fields from API (itemName, brand, weight, sku etc.)
        ...emptyForm,
        ...initialData,

        // taxInfo nested → flat
        // Backend GET returns these flat already if no taxInfo key exists, so fallback handles both cases
        taxCategory:    initialData.taxInfo?.taxCategory    || initialData.taxCategory    || "",
        taxPreference:  initialData.taxInfo?.taxPreference  || initialData.taxPreference  || "",
        taxType:        initialData.taxInfo?.taxType        || initialData.taxType        || "",
        taxCode:        initialData.taxInfo?.taxCode        || initialData.taxCode        || "",
        taxName:        initialData.taxInfo?.taxName        || initialData.taxName        || "",
        taxDescription: initialData.taxInfo?.taxDescription || initialData.taxDescription || "",
        taxPerct:       initialData.taxInfo?.taxPerct       || initialData.taxPerct       || "",

        // vendorInfo nested → flat
        preferredVendor: initialData.vendorInfo?.preferredVendor || initialData.preferredVendor || "",
        salesAccount:    initialData.vendorInfo?.salesAccount    || initialData.salesAccount    || "",
        purchaseAccount: initialData.vendorInfo?.purchaseAccount || initialData.purchaseAccount || "",

        // inventoryInfo nested → flat
        valuationMethod: initialData.inventoryInfo?.valuationMethod || initialData.valuationMethod || "",
        trackingMethod:  initialData.inventoryInfo?.trackingMethod  || initialData.trackingMethod  || "",
        reorderLevel:    initialData.inventoryInfo?.reorderLevel    || initialData.reorderLevel    || "",
        minStockLevel:   initialData.inventoryInfo?.minStockLevel   || initialData.minStockLevel   || "",
        maxStockLevel:   initialData.inventoryInfo?.maxStockLevel   || initialData.maxStockLevel   || "",

        // batchInfo nested → flat
        // Using ?? instead of || to correctly preserve false boolean values
        has_batch_no:     initialData.batchInfo?.has_batch_no     ?? initialData.has_batch_no     ?? false,
        create_new_batch: initialData.batchInfo?.create_new_batch ?? initialData.create_new_batch ?? false,
        has_expiry_date:  initialData.batchInfo?.has_expiry_date  ?? initialData.has_expiry_date  ?? false,
        batchNumber:      initialData.batchInfo?.batchNo          || initialData.batchNumber      || "",
        expiryDate:       initialData.batchInfo?.expiryDate       || initialData.expiryDate       || "",
       manufacturingDate:  initialData.batchInfo?.manufacturingDate ?? initialData.manufacturingDate ??  "",
      };
      setForm(flatData);
    } else {
      setForm(emptyForm);
    }

    setActiveTab("details");
    if (!isEditMode) {
      setSelectedLevel1("");
      setSelectedLevel2("");
      setSelectedLevel3("");
      setSelectedLevel4("");
    }
    void fetchItemClassList();
    void fetchPackagingUnits();
  }, [isOpen, isEditMode, initialData]);

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
      { field: "ins", label: "INSURANCE" },
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
        toast.error(
          `${label} is required. Please fill in all required fields.`,
        );
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

  const handleForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "taxCategory") {
      if (!autoPopulateTax) {
        setForm((prev) => ({ ...prev, taxCategory: value }));
        return;
      }

      const taxConfig = taxConfigs[value];
      if (!taxConfig) {
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

    if (activeTab === "details") {
      if (validateItemDetails()) {
        toast.success("Item details validated. Please complete Tax Details.");
        setActiveTab("taxDetails");
      }
      return;
    }

    if (activeTab === "taxDetails" && !validateTaxDetails()) return;

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