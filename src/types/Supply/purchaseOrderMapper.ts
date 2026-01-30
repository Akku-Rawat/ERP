import { PurchaseOrderFormData, emptyPOForm } from "./purchaseOrder";

/**
 * UI → Backend API (Create/Update)
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
 * FIXED: Properly extracts data from nested response structure
 */
export const mapApiToUI = (apiResponse: any): PurchaseOrderFormData => {
  // Extract actual data from response
  // API returns: { status_code, status, message, data: {...} }
  const api = apiResponse.data || apiResponse;

  console.log("🔍 Mapping API to UI:", api); // Debug log

  // Map items from API format to UI format
  const items = (api.items || []).map((item: any) => ({
    itemCode: item.item_code || "",
    itemName: item.item_name || "",
    requiredBy: item.requiredBy || api.requiredBy || "",
    quantity: Number(item.qty || 0),
    uom: item.uom || "Unit",
    rate: Number(item.rate || 0),
    amount: Number(item.amount || 0),
  }));

  // Map tax rows from API format to UI format
  const taxRows = (api.taxes || []).map((tax: any) => ({
    type: tax.type || "On Net Total",
    accountHead: tax.accountHead || "",
    taxRate: Number(tax.taxRate || 0),
    amount: Number(tax.taxableAmount || 0),
    taxAmount: Number(tax.taxAmount || 0),
  }));

  // Map payment terms from API payment phases
  const paymentPhases = api.terms?.terms?.selling?.payment?.phases || [];
  const paymentRows = paymentPhases.map((phase: any) => ({
    paymentTerm: phase.name || "",
    description: phase.condition || "",
    dueDate: "",
    invoicePortion: Number(phase.percentage || 0),
    paymentAmount: (api.grandTotal * Number(phase.percentage || 0)) / 100,
  }));

  // Extract addresses - API has nested structure
const addresses = {
  supplierAddress: {
    addressTitle: "Supplier Main Address",
    addressType: "Billing",
    addressLine1: api.addresses?.supplierAddress?.addressLine1 || "",
    addressLine2: api.addresses?.supplierAddress?.addressLine2 || "",
    city: api.addresses?.supplierAddress?.city || "",
    state: api.addresses?.supplierAddress?.state || "",
    country: api.addresses?.supplierAddress?.country || "",
    postalCode: api.addresses?.supplierAddress?.postalCode || "",
    phone: api.addresses?.supplierAddress?.phone || "",
    email: api.addresses?.supplierAddress?.email || "",
  },

  dispatchAddress: {
    addressTitle: "Warehouse Dispatch",
    addressType: "Shipping",
    addressLine1: api.addresses?.dispatchAddress?.addressLine1 || "",
    addressLine2: api.addresses?.dispatchAddress?.addressLine2 || "",
    city: api.addresses?.dispatchAddress?.city || "",
    state: api.addresses?.dispatchAddress?.state || "",
    country: api.addresses?.dispatchAddress?.country || "",
    postalCode: api.addresses?.dispatchAddress?.postalCode || "",
  },

  shippingAddress: {
    addressTitle: "Customer Delivery Address",
    addressType: "Shipping",
    addressLine1: api.addresses?.shippingAddress?.addressLine1 || "",
    addressLine2: api.addresses?.shippingAddress?.addressLine2 || "",
    city: api.addresses?.shippingAddress?.city || "",
    state: api.addresses?.shippingAddress?.state || "",
    country: api.addresses?.shippingAddress?.country || "",
    postalCode: api.addresses?.shippingAddress?.postalCode || "",
  },

  // ✅ ADD THIS
  companyBillingAddress: {
    addressTitle: "Company HQ Billing",
    addressType: "Billing",
    addressLine1: api.addresses?.companyBillingAddress?.addressLine1 || "",
    addressLine2: api.addresses?.companyBillingAddress?.addressLine2 || "",
    city: api.addresses?.companyBillingAddress?.city || "",
    state: api.addresses?.companyBillingAddress?.state || "",
    country: api.addresses?.companyBillingAddress?.country || "",
    postalCode: api.addresses?.companyBillingAddress?.postalCode || "",
  },
};

  // Extract terms and conditions from nested structure
  const termsAndConditions = api.terms?.terms?.selling?.general || "";

  // Calculate totals
  const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const subTotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
  const taxTotal = taxRows.reduce((sum: number, tax: any) => sum + tax.taxAmount, 0);
  const grandTotal = api.grandTotal || (subTotal + taxTotal);
  const roundedTotal = Math.round(grandTotal);
  const roundingAdjustment = Number((roundedTotal - grandTotal).toFixed(2));

  const mappedForm: PurchaseOrderFormData = {
    ...emptyPOForm,

    // Basic Info
    poNumber: api.poId || "",
    date: api.poDate || "",
    requiredBy: api.requiredBy || "",

    // Supplier Info
    supplier: api.supplierName || "",
    supplierId: api.supplierId || "",
    supplierCode: api.supplierCode || "",

    // Currency & Status
    currency: api.currency || "ZMW",
    status: api.status || "Draft",

    // Additional Fields
    costCenter: api.costCenter || "",
    project: api.project || "",
    taxCategory: api.taxCategory || "",
    shippingRule: api.shippingRule || "",
    incoterm: api.incoterm || "",
    placeOfSupply: api.placeOfSupply || "",
    taxesChargesTemplate: api.taxesChargesTemplate || "",
    paymentTermsTemplate: api.paymentTermsTemplate || "",

    // Terms
    termsAndConditions: termsAndConditions,

    // Addresses
    addresses: addresses,

    // Items
    items: items.length > 0 ? items : [{ ...emptyPOForm.items[0] }],

    // Tax Rows
    taxRows: taxRows.length > 0 ? taxRows : [{ ...emptyPOForm.taxRows[0] }],

    // Payment Rows
    paymentRows: paymentRows.length > 0 ? paymentRows : [{ ...emptyPOForm.paymentRows[0] }],

    // Totals
    totalQuantity: totalQuantity,
    grandTotal: grandTotal,
    roundingAdjustment: roundingAdjustment,
    roundedTotal: roundedTotal,

    // Email fields (keep existing if any)
    templateName: "",
    templateType: "",
    subject: "",
    messageHtml: "",
    sendAttachedFiles: false,
    sendPrint: false,
  };



  return mappedForm;
};