import { useState, useEffect, useMemo, useRef } from "react";
import { getCustomerByCustomerCode } from "../api/customerApi";
import { getCompanyById } from "../api/companySetupApi";
import type { TermSection } from "../types/termsAndCondition";
import type { Invoice, InvoiceItem } from "../types/invoice";
import { getCountryList } from "../api/lookupApi";
import { getItemByItemCode } from "../api/itemApi";

import {
  DEFAULT_INVOICE_FORM,
  EMPTY_ITEM,
  EMPTY_TERMS,
} from "../constants/invoice.constants";
type InvoiceMode = "invoice" | "proforma";

const ITEMS_PER_PAGE = 5;
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;

type NestedSection =
  | "billingAddress"
  | "shippingAddress"
  | "paymentInformation";

export const useInvoiceForm = (
  isOpen: boolean,
  onClose: () => void,
  onSubmit?: (data: any) => void,
  mode?: "invoice" | "proforma",
  initialData?: any,
) => {
  const [formData, setFormData] = useState<Invoice>({
    ...DEFAULT_INVOICE_FORM,
    terms: { ...EMPTY_TERMS },
  });

  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [customerNameDisplay, setCustomerNameDisplay] = useState("");
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details",
  );
  const [taxCategory, setTaxCategory] = useState<string | undefined>("");
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const shippingEditedRef = useRef(false);
useEffect(() => {
  if (!isOpen) return;

  const loadCompanyData = async () => {
    try {
      const companyRes = await getCompanyById(COMPANY_ID);
      const company = companyRes?.data;
      
      setFormData((prev) => ({
        ...prev,
        invoiceStatus: prev.invoiceStatus || (mode === "proforma" ? "Draft" : prev.invoiceStatus),
        invoiceType: prev.invoiceType || (mode === "proforma" ? "Non-Export" : prev.invoiceType),
        terms: {
          selling: company?.terms?.selling ?? EMPTY_TERMS.selling,
        },
        paymentInformation: {
          ...prev.paymentInformation,
          bankName: company?.bankAccounts?.[0]?.bankName ?? "",
          accountNumber: company?.bankAccounts?.[0]?.accountNo ?? "",
          routingNumber: company?.bankAccounts?.[0]?.sortCode ?? "",
          swiftCode: company?.bankAccounts?.[0]?.swiftCode ?? "",
        },
      }));
    } catch (err) {
      console.error("Failed to load company data", err);
    }
  };

  loadCompanyData();
}, [isOpen, mode]);

  const setInvoiceFromApi = (invoice: any) => {
    setFormData((prev: any) => ({
      ...prev,
      ...invoice,
      items: invoice.items,
    }));

    setCustomerDetails(invoice.customer);
  };

  const validateForm = (): boolean => {
    if (!formData.customerId) {
      throw new Error("Please select a customer");
    }

    if (!formData.dueDate) {
      throw new Error("Please select due date");
    }

    if (!formData.items.length) {
      throw new Error("Please add at least one item");
    }

    formData.items.forEach((it, idx) => {
      if (!it.itemCode) {
        throw new Error(`Item ${idx + 1}: Please select item`);
      }



if (!formData.paymentInformation?.paymentTerms) {
  throw new Error("Please select payment terms");
}

      if (!it.quantity || it.quantity <= 0) {
        throw new Error(`Item ${idx + 1}: Quantity must be greater than 0`);
      }

      if (!it.price || it.price <= 0) {
        throw new Error(`Item ${idx + 1}: Price must be greater than 0`);
      }
    });

    return true;
  };

  useEffect(() => {
    if (!sameAsBilling) return;
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.billingAddress },
    }));
  }, [formData.billingAddress, sameAsBilling]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    section?: NestedSection,
  ) => {
    const { name, value } = e.target;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as object),
          [name]: value,
        },
      }));

      if (section === "shippingAddress" && !sameAsBilling) {
        shippingEditedRef.current = true;
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getCountryCode = (
    countries: { code: string; name: string }[],
    countryName?: string,
  ): string => {
    if (!countryName || !countries.length) return "";

    const n = countryName.trim().toLowerCase();

    const byCode = countries.find((c) => c.code.toLowerCase() === n);
    if (byCode) return byCode.code;

    const byName = countries.find((c) => c.name.toLowerCase().includes(n));
    if (byName) return byName.code;

    const reverse = countries.find((c) => n.includes(c.name.toLowerCase()));
    if (reverse) return reverse.code;

    if (n === "usa" || n === "united states of america") return "US";
    if (n === "uk" || n === "united kingdom") return "GB";
    if (n === "uae") return "AE";

    return "";
  };

  const handleCustomerSelect = async ({
    name,
    id,
  }: {
    name: string;
    id: string;
  }) => {
    setCustomerNameDisplay(name);
    setFormData((p) => ({ ...p, customerId: id }));

    try {
      const [customerRes, companyRes] = await Promise.all([
        getCustomerByCustomerCode(id),
        getCompanyById(COMPANY_ID),
      ]);

      if (!customerRes || customerRes.status_code !== 200) return;

      const data = customerRes.data;

      const company = companyRes?.data;
      const invoiceType = data.customerTaxCategory as
        | "Export"
        | "Non-Export"
        | "Lpo";

      setTaxCategory(invoiceType);

      const countryLookupRes = await getCountryList();
      const countryLookupList = Array.isArray(countryLookupRes)
        ? countryLookupRes
        : (countryLookupRes?.data ?? []);

      const countryCode = getCountryCode(
        countryLookupList,
        data.shippingCountry || data.billingCountry,
      );

      setCustomerDetails(data);

      const billing = {
        line1: data.billingAddressLine1 ?? "",
        line2: data.billingAddressLine2 ?? "",
        postalCode: data.billingPostalCode ?? "",
        city: data.billingCity ?? "",
        state: data.billingState ?? "",
        country: data.billingCountry ?? "",
      };

      const shippingFromCustomer = {
        line1: data.shippingAddressLine1 ?? "",
        line2: data.shippingAddressLine2 ?? "",
        postalCode: data.shippingPostalCode ?? "",
        city: data.shippingCity ?? "",
        state: data.shippingState ?? "",
        country: data.shippingCountry ?? "",
      };

      const paymentInformation = {
        paymentTerms: "",

        paymentMethod: "01",
        bankName: company?.bankAccounts?.[0]?.bankName ?? "",
        accountNumber: company?.bankAccounts?.[0]?.accountNo ?? "",
        routingNumber: company?.bankAccounts?.[0]?.sortCode ?? "",
        swiftCode: company?.bankAccounts?.[0]?.swiftCode ?? "",
      };

      setFormData((prev) => {
        let shipping = prev.shippingAddress;

        if (sameAsBilling) {
          shipping = { ...billing };
        } else if (!shippingEditedRef.current) {
          shipping = shippingFromCustomer;
        }

        return {
          ...prev,
          destnCountryCd: invoiceType === "Export" ? countryCode : "",
          invoiceType,
          billingAddress: billing,
          shippingAddress: shipping,
          paymentInformation,
          terms: {
  selling: company?.terms?.selling ?? prev.terms?.selling ?? EMPTY_TERMS.selling,
},
        };
      });
    } catch (err) {
      console.error("Failed to load customer data", err);
    }
  };

  const handleItemSelect = async (index: number, itemId: string) => {
    const currentItem = formData.items[index];

    // Invoice-loaded item → do NOT auto override
    if (currentItem?._fromInvoice) {
      setFormData((prev) => {
        const items = [...prev.items];
        items[index] = {
          ...items[index],
          itemCode: itemId,
          _fromInvoice: false, // unlock for user edits
        };
        return { ...prev, items };
      });
      return;
    }

    try {
      const res = await getItemByItemCode(itemId);
      if (!res || res.status_code !== 200) return;

      const data = res.data;

      setFormData((prev) => {
        const items = [...prev.items];

        items[index] = {
          ...items[index],
          itemCode: data.id,
          description: data.itemDescription ?? data.itemName ?? "",
          price: data.sellingPrice ?? items[index].price,
          vatRate: data.taxPerct ?? 0,
          vatCode: prev.invoiceType === "Export" ? "C1" : (data.taxCode ?? ""),
        };

        return { ...prev, items };
      });
    } catch (err) {
      console.error("Failed to fetch item details", err);
    }
  };

  /* ---------------- ITEMS ---------------- */

  const handleItemChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const isNum = ["quantity", "price", "discount", "vatRate"].includes(name);
    setFormData((prev) => {
      const items = [...prev.items];
      items[idx] = {
        ...items[idx],
        [name]: isNum ? Number(value) : value,
      };
      return { ...prev, items };
    });
  };

  const updateItemDirectly = (index: number, updated: Partial<InvoiceItem>) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...updated };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setFormData((prev) => {
      const items = [...prev.items, { ...EMPTY_ITEM }];
      setPage(Math.floor((items.length - 1) / ITEMS_PER_PAGE));
      return { ...prev, items };
    });
  };

  const removeItem = (idx: number) => {
    setFormData((prev) => {
      if (prev.items.length === 1) return prev;
      const items = prev.items.filter((_, i) => i !== idx);
      return { ...prev, items };
    });
  };
  const setFormDataFromInvoice = async (invoice: any) => {
    setFormData((prev: any) => ({
      ...prev,
      invoiceNumber: invoice.invoiceNumber,
      invoiceType: invoice.invoiceType ?? "",
      invoiceStatus: invoice.invoiceStatus ?? "",
      currencyCode: invoice.currencyCode,
      dateOfInvoice: invoice.dateOfInvoice,
      dueDate: invoice.dueDate,
      billingAddress: invoice.billingAddress ?? prev.billingAddress,
      shippingAddress: invoice.shippingAddress ?? prev.shippingAddress,
      items: invoice.items.map((it: any) => {
        const base =
          Number(it.quantity) * Number(it.price) - Number(it.discount);
        const taxAmount = Number(it.vatTaxableAmount ?? 0);
        const taxRate =
          base > 0 ? Number(((taxAmount / base) * 100).toFixed(2)) : 0;

        return {
          itemCode: it.itemCode,
          description: it.description ?? "",
          quantity: Number(it.quantity),
          price: Number(it.price),
          discount: Number(it.discount),
          vatRate: taxRate,
          vatCode: it.vatCode ?? "",
          _fromInvoice: true,
        };
      }),
    }));

    setCustomerDetails(invoice.customer);
    setCustomerNameDisplay(invoice.customer?.name ?? "");
  };

  const setTerms = (selling: TermSection) => {
    setFormData((prev) => ({ ...prev, terms: { selling } }));
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (!checked) shippingEditedRef.current = false;
  };

const handleReset = async () => {
  try {
    const companyRes = await getCompanyById(COMPANY_ID);
    const company = companyRes?.data;
    
    setFormData({
      ...DEFAULT_INVOICE_FORM,
      terms: {
        selling: company?.terms?.selling ?? EMPTY_TERMS.selling,
      },
      shippingAddress: { ...DEFAULT_INVOICE_FORM.billingAddress },
    });
  } catch (err) {
    setFormData({
      ...DEFAULT_INVOICE_FORM,
      terms: { ...EMPTY_TERMS },
      shippingAddress: { ...DEFAULT_INVOICE_FORM.billingAddress },
    });
  }

    setCustomerDetails(null);
    setCustomerNameDisplay("");
    setTaxCategory("");

    // reset UI state
    setActiveTab("details");
    setSameAsBilling(true);
    setIsShippingOpen(false);
    setPage(0);
    shippingEditedRef.current = false;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  validateForm();

  const payload = {
    ...formData,
    subTotal,
    totalTax,
    grandTotal,
  };

  return payload;
};


  const { subTotal, totalTax, grandTotal } = useMemo(() => {
    let sub = 0;
    let tax = 0;

    formData.items.forEach((item) => {
      const base = item.quantity * item.price - item.discount;
      const taxAmt = base * (Number(item.vatRate || 0) / 100);

      sub += base;
      tax += taxAmt;
    });

    return {
      subTotal: sub,
      totalTax: tax,
      grandTotal: sub + tax,
    };
  }, [formData.items]);

  const paginatedItems = formData.items.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  );

  return {
    formData,
    customerDetails,
    customerNameDisplay,
    paginatedItems,
    totals: { subTotal, totalTax, grandTotal },
    ui: {
      page,
      setPage,
      activeTab,
      setActiveTab,
      taxCategory,
      setTaxCategory,
      isShippingOpen,
      setIsShippingOpen,
      sameAsBilling,
      itemCount: formData.items.length,
      isExport: formData.invoiceType === "Export",
      isLocal: formData.invoiceType === "Lpo",
      isNonExport: formData.invoiceType === "Non-Export",
    },
    actions: {
      handleInputChange,
      handleCustomerSelect,
      handleItemSelect,
      handleItemChange,
      updateItemDirectly,
      addItem,
      removeItem,
      setTerms,
      handleSameAsBillingChange,
      handleReset,
      handleSubmit,
      setInvoiceFromApi,
      setFormDataFromInvoice,
    },
  };
};
