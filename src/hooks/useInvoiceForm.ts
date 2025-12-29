import { useState, useEffect, useMemo, useRef } from "react";
import { getCustomerByCustomerCode } from "../api/customerApi";
import { getCompanyById } from "../api/companySetupApi";
import type { TermSection } from "../types/termsAndCondition";
import type { Invoice, InvoiceItem } from "../types/invoice";
import { getCountryList } from "../api/lookupApi";

import {
  DEFAULT_INVOICE_FORM,
  EMPTY_ITEM,
} from "../constants/invoice.constants";

const ITEMS_PER_PAGE = 5;

type NestedSection =
  | "billingAddress"
  | "shippingAddress"
  | "paymentInformation";

export const useInvoiceForm = (
  isOpen: boolean,
  onClose: () => void,
  onSubmit?: (data: any) => void
) => {
  const [formData, setFormData] = useState<Invoice>(DEFAULT_INVOICE_FORM);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [customerNameDisplay, setCustomerNameDisplay] = useState("");
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "terms" | "address">(
    "details"
  );
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const shippingEditedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      dateOfInvoice: prev.dateOfInvoice || today,
      dueDate: prev.dueDate || today,
    }));
    setPage(0);
  }, [isOpen]);

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
    if (!countryName) return "";

    const normalized = countryName.trim().toUpperCase();

    return (
      countries.find((c) => c.name === normalized)?.code ??
      countries.find((c) => normalized.includes(c.name))?.code ??
      ""
    );
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
        getCompanyById("COMP-00003"),
      ]);

      if (!customerRes || customerRes.status_code !== 200) return;

      const data = customerRes.data;
      const company = companyRes?.data;

      const countryLookupList = await getCountryList();

      const countryCode = getCountryCode(
        countryLookupList,
        data.billingCountry
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

        return {
          ...prev,
          destnCountryCd: countryCode,
          invoiceType: data.customerTaxCategory,
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

  const handleItemChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const isNum = ["quantity", "price", "discount"].includes(name);

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
      const maxPage = Math.max(0, Math.ceil(items.length / ITEMS_PER_PAGE) - 1);
      if (page > maxPage) setPage(maxPage);
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
    setFormData(DEFAULT_INVOICE_FORM);
    setCustomerDetails(null);
    setCustomerNameDisplay("");
    setActiveTab("details");
    shippingEditedRef.current = false;
    setPage(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ ...formData, subTotal, grandTotal, totalTax });
    handleReset();
    onClose();
  };

  const { subTotal, totalTax, grandTotal } = useMemo(() => {
    const sub = formData.items.reduce((sum, item) => {
      const taxAmount = parseFloat(item.vatRate || "0");
      return sum + item.quantity * item.price - item.discount + taxAmount;
    }, 0);

    const tax = formData.items.reduce(
      (sum, item) => sum + parseFloat(item.vatRate || "0"),
      0
    );

    return { subTotal: sub, totalTax: tax, grandTotal: sub };
  }, [formData.items]);

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
      isShippingOpen,
      setIsShippingOpen,
      sameAsBilling,
      itemCount: formData.items.length,
      isExport: formData.invoiceType === "export",
      isLocal: formData.invoiceType === "lpo",
    },
    actions: {
      handleInputChange,
      handleCustomerSelect,
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
