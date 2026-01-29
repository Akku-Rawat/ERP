import { PurchaseOrderFormData , emptyPOForm} from "../../types/Supply/purchaseOrder";

/**
 * UI → Backend API
 */
export const mapUIToCreatePO = (form: PurchaseOrderFormData) => {
  const items = form.items.map(it => {
    const amount = it.quantity * it.rate;
    return {
      itemCode: it.itemCode,
      itemName: (it as any).itemName || it.itemCode,
      requiredBy: it.requiredBy,
      quantity: it.quantity,
      uom: it.uom,
      rate: it.rate,
      amount,
    };
  });

  const taxes = form.taxRows.map(t => {
    const taxableAmount = t.amount;
    const taxAmount = (t.taxRate * taxableAmount) / 100;
    return {
      type: t.type,
      accountHead: t.accountHead,
      taxRate: t.taxRate,
      taxableAmount,
      taxAmount,
    };
  });

  const subTotal = items.reduce((s, i) => s + i.amount, 0);
  const taxTotal = taxes.reduce((s, t) => s + t.taxAmount, 0);
  const grandTotal = subTotal + taxTotal;

  return {
    poNumber: form.poNumber,
    poDate: form.date,
    requiredBy: form.requiredBy,

    supplierId: form.supplierId ?? "",
    supplierCode: form.supplierCode ?? "",
    supplierName: form.supplier || "",

    currency: form.currency,
    status: form.status,

    costCenter: form.costCenter,
    project: form.project,

    taxCategory: form.taxCategory,
    shippingRule: form.shippingRule,
    incoterm: form.incoterm,
    taxesChargesTemplate: form.taxesChargesTemplate,

    placeOfSupply: form.placeOfSupply,
    addresses: form.addresses,

    paymentTermsTemplate: form.paymentTermsTemplate,

    terms: {
      selling: {
        general: form.termsAndConditions || "",
      },
    },

    items,
    taxes,
    payments: form.paymentRows,

    summary: {
      totalQuantity: form.totalQuantity,
      subTotal,
      taxTotal,
      grandTotal,
      roundingAdjustment: form.roundingAdjustment,
      roundedTotal: form.roundedTotal,
    },

    metadata: {
      remarks: "",
    },
  };
};

/**
 * Backend API → UI Form
 */
export const mapApiToUI = (api: any): PurchaseOrderFormData => {
  return {
    ...emptyPOForm, // 🔥 fills missing UI fields automatically

    poNumber: api.poNumber ?? "",
    date: api.poDate ?? "",
    requiredBy: api.requiredBy ?? "",

    supplier: api.supplierName ?? "",
    supplierId: api.supplierId ?? "",
    supplierCode: api.supplierCode ?? "",

    currency: api.currency ?? "INR",
    status: api.status ?? "Draft",

    costCenter: api.costCenter ?? "",
    project: api.project ?? "",

    taxCategory: api.taxCategory ?? "",
    shippingRule: api.shippingRule ?? "",
    incoterm: api.incoterm ?? "",
    taxesChargesTemplate: api.taxesChargesTemplate ?? "",

    placeOfSupply: api.placeOfSupply ?? "",
    addresses: api.addresses ?? emptyPOForm.addresses,

    paymentTermsTemplate: api.paymentTermsTemplate ?? "",
    termsAndConditions: api.terms?.selling?.general ?? "",

    items: api.items?.map((it: any) => ({
      itemCode: it.itemCode,
      requiredBy: it.requiredBy,
      quantity: it.quantity,
      uom: it.uom,
      rate: it.rate,
    })) || emptyPOForm.items,

    taxRows: api.taxes?.map((t: any) => ({
      type: t.type,
      accountHead: t.accountHead,
      taxRate: t.taxRate,
      amount: t.taxableAmount,
    })) || emptyPOForm.taxRows,

    paymentRows: api.payments || emptyPOForm.paymentRows,

    totalQuantity: api.summary?.totalQuantity || 0,
    grandTotal: api.summary?.grandTotal || 0,
    roundingAdjustment: api.summary?.roundingAdjustment || 0,
    roundedTotal: api.summary?.roundedTotal || 0,
  };
};
