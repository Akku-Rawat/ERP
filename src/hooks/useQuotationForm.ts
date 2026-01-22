import { useState, useEffect, useMemo, useRef } from "react";
import { getCustomerByCustomerCode } from "../api/customerApi";
import { getCompanyById } from "../api/companySetupApi";
import type { TermSection } from "../types/termsAndCondition";
import type { Invoice, InvoiceItem } from "../types/invoice";
import { getCountryList } from "../api/lookupApi";
import { getItemByItemCode } from "../api/itemApi";
const COMPANY_ID= import.meta.env.VITE_COMPANY_ID;

import {
  DEFAULT_INVOICE_FORM,
  EMPTY_ITEM,
} from "../constants/invoice.constants";

const ITEMS_PER_PAGE = 5;

type NestedSection =
  | "billingAddress"
  | "shippingAddress"
  | "paymentInformation";

export const useQuotationForm = (
  isOpen: boolean,
  onClose: () => void,
  onSubmit?: (data: any) => void
) => {
  const [formData, setFormData] = useState<Invoice>({
    ...DEFAULT_INVOICE_FORM,
    invoiceStatus: "Draft",
    invoiceType: "Non-Export",
  });

  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [customerNameDisplay, setCustomerNameDisplay] = useState("");
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details"
  );
  const [taxCategory, setTaxCategory] = useState<string | undefined>("");
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const shippingEditedRef = useRef(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      dateOfInvoice: prev.dateOfInvoice || today,
      validUntil: "",

      invoiceStatus: "Draft",
      invoiceType: "Non-Export",
    }));

    setPage(0);
  }, [isOpen]);

  // Sync shipping address with billing if sameAsBilling is true
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
    section?: NestedSection
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
    countryName?: string
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
      console.log("Submitting customerId:", id);

      if (!customerRes || customerRes.status_code !== 200) return;

      const data = customerRes.data;
      console.log("RAW billingCountry:", data.billingCountry);
      console.log("RAW shippingCountry:", data.shippingCountry);

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

      console.log("countryLookupResponse: ", countryLookupList);

      console.log("FULL country API response:", countryLookupRes);

      const countryCode = getCountryCode(
        countryLookupList,
        data.shippingCountry || data.billingCountry
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
        paymentTerms: company?.terms?.selling?.payment?.dueDates ?? "",
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
        console.log("invoiceType: ", invoiceType);
        console.log("taxCategory: ", taxCategory);
        console.log("countryCode: ", countryCode);

        return {
          ...prev,
          destnCountryCd: invoiceType === "Export" ? countryCode : "",
          invoiceType,
          billingAddress: billing,
          shippingAddress: shipping,
          paymentInformation,
          terms: { selling: data.terms?.selling },
        };
      });
    } catch (err) {
      console.error("Failed to load customer data", err);
    }
  };

  const handleItemSelect = async (index: number, itemId: string) => {
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
          vatCode:
            formData.invoiceType === "Export" ? "C1" : (data.taxCode ?? ""),
        };

        return { ...prev, items };
      });
    } catch (err) {
      console.error("Failed to fetch item details", err);
    }
  };

  const handleItemChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
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

  const setTerms = (selling: TermSection) => {
    setFormData((prev) => ({ ...prev, terms: { selling } }));
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (!checked) shippingEditedRef.current = false;
  };

  const handleReset = () => {
    setFormData({
      ...DEFAULT_INVOICE_FORM,
      invoiceStatus: "Draft",
      invoiceType: "Non-Export",
      shippingAddress: { ...DEFAULT_INVOICE_FORM.billingAddress },
    });
    setSameAsBilling(true);
    shippingEditedRef.current = false;
    setPage(0);
    setCustomerNameDisplay("");
    setCustomerDetails(null);
  };

  const { subTotal, totalTax, grandTotal } = useMemo(() => {
    const sub = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price - item.discount;
      return sum + itemTotal;
    }, 0);

    const tax = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.price - item.discount;
      const taxAmount = (itemSubtotal * parseFloat(item.vatRate || "0")) / 100;
      return sum + taxAmount;
    }, 0);

    return {
      subTotal: sub,
      totalTax: tax,
      grandTotal: sub + tax,
    };
  }, [formData.items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.customerId) {
      alert("Please select a customer");
      return;
    }

    if (!formData.dateOfInvoice) {
      alert("Please select quotation date");
      return;
    }

    if (!formData.dueDate) {
      alert("Please select valid until date");
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].itemCode) {
      alert("Please add at least one item");
      return;
    }

    // Map to backend format for quotation
    const payload = {
      customerId: formData.customerId,
      currencyCode: formData.currencyCode,
      exchangeRt: "1",
      dateOfQuotation: formData.dateOfInvoice,
      validUntil: formData.dueDate,
      industryBases: formData.industryBases || "Service",
      invoiceType: formData.invoiceType, //
      invoiceStatus: formData.invoiceStatus,

      // Only include if export quotation
      ...(formData.invoiceType === "Export" && {
        destnCountryCd: formData.destnCountryCd,
      }),

      // Only include if LPO
      ...(formData.invoiceType === "Lpo" && {
        lpoNumber: formData.lpoNumber,
      }),

      billingAddress: formData.billingAddress,
      shippingAddress: formData.shippingAddress,
      paymentInformation: formData.paymentInformation,

      items: formData.items
        .filter((item) => item.itemCode) // Only include items with itemCode
        .map((item) => ({
          itemCode: item.itemCode,
          quantity: item.quantity,
          description: item.description,
          discount: item.discount,
          vatRate: item.vatRate.toString(),
          price: item.price,
          vatCode: item.vatCode,
        })),

      terms: formData.terms,

      // Additional fields for tracking
      subTotal,
      totalTax,
      grandTotal,
      documentType: "quotation",
    };

    // Call the onSubmit callback
    if (onSubmit) {
      try {
        await onSubmit(payload);
      } catch (error) {}
    } else {
      alert(
        "No onSubmit handler provided. Please check your QuotationModal usage."
      );
    }
  };

  const paginatedItems = formData.items.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
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
      isLocal: formData.invoiceType === "LPO",
      isNonExport: formData.invoiceType === "Non-Export",
      isQuotation: true,
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
    },
  };
};
