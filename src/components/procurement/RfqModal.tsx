import React, { useState, useRef } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface RfqTabsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupplierRow {
  supplier: string;
  contact: string;
  email: string;
  sendEmail: boolean;
}

interface ItemRow {
  itemCode: string;
  requiredDate: string;
  quantity: number;
  uom: string;
  warehouse: string;
}

const emptySupplier: SupplierRow = {
  supplier: "",
  contact: "",
  email: "",
  sendEmail: true,
};

const emptyItem: ItemRow = {
  itemCode: "",
  requiredDate: new Date().toISOString().split("T")[0],
  quantity: 0,
  uom: "",
  warehouse: "",
};

const RfqTabsModal: React.FC<RfqTabsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "details" | "emailTemplates" | "terms"
  >("details");

  // RFQ states
  const [rfqNumber, setRfqNumber] = useState("PUR-RFQ-");
  const [requestDate, setRequestDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [quoteDeadline, setQuoteDeadline] = useState("");
  const [status, setStatus] = useState("Draft");
  const [suppliers, setSuppliers] = useState<SupplierRow[]>([
    { ...emptySupplier },
  ]);
  const [items, setItems] = useState<ItemRow[]>([{ ...emptyItem }]);

  // Email template states
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("Quote Email");
  const [subject, setSubject] = useState("");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [sendAttachedFiles, setSendAttachedFiles] = useState(true);
  const [sendPrint, setSendPrint] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState("");

  interface PaymentRow {
    paymentTerm: string;
    description: string;
    dueDate: string;
    invoicePortion: number;
    paymentAmount: number;
  }

  const suppliersPerPage = 3;
  const [suppliersPage, setSuppliersPage] = useState(0);
  const paginatedSuppliers = suppliers.slice(
    suppliersPage * suppliersPerPage,
    (suppliersPage + 1) * suppliersPerPage
  );

  const itemsPerPage = 3;
  const [itemsPage, setItemsPage] = useState(0);
  const paginatedItems = items.slice(
    itemsPage * itemsPerPage,
    (itemsPage + 1) * itemsPerPage
  );

  // Payment rows
  const [paymentRows, setPaymentRows] = useState<PaymentRow[]>([
    {
      paymentTerm: "",
      description: "",
      dueDate: "",
      invoicePortion: 0,
      paymentAmount: 0,
    },
  ]);
  const paymentItemsPerPage = 4;
  const [paymentPage, setPaymentPage] = useState(0);
  const paginatedPaymentRows = paymentRows.slice(
    paymentPage * paymentItemsPerPage,
    (paymentPage + 1) * paymentItemsPerPage
  );

  const addPaymentRow = () => {
    setPaymentRows((prev) => {
      const newRows = [
        ...prev,
        {
          paymentTerm: "",
          description: "",
          dueDate: "",
          invoicePortion: 0,
          paymentAmount: 0,
        },
      ];
      setPaymentPage(Math.floor((newRows.length - 1) / paymentItemsPerPage));
      return newRows;
    });
  };

  const removePaymentRow = (idx: number) =>
    setPaymentRows((rows) =>
      rows.length === 1 ? rows : rows.filter((_, i) => i !== idx)
    );

  const handlePaymentRowChange = (
    idx: number,
    key: keyof PaymentRow,
    value: any
  ) => {
    setPaymentRows((rows) => {
      const updated = [...rows];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  if (!isOpen) return null;

  // Helper styles for tab buttons (matches invoice modal)
  const tabClass = (active: boolean) =>
    `px-6 py-3 font-medium text-sm capitalize transition-colors ${
      active
        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
        : "text-gray-600 hover:text-gray-900"
    }`;

  // Suppliers/items handlers
  const handleSupplier = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    field: keyof SupplierRow
  ) => {
    const copy = [...suppliers];
    if (field === "sendEmail") {
      copy[idx] = {
        ...copy[idx],
        [field]: (e.target as HTMLInputElement).checked,
      };
    } else {
      copy[idx] = { ...copy[idx], [field]: e.target.value };
    }
    setSuppliers(copy);
  };

  const addSupplier = () => {
    setSuppliers((prev) => {
      const newSuppliers = [...prev, { ...emptySupplier }];
      setSuppliersPage(
        Math.floor((newSuppliers.length - 1) / suppliersPerPage)
      );
      return newSuppliers;
    });
  };

  // Item handlers
  const handleItem = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    field: keyof ItemRow
  ) => {
    const copy = [...items];
    const isNum = field === "quantity";
    copy[idx] = {
      ...copy[idx],
      [field]: isNum ? Number(e.target.value) : e.target.value,
    };
    setItems(copy);
  };
  const addItem = () => {
    setItems([...items, { ...emptyItem }]);
    setItemsPage(Math.floor(items.length / itemsPerPage));
  };
  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  // Editor toolbar actions
  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertToken = (token: string) => {
    exec("insertHTML", token);
  };

  const getEditorHtml = () => editorRef.current?.innerHTML || "";

  const handleSaveTemplate = () => {
    console.log({
      name: templateName,
      type: templateType,
      subject,
      messageHtml: getEditorHtml(),
      sendAttachedFiles,
      sendPrint,
    });
    setPreviewOpen(false);
    alert("Template saved (console).");
  };

  const resetTemplate = () => {
    setTemplateName("");
    setTemplateType("Quote Email");
    setSubject("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setSendAttachedFiles(true);
    setSendPrint(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[90vw] h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b">
          <h2 className="text-2xl font-semibold text-blue-700">
            New Request For Quotation
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={tabClass(activeTab === "details")}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("emailTemplates")}
            className={tabClass(activeTab === "emailTemplates")}
          >
            Email Templates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={tabClass(activeTab === "terms")}
          >
            Terms & Conditions
          </button>
        </div>

        {/* Tab Content */}
        <section className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === "details" && (
            <div className="grid grid-cols-3 gap-6 max-h-screen overflow-auto p-4">
              {/* Main form (left, col-span-2) */}
              <div className="col-span-2">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <label className="flex flex-col gap-1 text-sm w-full">
                      <span className="font-medium text-gray-600">
                        RFQ Number
                      </span>
                      <input
                        type="text"
                        value={rfqNumber}
                        onChange={(e) => setRfqNumber(e.target.value)}
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm w-full">
                      <span className="font-medium text-gray-600">
                        Request Date
                      </span>
                      <input
                        type="date"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm w-full">
                      <span className="font-medium text-gray-600">
                        Quote Deadline
                      </span>
                      <input
                        type="date"
                        value={quoteDeadline}
                        onChange={(e) => setQuoteDeadline(e.target.value)}
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm w-full">
                      <span className="font-medium text-gray-600">Status</span>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option>Draft</option>
                        <option>Sent</option>
                        <option>Received</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="my-6 h-px bg-gray-600" />

                {/* SUPPLIERS TABLE */}
                <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                  Suppliers
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    Showing {suppliersPage * suppliersPerPage + 1}–
                    {Math.min(
                      (suppliersPage + 1) * suppliersPerPage,
                      suppliers.length
                    )}{" "}
                    of {suppliers.length}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSuppliersPage(Math.max(0, suppliersPage - 1))
                      }
                      disabled={suppliersPage === 0}
                      className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuppliersPage(suppliersPage + 1)}
                      disabled={
                        (suppliersPage + 1) * suppliersPerPage >=
                        suppliers.length
                      }
                      className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow mb-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="py-2 px-2 text-center">#</th>
                        <th className="py-2 px-2 text-left">Supplier</th>
                        <th className="py-2 px-2 text-left">Contact</th>
                        <th className="py-2 px-2 text-left">Email Id</th>
                        <th className="py-2 px-2 text-center">Send Email</th>
                        <th className="py-2 px-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedSuppliers.map((sup, idx) => {
                        const i = suppliersPage * suppliersPerPage + idx;
                        const removeSupplier = (idx: number) => {
                          if (suppliers.length === 1) return;
                          setSuppliers(suppliers.filter((_, i) => i !== idx));
                        };

                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-2 px-2 text-center">{i + 1}</td>
                            <td className="py-1 px-1">
                              <input
                                type="text"
                                value={sup.supplier}
                                onChange={(e) =>
                                  handleSupplier(e, i, "supplier")
                                }
                                className="w-full rounded border p-1 text-sm"
                              />
                            </td>
                            <td className="py-1 px-1">
                              <input
                                type="text"
                                value={sup.contact}
                                onChange={(e) =>
                                  handleSupplier(e, i, "contact")
                                }
                                className="w-full rounded border p-1 text-sm"
                              />
                            </td>
                            <td className="py-1 px-1">
                              <input
                                type="text"
                                value={sup.email}
                                onChange={(e) => handleSupplier(e, i, "email")}
                                className="w-full rounded border p-1 text-sm"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={sup.sendEmail}
                                onChange={(e) =>
                                  handleSupplier(e, i, "sendEmail")
                                }
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeSupplier(i)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between mt-3">
                  <button
                    type="button"
                    onClick={addSupplier}
                    className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4" /> Add Supplier
                  </button>
                </div>

                {/* ITEMS TABLE */}
                <h3 className="mb-4 text-lg font-semibold text-gray-700 underline">
                  Items
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    Showing {itemsPage * itemsPerPage + 1}–
                    {Math.min((itemsPage + 1) * itemsPerPage, items.length)} of{" "}
                    {items.length}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setItemsPage(Math.max(0, itemsPage - 1))}
                      disabled={itemsPage === 0}
                      className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemsPage(itemsPage + 1)}
                      disabled={(itemsPage + 1) * itemsPerPage >= items.length}
                      className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow mb-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="py-2 px-2 text-center">No.</th>
                        <th className="py-2 px-2 text-left">Item Code</th>
                        <th className="py-2 px-2 text-left">Required Date</th>
                        <th className="py-2 px-2 text-right">Quantity</th>
                        <th className="py-2 px-2 text-left">UOM</th>
                        <th className="py-2 px-2 text-left">Warehouse</th>
                        <th className="py-2 px-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paginatedItems.map((item, idx) => {
                        const i = itemsPage * itemsPerPage + idx;
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-2 px-2 text-center">{i + 1}</td>
                            <td className="py-1 px-1">
                              <input
                                type="text"
                                value={item.itemCode}
                                onChange={(e) => handleItem(e, i, "itemCode")}
                                className="w-full rounded border p-1 text-sm"
                              />
                            </td>
                            <td className="py-1 px-1">
                              <input
                                type="date"
                                value={item.requiredDate}
                                onChange={(e) =>
                                  handleItem(e, i, "requiredDate")
                                }
                                className="w-full rounded border p-1 text-sm"
                              />
                            </td>
                            <td className="py-1 px-1">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItem(e, i, "quantity")}
                                className="w-full rounded border p-1 text-right text-sm"
                              />
                            </td>
                            <td className="py-1 px-1">
                              <input
                                type="text"
                                value={item.uom}
                                onChange={(e) => handleItem(e, i, "uom")}
                                className="w-full rounded border p-1 text-sm"
                              />
                            </td>
                            <td className="py-1 px-1">
                              <input
                                type="text"
                                value={item.warehouse}
                                onChange={(e) => handleItem(e, i, "warehouse")}
                                className="w-full rounded border p-1 text-sm"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(i)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between mt-3">
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              </div>

              {/* Sidebar summary (col-span-1) */}
              <div className="col-span-1 sticky top-0 flex flex-col items-center gap-6 px-4 lg:px-6 h-fit">
                <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                  <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">
                    Supplier Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Total Suppliers
                      </span>
                      <span className="font-medium text-gray-800">
                        {suppliers.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Emails to Send
                      </span>
                      <span className="font-medium text-gray-800">
                        {suppliers.filter((s) => s.sendEmail).length}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-base font-semibold text-gray-700">
                        Status
                      </span>
                      <span className="text-base font-bold text-blue-600">
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-sm rounded-lg border border-gray-300 p-4 bg-white shadow">
                  <h3 className="mb-3 text-lg font-semibold text-gray-700 underline">
                    Items Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Total Items
                      </span>
                      <span className="font-medium text-gray-800">
                        {items.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Total Quantity
                      </span>
                      <span className="font-medium text-gray-800">
                        {items.reduce((s, it) => s + it.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-base font-semibold text-gray-700">
                        Quote Deadline
                      </span>
                      <span className="text-base font-bold text-blue-600">
                        {quoteDeadline || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Email Templates Tab */}
          {activeTab === "emailTemplates" && (
            <div className=" mx-auto bg-white rounded-lg p-6 shadow border border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Email Template
                </h3>
                <div className="text-sm text-gray-500">
                  Create professional email templates for supplier
                  communication.
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">Name</span>
                  <input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Template name"
                    className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">Type</span>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option>Quote Email</option>
                    <option>Order Confirmation</option>
                    <option>Reminder</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-gray-600">Subject</span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject line"
                    className="px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>
              </div>
              {/* Toolbar */}
              <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => exec("bold")}
                    title="Bold"
                    className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("italic")}
                    title="Italic"
                    className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => exec("underline")}
                    title="Underline"
                    className="px-2 py-1 rounded hover:bg-gray-100 border border-transparent"
                  >
                    U
                  </button>
                </div>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                {/* Token insert */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Insert token</label>
                  <select
                    onChange={(e) => {
                      if (!e.target.value) return;
                      insertToken(`{{${e.target.value}}}`);
                      e.target.selectedIndex = 0;
                    }}
                    defaultValue=""
                    className="px-2 py-1 border border-gray-200 rounded bg-white text-sm"
                  >
                    <option value="">-- select token --</option>
                    <option value="contact.first_name">
                      contact.first_name
                    </option>
                    <option value="supplier_name">supplier_name</option>
                    <option value="rfq_number">rfq_number</option>
                    <option value="portal_link">portal_link</option>
                  </select>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      if (!e.target.value) return;
                      insertToken(`<br/>${e.target.value}<br/>`);
                      e.target.selectedIndex = 0;
                    }}
                    defaultValue=""
                    className="px-2 py-1 border border-gray-200 rounded bg-white text-sm"
                  >
                    <option value="">Insert signature</option>
                    <option value="Regards,<br/>[Company Name]">
                      Standard
                    </option>
                    <option value="Best regards,<br/>[Procurement Team]">
                      Procurement
                    </option>
                    <option value="Sincerely,<br/>[Your Name]">
                      Sincerely
                    </option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="px-3 py-1 text-sm rounded border border-gray-200 hover:bg-gray-100"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <div className="border border-t-0 border-gray-200 rounded-b-md bg-white">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-[240px] p-4 prose max-w-none text-sm text-gray-800 outline-none"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  <p style={{ color: "#6b7280" }}>
                    Start typing your message here. Use tokens to personalize
                    (e.g., {"{{contact.first_name}}"}).
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sendAttachedFiles}
                    onChange={(e) => setSendAttachedFiles(e.target.checked)}
                  />
                  <span>Attach files</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={sendPrint}
                    onChange={(e) => setSendPrint(e.target.checked)}
                  />
                  <span>Attach PDF print</span>
                </label>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={resetTemplate}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                  >
                    Save Template
                  </button>
                </div>
              </div>
              {/* Preview modal */}
              {previewOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
                  <div className="w-full max-w-3xl bg-white rounded shadow-lg overflow-auto">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h4 className="font-semibold text-gray-800">
                        Email Preview
                      </h4>
                      <button
                        onClick={() => setPreviewOpen(false)}
                        className="px-2 py-1 rounded hover:bg-gray-100"
                      >
                        Close
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-600 mb-3">
                        {subject || (
                          <span className="text-gray-400">[No subject]</span>
                        )}
                      </div>
                      <div
                        className="prose max-w-none text-sm text-gray-800"
                        dangerouslySetInnerHTML={{ __html: getEditorHtml() }}
                      />
                      <div className="mt-6 text-xs text-gray-500">
                        Tokens shown as inserted values will be replaced when
                        sending.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* TERMS TAB */}
          {activeTab === "terms" && (
            <div className="space-y-8 mx-auto bg-white rounded-lg p-6 shadow border border-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Payment Terms
                </h3>
                <div className="mt-4">
                  <span className="font-medium text-gray-700">
                    Payment Schedule
                  </span>
                  <div className="overflow-x-auto rounded-lg border mt-2">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-2 py-2">No.</th>
                          <th className="px-2 py-2">Payment Term</th>
                          <th className="px-2 py-2">Description</th>
                          <th className="px-2 py-2">Due Date *</th>
                          <th className="px-2 py-2">Invoice Portion</th>
                          <th className="px-2 py-2">Payment Amount *</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {paginatedPaymentRows.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center p-6 text-gray-400"
                            >
                              No Data
                            </td>
                          </tr>
                        ) : (
                          paginatedPaymentRows.map((row, idx) => {
                            const i = paymentPage * paymentItemsPerPage + idx;
                            return (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-center">
                                  {i + 1}
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    className="w-full rounded border p-1 text-sm"
                                    name="paymentTerm"
                                    value={row.paymentTerm}
                                    onChange={(e) =>
                                      handlePaymentRowChange(
                                        i,
                                        "paymentTerm",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    className="w-full rounded border p-1 text-sm"
                                    name="description"
                                    value={row.description}
                                    onChange={(e) =>
                                      handlePaymentRowChange(
                                        i,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="date"
                                    className="w-full rounded border p-1 text-sm"
                                    name="dueDate"
                                    value={row.dueDate}
                                    onChange={(e) =>
                                      handlePaymentRowChange(
                                        i,
                                        "dueDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="number"
                                    className="w-full rounded border p-1 text-sm"
                                    name="invoicePortion"
                                    value={row.invoicePortion}
                                    onChange={(e) =>
                                      handlePaymentRowChange(
                                        i,
                                        "invoicePortion",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-1 py-1">
                                  <input
                                    type="number"
                                    className="w-full rounded border p-1 text-sm"
                                    name="paymentAmount"
                                    value={row.paymentAmount}
                                    onChange={(e) =>
                                      handlePaymentRowChange(
                                        i,
                                        "paymentAmount",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-1 py-1 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removePaymentRow(i)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    disabled={paymentRows.length === 1}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-600">
                      Showing{" "}
                      {paymentRows.length === 0
                        ? 0
                        : paymentPage * paymentItemsPerPage + 1}
                      –
                      {Math.min(
                        (paymentPage + 1) * paymentItemsPerPage,
                        paymentRows.length
                      )}{" "}
                      of {paymentRows.length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setPaymentPage(Math.max(0, paymentPage - 1))
                        }
                        disabled={paymentPage === 0}
                        className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Prev
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentPage(paymentPage + 1)}
                        disabled={
                          (paymentPage + 1) * paymentItemsPerPage >=
                          paymentRows.length
                        }
                        className="px-2 py-1 text-xs rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addPaymentRow}
                    className="flex items-center gap-1 rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200 mt-2"
                  >
                    <Plus className="w-4 h-4" /> Add Row
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    Terms and Conditions
                  </h3>
                </div>
                <div className="p-6">
                  {/* Rich Text Editor Toolbar */}
                  <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
                    <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                      <option>Normal</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                      <option>---</option>
                      <option>Arial</option>
                      <option>Times New Roman</option>
                    </select>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Bold"
                    >
                      <strong className="text-sm">B</strong>
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Italic"
                    >
                      <em className="text-sm">I</em>
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Underline"
                    >
                      <u className="text-sm">U</u>
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Strikethrough"
                    >
                      <s className="text-sm">S</s>
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Subscript"
                    >
                      T<sub>x</sub>
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Font Color"
                    >
                      A
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Background Color"
                    >
                      A̲
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Quote"
                    >
                      "
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Code"
                    >
                      {"</>"}
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Bullet Point"
                    >
                      •¶
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Link"
                    >
                      🔗
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Image"
                    >
                      🖼
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Bullet List"
                    >
                      ≡
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Numbered List"
                    >
                      ☰
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Checklist"
                    >
                      ☑
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Align Left"
                    >
                      ≡
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Align Center"
                    >
                      ≡
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Align Right"
                    >
                      ≡
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <select className="px-2 py-1 text-sm border border-gray-300 rounded bg-white">
                      <option>Table</option>
                    </select>
                  </div>

                  {/* Text Area */}
                  <textarea
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={12}
                    placeholder="Enter terms and conditions..."
                  />
                </div>
              </div>
            </div>
          )}
        </section>
        {/* Footer */}
        <footer className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
            >
              Reset
            </button>
            <button
              type="button"
              className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Save RFQ
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RfqTabsModal;
