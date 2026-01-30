import { PurchaseOrderFormData , emptyPOForm} from "../../types/Supply/purchaseOrder";

/**
 * UI → Backend API
 */
export const mapUIToCreatePO = (form: PurchaseOrderFormData) => {
  const items = form.items.map(it => ({
    itemCode: it.itemCode,
    quantity: it.quantity,
  }));

  const taxes = form.taxRows.map(t => ({
    type: t.type,
    accountHead: t.accountHead,
    taxRate: t.taxRate,
    taxableAmount: t.amount,
    taxAmount: (t.amount * t.taxRate) / 100,
  }));

  const subTotal = form.items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const taxTotal = taxes.reduce((s, t) => s + t.taxAmount, 0);
  const grandTotal = subTotal + taxTotal;

  return {
    requiredBy: form.requiredBy,
    supplierId: form.supplierId,
    currency: form.currency,
    status: form.status,

    costCenter: form.costCenter,
    project: form.project,

    taxCategory: form.taxCategory,
    shippingRule: form.shippingRule,
    incoterm: form.incoterm,

    placeOfSupply: form.placeOfSupply,
    taxesChargesTemplate: form.taxesChargesTemplate,

    addresses: form.addresses,

    paymentTermsTemplate: form.paymentTermsTemplate,

    terms: {
      selling: {
        general: form.termsAndConditions || "",
        payment: {
          phases: form.paymentRows.map((p, i) => ({
            id: i + 1,
            name: p.paymentTerm,
            percentage: p.invoicePortion,
            condition: p.description,
          })),
        },
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
      remarks: "Created from UI",
    },
  };
};


/**
 * Backend API → UI Form
 */
export const mapApiToUI = (api: any): PurchaseOrderFormData => {
  return {
    ...emptyPOForm, 

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
